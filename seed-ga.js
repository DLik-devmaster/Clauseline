// seed-ga.js — populate gap assessment data for all tracked regulations
// Run: node --env-file=.env seed-ga.js

const API = 'http://localhost:3001/api';

const assessments = [
  {
    id: 'ADDED-ISO-13485-2016',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '4.1', type: 'modified', impact: 'high',
        label: 'Risk-based approach now required throughout QMS',
        action: 'Review all QMS procedures to integrate risk-based thinking; document rationale for exclusions' },
      { clause: '6.2', type: 'modified', impact: 'medium',
        label: 'Competence requirements extended to outsourced processes',
        action: 'Update supplier qualification procedure to include competency assessment for critical outsourced functions' },
      { clause: '7.1', type: 'modified', impact: 'high',
        label: 'Risk management integration required throughout product realization',
        action: 'Ensure risk management plan explicitly references all product realization stages (§7.2–7.6)' },
      { clause: '7.3.2', type: 'added', impact: 'medium',
        label: 'Usability requirements now mandatory design input',
        action: 'Update design input template to include usability and human factors requirements per IEC 62366' },
      { clause: '8.2.1', type: 'added', impact: 'high',
        label: 'Post-market surveillance feedback system mandatory',
        action: 'Establish formal PMS procedure with defined data collection, analysis and trending requirements' },
      { clause: '8.5.2', type: 'modified', impact: 'medium',
        label: 'CAPA effectiveness verification now explicitly required',
        action: 'Update CAPA SOP to include documented effectiveness check with defined timeframe and criteria' },
    ]
  },
  {
    id: 'ADDED-ISO-14971-2019',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '3', type: 'modified', impact: 'high',
        label: 'Benefit-risk analysis concept formally introduced',
        action: 'Update risk management SOP and plan to include explicit benefit-risk analysis section' },
      { clause: '4.5', type: 'added', impact: 'medium',
        label: 'Risk management must cover entire product lifecycle including obsolescence',
        action: 'Extend risk management plan scope to include end-of-life and decommissioning considerations' },
      { clause: '7', type: 'modified', impact: 'high',
        label: 'Residual risk acceptability criteria require explicit documented justification',
        action: 'Update risk acceptability criteria in risk management plan with explicit justification referencing clinical data' },
      { clause: '8', type: 'modified', impact: 'high',
        label: 'Post-market data must be used to update risk assessment',
        action: 'Establish formal data loop from PMS/PMCF reports into risk management file review' },
      { clause: 'Annex I', type: 'added', impact: 'low',
        label: 'New guidance on clinical risks in risk evaluation',
        action: 'Review clinical evaluation against new Annex I guidance; update CER risk section accordingly' },
    ]
  },
  {
    id: 'ADDED-IEC-62366-1-2015-A1-2020',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '5.1', type: 'modified', impact: 'medium',
        label: 'Intended user population definition expanded in A1:2020',
        action: 'Review and update intended user profile in usability engineering file to reflect A1 requirements' },
      { clause: '5.6', type: 'modified', impact: 'high',
        label: 'Formative and summative evaluation criteria and documentation clarified',
        action: 'Update usability evaluation protocol to distinguish formative/summative objectives and document rationale' },
      { clause: '5.9', type: 'added', impact: 'high',
        label: 'Critical task identification now requires documented rationale',
        action: 'Add justification documentation to critical task identification in UFMEA' },
      { clause: '5.10', type: 'modified', impact: 'medium',
        label: 'Known use problems must now explicitly reference field data',
        action: 'Update use-error analysis to include post-market use-error data from complaints and vigilance' },
    ]
  },
  {
    id: 'ADDED-ISO-10993-1-2025',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '6.1', type: 'modified', impact: 'high',
        label: 'Chemical characterization now primary approach before in vivo testing',
        action: 'Update biocompatibility evaluation plan to prioritize chemical characterization and AET/TTC analysis' },
      { clause: '6.2', type: 'added', impact: 'high',
        label: 'Threshold of Toxicological Concern (TTC) approach formalized',
        action: 'Implement TTC analysis in chemical characterization reports; train toxicologist on TTC methodology' },
      { clause: '7', type: 'modified', impact: 'high',
        label: 'Biocompatibility decision framework updated with new decision tree',
        action: 'Review all existing biocompatibility evaluations against 2025 decision tree; re-justify animal testing decisions' },
      { clause: '8', type: 'modified', impact: 'medium',
        label: 'Literature-based justification for testing now explicitly accepted with conditions',
        action: 'Document literature-based justifications formally with risk-based rationale in biocompatibility evaluation' },
      { clause: '10', type: 'modified', impact: 'medium',
        label: 'Biocompatibility re-evaluation triggers list updated',
        action: 'Update change management SOP to include biocompatibility re-evaluation triggers per 2025 Annex' },
    ]
  },
  {
    id: 'ADDED-ISO-10993-11-2017',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '4', type: 'modified', impact: 'medium',
        label: 'Systemic toxicity testing approach updated to align with ISO 10993-1 risk-based framework',
        action: 'Review systemic toxicity testing strategy to confirm alignment with 2017 risk-based approach' },
      { clause: '6.3', type: 'modified', impact: 'medium',
        label: 'Sub-chronic and chronic study endpoints expanded',
        action: 'Verify study protocols include all required 2017 endpoints; update if studies were designed to 2006 edition' },
      { clause: 'Annex A', type: 'added', impact: 'low',
        label: 'New guidance on toxicokinetics integration into systemic assessment',
        action: 'Consider toxicokinetics data in systemic toxicity evaluation where material contact levels are significant' },
    ]
  },
  {
    id: 'ADDED-ISO-10993-2-2022',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '4', type: 'modified', impact: 'high',
        label: '3Rs principles (Replace, Reduce, Refine) now mandatory consideration before any animal testing',
        action: 'Update animal testing justification template to include formal 3Rs consideration and alternatives assessment' },
      { clause: '5.2', type: 'added', impact: 'medium',
        label: 'Non-animal methods must be systematically evaluated and documented before in vivo studies',
        action: 'Add non-animal alternatives screening step to biocompatibility testing plan' },
      { clause: '6', type: 'modified', impact: 'medium',
        label: 'Welfare assessment requirements for animals used in testing expanded',
        action: 'Ensure contract laboratories comply with 2022 welfare requirements; include in supplier audit checklist' },
    ]
  },
  {
    id: 'ADDED-ISO-10993-13-2010',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '5', type: 'modified', impact: 'medium',
        label: 'Polymer degradation product identification methodology updated',
        action: 'Verify polymer degradation study protocols align with current ISO 10993-13 test methods' },
      { clause: '6', type: 'modified', impact: 'low',
        label: 'Reporting requirements for degradation studies clarified',
        action: 'Update degradation study report template to include all required elements per §6' },
    ]
  },
  {
    id: 'ADDED-ISO-15223-1-2021',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '3', type: 'added', impact: 'medium',
        label: '17 new symbols added in 2021 revision',
        action: 'Review labelling to assess if new symbols should replace text-based information; update IFU and packaging' },
      { clause: '4.2', type: 'modified', impact: 'medium',
        label: 'Symbol usage conditions clarified — some symbols now require accompanying text in specific contexts',
        action: 'Audit existing labelling against updated symbol usage conditions; correct non-compliant uses' },
      { clause: '5', type: 'modified', impact: 'low',
        label: 'Validation and testing requirements for symbol legibility updated',
        action: 'Confirm symbol legibility studies meet 2021 requirements; re-validate if symbols were reduced in size' },
    ]
  },
  {
    id: 'ADDED-ISO-15225-2023',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '4', type: 'modified', impact: 'medium',
        label: 'Nomenclature structure updated to align with EUDAMED EMDN classification',
        action: 'Verify EMDN codes assigned in EUDAMED are consistent with ISO 15225:2023 nomenclature structure' },
      { clause: '5', type: 'modified', impact: 'low',
        label: 'Coding rules for combination products and accessories updated',
        action: 'Review nomenclature assignments for combination products and accessories against 2023 edition' },
    ]
  },
  {
    id: 'ADDED-ISO-20417-2021',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '5.4', type: 'added', impact: 'high',
        label: 'Digital IFU (eIFU) conditions formalized — paper IFU may be omitted under specific conditions',
        action: 'Assess eIFU eligibility; if adopting eIFU, establish compliant system per §5.4 and notify competent authority' },
      { clause: '6', type: 'modified', impact: 'medium',
        label: 'Minimum required information elements updated and expanded',
        action: 'Audit IFU and labelling content against updated §6 checklist; address any missing required elements' },
      { clause: '7', type: 'modified', impact: 'low',
        label: 'Language requirements for multi-market devices clarified',
        action: 'Confirm IFU language coverage meets requirements for all markets where device is placed' },
    ]
  },
  {
    id: 'ADDED-IEC-60601-2-44-2009-A2-2016',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '201.7.9', type: 'modified', impact: 'high',
        label: 'Dose display requirements updated in A2:2016 — CTDI and DLP must be displayed before scan',
        action: 'Verify dose display implementation meets A2:2016 requirements; update verification protocol' },
      { clause: '201.12.4', type: 'added', impact: 'high',
        label: 'Automatic exposure control (AEC) testing requirements added',
        action: 'Add AEC performance testing procedure to verification and validation protocol' },
      { clause: '201.4', type: 'modified', impact: 'medium',
        label: 'Essential performance requirements for CT image quality updated',
        action: 'Review image quality verification tests against A2:2016 essential performance requirements' },
    ]
  },
  {
    id: 'ADDED-21-CFR-820--QMSR-',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '§820.30', type: 'modified', impact: 'high',
        label: 'Design controls now harmonized with ISO 13485 §7.3 — same structure required',
        action: 'Update design control procedure to align with ISO 13485 §7.3 requirements; reformat design history file if needed' },
      { clause: '§820.50', type: 'modified', impact: 'high',
        label: 'Purchasing controls expanded — supplier evaluation now requires risk-based approach',
        action: 'Update supplier qualification procedure to include risk classification and risk-based oversight frequency' },
      { clause: '§820.70', type: 'modified', impact: 'medium',
        label: 'Process validation requirements expanded and aligned with ISO 13485',
        action: 'Conduct gap assessment of validated processes against QMSR requirements; update validation SOPs' },
      { clause: '§820.100', type: 'modified', impact: 'medium',
        label: 'CAPA must now explicitly reference risk management outputs',
        action: 'Link CAPA procedure to risk management file; add risk assessment step to CAPA initiation form' },
      { clause: '§820.198', type: 'modified', impact: 'medium',
        label: 'Complaint handling now requires complaint trend analysis at defined intervals',
        action: 'Add complaint trend analysis step to complaint handling SOP with defined periodicity and report format' },
    ]
  },
  {
    id: 'ADDED-21-CFR-830',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '§830.10', type: 'modified', impact: 'high',
        label: 'UDI issuing agency accreditation requirements updated',
        action: 'Verify your UDI issuing agency (GS1, HIBCC, ICCBBA) is currently FDA-accredited; update records' },
      { clause: '§830.20', type: 'modified', impact: 'high',
        label: 'UDI-DI change triggers list updated — new changes requiring new UDI defined',
        action: 'Update change control SOP to include UDI-DI change assessment step using current FDA trigger list' },
      { clause: '§830.50', type: 'modified', impact: 'medium',
        label: 'GUDID submission requirements and data elements updated',
        action: 'Audit GUDID records for completeness against current required data elements; update any missing fields' },
    ]
  },
  {
    id: 'ADDED-Cybersecurity-2023',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: 'Section IV.A', type: 'added', impact: 'high',
        label: 'Software Bill of Materials (SBOM) now mandatory for all connected devices',
        action: 'Establish SBOM generation process; include SBOM in premarket submission for all network-connected devices' },
      { clause: 'Section IV.B', type: 'added', impact: 'high',
        label: 'Cybersecurity testing must cover entire device lifecycle including post-market',
        action: 'Develop post-market cybersecurity monitoring plan; establish vulnerability disclosure policy' },
      { clause: 'Section V', type: 'modified', impact: 'high',
        label: 'Structured Product Labeling (SPL) for cybersecurity information required in submissions',
        action: 'Update premarket submission template to include cybersecurity SPL section' },
      { clause: 'Section VI', type: 'added', impact: 'medium',
        label: 'Patch management plan required as part of design output',
        action: 'Develop and document patch management plan; include in design output documentation' },
      { clause: 'Annex 1', type: 'modified', impact: 'medium',
        label: 'Updated list of recognized cybersecurity standards and frameworks',
        action: 'Review cybersecurity design against NIST CSF 2.0 and IEC 81001-5-1; document mapping' },
    ]
  },
  {
    id: 'ADDED-EU-MDR-2017-745',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: 'Art. 10', type: 'requires', impact: 'high',
        label: 'QMS must cover all aspects of MDR lifecycle — design through post-market',
        action: 'Verify QMS scope statement explicitly covers all Art.10 elements; update QM if gaps identified' },
      { clause: 'Art. 61', type: 'requires', impact: 'high',
        label: 'Clinical evaluation must be based on clinical data — literature alone insufficient for most devices',
        action: 'Review CER methodology; ensure clinical investigation data or PMCF data is included where required' },
      { clause: 'Art. 83–86', type: 'requires', impact: 'high',
        label: 'PMS system and PMCF plan mandatory for all CE-marked devices',
        action: 'Establish PMS plan, PMCF plan, PSUR (class IIb/III) or PMS report (class I/IIa) schedule' },
      { clause: 'Art. 33', type: 'requires', impact: 'medium',
        label: 'EUDAMED registration required — mandatory modules being phased in',
        action: 'Register in EUDAMED; monitor activation dates for UDI, clinical investigation, vigilance modules' },
      { clause: 'Annex I', type: 'requires', impact: 'high',
        label: 'GSPR (General Safety and Performance Requirements) — full compliance required',
        action: 'Conduct GSPR checklist review; document compliance or non-applicability for each requirement' },
    ]
  },
  {
    id: 'ADDED-MDCG-2018-4',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '3.2', type: 'modified', impact: 'high',
        label: 'UDI-DI change triggers — significant changes requiring new UDI-DI clarified',
        action: 'Update change management SOP with UDI-DI change assessment step; train RA team on trigger list' },
      { clause: '4.1', type: 'modified', impact: 'medium',
        label: 'UDI carrier placement requirements updated for combination products and accessories',
        action: 'Verify UDI carrier placement on all device packaging; update labelling specification if needed' },
      { clause: '5.3', type: 'added', impact: 'medium',
        label: 'EUDAMED UDI database submission requirements and timelines clarified',
        action: 'Confirm GUDID/EUDAMED submission status for all marketed devices; plan for mandatory EUDAMED phase-in' },
    ]
  },
  {
    id: 'ADDED-MDCG-2019-9-Rev-1',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '3.1', type: 'modified', impact: 'high',
        label: 'SSCP structure and mandatory sections updated in Rev.1',
        action: 'Review existing SSCP against Rev.1 template; update structure and content to match current requirements' },
      { clause: '4.2', type: 'modified', impact: 'high',
        label: 'Plain language summary requirements clarified — readability validation now expected',
        action: 'Conduct readability testing of SSCP plain language summary with representative lay users' },
      { clause: '5', type: 'added', impact: 'medium',
        label: 'SSCP update triggers now explicitly listed — PMS data must trigger SSCP review',
        action: 'Link SSCP review to PMS/PMCF and PSUR cycle; add SSCP review step to annual QMS review procedure' },
    ]
  },
  {
    id: 'ADDED-MDCG-2020-15',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '2.1', type: 'added', impact: 'high',
        label: 'Clinical Evaluation Assessment Report (CEAR) template introduced as NB reference',
        action: 'Align technical documentation clinical evaluation section structure with CEAR template requirements' },
      { clause: '3', type: 'added', impact: 'medium',
        label: 'Equivalence claims require explicit NB agreement and documentation of access to data',
        action: 'If using equivalence: document contractual access to equivalent device data; prepare equivalence justification matrix' },
      { clause: '4.2', type: 'added', impact: 'medium',
        label: 'State of the art definition must be explicitly addressed in CER',
        action: 'Add explicit "state of the art" section to CER; reference relevant standards, guidance and clinical literature' },
    ]
  },
  {
    id: 'ADDED-MDCG-2021-8',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '3.1', type: 'added', impact: 'high',
        label: 'Clinical investigation application dossier structure standardized across EU MSs',
        action: 'Update clinical investigation SOP to use standardized application dossier structure per MDCG 2021-8 template' },
      { clause: '4', type: 'added', impact: 'high',
        label: 'Substantial modification criteria for clinical investigations defined',
        action: 'Update clinical investigation change management procedure to include MDCG 2021-8 modification assessment' },
      { clause: '5', type: 'added', impact: 'medium',
        label: 'Notification procedure for PMCF investigations clarified',
        action: 'Review PMCF study notification pathway; confirm which MS require full application vs. notification only' },
    ]
  },
  {
    id: 'ADDED-MDCG-2022-21',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '3.1', type: 'modified', impact: 'high',
        label: 'PSUR submission deadline clarified: 30 calendar days after end of reference period',
        action: 'Update SOP-PV-002: specify 30-day deadline in submission checklist; set calendar reminders per device' },
      { clause: '4.2', type: 'added', impact: 'high',
        label: 'Benefit-risk ratio analysis section now mandatory in PSUR',
        action: 'Update PSUR template to include quantitative benefit-risk analysis referencing ISO 14971:2019 §9' },
      { clause: '4.5', type: 'added', impact: 'medium',
        label: 'PSUR must trigger SSCP update if safety signals detected',
        action: 'Link PSUR process to SSCP review; add gate in SOP-PV-002 to initiate SSCP update on safety signal' },
      { clause: 'Annex A', type: 'modified', impact: 'high',
        label: 'PSUR template updated — 3 new mandatory fields (UDI-DI, reference period dates, risk class)',
        action: 'Update PSUR template F-PV-015 with new mandatory fields; verify all existing PSURs are being updated' },
    ]
  },
  {
    id: 'ADDED-MDCG-2024-1',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '2', type: 'added', impact: 'high',
        label: 'Device-Specific Vigilance Guidance (DSVG) template introduced for incident reporting',
        action: 'Review DSVG templates relevant to your device type; update vigilance SOP to reference applicable DSVGs' },
      { clause: '3.1', type: 'added', impact: 'high',
        label: 'Device-specific incident definitions and reporting thresholds clarified per device type',
        action: 'Update incident triage procedure with DSVG-specific thresholds for each device type in your portfolio' },
      { clause: '4', type: 'added', impact: 'medium',
        label: 'Trend reporting analysis methodology now device-specific',
        action: 'Update trend reporting SOP to apply DSVG-specific statistical methods where applicable' },
    ]
  },
  {
    id: 'ADDED-MDCG-2024-10',
    gap_score: 0, status: 'up-to-date', severity: null,
    changes: [
      { clause: '3', type: 'added', impact: 'high',
        label: 'Specific clinical evidence requirements for orphan medical devices defined',
        action: 'If device is for rare condition: update clinical evaluation plan to include orphan device evidence justification framework' },
      { clause: '4.2', type: 'added', impact: 'high',
        label: 'Literature search methodology must explicitly address limited evidence situation',
        action: 'Update CER methodology section to document search strategy adaptations for rare disease limited literature' },
      { clause: '5', type: 'added', impact: 'medium',
        label: 'PMCF requirements for orphan devices — registry-based data accepted as primary evidence',
        action: 'Establish orphan-device specific PMCF plan; consider patient registry participation as PMCF method' },
    ]
  },
];

async function seedAll() {
  console.log(`[seed-ga] seeding ${assessments.length} regulations...`);
  let ok = 0, fail = 0;

  for (const a of assessments) {
    // Fetch current regulation data first
    const getRes = await fetch(`${API}/regulations`);
    const allRegs = await getRes.json();
    const reg = allRegs.find(r => r.id === a.id);
    if (!reg) {
      console.log(`  SKIP  ${a.id} (not in DB)`);
      fail++;
      continue;
    }

    const body = {
      id: reg.id,
      code: reg.code,
      version: reg.version,
      latest_version: reg.latest_version || reg.version,
      title: reg.title,
      body: reg.body,
      category: reg.category,
      status: a.status,
      severity: a.severity,
      gap_score: a.gap_score,
      changes: a.changes,
    };

    const res = await fetch(`${API}/regulations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      console.log(`  OK    ${reg.code} (${a.changes.length} items)`);
      ok++;
    } else {
      const err = await res.text();
      console.log(`  FAIL  ${reg.code}: ${err}`);
      fail++;
    }
  }

  console.log(`\n[seed-ga] done: ${ok} ok, ${fail} failed`);
}

seedAll().catch(err => { console.error(err); process.exit(1); });
