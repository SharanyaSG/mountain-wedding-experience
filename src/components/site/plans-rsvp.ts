import type { Party, PartyEvent, PartyGuest, RsvpResponse, RsvpSubmission } from "@/lib/weddingApi";

/** One guest's answer for one event, keyed by `${guestUuid}:${eventId}`. */
export type Choice = { response: RsvpResponse | null; reason: string };
export type Choices = Record<string, Choice>;

export const REASON_MAX = 500;
const PLACEHOLDER_REASON = "Not sure yet";
const DECLINE_PROMPT = "We’ll miss you! Would you like to tell us why?";

export const choiceKey = (guestUuid: string, eventId: number) => `${guestUuid}:${eventId}`;

/** Events this party can answer, each with the guests invited to it. Other events are not shown. */
export function rsvpEvents(party: Party): { event: PartyEvent; guests: PartyGuest[] }[] {
  return party.events
    .filter((event) => event.collect_rsvps)
    .map((event) => ({
      event,
      guests: party.guests.filter((g) =>
        g.invitations.some((i) => i.event_id === event.id && i.collect_rsvps),
      ),
    }))
    .filter((row) => row.guests.length > 0);
}

/** Pre-fill from what Zola already has, so guests can come back and change their answers. */
export function initialChoices(party: Party): Choices {
  const choices: Choices = {};
  for (const { event, guests } of rsvpEvents(party)) {
    for (const guest of guests) {
      const inv = guest.invitations.find((i) => i.event_id === event.id)!;
      const offered = event.response_options.some((o) => o.value === inv.status);
      choices[choiceKey(guest.uuid, event.id)] = {
        response: inv.status !== "NO_RESPONSE" && offered ? inv.status : null,
        // The backend stores "Not sure yet" when a maybe was sent without a reason; don't show it as the guest's words.
        reason: inv.maybe_reason && inv.maybe_reason !== PLACEHOLDER_REASON ? inv.maybe_reason : "",
      };
    }
  }
  return choices;
}

/** Every answer except a joyful yes opens a place to tell us why. */
export function asksReason(event: PartyEvent, response: RsvpResponse | null): boolean {
  if (!response || response === "ATTENDING") return false;
  if (response === "DECLINED") return true;
  return event.response_options.some((o) => o.value === response && o.asks_reason);
}

// The maybe prompts come from the backend (CONFIG.RESPONSE_OPTIONS in Code.gs); only the decline prompt lives here.
export function reasonPrompt(event: PartyEvent, response: RsvpResponse): string {
  if (response === "DECLINED") return DECLINE_PROMPT;
  return (
    event.response_options.find((o) => o.value === response)?.reason_prompt ||
    "Would you like to tell us more?"
  );
}

export function guestLabel(party: Party, guest: PartyGuest): string {
  const shared = party.guests.filter((g) => g.first_name === guest.first_name).length > 1;
  return shared ? guest.name : guest.first_name || guest.name;
}

export function missingAnswers(party: Party, choices: Choices): number {
  return rsvpEvents(party).reduce(
    (n, { event, guests }) =>
      n + guests.filter((g) => !choices[choiceKey(g.uuid, event.id)]?.response).length,
    0,
  );
}

/**
 * Turn the form into one POST /rsvp body. Maybe reasons go to Zola with the answer. Zola can't hold a reason
 * for a plain decline (it would read back as "unlikely to attend"), so decline reasons travel in `note`,
 * which the backend keeps in the sheet. `note` is always sent so an old reason clears once it no longer applies.
 */
export function buildSubmission(party: Party, choices: Choices): RsvpSubmission {
  const rows = rsvpEvents(party);
  const notes: string[] = [];
  const guests = party.guests
    .map((guest) => {
      const events = rows.flatMap(({ event, guests: invited }) => {
        if (!invited.includes(guest)) return [];
        const choice = choices[choiceKey(guest.uuid, event.id)];
        if (!choice?.response) return [];
        const reason = choice.reason.trim().slice(0, REASON_MAX);
        if (choice.response === "DECLINED" && reason) {
          notes.push(
            `${guestLabel(party, guest)}${rows.length > 1 ? ` (${event.name})` : ""}: ${reason}`,
          );
        }
        const isMaybe = choice.response === "MAYBE_YES" || choice.response === "MAYBE_NO";
        return [
          {
            eventId: event.id,
            response: choice.response,
            ...(isMaybe && reason ? { reason } : {}),
          },
        ];
      });
      return { uuid: guest.uuid, events };
    })
    .filter((g) => g.events.length > 0);
  return { groupUuid: party.group_uuid, guests, note: notes.join("; ") };
}
