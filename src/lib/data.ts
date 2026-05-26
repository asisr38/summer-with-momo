export const HER_NAME = "My Love";
export const SECRET_PWD = "ourDC2026";
export const ARRIVAL = "2026-06-22T00:00:00";
export const DEPARTURE = "2026-08-16T23:59:59";

export type Day = {
  id: string;
  date: string;
  day: string;
  type: string;
  tag: string;
  emoji: string;
  title: string;
  desc: string;
  cost: string;
  isSurprise?: boolean;
  secretNote?: string;
};

export type Week = {
  title: string;
  subtitle: string;
  days: Day[];
};

export type Trip = {
  type: string;
  when: string;
  icon: string;
  title: string;
  subtitle: string;
  items: Array<{ i: string; t: string }>;
  cost: string;
};

export type EatsSection = {
  section: string;
  items: Array<{ n: string; c: string; w: string; p: string }>;
};

export const weeks: Week[] = [
{
  title: "Week 1 · June 22–28",
  subtitle: "Welcome Week + Moulin Rouge! 🎭💕",
  days: [
    { id:"d01", date:"Jun 22", day:"Mon", type:"arrival", tag:"💌 Arrival", emoji:"🛬",
      title:"She Arrives in DC!",
      desc:"The beginning of our summer together. Welcome to Washington, DC! Keep the day soft: airport pickup, flowers, her favorite snacks, a simple dinner, and a gentle 15–20 minute reunion walk. ✨",
      isSurprise:true,
      secretNote:"Take at least a half day off work. Set up her room before she lands — fresh flowers, her fav snacks, a handwritten love letter, and a printed DC map with all your planned spots circled in red hearts. Play her favourite song when she walks in. Keep the evening calm; after two months apart, presence matters more than activity. 💌",
      cost:"~$35" },

    { id:"d02", date:"Jun 23", day:"Tue", type:"evening", tag:"☕ Cafe Walk", emoji:"☕",
      title:"Slow Cafe Date + Reunion Walk",
      desc:"First full day together after two months apart. After work, take her to a cozy cafe or casual dinner, then do a 25–40 minute walk with no rushing. Theme for the walk: what we missed most about each other.",
      isSurprise:true,
      secretNote:"Do not over-plan this day. Let it feel like coming back to each other. Ask her one sweet question during the walk: 'What was the hardest part of the last two months?'",
      cost:"~$35–$60" },

    { id:"d03", date:"Jun 24", day:"Wed", type:"evening", tag:"🛍️ Mosaic", emoji:"🛍️",
      title:"Mosaic Shopping + Dessert Walk",
      desc:"Easy after-work date at Mosaic: window shopping, small bites or dinner, dessert, and a relaxed walk around the district. Keep it cute, light, and not too late because Thursday is the big musical night.",
      isSurprise:true,
      secretNote:"This is a good day to notice what she likes while shopping — jewelry style, perfume, books, clothes, little things. Save that info for a later surprise gift.",
      cost:"~$50–$100" },

    { id:"d04", date:"Jun 25", day:"Thu", type:"special", tag:"🎭 Musical", emoji:"🎭",
      title:"Moulin Rouge! Date Night at Kennedy Center",
      desc:"Locked in: Moulin Rouge! The Musical at Kennedy Center, 7:30pm. Make this the first big romantic anchor of the trip. Leave work early if possible, dress up, get dinner or small plates before the show, arrive early, take photos, and do a short Potomac/Kennedy Center walk after.",
      isSurprise:true,
      secretNote:"Treat this like the 'wow, he planned this for me' night. Suggested flow: 4:30pm get ready, 5:15pm leave Fairfax, 6:00pm dinner near Foggy Bottom/West End, 7:00pm arrive at Kennedy Center, 7:30pm show. After the show, do not rush home immediately — take a quiet 10–15 minute walk and tell her you wanted the first week to feel special.",
      cost:"Tickets booked + ~$80–$160 dinner/parking" },

    { id:"d05", date:"Jun 26", day:"Fri", type:"away", tag:"🚗 Cabin", emoji:"🌲",
      title:"Leave for Shenandoah Cabin Weekend",
      desc:"Head out Friday afternoon for a cozy cabin weekend near Shenandoah. Pack easy food, layers, hiking shoes, a speaker, and one small surprise for the cabin. Keep arrival night simple: check in, settle in, dinner, and a quiet night under the trees.",
      isSurprise:true,
      secretNote:"Prep the car before work if possible: groceries, chargers, toiletries, cozy blanket, and one handwritten cabin note. Leave as early in the afternoon as work allows so the first night does not feel rushed.",
      cost:"TBD (cabin + gas + groceries)" },

    { id:"d06", date:"Jun 27", day:"Sat", type:"away", tag:"🏞️ Shenandoah", emoji:"🏞️",
      title:"Shenandoah Cabin Day",
      desc:"Full cabin day in Shenandoah: slow breakfast, scenic drive or an easy hike, picnic snacks, golden-hour overlook, and a cozy dinner back at the cabin. Keep the pace romantic and flexible instead of trying to do too much.",
      isSurprise:true,
      secretNote:"Pick one easy-to-moderate trail or overlook ahead of time, then leave room for naps and unplanned time. Bring a blanket for an overlook photo and save one quiet toast for the evening.",
      cost:"~$60–$120" },

    { id:"d07", date:"Jun 28", day:"Sun", type:"away", tag:"🚗 Return", emoji:"🌄",
      title:"Slow Cabin Morning + Return Home",
      desc:"Slow final cabin morning: coffee, breakfast, tidy up, one last scenic stop or overlook, then return home Sunday evening. Keep the night light once back: unpack, laundry if needed, and an easy dinner.",
      isSurprise:true,
      secretNote:"Before leaving, take one photo outside the cabin and ask what her favorite moment of the weekend was. Build in enough drive time to avoid returning exhausted.",
      cost:"~$40–$90" },
  ]
},
{
  title: "Week 2 · June 29 – July 6", subtitle: "Plans TBD",
  days: [
    { id:"d08", date:"Jun 29", day:"Mon", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jun 29 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d09", date:"Jun 30", day:"Tue", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jun 30 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d10", date:"Jul 1", day:"Wed", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 1 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d11", date:"Jul 2", day:"Thu", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 2 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d12", date:"Jul 3", day:"Fri", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 3 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d13", date:"Jul 4", day:"Sat", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 4 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d14", date:"Jul 5", day:"Sun", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 5 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d14b", date:"Jul 6", day:"Mon", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 6 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
  ]
},
{
  title: "Week 3 · July 7–12", subtitle: "DC Wrap-Up + Chicago Stop",
  days: [
    { id:"d15", date:"Jul 7", day:"Tue", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 7 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d16", date:"Jul 8", day:"Wed", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 8 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d17", date:"Jul 9", day:"Thu", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 9 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d18", date:"Jul 10", day:"Fri", type:"away", tag:"🚗 Road Trip", emoji:"🚗",
      title:"Leave DC",
      desc:"Road trip departure day. Leave DC and start the Midwest drive with snacks, playlists, and the car packed for the long stretch toward Chicago.",
      isSurprise:true,
      secretNote:"Pack the car the night before so the morning can stay calm. Keep the road trip playlist ready and put the best snacks within reach.",
      cost:"~$100 (gas + food)" },
    { id:"d19", date:"Jul 11", day:"Sat", type:"away", tag:"🏙️ Chicago", emoji:"🏠",
      title:"Chicago — Stay at Nadine and Marina's",
      desc:"Arrive in Chicago and stay at Nadine and Marina's place. Keep the evening easy after the long drive: dinner, catching up, and a proper night's rest.",
      isSurprise:true,
      secretNote:"Bring a small host gift or dessert for Nadine and Marina. It makes the stop feel intentional, not just practical.",
      cost:"~$60" },
    { id:"d20", date:"Jul 12", day:"Sun", type:"away", tag:"🚗 Road Trip", emoji:"🥐",
      title:"Brunch with Nay and Marina → St. Paul",
      desc:"Have brunch with Nay and Marina, then leave around 10am for St. Paul. The drive is about 6 hours, so plan for one relaxed stop and an easy arrival.",
      isSurprise:true,
      secretNote:"Keep the St. Paul arrival low-effort: groceries, bags inside, then a simple dinner and early night.",
      cost:"~$90 (gas + food)" },
  ]
},
{
  title: "Week 4 · July 13–19", subtitle: "Working from St. Paul + Grand Marais Birthday",
  days: [
    { id:"d21", date:"Jul 13", day:"Mon", type:"away", tag:"💻 St. Paul", emoji:"💻",
      title:"Work from St. Paul",
      desc:"First workday based in St. Paul. Keep the evening simple: settle in, reset the bags, and make the place feel comfortable for the week.",
      isSurprise:true,
      secretNote:"Find one small local treat or coffee spot nearby so the workweek still feels like part of the trip.",
      cost:"~$30" },
    { id:"d22", date:"Jul 14", day:"Tue", type:"away", tag:"💻 St. Paul", emoji:"☕",
      title:"Work from St. Paul",
      desc:"Remote workday from St. Paul. Coffee, focused work blocks, and an easy evening walk or dinner nearby after laptops close.",
      isSurprise:true,
      secretNote:"Quietly note a good St. Paul dinner option in case the day runs long and decisions need to be easy.",
      cost:"~$35" },
    { id:"d23", date:"Jul 15", day:"Wed", type:"away", tag:"💻 St. Paul", emoji:"💻",
      title:"Work from St. Paul",
      desc:"Midweek workday from St. Paul. Keep plans light and protect the evening for rest, laundry, or a low-key dinner.",
      cost:"~$30" },
    { id:"d24", date:"Jul 16", day:"Thu", type:"away", tag:"💻 St. Paul", emoji:"🎒",
      title:"Work from St. Paul + Pack for Grand Marais",
      desc:"Final St. Paul workday before the birthday weekend. Pack for Grand Marais, confirm the grocery list, and get ready for the Friday off-day drive.",
      isSurprise:true,
      secretNote:"Prep a small birthday-weekend bag with cozy layers, lake essentials, and anything that should not be forgotten in the morning.",
      cost:"~$25" },
    { id:"d25", date:"Jul 17", day:"Fri", type:"away", tag:"🚗 Grand Marais", emoji:"🛒",
      title:"Off Day — St. Paul → Grand Marais",
      desc:"Leave St. Paul around 10am for Grand Marais. Pick up groceries on the way, arrive on the North Shore, and check in at 4pm.",
      cost:"~$120 (gas + groceries)" },
    { id:"d26", date:"Jul 18", day:"Sat", type:"away", tag:"🎉 Birthday!", emoji:"🎉",
      title:"Grand Marais Birthday Celebration — Day 1",
      desc:"Birthday celebration in Grand Marais with the group. Lake Superior, shared meals, easy exploring, and a full day dedicated to celebrating.",
      isSurprise:true,
      secretNote:"Help coordinate one group toast or birthday moment so the day feels gathered and special.",
      cost:"~$80" },
    { id:"d27", date:"Jul 19", day:"Sun", type:"away", tag:"🎉 Birthday!", emoji:"🎉",
      title:"Grand Marais Birthday Celebration — Day 2",
      desc:"Second day of the birthday weekend in Grand Marais. Keep it flexible: slow morning, lake time, food with friends, and a relaxed final night.",
      isSurprise:true,
      secretNote:"Save one quiet moment for just the two of you away from the group, even if it is only a short walk by the water.",
      cost:"~$80" },
  ]
},
{
  title: "Week 5 · July 20–26", subtitle: "Back to St. Paul + Plans TBD",
  days: [
    { id:"d28", date:"Jul 20", day:"Mon", type:"away", tag:"🚗 Road Trip", emoji:"🌲",
      title:"Check Out + Slowly Head Back to St. Paul",
      desc:"Check out at 11am, then take the slow route back toward St. Paul. No rush: stop when it feels right and let the birthday weekend wind down gently.",
      isSurprise:true,
      secretNote:"Print or save one favourite photo from Grand Marais before the workweek starts again.",
      cost:"~$70 (gas + food)" },
    { id:"d29", date:"Jul 21", day:"Tue", type:"away", tag:"💻 St. Paul", emoji:"💻",
      title:"Work from St. Paul",
      desc:"Back to work from St. Paul after Grand Marais. Keep the day practical and the evening easy.",
      cost:"~$30" },
    { id:"d30", date:"Jul 22", day:"Wed", type:"away", tag:"💻 St. Paul", emoji:"☕",
      title:"Work from St. Paul",
      desc:"Remote workday from St. Paul. Build in a simple coffee run or short walk so it does not feel like a lost travel day.",
      isSurprise:true,
      secretNote:"Have one backup dinner idea ready so the evening stays frictionless.",
      cost:"~$30" },
    { id:"d31", date:"Jul 23", day:"Thu", type:"away", tag:"💻 St. Paul", emoji:"💻",
      title:"Work from St. Paul",
      desc:"Final listed St. Paul workday. Close out the workweek logistics and make sure the next travel step is clear.",
      cost:"~$30" },
    { id:"d32", date:"Jul 24", day:"Fri", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 24 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d33", date:"Jul 25", day:"Sat", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 25 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d34", date:"Jul 26", day:"Sun", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 26 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
  ]
},
{
  title: "Week 6 · July 27 – August 2", subtitle: "Plans TBD + Wisconsin Birthday",
  days: [
    { id:"d35", date:"Jul 27", day:"Mon", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 27 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d36", date:"Jul 28", day:"Tue", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 28 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d37", date:"Jul 29", day:"Wed", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 29 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d38", date:"Jul 30", day:"Thu", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Jul 30 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d39", date:"Jul 31", day:"Fri", type:"away", tag:"🚗 Road Trip", emoji:"🧀",
      title:"Drive St. Louis → Wisconsin",
      desc:"About 5–6 hours north from St. Louis into Wisconsin. The landscape shifts from flat to rolling green hills. Arrive in time for dinner and the pre-birthday excitement. 🎂",
      cost:"~$70 (gas + food)" },
    { id:"d40", date:"Aug 1", day:"Sat", type:"away", tag:"✈️ Away Trip", emoji:"🎂",
      title:"Wisconsin — Birthday Celebration Day 1!",
      desc:"A few days in Wisconsin for the birthday celebration — not staying the whole time, just heading over for the occasion. Great food, beautiful lakes, and good company. 🥂",
      cost:"~$100" },
    { id:"d41", date:"Aug 2", day:"Sun", type:"away", tag:"✈️ Away Trip", emoji:"🎉",
      title:"Wisconsin — Birthday Day 2 + Back to DC",
      desc:"Celebrations continue, then head back to DC. If near a lake, a morning swim before leaving.",
      isSurprise:true,
      secretNote:"Carve out 20 quiet minutes from the group just for the two of you — a walk, a coffee. She'll feel it. In group trips, those private moments matter most.",
      cost:"~$80" },
  ]
},
{
  title: "Week 7 · August 3–9", subtitle: "Recovery Day + Plans TBD",
  days: [
    { id:"d42", date:"Aug 3", day:"Mon", type:"evening", tag:"🌙 Evening", emoji:"😴",
      title:"Road Trip Complete — Recovery Day",
      desc:"Home after the big DC → Grand Marais → Minneapolis → Chicago → St. Louis → Wisconsin loop. Unpack, rest, and let it all sink in. A gentle evening walk to the National Cathedral's Bishop's Garden, then home for dinner. 💛",
      cost:"~$20" },
    { id:"d43", date:"Aug 4", day:"Tue", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 4 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d44", date:"Aug 5", day:"Wed", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 5 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d45", date:"Aug 6", day:"Thu", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 6 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d46", date:"Aug 7", day:"Fri", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 7 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d47", date:"Aug 8", day:"Sat", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 8 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d48", date:"Aug 9", day:"Sun", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 9 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
  ]
},
{
  title: "Week 8 · August 10–16", subtitle: "Plans TBD",
  days: [
    { id:"d49", date:"Aug 10", day:"Mon", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 10 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d50", date:"Aug 11", day:"Tue", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 11 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d51", date:"Aug 12", day:"Wed", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 12 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d52", date:"Aug 13", day:"Thu", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 13 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d53", date:"Aug 14", day:"Fri", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 14 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d54", date:"Aug 15", day:"Sat", type:"tbd", tag:"🗓️ TBD", emoji:"🗓️",
      title:"Aug 15 — Plan TBD",
      desc:"Details still need to be planned. Replace this placeholder once the plan is realistic and confirmed.",
      cost:"TBD" },
    { id:"d55", date:"Aug 16", day:"Sun", type:"arrival", tag:"✈️ Goodbye", emoji:"💌",
      title:"She Flies Home — Make It Beautiful, Not Sad",
      desc:"Slow morning. Big breakfast. One last walk to her favourite DC spot. A warm send-off at the airport — hold her tight and don't let go too quickly. Until next time. 💖",
      isSurprise:true,
      secretNote:"Slip a sealed love letter into her bag before you leave for the airport. She opens it on the plane. Talk about your favourite memories, what she means to you, and what comes next. Make it count. This is what she carries home.",
      cost:"~$20" },
  ]
}
];

export const trips: Trip[] = [
  { type:"shenandoah",
    when:"June 26–28", icon:"🌲",
    title:"Shenandoah Cabin Weekend",
    subtitle:"Friday afternoon escape, Sunday evening return",
    items:[
      {i:"🚗",t:"Leave DC/NoVA on Friday, June 26 in the afternoon"},
      {i:"🏡",t:"Check into a cozy cabin near Shenandoah and keep the first night simple"},
      {i:"🥾",t:"Saturday: scenic drive, easy hike or overlook, picnic snacks, and cabin dinner"},
      {i:"🌄",t:"Sunday: slow breakfast, one final view, then return home by evening"},
      {i:"💕",t:"Make it quiet, romantic, and nature-focused after the first big week together"},
    ], cost:"TBD (cabin + gas + groceries)" },
  { type:"mn",
    when:"July 10–23", icon:"🚗",
    title:"The Great Midwest Road Trip",
    subtitle:"DC → Chicago → St. Paul → Grand Marais → St. Paul",
    items:[
      {i:"🚗",t:"Leave DC on Friday, July 10 and head toward Chicago"},
      {i:"🏠",t:"Chicago (Jul 11): Stay at Nadine and Marina's place"},
      {i:"🥐",t:"Jul 12: Brunch with Nay and Marina, then leave around 10am for St. Paul"},
      {i:"💻",t:"St. Paul (Jul 13–16): Work remotely"},
      {i:"🌲",t:"Grand Marais (Jul 17–20): Groceries, 4pm check-in, birthday celebration, 11am checkout"},
      {i:"💻",t:"St. Paul (Jul 21–23): Work remotely"},
    ], cost:"TBD (gas + food; lodging mix of friends/hosts)" },
  { type:"wi",
    when:"July 31 – August 3", icon:"🎂",
    title:"Wisconsin — Birthday Celebration",
    subtitle:"Final stop on the Midwest Road Trip",
    items:[
      {i:"🚗",t:"Arrive from St. Louis — last leg of the big road trip"},
      {i:"🎉",t:"Birthday celebration with friends"},
      {i:"🏊",t:"Wisconsin's beautiful lakes — swimming or kayaking if near the lake region"},
      {i:"🧀",t:"Wisconsin classics: cheese curds, Friday fish fry, craft beer"},
      {i:"💕",t:"Carve out private time just for the two of you among the group energy"},
      {i:"🏡",t:"August 3: recovery day after the trip"},
    ], cost:"Part of the overall road trip budget" },
];

export const eats: EatsSection[] = [
  { section:"🌟 Special Night Out", items:[
    {n:"Rasika",c:"Modern Indian · Penn Quarter",w:"James Beard award-winning. The palak chaat alone is worth it. Book 2+ weeks ahead.",p:"$$$"},
    {n:"Tail Up Goat",c:"Creative American · Adams Morgan",w:"Inventive, romantic, the best cocktails in DC. Perfect for a special splurge.",p:"$$$"},
    {n:"The Dabney",c:"Mid-Atlantic · Shaw",w:"Farm-to-table, cozy, fireplace. Deeply romantic. Very DC.",p:"$$$"},
    {n:"Bresca",c:"French Modern · 14th St NW",w:"Stunning plating, intimate setting. One of DC's most acclaimed restaurants.",p:"$$$$"},
  ]},
  { section:"💕 Romantic Vibes", items:[
    {n:"Compass Rose",c:"Global Street Food · 14th St NW",w:"Cozy, world-travels themed, amazing khachapuri and perfect cocktails.",p:"$$"},
    {n:"Filomena",c:"Italian · Georgetown",w:"Old-school Georgetown Italian — romantic atmosphere and great pasta.",p:"$$$"},
    {n:"Old Ebbitt Grill",c:"Classic American · Downtown",w:"Historic Victorian décor, great raw bar, perfect for a DC Sunday brunch date.",p:"$$"},
  ]},
  { section:"🎉 Fun & Lively", items:[
    {n:"Jaleo",c:"Spanish Tapas · Penn Quarter",w:"José Andrés' flagship — incredible tapas, sangria, and the best energy.",p:"$$"},
    {n:"Maketto",c:"Cambodian-Taiwanese · H Street NE",w:"Trendy, multicultural, great for an H Street corridor night out.",p:"$$"},
    {n:"China Chilcano",c:"Peruvian-Japanese · Penn Quarter",w:"Unique fusion, amazing cocktails, very cool space.",p:"$$"},
  ]},
  { section:"🍔 Casual & Local", items:[
    {n:"Ben's Chili Bowl",c:"American Classic · U Street",w:"DC institution since 1958. The chili half-smoke is a must-try.",p:"$"},
    {n:"Founding Farmers",c:"Farm-to-Table · Foggy Bottom",w:"Great brunch, huge portions. Also conveniently near Kennedy Center!",p:"$$"},
    {n:"Call Your Mother Deli",c:"Jewish Deli · Capitol Hill",w:"DC's most beloved deli — incredible bagels. Perfect solo lunch spot.",p:"$"},
  ]},
  { section:"🌍 Global Flavours", items:[
    {n:"Maydan",c:"Middle Eastern · 14th St NW",w:"Dramatic wood-fire open kitchen. Bold North African and Levantine flavors. Unmissable.",p:"$$"},
    {n:"Doi Moi",c:"Southeast Asian · 14th St NW",w:"Thai and Vietnamese inspired, great cocktails, always a great time.",p:"$$"},
    {n:"Rasika West End",c:"Modern Indian · West End",w:"Sister to Rasika, steps from Kennedy Center — perfect pre-show dinner.",p:"$$$"},
  ]},
  { section:"🗺️ Northern Virginia & Tysons", items:[
    {n:"Agora",c:"Turkish-Mediterranean · Tysons",w:"Mosaic lanterns, rich mezze, and an Ottoman-inspired menu. One of the most romantic atmospheres in all of NoVA — great for a special date night close to home.",p:"$$$"},
    {n:"The Naisho Room",c:"Speakeasy · Watermark Hotel, Tysons",w:"Hidden, reservation-only speakeasy inside The Watermark Hotel. Tokyo-inspired cocktails, low lighting, very exclusive. A perfect surprise — she won't know where you're taking her until you walk in.",p:"$$$"},
    {n:"Modan",c:"Modern Japanese · Tysons",w:"Sleek Japanese restaurant in a luxury Tysons high-rise — dry-aged fish, king salmon carpaccio with truffle aioli, and polished service. Great for a special night.",p:"$$$"},
    {n:"The Palm",c:"Classic Steakhouse · Tysons Corner",w:"The iconic American steakhouse. White tablecloths, exceptional service, and food that never disappoints. A proper date-night classic right at Tysons.",p:"$$$$"},
    {n:"Founding Farmers",c:"Farm-to-Table · Fairfax",w:"A Fairfax staple — great brunch, huge portions, local and sustainable. Perfect for a slow Sunday morning close to home before heading into DC.",p:"$$"},
  ]},
  { section:"☕ Cafes & Bakeries", items:[
    {n:"Tatte Bakery & Café",c:"Café & Bakery · Dupont / Georgetown / City Center",w:"Israeli-inspired pastries with stunning interiors — perfect for a slow Saturday morning. Multiple DC locations. The tahini croissant and shakshuka are both incredible.",p:"$"},
    {n:"Baked & Wired",c:"Bakery & Coffee · Georgetown",w:"DC's most beloved cupcake shop — giant, creative flavours and great coffee. A Georgetown must. Get there early before they sell out of the best ones.",p:"$"},
    {n:"Seylou",c:"Artisan Bakery · Blagden Alley",w:"Mills its own grain in-house, bakes in a wood-fired oven. The most interesting bakery in DC, tucked into Blagden Alley — the alley itself is beautiful and worth the detour.",p:"$"},
    {n:"Pluma",c:"Café · The Wharf + Union Market",w:"Warm, sophisticated café right at The Wharf. Perfect for a slow morning before your waterfront walk — specialty coffee and beautiful pastries.",p:"$"},
    {n:"Dog Tag Bakery",c:"Café & Bakery · Georgetown",w:"A nonprofit café that trains military veterans and their families. The story alone makes it worth a visit — and the pastries and sandwiches are genuinely great.",p:"$"},
    {n:"Compass Coffee",c:"Coffee · Multiple Locations",w:"DC's own specialty coffee chain. Consistently great, always cozy, and in the best neighbourhoods. The perfect pit-stop between museums or monuments.",p:"$"},
  ]},
];
