# Wedding RSVP API (Google Apps Script ⇄ Zola): setup and integration guide

**Audience:** us (setup) and the frontend agent in Lovable (integration). Everything a frontend needs is in §2–§5.
**What it is:** a free Google Apps Script web app that sits between our static site and Zola. It forwards guest search, party lookup and RSVP submission to Zola's RSVP system, sends each party's contact details (email, phone, address) to Zola's **contact collector** (the guest list), and mirrors everything into a Google Sheet that stays in sync with Zola.
**Scope: RSVPs only.** Site content (stories, photos, video, schedule text) is built into the frontend itself, so the only network dependency guests hit is the RSVP flow.

```
Static site (Lovable → GitHub Pages)
        │  fetch()  (no custom headers)
        ▼
Apps Script web app  ──►  Zola (www.zola.com: RSVP API + contact collector)
   (Google's servers)  └►  Google Sheet (Responses, Events, Contacts, Households, History, Submissions, Log, Directory)
```

Why Apps Script: Zola blocks Cloudflare Workers (tested, HTTP 403) but accepts calls from Google's servers (tested). Browsers can't call Zola directly, because Zola sends no CORS headers and requires a CSRF token tied to zola.com cookies.

| File | Purpose |
|---|---|
| `apps-script/Code.gs` | The API. Paste into Apps Script. |
| `apps-script/appsscript.json` | Manifest (V8 runtime, web app settings). Only needed if using `clasp`. |
| `apps-script/demo/index.html` | API console (backend tool, not part of the site): a card per endpoint, editable requests, pretty raw and extracted responses. Defaults to our deployment. |
| `apps-script/ZOLA_ENDPOINTS.md` | Reverse-engineered Zola endpoint notes, for maintaining `Code.gs` |

---

## 1. Setup (manual, ~10 minutes, needs our Google account)

1. Create a Google Sheet (any name; ours is **Zola Proxy Backup Tracker**). **This is the sheet the API writes to.**
2. **In that sheet**, open **Extensions → Apps Script**. This creates a script attached to the sheet. Delete the sample code, paste all of `apps-script/Code.gs`, and save.
3. Select **`setup`** in the function dropdown, then **Run**. Approve the permission prompt: it needs access to the sheet, external URLs and triggers. `setup()`:
   - records which sheet to use and prints its name and URL in the Execution log ("Writing to: …");
   - creates the tabs: Responses, Events, Contacts, Households, Directory, Submissions, History, Log
   - generates an **admin key** and prints it in the Execution log. Keep it private; it's only for `/admin/*`.
   - installs an **hourly trigger** that runs `syncAll`.
4. **Deploy → New deployment →** type **Web app**. Set Execute as: **Me** and Who has access: **Anyone**, then click **Deploy**.
5. Copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`). This is the API base URL, `VITE_WEDDING_API_URL`. **Ours:** `https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec`
6. Open `apps-script/demo/index.html` in a browser (it defaults to our URL), enter the admin key, and click **Run all read-only calls**.

**Which sheet gets written:** the sheet the script is attached to. To use a different sheet (or a standalone script from script.google.com), paste that sheet's ID into `CONFIG.SPREADSHEET_ID` at the top of `Code.gs` and run `setup()` again. The ID is the part of its URL between `/d/` and `/edit`.

**Updating the code later:** paste the new `Code.gs`, run `setup()` again (it adds any new tabs or columns and keeps your data), then go to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. That keeps the same URL. Saving alone does *not* update the live API. If a tab's columns change, check that tab's header row still lines up with the existing rows.

Optional: in the **Directory** tab, paste guest names (one per row in column A, e.g. from Zola's guest list export). The hourly sync looks each name up, so their parties appear in the sheet as soon as they're invited, including RSVPs made outside our site (e.g. edits in Zola's dashboard). See §6.

---

## 2. How to call it

- **Base URL:** the `/exec` URL. Ours is `https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec`.
- **The endpoint goes in the `path` query parameter:** `${BASE}?path=search`, `${BASE}?path=party/<uuid>`, `${BASE}?path=admin/sheet&key=…`.
  Don't use path-style URLs (`${BASE}/party/<uuid>`). For anonymous visitors, Google redirects them to a sign-in page (HTTP 401/302); tested on our deployment. The docs below still write endpoints as `/party/{groupUuid}` for readability.
- **GET** endpoints take no body. **POST** endpoints take a JSON body.
- **Never set request headers.** In particular, no `Content-Type: application/json`. A plain `fetch(url, { method: "POST", body: JSON.stringify(data) })` sends the body as text, which keeps it a "simple" request. Apps Script can't answer CORS preflights, so any custom header breaks the call. The API still parses the body as JSON.
- **The sheet is a backup, never a blocker:** if it's missing or broken, every guest endpoint still works against Zola. Writes report `saved: false`, and reads report the problem in `meta.sheet.error`.
- **Responses are always JSON with HTTP 200** (Apps Script can't set status codes). Read the envelope:

```jsonc
// success
{ "ok": true,  "status": 200, "data": { /* raw Zola payload */ }, "extracted": { /* simplified, use this */ },
  "meta": { "method": "GET", "path": "/party/d264a76a-…", "ms": 412 } }
// failure
{ "ok": false, "status": 400, "error": "name must be 3–80 characters", "data": null, "meta": { … } }
```
`status` follows HTTP conventions: 400 bad input, 403 admin key, 404 not found, 405 wrong method, 502 Zola error, 500 unexpected.
- **Speed (measured on our deployment):** search ~1–2 s, party lookup ~2–5 s, RSVP submit ~5–7 s (it writes to Zola twice and to the sheet), and the first call after idle is slower. **Always show a loading state**, and disable the submit button while sending.

---

## 3. Frontend helper (copy into the Lovable app as `src/lib/weddingApi.ts`)

```ts
// Client for the Wedding API (Apps Script). See APPS_SCRIPT_API.md.
const BASE = (import.meta.env.VITE_WEDDING_API_URL ?? "https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec").replace(/\/+$/, "");

export type ApiResult<T> =
  | { ok: true; status: number; data: unknown; extracted: T; meta: Record<string, unknown> }
  | { ok: false; status: number; error: string; data: unknown; meta: Record<string, unknown> };

export class WeddingApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function call<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<ApiResult<T>> {
  // No headers on purpose: keeps the request "simple" so the browser skips the CORS preflight Apps Script can't handle.
  // The endpoint goes in ?path=: Apps Script sends anonymous visitors of /exec/<path> URLs to Google sign-in.
  const res = await fetch(`${BASE}?path=${encodeURIComponent(path)}`, method === "GET" ? {} : { method: "POST", body: JSON.stringify(body ?? {}) });
  if (!res.ok) throw new WeddingApiError(res.status, `HTTP ${res.status}`);
  return res.json();
}

async function extracted<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const r = await call<T>(method, path, body);
  if (!r.ok) throw new WeddingApiError(r.status, r.error);
  return r.extracted;
}

export const weddingApi = {
  search: (name: string) => extracted<SearchMatch[]>("POST", "search", { name }),
  party: (groupUuid: string) => extracted<Party>("GET", `party/${groupUuid}`),
  // Returns the full envelope: ok:true with status 202 means "saved, Zola will be retried". Treat it as success.
  submitRsvp: (rsvp: RsvpSubmission) => call<Party>("POST", "rsvp", rsvp),
  // Contact details only (no RSVP change), e.g. a "update your contact info" page. Same 200/202 handling as submitRsvp.
  submitContact: (groupUuid: string, contact: ContactDetails) => call<{ party: string; linked: boolean } | null>("POST", "contact", { groupUuid, contact }),
  emailConfirmation: (groupUuid: string, email: string) => extracted<{ sent: boolean }>("POST", "confirmation", { groupUuid, email }),
};

// ---- types (match `extracted` shapes in APPS_SCRIPT_API.md §4) ----
export type SearchMatch = { group_uuid: string; party: string; suggested: boolean; guests: { uuid: string; name: string; searched_for: boolean }[] };
export type RsvpType = "ATTENDING" | "DECLINED" | "NO_RESPONSE";           // Zola's raw values
export type Response = "ATTENDING" | "MAYBE_YES" | "MAYBE_NO" | "DECLINED"; // what guests choose
export type PartyEvent = {
  id: number; name: string; type: string; start_at: string; end_at: string; timezone: string; venue: string; address: string; attire: string;
  collect_rsvps: boolean; meal_options: { id: number; name: string }[];
  // The choices to show guests, in order. label = the choice, hint = a softer subline, status_label = how a saved
  // answer reads back ("Hoping to attend"). The maybes ask for an optional reason (asks_reason, reason_prompt).
  response_options: { value: Response; label: string; hint: string; status_label: string;
                      asks_reason?: boolean; requires_reason?: boolean; reason_prompt?: string }[];
  // contact_field set or maybe_reason true = answered automatically (contact form / maybe reason); hide these questions.
  questions: { id: number; text: string; contact_field: "email" | "phone" | "messaging" | "address" | null; maybe_reason: boolean }[];
};
export type ContactDetails = {
  email: string; phone: string;              // required by Zola
  messaging?: string;                        // e.g. "WhatsApp" or "SMS"
  address1?: string; address2?: string; city?: string; state?: string; postalCode?: string; country?: string; // country: 2 letters, default "US"
};
export type ContactForm = {
  linked: boolean; per: "party"; required: ("email" | "phone")[]; fields: string[];
  on_file: { email: boolean; phone: boolean; address: boolean; updated_at: string } | null;
  autofilled_questions: { question_id: number; event_id: number; field: string }[];
};
export type Party = {
  group_uuid: string; party: string; events: PartyEvent[];
  guests: { uuid: string; name: string; first_name: string; family_name: string;
            // status = what to show (includes the maybes); status_label = guest-facing wording for it;
            // rsvp = Zola's raw value (MAYBE_YES is ATTENDING in Zola, MAYBE_NO is DECLINED)
            invitations: { event_id: number; event_name: string; collect_rsvps: boolean; rsvp: RsvpType;
                           status: Response | "NO_RESPONSE"; status_label: string; maybe_reason: string | null;
                           meal_option_id: number | null; meal: string | null; rsvp_at: string | null }[] }[];
  answers: { question_id: number; answer: string }[];
  contact?: ContactForm; // present on GET /party
};
export type RsvpSubmission = {
  groupUuid: string;
  guests: { uuid: string; events: { eventId: number; response: Response; reason?: string; mealOptionId?: number | null }[];
            email?: string; phone?: string; smsOptIn?: boolean }[];
  answers?: { questionId: number; answer: string }[];
  note?: string;
  contact?: ContactDetails; // party-level contact → Zola's contact collector (guest list)
};
```

---

## 4. RSVP endpoints

### `POST /search` `{ "name": "Sahil Malhotra" }`
`name` must be 3–80 characters. Returns `[]` when there's no match.
```json
[ { "group_uuid": "d264a76a-…", "party": "Sharanya & Sahil", "suggested": false,
    "guests": [ { "uuid": "f83b…", "name": "Sharanya Gowda", "searched_for": false }, { "uuid": "14d7…", "name": "Sahil Malhotra", "searched_for": false } ] } ]
```
Multiple matches are possible (e.g. a common last name). Show the `party` labels and let the guest pick. Ignore `searched_for`, because Zola returns `false` even on exact matches.

### `POST /lookup` `{ "name": "Sahil Malhotra" }`
`/search` and `/party` in one round trip: `{ "matches": [ …same as /search… ], "party": { …same as /party… } | null }`. `party` is filled only when exactly one party matches; otherwise show `matches` and call `/party` for the one the guest picks. The guest site uses this.

### `GET /party/{groupUuid}`
```json
{ "group_uuid": "d264a76a-…", "party": "Sharanya & Sahil",
  "events": [ { "id": 5998027, "name": "Sahil & Sharanya Mountain Top Wedding", "type": "WEDDING",
                "start_at": "2027-10-07T09:00:00Z", "end_at": "2027-10-11T23:00:00Z", "timezone": "America/New_York",
                "venue": "Loon Mountain Resort", "address": "60 Loon Mountain Rd, Lincoln, NH, 03251", "attire": "…",
                "collect_rsvps": true, "meal_options": [],
                "response_options": [
                  { "value": "ATTENDING", "label": "Joyfully accepts", "hint": "I'll be there", "status_label": "Joyfully accepted" },
                  { "value": "MAYBE_YES", "label": "Hopes to attend", "hint": "Likely, but not yet confirmed", "status_label": "Hoping to attend",
                    "asks_reason": true, "requires_reason": false, "reason_prompt": "Is there anything your decision depends on? (visas, travel, time off, etc.)" },
                  { "value": "MAYBE_NO", "label": "Unlikely to attend", "hint": "Probably not, but not yet certain", "status_label": "Unlikely to attend",
                    "asks_reason": true, "requires_reason": false, "reason_prompt": "Is there anything your decision depends on? (visas, travel, time off, etc.)" },
                  { "value": "DECLINED", "label": "Regretfully declines", "hint": "I won't be able to make it", "status_label": "Regretfully declined" } ],
                "questions": [ { "id": 2048763, "text": "Unsure if you can come? Mark attending for now and tell us why…",
                                 "contact_field": null, "maybe_reason": true } ] } ],
  "guests": [ { "uuid": "f83b…", "name": "Sharanya Gowda", "first_name": "Sharanya", "family_name": "Gowda",
                "invitations": [ { "event_id": 5998027, "event_name": "Sahil & Sharanya Mountain Top Wedding", "collect_rsvps": true,
                                   "rsvp": "DECLINED", "status": "MAYBE_NO", "status_label": "Unlikely to attend", "maybe_reason": "Not sure yet",
                                   "meal_option_id": null, "meal": null, "rsvp_at": "2026-10-27T00:06:28.445Z" } ] },
              { "uuid": "14d7…", "name": "Sahil Malhotra", "first_name": "Sahil", "family_name": "Malhotra",
                "invitations": [ { "event_id": 5998027, "event_name": "Sahil & Sharanya Mountain Top Wedding", "collect_rsvps": true,
                                   "rsvp": "ATTENDING", "status": "MAYBE_YES", "status_label": "Hoping to attend", "maybe_reason": "Waiting on PTO approval",
                                   "meal_option_id": null, "meal": null, "rsvp_at": "…" } ] } ],
  "answers": [ { "question_id": 2048763, "answer": "Sharanya: Not sure yet; Sahil: Waiting on PTO approval" } ],
  "contact": { "linked": true, "per": "party", "required": ["email", "phone"],
               "fields": ["email", "phone", "messaging", "address1", "address2", "city", "state", "postalCode", "country"],
               "on_file": { "email": true, "phone": true, "address": true, "updated_at": "…" },
               "autofilled_questions": [] } }
```
- Events are sorted by `start_at`. Show times in the event's `timezone`.
- A guest can answer an event only if it's in their `invitations` **and** `collect_rsvps` is true. Show other invitations as information only.
- **Answer choices:** render `response_options` for each event, in order, using `label` (and `hint` as a subline). **Never show the raw values** (`MAYBE_YES` etc.) to guests: to display a saved answer use the invitation's `status_label`. Pre-select from each invitation's **`status`**, not `rsvp`: `status` includes `MAYBE_YES` / `MAYBE_NO` (with `maybe_reason`), while `rsvp` is Zola's raw value. The maybes are offered only when the event has an "unsure" custom question (text matching `CONFIG.MAYBE_QUESTION`: unsure / not sure / maybe), because that's where Zola stores the reason. Hide questions with `maybe_reason: true`.
- `meal_options` and `questions` are empty until set up in Zola. Answers are stored **per party** in Zola.
- **`contact`** is the party's contact form, backed by Zola's contact collector. The API looks the party up in **both** Zola systems: the RSVP search (forgiving full-name search) finds the party, and the contact collector (last name + first initial) is matched to it by party ID.
  - `linked: true` means the contact collector found the party. If it's `false`, saving contact details still works, using the RSVP guest list.
  - One email, phone and address **per party**, which is Zola's limit. Email and phone are **required** by Zola. The address is optional.
  - **Zola never returns saved contact details publicly**, so the form can't be pre-filled. `on_file` only says whether this party already submitted details through our site (it's `null` otherwise), so you can say "We have your details. Update them?"
  - Questions with a `contact_field` (e.g. "What is your phone number?") are **answered automatically from the contact form**. Hide them in the UI so guests aren't asked twice. Which questions count is set by `CONFIG.CONTACT_QUESTIONS` in `Code.gs` (text containing email, WhatsApp/SMS, phone/mobile/cell, or address).
- `contact` is only included when you ask for it: `?path=party/<uuid>&include=contact`. It costs extra Zola calls and a sheet read, so the guest site leaves it out.
- Calling this queues a refresh of the party's rows in the sheet (`meta.sheet: "queued"`); see §6a. The response never waits for the sheet.

### `POST /rsvp` (writes to Zola + sheet)
```jsonc
{
  "groupUuid": "d264a76a-…",
  "guests": [
    { "uuid": "f83b…",
      "events": [ { "eventId": 5998027, "response": "MAYBE_YES", "reason": "Waiting on visa appointment" } ],
      "email": "guest@example.com", "phone": "(617) 555-0100", "smsOptIn": true }      // optional, per guest, sheet only
  ],
  "answers": [ { "questionId": 987, "answer": "No nuts please" } ],                    // other custom questions
  "note": "Can't wait!",
  "contact": { "email": "family@example.com", "phone": "(617) 555-0100", "messaging": "WhatsApp",   // optional, per party → Zola
               "address1": "123 Main St", "address2": "Apt 4", "city": "Boston", "state": "MA", "postalCode": "02101", "country": "US" }
}
```
**One submit, two destinations:** `guests[].events` and `answers` go to Zola's RSVP system, and `contact` goes to Zola's contact collector (the party's email, phone and address in the guest list). The submission is recorded in the background queue before Zola is called and written to the sheet within a minute (§6a). The response waits for Zola only, never the sheet. `extracted` is the party as just saved.
- Send only what the guest chose. The API merges it into Zola's current data, so unmentioned guests, events and answers stay as they are.
- `response` is `ATTENDING`, `MAYBE_YES`, `MAYBE_NO` or `DECLINED` (the old `MAYBE` is still accepted and means `MAYBE_YES`). `mealOptionId` must be one of that event's `meal_options` (required in the UI for `ATTENDING` / `MAYBE_YES`, if options exist; it's dropped for the other two).
- **Maybes:** Zola has no "maybe", so **`MAYBE_YES` is sent to Zola as ATTENDING and `MAYBE_NO` as DECLINED**. `reason` is optional (max 500 chars; blank is stored as "Not sure yet") and is written into the event's "unsure" question as `"Sahil: reason; Sharanya: reason"`. Zola stays the source of truth: attending + a reason in that answer reads back as `MAYBE_YES`, declined + a reason as `MAYBE_NO`, both in the API and in the sheet. Switching a guest to `ATTENDING` or `DECLINED` removes their reason. Other guests' reasons are kept. Sending a maybe for an event with no "unsure" question returns 400.
- `contact` (optional): `email` and `phone` are required whenever `contact` is sent (Zola rejects contact updates without them). Phone accepts any format and is normalized (`(617) 555-0100` → `+16175550100`; international numbers need a leading `+`). An address needs at least `address1` and `city`. `country` is a 2-letter code (default `US`).
- `contact` also auto-answers the contact-type custom questions (see `contact_field` above), so they appear in Zola's RSVP answers too. The guest's own `answers` win if both are given.
- Per-guest `guests[].email`, `phone`, `smsOptIn` and `note` are optional and stored **in the sheet only** (Zola's limit is one contact per party). Use them if you want each person's own number for texting.
- To send only contact details (e.g. no events open yet), send `guests: [{ "uuid": "…", "events": [] }]` with `contact`, or use `POST /contact`.
- Validation errors return `status: 400` with a message: guest not in party, event not RSVP-able, bad meal, and so on.

| Result | Meaning | UI |
|---|---|---|
| `ok: true, status: 200`, `data.zola: "ok"`, `data.contact: "ok"` or `"skipped"` | Saved in Zola and the sheet | Success. `extracted` is the updated party. |
| `ok: true, status: 202`, `data.zola` or `data.contact` is `"error"` | That part failed in Zola; everything is saved in the sheet; the hourly sync retries it | **Show success** ("We've got your RSVP") |
| `ok: true, status: 202`, `data.saved: false` | In Zola, but the sheet backup failed (e.g. `setup()` not run). `data.message` says why. | **Show success**. Admins: fix the sheet; the next sync rebuilds Responses from Zola. |
| `ok: false` | Not saved: bad input (400), or Zola **and** the sheet both failed (502) | Show `error` and "please try again, or contact us". Guests aren't sent to Zola's own pages. |

### `POST /contact` (writes to Zola + sheet)
```json
{ "groupUuid": "d264a76a-…", "contact": { "email": "family@example.com", "phone": "(617) 555-0100", "messaging": "SMS",
                                         "address1": "123 Main St", "city": "Boston", "state": "MA", "postalCode": "02101", "country": "US" } }
```
Updates only the party's contact details in Zola's guest list, with the same rules as `rsvp.contact`. RSVPs aren't touched, so contact-type custom questions are **not** updated. Response: `data.contact` is `"ok"` (`status` 200) or `"error"` (`status` 202, saved and retried hourly). `extracted` is `{ party, linked }`.

### `POST /confirmation` `{ "groupUuid": "…", "email": "guest@example.com" }`
Zola emails the guest a copy of their RSVP. Offer it on the success screen.

---

## 5. Admin endpoints (not for the public site)

| Endpoint | Purpose |
|---|---|
| `GET /admin/sheet?key=ADMIN_KEY` | `totals` across events plus counts per event (attending, **maybe yes**, **maybe no**, declined, no response, responded, meals, maybe reasons), households with contact details, failed submissions and failed contact updates, unresolved directory names, last sync time, sheet URL |
| `POST /admin/sync` `{ "key": "ADMIN_KEY" }` | Runs the full sync now (§6) and returns a summary |
| `GET /health` | `{ zola: "ok" }` when Zola is reachable (not logged) |
| `GET /` | Lists every endpoint |

Never put the admin key in the Lovable app or the repo.

---

## 6. The sheet: always matching Zola

| Tab | Contents | Updated when |
|---|---|---|
| **Responses** | Current state: one row per guest × invited event: `status` (ATTENDING / **MAYBE_YES** / **MAYBE_NO** / DECLINED / NO_RESPONSE), `maybe_reason`, `rsvp` (Zola's raw value), meal, rsvp_at, contact info (the guest's own, else the party's) and party answers | Within a minute of every `/party` lookup and `/rsvp` (via the queue), and the hourly sync. The party's rows are **replaced** with Zola's latest data each time. |
| **Summary** | Live counters (formulas over Responses): invited, responded, yes, maybe yes, maybe no, no, awaiting reply. A row for all events, then one per event. Counts are guests × events. | Recalculates on its own; rebuilt by `setup()` |
| **Events** | Event details, meal options, questions | Same |
| **Contacts** | Optional per-guest email, phone, text opt-in and note (from our form only) | `/rsvp` |
| **Households** | Per-party contact details sent to Zola's contact collector: email, phone, messaging app, address, and `zola_status` (pending, submitted, failed) | `/rsvp` with `contact`, `/contact`, retries |
| **History** | Every change seen: invited, rsvp, meal, answers, uninvited. Includes changes guests made on Zola's own site. | Whenever a sync finds a difference |
| **Submissions** | Every `/rsvp` and `/contact` from our site with its payload, plus `status` (RSVP part) and `contact_status` (contact part): submitted, failed, submitted (retry), superseded, none | `/rsvp`, `/contact`, retries during sync |
| **Directory** | Names we paste in (column A). The sync resolves each to a party (`found` / `not found` / `ambiguous`). | Hourly sync |
| **Log** | Every API call: request, response and timing (admin key masked, last ~5,000 rows) | Every call except `/health` |

**Hourly sync (`syncAll`)**:
1. Resolves new Directory names.
2. Retries failed submissions, for the RSVP part and the contact part separately. A part is skipped (`superseded`) if the guest RSVP'd again, or the party sent newer contact details, or it already failed 5 times.
3. Re-reads every known party from Zola and rewrites its rows.

So the sheet matches Zola for every party it knows about, including edits made on Zola's own RSVP page, within an hour.

**Limit:** Zola's public API can't list the whole guest list. A party is "known" once someone looks it up through our site or its names are in **Directory**. For a complete mirror, paste the full guest list into Directory once (Zola dashboard → Guest List → export), and add new guests there when you add them in Zola.

---

## 6a. Background queue: guests never wait on the sheet

Guest requests (`/lookup`, `/party`, `/rsvp`, `/contact`) only talk to Zola. Everything for the sheet goes into a queue in **Script Properties** (fast, durable, and independent of the sheet lock): submissions, party refreshes and Log rows. `processQueue()` runs **every minute** (trigger installed by `setup()`) and writes them to the sheet under the lock, so the sheet trails Zola by about a minute.

- A submission is queued *before* Zola is called and updated after. If the request dies mid-send, the queue records it as failed after 2 minutes, and the hourly sync retries it (skipped as superseded if Zola did get it).
- If the queue can't be written (e.g. Script Properties full), the request writes the sheet itself, as before.
- Repeated lookups of one party collapse into one refresh. Log rows are best effort.
- Quota: the every-minute trigger counts toward Apps Script's daily trigger runtime (90 min/day on a personal account); an empty run takes well under a second.

## 7. Limits and reliability

- **Free:** Apps Script on a personal Google account. Relevant quotas are roughly 20,000 external fetches/day (each RSVP with contact uses ~6, each party lookup ~2, each sync ~1 per party), 6 minutes per run (the sync stops at 5 minutes and continues next hour), and ~30 simultaneous runs (extra requests wait).
- **Private Zola endpoints** can change without notice, and Zola could start blocking Google's servers the way it blocks Cloudflare. If so, `/health` fails, submissions still land in **Submissions** and retry hourly, and nothing a guest submits is lost. Check `/admin/sheet` weekly for `failed_submissions`.
- **Anyone with the URL can call the public endpoints.** Apps Script can't restrict callers by website. They can only do what Zola's own public RSVP and contact-collector pages allow: search names, submit RSVPs, and overwrite a party's contact details. Saved contact details are never returned. Admin endpoints need the key.

---

## 8. Testing

Open `apps-script/demo/index.html` in a browser (double-click it, or serve the folder with `python3 -m http.server`). It defaults to our deployment:
`https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec`

- **Admin key:** type it into the header field (it's remembered in that browser), or put it in `apps-script/demo/config.local.js` as `window.DEMO_CONFIG = { adminKey: "…" }`. That file is **git-ignored**; never commit the key.
- **Flow:** Search → **Use this party** (loads the party and fills the RSVP and contact cards with real IDs) → edit → tick the confirm box → **Send**. Each card shows the request, the raw response and the extracted fields.
- Write endpoints need the confirm box. Use the **Test Guest** party (or our own) for RSVP writes.

**Last full run against the deployment (2026-10-27): all checks passed.** That covers routing errors, search, party (options, contact link, sheet sync), RSVP validation, a live RSVP with MAYBE + contact, contact-only, confirmation email, and admin sheet/sync (correct and wrong key).
