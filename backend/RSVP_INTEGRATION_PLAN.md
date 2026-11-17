# Wedding Site × Zola: Integration Plan

**For:** Sahil & Sharanya, and any AI agent working on the site (Lovable for the frontend, Claude Code for setup and the API).
**Goal:** our own wedding site (built in Lovable, hosted free on GitHub Pages at our domain) that:
1. takes RSVPs **and contact details in one form**. RSVPs land in Zola's RSVP system and contact details land in Zola's guest list (contact collector), exactly as if guests used Zola's own pages. Everything is mirrored into a **Google Sheet** we own that stays in sync with Zola;
2. keeps everything else (stories, photos, video, schedule text) **built into the site itself**, so the RSVP flow is the only part that depends on the network;
3. collects **meal choices, emails and phone numbers** for day-of updates.

Everything in the stack is **free**. Only true SMS texting costs money (§7).

| File | What it is |
|---|---|
| **`APPS_SCRIPT_API.md`** | **API reference + setup + TypeScript client for the frontend. The main doc for Lovable.** |
| `apps-script/` | **The backend, self-contained:** `Code.gs` (the API), `appsscript.json`, `demo/index.html` (API console), `ZOLA_ENDPOINTS.md` (reverse-engineered Zola notes), `README.md` |

---

## 1. Status (2026-10-27)

| Item | State |
|---|---|
| Architecture | **Google Apps Script proxy.** Cloudflare Workers were tested and are **blocked by Zola** (HTTP 403 on every call). Google's servers are allowed (tested from a real Apps Script project). |
| API (`Code.gs`) | Built, **RSVP-only** (content endpoints removed). Checks against live Zola all passed: search, party, validation, errors, admin, sync, sheet mirroring, plus **live writes**: an RSVP, **contact details through Zola's contact collector**, and a **MAYBE** (Zola: attending + reason; API and sheet: MAYBE, rebuilt correctly from Zola alone with an empty sheet). Our own party now holds **test data**: Sahil = MAYBE "TEST: waiting on PTO approval"; contact 123 Test Street, sahil.zolatest@example.com, +1 617-555-0100. Replace it with real details. |
| Demo console | Built and tested in Chrome: every endpoint, including search → party (contact form, Yes/Maybe/No options) → build RSVP + contact body → submit, `/contact`, admin summary and sync. |
| Deployed to our Google account | **Yes.** Web app: `https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec`. Sheet: **Zola Proxy Backup Tracker** (https://docs.google.com/spreadsheets/d/13LdgB6AlZabAmGdMkCgekn4EKRfzO7x5Uj2-4m0Cz0Q/edit). Full test suite passed against it on 2026-10-27. **Re-paste `Code.gs` and deploy a new version** to pick up the RSVP-only cleanup (the live version still has the unused content endpoints, which is harmless). |
| Zola for 2027 | **In progress:** a whole-weekend event *"Sahil & Sharanya Mountain Top Wedding"* (Oct 7–11, 2027) has one custom question, "Unsure if you can come?…", which carries MAYBE reasons. Contact details go to the contact collector. Last year's events are removed. Formal per-event invites come later. |
| Lovable frontend | Not started on the integration. Handoff in §4. |

---

## 2. Architecture

```
 Guest's browser                       Google (free)                                  Zola
┌──────────────────────────┐ fetch() ┌──────────────────────────────┐   HTTPS  ┌──────────────────────┐
│ Our site                 │────────▶│ Apps Script web app (/exec)  │────────▶│ zola.com/web-api/...  │
│ Lovable → GitHub Pages   │◀────────│  /search /party /rsvp        │◀────────│ zola.com/wedding/...  │
│ our domain               │  JSON   │  /contact /admin             │          └──────────────────────┘
│                          │         │  • RSVP API + contact        │
│                          │         │    collector, one submit     │
│                          │         │  • gets Zola's CSRF token    │
│ stories, photos, video:  │         │  • writes + syncs the Sheet  │──────▶ Google Sheet "Zola Proxy Backup Tracker"
│ bundled in the site      │         │  • hourly sync trigger       │         Responses · Events · Contacts ·
└──────────────────────────┘         └──────────────────────────────┘         Households · History · Submissions ·
                                                                               Log · Directory
```

- **Why a proxy:** browsers can't call Zola from our domain. Zola sends no CORS headers and requires a CSRF token tied to zola.com cookies. A server can do both.
- **Why Apps Script:** it's the free host Zola accepts. It also writes the Sheet, so it's one service instead of two.
- **Endpoints** are selected with a `path` query parameter (`…/exec?path=search`, `…/exec?path=party/<id>`). Path-style URLs send anonymous visitors to Google sign-in. All responses are JSON, and requests are JSON bodies with no custom headers. Details in `APPS_SCRIPT_API.md` §2.
- **Live deployment:** `https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec`
- **Site content** (stories, photos, video) is copied into the Lovable app as static text and images, so it can't break with Zola. Export the photos once from Zola (or use the originals).

---

## 3. Who does what

| # | Step | Who | Details |
|---|---|---|---|
| M1 | Set up Zola for this year: events, guest list in parties, RSVP collection per event, meal options, custom questions, a **Test Guest** party | **Us (manual, Zola dashboard)** | §3.1 |
| M2 | ✅ Done: Google Sheet created, `Code.gs` pasted, `setup()` run, deployed as web app (re-paste + new version after code changes) | **Us (manual, ~10 min)** | `APPS_SCRIPT_API.md` §1 |
| M3 | Paste our guest list into the sheet's **Directory** tab | **Us (manual)** | `APPS_SCRIPT_API.md` §6 |
| M4 | Connect Lovable to GitHub, enable GitHub Pages, set up the custom domain + DNS | **Us (manual)** | §3.2 |
| M5 | Pick the day-of messaging channel and set it up | **Us (manual)** | §7 |
| A1 | ✅ Done 2026-10-27: deployed API verified (full test suite passed) | **Claude Code agent** | `APPS_SCRIPT_API.md` §8 |
| A2 | Build the RSVP flow in the Lovable app (content pages are static) | **Lovable agent** | §4, §5 |
| A3 | Add the GitHub Pages deploy workflow, `CNAME`, SPA routing fix | **Lovable or Claude Code agent** | §3.2 |
| A4 | End-to-end test with the Test Guest party | **Us + agent** | §8 |

**Rule:** anything needing a login, password, secret or dashboard is manual. Agents never receive our Google, Zola, GitHub or registrar passwords. The only secret agents see is the **admin key**, and only in Claude Code chat, never in the Lovable project or the repo.

### 3.1 Zola setup details (M1)
- Search only finds people on the Zola guest list, so **every guest must be in Zola**, grouped into parties (a party = one RSVP).
- **Staged RSVPs:** phase 1 is the whole-weekend event (headcount, visa/PTO notes, contact details). Later, turn its RSVP collection off, turn on the formal events, and invite guests per event. The API and site follow Zola's `collect_rsvps` setting, so this needs no code changes.
- Turn on RSVP collection for each event guests should answer. Events without it are shown as info only.
- **Meal options** per event: the site shows a required meal picker for attending guests automatically.
- **Contact details** go to Zola's **contact collector** (the guest list's email, phone and address, one per party), sent from the same RSVP form. Questions whose text mentions *email*, *WhatsApp/SMS*, *phone/mobile/cell* or *address* are **auto-answered** from that form and hidden from guests, so they appear in Zola's RSVP answers too. The current phone, WhatsApp/SMS, email and mailing-address questions can stay or be deleted; the guest-list contact fields don't depend on them.
- **Maybe yes / maybe no:** the site offers *Joyfully accepts* / *Hopes to attend* / *Unlikely to attend* / *Regretfully declines*. The two maybes take an optional reason. *Hopes to attend* (`MAYBE_YES`) is sent to Zola as **attending** and *Unlikely to attend* (`MAYBE_NO`) as **declined**; the reason is stored in the event's **"Unsure if you can come?…"** question as `"Sahil: reason"`. The API and sheet report those guests as **MAYBE_YES** / **MAYBE_NO**, and the sheet's **Summary** tab counts each type. Keep a question whose text contains *unsure*, *not sure* or *maybe* on any event that should offer it.
- **Seeing answers in Zola:** custom-question answers are under **Guest List → Track RSVPs**. The sheet's Responses tab (`status`, `maybe_reason`) and `/admin/sheet` (maybe count and reasons per event) are easier to read.
- **Other custom questions** (dietary needs, etc.) are shown to guests as normal.
- Zola's own contact collector link (`zola.com/addr/…`) keeps working alongside our site. Both write to the same guest list.
- Keep the Zola wedding website **published**: Zola's RSVP endpoints are tied to it. Guests never see Zola's pages; all links point to our site.

### 3.2 Hosting details (M4, A3)
- In Lovable: connect the project to GitHub (Lovable syncs code to a repo).
- GitHub Pages on a free account requires a **public** repo. That's fine, because the frontend contains no secrets.
- Workflow `.github/workflows/deploy.yml`: on push to `main`, run `npm ci && npm run build`, then `actions/upload-pages-artifact` (`dist/`) → `actions/deploy-pages`. Then go to Settings → Pages → Source: **GitHub Actions**.
- Custom domain: add `public/CNAME` with the domain, set the domain in Settings → Pages, add the DNS records GitHub shows, and tick **Enforce HTTPS**. Vite `base` stays `/`.
- **SPA routing:** GitHub Pages has no rewrites. Copy `dist/index.html` to `dist/404.html` in the build step, or use `HashRouter`.
- Set `VITE_WEDDING_API_URL` as a repo variable for the build, and also as the default in code so a missing variable doesn't break builds.

---

## 4. Handoff for the Lovable agent (paste this)

```text
Integrate our wedding API. Read APPS_SCRIPT_API.md (from the ZolaAPI folder) fully before coding.

1. Add src/lib/weddingApi.ts exactly as in APPS_SCRIPT_API.md §3 (API client + types).
   Config: VITE_WEDDING_API_URL = https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec
   (already the default inside weddingApi.ts).
2. Never add request headers to API calls (no Content-Type), never call zola.com/web-api directly,
   never use a CORS proxy service, and never put an admin key or other secret in the app.
3. Site content (stories, photos, video, schedule) is static in the app. Don't fetch it from the API.
4. Build the RSVP flow from RSVP_INTEGRATION_PLAN.md §5.
5. Show loading states for every call (search ~1–2 s, party ~2–5 s, submit ~5–7 s) and disable submit while sending. Make it mobile-first.
6. For testing, only submit RSVPs for the "Test Guest" party.
7. Never link guests to Zola's pages. If RSVP fails, show "please try again, or contact us" with our contact email.
```

| Value the agent needs | Source | Secret? |
|---|---|---|
| `VITE_WEDDING_API_URL` | `https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec` | No (it's public by design) |
| Contact email for "can't find your invitation?" | Us | No |
| Admin key | Printed by `setup()` | **Yes. Never give it to Lovable.** |

---

## 5. RSVP flow (frontend spec)

1. **Find invitation:** name input (≥3 chars, submit on button/enter) → `weddingApi.search(name)`.
   - 0 matches: "We couldn't find you. Try your name as it appears on the invitation," plus our contact email.
   - 1+ matches: list the `party` labels ("Sharanya & Sahil") and let the guest pick.
2. **Load party:** `weddingApi.party(group_uuid)`. Pre-fill existing answers; guests can come back and change them.
3. **Per event** (already sorted by date; show name, date/time in the event's `timezone`, venue, address, attire). For each guest invited to it, if `collect_rsvps`, show the event's `response_options` (their `label` + `hint`; never the raw values), pre-selected from the invitation's `status`. A maybe reveals an optional reason field (`reason_prompt`), pre-filled from `maybe_reason`. If attending or maybe yes and the event has `meal_options`, show a **required** meal picker. Events without `collect_rsvps` are shown as info only.
4. **Custom questions** for those events (`questions[]`), once per party. **Skip questions with a `contact_field`**, because step 5 answers them.
5. **Contact details, once per party** (→ Zola's contact collector): **email (required)**, **mobile (required)**, "Best way to reach you: WhatsApp / SMS" (`messaging`), and mailing address (optional: street, apt, city, state, postal code, country). Zola never returns saved details, so the form starts blank. If `party.contact.on_file` is set, say "We already have your details. Update them if anything changed." Optionally, per guest: their own mobile and a *"Text me day-of updates"* checkbox (`guests[].phone`, `smsOptIn`, sheet only). Plus a note to the couple.
6. **Submit** → `weddingApi.submitRsvp({ ..., contact })`. One call: RSVPs go to Zola's RSVP system and contact details go to Zola's guest list. Send only the events the guest answered.
   - `ok && status 200`: success screen summarizing their answers (from `extracted`).
   - `ok && status 202`: the same success screen (saved; the API retries the RSVP or contact part automatically).
   - `!ok`: show `error` plus "please try again, or contact us". Never lose their answers; keep the form filled.
7. **Success screen:** "Email me a copy" → `weddingApi.emailConfirmation(group_uuid, email)`.

---

## 6. Free and reliable: check

| Piece | Cost | Limits that matter | Notes |
|---|---|---|---|
| GitHub Pages | Free (public repo) | 1 GB site, ~100 GB/month bandwidth | Static CDN with free HTTPS |
| Domain | Already owned | — | Keep auto-renew on through the wedding |
| Google Apps Script | Free (personal account) | ~20k external fetches/day, 6 min per run, ~30 concurrent runs | Wedding traffic uses a tiny fraction. Calls take 0.5–3 s. |
| Google Sheet | Free | 10M cells | — |
| Zola | Free | Private endpoints | The weak link: they can change. Mitigated by the Sheet + Submissions retry. |
| Lovable | Free tier (limited daily credits) | — | Only used to build; the site doesn't run on Lovable |
| SMS | Not free | — | §7 |

Ruled out:
- **Cloudflare Workers:** blocked by Zola.
- **Airtable:** low free API limits.
- **Supabase:** free projects pause when idle.
- **Carrier email-to-text gateways:** being shut down.

---

## 7. Day-of updates: messaging options

There's **no free, reliable way to send mass SMS** in the US anymore. Carriers block unregistered bulk texting, AT&T and T-Mobile have ended free email-to-text gateways (Verizon's ends by March 2027), and GroupMe is winding down its SMS mode. The Sheet's **Contacts** tab holds the phone numbers and opt-ins, whichever channel we choose.

| Option | Cost | Guests need | Notes |
|---|---|---|---|
| **Zola Guest Messaging** | **Unknown: check the Zola dashboard** | — | Zola mentions texting guests a link via "Guest Messaging" (on its disposable-camera page). Pricing and limits are not public. Zola's documented bulk messaging is email (free). |
| **WhatsApp Community / announcement group** | Free | WhatsApp | Broadcast-only announcements; no reply-all noise |
| **iMessage/RCS group texts** from our phones | Free | Nothing | OK for small groups (≤ ~30). Mixed iPhone/Android issues. |
| **Email blast** (Gmail BCC or Zola guest email) | Free | Email | A reliable backup for every update |
| **WedTexts** (iOS app) | Free to start, in-app purchases | Nothing (real SMS) | Check the paid limits first |
| **Cordially Wed** | One-time fee (about $119 for up to 100 guests at last check) | Nothing (real SMS) | Dedicated number, replies in one inbox. Says it works with Zola sites. |
| **Twilio** (send from the Sheet with Apps Script) | About $1–2/month number + ~1¢/text + registration fees | Nothing (real SMS) | Requires **A2P 10DLC or toll-free verification (1–3 weeks)**. Fully automatable from the Contacts tab. |

**Recommendation:** first check Zola's Guest Messaging (it's already tied to our guest list). Otherwise use a WhatsApp announcement group plus email as the free option, or Cordially Wed / Twilio for guaranteed SMS, set up ≥2 months before the wedding.
*Next agent: verify current pricing and registration requirements before we commit to a paid option.*

---

## 8. Test checklist

1. **M1 done:** Test Guest party exists and this year's events are set up (with at least one meal option and the phone question, so those paths get exercised).
2. **M2 done:** run `setup()` again after every `Code.gs` update (it adds new tabs and columns: so far **Households**, Submissions `contact_status`, and Responses `status` / `maybe_reason`). The sheet that's written is the one the script is attached to, or `CONFIG.SPREADSHEET_ID`. Open `apps-script/demo/index.html`, paste the `/exec` URL + admin key, and click **Run all read-only calls**. Every card should be green.
3. Search "Test Guest" → **Use this party** → **Build RSVP body**. Set one guest to `MAYBE_YES` and another to `MAYBE_NO`, each with a reason, fill in a meal (if any) and the `contact` block, tick the confirm box, and send `/rsvp`. Check:
   - the Zola dashboard shows the RSVP;
   - the sheet's Responses, Contacts and Submissions tabs have the rows;
   - the phone number appears in the Zola custom question.
4. Change Test Guest's RSVP on **Zola's own RSVP page** → run `/admin/sync` in the demo. Responses should update, and History should show the change.
5. Lovable preview: full RSVP flow for Test Guest on a phone-sized screen.
6. Production (GitHub Pages + domain): repeat step 5.
7. Before invites: clear Test Guest's RSVP or delete the party. Paste the full guest list into Directory and run `/admin/sync`.
8. Weekly until the wedding: `/admin/sheet` → `failed_submissions` should be 0, and `last_sync` should be recent.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| Zola changes its private endpoints or page format | The Sheet keeps every submission and retries hourly. `/health` and the weekly check catch it. Fixes happen in `Code.gs` only, with no frontend change. |
| Using private endpoints likely breaks Zola's Terms of Service | Personal, low-volume use, and we don't get around any of Zola's blocks. We accept the risk, with fallbacks in place. |
| Zola starts blocking Google's servers | Same as above. Last resort: a home relay (an always-on computer at home + Cloudflare Tunnel), since Zola accepts our home connection. |
| Anyone with the API URL can search names and submit RSVPs | Same exposure as Zola's public RSVP page. Admin endpoints need the key. Inputs are validated against Zola's data. |
| Guest data in the Sheet | Share it only between us. The admin key stays in Script Properties. |
| Apps Script quotas | Far above wedding traffic. The sync is time-boxed and continues next hour. |
