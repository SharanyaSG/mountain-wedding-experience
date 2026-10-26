export const hotels = [
  {
    id: "riverwalk", n: "01", name: "RiverWalk Resort at Loon Mountain",
    label: "Our Preferred Stay", tagline: "The heart of our wedding weekend.",
    introduction: "Our Thursday welcome gathering takes place at RiverWalk, making it the most convenient place to stay close to the celebrations.",
    reasons: ["Thursday welcome gathering on-site.", "Convenient gathering point for wedding guests.", "Resort amenities and dining options.", "Wedding room block planned."],
    notes: ["Breakfast is not included.", "Room-block rates, codes, and booking details are pending confirmation."],
    thursday: "Welcome gathering on-site", breakfastIncluded: false, roomBlock: "planned",
  },
  {
    id: "hampton", n: "02", name: "Hampton Inn Lincoln White Mountains",
    label: "Our Second Pick", tagline: "Close to the celebrations, with breakfast included.",
    reasons: ["Very close to RiverWalk.", "Breakfast included.", "Wedding room block planned."],
    notes: ["Thursday events take place at RiverWalk.", "Room-block details are pending confirmation."],
    thursday: "Very close to RiverWalk", breakfastIncluded: true, roomBlock: "planned",
  },
  {
    id: "holiday-inn", n: "03", name: "Holiday Inn Express & Suites Lincoln East – White Mountains",
    label: "Additional Accommodation Option", tagline: "",
    reasons: ["Breakfast included.", "Additional lodging option in Lincoln."],
    notes: ["No wedding room block.", "Farther from RiverWalk.", "Guests should arrange transportation for Thursday events."],
    thursday: "Farther away; arrange transportation", breakfastIncluded: true, roomBlock: "none",
  },
] as const;

export const plannedStories = [
  { k: "Halloween 2023", t: "The First Time We Met" },
  { k: "The Bow", t: "Sharanya’s Favorite Sahil Story" },
  { k: "Shravya", t: "Sahil’s Favorite Sharanya Story" },
  { k: "New York", t: "The First Big Trip" },
  { k: "The Free Mattress", t: "He Meant Well…" },
  { k: "Our Homes Away From Home", t: "Cornwall’s & Silhouette" },
  { k: "The Puppy Proposal", t: "A Ring Pop, a Misunderstanding & a Very Confused Mother" },
  { k: "The One Where He Behaved!", t: "Blessings from the Gowdas & the Malhotras" },
  { k: "Finally, a Ring!", t: "A Romantic Promise for Forever" },
] as const;