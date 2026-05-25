import swAsmdImage from '../assets/sw_asmd.png';

export const SOP_DATA5 = {

/***********************************************  SOP 006  *****************************************************/
  SOP_DESIGN_CONTROL: {
    id: 'SOP', 
    title: '📄 SOP-Design_Control.pdf', 
    version: '1.0', 
    owner: 'R&D',
    content: `
## 1. PURPOSE
The purpose of this SOP is to establish, document, and maintain a controlled system for the design and development of medical devices to meet EU MDR 2017/745, ISO 13485, and ISO 14971 requirements.

## 2. SCOPE
Applies to all new product development and design changes conducted by the organization.

## 3. DEFINITIONS & ABBREVIATIONS
User Requirements Specification (URS)
Design History File (DHF)
Design Review: Formal milestone to evaluate design compliance before proceeding
Design Transfer: Process of translating development outputs into final manufacturing specifications

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Product Manager | Gather user needs, safety inputs, and establish the URS | MDR Annex I (GSPR) |
| Technical Engineer | Generate technical outputs, execute protocols, and compile DHF assets | ISO 13485 §7.3.4 |
| R&D | Authorize design plans, chair formal reviews, and oversee development phases | ISO 13485 §7.3.1 |
| QA | Maintain design control compliance, approve protocols, and release DHF records | ISO 13485 §4.2.4 |
| PRRC | Verify that validation testing meets safety and compliance benchmarks before launch | MDR Article 15 |
[TABLE_END]

## 5. PROCEDURE
The phases of designing and developing a MD are described in the table below. Records are stored in a DHF and indexed in the DHF Index by each process owner. 
[TABLE_START]

| Phase | Actions | Responsible | Record |
| Feasibility | Conduct market analysis, PoC, and high-level risk assessment. | Product Manager | Feasibility_Report.pdf |
| Design Planning | Define development structure, milestones, and V&V strategy. | R&D | Design_Plan.pdf |
| Design Input | Create URS and define regulatory, clinical, and cybersecurity requirements. | Product Manager | Design Input Spec |
| Design Output | Implement software/hardware code and write TD. | Technical Engineer | Software Architecture Document |
| Device Risk / Usability | Execute ISO 14971 hazard analysis and FMEA matrix. | Technical Engineer | RMF |
| Design Review | Conduct formal review meetings and execute gap analysis. | R&D | Review Minutes |
| Design Verification | Perform unit, integration, and system testing. | Technical Engineer | Traceability Matrix |
| Design Validation | Execute clinical validation and summative usability testing. | Product Manager | CER |
| Design Release | Conduct final DHF review and compliance check. | QA | DoC.pdf |
| Design Transfer | Deploy code into production and onboard critical suppliers. | Technical Engineer | Transfer Checklist |
| Design Changes | Process change requests and execute impact analysis. | Technical Engineer | SOP-Change_Control.pdf |
| Design Maintenance | Handle PMS, CAPA, and customer complaint tracking. | Product Manager | PMS Report |
[TABLE_END]

## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]

| MDR Requirement | Covered By |
| Annex I GSPR 1-9 | Input, Verification, and Validation phases |
| Annex II §3 | Design History File (DHF) Structure |
| Article 10(1) | This entire SOP |
| Article 10(4) | Output phase |
| Article 10(9) | This SOP |
| Annex IX §4.10 / Annex X §5.2 | Changes phase |
[TABLE_END]

## 7. APPENDICES
DHF_Master_Index.exce

Governing Standard Operating Procedures to be followed:
SOP-Risk_Management.pdf
SOP-Change_Control.pdf

Associated Templates and Forms to be executed:
📝 TMP-Feasibility_Report.docx
📝 TMP-Design_Plan.docx
📝 TMP-URS.docx
📝 TMP-Software_Architecture_Specification.docx
📝 TMP-Risk_Management_Plan.docx
📝 TMP-FMEA_Matrix.docx
📝 TMP-Risk_Management_Report.docx
📝 TMP-Design_Review_Minutes.docx
📝 TMP-Verification_Traceability_Matrix.docx
📝 TMP-Validation_Protocol_&_Report.docx
📝 DoC.pdf
📝 TMP-Design_Transfer_Checklist.docx
SOP-Change_Control.pdf
📝 TMP-PMS_Plan.docx

## 8. REVISION HISTORY
[TABLE_START]


| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  }



  /***********************************************  SOP 007 - *****************************************************/

  SOP_007_RISK_MANAGEMENT: {
    id: 'SOP', 
    title: '📄 SOP-Risk_Management.pdf', 
    version: '1.0', 
    owner: 'Risk Team, QA',
    content: `## 1. PURPOSE
The purpose of this SOP is to establish, document, and maintain a continuous risk management system throughout the product lifecycle to meet EU MDR 2017/745, ISO 14971, and ISO 13485 requirements.

## 2. SCOPE
Applies to all lifecycle stages of medical devices managed by the organization, from concept to post-market surveillance.

## 3. DEFINITIONS & ABBREVIATIONS
As Low As Reasonably Practicable (ALARP)
Failure Mode and Effects Analysis (FMEA)
Hazard: Potential source of harm to patient, user, or environment
Risk Management File (RMF): Compilation of risk records for a specific device
Risk Evaluation: Comparison of estimated risk against given risk acceptability criteria
Risk Control: Process in which decisions are made and measures implemented to reduce risks
Risk Team: A multi-disciplinary team of R&D, QA/RA, and clinical experts responsible for identifying software hazards, evaluating clinical severity, and assessing residual risks.

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Top Management | Define risk acceptability policy and provide adequate resources | ISO 14971 §4.2 |
| R&D | Identify technical hazards, implement controls, and execute testing | ISO 14971 §7.1 |
| Risk Team | Conduct risk evaluations and maintain the FMEA matrix | ISO 14971 §4.4 |
| PRRC | Verify that the overall residual risk profile is acceptable under MDR | MDR Article 15 |
| QA  | Audit the risk process, approve plans, and release the final Risk Report | ISO 13485 §4.1.3 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. PLANNING | Define scope, responsibilities, and criteria for risk acceptability. | CTO & QA | TMP_RM_Plan_Approved.pdf |
| 2. ANALYSIS | Identify known and predictable hazards under normal and fault conditions.| Risk Team | Active FMEA_Matrix.docx |
| 3. EVALUATION | Score each hazard in FMEA_Matrix.doxc to determine if risk control is required. | R&D | Uppdated FMEA_Matrix.docx |
| 4. CONTROL | Implement risk mitigation measures | R&D | Verified_Risk_Controls_Ketryx_Logs.pdf |
| 5. RESIDUAL RISK | Evaluate overall residual risk profile. Ensure individual risks are within acceptable criteria. | R&D & PRRC | Residual_Risk_Review_Sign_off.pdf |
| 6. CLOSURE | Compile and sign the Risk Management Report confirming plan objectives are achieved. | QA | TMP_RM_Report.docx |
[TABLE_END]

## 6. MDR COMPLIANCE SUMMARY
ISO 14971:2019 - Application of Risk Management to Medical Devices 
MDR Annex I (GSPR 1-9) - General Safety and Performance Requirements 
MDR Article 10(2) - General Obligations (Risk Management System) 
EN 62366-1:2015 - Application of Usability Engineering to Medical Devices

## 7. APPENDICES
TMP-Risk_Plan.docx
TMP-FMEA_Matrix.docx
TMP-Risk_Report.docx --> Put in TD/RMF

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

  /***********************************************  RISK PLAN  *****************************************************/
    TMP_RISK_PLAN: {
    id: 'TMP', 
    title: '📝 TMP-Risk_Management_Plan.docx', 
    version: '1.0', 
    owner: 'QA, CTO',
    content: `## 1. PRODUCT SCOPE & LIFECYCLE TRACK
This plan defines the risk acceptability criteria and risk management activities for Tandem Health AI platform software.

## 2. RISK TEAM ALLOCATION & COMPETENCE
[TABLE_START]

| Role | Assigned Department / Person | Competence Verification |
| Risk Chair | Head of QA | Certified ISO 14971 Lead |
| Clinical Expert | Chief Medical Officer | MD with 10 years clinical practice |
| Software Expert | CTO | MSc Biomedical Engineering / AI |
[TABLE_END]

## 3. RISK MATRIX
Risk Matrix is based on Severity (1 to 5) multiplied by Probability (1 to 5). Total Score ranges from 1 to 25.

[TABLE_START]

| Score Range | Risk Region | Required Action |
| 1 to 6 | Acceptable | Risk is negligible. No further design controls required. |
| 8 to 25 | Unacceptable | STOP DEVELOPMENT. Design mitigations must be implemented to lower score. |
[TABLE_END]

## 4. VERIFICATION PLAN & TIMELINE
All risk controls implemented in code must undergo 100 percent automated regression testing inside the GitHub release pipeline. 
Residual risk evaluation must be frozen in Ketryx prior to any production branch merge.

## 5. SIGN-OFF & REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Plan | Author | Approver |
| 1.0 | 2026-05-25 | Initial Risk Plan for release track | QA Team | CTO, QA Manager |
[TABLE_END]
    `.trim()
  },
  /***********************************************  RISK PLAN  *****************************************************/
  TMP_FMEA_MATRIX: {
    id: 'TMP', 
    title: '📝 TMP-FMEA_Matrix_Template.xlsx', 
    version: '1.0', 
    owner: 'Risk Team, R&D',
    content: `
# FAILURE MODES AND EFFECTS ANALYSIS (FMEA) MATRIX TEMPLATE

## 1. PRE-CONTROL RISK ANALYSIS (PHASE 2 & PHASE 3)
Instructions: Identify the failure mode, assign Severity (1-5) and Probability (1-5). Multiply to get Initial Risk Score (1-25).

[TABLE_START]

| System/Feature ID | Potential Failure Mode | Potential Effect of Failure | Severity (S) | Potential Cause of Failure | Probability (P) | Initial Risk Score (S x P) | Risk Acceptability |
| REQ-SAMD-___ | [Enter software failure or AI error] | [Enter consequence for patient or clinician] | _ | [Enter root cause or bug trigger] | _ | __ | [Acceptable / Unacceptable] |
[TABLE_END]

## 2. RISK CONTROL INTEGRATION (PHASE 4)
Instructions: If Initial Risk Score is 8 or higher, you must define and code design controls to mitigate the hazard.

[TABLE_START}
| System/Feature ID | Identified Hazard | Risk Mitigation Strategy (Design Control) | Software Branch / Code Commit Reference | Verification Test Protocol Reference | Test Status |
| REQ-SAMD-___ | [Reference from Table 1] | [Enter code validator, UI warning, or logic constraint] | ://github.com___ | TEST-SAMD-___ | [Passed / Failed / Pending] |
[TABLE_END]

## 3. RESIDUAL RISK EVALUATION (PHASE 5)
Instructions: Evaluate the final risk profile after the mitigation code has been verified and tested.

[TABLE_START]
| System/Feature ID | Post-Control Severity (S) | Post-Control Probability (P) | Residual Risk Score (S x P) | Final Acceptability | Ketryx Traceability Matrix ID |
| REQ-SAMD-___ | _ | _ | __ | [Acceptable / STOP RELEASE] | TRACE-________________________ |
[TABLE_END]

## 4. TEMPLATE CONTROL & APPROVAL
[TABLE_START]
| Rev. | Date | Description of Template Structure | Author | Approver |
| 1.0 | 2026-05-21 | Initial release of the automated FMEA layout | QA Team | QA Manager, CTO |
[TABLE_END]
    `.trim()
  },
  /***********************************************  RISK REPORT  *****************************************************/
    TMP_RISK_REPORT: {
    id: 'TMP', 
    title: '📝 TMP-Risk_Management_Report.docx', 
    version: '1.0', 
    owner: 'QA Manager, PRRC',
    content: `
# RISK MANAGEMENT REPORT - RELEASE AUTHORIZATION

## 1. EXECUTIVE SUMMARY & CONCLUSION
The Risk Management Plan TMP-QA-021 has been successfully executed for the current software version. 
All identified hazards have been mitigated, and the overall residual risk profile is acceptable.

## 2. RISK REGISTRATION SUMMARY STATISTICS
[TABLE_START]


| Metric Category | Value Recorded | Verification Status |
| Total Hazards Identified | 42 | Logged in Central FMEA |
| Pre-Mitigation Unacceptable Risks | 18 | High Severity or Probability |
| Implemented Design Mitigations | 18 | Hard-coded into production branch |
| Verified Active Risk Controls | 18 | 100 percent pass rate in Ketryx logs |
| Post-Mitigation Unacceptable Risks | 0 | All residual risks are in Acceptable region |
[TABLE_END]

## 3. OVERALL RESIDUAL RISK EVALUATION
The Risk Team and Chief Medical Officer have conducted a cross-functional usability and clinical benefit review. 
The clinical benefits of the AI-powered transcription software significantly outweigh the remaining residual technical risks.

## 4. FINAL QUALITY & REGULATORY SIGN-OFF
By signing below, the organization confirms that the Risk Management File is complete, audit-ready, and compliant with EU MDR 2017/745.

[TABLE_START]


| Role | Electronic Signature Status | Date |
| QA Manager | Digitally Signed in eQMS | 2026-05-25 |
| PRRC | Digitally Signed in eQMS | 2026-05-25 |
| CTO | Digitally Signed in eQMS | 2026-05-25 |
[TABLE_END]
    `.trim()
  },















/*******************  SOP 009 - CLINICAL EVALUATION (5.4) *******************/
  SOP_CLINICAL_EVALUATION: {
    id: 'SOP', 
    title: '📄 SOP-Clinical_Evaluation.pdf', 
    version: '1.0', 
    owner: 'RA',
    image: swAsmdImage,
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for conducting and documenting clinical evaluations to prove safety and performance to meet,, and.

## 2. SCOPE
Applies to the continuous assessment of clinical data for all medical devices manufactured by the organization across their entire lifecycle.

## 3. DEFINITIONS & ABBREVIATIONS
See List of Abbreviations in the SOP-Documentation.pdf.

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Medical Expert | Analyze clinical studies, evaluate literature profiles, and write appraisal text | MDR Annex XIV Part A |
| RA  | Compile regulatory inputs, define equivalent baselines, and author the CEP | MDR Article 10(1) |
| PRRC | Review evaluation findings and verify compliance metrics prior to release | MDR Article 15 |
| QA  | Release the finalized CER into the TD architecture | ISO 13485 §4.2.4 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. STRATEGY | Establish a CEP defining scope, benchmarks, and data search criteria. | RA | Approved CEP Document |
| 2. SEARCH | Conduct systematic literature reviews, clinical database searches, and screen clinical field logs. | Medical Expert | Logged Search Queries |
| 3. APPRAISAL | Evaluate retrieved data packages for methodological soundness, scientific weight, and relevance. | Medical Expert | Signed Data Appraisal Sheet |
| 4. ANALYSIS | Analyze data against criteria to prove device safety, clinical performance, and benefit-risk ratios. | Medical Expert & RA | Formulated CER Draft |
| 5. RELEASING | Cross-functional review of the CER. Final sign-off by the PRRC and structural archiving. | PRRC & QA Manager | Approved CER / TD Update |
[TABLE_END]

## 6. REFERENCES MDR Article 61 - Clinical Evaluation MDR Annex XIV Part A - Clinical Evaluation Plan and Report MEDDEV 2.7/1 Rev. 4 - Clinical Evaluation Guide for Manufacturers ISO 14155:2020 - Clinical Investigation of Medical Devices

## 7. APPENDICES
TMP-CEP-Layout
TMP-CER-Report

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

/**************************************  CHANGE CONTROL (5.5) ****************************************************/
  SOP_CHANGE_CONTROL: {
    id: 'SOP', 
    title: '📄 SOP-Change_Control.pdf', 
    version: '1.0', 
    owner: 'QA',
    image: swAsmdImage,
    content: `
## 1. PURPOSE
This SOP defines how changes to products, processes, and QMS are initiated, assessed, approved, implemented and verified.

## 2. SCOPE
Applies to all changes affecting: 
- Product design or specifications, 
- Manufacturing processes, 
- Suppliers of critical materials, 
- Software (device or QMS), 
- QMS processes and documentation

## 3. DEFINITIONS & ABBREVIATIONS
Change Control Board (CCB): Cross-functional committee responsible for reviewing and approving changes.
Change Request (CR): Formal document to propose a change initiated via Linear/eQMS.
Impact Assessment: Evaluation of how proposed change affects design, risk, regulatory status, suppliers, QMS.

## 4. RESPONSIBILITY
[TABLE_START]



| Role | Responsibility | Regulatory Compliance |
| :--- | :--- | :--- |
| Change Initiator | Identify issue and submit CR ticket in Linear/eQMS | ISO 13485 §4.2.4 |
| R&D | Assess technical impact on product design, source code and architecture | ISO 13485 §7.3.9 |
| RA | Evaluate regulatory impact and determine if change is significant | MDR Annex IX §4.10 |
| QA | Review impact assessment, final approval of CR and verify implementation | ISO 13485 §7.3.9 |
| CCB | Multi-disciplinary review board (R&D, QA, RA) authorizing releases | ISO 13485 §7.3.9 |
| PRRC | Formally sign off that the change maintains compliance before release | MDR Article 15 |

[TABLE_END]

## 5. PROCEDURE
[TABLE_START]



| Phase | Actions | Responsible | Approver | Record |
| :--- | :--- | :--- | :--- | :--- |
| 1. INITIATION | Create a CR ticket in Linear/eQMS. Complete PHASE 1 General Description and Rationale in 📝 CR_&_Impact.docx. | Change Initiator | QA/RA | 📝 CR_&_Impact_Phase_1_Approved.docx |
| 2. ASSESSMENT | Run the regulatory impact matrix based on MDCG 2020-3 in PHASE 2. If new hazards are flagged, execute risk evaluation via the central FMEA according to SOP-007-Risk_Management.pdf. | R&D & RA | QA | 📝 CR_&_Impact_Phase_2_Approved.docx |
| 3. APPROVAL | Convene a CCB meeting to review the PHASE 3 CCB Impact Checklist. PRRC signs off on compliance status and QA issues formal release approval. | PRRC & QA | QA | 📝 CR_&_Impact_Phase_3_Approved.docx |
| 4. EXECUTION | Implement code in a separate branch. Update affected TD components, fulfill PHASE 4 Verification criteria, and train staff. | R&D & Production | QA | Updated TD, Training Records & Ketryx Logs |
| 5. CLOSURE | Run automated regression testing. Verify full traceability, freeze matrix data, and close the CR ticket. | R&D & QA | QA | 📝 CR_&_Impact_Closed.pdf |

[TABLE_END]

## 6. REFERENCES 
MDR 2017/745: Annex II and III (Technical Documentation)
MDCG 2020-3: Guidance on significant changes regarding the transitional provisions for MDR
EN ISO 14971: Application of risk management to medical devices
IEC 62304: Medical device software – Software life cycle processes
SOP-007-Risk_Management.pdf

## 7. APPENDICES
📝 CR_&_Impact.docx

## 8. REVISION HISTORY
[TABLE_START]



| Rev. | Date | Description of Change | Author | Approver |
| :--- | :--- | :--- | :--- | :--- |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA | PRRC |

[TABLE_END]
    `.trim()
  },

/**************************************  CHANGE CONTROL TEMPLATE ****************************************************/

  CHANGE_MATRIX: {
    id: 'TMP', 
    title: '📝 CR_&_Impact.docx', 
    version: '1.0', 
    owner: 'R&D, CCB, QA/RA',
    content: `
# CHANGE CLASSIFICATION & IMPACT ASSESSMENT 

## PHASE 1. GENERAL DESCRIPTION
[TABLE_START]



| Field | Input |
| :--- | :--- |
| Change Request ID: | CR-________________________ (Linked to Linear ticket) |
| Date of Assessment: | 2026-05-25 |
| Change Initiator: | __________________________________________________ |
| Software Version Affected: | Baseline Version: _________ -> Target Version: _________ |

[TABLE_END]

## PHASE 1. CHANGE DESCRIPTION & RATIONALE

  Proposed Change: [Describe what code, architecture, or workflow is being modified]
  __________________________________________________________________________________________________

  Rationale: [Why is this change necessary? Bug fix, LLM optimization, security patch, feature request?]
  __________________________________________________________________________________________________

## PHASE 2. REGULATORY CLASSIFICATION MATRIX (MDCG 2020-3)
[TABLE_START]



| # | Classification Question / Criteria | YES | NO |
| :--- | :--- | :--- | :--- |
| 1 | Intended Purpose: Does the change alter the medical indications, clinical intent, or target patient population? | [ ] | [ ] |
| 2 | Clinical Logic: Does the change modify the core AI model architecture, diagnostic algorithm, or clinical decision thresholds? | [ ] | [ ] |
| 3 | User Interface: Does the change alter how critical clinical data or risk warnings are displayed to the clinician? | [ ] | [ ] |
| 4 | Operating Environment: Does the change involve a complete migration of the cloud infrastructure or deployment pipeline? | [ ] | [ ] |
| 5 | Risk Profile: Does the change introduce any new clinical hazards or increase the probability of an existing failure mode? | [ ] | [ ] |

[TABLE_END]

FINAL CLASSIFICATION DECISION:
- [ ] MINOR (Non-Significant Change): If all answers are NO --> No clinical or regulatory impact. Internal approval and verification are sufficient.
- [ ] MAJOR (Significant Change): At least one answer is YES --> STOP RELEASE. Formal NB notification and approval are required prior to production deployment.

## PHASE 3. CCB IMPACT CHECKLIST
[TABLE_START]



| Department | Impact Evaluation | Action Required / Reference |
| :--- | :--- | :--- |
| Risk Management | Does this require an update to the FMEA/Risk Register? | [ ] Yes (Update central FMEA log via SOP-007) [ ] No |
| Technical File | Does this alter Software Architecture Design (SDS)? | [ ] Yes (Update TD Annex II) [ ] No |
| Clinical Report | Does this require updating the CER? | [ ] Yes (Contact Clinical)    [ ] No |
| User Labeling | Does this require updates to the IFU? | [ ] Yes (Update Manual)       [ ] No |

[TABLE_END]

## PHASE 4. VERIFICATION & TRACEABILITY EVIDENCE (Ketryx)
- Ketryx Traceability Matrix ID: TRACE-________________________
- Automated Regression Test Run: [ ] Passed  [ ] Failed  [ ] N/A
- Code Review Sign-off Link: __________________________________________________

## 6. REVISION HISTORY & APPROVAL
[TABLE_START]



| Rev. | Date | Description of Change | Author | Approver of filled form |
| :--- | :--- | :--- | :--- | :--- |
| 1.0 | 2026-05-21 | Initial release of this Template | R&D, QA | PRRC, QA, CTO |

[TABLE_END]
    `.trim()
  },




















};
