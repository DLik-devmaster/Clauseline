// Seed data for the Regulatory Intelligence prototype
// Medical device / pharma context

window.REG_DATA = [];
window.ALERTS_DATA = [];

window.REG_DATA_DEMO = [
  {
    id: "ISO-13485",
    code: "ISO 13485",
    version: "2016",
    latestVersion: "2016",
    title: "Medical devices — Quality management systems — Requirements for regulatory purposes",
    body: "ISO",
    category: "QMS",
    status: "up-to-date",
    severity: null,
    owner: "M. Chen",
    lastChecked: "Apr 18, 2026",
    publishedUpdate: "Mar 01, 2016",
    affectedDocs: 42,
    gapScore: 0,
    changes: [],
    description: "The global quality management standard for medical device manufacturers."
  },
  {
    id: "IEC-62304",
    code: "IEC 62304",
    version: "2006+A1:2015",
    latestVersion: "2006+A1:2015",
    title: "Medical device software — Software life cycle processes",
    body: "IEC",
    category: "Software",
    status: "up-to-date",
    severity: null,
    owner: "R. Okafor",
    lastChecked: "Apr 19, 2026",
    publishedUpdate: "—",
    affectedDocs: 18,
    gapScore: 0,
    changes: [],
    description: "Lifecycle processes for developing software that is part of a medical device."
  },
  {
    id: "FDA-21-CFR-820",
    code: "21 CFR 820",
    version: "2024 (QMSR)",
    latestVersion: "2024 (QMSR)",
    title: "FDA Quality Management System Regulation",
    body: "FDA",
    category: "QMS",
    status: "under-review",
    severity: "major",
    owner: "M. Chen",
    lastChecked: "Apr 17, 2026",
    publishedUpdate: "Feb 02, 2024",
    affectedDocs: 31,
    gapScore: 28,
    changes: [
      { clause: "820.10", type: "modified", label: "Alignment with ISO 13485:2016", impact: "high" },
      { clause: "820.30", type: "modified", label: "Design controls harmonization", impact: "medium" }
    ],
    description: "US FDA regulation harmonizing with ISO 13485. Compliance deadline Feb 2026."
  },
  {
    id: "ISO-14971",
    code: "ISO 14971",
    version: "2019",
    latestVersion: "2019",
    title: "Medical devices — Application of risk management to medical devices",
    body: "ISO",
    category: "Risk",
    status: "up-to-date",
    severity: null,
    owner: "S. Patel",
    lastChecked: "Apr 15, 2026",
    publishedUpdate: "Dec 01, 2019",
    affectedDocs: 24,
    gapScore: 0,
    changes: [],
    description: "Framework for applying risk management throughout the medical device lifecycle."
  },
  {
    id: "IEC-60601-1",
    code: "IEC 60601-1",
    version: "3.2:2020",
    latestVersion: "3.2:2020",
    title: "Medical electrical equipment — General requirements for basic safety",
    body: "IEC",
    category: "Electrical Safety",
    status: "up-to-date",
    severity: null,
    owner: "R. Okafor",
    lastChecked: "Apr 16, 2026",
    publishedUpdate: "Aug 15, 2020",
    affectedDocs: 12,
    gapScore: 0,
    changes: [],
    description: "Safety and essential performance for medical electrical equipment."
  },
  {
    id: "EU-MDR",
    code: "EU MDR 2017/745",
    version: "Consolidated 2023",
    latestVersion: "Consolidated 2024",
    title: "Regulation on medical devices",
    body: "EU",
    category: "Market Access",
    status: "outdated",
    severity: "minor",
    owner: "L. Rossi",
    lastChecked: "Apr 19, 2026",
    publishedUpdate: "Jul 23, 2024",
    affectedDocs: 56,
    gapScore: 8,
    changes: [
      { clause: "Art. 120", type: "modified", label: "Transition periods extended — Reg 2024/1860", impact: "low" }
    ],
    description: "Framework for medical devices placed on the EU market."
  },
  {
    id: "FDA-PCCP",
    code: "FDA PCCP Guidance",
    version: "Dec 2024",
    latestVersion: "Dec 2024",
    title: "Predetermined Change Control Plans for AI/ML Device Software",
    body: "FDA",
    category: "AI/ML",
    status: "up-to-date",
    severity: null,
    owner: "R. Okafor",
    lastChecked: "Apr 18, 2026",
    publishedUpdate: "Dec 04, 2024",
    affectedDocs: 6,
    gapScore: 0,
    changes: [],
    description: "Final guidance on PCCPs for AI-enabled device software functions."
  },
  {
    id: "ISO-27001",
    code: "ISO 27001",
    version: "2022",
    latestVersion: "2022",
    title: "Information security management systems — Requirements",
    body: "ISO",
    category: "InfoSec",
    status: "up-to-date",
    severity: null,
    owner: "J. Brooks",
    lastChecked: "Apr 12, 2026",
    publishedUpdate: "Oct 25, 2022",
    affectedDocs: 19,
    gapScore: 0,
    changes: [],
    description: "Information security controls applicable to device manufacturers."
  },
  {
    id: "IEC-82304-1",
    code: "IEC 82304-1",
    version: "2016",
    latestVersion: "2016",
    title: "Health software — Part 1: General requirements for product safety",
    body: "IEC",
    category: "Software",
    status: "up-to-date",
    severity: null,
    owner: "R. Okafor",
    lastChecked: "Apr 14, 2026",
    publishedUpdate: "Oct 01, 2016",
    affectedDocs: 9,
    gapScore: 0,
    changes: [],
    description: "Safety and security requirements for standalone health software products."
  },
  {
    id: "ICH-E6-R3",
    code: "ICH E6(R3)",
    version: "2023 Step 4",
    latestVersion: "2023 Step 4",
    title: "Good Clinical Practice (GCP)",
    body: "ICH",
    category: "Clinical",
    status: "up-to-date",
    severity: null,
    owner: "S. Patel",
    lastChecked: "Apr 11, 2026",
    publishedUpdate: "May 19, 2023",
    affectedDocs: 4,
    gapScore: 0,
    changes: [],
    description: "Principles of good clinical practice for clinical investigations."
  },
  {
    id: "FDA-Cyber",
    code: "FDA Cybersecurity in Devices",
    version: "Sep 2023",
    latestVersion: "Sep 2023",
    title: "Cybersecurity in Medical Devices: Quality System Considerations",
    body: "FDA",
    category: "Security",
    status: "up-to-date",
    severity: null,
    owner: "J. Brooks",
    lastChecked: "Apr 19, 2026",
    publishedUpdate: "Sep 27, 2023",
    affectedDocs: 14,
    gapScore: 0,
    changes: [],
    description: "Premarket submission expectations for device cybersecurity."
  },
  {
    id: "ISO-10993-1",
    code: "ISO 10993-1",
    version: "2018",
    latestVersion: "2025",
    title: "Biological evaluation of medical devices — Part 1: Evaluation and testing within a risk management process",
    body: "ISO",
    category: "Biocompatibility",
    status: "outdated",
    severity: "major",
    owner: "S. Patel",
    lastChecked: "Apr 08, 2026",
    publishedUpdate: "Feb 01, 2025",
    affectedDocs: 8,
    gapScore: 40,
    changes: [
      { clause: "4.2", type: "modified", label: "Risk management integration — aligned with ISO 14971:2019", impact: "high" },
      { clause: "5.1", type: "modified", label: "Biological evaluation plan requirements expanded", impact: "high" },
      { clause: "6.3", type: "added",    label: "Requirements for chemical characterization data", impact: "medium" },
      { clause: "8.0", type: "modified", label: "Post-market surveillance biological data requirements", impact: "medium" }
    ],
    description: "Evaluation and testing within a risk management process. 2025 edition aligns with ISO 14971:2019 and adds chemical characterization requirements."
  }
];

window.ALERTS_DATA_DEMO = [
  {
    id: 1,
    when: "Mar 2025",
    date: "Mar 01, 2025",
    regId: "ISO-10993-1",
    code: "ISO 10993-1",
    severity: "major",
    type: "new-version",
    title: "ISO 10993-1:2025 published — replaces 2018 edition",
    body: "New edition aligns biological evaluation with ISO 14971:2019, expands chemical characterization requirements. Your controlled version (2018) is superseded."
  },
  {
    id: 2,
    when: "Jul 2024",
    date: "Jul 23, 2024",
    regId: "EU-MDR",
    code: "EU MDR 2017/745",
    severity: "minor",
    type: "modified",
    title: "Regulation 2024/1860 — transition periods extended",
    body: "Consolidated text updated. Extended transition periods for legacy devices under Art. 120. Review your device classification and applicable dates."
  },
  {
    id: 3,
    when: "Feb 2024",
    date: "Feb 02, 2024",
    regId: "FDA-21-CFR-820",
    code: "21 CFR 820",
    severity: "major",
    type: "new-version",
    title: "QMSR final rule published — transition deadline Feb 2026",
    body: "FDA harmonized 21 CFR 820 with ISO 13485. Compliance was required by Feb 2, 2026. Verify your QMS has been updated to QMSR requirements."
  }
];

window.CATALOG_DATA = [
  // ISO — QMS & General
  { body: "ISO", code: "ISO 9001:2015",           title: "Quality management systems — Requirements",                                                   category: "QMS" },
  { body: "ISO", code: "ISO 13485:2016",           title: "Medical devices — Quality management systems — Requirements for regulatory purposes",         category: "QMS" },
  { body: "ISO", code: "ISO 14971:2019",           title: "Medical devices — Application of risk management to medical devices",                         category: "Risk" },
  { body: "ISO", code: "ISO 15223-1:2021",         title: "Symbols to be used with information to be supplied by the manufacturer — Part 1",            category: "Labelling" },
  { body: "ISO", code: "ISO 20417:2021",           title: "Medical devices — Information to be supplied by the manufacturer",                            category: "Labelling" },
  { body: "ISO", code: "ISO 15225:2023",           title: "Nomenclature — Guidance for nomenclature system for medical devices",                         category: "Labelling" },

  // ISO — Biocompatibility (10993 series)
  { body: "ISO", code: "ISO 10993-1:2025",         title: "Biological evaluation — Part 1: Evaluation and testing within a risk management process",    category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-2:2022",         title: "Biological evaluation — Part 2: Animal welfare requirements",                                category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-3:2014",         title: "Biological evaluation — Part 3: Tests for genotoxicity, carcinogenicity, reproductive",      category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-4:2017",         title: "Biological evaluation — Part 4: Tests for interactions with blood",                          category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-5:2009",         title: "Biological evaluation — Part 5: Tests for in vitro cytotoxicity",                            category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-6:2016",         title: "Biological evaluation — Part 6: Tests for local effects after implantation",                 category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-9:2019",         title: "Biological evaluation — Part 9: Framework for identification and quantification of degradation products", category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-11:2017",        title: "Biological evaluation — Part 11: Tests for systemic toxicity",                               category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-12:2021",        title: "Biological evaluation — Part 12: Sample preparation and reference materials",                category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-13:2010",        title: "Biological evaluation — Part 13: Identification and quantification of degradation products from polymeric medical devices", category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-17:2023",        title: "Biological evaluation — Part 17: Establishment of permissible limits for leachable substances", category: "Biocompatibility" },
  { body: "ISO", code: "ISO 10993-18:2020",        title: "Biological evaluation — Part 18: Chemical characterization of medical device materials",     category: "Biocompatibility" },

  // ISO — Sterilization
  { body: "ISO", code: "ISO 11135:2014",           title: "Sterilization of health-care products — Ethylene oxide — Requirements",                      category: "Sterilization" },
  { body: "ISO", code: "ISO 11137-1:2023",         title: "Sterilization — Radiation — Part 1: Requirements for development, validation and routine control", category: "Sterilization" },
  { body: "ISO", code: "ISO 11137-2:2023",         title: "Sterilization — Radiation — Part 2: Establishing the sterilization dose",                    category: "Sterilization" },
  { body: "ISO", code: "ISO 11137-3:2017",         title: "Sterilization — Radiation — Part 3: Guidance on dosimetric aspects",                         category: "Sterilization" },
  { body: "ISO", code: "ISO 11607-1:2019",         title: "Packaging for terminally sterilized devices — Part 1: Materials, sterile barrier systems",   category: "Sterilization" },
  { body: "ISO", code: "ISO 11607-2:2019",         title: "Packaging for terminally sterilized devices — Part 2: Validation requirements",              category: "Sterilization" },
  { body: "ISO", code: "ISO 17665-1:2024",         title: "Sterilization — Moist heat — Part 1: Requirements for development, validation and routine control", category: "Sterilization" },
  { body: "ISO", code: "ISO 14937:2009",           title: "Sterilization of health-care products — General criteria for characterization of a sterilizing agent", category: "Sterilization" },

  // ISO — Clinical & IVD
  { body: "ISO", code: "ISO 14155:2020",           title: "Clinical investigation of medical devices for human subjects — Good clinical practice",       category: "Clinical" },
  { body: "ISO", code: "ISO 14155:2020/AMD 1:2021",title: "Clinical investigation of medical devices — Amendment 1: Decentralised clinical investigations", category: "Clinical" },
  { body: "ISO", code: "ISO 17511:2020",           title: "In vitro diagnostic medical devices — Requirements for establishing metrological traceability", category: "IVD" },
  { body: "ISO", code: "ISO 18113-1:2009",         title: "In vitro diagnostic medical devices — Information supplied by the manufacturer — Part 1: Terms, definitions and general requirements", category: "IVD" },
  { body: "ISO", code: "ISO 23640:2021",           title: "In vitro diagnostic medical devices — Evaluation of stability of in vitro diagnostic reagents", category: "IVD" },
  { body: "ISO", code: "ISO 22870:2016",           title: "Point-of-care testing — Requirements for quality and competence",                             category: "IVD" },

  // ISO — Animal tissues & materials
  { body: "ISO", code: "ISO 22442-1:2020",         title: "Medical devices utilizing animal tissues — Part 1: Application of risk management",          category: "Biocompatibility" },

  // ISO — InfoSec
  { body: "ISO", code: "ISO 27001:2022",           title: "Information security management systems — Requirements",                                      category: "InfoSec" },
  { body: "ISO", code: "ISO 27799:2016",           title: "Health informatics — Information security management in health using ISO/IEC 27002",         category: "InfoSec" },
  { body: "ISO", code: "ISO 27701:2019",           title: "Extension to ISO/IEC 27001 for privacy information management",                              category: "InfoSec" },

  // IEC — Electrical Safety (60601 series)
  { body: "IEC", code: "IEC 60601-1:2020",         title: "Medical electrical equipment — Part 1: General requirements for basic safety and essential performance", category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-1-2:2014+A1:2020",title:"Medical electrical equipment — Part 1-2: Electromagnetic disturbances — Requirements and tests", category: "EMC" },
  { body: "IEC", code: "IEC 60601-1-3:2013+A2:2020",title:"Medical electrical equipment — Part 1-3: Radiation protection in diagnostic X-ray equipment", category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-1-6:2010+A2:2020",title:"Medical electrical equipment — Part 1-6: Usability",                                        category: "Usability" },
  { body: "IEC", code: "IEC 60601-1-8:2006+A2:2020",title:"Medical electrical equipment — Part 1-8: Alarm systems",                                    category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-1-9:2007+A2:2020",title:"Medical electrical equipment — Part 1-9: Ecodesign requirements",                           category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-1-10:2007+A2:2020",title:"Medical electrical equipment — Part 1-10: Physiological closed-loop controllers",          category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-1-11:2015+A1:2020",title:"Medical electrical equipment — Part 1-11: Home healthcare environments",                    category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-1-12:2014+A1:2020",title:"Medical electrical equipment — Part 1-12: Emergency and transport environments",            category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-2-1:2020",       title: "Medical electrical equipment — Part 2-1: Particular requirements for electron accelerators", category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-2-25:2011+A1:2015",title:"Medical electrical equipment — Part 2-25: Electrocardiographs",                            category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-2-27:2011+A1:2015",title:"Medical electrical equipment — Part 2-27: Electrocardiographic monitoring equipment",      category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-2-33:2022",      title: "Medical electrical equipment — Part 2-33: Magnetic resonance equipment for medical diagnosis", category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-2-43:2010+A1:2015",title:"Medical electrical equipment — Part 2-43: X-ray equipment for interventional procedures",  category: "Electrical Safety" },
  { body: "IEC", code: "IEC 60601-2-44:2009+A2:2016",title:"Medical electrical equipment — Part 2-44: X-ray equipment for computed tomography",        category: "Electrical Safety" },

  // IEC — Software, Usability, Security
  { body: "IEC", code: "IEC 62304:2006+A1:2015",  title: "Medical device software — Software life cycle processes",                                     category: "Software" },
  { body: "IEC", code: "IEC 62366-1:2015+A1:2020",title: "Medical devices — Part 1: Application of usability engineering",                              category: "Usability" },
  { body: "IEC", code: "IEC 82304-1:2016",         title: "Health software — Part 1: General requirements for product safety",                           category: "Software" },
  { body: "IEC", code: "IEC 81001-5-1:2021",       title: "Health software and health IT — Security — Part 5-1: Cybersecurity activities in the product life cycle", category: "Security" },
  { body: "IEC", code: "IEC 80001-1:2021",         title: "Application of risk management to IT-networks incorporating medical devices — Part 1",        category: "Risk" },

  // FDA Regulations
  { body: "FDA", code: "21 CFR 820 (QMSR)",        title: "Quality Management System Regulation (harmonized with ISO 13485)",                           category: "QMS" },
  { body: "FDA", code: "21 CFR 11",                 title: "Electronic Records; Electronic Signatures",                                                  category: "Records" },
  { body: "FDA", code: "21 CFR 803",                title: "Medical Device Reporting",                                                                   category: "Vigilance" },
  { body: "FDA", code: "21 CFR 806",                title: "Medical Devices — Reports of Corrections and Removals",                                      category: "Vigilance" },
  { body: "FDA", code: "21 CFR 807",                title: "Establishment Registration and Device Listing; Premarket Notification (510k)",               category: "Market Access" },
  { body: "FDA", code: "21 CFR 814",                title: "Premarket Approval of Medical Devices (PMA)",                                                category: "Market Access" },
  { body: "FDA", code: "21 CFR 830",                title: "Unique Device Identification (UDI)",                                                         category: "Labelling" },
  { body: "FDA", code: "21 CFR 801",                title: "Labeling",                                                                                   category: "Labelling" },

  // FDA Guidances
  { body: "FDA", code: "PCCP Guidance 2024",        title: "Predetermined Change Control Plans for AI/ML Device Software Functions",                      category: "AI/ML" },
  { body: "FDA", code: "Cybersecurity 2023",         title: "Cybersecurity in Medical Devices: Quality System Considerations and Premarket Submissions",   category: "Security" },
  { body: "FDA", code: "SaMD Guidance 2019",        title: "Policy for Device Software Functions and Mobile Medical Applications",                        category: "Software" },
  { body: "FDA", code: "CDS Guidance 2022",         title: "Clinical Decision Support Software",                                                          category: "Software" },
  { body: "FDA", code: "De Novo Guidance 2021",     title: "De Novo Classification Process (Evaluation of Automatic Class III Designation)",              category: "Market Access" },
  { body: "FDA", code: "Breakthrough Device 2023",  title: "Breakthrough Device Designation Program",                                                     category: "Market Access" },
  { body: "FDA", code: "ASCA 2022",                 title: "Accreditation Scheme for Conformity Assessment",                                              category: "QMS" },
  { body: "FDA", code: "AI Action Plan 2025",       title: "Artificial Intelligence in Drug and Biological Product Manufacturing",                        category: "AI/ML" },

  // EU Regulations
  { body: "EU",   code: "EU MDR 2017/745",          title: "Regulation on medical devices (consolidated 2026)",                                           category: "Market Access" },
  { body: "EU",   code: "EU IVDR 2017/746",         title: "Regulation on in vitro diagnostic medical devices",                                           category: "Market Access" },

  // MDCG — Clinical Evaluation & PMCF
  { body: "MDCG", code: "MDCG 2019-9 Rev.1",        title: "Summary of safety and clinical performance",                                                   category: "Clinical" },
  { body: "MDCG", code: "MDCG 2019-3 Rev.1",        title: "Clinical evaluation consultation procedure exemptions — interpretation of article 54(2)b",      category: "Clinical" },
  { body: "MDCG", code: "MDCG 2020-5",              title: "Guidance on clinical evaluation – Equivalence",                                                category: "Clinical" },
  { body: "MDCG", code: "MDCG 2020-6",              title: "Guidance on sufficient clinical evidence for legacy devices",                                   category: "Clinical" },
  { body: "MDCG", code: "MDCG 2020-7",              title: "Guidance on PMCF plan template",                                                               category: "Clinical" },
  { body: "MDCG", code: "MDCG 2020-8",              title: "Guidance on PMCF evaluation report template",                                                  category: "Clinical" },
  { body: "MDCG", code: "MDCG 2020-13",             title: "Clinical evaluation assessment report template",                                                category: "Clinical" },
  { body: "MDCG", code: "MDCG 2020-15",             title: "Clinical evaluation assessment report template (supplementary)",                                category: "Clinical" },
  { body: "MDCG", code: "MDCG 2023-7",              title: "Guidance on exemptions from the requirement to perform clinical investigations pursuant to Article 61(4)-(6) MDR", category: "Clinical" },
  { body: "MDCG", code: "MDCG 2024-10",             title: "Clinical evaluation of orphan medical devices",                                                category: "Clinical" },

  // MDCG — Clinical Investigation
  { body: "MDCG", code: "MDCG 2021-6 Rev.1",        title: "Regulation (EU) 2017/745 — Questions & Answers regarding clinical investigation",              category: "Clinical" },
  { body: "MDCG", code: "MDCG 2021-8",              title: "Clinical investigation application/notification documents",                                    category: "Clinical" },
  { body: "MDCG", code: "MDCG 2021-28",             title: "Substantial modification of clinical investigation under Medical Device Regulation",            category: "Clinical" },
  { body: "MDCG", code: "MDCG 2024-3",              title: "Guidance on content of the Clinical Investigation Plan for clinical investigations of medical devices", category: "Clinical" },
  { body: "MDCG", code: "MDCG 2024-5",              title: "Guidance on the Investigator's Brochure content",                                              category: "Clinical" },
  { body: "MDCG", code: "MDCG 2024-15",             title: "Guidance on the publication of clinical investigation reports and their summaries in the absence of EUDAMED", category: "Clinical" },

  // MDCG — Safety Reporting
  { body: "MDCG", code: "MDCG 2020-10/1 Rev.1",     title: "Guidance on safety reporting in clinical investigations",                                      category: "Safety" },
  { body: "MDCG", code: "MDCG 2020-10/2 Rev.1",     title: "Guidance on safety reporting in clinical investigations — Appendix: Clinical investigation summary safety report form", category: "Safety" },

  // MDCG — Post-Market Surveillance & Vigilance
  { body: "MDCG", code: "MDCG 2022-21",             title: "Guidance on Periodic Safety Update Report (PSUR) according to Regulation (EU) 2017/745",      category: "Vigilance" },
  { body: "MDCG", code: "MDCG 2023-3 Rev.2",        title: "Questions and Answers on vigilance terms and concepts as outlined in Regulation (EU) 2017/745 and Regulation (EU) 2017/746", category: "Vigilance" },
  { body: "MDCG", code: "MDCG 2024-1",              title: "Device Specific Vigilance Guidance (DSVG) Template",                                          category: "Vigilance" },
  { body: "MDCG", code: "MDCG 2025-10",             title: "Guidance on post-market surveillance of medical devices and in vitro diagnostic medical devices", category: "Vigilance" },

  // MDCG — Software, Digital Health & AI
  { body: "MDCG", code: "MDCG 2019-11 Rev.1",       title: "Qualification and classification of software under Regulation (EU) 2017/745 and Regulation (EU) 2017/746", category: "Software" },
  { body: "MDCG", code: "MDCG 2020-1",              title: "Guidance on clinical evaluation (MDR) / Performance evaluation (IVDR) of medical device software", category: "Software" },
  { body: "MDCG", code: "MDCG 2023-4",              title: "Medical Device Software (MDSW) — Hardware combinations: Guidance on MDSW intended to work in combination with hardware", category: "Software" },
  { body: "MDCG", code: "MDCG 2025-4",              title: "Guidance on the safe making available of medical device software (MDSW) apps on online platforms", category: "Software" },
  { body: "MDCG", code: "MDCG 2025-6",              title: "FAQ on Interplay between MDR/IVDR and the Artificial Intelligence Act (AIA)",                  category: "AI/ML" },

  // MDCG — Cybersecurity
  { body: "MDCG", code: "MDCG 2019-16 Rev.1",       title: "Guidance on cybersecurity for medical devices",                                                category: "Security" },

  // MDCG — UDI
  { body: "MDCG", code: "MDCG 2018-3 Rev.1",        title: "Guidance on UDI for systems and procedure packs",                                              category: "Labelling" },
  { body: "MDCG", code: "MDCG 2018-4",              title: "Definitions/descriptions and formats of the UDI core elements for systems or procedure packs",  category: "Labelling" },
  { body: "MDCG", code: "MDCG 2018-5",              title: "UDI assignment to medical device software",                                                    category: "Labelling" },
  { body: "MDCG", code: "MDCG 2018-6",              title: "Clarifications of UDI related responsibilities in relation to article 16",                      category: "Labelling" },
  { body: "MDCG", code: "MDCG 2019-1",              title: "MDCG guiding principles for issuing entities rules on basic UDI-DI",                            category: "Labelling" },
  { body: "MDCG", code: "MDCG 2019-2",              title: "Guidance on application of UDI rules to device-part of products referred to in article 1(8), 1(9) and 1(10)", category: "Labelling" },
  { body: "MDCG", code: "MDCG 2021-19",             title: "Guidance note integration of the UDI within an organisation's quality management system",       category: "Labelling" },
  { body: "MDCG", code: "MDCG 2022-7",              title: "Q&A on the Unique Device Identification system under Regulation (EU) 2017/745 and Regulation (EU) 2017/746", category: "Labelling" },
  { body: "MDCG", code: "MDCG 2024-14 Rev.1",       title: "Guidance on the implementation of the Master UDI-DI solution for contact lenses",              category: "Labelling" },
  { body: "MDCG", code: "MDCG 2025-7 Rev.1",        title: "MDCG Position Paper: Timelines of the implementation of 'Master UDI-DI' to contact lenses and spectacle frames", category: "Labelling" },
  { body: "MDCG", code: "MDCG 2025-8 Rev.1",        title: "Guidance on the implementation of the Master UDI-DI solution for spectacle frames, spectacle lenses and ready-to-wear reading spectacles", category: "Labelling" },

  // MDCG — IVD-Specific
  { body: "MDCG", code: "MDCG 2020-16 Rev.4",       title: "Guidance on Classification Rules for in vitro Diagnostic Medical Devices under Regulation (EU) 2017/746", category: "IVD" },
  { body: "MDCG", code: "MDCG 2021-4 Rev.1",        title: "Application of transitional provisions for certification of class D in vitro diagnostic medical devices", category: "IVD" },
  { body: "MDCG", code: "MDCG 2021-22 Rev.1",       title: "Clarification on 'first certification for that type of device' — context of expert panel consultation Article 48(6) IVDR", category: "IVD" },
  { body: "MDCG", code: "MDCG 2022-2",              title: "Guidance on general principles of clinical evidence for In Vitro Diagnostic medical devices",   category: "IVD" },
  { body: "MDCG", code: "MDCG 2022-3 Rev.1",        title: "Verification of manufactured class D IVDs by notified bodies",                                 category: "IVD" },
  { body: "MDCG", code: "MDCG 2022-6",              title: "Guidance on significant changes regarding the transitional provision under Article 110(3) of the IVDR", category: "IVD" },
  { body: "MDCG", code: "MDCG 2022-8",              title: "Regulation (EU) 2017/746 — application of IVDR requirements to 'legacy devices' and to devices placed on the market prior to 26 May 2022", category: "IVD" },
  { body: "MDCG", code: "MDCG 2022-9 Rev.1",        title: "Summary of safety and performance template (IVDR)",                                             category: "IVD" },
  { body: "MDCG", code: "MDCG 2022-15",             title: "Guidance on appropriate surveillance regarding transitional provisions under Article 110 IVDR",  category: "IVD" },
  { body: "MDCG", code: "MDCG 2022-19",             title: "Performance study application/notification documents under Regulation (EU) 2017/746",            category: "IVD" },
  { body: "MDCG", code: "MDCG 2022-20",             title: "Substantial modification of performance study under Regulation (EU) 2017/746",                  category: "IVD" },
  { body: "MDCG", code: "MDCG 2024-4",              title: "Safety reporting in performance studies of in vitro diagnostic medical devices under Regulation (EU) 2017/746", category: "IVD" },
  { body: "MDCG", code: "MDCG 2024-11",             title: "Guidance on qualification of in vitro diagnostic medical devices",                              category: "IVD" },
  { body: "MDCG", code: "MDCG 2025-5",              title: "Questions & Answers regarding performance studies of in vitro diagnostic medical devices under Regulation (EU) 2017/746", category: "IVD" },

  // MDCG — Classification & Borderline
  { body: "MDCG", code: "MDCG 2019-15 Rev.1",       title: "Guidance notes for manufacturers of class I medical devices",                                   category: "Classification" },
  { body: "MDCG", code: "MDCG 2021-24 Rev.1",       title: "Guidance on classification of medical devices",                                                 category: "Classification" },
  { body: "MDCG", code: "MDCG 2022-5 Rev.1",        title: "Guidance on borderline between medical devices and medicinal products under Regulation (EU) 2017/745", category: "Classification" },
  { body: "MDCG", code: "MDCG 2023-5",              title: "Guidance on qualification and classification of Annex XVI products",                             category: "Classification" },
  { body: "MDCG", code: "MDCG 2023-6",              title: "Guidance on demonstration of equivalence for Annex XVI products",                                category: "Classification" },
  { body: "MDCG", code: "MDCG 2024-13",             title: "Regulatory status of ethylene oxide (EtO) intended for the sterilisation of medical devices",   category: "Classification" },

  // MDCG — Market Access, Transitional & Legacy
  { body: "MDCG", code: "MDCG 2020-3 Rev.1",        title: "Guidance on significant changes regarding the transitional provision under Article 120 of the MDR with regard to devices covered by MDD or AIMDD certificates", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2021-3",              title: "Questions and Answers on Custom-Made Devices",                                                  category: "Market Access" },
  { body: "MDCG", code: "MDCG 2021-25 Rev.1",       title: "Application of MDR requirements to 'legacy devices' and to devices placed on the market prior to 26 May 2021", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2021-26",             title: "Q&A on repackaging & relabelling activities under Article 16 of Regulation (EU) 2017/745 and Regulation (EU) 2017/746", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2021-27 Rev.1",       title: "Questions and Answers on Articles 13 & 14 of Regulation (EU) 2017/745 and Regulation (EU) 2017/746", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2022-4 Rev.2",        title: "Guidance on appropriate surveillance regarding the transitional provisions under Article 120 of the MDR", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2022-11 Rev.1",       title: "MDCG Position Paper: Notice to manufacturers to ensure timely compliance with MDR and IVDR requirements", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2022-14",             title: "Transition to the MDR and IVDR — Notified body capacity and availability of medical devices and IVDs", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2022-16",             title: "Guidance on Authorised Representatives under Regulation (EU) 2017/745 and Regulation (EU) 2017/746", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2022-18",             title: "MDCG Position Paper on the application of Article 97 MDR to legacy devices for which the MDD or AIMDD certificate expires before the issuance of a MDR certificate", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2023-1",              title: "Guidance on the health institution exemption under Article 5(5) of Regulation (EU) 2017/745 and Regulation (EU) 2017/746", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2024-16",             title: "Manufacturer Information Form on Interruption or Discontinuation of Supply of certain medical devices and certain in vitro diagnostic medical devices", category: "Market Access" },
  { body: "MDCG", code: "MDCG 2025-9",              title: "Guidance on Breakthrough Devices (BtX) under Regulations 2017/745 & 2017/746",                  category: "Market Access" },

  // MDCG — EUDAMED & Registration
  { body: "MDCG", code: "MDCG 2021-1 Rev.1",        title: "Guidance on harmonised administrative practices and alternative technical solutions until EUDAMED is fully functional", category: "Records" },
  { body: "MDCG", code: "MDCG 2021-13 Rev.1",       title: "Questions and answers on obligations and related rules for the registration in EUDAMED of actors other than manufacturers, authorised representatives and importers", category: "Records" },
  { body: "MDCG", code: "MDCG 2022-12",             title: "Guidance on harmonised administrative practices and alternative technical solutions until EUDAMED is fully functional (for IVDR)", category: "Records" },

  // MDCG — PRRC, Implant Cards, Labelling, Standardisation
  { body: "MDCG", code: "MDCG 2019-7 Rev.1",        title: "Guidance on article 15 MDR/IVDR on a 'Person Responsible for Regulatory Compliance' (PRRC)",    category: "QMS" },
  { body: "MDCG", code: "MDCG 2019-8 V2",           title: "Guidance document implant card on the application of Article 18 Regulation (EU) 2017/745 on medical devices", category: "Labelling" },
  { body: "MDCG", code: "MDCG 2021-5 Rev.1",        title: "Guidance on standardisation for medical devices",                                                category: "QMS" },
  { body: "MDCG", code: "MDCG 2021-11",             title: "Guidance on Implant Card — Device types",                                                        category: "Labelling" },
  { body: "MDCG", code: "MDCG 2018-8",              title: "Guidance on content of the certificates, voluntary certificate transfers",                        category: "Market Access" },

  // ICH Guidelines
  { body: "ICH",  code: "ICH E6(R3)",               title: "Good Clinical Practice (GCP)",                                                                category: "Clinical" },
  { body: "ICH",  code: "ICH E8(R1)",               title: "General considerations for clinical studies",                                                 category: "Clinical" },
  { body: "ICH",  code: "ICH Q8(R2)",               title: "Pharmaceutical development",                                                                  category: "QMS" },
  { body: "ICH",  code: "ICH Q9(R1)",               title: "Quality risk management",                                                                     category: "Risk" },
  { body: "ICH",  code: "ICH Q10",                  title: "Pharmaceutical quality system",                                                               category: "QMS" },
  { body: "ICH",  code: "ICH Q11",                  title: "Development and manufacture of drug substances (chemical and biotechnological)",              category: "QMS" },
  { body: "ICH",  code: "ICH Q12",                  title: "Technical and regulatory considerations for pharmaceutical product lifecycle management",      category: "QMS" },

  // AAMI / ANSI / ASTM
  { body: "AAMI", code: "AAMI TIR57:2016",          title: "Principles for medical device security — Risk management",                                    category: "Security" },
  { body: "AAMI", code: "AAMI TIR97:2019",          title: "Principles for machine learning in medical devices",                                          category: "AI/ML" },
  { body: "AAMI", code: "AAMI TIR132:2022",         title: "Guidance on applying IEC 62304 and IEC 82304-1",                                             category: "Software" },
  { body: "ASTM", code: "ASTM F2132:2021",          title: "Standard specification for accelerated aging of sterile medical device packages",             category: "Sterilization" },
  { body: "ASTM", code: "ASTM F2475:2016",          title: "Standard guide for biocompatibility evaluation of medical device packaging materials",        category: "Biocompatibility" },
];
