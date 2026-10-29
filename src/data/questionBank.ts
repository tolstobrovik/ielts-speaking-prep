import { IELTSExamTopicSet, IELTSQuestion } from '../types/ielts';

export const AUTHENTIC_EXAM_SETS: IELTSExamTopicSet[] = [
  {
    id: 'set-tech-ai',
    theme: 'Artificial Intelligence & Future Technology',
    title: 'Technology & Human Connection',
    difficulty: 'High Frequency',
    part1Questions: [
      {
        id: 'tech-p1-1',
        part: 1,
        topic: 'Technology in Daily Life',
        prompt: 'How often do you use technology in your day-to-day routine?',
        modelAnswerBand8: "Practically without interruption, I would say. From the crack of dawn when my digital smartwatch wakes me with a gentle vibration, right through to managing complex spreadsheets and video conferences for work. It has essentially become second nature and fundamentally woven into the fabric of my daily existence.",
        keyVocabulary: ['second nature', 'crack of dawn', 'indispensable', 'interwoven', 'streamline'],
        idiomaticExpressions: ['part and parcel', 'woven into the fabric of', 'at my fingertips'],
        discourseMarkers: ['Practically speaking', 'Right through to', 'To be perfectly frank'],
        tips: "Avoid robotic short answers like 'I use my phone every day.' Expand by detailing specific routines and using natural adverbs."
      },
      {
        id: 'tech-p1-2',
        part: 1,
        topic: 'Technology in Daily Life',
        prompt: 'Do you prefer sending text messages or making phone calls?',
        modelAnswerBand8: "It genuinely hinges on the context. If it's a spontaneous update or trivial banter with acquaintances, messaging via instant apps is far more expedient. However, when nuance or emotional rapport is called for—or when sorting out time-sensitive emergencies—nothing quite surpasses hearing someone's authentic tone over a voice call.",
        keyVocabulary: ['hinges on', 'expedient', 'emotional rapport', 'time-sensitive', 'surpasses'],
        idiomaticExpressions: ['trivial banter', 'hear it straight from the horse’s mouth', 'in the blink of an eye'],
        discourseMarkers: ['It genuinely hinges on', 'On the other hand', 'Having said that'],
        tips: "Demonstrate contrast using complex conditional structures ('It hinges on...', 'Whereas if...')."
      },
      {
        id: 'tech-p1-3',
        part: 1,
        topic: 'Technology in Daily Life',
        prompt: 'Have technological changes made your life easier or more complicated?',
        modelAnswerBand8: "I'd argue it's a double-edged sword. While state-of-the-art software indisputably eliminates mundane administrative burdens, the hyper-connectivity also exerts persistent mental fatigue. We're virtually perpetually on-call, which can blur the boundary between leisure and occupational duties.",
        keyVocabulary: ['double-edged sword', 'hyper-connectivity', 'mundane', 'mental fatigue', 'blur the boundary'],
        idiomaticExpressions: ['a mixed blessing', 'around the clock', 'run oneself ragged'],
        discourseMarkers: ['I would argue that', 'While indisputably', 'Consequently'],
        tips: "Using idiomatic phrases like 'double-edged sword' or 'mixed blessing' immediately signals Band 7+ Lexical Resource."
      }
    ],
    part2CueCard: {
      id: 'tech-p2-cue',
      part: 2,
      topic: 'An Impactful Technological Innovation',
      prompt: 'Describe a piece of technology or an application that you find remarkably useful.',
      subPrompts: [
        'What the technology or application is',
        'When and how you first discovered it',
        'How frequently you utilize it and for what purposes',
        'And explain why you consider it to be so transformative in your life.'
      ],
      modelAnswerBand8: "I would like to talk about an AI-driven language and research assistant known as Gemini. I stumbled upon it roughly a year and a half ago when I was grappling with a massive research thesis that required synthesizing hundreds of academic journals.\n\nAt first, I was rather cynical, assuming it was simply a gimmicky chatbot. However, once I integrated it into my daily workflow, it proved to be nothing short of a game-changer. I rely on it virtually on a daily basis, predominantly for brainstorming intricate concepts, cross-referencing complex data, and debugging intricate code snippets.\n\nWhat makes this tool particularly indispensable is its multimodal versatility. Instead of sifting endlessly through disjointed search results, I can prompt it to summarize voluminous documents or pinpoint counterarguments in seconds. In essence, it acts as an intellectual sounding board that elevates my cognitive productivity rather than replacing critical thinking.",
      keyVocabulary: ['stumbled upon', 'grappling with', 'cynical', 'game-changer', 'multimodal versatility', 'sounding board'],
      idiomaticExpressions: ['nothing short of', 'sifting through', 'at the touch of a button', 'hit the ground running'],
      discourseMarkers: ['I would like to talk about', 'At first glance', 'However, once I integrated', 'In essence'],
      tips: "Cover all 4 bullet points systematically. Aim for 1 minute 45 seconds to 2 minutes. Use the 1-minute prep time to jot down keywords, not full sentences!"
    },
    part3Questions: [
      {
        id: 'tech-p3-1',
        part: 3,
        topic: 'Ethics & Society of Artificial Intelligence',
        prompt: 'To what extent do you believe artificial intelligence poses a threat to human employment?',
        modelAnswerBand8: "There is undeniable merit to the apprehension that generative automation will displace routine cognitive and manual labor. History demonstrates that industrial revolutions invariably engender short-term structural unemployment. Nonetheless, I subscribe to the view that AI will predominantly augment human ingenuity rather than outright obliterate professions, precipitating the emergence of brand new fields such as prompt engineering and algorithmic ethics.",
        keyVocabulary: ['undeniable merit', 'structural unemployment', 'augment', 'ingenuity', 'obliterate', 'precipitating'],
        idiomaticExpressions: ['the writing is on the wall', 'stand the test of time', 'usher in a new era'],
        discourseMarkers: ['There is undeniable merit to', 'Nonetheless', 'I subscribe to the view that'],
        tips: "Avoid personal stories ('My uncle lost his job'). Part 3 requires abstract, societal-level analysis and formal academic phrasing."
      },
      {
        id: 'tech-p3-2',
        part: 3,
        topic: 'Ethics & Society of Artificial Intelligence',
        prompt: 'Do you think governments should impose stricter regulations on tech conglomerates?',
        modelAnswerBand8: "Unquestionably. The unfettered monopolization of personal metadata by Silicon Valley tech giants raises profound ethical conundrums regarding surveillance capitalism and cognitive manipulation. Without stringent legislative guardrails, algorithmic echo chambers will continue polarizing democratic discourse and compromising citizen privacy.",
        keyVocabulary: ['unfettered', 'monopolization', 'surveillance capitalism', 'stringent guardrails', 'algorithmic echo chambers'],
        idiomaticExpressions: ['keep a tight rein on', 'nip it in the bud', 'level playing field'],
        discourseMarkers: ['Unquestionably', 'Without stringent', 'Consequently'],
        tips: "State a clear position, followed by the sociological consequence, and finish with a proposed solution or implication."
      },
      {
        id: 'tech-p3-3',
        part: 3,
        topic: 'Ethics & Society of Artificial Intelligence',
        prompt: 'How might education change for children growing up in an era dominated by AI?',
        modelAnswerBand8: "The traditional didactic model centered on rote memorization will inevitably become obsolete. Instead, pedagogical paradigms must pivot decisively toward fostering critical thinking, emotional intelligence, and epistemic skepticism—teaching students how to interrogate AI outputs rather than regurgitating textbook facts.",
        keyVocabulary: ['didactic model', 'rote memorization', 'obsolete', 'pedagogical paradigms', 'epistemic skepticism'],
        idiomaticExpressions: ['paradigmatic shift', 'second nature', 'food for thought'],
        discourseMarkers: ['Inevitably', 'Instead, pedagogical paradigms must', 'Rather than'],
        tips: "Use strong educational jargon ('pedagogical', 'didactic', 'rote learning', 'critical faculties')."
      }
    ]
  },
  {
    id: 'set-environment-travel',
    theme: 'Environmental Stewardship & Tourism',
    title: 'The Natural World & Sustainable Travel',
    difficulty: 'Challenging',
    part1Questions: [
      {
        id: 'env-p1-1',
        part: 1,
        topic: 'Weather & Seasons',
        prompt: 'What kind of weather do you enjoy the most?',
        modelAnswerBand8: "I have a strong penchant for crisp, overcast autumn afternoons. There is something delightfully tranquil about a cool breeze accompanied by amber-tinted foliage, especially in stark contrast to the oppressive, stifling humidity of midsummer.",
        keyVocabulary: ['penchant', 'crisp', 'overcast', 'amber-tinted foliage', 'stifling humidity'],
        idiomaticExpressions: ['a breath of fresh air', 'right up my street', 'rain or shine'],
        discourseMarkers: ['I have a strong penchant for', 'Especially in stark contrast to'],
        tips: "Use sensory adjectives (crisp, stifling, amber-tinted) to elevate your lexical score."
      },
      {
        id: 'env-p1-2',
        part: 1,
        topic: 'Weather & Seasons',
        prompt: 'Does the weather ever affect your emotional state?',
        modelAnswerBand8: "Without a shadow of a doubt. Gloomy, overcast skies over prolonged stretches can induce a mild sense of lethargy and melancholia. Conversely, radiant sunshine immediately invigorates my spirits and boosts my motivation to be physically active outdoors.",
        keyVocabulary: ['without a shadow of a doubt', 'lethargy', 'melancholia', 'invigorates', 'radiant'],
        idiomaticExpressions: ['down in the dumps', 'walking on sunshine', 'under the weather'],
        discourseMarkers: ['Without a shadow of a doubt', 'Over prolonged stretches', 'Conversely'],
        tips: "Contrast both positive and negative reactions using vivid vocabulary."
      },
      {
        id: 'env-p1-3',
        part: 1,
        topic: 'Weather & Seasons',
        prompt: 'Do you prefer spending your holidays in nature or in big cities?',
        modelAnswerBand8: "Undoubtedly the former. Living in a densely populated metropolis surrounded by concrete high-rises makes escaping to pristine wilderness or rugged coastal trails completely rejuvenating for the soul. It's the ultimate antidote to urban burnout.",
        keyVocabulary: ['densely populated metropolis', 'pristine wilderness', 'rejuvenating', 'antidote', 'burnout'],
        idiomaticExpressions: ['off the beaten track', 'recharge one\'s batteries', 'the great outdoors'],
        discourseMarkers: ['Undoubtedly the former', 'Surrounded by', 'It serves as the ultimate'],
        tips: "'The former' / 'The latter' show high grammatical dexterity."
      }
    ],
    part2CueCard: {
      id: 'env-p2-cue',
      part: 2,
      topic: 'A Memorable Natural Place',
      prompt: 'Describe a picturesque natural spot you have visited that left a lasting impression on you.',
      subPrompts: [
        'Where this place is located and when you went there',
        'Who accompanied you on the journey',
        'What you observed and engaged in while there',
        'And explain why this particular natural spot remains so memorable to you.'
      ],
      modelAnswerBand8: "Allow me to recount a journey to Lake Moraine, nestled deep within the Canadian Rockies, which I had the privilege of exploring two summers ago alongside my closest childhood confidant.\n\nFrom the moment we arrived at sunrise, the panorama was nothing short of spellbinding. The glacial meltwater possessed an electric, turquoise hue so vivid it looked virtually surreal, framed majestically by towering, snow-dusted crags known as the Ten Peaks. We rented a wooden canoe and paddled quietly across the glass-like water, surrounded by absolute silence save for the occasional call of an osprey.\n\nWhat truly etched this destination into my memory was the overwhelming sense of perspective it imparted. In our frenetic urban lives, we get so bogged down by trivial deadlines; yet standing before geological wonders that have endured for millennia puts all your anxieties in perspective. It was a deeply humbling, restorative experience.",
      keyVocabulary: ['nestled deep', 'spellbinding', 'glacial meltwater', 'turquoise hue', 'snow-dusted crags', 'frenetic', 'humbling'],
      idiomaticExpressions: ['nothing short of', 'etched into my memory', 'bogged down', 'puts things in perspective'],
      discourseMarkers: ['Allow me to recount', 'From the moment', 'What truly etched', 'In essence'],
      tips: "Use storytelling cadence with rich visual imagery and reflective depth."
    },
    part3Questions: [
      {
        id: 'env-p3-1',
        part: 3,
        topic: 'Sustainable Tourism & Ecology',
        prompt: 'What are the environmental ramifications of mass international tourism on delicate ecosystems?',
        modelAnswerBand8: "The repercussions are multifaceted and deeply concerning. Unregulated footfall in biodiversity hotspots inevitably leads to soil erosion, habitat fragmentation, and excessive carbon emissions from aviation. Furthermore, the commercial infrastructure erected to cater to hordes of travelers often depletes local aquifer reserves and pollutes marine habitats.",
        keyVocabulary: ['multifaceted', 'unregulated footfall', 'habitat fragmentation', 'aquifer reserves', 'depletes'],
        idiomaticExpressions: ['take a heavy toll', 'double-edged sword', 'spillover effects'],
        discourseMarkers: ['The repercussions are multifaceted', 'Inevitably leads to', 'Furthermore'],
        tips: "Group impacts into categories (geological, biological, resource depletion)."
      },
      {
        id: 'env-p3-2',
        part: 3,
        topic: 'Sustainable Tourism & Ecology',
        prompt: 'Should local governments restrict the number of tourists admitted to natural heritage sites?',
        modelAnswerBand8: "I am unequivocally in favor of such quotas. Implementing daily visitor ceilings, paired with eco-tariffs, not only preserves vulnerable topography but also enhances the experiential quality for conscientious visitors. Places like Machu Picchu and the Galapagos Islands have demonstrated that sustainable conservation must supersede short-term commercial windfall.",
        keyVocabulary: ['unequivocally', 'visitor ceilings', 'eco-tariffs', 'topography', 'supersede', 'commercial windfall'],
        idiomaticExpressions: ['strike a delicate balance', 'nip it in the bud', 'kill the goose that lays the golden egg'],
        discourseMarkers: ['I am unequivocally in favor of', 'Not only... but also', 'Has demonstrated that'],
        tips: "Mentioning concrete real-world precedents (e.g. Galapagos, Machu Picchu) shows intellectual maturity."
      },
      {
        id: 'env-p3-3',
        part: 3,
        topic: 'Sustainable Tourism & Ecology',
        prompt: 'Who bears greater accountability for combating climate change: individual citizens or multinational corporations?',
        modelAnswerBand8: "While grassroots consumer choices certainly play a symbolic role, the lion's share of responsibility unequivocally rests upon multinational conglomerates and legislative bodies. Over seventy percent of global carbon emissions originate from a handful of fossil fuel extraction entities. Therefore, systemic statutory reform and punitive carbon taxes will yield far more tangible progress than merely urging individuals to recycle plastic straws.",
        keyVocabulary: ['lion\'s share', 'grassroots', 'conglomerates', 'statutory reform', 'punitive carbon taxes', 'tangible'],
        idiomaticExpressions: ['the lion’s share', 'drop in the ocean', 'pass the buck'],
        discourseMarkers: ['While grassroots choices certainly', 'Unequivocally rests upon', 'Therefore, systemic reform'],
        tips: "Avoid 'both are equal' fence-sitting. Take an analytical stance supported by structural arguments."
      }
    ]
  },
  {
    id: 'set-work-education',
    theme: 'Career Ambitions & Modern Education',
    title: 'Workplace Evolution & Lifelong Learning',
    difficulty: 'Standard',
    part1Questions: [
      {
        id: 'work-p1-1',
        part: 1,
        topic: 'Work or Study',
        prompt: 'Are you currently working or are you a student?',
        modelAnswerBand8: "At present, I am actively engaged as a software engineer at a fintech startup. I transitioned into this role roughly two years back after wrapping up my degree in Computer Science, and it's been an extraordinarily steep yet gratifying learning curve.",
        keyVocabulary: ['actively engaged', 'fintech startup', 'transitioned into', 'steep learning curve', 'gratifying'],
        idiomaticExpressions: ['steep learning curve', 'wear many hats', 'hit the ground running'],
        discourseMarkers: ['At present', 'Roughly two years back', 'Needless to say'],
        tips: "Give your current occupation + background context + reflective feeling in 3 structured sentences."
      },
      {
        id: 'work-p1-2',
        part: 1,
        topic: 'Work or Study',
        prompt: 'What do you find most rewarding about your current occupation or course?',
        modelAnswerBand8: "Without question, it's the intellectual problem-solving aspect. Deconstructing convoluted algorithmic hurdles and turning theoretical code into seamless user experiences gives me an immense sense of accomplishment that monetary compensation alone cannot replicate.",
        keyVocabulary: ['intellectual problem-solving', 'deconstructing convoluted', 'algorithmic hurdles', 'monetary compensation'],
        idiomaticExpressions: ['sense of accomplishment', 'second to none', 'fuel my passion'],
        discourseMarkers: ['Without question', 'Turning theoretical code into', 'Alone cannot replicate'],
        tips: "Focus on intrinsic satisfaction rather than just pay or basic duties."
      },
      {
        id: 'work-p1-3',
        part: 1,
        topic: 'Work or Study',
        prompt: 'Do you foresee yourself changing your career trajectory in the coming decade?',
        modelAnswerBand8: "I wouldn't rule it out entirely. While I cherish the technical hands-on craftsmanship, I envision pivoting progressively toward strategic product management or perhaps mentoring budding entrepreneurs within the tech ecosystem.",
        keyVocabulary: ['career trajectory', 'rule it out', 'hands-on craftsmanship', 'pivoting progressively', 'budding entrepreneurs'],
        idiomaticExpressions: ['keep my options open', 'climb the corporate ladder', 'spread one\'s wings'],
        discourseMarkers: ['I wouldn’t rule it out entirely', 'While I cherish', 'I envision pivoting'],
        tips: "Use future modal verbs and tentative expressions ('I wouldn't rule it out', 'I envision pivoting')."
      }
    ],
    part2CueCard: {
      id: 'work-p2-cue',
      part: 2,
      topic: 'A Skill That Required Perseverance',
      prompt: 'Describe a challenging skill that you learned and became proficient in.',
      subPrompts: [
        'What the skill is and why you resolved to master it',
        'How you approached the learning process',
        'What obstacles or frustrations you encountered along the way',
        'And explain how mastering this skill has influenced your confidence or worldview.'
      ],
      modelAnswerBand8: "The skill I'd like to spotlight is public speaking in English before large professional audiences. For the longest time, stepping onto a stage was my worst nightmare; my palms would sweat, my throat would constrict, and my mind would go completely blank.\n\nTo overcome this crippling phobia, I decided to take the bull by the horns about three years ago by joining a local Toastmasters club. My pedagogical strategy was deliberate exposure: I forced myself to deliver an impromptu speech every single fortnight, recorded every performance on video, and meticulously critiqued my vocal variety, eye contact, and body language.\n\nThe initial hurdle was handling unexpected questions during Q&A sessions without rambling incoherently. Gradually, through constructive feedback and breathing drills, I learned to pause deliberately rather than relying on filler sounds like 'um' or 'ah'.\n\nConquering this barrier has been utterly transformative. It dismantled the self-imposed ceiling on my career, enabling me to pitch ideas persuasively to senior executives and mentor junior peers with poise.",
      keyVocabulary: ['crippling phobia', 'take the bull by the horns', 'deliberate exposure', 'impromptu speech', 'meticulously critiqued', 'rambling incoherently', 'transformative', 'poise'],
      idiomaticExpressions: ['take the bull by the horns', 'worst nightmare', 'mind goes blank', 'break through the ceiling'],
      discourseMarkers: ['The skill I would like to spotlight', 'To overcome this', 'The initial hurdle was', 'Conquering this barrier has been'],
      tips: "Structure: Introduction -> Initial struggle -> Step-by-step strategy -> Milestone / turning point -> Long-term transformation."
    },
    part3Questions: [
      {
        id: 'work-p3-1',
        part: 3,
        topic: 'Future of Work & Lifelong Education',
        prompt: 'Is a university degree becoming less relevant in the contemporary job market?',
        modelAnswerBand8: "I believe formal tertiary education is undergoing a fundamental recalibration. For regulated professions like medicine, civil engineering, or law, accredited university degrees remain an indispensable prerequisite. However, in agile sectors such as digital media, software architecture, and entrepreneurship, demonstrable portfolios, micro-credentials, and adaptive problem-solving skills carry substantially more currency than a four-year diploma.",
        keyVocabulary: ['recalibration', 'tertiary education', 'indispensable prerequisite', 'micro-credentials', 'carry currency'],
        idiomaticExpressions: ['carry more weight', 'par for the course', 'stand out from the crowd'],
        discourseMarkers: ['I believe formal education is', 'For regulated professions', 'However, in agile sectors'],
        tips: "Distinguish between heavily regulated professions and dynamic tech/creative industries."
      },
      {
        id: 'work-p3-2',
        part: 3,
        topic: 'Future of Work & Lifelong Education',
        prompt: 'How has the shift toward remote work reshaped corporate culture and employee well-being?',
        modelAnswerBand8: "It has yielded both remarkable liberties and subtle pathologies. On the positive side, eliminating strenuous commutes has granted professionals autonomy and temporal flexibility, which fosters a healthier work-life equilibrium. Conversely, the attenuation of serendipitous water-cooler chats often engenders feelings of social isolation and hinders organic mentorship for junior recruits.",
        keyVocabulary: ['remarkable liberties', 'subtle pathologies', 'strenuous commutes', 'work-life equilibrium', 'attenuation', 'serendipitous'],
        idiomaticExpressions: ['a double-edged sword', 'burn the candle at both ends', 'out of sight, out of mind'],
        discourseMarkers: ['It has yielded both', 'On the positive side', 'Conversely, the attenuation of'],
        tips: "Balance pros (flexibility, autonomy) against cons (isolation, lost mentorship)."
      },
      {
        id: 'work-p3-3',
        part: 3,
        topic: 'Future of Work & Lifelong Education',
        prompt: 'Should companies be legally mandated to subsidize ongoing skill retraining for their staff?',
        modelAnswerBand8: "From both an ethical and economic standpoint, establishing statutory retraining allowances makes eminent sense. In an era where technological half-lives are diminishing at breakneck speeds, corporations that extract productivity from their personnel have an obligation to safeguard their employability against obsolescence, creating a resilient, high-caliber workforce.",
        keyVocabulary: ['statutory allowances', 'eminent sense', 'technological half-lives', 'breakneck speeds', 'obsolescence', 'high-caliber'],
        idiomaticExpressions: ['pay dividends', 'ahead of the curve', 'future-proof'],
        discourseMarkers: ['From both an ethical and', 'In an era where', 'Therefore'],
        tips: "Frame your answer through institutional responsibility and economic resilience."
      }
    ]
  },
  {
    id: 'set-culture-society',
    theme: 'Culture, Traditions & Globalization',
    title: 'Heritage in a Globalized Era',
    difficulty: 'Challenging',
    part1Questions: [
      {
        id: 'cult-p1-1',
        part: 1,
        topic: 'Festivals & Celebrations',
        prompt: 'What is your favorite festival or celebration in your culture?',
        modelAnswerBand8: "Without hesitation, it would be the annual New Year celebration. What appeals to me most is the communal warmth—families congregate from far and wide, indulging in heritage cuisines, exchanging heartfelt well-wishes, and putting aside the tribulations of the prior twelve months.",
        keyVocabulary: ['communal warmth', 'congregate from far and wide', 'heritage cuisines', 'tribulations'],
        idiomaticExpressions: ['far and wide', 'turn over a new leaf', 'in high spirits'],
        discourseMarkers: ['Without hesitation', 'What appeals to me most is', 'Putting aside'],
        tips: "Express personal enthusiasm followed by cultural significance."
      },
      {
        id: 'cult-p1-2',
        part: 1,
        topic: 'Festivals & Celebrations',
        prompt: 'Do you feel traditional celebrations are losing their significance among youth?',
        modelAnswerBand8: "To a certain extent, yes. Regrettably, rampant commercialization and Western pop-culture influences have overshadowed many ceremonial nuances. Many youngsters now view holidays primarily as photographic opportunities for social media feeds rather than moments of solemn ancestral reflection.",
        keyVocabulary: ['to a certain extent', 'rampant commercialization', 'ceremonial nuances', 'ancestral reflection'],
        idiomaticExpressions: ['lose touch with one\'s roots', 'sign of the times', 'superficial veneer'],
        discourseMarkers: ['To a certain extent', 'Regrettably', 'Rather than moments of'],
        tips: "Acknowledge the trend, provide reasons (commercialization, social media), and reflect on the loss."
      },
      {
        id: 'cult-p1-3',
        part: 1,
        topic: 'Festivals & Celebrations',
        prompt: 'Is it important to learn about traditions from other countries?',
        modelAnswerBand8: "Invaluable, I would say. In an increasingly interconnected global village, acquainting oneself with foreign customs dismantles parochial prejudices, cultivates cross-cultural empathy, and enriches our broader understanding of the human condition.",
        keyVocabulary: ['global village', 'acquainting oneself', 'parochial prejudices', 'cross-cultural empathy', 'human condition'],
        idiomaticExpressions: ['broaden one’s horizons', 'see the world through someone else’s eyes', 'break down barriers'],
        discourseMarkers: ['Invaluable, I would say', 'In an increasingly interconnected', 'Ultimately'],
        tips: "Use high-impact verbs: 'dismantles', 'cultivates', 'enriches'."
      }
    ],
    part2CueCard: {
      id: 'cult-p2-cue',
      part: 2,
      topic: 'An Inspiring Elderly Person',
      prompt: 'Describe an elderly person whose wisdom or story has influenced you positively.',
      subPrompts: [
        'Who this individual is and your relationship to them',
        'What their personal background and life journey entails',
        'What core principles or qualities they exemplify',
        'And explain what vital life lessons you have drawn from knowing them.'
      ],
      modelAnswerBand8: "I would like to honor my maternal grandfather, a resilient gentleman of eighty-six who lived through profound socio-political upheavals in the twentieth century.\n\nHe grew up in rural destitution during wartime, had his formal schooling truncated at age twelve, and yet, through sheer grit and autodidactic curiosity, taught himself three languages and eventually established a flourishing artisanal carpentry workshop.\n\nWhat makes him truly extraordinary is his unwavering equanimity. Despite enduring devastating financial misfortunes and the loss of close kin, I have never once witnessed him succumb to bitterness or despair. He carries himself with a serene dignity and treats every interlocutor—whether a dignitary or a street cleaner—with unreserved courtesy.\n\nThe indelible moral lesson he instilled in me is that while we cannot orchestrate external hardships, we maintain absolute sovereignty over our cognitive reaction. His life serves as a lighthouse whenever I confront contemporary stress.",
      keyVocabulary: ['profound upheavals', 'destitution', 'truncated', 'autodidactic', 'unwavering equanimity', 'succumb to bitterness', 'interlocutor', 'indelible lesson', 'sovereignty'],
      idiomaticExpressions: ['through thick and thin', 'sheer grit', 'stand the test of time', 'beacon of hope'],
      discourseMarkers: ['I would like to honor', 'What makes him truly extraordinary is', 'Despite enduring', 'The indelible lesson'],
      tips: "Narrate character traits with concrete examples. Show deep emotional and intellectual insight."
    },
    part3Questions: [
      {
        id: 'cult-p3-1',
        part: 3,
        topic: 'Generational Dynamics & Heritage',
        prompt: 'In what ways does globalization threaten local indigenous cultural identities?',
        modelAnswerBand8: "Globalization inevitably unleashes a homogenizing juggernaut. Hegemonic Western media and global retail monoliths often displace indigenous dialects, culinary traditions, and artisanal craftsmanship. When youth assimilate uncritically into globalized consumerist lifestyles, centuries-old oral folklore and unique communal rituals risk irreversible extinction.",
        keyVocabulary: ['homogenizing juggernaut', 'hegemonic', 'retail monoliths', 'artisanal craftsmanship', 'irreversible extinction'],
        idiomaticExpressions: ['swallowed up', 'dying out', 'a dying art'],
        discourseMarkers: ['Globalization inevitably unleashes', 'When youth assimilate', 'Consequently'],
        tips: "Employ academic terminology: 'homogenizing juggernaut', 'hegemonic', 'indigenous dialects'."
      },
      {
        id: 'cult-p3-2',
        part: 3,
        topic: 'Generational Dynamics & Heritage',
        prompt: 'What unique roles do older generations play in modern post-industrial societies?',
        modelAnswerBand8: "Beyond providing indispensable childcare support in dual-income households, seniors serve as the living repository of cultural wisdom and institutional memory. In an era obsessed with transient digital novelty, elders offer a stabilizing anchor of moral perspective, long-term historical awareness, and emotional resilience that algorithms cannot replicate.",
        keyVocabulary: ['living repository', 'institutional memory', 'transient novelty', 'stabilizing anchor', 'emotional resilience'],
        idiomaticExpressions: ['pillar of the community', 'fountain of wisdom', 'anchor in the storm'],
        discourseMarkers: ['Beyond providing', 'In an era obsessed with', 'Elders offer'],
        tips: "Balance pragmatic household value against philosophical and societal value."
      },
      {
        id: 'cult-p3-3',
        part: 3,
        topic: 'Generational Dynamics & Heritage',
        prompt: 'Is it the duty of the state to financially subsidize dying traditional arts and crafts?',
        modelAnswerBand8: "Unequivocally so. Left entirely to the merciless forces of the free market, bespoke craft traditions—such as hand-loom weaving or classical lute making—would perish due to mass automation. Public subsidies and cultural grants are not merely financial handouts; they are essential investments in preserving the nation's historical tapestry and tangible soul.",
        keyVocabulary: ['unequivocally so', 'merciless forces', 'bespoke craft', 'hand-loom weaving', 'tangible soul', 'cultural grants'],
        idiomaticExpressions: ['keep the flame alive', 'breathe new life into', 'worth its weight in gold'],
        discourseMarkers: ['Unequivocally so', 'Left entirely to', 'They are not merely... but essential'],
        tips: "Use strong rhetoric and contrast ('free market forces' vs 'cultural preservation')."
      }
    ]
  }
];

export const ALL_PART_QUESTIONS = {
  part1: AUTHENTIC_EXAM_SETS.flatMap(s => s.part1Questions),
  part2: AUTHENTIC_EXAM_SETS.map(s => s.part2CueCard),
  part3: AUTHENTIC_EXAM_SETS.flatMap(s => s.part3Questions),
};
