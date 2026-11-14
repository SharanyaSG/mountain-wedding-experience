export const hotels = [
  {
    id: "riverwalk",
    name: "RiverWalk Resort at Loon Mountain",
    introduction: "We’ve reserved a special wedding room block at RiverWalk Resort, where our Thursday celebrations will take place and where you’ll be close to family, friends, and the wedding-day shuttle.",
    season: "October is peak foliage season and Columbus Day weekend, making this one of the busiest times of the year in the White Mountains.",
    availability: "Our room block is available on a first-come, first-served basis. Once the reserved rooms are filled, additional rooms and group rates cannot be guaranteed.",
    encouragement: "We strongly encourage booking as soon as reservations open.",
    bookingRecommendation: "Our room block is available on a first-come, first-served basis, so we strongly encourage booking as soon as reservations open.",
    availabilityNote: "Once the reserved rooms are filled, additional rooms and group rates cannot be guaranteed.",
    bookingHeading: "Our Wedding Room Block",
    bookingNote: "Special group rates have been secured for our guests.",
    bookingStatus: "Booking details will be shared soon. Stay tuned!",
  },
] as const;

export const travelGuide = {
  international: {
    name: "Boston Logan International Airport",
    code: "BOS",
    driveTime: "Approximately 2–2.5 hours by car to Lincoln, New Hampshire.",
    description: "Boston Logan is generally the most convenient major international gateway for guests traveling from overseas.",
    recommendation: "We recommend arranging a rental car in advance for the drive to Lincoln.",
  },
  domestic: [
    { name: "Boston Logan International Airport", code: "BOS", driveTime: "Approximately 2–2.5 hours by car." },
    { name: "Manchester-Boston Regional Airport", code: "MHT", driveTime: "Approximately 1.25–1.5 hours by car." },
  ],
  airportComparison: "Manchester is closer to Lincoln, while Boston typically offers a wider range of flight options.",
  rentalCompanies: [
    { name: "Enterprise Rent-A-Car", url: "https://www.enterprise.com/en/home.html" },
    { name: "Hertz", url: "https://www.hertz.com/us/en/home" },
    { name: "Avis", url: "https://www.avis.com/en/home" },
    { name: "Budget", url: "https://www.budget.com/en/home" },
    { name: "National Car Rental", url: "https://www.nationalcar.com/en/home" },
  ],
  scenicDrives: ["Kancamagus Highway", "Franconia Notch", "Additional scenic recommendations"],
  outdoorAdventures: ["Hiking trails", "Scenic overlooks", "Waterfalls", "Gondola rides", "Other local attractions"],
  eatAndExplore: ["Restaurants", "Breakfast & brunch spots", "Cafés", "Breweries", "Local attractions", "Hidden gems"],
  gondola: {
    date: "October 8",
    audience: "our wedding guests",
    offer: "On October 8, we’re treating our wedding guests to complimentary gondola rides at Loon Mountain!",
    accessDetails: "Exact gondola access details and operating hours will be shared closer to the wedding.",
  },
  independentArrangements: "Flights, accommodations, transportation, and any additional activities or excursions can be arranged independently.",
} as const;

export type Story = {
  id: string;
  n: string;
  title: string;
  subtitle: string;
  /** Complete story text, exactly as supplied by the couple. */
  body: string;
  photo: { url: string; alt: string; width: number; height: number } | null;
};

export const stories: Story[] = [
  { id: "halloween-2023", n: "01", title: "Halloween 2023", subtitle: "The First Time We Met", body: `On Halloween 2023, Sharanya and her friends went to Witches Woods, the kind of place designed for jump scares, haunted houses, and very questionable life decisions. Sahil joined them, and it was the first time they really spent time together. Within minutes of small talk, he discovered that Sharanya is deeply, unapologetically terrified of anything creepy or gory, and Halloween is absolutely not her holiday. Naturally, Sahil (who loves Halloween) decided to make this his entire personality for the evening.

Armed with this information, he spent the night sneaking up behind her, jumping out at every opportunity, and ensuring she was thoroughly startled in every haunted house they entered. By the end of it, Sharanya had two full-blown panic attacks and absolutely hated his guts! At one point, in the middle of all the chaos, she even pulled her friends aside and asked them to please keep him far, far away from her.

In response they said - “You know how little boys pull girls’ pigtails in kindergarten when they like them? We think he likes you.”

Sharanya’s reply was immediate and certain - “Never, ever, ever will I  date him. Not even if he were the last man on earth, and not even if procreation depended on it!”

Three years later, here they are …`, photo: null },
  { id: "the-bow", n: "02", title: "The Bow", subtitle: "Sharanya’s Favorite Sahil Story", body: `Early in spring 2024, after the Health Sector Management MBA 50th anniversary bash and a friend’s after party, Sahil was walking Sharanya home. They were both thoroughly, unapologetically drunk, with their walls down and the world feeling a little softer than usual. The streets still had leftover holiday decorations, and on one tree hung an old wreath with a beautiful bow.

Sharanya pointed it out and said, very casually, “I like that bow.”

That was all Sahil needed.

Before she could properly process what was happening, he was halfway up the tree, determined to get it for her. She kept telling him to stop, that it was fine, that she didn’t actually need it. He, of course, ignored all of that and kept tugging at the bow with absolute focus. After a solid fifteen minutes of effort, the bow finally came loose, except by then the wreath was completely destroyed and the bow had unraveled into one very long, slightly tragic ribbon.

He climbed down, handed it to her like it was a priceless gift, and said, “I’ll always give you what you want.”

And in that very ridiculous, very sweet moment, Sharanya realized that this was someone who would go to any length just to make her smile and keep her happy!`, photo: null },
  { id: "shravya", n: "03", title: "Shravya", subtitle: "Sahil’s Favorite Sharanya Story", body: `Shortly after they started dating, Sahil took a trip to India, and they were texting enough for his family to get curious. On the flight back, his mom asked who he had been talking to so much, and he casually said he was dating this girl that she had met sometime back. His mom nodded and said, “Oh yes, that girl… Shravya, right?”

Sahil paused… and said, “YES!! That girl.”

He never corrected her.

And then it just … continued. For the next few months, his family happily referred to Sharanya as “Shravya,” completely unaware that this was not her name. Sahil’s grand plan was to wait until they all met in person and then reveal the truth in one dramatic and, in his mind, hilarious moment. Sharanya, meanwhile, kept trying to find subtle ways to fix it before meeting them. Needless to say, Sahil did not allow that to happen.

A couple of months later, the moment finally arrived. Sharanya met his sister first, who immediately discovered the mix up. She was surprised, mildly exasperated, and also very entertained; it only reinforced what she already knew about her brother. A week later, when she met his mom, the truth came out again, followed by a lot of laughter, a bit of disbelief, and plenty of “Why would you even do this?” directed at Sahil.

In the end, it turned into one of those stories everyone still laughs about, and every once in a while, his mom still accidentally calls her Shravya.`, photo: null },
  { id: "new-york", n: "04", title: "New York", subtitle: "The First Big Trip", body: `A few months into their relationship, Sharanya and Sahil planned their first trip together. They wanted something affordable, cozy, and romantic, so Sahil found a charming Airbnb in the middle of nowhere in New York complete with a hot tub and a view of a stream waterfall. Sharanya needed some convincing, but reluctantly agreed.

They set off early with no plan, stopped in Albany to explore the State Capitol, grabbed some questionable fish hot dogs, and continued on to the Airbnb, where chickens greeted them every time they stepped outside.

What they thought would be a quiet, stay-in weekend quickly turned into something else. They found a murder mystery escape in the woods, visited a small farm, explored caves with an underground waterfall, and discovered a local vineyard they kept returning to.

One highlight was a short hike for a sunset view over the farmland. They made it just in time to watch the sun dip below the horizon, and just late enough that it was pitch dark on the walk down.

What followed was a chaotic walk back using only their phone flashlights. Sharanya was convinced there were bears in the woods and was very mad. Sahil was determined to get them back to the car safely.

It was their first trip together, and it turned out to be full of unexpected adventures, small mishaps, and a lot of laughter. They thought it would be a quiet weekend, but instead they spent it exploring, trying new things, and making memories they still talk about.`, photo: null },
  { id: "the-free-mattress", n: "05", title: "The Free Mattress", subtitle: "He Meant Well….", body: `After moving out of her on campus apartment, Sharanya was sleeping on an air mattress. Sahil decided this simply would not do. Determined to fix it in the most budget friendly way possible, he found a “free” mattress that came with an adjustable bed frame.

The mattress fit into the van easily. The bed frame did not. The seller was very clear that it was a package deal so he had to take both. So, Sahil went across the street, rented a truck, and came back for it.

What followed was a heroic but deeply misguided attempt to get the frame into the apartment. The mattress made it in. The frame absolutely did not. There were stairs. There were tight corners. The frame had no flex. It was also covered in cat hair, which quickly transferred onto Sahil, his clothes, his beard, and the floor, while their friend helping them (who was also allergic to cats) suffered through the process.

As predicted, the frame got completely stuck between the staircase and the wall and nearly took out the fire alarm. After a long series of “this is not going to work,” Sahil finally accepted defeat. But by then it was halfway in, so they had to wrestle it all the way back out and carry it around the block to the dumpster.

In the end, the “free” bed frame was not so free, the adjustable dream did not survive, and Sharanya was understandably not thrilled. Sahil, however, meant well. And to this day, they still use that very mattress, just on a normal bed frame.`, photo: null },
  { id: "our-homes-away-from-home", n: "06", title: "Our Homes Away From Home", subtitle: "Cornwalls & Silhouette", body: `Some of our favorite memories don’t come from big, dramatic moments, but from ordinary evenings at two very special places.

Cornwall’s is our MBA bar, the place where so much of “us” quietly began. It’s where we went after long days of class, talking through life, laughing about projects, and showing up for each other as friends before anything else. It’s where we learned how to be each other’s safe place, one conversation at a time, and where small moments turned into something that means everything now.

Silhouette came into our story a little later, after Sharanya moved to Allston. It’s just down the street from her place, and while it started as a convenient neighborhood spot, we kept going back because of Sarah, our favorite bartender, who welcomed us in with warmth, laughter, and the kind of easy friendship that makes a place feel like yours.

At Cornwall’s, there’s Miz, who has seen us through countless evenings and knows us in his own quiet, dry way.

These places matter to us because of the people in them. So much so that even before we got engaged, we told Sarah and Miz that one day, whenever we got married, we wanted them behind the bar.

They’re where we learned how to be together, how to be present for each other, and how to find joy in the in-between moments. And that is exactly the kind of life we hope to keep building.`, photo: null },
  { id: "the-puppy-proposal", n: "07", title: "The Puppy Proposal", subtitle: "A Ring Pop, A Misunderstanding, & A Very Confused Mother", body: `The day after we decided we were getting married, Sahil came home from a ski trip, sat down with his mom, and decided, without any plan whatsoever, to tell her the news.

Instead of saying it directly, he announced, very seriously, that he was “bringing someone new into the family.”

His mom paused and said, “Please tell me you’re not getting a dog.”

And for reasons no one fully understands, Sahil said, “Yes.”

What followed was about twenty minutes of confusion, suspense, and increasingly creative hints, while Sharanya sat nearby, occasionally contributing helpful “woof” sounds to the conversation. His mom grew more and more concerned. Sahil kept saying, “You’re so close.”
Eventually, after many circles, the truth finally came out. His mom realized what he was actually trying to say and was, of course, overjoyed.

Sahil then ran downstairs, grabbed a ring pop, flowers, and a heart-shaped box of chocolates, came back up, got down on one knee, and asked, “Will you be my puppy?”

And to no one’s surprise Sharanya said, “WOOF!”

…which led to the next step - asking for blessings the slightly more formal way.`, photo: null },
  { id: "the-one-where-he-behaved", n: "08", title: "The One Where He Behaved!", subtitle: "Blessings from The Gowdas & The Malhotras", body: `Right after the puppy proposal, Sahil and Sharanya called her parents.

This time, Sahil behaved.

He spoke to them with sincerity and respect, sharing how much Sharanya means to him and how seriously they had been thinking about their future together. They talked through everything - what this step meant, what the plan was, and what they hoped to build together.

Her parents listened, asked thoughtful questions, and most importantly, gave their blessing with warmth and happiness.

Soon after, Sharanya also wrote a heartfelt letter to Sahil’s mom, asking for her son’s hand in a way that was thoughtful, intentional, and full of love.

And with that, between laughter, a ring pop, and two very different but equally meaningful conversations, both families became part of the beginning of this next chapter.`, photo: null },
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

export type AgendaEvent = {
  title: string;
  place: string;
  /** Understated italic qualifier, e.g. "By Invitation Only". */
  note?: string;
  /** Sage-green line for events open to every guest. */
  open?: string;
  /** Small explanatory line beneath a qualifier. */
  detail?: string;
};

/** Confirmed three-day wedding agenda, October 7–9, 2027. Times are not yet set. */
export const agenda: { n: string; dow: string; date: string; events: AgendaEvent[] }[] = [
  {
    n: "07",
    dow: "Thursday",
    date: "October 7, 2027",
    events: [
      {
        title: "Rehearsal Dinner",
        place: "RiverWalk Resort · Tuscan Terrace",
        note: "By Invitation Only",
      },
      {
        title: "Welcome Party",
        place: "Seven Birches Winery · RiverWalk Resort",
      },
    ],
  },
  {
    n: "08",
    dow: "Friday",
    date: "October 8, 2027",
    events: [
      { title: "The Vows", place: "Loon Mountain · Summit Amphitheater" },
      { title: "Cocktail Hour", place: "Loon Mountain · Octagon Lodge" },
      { title: "Wedding Reception", place: "Loon Mountain · Octagon Lodge" },
    ],
  },
  {
    n: "09",
    dow: "Saturday",
    date: "October 9, 2027",
    events: [{ title: "Farewell Brunch", place: "Location to be announced" }],
  },
];
