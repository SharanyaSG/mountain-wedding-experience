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

  it("states the rental-car recommendation once, beneath both airport columns", () => {
    expect(travelGuide.rentalRecommendation).toBe("We recommend arranging a rental car in advance for your drive to Lincoln. More information can be found below.");
    expect("recommendation" in travelGuide.international).toBe(false);
  });

  it("keeps the New Hampshire guide button ready for a real link", () => {
    expect(travelGuide.newHampshireGuide.intro).toBe("We hope you’ll make an adventure of your time in the White Mountains! From scenic drives and mountain trails to family-run eateries and some of our favorite local spots, there’s so much to discover. We’ve put together a little New Hampshire guide to help you explore and make the most of your visit.");
    expect(travelGuide.newHampshireGuide.label).toBe("Explore Our Lincoln, New Hampshire Guide");
    expect(travelGuide.newHampshireGuide.url).toBeNull();
  });

  it("keeps rental-car group rates tentative rather than secured", () => {
    expect(travelGuide.driving.groupRates.status).toBe("exploring");
  });

  it("limits the complimentary gift to wedding guests on October 8", () => {
    expect(travelGuide.gondola.date).toBe("October 8, 2027");
    expect(travelGuide.gondola.audience).toBe("all our wedding guests");
    expect(travelGuide.gondola.intro).toBe("Did you know that Loon Mountain is home to New Hampshire’s longest scenic gondola ride?");
    expect(travelGuide.gondola.climb).toBe("Climbing approximately 1,700 vertical feet to a summit 2,733 feet above sea level, the gondola offers breathtaking views of the White Mountains, especially when the landscape comes alive with brilliant autumn colors.");
    expect(travelGuide.gondola.offer).toBe("As a little gift from us to you, we’re treating all our wedding guests to complimentary gondola rides on October 8, 2027! Enjoy the mountain views, take in the fall foliage, and make a little adventure of your wedding day.");
    expect(travelGuide.gondola.offer).toContain(travelGuide.gondola.highlight);
    expect(travelGuide.gondola.highlight).toBe("complimentary gondola rides on October 8, 2027");
    expect(travelGuide.gondola.accessDetails).toBe("More details to follow!");
    expect(JSON.stringify(travelGuide.gondola)).not.toMatch(/24\/?7|24-hour|unlimited/i);
  });
});
