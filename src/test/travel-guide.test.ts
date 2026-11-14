import { describe, expect, it } from "vitest";
import { hotels, travelGuide } from "@/components/site/wedding-content";

describe("Plan Your Trip travel facts", () => {
  it("features RiverWalk as the only accommodation", () => {
    expect(hotels.map((hotel) => hotel.name)).toEqual(["RiverWalk Resort at Loon Mountain"]);
    expect(JSON.stringify(hotels)).not.toContain("Hampton Inn");
  });

  it("communicates first-come room-block limits without inventing reservation details", () => {
    expect(hotels[0].availability).toBe("Our room block is available on a first-come, first-served basis. Once the reserved rooms are filled, additional rooms and group rates cannot be guaranteed.");
    expect(hotels[0].bookingStatus).toBe("Booking details will be shared soon. Stay tuned!");
    expect(JSON.stringify(hotels)).not.toMatch(/https?:|\$\d|discount code|\b[A-Z0-9]{6,}\b/);
  });

  it("keeps the supplied airport names, codes and approximate drive times", () => {
    expect(travelGuide.international.code).toBe("BOS");
    expect(travelGuide.international.driveTime).toContain("2–2.5 hours");
    expect(travelGuide.domestic.map((airport) => [airport.code, airport.driveTime])).toEqual([
      ["BOS", "Approximately 2–2.5 hours by car."],
      ["MHT", "Approximately 1.25–1.5 hours by car."],
    ]);
  });

  it("links all five requested rental companies to their official websites", () => {
    expect(travelGuide.rentalCompanies.map((company) => [company.name, new URL(company.url).hostname])).toEqual([
      ["Enterprise Rent-A-Car", "www.enterprise.com"],
      ["Hertz", "www.hertz.com"],
      ["Avis", "www.avis.com"],
      ["Budget", "www.budget.com"],
      ["National Car Rental", "www.nationalcar.com"],
    ]);
  });

  it("keeps activities editable without inventing personal recommendations", () => {
    expect(travelGuide.scenicDrives.slice(0, 2)).toEqual(["Kancamagus Highway", "Franconia Notch"]);
    expect(travelGuide.outdoorAdventures).toEqual(["Hiking trails", "Scenic overlooks", "Waterfalls", "Gondola rides", "Other local attractions"]);
    expect(travelGuide.eatAndExplore).toEqual(["Restaurants", "Breakfast & brunch spots", "Cafés", "Breweries", "Local attractions", "Hidden gems"]);
  });

  it("limits the complimentary gift to wedding guests on October 8", () => {
    expect(travelGuide.gondola.date).toBe("October 8");
    expect(travelGuide.gondola.audience).toBe("our wedding guests");
    expect(travelGuide.gondola.offer).toBe("On October 8, we’re treating our wedding guests to complimentary gondola rides at Loon Mountain!");
    expect(travelGuide.gondola.accessDetails).toBe("Exact gondola access details and operating hours will be shared closer to the wedding.");
    expect(JSON.stringify(travelGuide.gondola)).not.toMatch(/24\/?7|24-hour|unlimited/i);
  });

  it("states that guests arrange their own travel and additional activities", () => {
    expect(travelGuide.independentArrangements).toBe("Flights, accommodations, transportation, and any additional activities or excursions can be arranged independently.");
  });
});
