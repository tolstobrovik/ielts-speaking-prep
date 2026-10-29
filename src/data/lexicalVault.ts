export interface LexicalItem {
  id: string;
  term: string;
  category: 'Idiom' | 'Collocation' | 'Discourse Marker' | 'Academic Word';
  topic: 'General' | 'Technology' | 'Environment' | 'Society & Culture' | 'Work & Education';
  definition: string;
  bandLevel: 'Band 7' | 'Band 8' | 'Band 9';
  exampleSentence: string;
  alternativesForBand5: string[]; // e.g. replacing "very good" or "a lot of"
}

export const LEXICAL_VAULT: LexicalItem[] = [
  // Discourse markers & signposting
  {
    id: 'dm-1',
    term: 'By and large',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'On the whole; considering everything in general.',
    bandLevel: 'Band 8',
    exampleSentence: 'By and large, people in urban centers have traded tranquility for career expediency.',
    alternativesForBand5: ['Generally', 'Mostly', 'In most cases']
  },
  {
    id: 'dm-2',
    term: 'To put it into perspective',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'To compare something with a similar thing to give a clearer, more realistic idea of its magnitude.',
    bandLevel: 'Band 8',
    exampleSentence: 'To put it into perspective, one hour of flight burns as much fuel as an average commuter vehicle does over months.',
    alternativesForBand5: ['To explain clearly', 'For example']
  },
  {
    id: 'dm-3',
    term: 'On the flip side',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'Looking at the contrasting or opposite aspect of a situation.',
    bandLevel: 'Band 7',
    exampleSentence: 'Smart devices afford tremendous convenience; on the flip side, they subtly erode personal privacy.',
    alternativesForBand5: ['But', 'On the other hand', 'However']
  },
  {
    id: 'dm-4',
    term: 'I am somewhat in two minds about...',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'Holding conflicting or ambivalent opinions about a complex issue.',
    bandLevel: 'Band 8',
    exampleSentence: 'I am somewhat in two minds about artificial intelligence in schools: it sparks creativity, yet invites academic dishonesty.',
    alternativesForBand5: ['I am not sure', 'I think both yes and no']
  },
  {
    id: 'dm-5',
    term: 'Without a shadow of a doubt',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'Expressing complete, unwavering certainty.',
    bandLevel: 'Band 8',
    exampleSentence: 'Without a shadow of a doubt, renewable energy will be the pillar of the future economy.',
    alternativesForBand5: ['Definitely', 'Certainly', '100% sure']
  },
  {
    id: 'dm-6',
    term: 'Off the top of my head',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'Spontaneous recollection without meticulous prior reflection; a classic Band 9 spoken fluency marker.',
    bandLevel: 'Band 9',
    exampleSentence: 'Off the top of my head, I can recount at least three distinct instances where artificial intelligence saved me hours.',
    alternativesForBand5: ['Immediately', 'Right now', 'As I remember']
  },
  {
    id: 'dm-7',
    term: 'If my memory serves me right',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'Used when recollecting an event with polite conversational modesty; prime for Part 2 cue cards.',
    bandLevel: 'Band 9',
    exampleSentence: 'If my memory serves me right, it was during a blistering summer afternoon when we first embarked on the expedition.',
    alternativesForBand5: ['I remember that', 'In the past']
  },
  {
    id: 'dm-8',
    term: 'It really boils down to',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'To summarize the core, fundamental essence of a complex matter.',
    bandLevel: 'Band 9',
    exampleSentence: 'When all is said and done, it really boils down to individual accountability versus corporate liability.',
    alternativesForBand5: ['The main thing is', 'Basically']
  },
  {
    id: 'dm-9',
    term: 'Be that as it may',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'Formal concessive connective meaning "nevertheless" or "even if that is true".',
    bandLevel: 'Band 9',
    exampleSentence: 'Economic incentives are certainly persuasive; be that as it may, ethical considerations must take precedence.',
    alternativesForBand5: ['However', 'Even though that is true', 'But']
  },
  {
    id: 'dm-10',
    term: 'I am somewhat on the fence about...',
    category: 'Discourse Marker',
    topic: 'General',
    definition: 'Demonstrating nuanced intellectual balance rather than simplistic binary opinions.',
    bandLevel: 'Band 9',
    exampleSentence: 'I am somewhat on the fence about strict government bans; while they safeguard privacy, they stifle innovation.',
    alternativesForBand5: ['I don\'t know', 'I am not sure']
  },

  // Technology Collocations & Idioms
  {
    id: 'tech-1',
    term: 'Double-edged sword',
    category: 'Idiom',
    topic: 'Technology',
    definition: 'A situation or circumstance having both favorable and hazardous outcomes.',
    bandLevel: 'Band 8',
    exampleSentence: 'Algorithmic social feeds are a double-edged sword: they inform, yet cultivate anxiety.',
    alternativesForBand5: ['Has good and bad things', 'Mixed problem']
  },
  {
    id: 'tech-2',
    term: 'Technological obsolescence',
    category: 'Collocation',
    topic: 'Technology',
    definition: 'The process of technical equipment becoming outdated and replaced by newer innovations.',
    bandLevel: 'Band 9',
    exampleSentence: 'Consumer gadgets are engineered with planned obsolescence, compounding global e-waste.',
    alternativesForBand5: ['Getting old', 'Old gadgets']
  },
  {
    id: 'tech-3',
    term: 'At one\'s fingertips',
    category: 'Idiom',
    topic: 'Technology',
    definition: 'Readily and immediately available for use.',
    bandLevel: 'Band 7',
    exampleSentence: 'With mobile search engines, virtually all recorded human knowledge is right at our fingertips.',
    alternativesForBand5: ['Easy to find', 'Close to us', 'Very accessible']
  },
  {
    id: 'tech-4',
    term: 'Digital footprints',
    category: 'Collocation',
    topic: 'Technology',
    definition: 'The trail of data and personal metadata left behind by digital interactions.',
    bandLevel: 'Band 8',
    exampleSentence: 'Young users frequently disregard the permanent implications of their online digital footprints.',
    alternativesForBand5: ['Internet history', 'Online track']
  },

  // Environment & Nature
  {
    id: 'env-1',
    term: 'Take a heavy toll on',
    category: 'Idiom',
    topic: 'Environment',
    definition: 'To cause substantial damage, suffering, or wear and tear over time.',
    bandLevel: 'Band 8',
    exampleSentence: 'Uncontrolled mass tourism has taken a devastating toll on fragile coral reefs.',
    alternativesForBand5: ['Hurt a lot', 'Damaged badly', 'Caused bad effects']
  },
  {
    id: 'env-2',
    term: 'Pristine wilderness',
    category: 'Collocation',
    topic: 'Environment',
    definition: 'An untouched, completely unpolluted and unspoiled natural habitat.',
    bandLevel: 'Band 9',
    exampleSentence: 'We trekked into the pristine wilderness far beyond the reach of tourist amenities.',
    alternativesForBand5: ['Clean nature', 'Pure forest', 'Nice outdoors']
  },
  {
    id: 'env-3',
    term: 'Drop in the ocean',
    category: 'Idiom',
    topic: 'Environment',
    definition: 'A tiny, almost insignificant amount compared to what is needed.',
    bandLevel: 'Band 7',
    exampleSentence: 'Individual recycling efforts, while admirable, are merely a drop in the ocean without industrial reform.',
    alternativesForBand5: ['A very small part', 'Not enough']
  },
  {
    id: 'env-4',
    term: 'Irreversible ecological degradation',
    category: 'Academic Word',
    topic: 'Environment',
    definition: 'Permanent damage to biological environments that cannot be restored.',
    bandLevel: 'Band 9',
    exampleSentence: 'Deforestation in the Amazon risks triggering irreversible ecological degradation.',
    alternativesForBand5: ['Permanent nature damage', 'Forest destruction']
  },

  // Work & Education
  {
    id: 'work-1',
    term: 'Steep learning curve',
    category: 'Idiom',
    topic: 'Work & Education',
    definition: 'A steep climb in acquiring difficult knowledge or mastering a complex task quickly.',
    bandLevel: 'Band 8',
    exampleSentence: 'Transitioning to senior management presented an exceptionally steep learning curve.',
    alternativesForBand5: ['Hard to learn', 'Difficult at first']
  },
  {
    id: 'work-2',
    term: 'Climb the corporate ladder',
    category: 'Idiom',
    topic: 'Work & Education',
    definition: 'To advance professionally through promotions within an organization.',
    bandLevel: 'Band 7',
    exampleSentence: 'Many young professionals prioritize climbing the corporate ladder over work-life balance.',
    alternativesForBand5: ['Get promoted', 'Get higher job position']
  },
  {
    id: 'work-3',
    term: 'Lifelong pedagogical enrichment',
    category: 'Academic Word',
    topic: 'Work & Education',
    definition: 'Continuous learning and educational improvement throughout one’s life.',
    bandLevel: 'Band 9',
    exampleSentence: 'Modern career longevity necessitates a mindset of lifelong pedagogical enrichment.',
    alternativesForBand5: ['Continuous studying', 'Learning when older']
  },
  {
    id: 'work-4',
    term: 'Burn the candle at both ends',
    category: 'Idiom',
    topic: 'Work & Education',
    definition: 'To exhaust one’s energy by working late hours and waking up early.',
    bandLevel: 'Band 8',
    exampleSentence: 'Exam season often forces university undergraduates to burn the candle at both ends.',
    alternativesForBand5: ['Work too hard', 'Sleep very little']
  },

  // Society & Culture
  {
    id: 'soc-1',
    term: 'Homogenizing juggernaut',
    category: 'Collocation',
    topic: 'Society & Culture',
    definition: 'An overwhelming force that makes everything uniform and strips away unique traits.',
    bandLevel: 'Band 9',
    exampleSentence: 'Commercial globalization has acted as a homogenizing juggernaut on regional cuisine.',
    alternativesForBand5: ['Making everything the same', 'Global pressure']
  },
  {
    id: 'soc-2',
    term: 'Stand the test of time',
    category: 'Idiom',
    topic: 'Society & Culture',
    definition: 'To remain valued, functional, or respected across generations.',
    bandLevel: 'Band 8',
    exampleSentence: 'Classical architectural designs continue to stand the test of time.',
    alternativesForBand5: ['Stay popular forever', 'Last for a long time']
  },
  {
    id: 'soc-3',
    term: 'Cross-cultural empathy',
    category: 'Academic Word',
    topic: 'Society & Culture',
    definition: 'The ability to genuinely appreciate and emotionally understand people from different backgrounds.',
    bandLevel: 'Band 9',
    exampleSentence: 'Living abroad cultivates genuine cross-cultural empathy and tolerance.',
    alternativesForBand5: ['Understanding other cultures', 'Respecting foreign people']
  },
  {
    id: 'soc-4',
    term: 'Part and parcel',
    category: 'Idiom',
    topic: 'Society & Culture',
    definition: 'An essential, unavoidable component of something.',
    bandLevel: 'Band 7',
    exampleSentence: 'Dealing with occasional culture shock is part and parcel of international travel.',
    alternativesForBand5: ['A normal part', 'Included in it']
  },
  {
    id: 'b9-1',
    term: 'A far cry from',
    category: 'Idiom',
    topic: 'General',
    definition: 'Very different from; substantially distant in quality or nature.',
    bandLevel: 'Band 9',
    exampleSentence: 'Modern smartphone capabilities are a far cry from the rudimentary handsets we possessed a decade ago.',
    alternativesForBand5: ['Very different from', 'Not like before']
  },
  {
    id: 'b9-2',
    term: 'The elephant in the room',
    category: 'Idiom',
    topic: 'General',
    definition: 'A major, unmistakable problem or controversial topic that everyone is aware of but avoids discussing.',
    bandLevel: 'Band 9',
    exampleSentence: 'Rising mental fatigue among remote workers remains the undeniable elephant in the room.',
    alternativesForBand5: ['The big problem', 'The hidden issue']
  },
  {
    id: 'b9-3',
    term: 'Par for the course',
    category: 'Idiom',
    topic: 'Work & Education',
    definition: 'What is normally to be expected under standard circumstances.',
    bandLevel: 'Band 9',
    exampleSentence: 'Working unpaid overtime has unfortunately become par for the course in many hyper-competitive tech firms.',
    alternativesForBand5: ['Normal', 'Standard', 'Expected']
  },
  {
    id: 'b9-4',
    term: 'On the spur of the moment',
    category: 'Idiom',
    topic: 'General',
    definition: 'Acting spontaneously on impulse without premeditated planning.',
    bandLevel: 'Band 8',
    exampleSentence: 'We resolved to embark on the road trip on the spur of the moment, with barely any luggage in tow.',
    alternativesForBand5: ['Suddenly', 'Without planning']
  },
  {
    id: 'b9-5',
    term: 'Take it with a pinch of salt',
    category: 'Idiom',
    topic: 'Society & Culture',
    definition: 'To maintain healthy skepticism rather than blindly believing claims.',
    bandLevel: 'Band 9',
    exampleSentence: 'Information disseminated across unverified social feeds should invariably be taken with a healthy pinch of salt.',
    alternativesForBand5: ['Don\'t believe 100%', 'Be careful with news']
  },
  {
    id: 'b9-6',
    term: 'Pave the way for',
    category: 'Collocation',
    topic: 'Technology',
    definition: 'To create foundational conditions that enable future breakthroughs.',
    bandLevel: 'Band 9',
    exampleSentence: 'Pioneering algorithmic research has paved the way for unprecedented medical diagnostic precision.',
    alternativesForBand5: ['Helped create', 'Made it possible']
  },
  {
    id: 'b9-7',
    term: 'Food for thought',
    category: 'Idiom',
    topic: 'General',
    definition: 'An intellectual idea that prompts profound reflection.',
    bandLevel: 'Band 8',
    exampleSentence: 'The lecturer’s provocative hypothesis certainly provided tremendous food for thought.',
    alternativesForBand5: ['Made me think a lot', 'Interesting idea']
  }
];
