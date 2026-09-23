import crypto from 'crypto';
import { 
  User, 
  BookMeta, 
  BookPageData, 
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
  bookTitle: "Vidyarthi Mediclaim for Students — Prospectus",
  bookAuthor: "National Insurance Company Limited",
  bookSynopsis: "Vidyarthi Mediclaim for Students (UIN: NICHLIP21113V032021) is a specialized policy by National Insurance Company Limited designed to provide health and personal accident coverage to students in registered educational institutions across India. It also provides for the continuation of insured students' education in case of death or permanent total disablement of the guardian due to accident.",
  authorBio: "National Insurance Company Limited (Regd. Office: Kolkata, CIN: U10200WB1906GOI001713, IRDAI Regn. No. 58) is one of India's premier public sector general insurance institutions, trusted nationwide since 1906.",
  contactEmail: "contact@eyewinn.com",
  contactPhone: "+91 98765 43210",
  contactAddress: "EYE WINN Literary & Cinematic Productions, New Delhi / Mumbai, India",
};

// Initial Book Metadata
export const bookMeta: BookMeta = {
  id: "book-vidyarthi-mediclaim-001",
  title: "Vidyarthi Mediclaim for Students — Prospectus",
  author: "National Insurance Company Limited",
  genre: "Student Healthcare & Accident Policy Prospectus",
  synopsis: siteContent.bookSynopsis,
  themes: [
    "Hospitalisation Coverage for Students (Age 3-25)",
    "Guardian Accident Cover & Continued Education",
    "Section 80D Income Tax Exemption Benefits",
    "Cashless Network Provider Access via TPA",
    "Cumulative Bonus & Group Enrollment Discounts"
  ],
  pageCount: "8",
  totalPages: 8,
  priceINR: 299,
  previewPagesCount: 3,
  isPurchaseEnabled: true,
  coverUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
};

// Private Book Pages (Stored on server; never served as full raw PDF)
export const privateBookPages: BookPageData[] = [
  {
    pageNumber: 1,
    chapterName: "Section 1 — Product & Scope of Cover",
    title: "1. Product Overview, Eligibility & Hospitalization Scope",
    isFreePreview: true,
    content: [
      "National Insurance Company Limited\nCIN - U10200WB1906GOI001713 | IRDAI Regn. No. - 58\nRegd. & Head Office: Premises No. 18-0374, Plot no. CBD-81, New Town, Kolkata - 700156\nUIN: NICHLIP21113V032021",
      "VIDYARTHI MEDICLAIM FOR STUDENTS — PROSPECTUS",
      "1.1 Product\nVidyarthi Mediclaim for Students is a unique policy designed to provide Health and Personal accident cover to the students. It also provides for continuation of insured students education in case of death or permanent total disablement of the guardian due to accident.",
      "1.2 Cover\n• Section-I : Hospitalisation expenses of the student\n• Section-II : Personal Accident of the guardian\n• Section III : Personal Accident of the students",
      "1.3 Sum Insured\n• Section I - Sum Insured (SI) ranges from Rs. 50,000/- (fifty thousand) to Rs. 2,00,000/- (two lacs) in multiples of Rs. 25,000/- (twenty five thousand).\n• Section II - Capital Sum Insured (CSI) will be two times of the SI under Section I.\n• Section III - CSI under this section will be Rs. 50,000/- (fifty thousand) for all students.",
      "1.4 Eligibility\n1.4.1 Policy may be issued to students between the age of 3 (three) years to 25 (twenty five) years and one parent/ legal guardian.\n1.4.2 Student in any Registered Educational Institution affiliated to any State Board, Council, University and AICTE or any other Govt. Statutory Authority, within the territory of India are eligible for the policy.\nThe Educational Institutions may also take a Group Policy covering named students enrolled with them.\n1.4.3 Insured person have option to port to retail health insurance and personal accident product of the company or of any other insurer at the end of the specified exit age as mentioned.",
      "1.5 Group Discount\nThis discount will be applicable only on actual number insured. Group Discount structure will be as under:\n• 101 to 5,000 persons: 10% Discount\n• 5,001 to 15,000 persons: 15% Discount\n• 15,001 to 25,000 persons: 20% Discount\n• 25,001 to 50,000 persons: 25% Discount\n• 50,001 and above: 30% Discount",
      "2 Section-I - Hospitalization Expenses of the Student\n2.1 Scope of Cover:\n1) Room charges, Intensive Care Unit charges.\n2) Nursing expenses.\n3) Surgeon, anaesthetist, medical practitioner, consultants, specialists fees.\n4) Anaesthesia, blood, oxygen, operation theatre charges, surgical appliances (any disposable consumables subject to upper limit of 10% of sum insured), medicines & drugs, diagnostic materials and X-ray, dialysis, chemotherapy, radiotherapy, cost of pacemaker, artificial limbs and cost of stents and implants, expenses for organ donor's treatment.\n5) Pre and post hospitalisation – Expenses related to medical diagnosis or procedure that resulted in hospitalisation and incurred during the period up to 30 days prior to hospitalisation and up to 60 days after discharge from hospital and will be considered as part of hospitalisation claim.\n6) Modern Treatment (12 nos) subject to maximum 25% of Sum Insured.\n7) Expenses related to treatment necessitated due to participation as a non-professional in hazardous or adventure sports, subject to 25% of Sum Insured.\n8) Treatment of Morbid Obesity, subject to terms and waiting period of 4 years.\n9) Correction of Refractive Error, subject to terms and waiting period of 2 years.\n10) Treatment of HIV/ AIDS, subject to terms.\n11) Treatment of Mental Illness, subject to terms.",
      "2.2 Other Benefits\n1. The guardian of the insured will be eligible for deduction under Section 80D of the Income Tax Act 1961 as amended from time to time, for the premium paid under this section of the policy subject to limits specified in the Income Tax Act.\n2. The Policy will be serviced by Third Party Administrators (TPA) for Section I."
    ]
  },
  {
    pageNumber: 2,
    chapterName: "Section 2 — Cumulative Bonus & Definitions",
    title: "2. Cumulative Bonus & Policy Definitions",
    isFreePreview: true,
    content: [
      "2.3 Cumulative Bonus\nAt the time of renewal, cumulative bonus allowed shall be an amount equal to 5% (five percent) of sum insured (excluding CB) of the expiring policy in respect of an insured person, provided no claims were reported under the expiring policy.\nIn the event of a claim being reported under the expiring policy the cumulative bonus with respect to the insured person shall be reduced by an amount equal to 5% (five percent) of sum insured (excluding CB) of the expiring policy.\nCumulative bonus shall be aggregated over the years and available, subject to maximum of 50% (fifty percent) of the sum insured (excluding CB) of the expiring policy.\nInsured person has the option either to avail cumulative bonus or claim 5% discount in renewal premium in respect of each claim free year of insurance subject to maximum of 10 (ten) claim free years of insurance.",
      "3 Definitions\n3.1 Any one illness means continuous period of illness and it includes relapse within 45 (forty five) days from the date of last consultation with the Hospital where treatment has been taken.",
      "3.2 Cashless facility means a facility extended to the insured person where the payment of the cost of treatment undergone by the insured person in accordance with the policy terms and conditions, is directly made to the network provider by the company to the extent of pre-authorization approval.",
      "3.3 Grace period means 30 days immediately following the premium due date during which a payment can be made to renew or continue the policy in force without loss of continuity benefits such as waiting period and coverage of pre-existing disease. Coverage is not available for the period for which no premium is received.",
      "3.4 Hospital means any institution established for in-patient care and day care treatment of illness and/or injuries and which has been registered as a hospital with the local authorities under the Clinical Establishments (Registration and Regulation) Act, 2010 or under the enactments specified under the Schedule of Section 56(1) of the said Act OR complies with all minimum criteria as under:\ni. has qualified nursing staff under its employment round-the-clock;\nii. has at least 10 (ten) in-patient beds in towns having a population of less than 1000000 (ten lacs) and at least 15 (fifteen) in-patient beds in all other places;\niii. has qualified medical practitioner(s) in charge round-the-clock;\niv. has a fully equipped operation theatre of its own where surgical procedures are carried out;\nv. maintains daily records of patients and makes these accessible to the insurance company's authorized personnel.",
      "3.5 Hospitalisation means admission in a Hospital for a minimum period of twenty four (24) consecutive 'In-Patient care' hours except for specified procedures/ treatments, where such admission could be for a period of less than twenty four (24) consecutive hours.",
      "3.6 In- Patient Care means treatment for which the Insured Person has to stay in a Hospital for more than twenty four (24) hours for a covered event.",
      "3.7 Medical practitioner means a person who holds a valid registration from the medical council of any state or Medical Council of India or Council for Indian Medicine or for Homeopathy set up by the Government of India or a State Government and is thereby entitled to practice medicine within its jurisdiction; and is acting within the scope and jurisdiction of the licence.",
      "3.8 Network provider means hospitals or health care providers enlisted by an insurer or by a TPA and insurer together to provide medical services to an insured person on payment by a cashless facility.",
      "3.9 Policy period means period of one year as mentioned in the schedule for which the policy is issued.",
      "3.10 Preferred provider network (PPN) means a network of hospitals which have agreed to a cashless packaged pricing for certain procedures for the insured person. The list is available with the company/TPA and subject to amendment from time to time. Reimbursement of expenses incurred in PPN for the procedures (as listed under PPN package) shall be subject to the rates applicable to PPN package pricing.",
      "3.11 Pre hospitalisation Medical Expenses means Medical Expenses incurred during predefined number of days preceding the Hospitalisation of the Insured Person, provided that:\ni. Such Medical Expenses are incurred for the same condition for which the Insured Person's Hospitalisation was required, and\nii. The In-patient Hospitalisation claim for such Hospitalisation is admissible by the Company.",
      "3.12 Post hospitalisation Medical Expenses means Medical Expenses incurred during predefined number of days immediately after the Insured Person is discharged from the Hospital provided that:\ni. Such Medical Expenses are for the same condition for which the Insured Person's Hospitalisation was required, and\nii. The inpatient hospitalisation claim for such hospitalisation is admissible by the Company."
    ]
  },
  {
    pageNumber: 3,
    chapterName: "Section 3 — Waiting Periods & Specific Exclusions",
    title: "3. Pre-Existing Diseases & Waiting Period Guidelines",
    isFreePreview: true,
    content: [
      "3.13 Pre existing disease means any condition, ailment, injury or disease\na. That is/are diagnosed by a physician within 48 months prior to the effective date of the policy issued by the Company or\nb. For which medical advice or treatment was recommended by, or received from, a physician within 48 months prior to the effective date of the policy or its reinstatement.",
      "3.14 Reasonable and customary charges means the charges for services or supplies, which are the standard charges for the specific provider and consistent with the prevailing charges in the geographical area for identical or similar services, taking into account the nature of the illness / injury involved.",
      "3.15 Sum insured means the sum insured (excluding CB) as mentioned in the schedule against Section I.",
      "3.16 Third Party Administrator (TPA) means a Company registered with the Authority, and engaged by an Insurer, for a fee or remuneration, by whatever name called and as may be mentioned in the agreement, for providing health services.",
      "4 Exclusions\nThe company shall not be liable to make any payment under this policy in respect of any expenses whatsoever incurred by any person in connection with or in respect of:",
      "4.1 Pre-Existing Disease (Excl 01)\na) Expenses related to the treatment of a Pre-Existing Disease (PED) and its direct complications shall be excluded until the expiry of 36 (thirty six) months of continuous coverage after the date of inception of the first policy with us.\nb) In case of enhancement of sum insured the exclusion shall apply afresh to the extent of sum insured increase.\nc) If the Insured Person is continuously covered without any break as defined under the portability norms of the extant IRDAI (Health Insurance) Regulations then waiting period for the same would be reduced to the extent of prior coverage.\nd) Coverage under the policy after the expiry of 36 (thirty six) months for any pre-existing disease is subject to the same being declared at the time of application and accepted by us.",
      "4.2 Specified disease/procedure waiting period (Excl 02)\na) Expenses related to the treatment of the listed Conditions, surgeries/treatments shall be excluded until the expiry of 90 days/ two year/four years (as specified against specific disease/ procedure) of continuous coverage after the date of inception of the first policy with us. This exclusion shall not be applicable for claims arising due to an accident.\nb) In case of enhancement of sum insured the exclusion shall apply afresh to the extent of sum insured increase.\nc) If any of the specified disease/procedure falls under the waiting period specified for Pre-Existing Diseases, then the longer of the two waiting periods shall apply.\nd) The waiting period for listed conditions shall apply even if contracted after the policy or declared and accepted without a specific exclusion.\ne) If the Insured Person is continuously covered without any break as defined under the applicable norms on portability stipulated by IRDAI, then waiting period for the same would be reduced to the extent of prior coverage.",
      "f) List of specific diseases/procedures:\n\ni. 90 Days Waiting Period (Life style conditions):\na. Hypertension and related complications\nb. Diabetes and related complications\nc. Cardiac conditions\n\nii. Two years Waiting Period:\na. Cataract\nb. Benign prostatic hypertrophy\nc. Hernia\nd. Hydrocele\ne. Internal congenital anomaly\nf. Fissure/Fistula in anus\ng. Piles (Haemorrhoids)\nh. Sinusitis\ni. CSOM (Chronic Suppurative Otitis Media)\nj. Benign lumps/growths in any part of the body\nk. Pilonidal sinus\nl. Calculus diseases\nm. Hysterectomy for menorrhagia or fibromyoma\nn. Joints replacements of any kind unless arising out of accident\no. Surgical treatment of tonsils, adenoids and deviated nasal septum and related disorders\np. Refractive error of the eye more than 7.5 dioptres\nq. Internal Congenital Anomaly\nIf these diseases are pre-existing at the time of proposal, they will be covered only after 36 (thirty six) months of continuous coverage as mentioned in 4.1 above.\n\niii. Four years Waiting Period:\na. Morbid Obesity and its complications\nb. Stem Cell Therapy: Hematopoietic stem cells for bone marrow transplant for haematological conditions to be covered\nFollowing diseases even if pre-existing shall be covered after four years of continuous cover from the inception of the Policy.",
      "4.3 First 30 days waiting period (Excl 03)\na) Expenses related to the treatment of any illness within 30 days from the first policy commencement date shall be excluded except claims arising due to an accident, provided the same are covered.\nb) This exclusion shall not, however, apply if the Insured Person has Continuous Coverage for more than 12 (twelve) months."
    ]
  },
  {
    pageNumber: 4,
    chapterName: "Section 4 — Permanent Exclusions",
    title: "4. Medical, Surgical & Non-Medical Exclusions",
    isFreePreview: false,
    content: [
      "The within referred waiting period is made applicable to the enhanced sum insured in the event of granting higher sum insured subsequently.",
      "4.4 Non Medical Admissions\nTreatments received in health hydros, nature cure clinics, spas or similar establishments or private beds registered as a nursing home attached to such establishments or where admission is arranged wholly or partly for domestic reasons (Excl 13)",
      "4.5 Rest Cure, Rehabilitation and Respite Care (Excl 05)\na) Expenses related to any admission primarily for enforced bed rest and not for receiving treatment. This also includes:\ni. Custodial care either at home or in a nursing facility for personal care such as help with activities of daily living such as bathing, dressing, moving around either by skilled nurses or assistant or non-skilled persons.\nii. Any services for people who are terminally ill to address physical, social, emotional and spiritual needs.",
      "4.6 Birth control, Sterility and Infertility (Excl 17)\nExpenses related to sterility and infertility. This includes:\ni. Any type of sterilization\nii. Assisted Reproduction services including artificial insemination and advanced reproductive technologies such as IVF, ZIFT, GIFT, ICSI\niii. Gestational Surrogacy\niv. Reversal of sterilization",
      "4.7 Maternity (Excl 18)\ni. Medical treatment expenses traceable to childbirth (including complicated deliveries and caesarean sections incurred during hospitalization) except ectopic pregnancy;\nii. Expenses towards miscarriage (unless due to an accident) and lawful medical termination of pregnancy during the policy period",
      "4.8 Self Inflicted Injury:\nTreatment for intentional self-inflicted injury, attempted suicide.",
      "4.9 Drug/alcohol abuse:\nTreatment for, Alcoholism, drug or substance abuse or any addictive condition and consequences thereof (Excl 12)",
      "4.10 General Debility, Congenital External Anomaly\nGeneral debility, Congenital external anomaly.",
      "4.11 Circumcision\nCircumcision unless necessary for treatment of a disease (if not excluded otherwise) or necessitated due to an accident.",
      "4.12 Vaccination or Inoculation.\nVaccination or inoculation unless forming part of treatment and requires Hospitalisation.",
      "4.13 Change-of-Gender treatments (Excl 07):\nExpenses related to any treatment, including surgical management, to change characteristics of the body to those of the opposite sex.",
      "4.14 Cosmetic or plastic Surgery (Excl 08):\nExpenses for cosmetic or plastic surgery or any treatment to change appearance unless for reconstruction following an Accident, Burn(s) or Cancer or as part of medically necessary treatment to remove a direct and immediate health risk to the insured. For this to be considered a medical necessity, it must be certified by the attending Medical Practitioner.",
      "4.15 Naturopathy treatment\n4.16 Dental treatment: Dental treatment, unless necessitated due to an Injury.\n4.17 Vitamins, tonics: Dietary supplements and substances that can be purchased without prescription, including but not limited to Vitamins, minerals and organic substances unless prescribed by a medical practitioners part of hospitalization claim or day care procedure (Excl 14)\n4.18 Investigation & Evaluation (Excl 04):\na) Expenses related to any admission primarily for diagnostics and evaluation purposes only are excluded.\nb) Any diagnostic expenses which are not related or not incidental to the current diagnosis and treatment are excluded.\n4.19 Spectacles, contact lens, hearing aid, cochlear implants\n4.20 Radioactivity"
    ]
  },
  {
    pageNumber: 5,
    chapterName: "Section 5 — Personal Accident Cover",
    title: "5. Personal Accident Cover for Students & Guardians",
    isFreePreview: false,
    content: [
      "Nuclear, chemical or biological attack or weapons, contributed to, caused by, resulting from or from any other cause or event contributing concurrently or in any other sequence to the loss, claim or expense. For the purpose of this exclusion:\na) Nuclear attack or weapons means the use of any nuclear weapon or device or waste or combustion of nuclear fuel or the emission, discharge, dispersal, release or escape of fissile/ fusion material emitting a level of radioactivity capable of causing any Illness, incapacitating disablement or death.\nb) Chemical attack or weapons means the emission, discharge, dispersal, release or escape of any solid, liquid or gaseous chemical compound which, when suitably distributed, is capable of causing any Illness, incapacitating disablement or death.\nc) Biological attack or weapons means the emission, discharge, dispersal, release or escape of any pathogenic (disease producing) micro-organisms and/or biologically produced toxins (including genetically modified organisms and chemically synthesized toxins) which are capable of causing any Illness, incapacitating disablement or death.",
      "4.21 War\nWar (whether declared or not) and war like occurrence or invasion, acts of foreign enemies, hostilities, civil war, rebellion, revolutions, insurrections, mutiny, military or usurped power, seizure, capture, arrest, restraints and detainment of all kinds.\n4.22 Treatment taken outside the geographical limits of India\n4.23 Permanently Excluded Diseases\nIn respect of the existing diseases, disclosed by the insured and mentioned in the policy schedule (based on insured's consent), policyholder is not entitled to get the coverage for specified ICD codes.",
      "5 Section-II - Personal Accident to student & III– Personal Accident to guardian\n5.1 Cover:\nIf the Insured persons shall sustain any bodily injury resulting solely and directly from Accident caused by external violent and visible means then the Company shall pay to insured the sum hereinafter set forth that is to say:\n\n(a) Death: If such injury within twelve calendar months of its occurrence shall be the sole and direct cause of the death of the Insured persons the Capital Sum Insured stated in the Schedule.\n\n(b) Total Loss of Limbs / Sight: If such injury within twelve calendar months of its occurrence shall be the sole and direct cause of the total and irrecoverable loss of sight of both eyes or total and irrecoverable loss of use of two hands or two feet, or of one hand and one foot or of such loss of sight of one eye and such loss of use of one hand or one foot, the capital sum insured stated in the schedule hereto.\n\n(c) Partial Loss of Limbs / Sight: If such injury within twelve calendar months of its occurrence shall be the sole and direct cause of the total and irrecoverable loss of sight of one eye or total and irrecoverable loss of use of a hand or foot, fifty percent (50%) to the capital sum insured stated in the schedule hereto.\n\n(d) Permanent Total Disablement: If such injury within twelve calendar months of its occurrence shall be the sole and direct cause of permanently totally and absolutely disabling the Insured from engaging in being occupied with or giving attention to any employment or occupation of any description whatsoever the Sum Insured stated in the Schedule.",
      "5.1.1 Additional cover\nTransportation cost of insured's dead body (death due to accident only) to the place of residence subject to a maximum of 2% of the Capital Sum Insured or Rs. 1,000/- (one thousand) whichever is lower. This cover is applicable both for Section II & III.",
      "5.2 Condition\nThe Company shall not be liable under this Policy for:\n1. Compensation under more than one of the aforesaid sub-clauses (a), (b), (c) or (d) in respect of the same injury or disablement.\n2. Any payment in excess of sum insured under the policy during any one period of Insurance.\n3. Payment of compensation in respect of injury or disablement directly or indirectly arising out of or contributed to be or traceable to any disability existing on the date of issue of this policy.",
      "5.3 Exclusions\nThe company shall not be liable to make any payment under this policy in respect of any expenses whatsoever incurred by any person in connection with or in respect of:\n5.3.1 Compensation under more than one of the aforesaid sub-clauses 1.1, 1.2, 1.3 or 1.4 in respect of the same injury or disablement under Section II and Section III of the policy.\n5.3.2 Any payment in excess of Capital Sum Insured under Section II and Section III of the Policy during any one period of Insurance.\n5.3.3 Any payment in respect of injury or disablement directly or indirectly arising out of or contributed to be or traceable to any disability existing on the date of issue of this policy."
    ]
  },
  {
    pageNumber: 6,
    chapterName: "Section 6 — Claims Procedures & Requirements",
    title: "6. Claims Procedure: Cashless, Reimbursement & Documentation",
    isFreePreview: false,
    content: [
      "5.3.4 Any payment in respect of death of the insured (a) from intentional self injury, suicide or attempted suicide (b) whilst under influence of intoxicating liquor or drugs (c) whilst engaging in Aviation or Ballooning, whilst Mounting into, Dismounting from or Travelling in any aircraft other than as a passenger (fare paying or otherwise) in any duly licensed standard type of aircraft anywhere in the world (d) directly or indirectly caused by venereal disease or insanity, (e) arising or resulting from the insured committing any breach of the law with criminal intent.",
      "5.3.5 Any payment in respect of death of the insured due to or arising out of directly or indirectly connected with or traceable to war, invasion, Act of foreign enemy, Hostilities (Whether war be declared or not) Civil War, Rebellion, Revolution, Insurrection, Mutiny, Military or Usurped Power, Seizure, Capture, Arrests, restraints and Detainment of all kings, princes and people of whatsoever nation, condition or quality.",
      "5.3.6 Any payment in respect of death of the insured:\na Directly or indirectly caused by or contributed to by or arising from ionising radiations or contamination by radioactivity from any nuclear fuel or from any nuclear waste from the combustion of nuclear fuel. For the purpose of this exception, combustion shall include any self-sustaining process of nuclear fission.\nb Directly or indirectly caused by or contributed to by or arising from nuclear weapon material.",
      "5.3.7 Any payment in respect of death or disablement resulting directly or indirectly caused by or contributed to by or aggravated to prolonged by childbirth or pregnancy or in consequence thereof.",
      "6 Claims Procedure\n6.1 Section-I\nClaims will be settled by the Third Party Administrators (TPA).",
      "6.1.1 Notification of Claim\nIn case of a claim, the insured person/insured person's representative shall notify the TPA in writing by letter, e-mail, fax providing all relevant information relating to claim including plan of treatment, policy number etc. within the prescribed time limit.",
      "Claim Notification Timelines:\n• In case of Cashless facility (Planned hospitalisation): At least 72 (seventy two) hours prior to the insured person's admission to network provider/PPN\n• In case of Cashless facility (Emergency hospitalisation): Within 24 (twenty four) hours of the insured person's admission to network provider/PPN\n• In case of Reimbursement (Planned hospitalisation): At least 72 (seventy two) hours prior to the insured person's admission to hospital\n• In case of Reimbursement (Emergency hospitalisation): Within 24 (twenty four) hours of the insured person's admission to hospital",
      "6.1.2 Procedure for Cashless Claims\ni. Treatment may be taken in a network hospital/PPN and is subject to pre authorization by the TPA.\nii. Cashless request form available with the network hospital/PPN and TPA shall be completed and sent to the TPA for authorization.\niii. The TPA upon getting cashless request form and related medical information from the insured person/ network hospital/PPN will issue pre-authorization letter to the hospital after verification.\niv. At the time of discharge, the insured person has to verify and sign the discharge papers, pay for non-medical and inadmissible expenses.\nv. The TPA reserves the right to deny pre-authorization in case the insured person is unable to provide the relevant medical details.\nvi. In case of denial of cashless access, the insured person may obtain the treatment as per treating doctor's advice and submit the claim documents to the TPA for reimbursement.",
      "6.1.3 Procedure for Reimbursement of Claims\nFor reimbursement of claims the insured person may submit the necessary documents to TPA within the prescribed time limit.",
      "6.1.4 Documents to be Submitted:\na. Claim form\nb. First Consultation documents\nc. Copy of admission advice\nd. Discharge Summary\ne. Prescription with bills\nf. Test Reports\ng. Any other documents required by TPA."
    ]
  },
  {
    pageNumber: 7,
    chapterName: "Section 7 — Settlement Terms & Policy Portability",
    title: "7. Claim Settlement Guidelines, Moratorium & Portability",
    isFreePreview: false,
    content: [
      "The amount payable under this section will be paid to the guardian of the student.",
      "6.2 Section-II & III:\nClaims will be settled by the underwriting office of the company.\n\n6.2.1 Documents to be Submitted:\n1. FIR\n2. Death Certificate\n3. Post Mortem Certificate, if required\n4. Any other Documents required by Company\n\n6.2.2 Payment of Claim:\nAll claims under this policy shall be payable in Indian currency. All medical treatments for the purpose of this insurance will have to be taken in India only.\n• Section-I: Claim will be paid to the guardian.\n• Section II: In case of PTD- claim will be paid to the guardian. In case of Death- Claim amount will be paid to the nominee named in the schedule.\n• Section III: Claim will be paid to the guardian.",
      "6.3 Claim Settlement\ni. The Company shall settle or reject a claim, as the case may be, within 30 days from the date of receipt of last necessary document.\nii. In the case of delay in the payment of a claim, the Company shall be liable to pay interest to the policyholder from the date of receipt of last necessary document to the date of payment of claim at a rate 2% above the bank rate.\niii. However, where the circumstances of a claim warrant an investigation in the opinion of the Company, it shall initiate and complete such investigation at the earliest, in any case not later than 30 days from the date of receipt of last necessary document. In such cases, the Company shall settle or reject the claim within 45 days from the date of receipt of last necessary document.\niv. In case of delay beyond stipulated 45 days, the Company shall be liable to pay interest to the policyholder at a rate 2% above the bank rate from the date of receipt of last necessary document to the date of payment of claim.\n(Explanation: 'Bank rate' shall mean the rate fixed by the Reserve Bank of India (RBI) at the beginning of the financial year in which claim has fallen due)",
      "6.4 Services Offered by a TPA\nThe TPA shall render health care services covered under the policy like issuance of ID cards & guide book, hospitalization & pre-authorization services, call centre, acceptance of claim related documents, claim processing and other related services.\nThe services offered by a TPA shall not include:\ni. Claim settlements and rejections with respect to the health insurance policies; However, TPA may handle claims admissions and recommend to the insurer for the payment of the claim settlement, provided a detailed guideline is prescribed by the insurer to the TPA for claims assessments & admissions in terms of capacity requirements, internal control requirements, claim assessment & admissions procedure requirements etc under the agreement.\nii. Any services directly to the policyholder or insured or to any other person unless such service is in accordance with the terms and conditions of the Agreement entered into with the insurer.",
      "7 Moratorium Period\nAfter completion of eight continuous years under this policy no look back would be applied. This period of eight years is called as moratorium period. The moratorium would be applicable for the sums insured of the first policy and subsequently completion of eight continuous years would be applicable from date of enhancement of sums insured only on the enhanced limits. After the expiry of Moratorium Period no claim under this policy shall be contestable except for proven fraud and permanent exclusions specified in the policy contract. The policies would however be subject to all limits, sub limits, co-payments as per the policy.",
      "8 Migration\nThe insured person will have the option to migrate the policy to other health insurance products/plans offered by the company by applying for migration of the policy at least 30 days before the policy renewal date as per IRDAI guidelines on Migration. If such person is presently covered and has been continuously covered without any lapses under any health insurance product/plan offered by the company, the insured person will get the accrued continuity benefits in waiting periods as per IRDAI guidelines on migration.",
      "9 Portability\nThe insured person will have the option to port the policy to other insurers by applying to such insurer to port the entire policy along with all the members of the family, if any, at least 45 days before, but not earlier than 60 days from the policy renewal date as per IRDAI guidelines related to portability. If such person is presently covered and has been continuously covered without any lapses under any health insurance policy with an Indian General/Health insurer, the proposed insured person will get the accrued continuity benefits in waiting periods as per IRDAI guidelines on portability."
    ]
  },
  {
    pageNumber: 8,
    chapterName: "Section 8 — Policy Terms & Premium Chart",
    title: "8. Product Withdrawal, Free Look & Premium Schedule",
    isFreePreview: false,
    content: [
      "10 Withdrawal of Product\ni. In the likelihood of this product being withdrawn in future, the Company will intimate the insured person about the same 90 days prior to expiry of the policy.\nii. Insured Person will have the option to migrate to similar health insurance product available with the Company at the time of renewal with all the accrued continuity benefits such as cumulative bonus, waiver of waiting period as per IRDAI guidelines, provided the policy has been maintained without a break.",
      "11 Revision of Terms of the Policy Including the Premium Rates\nThe Company, with prior approval of IRDAI, may revise or modify the terms of the policy including the premium rates. The insured person shall be notified three months before the changes are effected.",
      "12 Free Look Period\nThe Free Look Period shall be applicable on new individual health insurance policies and not on renewals or at the time of porting/migrating the policy.\nThe insured person shall be allowed free look period of fifteen days from date of receipt of the policy document to review the terms and conditions of the policy, and to return the same if not acceptable.\nIf the insured has not made any claim during the Free Look Period, the insured shall be entitled to:\ni. a refund of the premium paid less any expenses incurred by the Company on medical examination of the insured person and the stamp duty charges or\nii. where the risk has already commenced and the option of return of the policy is exercised by the insured person, a deduction towards the proportionate risk premium for period of cover or\niii. Where only a part of the insurance coverage has commenced, such proportionate premium commensurate with the insurance coverage during such period;",
      "13 Premium Chart (Official Schedule of Sums Insured & Premiums in Rs.):\n\n• Tier 1:\n  Section I (Student Hospitalisation SI): Rs. 50,000/-\n  Section II (Guardian Accident CSI): Rs. 1,00,000/-\n  Section III (Student Accident CSI): Rs. 50,000/-\n  Annual Premium: Rs. 582/- (Service charge extra)\n\n• Tier 2:\n  Section I (Student Hospitalisation SI): Rs. 75,000/-\n  Section II (Guardian Accident CSI): Rs. 1,50,000/-\n  Section III (Student Accident CSI): Rs. 50,000/-\n  Annual Premium: Rs. 838/- (Service charge extra)\n\n• Tier 3:\n  Section I (Student Hospitalisation SI): Rs. 1,00,000/-\n  Section II (Guardian Accident CSI): Rs. 2,00,000/-\n  Section III (Student Accident CSI): Rs. 50,000/-\n  Annual Premium: Rs. 1,111/- (Service charge extra)\n\n• Tier 4:\n  Section I (Student Hospitalisation SI): Rs. 1,25,000/-\n  Section II (Guardian Accident CSI): Rs. 2,50,000/-\n  Section III (Student Accident CSI): Rs. 50,000/-\n  Annual Premium: Rs. 1,365/- (Service charge extra)\n\n• Tier 5:\n  Section I (Student Hospitalisation SI): Rs. 1,50,000/-\n  Section II (Guardian Accident CSI): Rs. 3,00,000/-\n  Section III (Student Accident CSI): Rs. 50,000/-\n  Annual Premium: Rs. 1,620/- (Service charge extra)\n\n• Tier 6:\n  Section I (Student Hospitalisation SI): Rs. 1,75,000/-\n  Section II (Guardian Accident CSI): Rs. 3,50,000/-\n  Section III (Student Accident CSI): Rs. 50,000/-\n  Annual Premium: Rs. 1,851/- (Service charge extra)\n\n• Tier 7:\n  Section I (Student Hospitalisation SI): Rs. 2,00,000/-\n  Section II (Guardian Accident CSI): Rs. 4,00,000/-\n  Section III (Student Accident CSI): Rs. 50,000/-\n  Annual Premium: Rs. 2,084/- (Service charge extra)\n\n* Service charge and applicable statutory taxes extra.",
      "National Insurance Co. Ltd.\nRegd. & Head Office: Premises No. 18-0374, Plot no. CBD-81, New Town, Kolkata - 700156\nPage | 8  Vidyarthi Mediclaim for Students (UIN: NICHLIP21113V032021)"
    ]
  }
];

// Initial Users Store
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
    readingProgress: 6,
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
    readingProgress: 5,
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
    readingProgress: 3,
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
    readingProgress: 6,
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
    paymentId: "pay_rzp_live_998124",
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
    orderId: "order_eyewinn_1002",
    paymentId: "pay_rzp_live_887103",
    userId: "usr-reader-003",
    userName: "Aarav Sharma",
    userEmail: "reader@example.com",
    amount: 299,
    currency: "INR",
    status: "PENDING",
    createdAt: "2026-03-14T16:10:00Z",
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
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    actingExperience: "18 years of classical Hindi theater & NSD workshops. Lead roles in regional dramas.",
    currentProfession: "Theater Director & Voice Actor",
    languages: "Hindi, Marwari, English, Punjabi",
    height: "5 ft 10 in",
    portfolioUrl: "https://virendrarathore.example.com",
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
