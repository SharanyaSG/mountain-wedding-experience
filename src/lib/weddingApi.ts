// Client for the Wedding API (Apps Script ⇄ Zola). See backend/APPS_SCRIPT_API.md.
const BASE = (
  import.meta.env["VITE_WEDDING_API_URL"] ??
  "https://script.google.com/macros/s/AKfycbxV4tAZtrQy0fiOy6VOdRRcZoPSWzEqmffyMirAL_62V7ieRwKs3t5wSrabEaWNj2u5/exec"
).replace(/\/+$/, "");

export type ApiResult<T> =
  | { ok: true; status: number; data: unknown; extracted: T; meta: Record<string, unknown> }
  | { ok: false; status: number; error: string; data: unknown; meta: Record<string, unknown> };

export class WeddingApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function call<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<ApiResult<T>> {
  // No headers on purpose: keeps the request "simple" so the browser skips the CORS preflight Apps Script can't handle.
  // The endpoint goes in ?path=: Apps Script sends anonymous visitors of /exec/<path> URLs to Google sign-in.
  const res = await fetch(
    `${BASE}?path=${encodeURIComponent(path)}`,
    method === "GET" ? {} : { method: "POST", body: JSON.stringify(body ?? {}) },
  );
  if (!res.ok) throw new WeddingApiError(res.status, `HTTP ${res.status}`);
  return res.json();
}

async function extracted<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const r = await call<T>(method, path, body);
  if (!r.ok) throw new WeddingApiError(r.status, r.error);
  return r.extracted;
}

type Lookup = { matches: SearchMatch[]; party: Party | null };

export const weddingApi = {
  // Search plus, when exactly one party matches, that party: one round trip instead of two.
  lookup: async (name: string): Promise<Lookup> => {
    try {
      return await extracted<Lookup>("POST", "lookup", { name });
    } catch (err) {
      // A backend deployed before /lookup existed: fall back to search, then party.
      if (!(err instanceof WeddingApiError && err.status === 404)) throw err;
      const matches = await extracted<SearchMatch[]>("POST", "search", { name });
      const only = matches.length === 1 ? matches[0]! : null;
      return { matches, party: only ? await weddingApi.party(only.group_uuid) : null };
    }
  },
  party: (groupUuid: string) => extracted<Party>("GET", `party/${groupUuid}`),
  // Returns the full envelope: ok:true with status 202 means "saved, Zola will be retried". Treat it as success.
  submitRsvp: (rsvp: RsvpSubmission) => call<Party>("POST", "rsvp", rsvp),
};

// ---- types (match `extracted` shapes in backend/APPS_SCRIPT_API.md §4) ----
export type SearchMatch = {
  group_uuid: string;
  party: string;
  suggested: boolean;
  guests: { uuid: string; name: string; searched_for: boolean }[];
};
export type RsvpType = "ATTENDING" | "DECLINED" | "NO_RESPONSE";
export type RsvpResponse = "ATTENDING" | "MAYBE_YES" | "MAYBE_NO" | "DECLINED";
export type ResponseOption = {
  value: RsvpResponse;
  label: string;
  hint: string;
  status_label: string;
  asks_reason?: boolean;
  requires_reason?: boolean;
  reason_prompt?: string;
};
export type PartyEvent = {
  id: number;
  name: string;
  type: string;
  start_at: string;
  end_at: string;
  timezone: string;
  venue: string;
  address: string;
  attire: string;
  collect_rsvps: boolean;
  meal_options: { id: number; name: string }[];
  response_options: ResponseOption[];
  questions: { id: number; text: string; contact_field: string | null; maybe_reason: boolean }[];
};
export type Invitation = {
  event_id: number;
  event_name: string;
  collect_rsvps: boolean;
  rsvp: RsvpType;
  status: RsvpResponse | "NO_RESPONSE";
  status_label: string;
  maybe_reason: string | null;
  meal_option_id: number | null;
  meal: string | null;
  rsvp_at: string | null;
};
export type PartyGuest = {
  uuid: string;
  name: string;
  first_name: string;
  family_name: string;
  invitations: Invitation[];
};
export type Party = {
  group_uuid: string;
  party: string;
  events: PartyEvent[];
  guests: PartyGuest[];
};
export type RsvpSubmission = {
  groupUuid: string;
  guests: {
    uuid: string;
    events: { eventId: number; response: RsvpResponse; reason?: string }[];
  }[];
  note?: string;
};
