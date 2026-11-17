# Zola guest RSVP API (reverse-engineered)

Captured 2026-10-24 from `zola.com/wedding/gowdamalhotra/rsvp` and Zola's front-end bundles.
These are private endpoints: no public docs, can change without notice.

- Base: `https://www.zola.com/web-api/`
- Wedding account UUID: `55835fd4-1f35-4fa8-a86e-49bf435e0437`
- Auth: **no login**. GETs need nothing. Writes (POST/PUT) need Zola's double-submit CSRF token: load any zola.com page (e.g. `/wedding/{slug}/rsvp`) to get the `CSRF-TOKEN` cookie, then send it back in an `x-csrf-token` header. Send **every** cookie that page set (e.g. `guid`) along with `CSRF-TOKEN`, because the token is tied to them. A self-made token, or the token without its sibling cookies, gets a 403. `Origin` isn't checked.
- CORS: **no `Access-Control-Allow-Origin`** on any endpoint, so browsers on another origin are blocked. Call through a server-side proxy.
- Server origins: **Cloudflare Workers get HTTP 403 on everything** (tested 2026-10-24). **Google Apps Script works** (tested 2026-10-26). Home/residential connections work.
- Custom questions come back as `rsvp_questions: [{ id, event_id, question }]` (the text is in `question`).
- Zola pages can't be iframed (`X-Frame-Options: SAMEORIGIN`).
- Rate limit: the only one found is client-side. After 5 searches that aren't acted on, the site sets an `rsvpSearchDisabled` cookie for 30 min. Server-side limits are unknown.

## Flow

### 1. Search for a guest
`POST v1/publicwedding/rsvp/guest/wedding-account/uuid/{weddingUuid}/search-groups`
```json
{ "guest_name": "Sahil Malhotra" }
```
Returns `[{ uuid, suggested, guests: [{ uuid, first_name, family_name, relationship_type, searched_for }] }]`, where `uuid` is the guest group (party). `searched_for` is `false` even on exact matches, so don't rely on it. A non-matching name returns `[]`.

### 2. Load the party
`GET v2/publicwedding/rsvp/guest-group/uuid/{groupUuid}/wedding-account/uuid/{weddingUuid}`
```text
events[]: id, name, type (WEDDING|RECEPTION|OTHER), collect_rsvps, start_at, end_at, timezone,
          venue_name, address_1, city, state_province, postal_code, country_code, attire,
          meal_options[] (id, name), rsvp_questions[]
guests[]: id, uuid, first_name, family_name, relationship_type, rsvp, wedding_account_id,
          event_invitations[]: id, event_id, rsvp_type (ATTENDING|DECLINED|NO_RESPONSE), rsvp_at, meal_option_id
rsvp_answers[]: rsvp_question_id, answer
guest_group_id, guest_group_uuid, wedding_account_id, wedding_account_uuid
```
Guest email and phone numbers are **not** exposed here.

### 3. Submit the RSVP
`POST v2/publicwedding/rsvp/wedding-account/uuid/{weddingUuid}`
```json
{
  "wedding_account_uuid": "...",
  "guest_group_uuid": "...",
  "guests": [ /* guests[] from step 2, with event_invitations[].rsvp_type and .meal_option_id edited */ ],
  "rsvp_answers": [ { "rsvp_question_id": 123, "answer": "..." } ]
}
```
Only events with `collect_rsvps: true` are shown to guests. The site then re-fetches step 2.

### 4. Optional: email the guest a copy
`POST v2/publicwedding/rsvp/confirmation`
```json
{ "guest_group_uuid": "...", "wedding_account_uuid": "...", "email": "guest@example.com", "subscribe": false }
```

### Other public endpoints seen
- `GET v1/publicwedding/slug/{slug}` returns the wedding info: names, date, city, banner and `nav_items[] {id, nav_title, slug, type}`. No CSRF needed.
- `POST v1/publicwedding/passcode` is used when the site is passcode-protected.

## Contact collector (guest-list contact details)

Zola's "request your address and info" page (`https://www.zola.com/addr/{hashId}`, ours is `qEKEX0D4N`) writes to the **guest list**, one email, phone and address **per party**. It's separate from the RSVP system, but uses the same party ID (`guest_group_uuid`). Same CSRF rules as RSVP writes. Verified 2026-10-26.

### Search
`POST v1/guestgroup/collect_address/search`
```json
{ "family_name": "Malhotra", "first_initial": "S", "limit": 0, "offset": 0, "wedding_account_uuid": "55835fd4-…" }
```
Returns `[{ first_name, family_name, guest_group_uuid, guests: [{ id, first_name, family_name, relationship_type }] }]`. The lookup is stricter than RSVP search (exact last name + first initial), and it can return other parties with the same last name. **No saved contact details are ever returned.**

### Update an existing party
`PUT v1/guestgroup/uuid/{groupUuid}/update_address`
```json
{ "wedding_account_uuid": "…", "guest_group_uuid": "…",
  "guests": [ { "source": "COLLECT_ADDRESS", "guest_id": 279197329, "id": 279197329, "first_name": "Sharanya", "family_name": "Gowda", "relationship_type": "PRIMARY" } ],
  "email_address": "family@example.com", "mobile_phone": "+16175550100",
  "address1": "123 Main St", "address2": "Apt 4", "city": "Boston", "state_province": "MA", "postal_code": "02101", "country_code": "US" }
```
→ `{"code":0,"status":"success"}`
- `email_address` and `mobile_phone` are **required** (missing or empty → HTTP 500). Phone formats `6175550100`, `+16175550100` and `+44 20 7946 0958` were all accepted.
- Address fields are optional.
- `guests[]` must carry `source: "COLLECT_ADDRESS"` and `guest_id` (without them → 500). Names are sent unchanged; Zola's page lets guests edit them, so changing them may rename guests.
- Zola's own page also sends `tier: "A"`. It's optional, and **we omit it** so a party's A/B-list tier isn't overwritten.

### Add someone not on the guest list
`POST v1/guestgroup/collect_address/new`: the same fields plus `hash_id`, `affiliation` (e.g. `"UNKNOWN"`), `address_1`/`address_2` (note the underscores), and `guests: [{ first_name, family_name, relationship_type: "PRIMARY", source: "COLLECT_ADDRESS" }]`. This creates a new guest group. **Not implemented** in `Code.gs` and not tested.

## Site content (stories, gallery, video, home page)

> **Not used by `Code.gs`** (the API is RSVP-only, and site content is static in the frontend). Kept for reference.

Zola has **no JSON endpoint** for page content (the `/_next/data/...` route 404s). Each public page is server-rendered and embeds its content in
`<script id="__NEXT_DATA__">` → `props.pageProps.pageData.<type>`. Fetch the HTML (plain GET, no cookies) and parse that tag.

| Page | URL | `pageData` key | Contents |
|---|---|---|---|
| Home | `/wedding/{slug}` | `home` | `intro_copy`, `homepage_sections[] {title, description}`, `images[] {type: HERO\|FOOTER, image_url, width, height}`, `video {host: VIMEO, url, external_video_id, caption}`, `events[]` (public events: name, start/end, timezone, note) |
| Our Stories | `/wedding/{slug}/wedding_party` | `wedding_party` | `title`, `intro_copy`, `wedding_party_members[] {name, custom_role (story title), description (story text), image_url}` |
| Gallery | `/wedding/{slug}/photo` | `photo` | `title`, `intro_copy`, `photos[] {id, image_id, image_url}` (74 today), `videos[]` |
| Join Us Virtually | `/wedding/{slug}/poi` | `poi` | `pois[] {title, description, url}` |

**Custom pages** (`type: CUSTOM`) are nested one level deeper: `pageData.custom_pages["custom-<id>"]` → `{ title, intro_copy, entities[] }`. **Unknown slugs** return a 307 redirect to the home page, not a 404.

Page slugs and types come from `nav_items` and can change if pages are added in Zola. Other page types exist in Zola's theme (travel, FAQ, schedule, registry), and their content key follows the same pattern.

**Images:** `https://images.zola.com/{uuid}` is a public CDN. It allows hotlinking from other domains, is cached for a year, and `?w=400` returned a smaller file (52 KB vs 123 KB). Some home images also have an `uploadcare_image_url`.
Text fields are plain text, not HTML. Preserve line breaks with `white-space: pre-line`.
