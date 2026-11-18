/** FAQ copy supplied by the couple. Inline links use [[text|section-id]]. */
export type FaqBlock = string | { heading: string } | { emphasis: string } | { list: string[] };
export type FaqItem = { q: string; a: FaqBlock[] };
export type FaqCategory = { id: string; label: string; items: FaqItem[] };

export const faqIntro =
  "We’re bringing together some of our favorite people from across the country and around the world, and we know that planning a mountain getaway takes a little extra thought! We’ve put together answers to some of the questions you might have as you start making your plans. We’ll continue updating this section as more details are confirmed.";

export const faqCategories: FaqCategory[] = [
  {
    "id": "celebrations",
    "label": "Our Wedding & Celebrations",
    "items": [
      {
        "q": "Why have you chosen an American-style wedding?",
        "a": [
          "We're both what you'd call third-culture kids. Neither of us grew up in India. Sharanya grew up in the UAE, while Sahil grew up in the United States, and our childhoods were shaped by different cultures, communities, and experiences from around the world.",
          "While our Indian heritage will always be part of who we are, our upbringings have shaped how we see the world, including what we've always imagined our wedding would look like.",
          "Having spent much of our lives navigating different cultures, we wanted a celebration that felt authentic to us rather than one defined by any particular tradition. This is the kind of wedding we grew up seeing, and the kind we've always envisioned for ourselves.",
          "And if you know us, you know how much we love the mountains. So really, where else would we get married?"
        ]
      },
      {
        "q": "Why did you choose Loon Mountain?",
        "a": [
          "If you know us, you know we're mountain people through and through!",
          "The mountains have always been a big part of our lives, and Loon Mountain holds special memories for both of us. It's where Sharanya first experienced snow trekking, and Sahil has spent many memorable trips camping and exploring the area.",
          "When we started planning our wedding, we knew we wanted somewhere surrounded by nature. So we packed up the car, hit the road, and visited more than 13 potential wedding venues!",
          "And then we arrived at Loon.",
          "It was the one place where neither of us needed convincing. We both fell in love with it almost immediately. There was no debate, no second-guessing, and no need to compare it with anywhere else.",
          "We just knew.",
          "And honestly, we couldn't imagine a more perfect place to begin this next chapter together."
        ]
      },
      {
        "q": "What happens during each of the wedding celebrations?",
        "a": [
          "We're bringing some of our favorite people together for three days of celebrations in the beautiful White Mountains of New Hampshire!",
          {
            "heading": "Thursday, October 7, 2027 — Rehearsal Dinner"
          },
          {
            "emphasis": "By invitation only"
          },
          "A rehearsal dinner is traditionally held the evening before the wedding, bringing together the wedding party and close family and friends after the ceremony rehearsal. It's a chance to enjoy a more intimate meal, spend time together, and kick off the wedding festivities before the excitement of the big day.",
          "We'll begin with an intimate rehearsal dinner for our wedding party and a small group of family and friends ahead of the big day.",
          {
            "heading": "Thursday, October 7, 2027 — Welcome Party"
          },
          {
            "emphasis": "All invited wedding guests are welcome!"
          },
          "A welcome party is an informal gathering to greet guests who have traveled to celebrate with us. Unlike the wedding reception, it's a more relaxed opportunity to mingle, reconnect, and get to know one another before the wedding day.",
          "Let the celebrations begin! Join us at Seven Birches Winery for an evening of wine tasting, drinks, good company, and a chance to catch up with old friends and make some new ones before the big day.",
          {
            "heading": "Friday, October 8, 2027 — Wedding Ceremony"
          },
          {
            "emphasis": "All invited wedding guests are welcome!"
          },
          "The wedding ceremony is the heart of the celebration, when we'll officially get married, exchange vows, and make our commitment to one another in front of the people we love.",
          "The main event! We'll exchange our vows surrounded by the beautiful White Mountains and, hopefully, some spectacular New England fall foliage. Getting there will be part of the experience, so expect a scenic gondola ride up the mountain!",
          {
            "heading": "Friday, October 8, 2027 — Cocktail Hour & Reception"
          },
          {
            "emphasis": "All invited wedding guests are welcome!"
          },
          "Following the ceremony, cocktail hour is a chance for guests to enjoy drinks, appetizers, and conversation while we take photographs and prepare for the evening celebrations. The reception is the main wedding party, complete with dinner, speeches, music, dancing, and plenty of celebrating!",
          "After the ceremony, we'll head back down the mountain for cocktails, dinner, dancing, and plenty of celebrating. Come ready to eat, drink, and dance the night away!",
          {
            "heading": "Saturday, October 9, 2027 — Farewell Brunch"
          },
          {
            "emphasis": "All invited wedding guests are welcome!"
          },
          "A farewell brunch is a casual gathering the morning after the wedding, giving everyone a chance to enjoy one final meal together, share stories from the celebrations, and say their goodbyes before heading home.",
          "Before everyone heads home, we'd love to spend one last morning together over a relaxed brunch. Think pancakes, coffee, and a little recovery time after the previous night's festivities!"
        ]
      },
      {
        "q": "Are all guests invited to every celebration?",
        "a": [
          "Almost!",
          "The rehearsal dinner on Thursday evening will be a smaller, invitation-only gathering for our wedding party and a few close family members and friends.",
          "All wedding guests are warmly invited to the Welcome Party, Wedding Ceremony, Cocktail Hour & Reception, and Farewell Brunch.",
          "We'd love for you to join us for as much of the celebration as your schedule allows!"
        ]
      },
      {
        "q": "Do we have to attend all three days?",
        "a": [
          "We'd absolutely love to have you with us for the entire celebration, but we understand that travel plans and schedules vary.",
          "Join us for whichever events you can attend, and please indicate your plans when you RSVP so we can plan accordingly."
        ]
      },
      {
        "q": "Will there be any Indian wedding ceremonies?",
        "a": [
          "No, we won't be hosting any traditional Indian wedding ceremonies as part of our New Hampshire celebrations.",
          "Our wedding will follow a Western-style ceremony and reception format, and the food and festivities will reflect that as well.",
          "We know some of our guests may have been looking forward to experiencing an Indian wedding, so we wanted to clarify this upfront!"
        ]
      },
      {
        "q": "Are children welcome at the wedding?",
        "a": [
          "We've decided to keep our wedding celebrations for guests aged 13 and older.",
          "We hope this gives everyone an opportunity to enjoy a fun, relaxed weekend in the mountains, and we appreciate your understanding as you make your arrangements."
        ]
      },
      {
        "q": "Can I bring a plus-one?",
        "a": [
          "We'd love to celebrate with everyone, but we're keeping our guest list limited to those we've personally invited.",
          "When you visit “Tell Us Your Plans” on our website and look up your name, you'll see everyone included in your party. Those are the guests we're planning to accommodate.",
          "We're generally unable to accommodate additional plus-ones beyond those already listed. However, if you have a special request, please reach out to Sharanya or Sahil directly, and we'll see what we can do!",
          "We appreciate your understanding as we work within our venue's capacity and guest arrangements."
        ]
      },
      {
        "q": "Will the ceremony be indoors or outdoors?",
        "a": [
          "Our wedding ceremony will take place outdoors at the summit of Loon Mountain, weather permitting!",
          "October in New Hampshire can be chilly, especially at higher elevations, so we recommend bringing a warm layer.",
          "Our cocktail hour will take place on the outdoor patio outside the reception hall, and our reception will take place indoors, both at the base of the mountain."
        ]
      },
      {
        "q": "Do we need to hike to the ceremony?",
        "a": [
          "Not at all!",
          "While we love a good hike, we're certainly not making our wedding guests climb a mountain in formal attire!",
          "A scenic gondola ride will take you up to the ceremony location, and the ride is complimentary for our wedding guests.",
          "Just sit back, enjoy the views, and leave the hiking boots at home!"
        ]
      },
      {
        "q": "Is there a dress code for the celebrations?",
        "a": [
          "Yes! Each celebration has its own dress code.",
          "We're keeping things a little more relaxed for the Welcome Party and Farewell Brunch, while the Wedding Ceremony and Reception will be formal.",
          "More details on dress codes and outfit guidance for each celebration will be coming soon!"
        ]
      }
    ]
  },
  {
    "id": "invitations",
    "label": "Save the Date & RSVPs",
    "items": [
      {
        "q": "What is this website for?",
        "a": [
          "This website is the home for everything about our wedding, from the schedule to travel, stays, and things to do.",
          "Event timings, dress codes, and additional details will be added here as the wedding gets closer, and we’ll let you know when there’s an update."
        ]
      },
      {
        "q": "Why are you sending save-the-dates so far in advance?",
        "a": [
          "We’re bringing together friends and family from across the United States and around the world, and we want everyone to have plenty of time to plan.",
          "Our wedding also falls during New Hampshire’s peak foliage season and Columbus Day weekend, one of the busiest travel periods of the year.",
          "By sharing the dates early, we hope to make it easier for everyone to arrange travel, accommodations, and time off.",
          "Most importantly, we’d love to have as many of our favorite people there as possible!"
        ]
      },
      {
        "q": "Will we receive a separate wedding invitation?",
        "a": [
          "No separate invitation is needed!",
          "We're keeping things simple and digital. The personal message and save-the-date video we've shared with you are our way of inviting you to celebrate with us!",
          "This website will be your home for all the wedding details, including the schedule, accommodations, travel information, and eventually your final RSVP.",
          "We'll continue sharing updates as the wedding gets closer, so you won't need to wait for a separate formal invitation."
        ]
      },
      {
        "q": "Is “Tell Us Your Plans” our final RSVP?",
        "a": [
          "No!",
          "We’re simply gathering an early sense of everyone’s plans to help us prepare.",
          "Your response at this stage is not your final RSVP.",
          "We’ll let you know when it’s time to send your final RSVP, which you’ll do right here on the website."
        ]
      },
      {
        "q": "When do we need to confirm our attendance?",
        "a": [
          "We’ll share the official RSVP deadline here on the website and let you know when it’s time to respond.",
          "For now, we’d appreciate an early indication of whether you’re considering joining us."
        ]
      },
      {
        "q": "Can we change our response later?",
        "a": [
          "Of course!",
          "We understand that plans can change, especially when coordinating travel so far in advance.",
          "Your early response is simply helping us with preliminary planning.",
          "We’ll let you know when it’s time to send your final RSVP."
        ]
      },
      {
        "q": "What if I can't find my name in “Tell Us Your Plans”?",
        "a": [
          "If you're having trouble finding your name, don't worry!",
          "Try searching using your first or last name as it appears in our guest list.",
          "If you're still unable to find your details, please reach out to Sharanya or Sahil directly, and we'll be happy to help you sort it out."
        ]
      },
      {
        "q": "Can we bring additional guests?",
        "a": [
          "When you look yourself up in “Tell Us Your Plans”, you'll see exactly who is included in your party.",
          "Everyone listed in your party is invited to celebrate with us. We kindly ask that you keep to those guests when submitting your response.",
          "If you have any questions or would like to request an additional guest, please reach out to Sharanya or Sahil directly. While we can't guarantee additional spots, we're happy to discuss your request."
        ]
      },
      {
        "q": "Who is organizing the wedding, and whom should we contact with questions?",
        "a": [
          "We’re organizing and hosting our wedding celebrations ourselves!",
          "If you have any questions about the wedding, travel arrangements, accommodations, or anything else, please reach out directly to either Sharanya or Sahil.",
          "We’re happy to help you navigate the planning process."
        ]
      }
    ]
  },
  {
    "id": "accommodations",
    "label": "Accommodations",
    "items": [
      {
        "q": "Where do you recommend staying?",
        "a": [
          "Our recommended accommodation is RiverWalk Resort at Loon Mountain.",
          "We’ve arranged a special wedding room block for our guests.",
          "Our Thursday celebrations will take place at RiverWalk, and staying there will also provide convenient access to our planned wedding-day shuttle.",
          "Most importantly, we’d love to have our friends and family staying close together throughout the celebrations!",
          "Visit the [[Plan Your Trip|plan-your-trip]] section for more information."
        ]
      },
      {
        "q": "How much will accommodation cost?",
        "a": [
          "We've secured special wedding group rates at RiverWalk Resort, with several room options available for our guests:",
          {
            "heading": "Studio — $296 per night"
          },
          {
            "list": [
              "Accommodates up to 4 guests",
              "One queen-size bed and a pull-out sofa bed, both within an open-plan studio",
              "Includes a small kitchenette"
            ]
          },
          {
            "heading": "One-Bedroom Suite — $422 per night"
          },
          {
            "list": [
              "Accommodates up to 4 guests",
              "Separate bedroom with a queen-size bed",
              "Living room with a pull-out sofa bed",
              "Includes a full kitchen, offering additional space and convenience"
            ]
          },
          {
            "heading": "Two-Bedroom Suite — $718 per night"
          },
          {
            "list": [
              "Accommodates up to 8 guests",
              "Created by combining one One-Bedroom Suite and one adjoining Studio through a connecting door",
              "Two queen-size beds and two pull-out sofa beds across the connected rooms",
              "Includes a full kitchen in the One-Bedroom Suite and a kitchenette in the Studio",
              "Offers additional space and privacy, making it a great option for larger families or groups traveling together",
              "The nightly rate is the combined cost of both rooms ($422 + $296 = $718)"
            ]
          },
          "All room options require a minimum two-night stay.",
          "These are our negotiated wedding group rates, before applicable taxes and fees. Final booking instructions, payment requirements, and reservation policies will be shared soon.",
          "If you're traveling with family or friends, sharing a room or suite could be a great way to make your stay more affordable!"
        ]
      },
      {
        "q": "When should we book our accommodation?",
        "a": [
          "As soon as reservations open!",
          "October is peak foliage season in New Hampshire, and our wedding falls during Columbus Day weekend.",
          "Our wedding room block will be available on a first-come, first-served basis.",
          "Once the reserved rooms are filled, additional rooms and group rates cannot be guaranteed.",
          "We’ll share booking instructions as soon as they’re finalized."
        ]
      },
      {
        "q": "Are there other hotels nearby?",
        "a": [
          "Yes!",
          "Lincoln is a beautiful mountain town and a popular year-round destination, so there are several accommodation options in and around the area.",
          "In addition to RiverWalk Resort, you can explore hotels such as Hampton Inn Lincoln White Mountains and Holiday Inn Express.",
          "You'll also find vacation rentals, Airbnb properties, cabins, and condos in and around Lincoln, which may be particularly convenient for families or groups traveling together.",
          "However, we do not currently have wedding room blocks at these other properties.",
          "Because our wedding falls during peak foliage season and Columbus Day weekend, accommodation rates and availability may be limited.",
          "We strongly recommend RiverWalk Resort for its location, convenience, and our negotiated wedding group rates."
        ]
      },
      {
        "q": "Do we have to stay at RiverWalk Resort?",
        "a": [
          "Not at all!",
          "You’re welcome to arrange accommodations wherever you prefer.",
          "However, RiverWalk is our recommended hotel because our Thursday celebrations will take place there, we’ve arranged special group rates, and it offers convenient access to the planned wedding-day shuttle."
        ]
      },
      {
        "q": "Can we arrive earlier or extend our stay?",
        "a": [
          "Absolutely!",
          "We’d love for you to make a longer trip out of your visit.",
          "Additional nights are subject to hotel availability and booking conditions, and guests can arrange them directly with their chosen accommodation provider."
        ]
      },
      {
        "q": "What happens if the wedding room block fills up?",
        "a": [
          "We've already secured a room block at RiverWalk Resort to accommodate a good number of our guests, but rooms are limited and will be available on a first-come, first-served basis.",
          "If our initial room block fills up, please reach out to Sharanya or Sahil directly!",
          "We can request an additional block of rooms from the resort, but approval, availability, and rates will depend on what the hotel can accommodate at that time. Since our wedding falls during one of New Hampshire's busiest travel weekends, additional rooms cannot be guaranteed.",
          "We've negotiated favorable group rates for our guests, so if you're hoping to stay at RiverWalk with us, we strongly recommend booking as soon as reservations open.",
          "Alternatively, you're welcome to explore the other nearby hotels, Airbnb properties, and vacation rentals mentioned above.",
          "The earlier you let us know what you need, the better our chances of helping you find suitable accommodations!"
        ]
      },
      {
        "q": "Can we share a room or book accommodations together with other guests?",
        "a": [
          "Of course!",
          "If you're traveling with friends or family, you're welcome to coordinate your accommodation arrangements and share a room or suite, subject to the property's occupancy limits.",
          "RiverWalk offers different room configurations, so there may be options for guests who would prefer to stay together.",
          "We recommend discussing your arrangements with your travel companions before making a reservation."
        ]
      },
      {
        "q": "Can we cancel or modify our hotel reservation?",
        "a": [
          "Cancellation and modification policies will depend on the accommodation you book and the terms of your reservation.",
          "For guests booking through our RiverWalk wedding room block, we'll share the applicable cancellation policies, payment requirements, and booking conditions once everything is finalized.",
          "We recommend reviewing these details carefully before confirming your stay."
        ]
      }
    ]
  },
  {
    id: "travel",
    label: "Travel & Weather",
    items: [
      { q: "Which airport should we fly into?", a: [
        "For international travelers, Boston Logan International Airport (BOS) is generally the most convenient major international gateway.",
        "Domestic travelers can consider either:",
        { heading: "Boston Logan International Airport (BOS)" },
        "Approximately 2–2.5 hours by car to Lincoln.",
        { heading: "Manchester-Boston Regional Airport (MHT)" },
        "Approximately 1.25–1.5 hours by car to Lincoln.",
        "Manchester is closer, while Boston generally offers a wider selection of flights.",
        "Please visit our [[Plan Your Trip|plan-your-trip]] section for additional information.",
      ]},
      { q: "Will we need to rent a car?", a: [
        "We strongly recommend having access to a car.",
        "Lincoln is a mountain destination, and having your own transportation makes it easier to travel from the airport and explore the surrounding White Mountains.",
        "We’re also exploring potential rental-car group rates for our wedding guests.",
        "More information will follow if discounted rates become available.",
      ]},
      { q: "Will transportation be provided during the wedding?", a: [
        "We’re planning a wedding-day shuttle between RiverWalk Resort and Loon Mountain.",
        "Further information about shuttle schedules and pickup arrangements will be shared closer to the wedding.",
        "Guests staying at other accommodations should plan their transportation accordingly.",
      ]},
      { q: "What will the weather be like in October?", a: [
        "October is one of the most beautiful times to visit New Hampshire!",
        "The mountains are usually surrounded by brilliant autumn foliage, but temperatures can be quite cool, especially in the mornings, evenings, and at higher elevations.",
        "Mountain weather can also change quickly, so we recommend packing layers.",
      ]},
      { q: "Will we need warm clothing?", a: [
        "Yes!",
        "We recommend bringing a warm jacket, layers, and comfortable shoes for exploring the area.",
        "The summit can be considerably cooler than the base of the mountain.",
        "We’ll share more specific guidance about wedding attire and dress codes closer to the date.",
      ]},
      { q: "Do international guests need any special travel documents?", a: [
        "International guests should check the passport, visa, and United States entry requirements applicable to their nationality and travel circumstances.",
        "If you’re planning to rent a car, please also check driver’s license and International Driving Permit requirements with your rental provider.",
        "We recommend making these arrangements well in advance.",
      ]},
      { q: "Should we expect traffic during Columbus Day weekend?", a: [
        "Yes, and we recommend planning accordingly!",
        "Columbus Day weekend is one of the busiest periods in the White Mountains because of the beautiful fall foliage.",
        "Roads can become congested, particularly around popular attractions and scenic routes.",
        "We recommend allowing extra travel time when driving to Lincoln.",
      ]},
    ],
  },
  {
    id: "experience",
    label: "The Wedding Experience",
    items: [
      { q: "What should we wear to the wedding celebrations?", a: [
        "We’re planning a mix of formal and relaxed celebrations throughout the three days.",
        "Each event will have its own dress code, and we’ll share specific attire guidance here on the website closer to the wedding.",
        "Because we’ll be celebrating in the mountains during October, we also recommend keeping the cooler weather in mind.",
      ]},
      { q: "Will the wedding ceremony take place outdoors?", a: [
        "Yes!",
        "Our ceremony is planned for Loon Mountain’s summit amphitheater, surrounded by the beautiful White Mountains.",
        "Guests will travel to the summit by gondola.",
        "Please keep in mind that temperatures at the summit may be cooler than at the base of the mountain.",
        "Additional ceremony and weather-related details will follow.",
      ]},
      { q: "Are the gondola rides included?", a: [
        "Yes! The mountain views are on us!",
        "As a little gift from us to you, we’re treating our wedding guests to complimentary scenic gondola rides on October 8, 2027.",
        "Loon Mountain is home to New Hampshire’s longest scenic gondola ride, ascending approximately 1,738 vertical feet to a summit 2,733 feet above sea level.",
        "It’s a beautiful way to experience the White Mountains and their spectacular autumn colors.",
        "More details about gondola access and operating hours will follow.",
      ]},
      { q: "Will food and drinks be served?", a: [
        "Absolutely!",
        "Food and refreshments will be part of our wedding celebrations.",
        "The cocktail hour will include drinks and hors d’oeuvres, followed by dinner and celebrations at the wedding reception.",
        "We’ll share additional details as the menus and arrangements are finalized.",
      ]},
      { q: "Will vegetarian food and other dietary options be available?", a: [
        "We’re planning to accommodate a variety of dietary preferences.",
        "We’ll collect information about dietary restrictions and allergies as part of the formal RSVP process.",
        "Please make sure to share any dietary requirements when that information is requested.",
      ]},
    ],
  },
  {
    id: "explore",
    label: "Explore the Mountains",
    items: [
      { q: "What is there to do around Lincoln and the White Mountains?", a: [
        "So much!",
        "From scenic drives and hiking trails to waterfalls, family-run eateries, and some of our favorite local spots, there’s plenty to explore.",
        "We’re putting together a personal guide to Lincoln and the surrounding White Mountains to help you make the most of your visit.",
        "Look for the [[Explore Our Lincoln, New Hampshire Guide|adventure]] on our [[Things To Do|things-to-do]] page once it’s ready.",
      ]},
      { q: "Should we book activities and restaurants in advance?", a: [
        "We strongly recommend it!",
        "October is peak foliage season, and Columbus Day weekend attracts visitors from across the region.",
        "Popular attractions, activities, and restaurants can become especially busy.",
        "If there’s something you’d particularly like to experience, we recommend checking availability and making reservations ahead of time.",
      ]},
      { q: "Can we extend our trip and explore New England?", a: [
        "Of course!",
        "We’d love for you to make an adventure of your time here.",
        "Whether you arrive early, stay a little longer, or explore other parts of New England, there’s so much to discover.",
        "Any additional travel, accommodations, transportation, and activities can be arranged independently.",
      ]},
    ],
  },
];
