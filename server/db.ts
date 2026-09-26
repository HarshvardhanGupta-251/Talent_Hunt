import crypto from 'crypto';
import { 
  User, 
  BookMeta, 
  BookPageData, 
  ScriptMeta,
  ScriptPageData,
  PaymentRecord, 
  AuditionApplication, 
  AuditLog, 
  ContactMessage, 
  SiteContent 
} from '../src/types.js';

// Secure password hashing with environment salt configuration
const PASSWORD_SALT = process.env.PASSWORD_SALT || 'eyewinn_production_secure_salt_v2';

export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', PASSWORD_SALT).update(password).digest('hex');
}

/**
 * Timing-safe password verification to eliminate side-channel timing attack vectors
 */
export function verifyPassword(password: string, expectedHash: string): boolean {
  if (!password || !expectedHash) return false;
  const hash = hashPassword(password);
  const bufA = Buffer.from(hash, 'utf8');
  const bufB = Buffer.from(expectedHash, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Initial Site Content (Editable via Admin)
export const siteContent: SiteContent = {
  heroHeadline: "FROM A VILLAGE STORY TO THE BIG SCREEN.",
  heroSupporting: "One teacher. A village. A different way of thinking.",
  storyQuoteHindi: "शिक्षा केवल अंक पाने का माध्यम नहीं, सोचने की शक्ति विकसित करने का माध्यम है।",
  storyQuoteEnglish: "Education is not merely a means of earning marks; it is the power to think.",
  storyIntroText: "In a village where conversations travel from the fields to the tea shop, ordinary people discuss extraordinary questions — the price of crops, government decisions, money, family, education and the future.",
  beerbhanBio: "Master Beerbhan is a 50-year-old government schoolteacher who has spent three decades teaching in the village. But his classroom extends far beyond the walls of a school into markets, fields, chopal gatherings, and everyday rural situations.",
  economicsText: "Through the everyday struggles and choices of two medium-scale farmer brothers, Santosh and Nafe, agricultural problems transform into profound explorations of rural economics, risk management, and self-reliance.",
  bookTitle: "Master Beerbhan",
  bookAuthor: "Wing Commander (Retd.) Surender Singh",
  bookSynopsis: "Set against the vivid agricultural landscapes of an Indian village, a veteran schoolteacher named Master Beerbhan challenges rote learning by making the village square, the tea stall, and the mandi the true classrooms of critical thought.",
  authorBio: "Written by a retired Indian Air Force officer whose deep observation of rural life and passionate commitment to foundational education shaped this narrative journey.",
  contactEmail: "contact@eyewinn.com",
  contactPhone: "+91 98765 43210",
  contactAddress: "EYE WINN Literary & Cinematic Productions, New Delhi / Mumbai, India",
  upiId: "eyewinnproductions@icici",
  upiPayeeName: "EYE WINN PRODUCTIONS",
  qrCodeImageUrl: "",
};

// Initial Book Metadata
export const bookMeta: BookMeta = {
  id: "book-master-beerbhan-001",
  title: "Master Beerbhan",
  author: "Wing Commander (Retd.) Surender Singh",
  genre: "Literary & Social Narrative",
  synopsis: siteContent.bookSynopsis,
  themes: [
    "Education Philosophy",
    "Rural Economics",
    "Farming Realities",
    "Critical Thinking",
    "Family Dignity",
    "Self-Reliance"
  ],
  pageCount: "184 Pages",
  totalPages: 184,
  priceINR: 299,
  previewPagesCount: 3,
  isPurchaseEnabled: true,
  coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
};

// Private Book Pages (Stored on server; pages 1-3 free preview, 4+ locked behind payment verification)
export const privateBookPages: BookPageData[] = [
  {
    pageNumber: 1,
    chapterName: "Chapter 1 — The School Veranda & The First Bell",
    title: "The Bell Without Walls",
    isFreePreview: true,
    content: [
      "The morning sun broke over the village of Shahpur not with the blare of factory sirens, but with the clinking of brass milk cans and the steady, rhythmic scythes in the mustard fields.",
      "At the primary school on the village perimeter, fifty-year-old Master Beerbhan stood on the brick veranda. He did not ring the brass handbell to summon the children into a cramped, dark classroom. Instead, he pulled out three wooden slates and sat down beneath the old neem tree whose branches spread across the courtyard like protective arms.",
      "\"Master ji, why aren't we going inside? The inspection officer might arrive today,\" whispered little Kavita, clutching her frayed Hindi reader.",
      "Beerbhan smiled, his spectacles reflecting the golden sunlight filtering through the neem leaves. \"Kavita, if knowledge could only exist inside four plastered walls, trees would never learn how to find water, and birds would never learn the path of the wind. Today, the village is our syllabus.\"",
      "He drew a single horizontal line in the soft earth with a dry twig. \"Tell me, children — what is the distance between a farmer's labor and the coin in his pocket? Who teaches that in the textbooks?\" The students fell silent, listening to the morning birds and the distant thrum of a tractor."
    ]
  },
  {
    pageNumber: 2,
    chapterName: "Chapter 2 — The Moisture Gauge & The Mandi Weigh-In",
    title: "The Arithmetic of Sweat",
    isFreePreview: true,
    content: [
      "At the Rohtak grain mandi, two miles from the village edge, the dust rose like gold powder beneath the heavy tires of hundreds of loaded trolleys. The air smelled of raw wheat, diesel smoke, and strong cardamom tea boiling in blackened kettles.",
      "Santosh stood by his tractor, his calloused palms resting on the wooden sideboard. His younger brother, Nafe, was locked in an intense dispute with the commission agent, Seth Ramvilas.",
      "\"Twelve percent! The government meter at the gate measured twelve percent moisture! How did you write fourteen point five in your ledger, Seth ji?\" Nafe's voice trembled with exhausted fury.",
      "The agent didn't look up from his red bahi-khata. \"Machines don't pay cash on the spot, lad. If you want official procurement rates, wait a week in the open under storm clouds. If you want money today, you take the deduction.\"",
      "Before Santosh could pull his brother back, the familiar ding of a bicycle bell sliced cleanly through the din. Master Beerbhan leaned his black Atlas bicycle against an iron pillar, carrying his worn leather satchel.",
      "\"Ram-Ram, Seth ji,\" Beerbhan said gently. \"Before you weigh Santosh's grain, have you calibrated your moisture gauge against the humidity of this damp morning? Or does the needle only bend in one direction?\""
    ]
  },
  {
    pageNumber: 3,
    chapterName: "Chapter 3 — The Tea Stall Discourse",
    title: "Questions Over Morning Tea",
    isFreePreview: true,
    content: [
      "At Panditji's tea stall by the canal bridge, the brass samovar hissed steadily. Farmers in coarse cotton dhotis sat on wooden benches, blowing gently across their steaming saucers.",
      "\"Master ji,\" said Dharam Singh, a veteran farmer whose forehead bore the deep furrows of forty seasons. \"The newspapers say fertilizer subsidies are up by ten percent. Yet our debt to the cooperative bank is larger than last year. Where does the money disappear?\"",
      "Beerbhan accepted a small glass of tea and took a chalk stick from his pocket. He wiped clean a flat stone near the bench.",
      "\"Let us do the arithmetic together, Tau,\" Beerbhan replied. \"If the price of diesel rises by two rupees, your ploughing cost per acre rises by seventy. When you transport twenty quintals to the mandi, the transporter charges for the round trip. The subsidy arrives at the chemical plant; the inflation arrives in your tea saucer.\"",
      "The farmers crowded closer around the stone. For the first time in their lives, someone was not lecturing them from a political podium, but calculating their daily existence with calm, undeniable clarity.",
      "\"Education,\" Beerbhan said softly, looking at the young boys listening from the perimeter, \"is when a farmer can read his own balance sheet before the middleman writes the final figure.\"",
      "[END OF FREE PREVIEW — CHAPTERS 4 TO 12 CONTINUE IN THE COMPLETE UNLOCKED EDITION]"
    ]
  },
  {
    pageNumber: 4,
    chapterName: "Chapter 4 — The Accounting of Uncounted Sweat",
    title: "The Invisible Ledger",
    isFreePreview: false,
    content: [
      "Late into the evening, inside the courtyard of Santosh and Nafe's home, oil lanterns flickered against the mud-brick walls. Santosh's wife, Sunita, was sifting wheat by the doorway.",
      "Beerbhan sat with the two brothers, a ruled notebook open between them.",
      "\"You told me you made twenty thousand rupees of profit on the mustard crop,\" Beerbhan began.",
      "\"Yes, Master ji,\" Santosh said with weary pride. \"After paying for diesel, fertilizer, and the seed loan, twenty thousand remained.\"",
      "\"And how many days did Bhabhi spend weeding the ridges? How many hours did your sixteen-year-old son spend guiding the irrigation channels at three in the morning?\" Beerbhan asked.",
      "The brothers stared in silence.",
      "\"If you hired labor for those four hundred hours, what would you have paid?\" Beerbhan wrote the numbers on the paper. \"Thirty-two thousand rupees. Your twenty-thousand profit was actually a twelve-thousand rupee loss, paid for by the unpaid sweat of your own family. That is where rural poverty hides — in the work we never count.\""
    ]
  },
  {
    pageNumber: 5,
    chapterName: "Chapter 5 — The Assembly Under the Neem Tree",
    title: "The Collective Will",
    isFreePreview: false,
    content: [
      "Word of Beerbhan's evening sessions spread swiftly across three neighboring villages. The following Sunday, eighty farmers gathered at the ancient village chopal.",
      "The Sarpanch, holding his silver-topped lathi, was uneasy. \"Master Beerbhan, people are saying you are teaching farmers to refuse mandi prices. That could disrupt the entire district trade.\"",
      "\"I am not teaching anyone to fight, Sarpanch Sahib,\" Beerbhan spoke with firm calmness. \"I am teaching them how to measure. A man who cannot calculate will always be cheated, whether by a trader, an election speech, or a bank clerk. A village that understands economics cannot be intimidated.\"",
      "Nafe stood up in the center of the gathering, holding a small notebook. \"For thirty years, we sold our wheat on the day of harvest because none of us had storage or collective transport. If six of us pool two tractor trolleys and store the grain for sixty days in the community warehouse, the price rises by four hundred rupees a quintal.\"",
      "The murmurs turned into a resonant swell of agreement across the assembly."
    ]
  },
  {
    pageNumber: 6,
    chapterName: "Chapter 6 — Buffer Storage & The Warehouse Risk",
    title: "The Mathematics of Waiting",
    isFreePreview: false,
    content: [
      "The plan was not without danger. Storing grain required fumigation against weevils, waterproof tarpaulins, and patience when household cash was desperately scarce.",
      "Santosh wanted to sell early. \"Master ji, mother needs her medicine by Thursday. If the grain rots in the warehouse, we are ruined.\"",
      "Beerbhan took out five thousand rupees from his monthly teacher's salary and placed it on the table. \"Use this for the medicine. Do not sell in panic. Panic is the middleman's greatest profit margin.\"",
      "Together with twelve young villagers, Beerbhan spent nights inspecting the bags, checking moisture levels, and maintaining aeration fans. The village school became an operational center of practical agricultural science."
    ]
  },
  {
    pageNumber: 7,
    chapterName: "Chapter 7 — Confronting the Metrology Bureaucracy",
    title: "The Day of Verification",
    isFreePreview: false,
    content: [
      "Sixty days later, the harvest rush had subsided. Mills in the city were desperate for dry, high-grade wheat.",
      "Santosh, Nafe, and Beerbhan arrived with three tractor trolleys directly contracted to a flour mill, completely bypassing the mandi commission agents.",
      "When the mandi cartel attempted to halt the convoy at the district check-post claiming violation of marketing committee bylaws, Beerbhan produced the gazetted Government Direct-Procurement Notification of 2024.",
      "\"Read clause 7B, Inspector Sahib,\" Beerbhan said without raising his voice. \"Farmers who grade and transport their own produce directly to registered processors are exempt from market cess. The law exists to protect producers. We have simply learned how to read it.\"",
      "The district inspector checked the seal on the document, handed it back, and waved the barrier open."
    ]
  },
  {
    pageNumber: 8,
    chapterName: "Chapter 8 — The Harvest of Independent Thinkers",
    title: "The True Classroom",
    isFreePreview: false,
    content: [
      "When the convoy returned to the village, the brothers brought home eighty thousand rupees more than their traditional mandi return.",
      "Santosh handed Beerbhan his five thousand rupees with folded hands. Tears welled in the veteran farmer's eyes. \"Master ji, you did not just save our crop. You gave our children their dignity back.\"",
      "Beerbhan looked across the courtyard where little Kavita and her classmates were sitting under the neem tree, solving word problems based on real crop prices and village accounts.",
      "\"A good teacher does not leave behind disciples who depend on him,\" Master Beerbhan said softly. \"He leaves behind people who can think for themselves when the storm comes.\"",
      "The evening bell rang from the school veranda, echoing across the peaceful fields of Shahpur."
    ]
  }
];

// Initial Script Metadata (Official Feature Film Screenplay)
export const scriptMeta: ScriptMeta = {
  id: "script-master-beerbhan-001",
  title: "Master Beerbhan — The Feature Film Screenplay",
  author: "EYE WINN Screenplay & Literary Desk",
  genre: "Cinematic Drama / Literary Feature Screenplay",
  synopsis: "The official feature-length screenplay adaptation of Master Beerbhan. Follow the gripping, dialogue-driven story of an unconventional village teacher who transforms everyday mandi exploitation, rural debt cycles, and school systems into a quiet revolution of intellect and dignity.",
  themes: [
    "Authentic Rural Dialogue & Haryanvi/Hindi Cadence",
    "Mandi Economics & Agricultural Debt Realities",
    "Village School Without Walls Pedagogy",
    "Confrontation with District Bureaucracy & Cartels",
    "Family Dignity, Brotherly Bond & Triumph of Reason"
  ],
  totalPages: 8,
  priceINR: 499,
  previewPagesCount: 3,
  isPurchaseEnabled: true,
  coverUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
};

// Private Script Pages (Stored on server; pages 1-3 free preview, 4+ locked behind payment verification)
export const privateScriptPages: ScriptPageData[] = [
  {
    pageNumber: 1,
    sceneTitle: "Scene 1 — Dawn at the Grain Mandi",
    sceneHeading: "SCENE 1: EXT. ROHTAK GRAIN MANDI - DAWN (05:45 AM)",
    isFreePreview: true,
    content: [
      "FADE IN:",
      "SCENE 1: EXT. ROHTAK GRAIN MANDI - DAWN (05:45 AM)\n\nA dense morning fog hangs over hundreds of overloaded tractor trolleys. Golden grain spills over gunny sacks under incandescent yellow lamps. The air is pungent with raw wheat dust, diesel exhaust, and spiced tea steaming in earthen kulhads.",
      "SANTOSH (44, weathered skin, calloused hands, eyes heavy from sleepless nights guarding the harvest) stands beside his trolley. His younger brother, NAFE (32, restless, wearing an oversized nylon jacket over a kurta, clutching a damp accounting notebook) argues feverishly with an ARHTIYA (commission agent).",
      "NAFE\n(waving the moisture meter slip)\nTwelve percent moisture! The digital meter read twelve! How did you write fourteen point five in your register, Seth ji?",
      "ARHTIYA\n(without looking up from his red bahi-khata, chewing paan)\nDigital machines don't run on morning dew, Chhotu. The sun hasn't hit your grain yet. Look at this husk — damp like river silt. You want government MSP rate? Wait five days in the rain. You want cash today? Accept the cut.",
      "Santosh touches his brother's trembling shoulder, stepping between them.",
      "SANTOSH\n(quietly, voice raspy)\nSeth ji, we sowed on credit, we watered on credit, we harvested on credit. At fourteen point five, we don't even take home diesel money for the return tractor.",
      "ARHTIYA\nThen take the tractor back, Santosh. The mandi doesn't run on tears. It runs on weight and moisture.",
      "Before Nafe can explode, a bicycle bell dings softly. A crisp, distinct, melodic sound that cuts through the mandi's chaotic haggling.",
      "Enter MASTER BEERBHAN (50, clean khadi kurta over warm grey Nehru vest, spectacles resting on a beaded neck cord, leaning his sturdy Atlas bicycle against a pillar). He carries a brass tiffin carrier and a worn leather briefcase.",
      "MASTER BEERBHAN\nRam-Ram, Seth Ramvilas ji. Before you weigh the grain, have you weighed the humidity of the mandi air this morning?"
    ]
  },
  {
    pageNumber: 2,
    sceneTitle: "Scene 2 — The Chopal Discourse",
    sceneHeading: "SCENE 2: EXT. VILLAGE CHOPAL & ANCIENT BANYAN TREE - AFTERNOON (03:30 PM)",
    isFreePreview: true,
    content: [
      "SCENE 2: EXT. VILLAGE CHOPAL & ANCIENT BANYAN TREE - AFTERNOON (03:30 PM)\n\nA wide stone plinth beneath a massive 200-year-old banyan tree. The village elders sit on charpais around a brass hookah. Dry neem leaves flutter to the ground.",
      "Master Beerbhan sits on the lowest stone step, dipping a wooden slate pencil into chalk water. Around him sit twelve village boys and girls, but surrounding them are thirty adult farmers, including Santosh, Nafe, and the VILLAGE SARPANCH (65, holding a silver-capped walking stick).",
      "SARPANCH\nMaster ji, the village committee met yesterday. They say you spent two hours of school time calculating interest rates of moneylenders instead of teaching geography.",
      "MASTER BEERBHAN\n(smiling gently, holding up two handfuls of soil)\nSarpanch Sahib, geography begins where the river silt ends. But if a child knows the capital of Brazil and doesn't know why his father owed two lakhs on a one-lakh seed loan, whose geography have I taught him?",
      "The gathering falls dead silent. Several older farmers glance down at their dusty juttis.",
      "NAFE\n(blurting out from the back)\nHe is right, Tau! The bank manager speaks English so fast the ink dries before we understand what papers we signed.",
      "MASTER BEERBHAN\n(beckoning Nafe to sit in the center)\nCome here, Nafe. You studied up to tenth grade. If you borrow ₹50,000 at 2% monthly compounded quarterly, what do you owe in two harvest cycles?",
      "Nafe hesitates, his face reddening.",
      "NAFE\nFifty-four... maybe fifty-six thousand?",
      "MASTER BEERBHAN\n(writing numbers swiftly on a large slate)\nSeventy-one thousand six hundred. In twenty-four months, you gave away your cow and the yield of two bighas. Not because of drought, Nafe. Because of compound interest disguised as a favour.",
      "Santosh leans forward, his eyes widening as the math reveals the trap they have lived in for a generation."
    ]
  },
  {
    pageNumber: 3,
    sceneTitle: "Scene 3 — The Classroom Without Walls",
    sceneHeading: "SCENE 3: INT. VILLAGE SCHOOLROOM WITHOUT WALLS - MORNING (09:00 AM)",
    isFreePreview: true,
    content: [
      "SCENE 3: INT. VILLAGE SCHOOLROOM WITHOUT WALLS - MORNING (09:00 AM)\n\nA sunlit veranda of the government primary school. A hand-painted blackboard reads:\n\"शिक्षा केवल अंक पाने का साधन नहीं, सोचने की शक्ति का विस्तार है।\"\n(Education is not merely a tool for marks, but the expansion of the power to think.)",
      "Master Beerbhan has placed a balance scale on the teacher's table. On one pan: a biology textbook. On the other: a fresh, green stalk of mustard flower with its taproot intact.",
      "MASTER BEERBHAN\nTell me, children. Which one has more life in it?",
      "STUDENT KAVITA (11, bright eyes, two neat braids)\nThe plant, Master ji! It drinks water from the earth.",
      "MASTER BEERBHAN\nCorrect, Kavita. But if you pluck the plant and press it inside the book without understanding how its root found water in dry sand, you have killed both the plant and the book.",
      "Outside the low school wall, a sleek black government SUV slows down. DISTRICT EDUCATION OFFICER (DEO) RAGHAVAN (48, stiff polyester suit, holding an inspection clipboard) steps out. He adjusts his sunglasses, peering curiously into the courtyard.",
      "DEO RAGHAVAN\n(stepping onto the veranda, clearing his throat)\nMaster Beerbhan? I don't see the state syllabus charts on your walls.",
      "MASTER BEERBHAN\n(bowing respectfully)\nNamaste, Officer Sahib. We don't have enough walls. So we painted the syllabus across the fields of the village.",
      "DEO RAGHAVAN\n(frowning, tapping his pen)\nInspections are evaluated on prescribed textbooks and quarterly test scores, Master ji. Not philosophy.",
      "MASTER BEERBHAN\nTest my students on anything in your books, Sir. But ask them questions that require thinking, not repeating.",
      "[END OF FREE SCRIPT PREVIEW — SCENES 4 THROUGH 8 CONTINUE IN FULL CINEMATIC SCREENPLAY EDITION]"
    ]
  },
  {
    pageNumber: 4,
    sceneTitle: "Scene 4 — The Night of the Hailstorm",
    sceneHeading: "SCENE 4: EXT. WHEAT FIELDS - NIGHT - THE UNEXPECTED HAILSTORM (11:45 PM)",
    isFreePreview: false,
    content: [
      "SCENE 4: EXT. WHEAT FIELDS - NIGHT - THE UNEXPECTED HAILSTORM (11:45 PM)\n\nViolent gale winds rip across the vast fields. Inky black thunderclouds blot out every star. Sudden deafening CRACK of thunder.",
      "Hailstones the size of walnuts plummet from the heavens, battering the ripe standing wheat. Stalks snap like dry matchsticks.",
      "Santosh and Nafe sprint through the mud with large blue tarpaulin sheets, battling against the ferocious gusts. Santosh's head bleeds where a hailstone struck him, but he refuses to run.",
      "SANTOSH\n(screaming against the howling storm)\nHold the ropes, Nafe! The north field! If this drowns, we have nothing left for mother's medicines!",
      "NAFE\n(sobbing, fighting the whipping tarp)\nBrother, it's tearing apart! The sky is dropping stones!",
      "Through the torrential deluge, a solitary figure emerges carrying a lantern shielded inside a glass case. Master Beerbhan. He wades through knee-deep mud, grabbing the loose end of the tarpaulin and driving a wooden stake deep into the ridge with a stone.",
      "MASTER BEERBHAN\n(drenched, shouting over the tempest)\nDon't fight the storm with tarps, Santosh! Dig the trench! Let the water drain to the pond or the roots will rot by sunrise!",
      "The brothers look at him in shock, then grab spades. Master Beerbhan digs alongside them in the freezing mud, blow after blow."
    ]
  },
  {
    pageNumber: 5,
    sceneTitle: "Scene 5 — The Dawn of Calculation",
    sceneHeading: "SCENE 5: INT. SANTOSH & NAFE'S COURTYARD - NEXT MORNING (06:30 AM)",
    isFreePreview: false,
    content: [
      "SCENE 5: INT. SANTOSH & NAFE'S COURTYARD - NEXT MORNING (06:30 AM)\n\nThe morning after the hailstorm. The courtyard is littered with fallen leaves and hail residue. Santosh sits with his head buried in his palms. His wife, SUNITA (38), serves black tea with shaking hands.",
      "A local sub-agent, GULAB SINGH (55, wearing gold rings, smiling with rehearsed sympathy), sits on the charpai.",
      "GULAB SINGH\nSantosh bhai, tragedy strikes without warning. I can buy the fallen, discolored grain at ₹800 per quintal. Half price. Otherwise it will spoil and you'll get zero.",
      "Santosh is about to nod in defeat when Master Beerbhan walks into the courtyard carrying a small wooden moisture meter and a state agricultural handbook.",
      "MASTER BEERBHAN\nWait, Santosh. Sunita bhabhi, bring two plates of that fallen wheat.",
      "GULAB SINGH\n(irritated)\nMaster ji, this is business between farmers and buyers. Schoolteachers shouldn't interfere.",
      "MASTER BEERBHAN\n(calmly placing the grain on the table)\nSection 4 of the National Disaster Relief Grain Procurement Norms specifies that wheat discolored solely by hailstorms retains full flour density and qualifies for the Class-B Government Procurement Pool at ₹1,950 per quintal.",
      "Gulab Singh's face blanches.",
      "MASTER BEERBHAN (CONT'D)\nSantosh, your harvest is damaged on the outside, but it is not worthless. Do not sign that distress bill."
    ]
  },
  {
    pageNumber: 6,
    sceneTitle: "Scene 6 — The Sub-Divisional Magistrate's Hearing",
    sceneHeading: "SCENE 6: EXT. SUB-DIVISIONAL MAGISTRATE'S COURTYARD - DAY (12:00 PM)",
    isFreePreview: false,
    content: [
      "SCENE 6: EXT. SUB-DIVISIONAL MAGISTRATE'S COURTYARD - DAY (12:00 PM)\n\nA sprawling colonial-era government compound. Two hundred farmers from six neighboring villages stand outside under the scorching sun.",
      "Inside the courtroom, SDM RAJESH VERMA (42, IAS, sharp and meticulous) presides. On one side stands the powerful Mandi Cartel Association lawyer; on the other stands Master Beerbhan accompanied by Santosh, Nafe, and the Sarpanch.",
      "CARTEL LAWYER\nYour Honor, the traders cannot be forced to buy substandard moisture grain at official MSP. It violates market freedom.",
      "MASTER BEERBHAN\n(stepping forward, placing three calibration certificates on the bench)\nYour Honor, we do not ask for charity or market distortion. We ask for honest measurement.",
      "Master Beerbhan demonstrates the calibrated moisture meter against the cartel's rigged gauge.",
      "MASTER BEERBHAN (CONT'D)\nThe traders' meters were calibrated to show an artificial 2.5% inflation on moisture, docking ₹350 per quintal from every farmer who passed through the gates. Over forty thousand quintals, that is one crore forty lakhs stolen in broad daylight.",
      "SDM Verma inspects the seals on the cartel's devices, his jaw tightening.",
      "SDM VERMA\nBailiff, confiscate these meters immediately. Direct the District Metrology Inspector to seal warehouse number three pending audit.",
      "A collective cheer roars from the crowd of two hundred farmers outside the window."
    ]
  },
  {
    pageNumber: 7,
    sceneTitle: "Scene 7 — The Secret in the Study",
    sceneHeading: "SCENE 7: INT. MASTER BEERBHAN'S STUDY - TWILIGHT (07:15 PM)",
    isFreePreview: false,
    content: [
      "SCENE 7: INT. MASTER BEERBHAN'S STUDY - TWILIGHT (07:15 PM)\n\nA modest room lit by an amber brass oil lamp and an incandescent bulb. Books line simple wooden planks — Munshi Premchand, Rabindranath Tagore, Adam Smith's Wealth of Nations in Hindi translation, agricultural manuals.",
      "Nafe enters quietly, holding a glass of warm buffalo milk. He notices an old framed photograph on the desk — a young Master Beerbhan in a spotless Indian Air Force uniform receiving a commendation.",
      "NAFE\nMaster ji... you served in the Air Force? In Delhi? Why did you return to this forgotten village to teach primary school children?",
      "Master Beerbhan pauses, removing his spectacles and cleaning them with the corner of his kurta.",
      "MASTER BEERBHAN\nWhen a plane flies at thirty thousand feet, Nafe, you can see borders and clouds. But you cannot see a farmer weeping over a broken tube-well. I realized that a country's true defence is not only its borders — it is the ability of its poorest citizen to think for himself.",
      "Nafe gazes at his teacher with tears shining in his eyes.",
      "NAFE\nI always thought we were poor because God made us in a village.",
      "MASTER BEERBHAN\n(placing a warm hand on Nafe's head)\nYou were poor because you surrendered your judgment to men who held the pen. Never surrender the pen again, Nafe."
    ]
  },
  {
    pageNumber: 8,
    sceneTitle: "Scene 8 — The Dawn of Reason & Cooperative",
    sceneHeading: "SCENE 8: EXT. VILLAGE SQUARE - CELEBRATION & COOPERATIVE LAUNCH (06:00 AM)",
    isFreePreview: false,
    content: [
      "SCENE 8: EXT. VILLAGE SQUARE - CELEBRATION & COOPERATIVE LAUNCH (06:00 AM)\n\nSix months later. A golden sunrise washes over the green fields. The village square is transformed. A neat white board is inaugurated:\n\"BEERBHAN KRISHI SAHAKARI KENDRA — VILLAGE FARMERS COOPERATIVE & DIGITAL WEIGHMENT CENTER\"\n\nSantosh operates a digital weighbridge connected to a public electronic LED display showing exact weight and moisture readings.",
      "Farmers from three tehsils arrive with clean grain trolleys, received with cups of tea and immediate printed receipts.",
      "In the distance, the school bell rings. Kavita and fifteen other children jog toward the veranda with slate boards and books.",
      "Master Beerbhan arrives on his Atlas bicycle, greeting every farmer with folded hands. He stops by the school gate, looks back at the bustling cooperative where reason, dignity, and fair trade have replaced centuries of exploitation.",
      "A quiet, profound smile touches his face.",
      "He turns toward the blackboard. In chalk, he writes the lesson for the new morning:\n\"THE SOIL BELONGS TO THOSE WHO TILL IT; THE FUTURE BELONGS TO THOSE WHO QUESTION.\"",
      "CAMERA pulls up and back, revealing the vast, beautiful, resilient countryside bathed in morning gold.",
      "FADE TO BLACK.",
      "THE END."
    ]
  }
];
export interface StoredUser extends User {
  passwordHash: string;
}

export const usersStore: StoredUser[] = [
  {
    id: "usr-superadmin-001",
    name: "Chief Producer & Admin",
    email: "admin@eyewinn.com",
    phone: "+91 99887 76655",
    role: "SUPER_ADMIN",
    hasPaidBook: true,
    hasPaidScript: true,
    readingProgress: 6,
    readingProgressScript: 8,
    status: "active",
    createdAt: "2026-01-15T09:00:00Z",
    passwordHash: hashPassword("admin12345"),
  },
  {
    id: "usr-devadmin-002",
    name: "Dev Team Lead",
    email: "dev@eyewinn.com",
    phone: "+91 98111 22334",
    role: "ADMIN",
    hasPaidBook: true,
    hasPaidScript: true,
    readingProgress: 5,
    readingProgressScript: 5,
    status: "active",
    createdAt: "2026-02-01T10:00:00Z",
    passwordHash: hashPassword("dev12345"),
  },
  {
    id: "usr-reader-003",
    name: "Aarav Sharma",
    email: "reader@example.com",
    phone: "+91 98765 12345",
    role: "USER",
    hasPaidBook: false,
    hasPaidScript: false,
    paymentPending: true,
    pendingUtr: "426719823412",
    scriptPaymentPending: false,
    readingProgress: 3,
    readingProgressScript: 2,
    status: "active",
    createdAt: "2026-03-10T14:30:00Z",
    passwordHash: hashPassword("reader12345"),
  },
  {
    id: "usr-paid-004",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98222 33445",
    role: "USER",
    hasPaidBook: true,
    hasPaidScript: false,
    scriptPaymentPending: true,
    pendingScriptUtr: "789123456012",
    readingProgress: 6,
    readingProgressScript: 3,
    status: "active",
    createdAt: "2026-03-12T11:20:00Z",
    passwordHash: hashPassword("priya12345"),
  }
];

// Active Auth Sessions (Token -> User ID)
export const activeSessions = new Map<string, string>();

// In non-production preview environments, maintain standard dev admin session to avoid token desynchronization
if (process.env.NODE_ENV !== 'production') {
  activeSessions.set("eyewinn_super_admin_session_token_2026", "usr-superadmin-001");
}

// Payments Store
export const paymentsStore: PaymentRecord[] = [
  {
    id: "pay-seed-001",
    orderId: "order_eyewinn_1001",
    paymentId: "PAY-DEMO-998124",
    itemType: "BOOK",
    itemTitle: "Vidyarthi Mediclaim for Students — Prospectus",
    userId: "usr-paid-004",
    userName: "Priya Sharma",
    userEmail: "priya@example.com",
    amount: 299,
    currency: "INR",
    status: "SUCCESSFUL",
    createdAt: "2026-03-12T11:25:00Z",
    verifiedAt: "2026-03-12T11:25:04Z",
  },
  {
    id: "pay-seed-002",
    orderId: "upi_order_1002",
    paymentId: "UTR-426719823412",
    utrNumber: "426719823412",
    itemType: "BOOK",
    itemTitle: "Vidyarthi Mediclaim for Students — Prospectus",
    userId: "usr-reader-003",
    userName: "Aarav Sharma",
    userEmail: "reader@example.com",
    amount: 299,
    currency: "INR",
    status: "PENDING_APPROVAL",
    submittedAt: "2026-03-20T14:30:00Z",
    userNote: "Transferred ₹299 from Google Pay UPI to eyewinnproductions@icici",
    createdAt: "2026-03-20T14:30:00Z",
  },
  {
    id: "pay-seed-003",
    orderId: "upi_order_1003",
    paymentId: "UTR-789123456012",
    utrNumber: "789123456012",
    itemType: "SCRIPT",
    itemTitle: "Master Beerbhan — The Feature Film Screenplay",
    userId: "usr-paid-004",
    userName: "Priya Sharma",
    userEmail: "priya@example.com",
    amount: 499,
    currency: "INR",
    status: "PENDING_APPROVAL",
    submittedAt: "2026-03-22T10:15:00Z",
    userNote: "Transferred ₹499 via PhonePe to eyewinnproductions@icici for Script access",
    createdAt: "2026-03-22T10:15:00Z",
  }
];

// Audition Applications Store
export const auditionsStore: AuditionApplication[] = [
  {
    id: "EYW-AUD-2026-000101",
    userId: "usr-actor-001",
    fullName: "Virendra Singh Rathore",
    dob: "1974-06-12",
    gender: "Male",
    phone: "+91 98290 11223",
    email: "virendra.theatre@gmail.com",
    address: "B-42, Shilp Colony, Jhotwara",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    actingExperience: "18 years of classical Hindi theater & NSD workshops. Lead roles in regional dramas.",
    currentProfession: "Theater Director & Voice Actor",
    languages: "Hindi, Marwari, English, Punjabi",
    height: "5 ft 10 in",
    portfolioUrl: "https://virendrarathore.example.com",
    instagramUrl: "https://instagram.com/virendra_theatre_official",
    facebookUrl: "https://facebook.com/virendra.rathore.actor",
    introVideoUrl: "https://youtube.com/watch?v=sample-audition",
    previousProjects: "Lead actor in stage adaptation of 'Court Martial', featured in regional Hindi tele-films.",
    characterInterestedIn: "MASTER BEERBHAN",
    introduction: "I deeply resonate with Master Beerbhan's quiet dignity and transformative rural philosophy. Having worked in rural Rajasthan education initiatives, this character feels personal and true to life.",
    demoReelUrl: "https://vimeo.com/example/beerbhan-monologue",
    videoAuditionUrl: "https://youtube.com/watch?v=sample-audition",
    portfolioFileName: "Virendra_Rathore_CV_Portfolio.pdf",
    portfolioFileId: "doc-sec-portfolio-101",
    status: "SHORTLISTED",
    scheduleDetails: {
      date: "2026-10-05",
      time: "11:30 AM IST",
      locationOrLink: "EYE WINN Studio, Andheri West / Google Meet: meet.google.com/eyw-beerbhan",
      instructions: "Please prepare the dialogue monologue from Scene 2 (The Chopal Discourse) with natural rural Hindi cadence."
    },
    adminNotes: "Exceptional screen presence, authentic North Indian accent, natural authority and warmth. Prime contender for Master Beerbhan.",
    createdAt: "2026-03-01T10:15:00Z",
    updatedAt: "2026-03-15T16:00:00Z"
  },
  {
    id: "EYW-AUD-2026-000102",
    userId: "usr-actor-002",
    fullName: "Kuldeep Sharma",
    dob: "1988-11-20",
    gender: "Male",
    phone: "+91 97110 44556",
    email: "kuldeep.sharma88@gmail.com",
    city: "Rohtak",
    state: "Haryana",
    country: "India",
    actingExperience: "8 years in Delhi street theater (Asmita Theatre Group) and short films.",
    currentProfession: "Actor / Agro-Consultant",
    languages: "Hindi, Haryanvi, English",
    height: "5 ft 11 in",
    previousProjects: "Independent feature 'Mitti Ke Rang' (selected at Jagran Film Festival).",
    characterInterestedIn: "SANTOSH (Farmer Brother)",
    introduction: "Born into a farming family in Haryana, I know the weight of a mandi commission slip and the sleepless nights before harvest. Playing Santosh will be raw and genuine.",
    portfolioFileName: "Kuldeep_Sharma_Acting_Profile.pdf",
    portfolioFileId: "doc-portfolio-102",
    status: "AUDITION SCHEDULED",
    scheduleDetails: {
      date: "2026-10-06",
      time: "02:00 PM IST",
      locationOrLink: "EYE WINN Studio, Studio Floor 2 / Zoom: eyewinn.zoom.us/j/998231",
      instructions: "Audition scene: Confrontation with commission agent regarding wheat moisture discount."
    },
    adminNotes: "Terrific grounded intensity. Speaks Haryanvi and standard Hindi with effortless rural authenticity.",
    createdAt: "2026-03-05T14:40:00Z",
    updatedAt: "2026-03-18T12:00:00Z"
  },
  {
    id: "EYW-AUD-2026-000103",
    userId: "usr-actor-003",
    fullName: "Manish Verma",
    dob: "1994-04-03",
    gender: "Male",
    phone: "+91 94140 88990",
    email: "manish.v.actor@gmail.com",
    city: "Meerut",
    state: "Uttar Pradesh",
    country: "India",
    actingExperience: "5 years theater, 2 web series supporting roles.",
    currentProfession: "Full-time Actor",
    languages: "Hindi, Urdu, English",
    height: "5 ft 9 in",
    characterInterestedIn: "NAFE (Younger Farmer Brother)",
    introduction: "Nafe's struggle between rural tradition and restless economic ambition mirrors the youth of our villages today. I would be honored to portray him.",
    portfolioFileName: "Manish_Verma_Resume.pdf",
    portfolioFileId: "doc-portfolio-103",
    status: "UNDER REVIEW",
    adminNotes: "Good expressive eyes. Need to review video monologue.",
    createdAt: "2026-03-12T09:20:00Z",
    updatedAt: "2026-03-12T09:20:00Z"
  }
];

// Audit Logs Store
export const auditLogsStore: AuditLog[] = [
  {
    id: "log-001",
    adminId: "usr-superadmin-001",
    adminName: "Chief Producer & Admin",
    action: "BOOK_PRICE_UPDATE",
    target: "Book: [BOOK TITLE]",
    details: "Configured promotional price of ₹299 for early literary patrons.",
    timestamp: "2026-03-01T10:00:00Z",
  },
  {
    id: "log-002",
    adminId: "usr-superadmin-001",
    adminName: "Chief Producer & Admin",
    action: "AUDITION_STATUS_UPDATE",
    target: "Application: EYW-AUD-2026-000101 (Virendra Singh Rathore)",
    details: "Changed status to SHORTLISTED and scheduled Master Beerbhan audition.",
    timestamp: "2026-03-15T16:00:00Z",
  },
  {
    id: "log-003",
    adminId: "usr-superadmin-001",
    adminName: "Chief Producer & Admin",
    action: "ADMIN_LOGIN",
    target: "Admin Portal",
    details: "Super Admin signed in from secure console session.",
    timestamp: "2026-03-20T08:30:00Z",
  }
];

// Contact Messages Store
export const contactMessagesStore: ContactMessage[] = [
  {
    id: "msg-001",
    name: "Dr. Alok Srivastava",
    email: "alok.sriv@delhiuniv.ac.in",
    phone: "+91 98100 55443",
    subject: "Educational Adoption of Master Beerbhan's Pedagogy",
    message: "We are organizing a seminar on alternative rural education methodologies and would love to connect with the author regarding the book's core philosophy.",
    status: "READ",
    createdAt: "2026-03-10T12:00:00Z"
  }
];
