export const hotels = [
  {
    id: "riverwalk", n: "01", name: "RiverWalk Resort at Loon Mountain",
    label: "Our Recommended Stay", tagline: "Stay close to the celebrations.",
    introduction: "We’ve reserved a discounted wedding room block at RiverWalk Resort, and we’d love for you to stay here with us! With our Thursday celebrations taking place on-site and convenient access to our wedding-day shuttle, it’s the easiest way to enjoy the festivities.",
    urgency: "Our wedding falls during New Hampshire’s peak foliage season and Columbus Day weekend, when accommodations are in high demand. We strongly recommend booking early to take advantage of our special group rates.",
    reasons: ["Exclusive wedding room-block rates", "Thursday celebrations on-site", "Convenient access to the wedding-day shuttle", "Stay close to family and friends"],
    bookingHeading: "Our Wedding Room Block",
    bookingNote: "Special group rates have been secured for our guests. Booking details will be shared soon.",
    thursday: "Welcome gathering on-site", breakfastIncluded: false, roomBlock: "reserved",
  },
  {
    id: "hampton", n: "02", name: "Hampton Inn Lincoln White Mountains",
    label: "Alternative Accommodation", tagline: "",
    introduction: "Prefer another option? Hampton Inn is located nearby. Please note that we do not have a wedding room block here, and rates and availability will be subject to holiday-weekend demand.",
    urgency: "", reasons: [],
    bookingHeading: "",
    bookingNote: "Reserve directly with the hotel.",
    thursday: "Very close to RiverWalk", breakfastIncluded: true, roomBlock: "none",
  },
] as const;

export type Story = {
  id: string;
  n: string;
  title: string;
  subtitle: string;
  /** Complete story text, exactly as supplied. Empty until the couple provides it. */
  body: string;
  photo: { url: string; alt: string; width: number; height: number } | null;
};

export const stories: Story[] = [
  { id: "halloween-2023", n: "01", title: "Halloween 2023", subtitle: "The First Time We Met", body: "", photo: null },
  { id: "the-bow", n: "02", title: "The Bow", subtitle: "Sharanya’s Favorite Sahil Story", body: "", photo: null },
  { id: "shravya", n: "03", title: "Shravya", subtitle: "Sahil’s Favorite Sharanya Story", body: "", photo: null },
  { id: "new-york", n: "04", title: "New York", subtitle: "The First Big Trip", body: "", photo: null },
  { id: "the-free-mattress", n: "05", title: "The Free Mattress", subtitle: "He Meant Well….", body: "", photo: null },
  { id: "our-homes-away-from-home", n: "06", title: "Our Homes Away From Home", subtitle: "Cornwalls & Silhouette", body: "", photo: null },
  { id: "the-puppy-proposal", n: "07", title: "The Puppy Proposal", subtitle: "A Ring Pop, A Misunderstanding, & A Very Confused Mother", body: "", photo: null },
  { id: "the-one-where-he-behaved", n: "08", title: "The One Where He Behaved!", subtitle: "Blessings from The Gowdas & The Malhotras", body: "", photo: null },
];

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
