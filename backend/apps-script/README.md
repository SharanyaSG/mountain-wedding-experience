# apps-script: Wedding RSVP API backend

A Google Apps Script web app that proxies the wedding site to Zola for **RSVPs only** (guest search, party lookup, RSVP submit with Yes / Maybe / No, contact details via Zola's contact collector) and mirrors every RSVP and contact update into a Google Sheet.

- **Live:** https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec (endpoints go in `?path=`)
- **Sheet:** Zola Proxy Backup Tracker

It isn't built or deployed with the frontend: the code lives in Google Apps Script, and this folder is its source of truth.

| File | Purpose |
|---|---|
| `Code.gs` | The entire API. Paste into the Sheet's Apps Script editor. |
| `appsscript.json` | Manifest (V8 runtime, web app access). Only needed if deploying with `clasp`. |
| `demo/index.html` | API console (backend tool, not part of the site): defaults to the live URL; enter the admin key, call every endpoint |
| `demo/config.local.js` | Optional, **git-ignored**: `window.DEMO_CONFIG = { adminKey: "…" }` so the demo pre-fills the admin key |
| `ZOLA_ENDPOINTS.md` | Reverse-engineered Zola endpoints, CSRF rules and page-data format, for maintaining `Code.gs` |

**Setup, API reference and frontend client:** [`../APPS_SCRIPT_API.md`](../APPS_SCRIPT_API.md). **Overall plan:** [`../RSVP_INTEGRATION_PLAN.md`](../RSVP_INTEGRATION_PLAN.md).

## Deploying a change
1. Paste the updated `Code.gs` into Extensions → Apps Script in the "Zola Proxy Backup Tracker" sheet, save, and run `setup()` (adds any new tabs or columns; keeps data).
2. Go to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same. Saving alone does not update the live API.
3. Open `demo/index.html` and click **Run all read-only calls** to confirm.

## Config
- `CONFIG` at the top of `Code.gs`: `SPREADSHEET_ID` (blank = the attached sheet), Zola slug, wedding UUID, MAYBE question match and answer labels, contact-question matching, sync limits.
- **Script Properties** (set by `setup()`): `SPREADSHEET_ID`, `ADMIN_KEY` (secret; never commit it or put it in the frontend), `LAST_SYNC`.
