export const hotels = [
  {
    id: "riverwalk",
    name: "RiverWalk Resort at Loon Mountain",
    introduction: "We’ve reserved a special wedding room block at RiverWalk Resort, where our Thursday celebrations will take place. With the wedding-day shuttle nearby and October’s peak foliage coinciding with Columbus Day weekend, we encourage guests to book early.",
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
  },
  domestic: [
    { name: "Boston Logan International Airport", code: "BOS", driveTime: "Approximately 2–2.5 hours by car." },
    { name: "Manchester-Boston Regional Airport", code: "MHT", driveTime: "Approximately 1.25–1.5 hours by car." },
  ],
  airportComparison: "Manchester is closer to Lincoln, while Boston typically offers a wider range of flight options.",
  /** Shared statement shown once beneath both airport columns. */
  rentalRecommendation: "We recommend arranging a rental car in advance for your drive to Lincoln. More information can be found below.",
  driving: {
    introduction: "Whether you’re driving from nearby or picking up a rental car after your flight, the journey to Lincoln is a beautiful one. We recommend allowing extra travel time during Columbus Day weekend, as the roads can get busy with visitors enjoying New Hampshire’s spectacular fall foliage.",
    recommendation: "We recommend arranging a rental car in advance.",
    transportation: "Having your own transportation makes it easier to explore Lincoln and the surrounding White Mountains at your own pace.",
    groupRates: {
      status: "exploring",
      notice: "We’re exploring special rental-car rates for our wedding guests and hope to make the journey a little easier on everyone!",
      update: "We’ll share more information here if group rates become available. Stay tuned!",
    },
  },
  rentalCompanies: [
    { name: "Enterprise Rent-A-Car", url: "https://www.enterprise.com/en/home.html" },
    { name: "Hertz", url: "https://www.hertz.com/us/en/home" },
    { name: "Avis", url: "https://www.avis.com/en/home" },
    { name: "Budget", url: "https://www.budget.com/en/home" },
    { name: "National Car Rental", url: "https://www.nationalcar.com/en/home" },
  ],
  newHampshireGuide: {
    intro: "We hope you’ll make an adventure of your time in the White Mountains! From scenic drives and mountain trails to family-run eateries and some of our favorite local spots, there’s so much to discover. We’ve put together a little New Hampshire guide to help you explore and make the most of your visit.",
    label: "Explore Our Lincoln, New Hampshire Guide",
    /** Set to the Canva PDF URL once it exists; the button then opens it in a new tab. */
    url: null as string | null,
  },
  gondola: {
    date: "October 8, 2027",
    audience: "all our wedding guests",
    intro: "Did you know that Loon Mountain is home to New Hampshire’s longest scenic gondola ride?",
    climb: "Climbing approximately 1,700 vertical feet to a summit 2,733 feet above sea level, the gondola offers breathtaking views of the White Mountains, especially when the landscape comes alive with brilliant autumn colors.",
    offer: "As a little gift from us to you, we’re treating all our wedding guests to complimentary gondola rides on October 8, 2027! Enjoy the mountain views, take in the fall foliage, and make a little adventure of your wedding day.",
    highlight: "complimentary gondola rides on October 8, 2027",
    accessDetails: "More details to follow!",
  },
} as const;

export type Story = {
  id: string;
  n: string;
  title: string;
  subtitle: string;
  /** Complete story text, exactly as supplied by the couple. */
  body: string;
  /** Card-back wording supplied by the couple; otherwise derived from body. */
  preview?: string;
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
  {
    id: "the-proposal-that-became-two",
    n: "09",
    title: "The Proposal That Became Two",
    subtitle: "They both knew they’d found their forever. Neither knew the other was planning to propose.",
    preview:
      "Sahil had planned an elaborate scavenger hunt through Boston, revisiting the places that had shaped their relationship. What he didn’t know was that Sharanya had been carrying a ring for him for over a month. They both had a proposal planned, and neither knew what the other was about to do.",
    body: `Sahil had a plan. A rather elaborate one, actually.

Fresh off moving into their new home, he had organized an entire scavenger hunt across Boston for Sharanya. Not just any scavenger hunt, either. Every stop came with two clues: one to figure out where they were going and another to figure out what they had to do once they got there.

What Sharanya didn’t know was that every destination was a little piece of their story.

Their adventure began at a grocery store that held some of their earliest memories, where Sahil surprised her with flowers. From there, they headed to a park near her old apartment, where they recreated their first kiss in the rain.

Next came Silhouette, their beloved Allston bar, where cranberry shots had somehow become an anniversary tradition. Naturally, there were cranberry shots.

Then came another familiar street, outside a place Sharanya had once lived. It was where Sahil had dropped her off after their very first date, and where they’d shared a memorable almost-kiss. Of course, they had to recreate that too.

By this point, Sahil was essentially taking her on a guided tour of their relationship.

Their next stop was Questrom, where Sahil knew Sharanya would be due for her usual coffee. A Starbucks break was practically mandatory.

Then it was off to Newbury Street, where they recreated a funny photograph outside Serafina that Sahil had taken of Sharanya before one of their dates.

And because no tour of their relationship would be complete without a little alcohol, they headed to the Bell in Hand in the North End, one of their favorite places to go dancing. This time, it was green tea shots.

All along, Sharanya had her suspicions.

She had a pretty good feeling that Sahil was going to propose. She just didn’t know when. With a couple of stops still supposedly left on the itinerary, she was convinced she had figured out where the big moment would happen.

She hadn’t.

Instead, Sahil led her to a beautiful spot overlooking Boston, near a place that held a special meaning for Sharanya. Years before she’d met him, she’d stood nearby, looked out at the city, fallen completely in love with it, and decided that one day she would make Boston her home.

And now, in that very city, with the person who had become her home, Sahil got down on one knee.

But he had a few more surprises waiting.

His sister had helped set up the proposal, complete with decorations. And the photographer Sharanya had desperately wanted, the one Sahil had insisted was unavailable, suddenly appeared to capture the moment.

There were tears, laughter, photographs, and one very happy newly engaged couple.

Except the story wasn’t quite finished.

You see, Sharanya had been keeping a secret of her own.

For over a month, she’d been carrying a ring for Sahil everywhere she went. She’d known she wanted to propose to him too, and she wasn’t about to let him have all the fun.

So, after Sahil’s grand scavenger hunt and beautiful proposal, Sharanya got down on one knee and asked him to marry her right back.

Two proposals. Two rings. Two very happy people.

And after an unforgettable photoshoot, they ended their adventure at Cornwall’s, another place woven into their story, to celebrate.

What started as a scavenger hunt through the places they’d loved became a celebration of everything they’d built together.

And perhaps the best part?

Sahil had spent all that time planning the perfect way to ask Sharanya to marry him.

He had absolutely no idea she was planning to ask him the very same question.`,
    photo: null,
  },
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
