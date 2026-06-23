/**
 * @file tdData.js
 * @description Dokumentmallar och innehåll för Technical Documentation (TD) i MDR-stegen.
 */

export const TD_DATA = {

  // ------------------ STEP 1 OUTPUT ------------------
  DD: {
    id: 'DOC-01', 
    title: '📄 Device_description_&_rationale.pdf',
    version: '1.0', 
    owner: 'R&D',
    content: `
# 1. Purpose
The purpose of this document is to formally qualify and classify the device under the EU Medical Device Regulation (MDR 2017/745).

## 2. Device Qualification (MDR Article 2(1))
- Statement of intended medical purpose: [Insert precise medical intention]
- Target patient population and core indications: [Insert clinical data]
- Intended users (e.g., healthcare professionals, laypersons): [Insert users]
- Mode of action: Proves that the primary mechanism is physical/mechanical, not pharmacological, immunological, or metabolic.

## 3. Risk Classification Rationale (Annex VIII)
- Applied classification rules: [Insert rule number, e.g., Rule 11 for software]
- Resulting Device Risk Class: [Class I, IIa, IIb, or III]
- Duration of use: [Transient, short-term, or long-term]
    `.trim()
  },

  // ------------------ STEP 2 OUTPUTS ------------------
  MF_P: {
    id: 'DOC-02',
    title: '📄 Manufacturing_process_description.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This procedure defines the methods used to control the design, development, and manufacturing scale-up of the medical device under ISO 13485 Chapter 7.

## 2. Core Manufacturing Steps
- Design Input and Specifications freeze.
- Verification and Validation testing lifecycles.
- Raw material selection and supplier evaluation controls.
- Cleanroom/Assembly and final quality release gates.

## 3. Traceability Infrastructure
[TABLE_START]

| Phase | Requirement | Controlling Document |
| Design Controls | Traceability Matrix | Design History File (DHF) |
| Materials | Batch/Lot Records | Device History Record (DHR) |
| Software | Version Control | Software Configuration Report |
[TABLE_END]
    `.trim()
  }, 

  RM: {
    id: 'DOC-03',
    title: '📄 Risk_management_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Defines the mandatory risk management lifecycle according to ISO 14971 and MDR Annex I Section 3.

## 2. Risk Management Workflow
- 1. Risk Management Planning: Define acceptable risk thresholds.
- 2. Hazard Identification: Map potential software bugs, material toxicities, or user errors.
- 3. Risk Estimation & Evaluation: Quantify probability vs. severity.
- 4. Risk Controls: Implement design-inherent safety, protective measures, or safety labeling.
- 5. Residual Risk Acceptance: Final sign-off by the PRRC.
    `.trim()
  },

  CLIN_EVAL: {
    id: 'DOC-04',
    title: '📄 Clinical_evaluation_plan_CEP.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Establishes the process for conducting clinical evaluations to maintain continuous evidence of safety and performance (MDR Article 61).

## 2. Methodology
- 1. Literature Review: Systematic searching of scientific databases for equivalent data.
- 2. Clinical Experience Data: Analyzing historical registries or internal device generations.
- 3. Clinical Investigation: Protocol for initiating human trials if data gaps exist.
- 4. Compilation: Generating the Clinical Evaluation Report (CER) signed by a qualified clinician.
    `.trim()
  },

  TD_PROCESS: {
    id: 'DOC-05',
    title: '📄 Technical_documentation_compilation_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Defines how the corporate Technical File index is maintained, structured according to MDR Annex II & III, and prepared for Notified Body submission.
    `.trim()
  },

  QMS_MANUAL: {
    id: 'DOC-06',
    title: '📄 Quality_management_system_manual.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
The high-level corporate document detailing how the organization complies with ISO 13485:2016 and MDR Article 10(9).
    `.trim()
  },

  PMS_PROCESS: {
    id: 'DOC-07',
    title: '📄 Post_market_surveillance_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Establishes proactive post-market monitoring loops to systematically harvest data from real-world clinical feedback, user complaints, and registry trends.
    `.trim()
  },

  LABEL_PROCESS: {
    id: 'DOC-08',
    title: '📄 Labeling_and_translation_control_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Governs the creation, verification, and legal translation of user manuals (IFU), software UI strings, and physical product carton labels (MDR Art. 10(11)).
    `.trim()
  },

  CAPA_RECALL: {
    id: 'DOC-09',
    title: '📄 Corrective_action_and_recall_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Outlines the trigger mechanisms for CAPA investigations and the field safety action protocols required to quarantine or execute a full field safety recall.
    `.trim()
  },

  VIGILANCE: {
    id: 'DOC-10',
    title: '📄 Vigilance_and_serious_incident_reporting_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Establishes mandatory pathways to report patient death, temporary or permanent serious health degradations, or public health crises directly to the Competent Authorities.

## 2. Regulatory Reporting Windows
- Serious Public Health Threat: Report within 2 calendar days.
- Death or Unanticipated Serious Degradation: Report within 15 calendar days.
- All other reportable serious incidents: Report within 30 calendar days.
    `.trim()
  },

  REG_INTERACT: {
    id: 'DOC-11',
    title: '📄 Regulatory_authority_interaction_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Defines corporate behavior and documentation protocols during national market audits, sample requests, or unannounced Notified Body audits.
    `.trim()
  },

  LIABILITY: {
    id: 'DOC-12',
    title: '📄 Financial_liability_and_damage_compensation_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Maintains compliance with MDR Article 10(16), ensuring that corporate product liability insurance coverage maps perfectly to the risks of commercial scale.
    `.trim()
  },

  PRRC_APPOINT: {
    id: 'DOC-13',
    title: '📄 PRRC_appointment_and_mandate_letter.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
The official board-signed mandate certifying the appointment of the Person Responsible for Regulatory Compliance under MDR Article 15.

## 2. Core Duties
- Verification of batch releases and device conformity.
- Maintenance of technical documentation.
- Execution of post-market vigilance reporting.
    `.trim()
  },

  EXPERT_MATRIX: {
    id: 'DOC-14',
    title: '📄 External_expertise_and_laboratory_matrix.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
A dynamic register of contracted third-party ISO 17025 accredited test laboratories, biocompatibility consultants, and clinical investigators.
    `.trim()
  }
};
