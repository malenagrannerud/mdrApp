/**
 * @file tdData.js
 * @description Dokumentmallar och innehåll för Technical Documentation (TD) i MDR-stegen.
 * KORRIGERING: Sammanslagen och rensad från dubbla deklarationer och trasiga filhuvuden.
 */

export const TD_DATA = {

  // ------------------ STEP 1 FILE (📁 1-DEVICE DESCRIPTION) ------------------
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

  // ------------------ STEP 2 FILES ------------------
  
  // Anropas av sop: TD_DATA.MF_P (Sparas i: 📁 3-DESIGN & MANUFACTURING INFO)
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

  // Anropas av sop: TD_DATA.RM (Sparas i: 📁 5-RISK MANAGEMENT)
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

  // Anropas av sop: TD_DATA.CLIN_EVAL (Sparas i: 📁 6-V&V)
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

  // Anropas av sop: TD_DATA.PMS_PROCESS (Sparas i: 📁 7-PMS)
  PMS_PROCESS: {
    id: 'DOC-05',
    title: '📄 Post_market_surveillance_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Establishes proactive post-market monitoring loops to systematically harvest data from real-world clinical feedback, user complaints, and registry trends.
    `.trim()
  },

  // Anropas av sop: TD_DATA.PRRC_APPOINT (Sparas i: 📁 1-DEVICE DESCRIPTION)
  PRRC_APPOINT: {
    id: 'DOC-06',
    title: '📄 PRRC_appointment_&_mandate_letter.pdf',
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
  }
};

