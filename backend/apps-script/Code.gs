/**
 * Wedding RSVP API: a Google Apps Script web app that proxies our static wedding site to Zola's RSVP system and
 * contact collector, and mirrors every RSVP and contact update into a Google Sheet. RSVPs only; site content
 * (stories, photos, …) lives in the frontend itself.
 *
 * Docs:  ../APPS_SCRIPT_API.md
 * Setup: paste into Extensions → Apps Script of the "Wedding RSVPs" sheet, run setup(), deploy as web app.
 *
 * Every response is JSON in one envelope:
 *   { ok, status, data, extracted, meta }      on success (data = raw Zola payload, extracted = simplified)
 *   { ok: false, status, error, data, meta }   on failure
 * Apps Script always answers HTTP 200, so callers must read `ok` / `status` from the body.
 */

const CONFIG = {
  // Which Google Sheet to write to. Leave "" to use the sheet this script is attached to (Extensions → Apps Script).
  // To use another sheet, paste its ID: the part of its URL between /d/ and /edit.
  SPREADSHEET_ID: "",
  SLUG: "gowdamalhotra",
  WEDDING_UUID: "55835fd4-1f35-4fa8-a86e-49bf435e0437",
  SESSION_CACHE_SECONDS: 21600, // Zola CSRF token + cookies reused up to 6 h (the cache maximum); a 403 refreshes them
  LOG_CELL_LIMIT: 45000,        // Sheets cells hold 50k chars
  LOG_MAX_ROWS: 5000,
  SYNC_PAUSE_MS: 250,           // gap between Zola calls during a full sync
  SYNC_TIME_BUDGET_MS: 300000,  // Apps Script kills runs at 6 min
  // Background queue (processQueue, every minute): guests never wait on the sheet.
  QUEUE_TIME_BUDGET_MS: 50000,  // one run stops after ~50 s so runs don't overlap the next minute's
  QUEUE_STALE_MS: 120000,       // a submission still "sending" after 2 min means its request died mid-send
  QUEUE_MAX_ATTEMPTS: 5,        // sheet-write attempts per queued submission before giving up (it's in Zola regardless)
  QUEUE_LOG_CHARS: 3000,        // request/response text kept per queued log row (Script Properties hold ~9 KB a value)
  // Zola RSVP custom questions that are auto-answered from the contact form (first match wins, so email
  // is tested before address). Guests' explicit answers always take precedence.
  CONTACT_QUESTIONS: [
    { field: "email", re: /e-?mail/i },
    { field: "messaging", re: /whats ?app|sms/i },
    { field: "phone", re: /phone|mobile|cell/i },
    { field: "address", re: /address/i },
  ],
  // "Maybe" support. Zola only has attending/declined, so the two maybes ride on those: MAYBE_YES is sent to Zola
  // as ATTENDING and MAYBE_NO as DECLINED. The reason is written into the event's "unsure" custom question as
  // "Sahil: reason; Sharanya: reason". Zola stays the source of truth: a guest is MAYBE_YES when Zola says
  // ATTENDING and that answer holds a reason for them, MAYBE_NO when Zola says DECLINED and it holds one.
  // The legacy value MAYBE is still accepted on input and treated as MAYBE_YES.
  MAYBE_QUESTION: /unsure|not sure|maybe/i,
  DEFAULT_MAYBE_REASON: "Not sure yet",  // stored when a guest picks a maybe without saying why
  // Guest-facing wording. `label` is the choice; `status_label` is how a saved answer reads back on the site.
  RESPONSE_OPTIONS: [
    { value: "ATTENDING", label: "Joyfully accepts", hint: "I'll be there", status_label: "Joyfully accepted" },
    { value: "MAYBE_YES", label: "Hopes to attend", hint: "Likely, but not yet confirmed", status_label: "Hoping to attend",
      asks_reason: true, requires_reason: false, reason_prompt: "Is there anything your decision depends on? (visas, travel, time off, etc.)" },
    { value: "MAYBE_NO", label: "Unlikely to attend", hint: "Probably not, but not yet certain", status_label: "Unlikely to attend",
      asks_reason: true, requires_reason: false, reason_prompt: "Is there anything your decision depends on? (visas, travel, time off, etc.)" },
    { value: "DECLINED", label: "Regretfully declines", hint: "I won't be able to make it", status_label: "Regretfully declined" },
  ],
  NO_RESPONSE_LABEL: "Awaiting reply",
};

const MAYBES = ["MAYBE_YES", "MAYBE_NO"];
const ZOLA_TYPE = { ATTENDING: "ATTENDING", MAYBE_YES: "ATTENDING", MAYBE_NO: "DECLINED", DECLINED: "DECLINED" };

const ZOLA = "https://www.zola.com";

const TABS = {
  Responses: ["group_uuid", "party", "guest_uuid", "first_name", "last_name", "event_id", "event_name", "event_start",
              "status", "maybe_reason", "rsvp", "meal", "meal_option_id", "rsvp_at", "email", "phone", "sms_opt_in", "answers", "note",
              "last_synced", "last_source"],
  Events: ["event_id", "name", "type", "start_at", "end_at", "timezone", "venue", "address", "attire", "collect_rsvps",
           "meal_options", "questions", "last_synced"],
  Contacts: ["guest_uuid", "group_uuid", "first_name", "last_name", "email", "phone", "sms_opt_in", "note", "updated_at"],
  Households: ["group_uuid", "party", "email", "phone", "messaging", "address1", "address2", "city", "state", "postal_code",
               "country", "zola_status", "updated_at"],
  Directory: ["name", "group_uuid", "status", "last_checked"],
  Submissions: ["timestamp", "group_uuid", "party", "status", "contact_status", "attempts", "last_error", "payload"],
  History: ["timestamp", "source", "group_uuid", "party", "guest", "event", "field", "old", "new"],
  Log: ["timestamp", "method", "path", "request", "ok", "status", "ms", "response"],
};

// ---------------------------------------------------------------------------
// HTTP entry points and routing
// ---------------------------------------------------------------------------

function doGet(e) { return handle_("GET", e); }
function doPost(e) { return handle_("POST", e); }

const ROUTES = [
  ["GET", /^$/, () => ok_(endpointList_())],
  ["GET", /^health$/, () => health_()],
  ["GET", /^party\/([0-9a-f-]{36})$/, (m, body, params) => party_(m[1], params)],
  ["POST", /^search$/, (m, body) => search_(body)],
  ["POST", /^lookup$/, (m, body) => lookup_(body)],
  ["POST", /^rsvp$/, (m, body) => rsvp_(body)],
  ["POST", /^contact$/, (m, body) => contact_(body)],
  ["POST", /^confirmation$/, (m, body) => confirmation_(body)],
  ["GET", /^admin\/sheet$/, (m, body, params) => adminSheet_(params)],
  ["POST", /^admin\/sync$/, (m, body) => adminSync_(body)],
];

function handle_(method, e) {
  const started = Date.now();
  const params = (e && e.parameter) || {};
  const path = String((e && e.pathInfo) || params.path || "").replace(/^\/+|\/+$/g, "");
  let body = {};
  let result;
  try {
    if (method === "POST" && e && e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (err) { throw httpError_(400, "Request body must be JSON"); }
    }
    result = route_(method, path, body, params);
  } catch (err) {
    result = fail_(err.status || 500, err.message || String(err));
  }
  result.meta = Object.assign({ method: method, path: "/" + path, ms: Date.now() - started }, result.meta || {});
  if (path !== "health") queueLog_(method, path, body, result); // written to the Log tab by processQueue
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function route_(method, path, body, params) {
  for (const [m, re, fn] of ROUTES) {
    const match = path.match(re);
    if (match && m === method) return fn(match, body, params);
  }
  const otherMethod = ROUTES.some(([m, re]) => m !== method && re.test(path));
  throw httpError_(otherMethod ? 405 : 404, otherMethod ? `Use ${method === "GET" ? "POST" : "GET"} for /${path}` : `No endpoint /${path}`);
}

function endpointList_() {
  return [
    { method: "GET", path: "/health", about: "Can the API reach Zola?" },
    { method: "POST", path: "/search", body: { name: "Sahil Malhotra" }, about: "Find a guest's party" },
    { method: "POST", path: "/lookup", body: { name: "Sahil Malhotra" }, about: "Search, plus the party itself when exactly one matches (one round trip)" },
    { method: "GET", path: "/party/{groupUuid}", about: "A party's invitation and current RSVPs; add &include=contact for the contact form. Queues a sheet refresh" },
    { method: "POST", path: "/rsvp", about: "Submit or update a party's RSVP and, optionally, its contact details (writes to Zola + sheet)" },
    { method: "POST", path: "/contact", about: "Update only a party's contact details in Zola's guest list (+ sheet)" },
    { method: "POST", path: "/confirmation", body: { groupUuid: "…", email: "guest@example.com" }, about: "Zola emails the guest a copy" },
    { method: "GET", path: "/admin/sheet?key=ADMIN_KEY", about: "Sheet summary: counts per event, failed submissions, last sync" },
    { method: "POST", path: "/admin/sync", body: { key: "ADMIN_KEY" }, about: "Re-sync every known party from Zola now" },
  ];
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

function health_() {
  const r = zolaGet_(`v1/publicwedding/slug/${CONFIG.SLUG}`);
  return r.code === 200 ? ok_({ zola: "ok" }) : fail_(502, `Zola returned HTTP ${r.code}`, { zola: r.code });
}

function search_(body) {
  const name = String(body.name || "").trim();
  if (name.length < 3 || name.length > 80) throw httpError_(400, "name must be 3–80 characters");
  const r = zolaPost_(`v1/publicwedding/rsvp/guest/wedding-account/uuid/${CONFIG.WEDDING_UUID}/search-groups`, { guest_name: name });
  if (r.code !== 200) return fail_(502, `Zola search returned HTTP ${r.code}`, r.json || r.text);
  const extracted = (r.json || []).map((g) => ({
    group_uuid: g.uuid,
    party: partyName_(g.guests),
    suggested: g.suggested,
    guests: g.guests.map((x) => ({ uuid: x.uuid, name: fullName_(x), searched_for: x.searched_for })),
  }));
  return ok_(r.json, extracted, { matches: extracted.length });
}

function party_(groupUuid, params) {
  const r = getParty_(groupUuid);
  if (r.code !== 200) return fail_(r.code === 404 ? 404 : 502, `Zola party lookup returned HTTP ${r.code}`, r.json || r.text);
  queueSync_(groupUuid); // the sheet refresh happens in the background (processQueue); the guest doesn't wait for it
  const extracted = extractParty_(r.json);
  // The contact form costs extra Zola calls and a sheet read, so only callers that show it ask for it.
  if (params && params.include === "contact") extracted.contact = contactForm_(r.json);
  return ok_(r.json, extracted, { sheet: "queued" });
}

/** Body: { name }. Search, plus the party itself when exactly one matches, so the guest makes one round trip, not two. */
function lookup_(body) {
  const found = search_(body);
  if (!found.ok) return found;
  const matches = found.extracted;
  let party = null;
  if (matches.length === 1) {
    const p = party_(matches[0].group_uuid, {});
    if (!p.ok) return p;
    party = p.extracted;
  }
  return ok_(null, { matches: matches, party: party }, { matches: matches.length });
}

/**
 * Body: { groupUuid, guests: [{ uuid, events: [{ eventId, response: ATTENDING|MAYBE_YES|MAYBE_NO|DECLINED, reason?, mealOptionId? }],
 *         email?, phone?, smsOptIn? }], answers?: [{ questionId, answer }], note?,
 *         contact?: { email, phone, messaging?, address1?, address2?, city?, state?, postalCode?, country? } }
 * Saves the submission to the sheet first, sends the RSVP to Zola's RSVP API and the contact details to Zola's
 * contact collector, then re-reads Zola so the sheet matches it. The sheet is a backup: if it's unavailable the
 * submission still goes to Zola and the response says saved: false.
 */
function rsvp_(body) {
  const current = getParty_(body.groupUuid);
  if (current.code !== 200) return fail_(current.code === 404 ? 404 : 502, `Zola party lookup returned HTTP ${current.code}`);
  const party = current.json;
  validateRsvp_(party, body);
  const contact = body.contact ? normalizeContact_(body.contact) : null;

  // Record the submission before talking to Zola. It goes in the queue (Script Properties: durable, and no sheet
  // lock), and processQueue writes it to the sheet within a minute. The guest never waits on the sheet.
  const job = { kind: "rsvp", at: Date.now(), groupUuid: party.guest_group_uuid, body: body, state: "sending" };
  const key = enqueueJob_(job);

  const payload = buildZolaPayload_(party, body);
  const sent = sendRsvp_(payload);
  const contactSent = contact ? sendContact_(party, contact) : null;
  const errors = [sent.ok ? "" : sent.error, contactSent && !contactSent.ok ? contactSent.error : ""].filter(Boolean).join(" | ");
  Object.assign(job, { state: "sent", zola: sent.ok ? "submitted" : "failed",
                       contactStatus: contact ? (contactSent.ok ? "submitted" : "failed") : "none", error: errors });
  const backup = finishJob_(key, job);

  const result = { zola: sent.ok ? "ok" : "error", contact: contact ? (contactSent.ok ? "ok" : "error") : "skipped", saved: backup.ok };
  const messages = [errors, backup.ok ? "" : `sheet: ${backup.error}`].filter(Boolean);
  if (messages.length) result.message = messages.join(" | ");
  if (!sent.ok) {
    // Nothing reached Zola: only a success for the guest if the backup has it (the hourly sync retries from there).
    return backup.ok
      ? { ok: true, status: 202, data: result, extracted: extractParty_(party), meta: { note: "Saved; will retry on next sync" } }
      : fail_(502, `Your RSVP couldn't be saved. ${result.message}`, result);
  }
  // The party as just saved, without a second Zola read (the queue re-reads Zola for the sheet).
  const saved = Object.assign({}, party, { guests: payload.guests, rsvp_answers: payload.rsvp_answers });
  const partial = (contact && !contactSent.ok) || !backup.ok;
  return { ok: true, status: partial ? 202 : 200, data: Object.assign(result, { zolaResponse: sent.json }),
           extracted: extractParty_(saved), meta: { sheet: backup.queued ? "queued" : backup.ok ? "written" : backup.error } };
}

/** Body: { groupUuid, contact: { email, phone, messaging?, address1?, … } }: contact details only, no RSVP change. */
function contact_(body) {
  const current = getParty_(body.groupUuid);
  if (current.code !== 200) return fail_(current.code === 404 ? 404 : 502, `Zola party lookup returned HTTP ${current.code}`);
  const party = current.json;
  if (!body.contact) throw httpError_(400, "contact is required");
  const contact = normalizeContact_(body.contact);
  const job = { kind: "contact", at: Date.now(), groupUuid: party.guest_group_uuid, body: body, state: "sending" };
  const key = enqueueJob_(job);
  const sent = sendContact_(party, contact);
  Object.assign(job, { state: "sent", zola: "none", contactStatus: sent.ok ? "submitted" : "failed", error: sent.ok ? "" : sent.error });
  const backup = finishJob_(key, job);
  const data = { contact: sent.ok ? "ok" : "error", saved: backup.ok };
  const messages = [sent.ok ? "" : sent.error, backup.ok ? "" : `sheet: ${backup.error}`].filter(Boolean);
  if (messages.length) data.message = messages.join(" | ");
  if (sent.ok) {
    return { ok: true, status: backup.ok ? 200 : 202, data: Object.assign(data, { zolaResponse: sent.json }),
             extracted: { party: partyName_(party.guests), linked: sent.linked }, meta: {} };
  }
  return backup.ok
    ? { ok: true, status: 202, data: data, extracted: null, meta: { note: "Saved; will retry on next sync" } }
    : fail_(502, `Your contact details couldn't be saved. ${data.message}`, data);
}

// Runs a sheet operation; a missing or broken sheet must never block a guest's RSVP from reaching Zola.
function trySheet_(fn) {
  try { return { ok: true, value: fn() }; } catch (err) { return { ok: false, error: String(err.message || err) }; }
}

function confirmation_(body) {
  const email = String(body.email || "").trim();
  if (!/^[0-9a-f-]{36}$/.test(String(body.groupUuid || ""))) throw httpError_(400, "groupUuid is required");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw httpError_(400, "A valid email is required");
  const r = zolaPost_("v2/publicwedding/rsvp/confirmation",
    { guest_group_uuid: body.groupUuid, wedding_account_uuid: CONFIG.WEDDING_UUID, email: email, subscribe: false });
  return r.code === 200 ? ok_(r.json, { sent: true }) : fail_(502, `Zola confirmation returned HTTP ${r.code}`, r.json || r.text);
}

function adminSheet_(params) {
  requireAdmin_(params.key);
  const responses = readRows_("Responses");
  const byEvent = {};
  const blank = () => ({ ATTENDING: 0, MAYBE_YES: 0, MAYBE_NO: 0, DECLINED: 0, NO_RESPONSE: 0, responded: 0 });
  const totals = blank();
  responses.forEach((r) => {
    const e = byEvent[r.event_name] = byEvent[r.event_name] || Object.assign(blank(), { meals: {}, maybe_reasons: [] });
    const status = normalizeResponse_(r.status || r.rsvp);
    [e, totals].forEach((t) => {
      t[status] = (t[status] || 0) + 1;
      if (status !== "NO_RESPONSE") t.responded++;
    });
    if (isMaybe_(status) && r.maybe_reason) {
      e.maybe_reasons.push(`${r.first_name} ${r.last_name} (${status === "MAYBE_YES" ? "maybe yes" : "maybe no"}): ${r.maybe_reason}`);
    }
    if ((status === "ATTENDING" || status === "MAYBE_YES") && r.meal) e.meals[r.meal] = (e.meals[r.meal] || 0) + 1;
  });
  const submissions = readRows_("Submissions");
  return ok_({
    parties: new Set(responses.map((r) => r.group_uuid)).size,
    guests: new Set(responses.map((r) => r.guest_uuid)).size,
    households_with_contact: readRows_("Households").length,
    totals: totals, // guest × event rows, across every event
    by_event: byEvent,
    failed_submissions: submissions.filter((s) => s.status === "failed").length,
    failed_contact_updates: submissions.filter((s) => s.contact_status === "failed").length,
    directory_unresolved: readRows_("Directory").filter((d) => d.name && !d.group_uuid).length,
    last_sync: PropertiesService.getScriptProperties().getProperty("LAST_SYNC") || null,
    sheet_url: spreadsheet_().getUrl(),
  });
}

function adminSync_(body) {
  requireAdmin_(body.key);
  return ok_(syncAll());
}

// ---------------------------------------------------------------------------
// Zola access
// ---------------------------------------------------------------------------

function zolaGet_(path) {
  return parseResponse_(UrlFetchApp.fetch(`${ZOLA}/web-api/${path}`, { muteHttpExceptions: true, headers: { Accept: "application/json" } }));
}

function getParty_(groupUuid) {
  if (!/^[0-9a-f-]{36}$/.test(String(groupUuid || ""))) throw httpError_(400, "groupUuid is required");
  return zolaGet_(`v2/publicwedding/rsvp/guest-group/uuid/${groupUuid}/wedding-account/uuid/${CONFIG.WEDDING_UUID}`);
}

// Zola writes need a Zola-issued CSRF token plus the cookies issued alongside it.
// They come from loading the public RSVP page; cached and refreshed once on a 403.
function zolaPost_(path, payload) { return zolaSend_("post", path, payload); }
function zolaPut_(path, payload) { return zolaSend_("put", path, payload); }

function zolaSend_(method, path, payload) {
  const send = (session) => parseResponse_(UrlFetchApp.fetch(`${ZOLA}/web-api/${path}`, {
    method: method, contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true,
    headers: { Accept: "application/json", "x-csrf-token": session.token, Cookie: session.cookie },
  }));
  let r = send(zolaSession_(false));
  if (r.code === 403) r = send(zolaSession_(true));
  return r;
}

function zolaSession_(fresh) {
  const cache = CacheService.getScriptCache();
  if (!fresh) {
    const hit = cache.get("zola_session");
    if (hit) return JSON.parse(hit);
  }
  const page = UrlFetchApp.fetch(`${ZOLA}/wedding/${CONFIG.SLUG}/rsvp`, { muteHttpExceptions: true });
  const cookies = [].concat(page.getAllHeaders()["Set-Cookie"] || []).map((c) => String(c).split(";")[0]);
  const token = cookies.find((c) => c.indexOf("CSRF-TOKEN=") === 0);
  if (!token) throw httpError_(502, `Could not get a Zola CSRF token (HTTP ${page.getResponseCode()})`);
  const session = { token: token.slice("CSRF-TOKEN=".length), cookie: cookies.join("; ") };
  cache.put("zola_session", JSON.stringify(session), CONFIG.SESSION_CACHE_SECONDS);
  return session;
}

function parseResponse_(r) {
  const text = r.getContentText();
  let json = null;
  try { json = JSON.parse(text); } catch (err) { /* not JSON */ }
  return { code: r.getResponseCode(), json: json, text: json ? null : text.slice(0, 500) };
}

// ---------------------------------------------------------------------------
// RSVP merge + validation
// ---------------------------------------------------------------------------

function validateRsvp_(party, body) {
  if (!Array.isArray(body.guests) || !body.guests.length) throw httpError_(400, "guests[] is required");
  const events = indexBy_(party.events, "id");
  body.guests.forEach((g) => {
    const guest = party.guests.find((x) => x.uuid === g.uuid);
    if (!guest) throw httpError_(400, `Guest ${g.uuid} is not in this party`);
    (g.events || []).forEach((e) => {
      const inv = guest.event_invitations.find((i) => i.event_id === Number(e.eventId));
      if (!inv) throw httpError_(400, `${guest.first_name} is not invited to event ${e.eventId}`);
      if (!ZOLA_TYPE[normalizeResponse_(e.response)]) throw httpError_(400, "response must be ATTENDING, MAYBE_YES, MAYBE_NO or DECLINED");
      const ev = events[inv.event_id];
      if (isMaybe_(e.response) && ev && !maybeQuestionFor_(ev)) throw httpError_(400, `${ev.name} doesn't offer a maybe answer`);
      if (ev && !ev.collect_rsvps) throw httpError_(400, `Event ${ev.name} is not collecting RSVPs`);
      if (e.mealOptionId != null && !(ev.meal_options || []).some((mo) => mo.id === Number(e.mealOptionId))) {
        throw httpError_(400, `Meal option ${e.mealOptionId} does not exist for ${ev.name}`);
      }
    });
  });
}

function buildZolaPayload_(party, body) {
  const byGuest = indexBy_(body.guests || [], "uuid");
  const guests = party.guests.map((g) => {
    const chosen = byGuest[g.uuid];
    if (!chosen) return g;
    const byEvent = indexBy_((chosen.events || []).map((e) => Object.assign({}, e, { eventId: Number(e.eventId) })), "eventId");
    return Object.assign({}, g, {
      event_invitations: g.event_invitations.map((inv) => {
        const c = byEvent[inv.event_id];
        if (!c) return inv;
        const meal = c.mealOptionId != null ? Number(c.mealOptionId) : inv.meal_option_id;
        const zolaType = ZOLA_TYPE[normalizeResponse_(c.response)]; // Zola has no "maybe": yes/no carries it
        return Object.assign({}, inv, { rsvp_type: zolaType, meal_option_id: zolaType === "ATTENDING" ? meal : null });
      }),
    });
  });

  const answers = (body.answers || []).map((a) => ({ rsvp_question_id: Number(a.questionId), answer: String(a.answer == null ? "" : a.answer) }));
  // Answer contact-type custom questions (phone, email, address, WhatsApp/SMS) from the contact form,
  // so Zola's RSVP answers carry them too. Per-guest phones are used when there's no party contact.
  const values = contactAnswerValues_(party, body);
  party.events.forEach((ev) => (ev.rsvp_questions || []).forEach((q) => {
    const field = contactFieldFor_(q);
    if (field && values[field] && !answers.some((a) => a.rsvp_question_id === q.id)) {
      answers.push({ rsvp_question_id: q.id, answer: values[field] });
    }
  }));
  // The "unsure" question carries every maybe guest's reason ("Sahil: visa; Sharanya: time off"). Start from what
  // Zola holds now, apply this submission, and rewrite it for each event the submission touches.
  party.events.forEach((ev) => {
    const q = maybeQuestionFor_(ev);
    const submitted = (body.guests || []).filter((g) => (g.events || []).some((e) => Number(e.eventId) === ev.id));
    if (!q || !submitted.length || answers.some((a) => a.rsvp_question_id === q.id)) return;
    const reasons = maybeReasons_(party, ev);
    submitted.forEach((g) => {
      const e = g.events.find((x) => Number(x.eventId) === ev.id);
      if (isMaybe_(e.response)) reasons[g.uuid] = String(e.reason || "").trim().slice(0, 500) || CONFIG.DEFAULT_MAYBE_REASON;
      else delete reasons[g.uuid];
    });
    answers.push({ rsvp_question_id: q.id, answer: formatMaybeReasons_(party, reasons) });
  });
  const touched = answers.map((a) => a.rsvp_question_id);
  const rsvpAnswers = (party.rsvp_answers || []).filter((a) => touched.indexOf(a.rsvp_question_id) === -1).concat(answers);

  return { wedding_account_uuid: CONFIG.WEDDING_UUID, guest_group_uuid: party.guest_group_uuid, guests: guests, rsvp_answers: rsvpAnswers };
}

function sendRsvp_(payload) {
  try {
    const r = zolaPost_(`v2/publicwedding/rsvp/wedding-account/uuid/${CONFIG.WEDDING_UUID}`, payload);
    if (r.code === 200) return { ok: true, json: r.json };
    return { ok: false, error: `Zola HTTP ${r.code}: ${JSON.stringify(r.json || r.text).slice(0, 300)}` };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
}

// ---------------------------------------------------------------------------
// Contact collector: Zola's guest-list contact details (one email, phone and address per party)
// ---------------------------------------------------------------------------

/**
 * Find the party in Zola's contact collector. Its search takes a last name + first initial, so try each
 * guest until one returns this party. Returns the collector's guest list (needed to save) or null.
 */
function contactLookup_(party) {
  const order = { PRIMARY: 0, PARTNER: 1, CHILD: 2 };
  const guests = party.guests.slice().sort((a, b) => (order[a.relationship_type] || 3) - (order[b.relationship_type] || 3));
  for (const g of guests) {
    if (!g.family_name || !g.first_name) continue;
    const r = zolaPost_("v1/guestgroup/collect_address/search", {
      family_name: g.family_name, first_initial: g.first_name.charAt(0), limit: 0, offset: 0, wedding_account_uuid: CONFIG.WEDDING_UUID,
    });
    const match = (r.json || []).find((x) => x.guest_group_uuid === party.guest_group_uuid);
    if (match) return match.guests;
  }
  return null;
}

function contactForm_(party) {
  let linked = false;
  try { linked = !!contactLookup_(party); } catch (err) { /* report as not linked */ }
  const households = trySheet_(() => readRows_("Households"));
  const onFile = households.ok ? households.value.find((h) => h.group_uuid === party.guest_group_uuid) : null;
  const autofill = [];
  party.events.forEach((ev) => (ev.rsvp_questions || []).forEach((q) => {
    const field = contactFieldFor_(q);
    if (field) autofill.push({ question_id: q.id, event_id: ev.id, field: field });
  }));
  return {
    linked: linked,
    per: "party",
    required: ["email", "phone"],
    fields: ["email", "phone", "messaging", "address1", "address2", "city", "state", "postalCode", "country"],
    // Zola never returns saved contact details publicly; this only says whether we've saved some before.
    on_file: onFile ? { email: !!onFile.email, phone: !!onFile.phone, address: !!onFile.address1, updated_at: onFile.updated_at } : null,
    autofilled_questions: autofill,
  };
}

function normalizeContact_(c) {
  const contact = {
    email: String(c.email || "").trim(),
    phone: normalizePhone_(c.phone),
    messaging: String(c.messaging || "").trim(),
    address1: String(c.address1 || "").trim(), address2: String(c.address2 || "").trim(),
    city: String(c.city || "").trim(), state: String(c.state || "").trim(),
    postalCode: String(c.postalCode || "").trim(), country: String(c.country || "US").trim().toUpperCase(),
  };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) throw httpError_(400, "contact.email must be a valid email (Zola requires it)");
  if (contact.phone.replace(/\D/g, "").length < 7) throw httpError_(400, "contact.phone is required (Zola requires it)");
  if (contact.address1 && !contact.city) throw httpError_(400, "contact.city is required with an address");
  if (!/^[A-Z]{2}$/.test(contact.country)) throw httpError_(400, "contact.country must be a 2-letter code, e.g. US");
  return contact;
}

// PUT guestgroup/uuid/{party}/update_address, the same call Zola's contact collector page makes.
// Email and phone are required by Zola; the address is sent only when given. `tier` is left out on purpose:
// Zola's own page always sends "A", which would overwrite the guest's A/B-list tier.
function sendContact_(party, contact) {
  try {
    const lookup = contactLookup_(party);
    const guests = (lookup || party.guests).map((g) => ({
      source: "COLLECT_ADDRESS", guest_id: g.id, id: g.id, first_name: g.first_name, family_name: g.family_name,
      relationship_type: g.relationship_type,
    }));
    const payload = {
      wedding_account_uuid: CONFIG.WEDDING_UUID, guest_group_uuid: party.guest_group_uuid, guests: guests,
      email_address: contact.email, mobile_phone: contact.phone,
    };
    if (contact.address1) {
      Object.assign(payload, { address1: contact.address1, address2: contact.address2, city: contact.city,
        state_province: contact.state, postal_code: contact.postalCode, country_code: contact.country });
    }
    const r = zolaPut_(`v1/guestgroup/uuid/${party.guest_group_uuid}/update_address`, payload);
    if (r.code === 200 && r.json && r.json.status === "success") return { ok: true, json: r.json, linked: !!lookup };
    return { ok: false, error: `Zola contact HTTP ${r.code}: ${JSON.stringify(r.json || r.text).slice(0, 300)}` };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
}

function contactFieldFor_(q) {
  const text = questionText_(q);
  const hit = CONFIG.CONTACT_QUESTIONS.find((c) => c.re.test(text));
  return hit ? hit.field : null;
}

function contactAnswerValues_(party, body) {
  const c = body.contact ? normalizeContact_(body.contact) : null;
  const guestPhones = (body.guests || []).filter((g) => g.phone).map((g) => {
    const guest = party.guests.find((x) => x.uuid === g.uuid);
    return `${guest ? guest.first_name : "Guest"}: ${normalizePhone_(g.phone)}`;
  });
  const guestEmails = (body.guests || []).filter((g) => g.email).map((g) => String(g.email).trim());
  return {
    email: c ? c.email : guestEmails.join(", "),
    phone: c ? c.phone : guestPhones.join(", "),
    messaging: c ? c.messaging : "",
    address: c && c.address1 ? [c.address1, c.address2, c.city, c.state, c.postalCode, c.country].filter(Boolean).join(", ") : "",
  };
}

function saveHousehold_(party, c, status) {
  const rows = indexBy_(readRows_("Households"), "group_uuid");
  rows[party.guest_group_uuid] = {
    group_uuid: party.guest_group_uuid, party: partyName_(party.guests), email: c.email, phone: c.phone, messaging: c.messaging,
    address1: c.address1, address2: c.address2, city: c.city, state: c.state, postal_code: c.postalCode, country: c.country,
    zola_status: status, updated_at: new Date(),
  };
  writeRows_("Households", Object.keys(rows).map((k) => rows[k]));
}

// ---------------------------------------------------------------------------
// Maybe yes / maybe no: stored in Zola as ATTENDING / DECLINED + a reason in the event's "unsure" question
// ---------------------------------------------------------------------------

function normalizeResponse_(r) {
  const v = String(r || "").trim().toUpperCase();
  return v === "MAYBE" ? "MAYBE_YES" : v; // legacy single "maybe"
}

function isMaybe_(r) { return MAYBES.indexOf(normalizeResponse_(r)) !== -1; }

function statusLabel_(status) {
  const o = CONFIG.RESPONSE_OPTIONS.find((x) => x.value === status);
  return o ? o.status_label : CONFIG.NO_RESPONSE_LABEL;
}

function maybeQuestionFor_(ev) {
  return (ev.rsvp_questions || []).find((q) => !contactFieldFor_(q) && CONFIG.MAYBE_QUESTION.test(questionText_(q))) || null;
}

// The label written before each guest's reason: first name, or full name when two guests share a first name.
function guestLabel_(party, g) {
  const same = party.guests.filter((x) => String(x.first_name).toLowerCase() === String(g.first_name).toLowerCase()).length;
  return same > 1 ? fullName_(g) : g.first_name;
}

/**
 * Parse the event's "unsure" answer into { guest_uuid: reason } for guests Zola has as ATTENDING or DECLINED.
 * "Sahil: visa; Sharanya: PTO" assigns per guest (attending → maybe yes, declined → maybe no). Text without a
 * guest label (e.g. typed on Zola's own page) applies only to attending guests with no reason of their own.
 */
function maybeReasons_(party, ev) {
  const q = maybeQuestionFor_(ev);
  const answer = q && (party.rsvp_answers || []).find((a) => a.rsvp_question_id === q.id);
  const text = answer ? String(answer.answer || "").trim() : "";
  if (!text) return {};
  const byLabel = {};
  party.guests.forEach((g) => { byLabel[guestLabel_(party, g).toLowerCase()] = g; });
  const own = {};
  const general = [];
  text.split(/;\s*(?=[^;:]{1,60}:\s)/).forEach((part) => {
    const m = part.match(/^([^:]{1,60}):\s*([\s\S]*)$/);
    const g = m && byLabel[m[1].trim().toLowerCase()];
    if (g) own[g.uuid] = m[2].trim();
    else if (part.trim()) general.push(part.trim());
  });
  const out = {};
  party.guests.forEach((g) => {
    const inv = g.event_invitations.find((i) => i.event_id === ev.id);
    if (!inv || (inv.rsvp_type !== "ATTENDING" && inv.rsvp_type !== "DECLINED")) return;
    const reason = own[g.uuid] || (inv.rsvp_type === "ATTENDING" ? general.join("; ") : "");
    if (reason) out[g.uuid] = reason;
  });
  return out;
}

function formatMaybeReasons_(party, reasons) {
  return party.guests.filter((g) => reasons[g.uuid]).map((g) => `${guestLabel_(party, g)}: ${reasons[g.uuid]}`).join("; ");
}

function maybeReasonsByEvent_(party) {
  const out = {};
  party.events.forEach((ev) => { out[ev.id] = maybeReasons_(party, ev); });
  return out;
}

function effectiveStatus_(inv, reason) {
  if (reason && inv.rsvp_type === "ATTENDING") return { status: "MAYBE_YES", reason: reason };
  if (reason && inv.rsvp_type === "DECLINED") return { status: "MAYBE_NO", reason: reason };
  return { status: inv.rsvp_type, reason: "" };
}

// ---------------------------------------------------------------------------
// Sheet mirror: Responses always reflect Zola's latest state for every known party
// ---------------------------------------------------------------------------

/** Replace this party's rows in Responses with Zola's current data, recording every change in History. */
function syncParty_(party, source) {
  return withLock_(() => {
    const now = new Date();
    const events = indexBy_(party.events, "id");
    const contacts = indexBy_(readRows_("Contacts"), "guest_uuid");
    const household = readRows_("Households").find((h) => h.group_uuid === party.guest_group_uuid) || {};
    const maybes = maybeReasonsByEvent_(party);
    const name = partyName_(party.guests);
    const answers = JSON.stringify((party.rsvp_answers || []).map((a) => ({ question_id: a.rsvp_question_id, answer: a.answer })));

    const fresh = [];
    party.guests.forEach((g) => g.event_invitations.forEach((inv) => {
      const ev = events[inv.event_id] || {};
      const meal = (ev.meal_options || []).find((m) => m.id === inv.meal_option_id);
      const c = contacts[g.uuid] || {};
      const st = effectiveStatus_(inv, (maybes[inv.event_id] || {})[g.uuid]);
      fresh.push({
        status: st.status, maybe_reason: st.reason,
        group_uuid: party.guest_group_uuid, party: name, guest_uuid: g.uuid, first_name: g.first_name || "",
        last_name: g.family_name || "", event_id: inv.event_id, event_name: ev.name || "", event_start: ev.start_at || "",
        rsvp: inv.rsvp_type, meal: meal ? meal.name : "", meal_option_id: inv.meal_option_id == null ? "" : inv.meal_option_id,
        // Per-guest contact details win; otherwise the party's contact-collector details.
        rsvp_at: inv.rsvp_at || "", email: c.email || household.email || "", phone: c.phone || household.phone || "",
        sms_opt_in: c.sms_opt_in === "" || c.sms_opt_in === undefined ? "" : c.sms_opt_in,
        answers: answers, note: c.note || "", last_synced: now, last_source: source,
      });
    }));

    const all = readRows_("Responses");
    const key = (r) => `${r.guest_uuid}|${r.event_id}`;
    const old = indexBy_(all.filter((r) => r.group_uuid === party.guest_group_uuid), key);
    const changes = [];
    fresh.forEach((r) => {
      const prev = old[key(r)];
      const guest = `${r.first_name} ${r.last_name}`.trim();
      if (!prev) {
        changes.push({ field: "invited", old: "", new: r.status, guest: guest, event: r.event_name });
      } else {
        ["status", "meal"].forEach((f) => {
          if (String(prev[f]) !== String(r[f])) changes.push({ field: f, old: prev[f], new: r[f], guest: guest, event: r.event_name });
        });
        if (String(prev.answers) !== String(r.answers)) changes.push({ field: "answers", old: prev.answers, new: r.answers, guest: guest, event: r.event_name });
        delete old[key(r)];
      }
    });
    Object.keys(old).forEach((k) => changes.push({ field: "uninvited", old: old[k].status || old[k].rsvp, new: "", guest: `${old[k].first_name} ${old[k].last_name}`.trim(), event: old[k].event_name }));

    // Party-level answer changes are recorded once, not once per guest x event.
    const seen = {};
    const history = changes.filter((c) => {
      if (c.field !== "answers") return true;
      if (seen.answers) return false;
      seen.answers = true; c.guest = ""; c.event = "";
      return true;
    });

    writeRows_("Responses", all.filter((r) => r.group_uuid !== party.guest_group_uuid).concat(fresh));
    history.forEach((c) => appendRow_("History", Object.assign({ timestamp: now, source: source, group_uuid: party.guest_group_uuid, party: name }, c)));
    upsertEvents_(party.events, now);
    return { rows: fresh.length, changes: history.length };
  });
}

function upsertEvents_(events, now) {
  const rows = indexBy_(readRows_("Events"), "event_id");
  events.forEach((e) => {
    rows[e.id] = {
      event_id: e.id, name: e.name, type: e.type, start_at: e.start_at || "", end_at: e.end_at || "", timezone: e.timezone || "",
      venue: e.venue_name || "", address: addressOf_(e), attire: e.attire || "", collect_rsvps: !!e.collect_rsvps,
      meal_options: JSON.stringify((e.meal_options || []).map((m) => ({ id: m.id, name: m.name }))),
      questions: JSON.stringify((e.rsvp_questions || []).map((q) => ({ id: q.id, text: questionText_(q) }))),
      last_synced: now,
    };
  });
  writeRows_("Events", Object.keys(rows).map((k) => rows[k]));
}

function saveContacts_(party, body) {
  const rows = indexBy_(readRows_("Contacts"), "guest_uuid");
  let changed = false;
  (body.guests || []).forEach((g) => {
    if (g.email === undefined && g.phone === undefined && g.smsOptIn === undefined && body.note === undefined) return;
    const guest = party.guests.find((x) => x.uuid === g.uuid) || {};
    const prev = rows[g.uuid] || {};
    rows[g.uuid] = {
      guest_uuid: g.uuid, group_uuid: party.guest_group_uuid, first_name: guest.first_name || "", last_name: guest.family_name || "",
      email: g.email !== undefined ? String(g.email).trim() : prev.email || "",
      phone: g.phone !== undefined ? normalizePhone_(g.phone) : prev.phone || "",
      sms_opt_in: g.smsOptIn !== undefined ? !!g.smsOptIn : prev.sms_opt_in === "" ? "" : prev.sms_opt_in,
      note: body.note !== undefined ? String(body.note) : prev.note || "",
      updated_at: new Date(),
    };
    changed = true;
  });
  if (changed) writeRows_("Contacts", Object.keys(rows).map((k) => rows[k]));
}

function setSubmissionStatus_(row, status, error, attempts, contactStatus) {
  withLock_(() => {
    const sh = sheet_("Submissions");
    const col = (name) => TABS.Submissions.indexOf(name) + 1;
    if (status !== undefined) sh.getRange(row, col("status")).setValue(status);
    if (contactStatus !== undefined) sh.getRange(row, col("contact_status")).setValue(contactStatus);
    sh.getRange(row, col("last_error")).setValue(error || "");
    sh.getRange(row, col("attempts")).setValue(attempts);
  });
}

/**
 * Full sync: resolve Directory names to parties, retry failed submissions, and re-read every known party
 * from Zola so the sheet matches it, including RSVPs guests made on Zola's own site.
 * Runs hourly via the trigger installed by setup(), or on demand via POST /admin/sync.
 */
function syncAll() {
  const started = Date.now();
  const summary = { directory_resolved: 0, retried: 0, parties_synced: 0, changes: 0, errors: [], partial: false };
  const outOfTime = () => Date.now() - started > CONFIG.SYNC_TIME_BUDGET_MS;

  // 1. Resolve Directory names (a guest list we paste in) to Zola party ids.
  const directory = readRows_("Directory");
  directory.forEach((d) => {
    if (!d.name || d.group_uuid || outOfTime()) return;
    try {
      const r = zolaPost_(`v1/publicwedding/rsvp/guest/wedding-account/uuid/${CONFIG.WEDDING_UUID}/search-groups`, { guest_name: String(d.name) });
      const groups = r.json || []; // Zola's searched_for flag is false even on exact matches, so keep every match
      d.group_uuid = groups.map((g) => g.uuid).join(",");
      d.status = r.code !== 200 ? `error HTTP ${r.code}` : groups.length === 1 ? "found" : groups.length ? `ambiguous (${groups.length} parties)` : "not found";
      if (groups.length) summary.directory_resolved++;
    } catch (err) {
      d.status = "error: " + err.message;
    }
    d.last_checked = new Date();
    Utilities.sleep(CONFIG.SYNC_PAUSE_MS);
  });
  withLock_(() => writeRows_("Directory", directory));

  // 2. Retry submissions that failed to reach Zola: the RSVP part unless the guest has RSVP'd again since,
  //    and the contact part unless the party has a newer contact submission.
  const subs = readRows_("Submissions");
  const latestContact = {};
  subs.forEach((s) => { if (s.contact_status !== "none") latestContact[s.group_uuid] = new Date(s.timestamp); });
  subs.forEach((s, i) => {
    const rsvpFailed = s.status === "failed";
    const contactFailed = s.contact_status === "failed";
    if ((!rsvpFailed && !contactFailed) || Number(s.attempts) >= 5 || outOfTime()) return;
    const row = i + 2;
    const attempts = Number(s.attempts) + 1;
    try {
      const r = getParty_(s.group_uuid);
      if (r.code !== 200) throw new Error(`party HTTP ${r.code}`);
      const body = JSON.parse(s.payload);
      let status, contactStatus;
      const errors = [];
      if (rsvpFailed) {
        const newer = r.json.guests.some((g) => g.event_invitations.some((inv) => inv.rsvp_at && new Date(inv.rsvp_at) > new Date(s.timestamp)));
        if (newer) status = "superseded";
        else {
          const sent = sendRsvp_(buildZolaPayload_(r.json, body));
          status = sent.ok ? "submitted (retry)" : "failed";
          if (!sent.ok) errors.push(sent.error);
        }
      }
      if (contactFailed) {
        if (latestContact[s.group_uuid] > new Date(s.timestamp)) contactStatus = "superseded";
        else {
          const sent = sendContact_(r.json, normalizeContact_(body.contact));
          contactStatus = sent.ok ? "submitted (retry)" : "failed";
          if (!sent.ok) errors.push(sent.error);
          if (sent.ok) withLock_(() => saveHousehold_(r.json, normalizeContact_(body.contact), "submitted"));
        }
      }
      setSubmissionStatus_(row, status, errors.join(" | "), attempts, contactStatus);
      summary.retried++;
    } catch (err) {
      setSubmissionStatus_(row, rsvpFailed ? "failed" : undefined, String(err.message || err), attempts, contactFailed ? "failed" : undefined);
    }
  });

  // 3. Re-read every known party.
  const known = {};
  readRows_("Responses").forEach((r) => { if (r.group_uuid) known[r.group_uuid] = true; });
  directory.forEach((d) => String(d.group_uuid || "").split(",").filter(String).forEach((u) => { known[u.trim()] = true; }));
  Object.keys(known).forEach((uuid) => {
    if (outOfTime()) { summary.partial = true; return; }
    try {
      const r = getParty_(uuid);
      if (r.code !== 200) throw new Error(`HTTP ${r.code}`);
      const res = syncParty_(r.json, "sync");
      summary.parties_synced++;
      summary.changes += res.changes;
    } catch (err) {
      summary.errors.push(`${uuid}: ${err.message || err}`);
    }
    Utilities.sleep(CONFIG.SYNC_PAUSE_MS);
  });

  summary.ms = Date.now() - started;
  PropertiesService.getScriptProperties().setProperty("LAST_SYNC", new Date().toISOString());
  return summary;
}

// ---------------------------------------------------------------------------
// Extractor: simplified party shape for the frontend
// ---------------------------------------------------------------------------

function extractParty_(p) {
  const events = indexBy_(p.events, "id");
  const maybes = maybeReasonsByEvent_(p);
  return {
    group_uuid: p.guest_group_uuid,
    party: partyName_(p.guests),
    events: p.events.slice().sort((a, b) => String(a.start_at).localeCompare(String(b.start_at))).map((e) => ({
      id: e.id, name: e.name, type: e.type, start_at: e.start_at, end_at: e.end_at, timezone: e.timezone,
      venue: e.venue_name || "", address: addressOf_(e), attire: e.attire || "", collect_rsvps: !!e.collect_rsvps,
      meal_options: (e.meal_options || []).map((m) => ({ id: m.id, name: m.name })),
      // The choices to show guests. The maybes are only offered when the event has an "unsure" question to carry the reason.
      response_options: CONFIG.RESPONSE_OPTIONS.filter((o) => MAYBES.indexOf(o.value) === -1 || maybeQuestionFor_(e)),
      // contact_field / maybe_reason: answered automatically from the contact form / the MAYBE reason (hide them in the UI).
      questions: (e.rsvp_questions || []).map((q) => ({ id: q.id, text: questionText_(q), contact_field: contactFieldFor_(q),
                                                         maybe_reason: !contactFieldFor_(q) && CONFIG.MAYBE_QUESTION.test(questionText_(q)) })),
    })),
    guests: p.guests.map((g) => ({
      uuid: g.uuid, name: fullName_(g), first_name: g.first_name, family_name: g.family_name,
      invitations: g.event_invitations.map((i) => {
        const ev = events[i.event_id] || {};
        const meal = (ev.meal_options || []).find((m) => m.id === i.meal_option_id);
        const st = effectiveStatus_(i, (maybes[i.event_id] || {})[g.uuid]);
        return { event_id: i.event_id, event_name: ev.name || "", collect_rsvps: !!ev.collect_rsvps, rsvp: i.rsvp_type,
                 status: st.status, status_label: statusLabel_(st.status), maybe_reason: st.reason || null,
                 meal_option_id: i.meal_option_id == null ? null : i.meal_option_id, meal: meal ? meal.name : null, rsvp_at: i.rsvp_at || null };
      }),
    })),
    answers: (p.rsvp_answers || []).map((a) => ({ question_id: a.rsvp_question_id, answer: a.answer })),
  };
}

// Zola's rsvp_questions items look like { id, event_id, question }.
function questionText_(q) {
  return String(q.question || q.text || q.title || q.label || q.name || q.prompt || "");
}

// ---------------------------------------------------------------------------
// One-time setup (run from the Apps Script editor)
// ---------------------------------------------------------------------------

function setup() {
  const props = PropertiesService.getScriptProperties();
  // The configured sheet, else the sheet this script is attached to, else the one an earlier setup() recorded.
  const saved = props.getProperty("SPREADSHEET_ID");
  const ss = CONFIG.SPREADSHEET_ID ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet() || (saved ? SpreadsheetApp.openById(saved) : null);
  if (!ss) throw new Error("No sheet found: paste the sheet's ID into CONFIG.SPREADSHEET_ID (the part of its URL between /d/ and /edit), or open this script from the sheet's Extensions → Apps Script");
  props.setProperty("SPREADSHEET_ID", ss.getId());
  if (!props.getProperty("ADMIN_KEY")) props.setProperty("ADMIN_KEY", Utilities.getUuid());

  Object.keys(TABS).forEach((name) => {
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.getRange(1, 1, 1, TABS[name].length).setValues([TABS[name]]).setFontWeight("bold");
    sh.setFrozenRows(1);
  });
  const blank = ss.getSheetByName("Sheet1");
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
  setupSummary_(ss);

  ScriptApp.getProjectTriggers().filter((t) => ["syncAll", "processQueue"].indexOf(t.getHandlerFunction()) !== -1)
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("syncAll").timeBased().everyHours(1).create();
  ScriptApp.newTrigger("processQueue").timeBased().everyMinutes(1).create();

  Logger.log("Setup done. Writing to: " + ss.getName() + " " + ss.getUrl());
  Logger.log("ADMIN_KEY (keep private, used for /admin endpoints): " + props.getProperty("ADMIN_KEY"));
}

/**
 * Summary tab: live formula counters over Responses (one row per guest × event), so they update on every
 * sync with no code running. Row 2 totals every event; one row per event below. Rebuilt by each setup().
 */
function setupSummary_(ss) {
  const sh = ss.getSheetByName("Summary") || ss.insertSheet("Summary", 0);
  const col = (h) => {
    let n = TABS.Responses.indexOf(h) + 1, s = "";
    while (n > 0) { s = String.fromCharCode(65 + (n - 1) % 26) + s; n = Math.floor((n - 1) / 26); }
    return `Responses!${s}2:${s}`;
  };
  const ev = col("event_name"), st = col("status"), id = col("guest_uuid");
  const statuses = ["ATTENDING", "MAYBE_YES", "MAYBE_NO", "DECLINED"];
  const perEvent = (status) => `=MAP(A3:A, LAMBDA(e, IF(e="",, COUNTIFS(${ev}, e, ${st}, "${status}"))))`;
  sh.clear();
  sh.getRange(1, 1, 1, 8).setValues([["Event", "Invited", "Responded", "Yes", "Maybe yes", "Maybe no", "No", "Awaiting reply"]])
    .setFontWeight("bold");
  // The label is a plain value: setFormulas would store it as the formula "=All events" (#ERROR!).
  sh.getRange(2, 1).setValue("All events");
  sh.getRange(2, 2, 1, 7).setFormulas([[
    `=COUNTIF(${id}, "?*")`, "=SUM(D2:G2)",
    ...statuses.map((s) => `=COUNTIF(${st}, "${s}")`), "=B2-C2",
  ]]);
  sh.getRange(2, 1, 1, 8).setFontWeight("bold");
  sh.getRange(3, 1, 1, 8).setFormulas([[
    `=IFERROR(SORT(UNIQUE(FILTER(${ev}, ${ev}<>""))), "")`,
    `=MAP(A3:A, LAMBDA(e, IF(e="",, COUNTIF(${ev}, e))))`,
    `=MAP(D3:D, E3:E, F3:F, G3:G, LAMBDA(a, b, c, d, IF(a="",, a+b+c+d)))`,
    ...statuses.map(perEvent),
    `=MAP(B3:B, C3:C, LAMBDA(i, r, IF(i="",, i-r)))`,
  ]]);
  sh.getRange(1, 10).setValue("Counts are guests × events, from the Responses tab (Zola is the source of truth). " +
    "Yes/Maybe yes count toward Zola's attending; No/Maybe no toward Zola's declined.").setFontStyle("italic");
  sh.setFrozenRows(2);
}

// ---------------------------------------------------------------------------
// Sheet + cache helpers
// ---------------------------------------------------------------------------

function spreadsheet_() {
  const id = CONFIG.SPREADSHEET_ID || PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw httpError_(500, "Run setup() first");
  return SpreadsheetApp.openById(id);
}

function sheet_(name) {
  const sh = spreadsheet_().getSheetByName(name);
  if (!sh) throw httpError_(500, `Missing tab ${name}: run setup()`);
  return sh;
}

function readRows_(name) {
  const values = sheet_(name).getDataRange().getValues();
  return values.slice(1).filter((r) => r.some((v) => v !== "")).map((r) => {
    const o = {};
    TABS[name].forEach((h, i) => { o[h] = r[i] === undefined ? "" : r[i]; });
    return o;
  });
}

function writeRows_(name, rows) {
  const sh = sheet_(name);
  const headers = TABS[name];
  const out = [headers].concat(rows.map((r) => headers.map((h) => cell_(h, r[h]))));
  sh.clearContents();
  sh.getRange(1, 1, out.length, headers.length).setValues(out);
}

function appendRow_(name, obj) {
  const sh = sheet_(name);
  sh.appendRow(TABS[name].map((h) => cell_(h, obj[h])));
  return sh.getLastRow();
}

// Phones are stored as text so Sheets keeps the leading "+".
function cell_(header, v) {
  if (v === undefined || v === null) return "";
  if ((header === "phone" || header === "postal_code") && v !== "") return "'" + String(v).replace(/^'/, "");
  return v;
}

function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

// ---------------------------------------------------------------------------
// Background queue: guests never wait on the sheet
// ---------------------------------------------------------------------------
// Guest requests only talk to Zola, then leave the sheet work here. Script Properties are durable, fast and
// independent of the sheet lock. processQueue() runs every minute (trigger installed by setup()) and does the
// sheet writes under the lock. Keys sort oldest first:
//   q_job_<time>_<id>  an RSVP or contact submission (written before Zola is called, updated after)
//   q_sync_<party>     refresh one party's rows (repeated lookups of a party collapse into one)
//   q_log_<time>_<id>  one Log tab row

function queuePut_(key, value) {
  try {
    const text = JSON.stringify(value);
    if (text.length > 8500) return false; // Script Properties hold ~9 KB per value
    PropertiesService.getScriptProperties().setProperty(key, text);
    return true;
  } catch (err) {
    return false;
  }
}

function queueId_() { return `${Date.now()}_${Utilities.getUuid().slice(0, 8)}`; }

function enqueueJob_(job) {
  const key = "q_job_" + queueId_();
  return queuePut_(key, job) ? key : null;
}

function queueSync_(groupUuid) { queuePut_("q_sync_" + groupUuid, { at: Date.now() }); }

/** Store the job's final state for processQueue. If the queue is unavailable, write the sheet now instead. */
function finishJob_(key, job) {
  if (key && queuePut_(key, job)) return { ok: true, queued: true };
  if (key) trySheet_(() => PropertiesService.getScriptProperties().deleteProperty(key));
  const written = trySheet_(() => processJob_(job));
  return written.ok ? { ok: true, queued: false } : written;
}

function queueLog_(method, path, body, result) {
  const safeBody = Object.assign({}, body);
  if (safeBody.key) safeBody.key = "***";
  const n = CONFIG.QUEUE_LOG_CHARS;
  queuePut_("q_log_" + queueId_(), [new Date().toISOString(), method, "/" + path, JSON.stringify(safeBody).slice(0, n),
    result.ok, result.status, result.meta && result.meta.ms, JSON.stringify(result).slice(0, n)]);
}

/** Write one submission to the sheet: Contacts / Households, a Submissions row, then the party's current state from Zola. */
function processJob_(job) {
  const r = getParty_(job.groupUuid);
  if (r.code !== 200) throw new Error(`Zola party lookup returned HTTP ${r.code}`);
  const party = r.json;
  const body = job.body;
  const contact = body.contact ? normalizeContact_(body.contact) : null;
  // Still "sending" means the request ended before Zola answered: record it as failed so the hourly sync retries it
  // (the retry is skipped as superseded if Zola did get it).
  const died = job.state === "sending";
  const status = job.kind === "contact" ? "none" : died ? "failed" : job.zola;
  const contactStatus = !contact ? "none" : died ? "failed" : job.contactStatus;
  withLock_(() => {
    if (job.kind === "rsvp") saveContacts_(party, body);
    if (contact) saveHousehold_(party, contact, contactStatus);
    appendRow_("Submissions", {
      timestamp: new Date(job.at), group_uuid: party.guest_group_uuid, party: partyName_(party.guests), status: status,
      contact_status: contactStatus, attempts: 1, last_error: died ? "Request ended before Zola answered" : job.error || "",
      payload: JSON.stringify(body),
    });
  });
  syncParty_(party, "site");
}

/** Every minute (trigger): write queued submissions, party refreshes and log rows to the sheet. */
function processQueue() {
  const cache = CacheService.getScriptCache();
  if (cache.get("queue_running")) return; // the previous run is still going
  cache.put("queue_running", "1", 300);
  const started = Date.now();
  const outOfTime = () => Date.now() - started > CONFIG.QUEUE_TIME_BUDGET_MS;
  const props = PropertiesService.getScriptProperties();
  try {
    const all = props.getProperties();
    const keys = Object.keys(all).filter((k) => k.indexOf("q_") === 0).sort();
    const done = {};

    // 1. Submissions, oldest first.
    keys.filter((k) => k.indexOf("q_job_") === 0).forEach((k) => {
      if (outOfTime()) return;
      let job;
      try { job = JSON.parse(all[k]); } catch (err) { props.deleteProperty(k); return; }
      if (job.state === "sending" && Date.now() - job.at < CONFIG.QUEUE_STALE_MS) return; // its request is still talking to Zola
      try {
        processJob_(job);
        props.deleteProperty(k);
        done["q_sync_" + job.groupUuid] = true; // just refreshed
      } catch (err) {
        job.attempts = (job.attempts || 0) + 1;
        job.lastError = String(err.message || err);
        if (job.attempts < CONFIG.QUEUE_MAX_ATTEMPTS) queuePut_(k, job);
        else { console.error("Dropping queued submission after repeated sheet errors: " + JSON.stringify(job)); props.deleteProperty(k); }
      }
    });

    // 2. Party refreshes queued by lookups.
    keys.filter((k) => k.indexOf("q_sync_") === 0).forEach((k) => {
      if (done[k]) { props.deleteProperty(k); return; }
      if (outOfTime()) return;
      try {
        const r = getParty_(k.slice("q_sync_".length));
        if (r.code === 200) syncParty_(r.json, "lookup");
        props.deleteProperty(k);
      } catch (err) {
        console.error(`Party refresh ${k} failed, retrying next run: ${err.message || err}`);
      }
    });

    // 3. Log rows, in one write. Logs are best effort: dropped if the Log tab can't be written.
    const logKeys = keys.filter((k) => k.indexOf("q_log_") === 0);
    if (logKeys.length) {
      try {
        const rows = logKeys.map((k) => { try { const r = JSON.parse(all[k]); r[0] = new Date(r[0]); return r; } catch (err) { return null; } })
          .filter(Boolean);
        const sh = sheet_("Log");
        if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, TABS.Log.length).setValues(rows);
        const extra = sh.getLastRow() - 1 - CONFIG.LOG_MAX_ROWS;
        if (extra > 0) sh.deleteRows(2, extra);
      } catch (err) {
        console.error("Log write failed: " + (err.message || err));
      }
      logKeys.forEach((k) => props.deleteProperty(k));
    }
  } finally {
    cache.remove("queue_running");
  }
}

function requireAdmin_(key) {
  const expected = PropertiesService.getScriptProperties().getProperty("ADMIN_KEY");
  if (!expected || key !== expected) throw httpError_(403, "Admin key required");
}

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

function ok_(data, extracted, meta) {
  return { ok: true, status: 200, data: data === undefined ? null : data, extracted: extracted === undefined ? null : extracted, meta: meta || {} };
}

function fail_(status, error, data) {
  return { ok: false, status: status, error: error, data: data === undefined ? null : data, meta: {} };
}

function httpError_(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function indexBy_(list, key) {
  const out = {};
  (list || []).forEach((x) => { out[typeof key === "function" ? key(x) : x[key]] = x; });
  return out;
}

function fullName_(g) { return [g.first_name, g.family_name].filter(Boolean).join(" ") || "Guest"; }

function partyName_(guests) {
  const names = (guests || []).map((g) => g.first_name || "Guest");
  return names.length <= 2 ? names.join(" & ") : names.slice(0, -1).join(", ") + " & " + names[names.length - 1];
}

function addressOf_(e) {
  return [e.address_1, e.city, e.state_province, e.postal_code].filter(Boolean).join(", ");
}


function normalizePhone_(p) {
  const s = String(p || "").trim();
  if (!s) return "";
  const digits = s.replace(/[^\d]/g, "");
  if (s.charAt(0) === "+") return "+" + digits;
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.charAt(0) === "1") return "+" + digits;
  return s;
}
