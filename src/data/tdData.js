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
  
  MF_P: {
    id: 'DOC-02',
    title: '📄 Manufacturing_process_description_product_X.pdf',
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
    title: '📄 RM_procedure_product_X.pdf',
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
    title: '📄 CEP_product_X.pdf',
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

  PMS_PROCESS: {
    id: 'DOC-05',
    title: '📄 PMS_procedure_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Establishes proactive post-market monitoring loops to systematically harvest data from real-world clinical feedback, user complaints, and registry trends.
    `.trim()
  },

  PRRC_APPOINT: {
    id: 'DOC-06',
    title: '📄 PRRC_appointment_&_mandate_letter_product_X.pdf',
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


        // Anropas av sop: TD_DATA.TD_PROCESS (Sparas i: 📁 TECHNICAL DOCUMENTATION Root)
  TD_PROCESS: {
    id: 'DOC',
    title: '📄 Technical_documentation_compilation_procedure.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This procedure defines the system for compiling, monitoring, and maintaining the product-specific Technical Documentation to ensure total compliance with MDR Annex II and Annex III.

## 2. Technical File Index & Deliverables Tracker
The Technical Documentation must be organized as a project deliverables tracker across seven mandatory chapters. Pre-market records occupy folders 1–6, while post-market plans occupy folder 7.

[TABLE_START]

| Chapter / Folder | Phase Focus | Key Deliverable Example |
| 1-DEVICE DESCRIPTION | Pre-Market | Qualification & Rationale Report |
| 2-INFO SUPPLIED BY MFR | Pre-Market | Instructions for Use (IFU) & Labels |
| 3-DESIGN & MFG INFO | Pre-Market | Manufacturing Flowcharts & Validation |
| 4-GSPR | Pre-Market | GSPR Essential Requirements Matrix |
| 5-RISK MANAGEMENT | Pre-Market | Risk Management File (ISO 14971) |
| 6-V&V | Pre-Market | Clinical Evaluation Report (CER) |
| 7-PMS | Post-Market | Post-Market Surveillance Plan |
[TABLE_END]

## 3. Critical Path Monitoring
- Technical documentation compilation is a process of active project tracking.
- Authors (suppliers) must be assigned to each document during project kick-off.
- Final regulatory approval cannot be granted without complete verification and validation records.

## 4. Final Consistency Check
Prior to Notified Body or Health Authority submission, a mandatory alignment check must be executed to ensure:
- Consistent technical vocabulary and document formatting across all R&D units.
- The documentation makes a persuasive argument that the device achieves its claimed medical benefits.
- Risks are mitigated to the lowest possible level representing the current state of the art.

## 5. Change Control and Periodic Review
- Any modification to the device or software code must be recorded in a dedicated change history log.
- Changes requiring prior approval by the Notified Body (Annex IX, 4.10 and Annex X, 5.2) must be flagged before market implementation.
- Periodic reviews must be performed to guarantee the Technical Documentation represents the currently manufactured device state.
    `.trim()
  },


/**
 * @file tdData.js
 * @description Dokumentmallar och innehåll för Technical Documentation (TD) i MDR-stegen.
 * KORRIGERING: Innehåller exakt de 6 filerna från Step 1-2, samt de 2 helt nya filerna från Step 3.
 */



  // ================== STEP 3  ==================
  GSPR_MATRIX: {
    id: 'DOC-08',
    title: '📄 GSPR_compliance_matrix_product_X.xlsx',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This matrix acts as the mandatory General Requirements Checklist to map and demonstrate compliance with all relevant safety and performance requirements of MDR Annex I [MDR 2017/745].

## 2. Technical File Matrix Checklist
[TABLE_START]

| Annex I Clause | Requirement Summary | Harmonised Standard Applied | Evidence Document Reference |
| Chapter I (1-9) | General Safety and Risk Management | EN ISO 14971:2019 | DOC-03 / Hazard_Analysis.pdf |
| Chapter II (10-21) | Requirements Regarding Design & Construction | EN 62304 / ISO 10993 | Software_V&V.pdf / Bio_Report.pdf |
| Chapter III (22) | Information Supplied with the Device | EN ISO 15223-1 / EN 1041 | DOC-09 / IFU_Draft_V1.pdf |
[TABLE_END]

## 3. Compliance & Cross-Directives
- Verification reports and bench test raw data must be mapped against each applicable requirement row.
- Environmental, battery, and hazardous substance cross-directives (e.g., RoHS, REACH) must be logged inside this matrix.
    `.trim()
  },

  LABEL_PACK: {
    id: 'DOC',
    title: '📄 Labeling_and_IFU_Pack_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This document compiles all user-facing information, layout files, and instructions for use required by MDR Annex I Chapter III [MDR 2017/745].

## 2. Deliverables List
- 1. Device Case Label Artwork: Includes Basic UDI-DI placeholders, serial/batch codes, and required safety symbols.
- 2. Instructions for Use (IFU): Technical user manual detailing indications, contraindications, and storage conditions.
- 3. Implant Card & SSCP (If Applicable): Summary of Safety and Clinical Performance required under Article 18 and Article 32 for high-risk Class III/implantable devices.

## 3. Verification & Translations
- All labeling files must align with technical risks mapped in the GSPR checklist.
- Translation procedures must follow corporate QMS workflows before entering local markets.
    `.trim()
  },



  // ================== STEP 4 NEW FILES ==================
  CER_REPORT: {
    id: 'DOC-',
    title: '📄 CER_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This report synthesizes all analyzed clinical data to demonstrate sufficient clinical evidence of safety and performance under MDR Article 61(11).

## 2. Technical File Clinical Records
- Device Equivalence Evaluation: Analysis of competitor data parameters if applicable.
- Appraisal Results of Published Literature: Critical scoring of scientific database registries.
- Results of Clinical Investigations: Raw trial summaries conducted under Annex XV parameters.

## 3. Clinical Conclusions
- Proof that the device achieves its claimed medical benefits during intended use environment.
- Benefit-Risk Determination: Formal declaration that all foreseeable clinical risks are outweighed by patient benefits.
    `.trim()
  },

  PMCF_PLAN: {
    id: 'DOC',
    title: '📄 PMCF_plan_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
Defines the mandatory post-market clinical follow-up planning required by Annex XIV Part B 6.

## 2. Proactive Clinical Tracking
- General PMCF Procedures: Feedback loops from active user registries and clinical surveys.
- Specific PMCF Procedures: Evaluation parameters for long-term clinical trials or patient cohorts.
- Data Justification Strategy: Explicitly outlines how post-market data will be fed back into the CER and Risk Files.
    `.trim()
  }, 


  // ================== STEP 5 NEW FILES ==================
  TF_INDEX: {
    id: 'DOC-11',
    title: '📄 Technical_File_Index_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This master document acts as the final index and project deliverables tracker confirming that all data from Steps 1–4 are organized according to MDR Annex II and Annex III [MDR 2017/745].

## 2. Technical File Compilation Checklist
- Pre-market Records: Verified and locked inside folders 1–6 (Device Description, Labeling, GSPR, Risk, and V&V).
- Post-market Plans: Verified and locked inside folder 7 (PMS and PMCF architectures).
- Proper processes and design gate-reviews have been documented to generate the data that supports final European market approval.
    `.trim()
  },

  UDI_PLAN: {
    id: 'DOC-12',
    title: '📄 UDI_and_Traceability_Plan_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This document maps and defines the Unique Device Identifier structures required by MDR Article 27 and Part C of Annex VI [MDR 2017/745].

## 2. Barcode System Specifications
- Basic UDI-DI Assignment: The corporate regulatory identifier linking the product family inside EUDAMED.
- UDI-DI Assignment: The unique commercial barcode mapped to specific device variations and packing tiers.
- UDI-PI Rules: The dynamic tracker parameters containing serial codes, batch numbers, and software manufacturing dates.

## 3. Distribution Tracking
- Ensures the barcode is readable in its intended use environment, enabling full device tracking wherever it is distributed inside the EU.
    `.trim()
  }, 

 // ================== STEP 6 NEW FILE ==================
  DIST_MATRIX: {
    id: 'DOC-13',
    title: '📄 Distribution_and_traceability_matrix_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This matrix documents the designated legal entities authorized to distribute the medical device within the EU market and establishes required economic operator data loops [MDR 2017/745].

## 2. Economic Operators & Scope Mandates
[TABLE_START]

| Operator Type | Corporate Name & Address | EUDAMED SRN Number | Verification Mandate Summary |
| Authorised Rep (Art. 11) | [Insert EU AR Company Name] | [Insert SRN] | Act as primary contact for European Competent Authorities. |
| EU Importer (Art. 13) | [Insert EU Importer Name] | [Insert SRN] | Verify CE certificate, local labeling, and keep complaint logs. |
| Distributor (Art. 14) | [Insert Logistics/Distributor] | N/A | Check local language compliance and report serious incidents. |
[TABLE_END]

## 3. Communication and Serious Incident Routing
- All field complaints or suspected serious incidents captured by Distributors or Importers must be routed to the PRRC within 48 hours.
- Repackaging or relabeling activities executed by economic operators must comply with Article 16 criteria and be recorded in this matrix.
    `.trim()
  }, 

    // ================== STEP 7 NEW FILES ==================
  EUDAMED_REC: {
    id: 'DOC-14',
    title: '📄 EUDAMED_SRN_and_Registration_Record_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This document logs the economic operator data submitted to the EUDAMED Actor Registration module to verify compliance with MDR Article 31 and Annex VI Part A Section 1 [MDR 2017/745].

## 2. Actor Validation & Single Registration Number
- Registered Actor Role: Manufacturer (Mfr) / Importer / Authorised Representative.
- Issued SRN: [Insert generated Single Registration Number here].
- Validation Date: Confirms official verification by the designated national competent authority.
    `.trim()
  },

  EMDN_DATA: {
    id: 'DOC-15',
    title: '📄 EMDN_and_Device_Listing_Data_product_X.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
# 1. Purpose
This file details the structural device traits and nomenclature keys uploaded to EUDAMED to satisfy Article 29 and Annex VI Part A Section 2 criteria [MDR 2017/745].

## 2. Nomenclature Mapping (EMDN)
- Applied EMDN Code & Category Title: [Insert official European Medical Device Nomenclature key].
- Device Listing Parameters: Links specific design variants, core safety properties, and container pack criteria as defined in Annex VI Part B.
    `.trim()
  }








};




