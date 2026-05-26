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
| Feasibility | Market analysis, PoC, and high-level risk assessment. | Product Manager | Feasibility_Report.pdf |
| Design Planning | Define development structure, milestones, and V&V strategy. | R&D | Design_Plan.pdf |
| Design Input | Create URS and define regulatory, clinical, and cybersecurity requirements. | Product Manager | Design Input Spec |
| Design Output | Implement software/hardware code and write TD. | Technical Engineer | Software Architecture Document |
| Device Risk / Usability | Execute ISO 14971 hazard analysis and FMEA matrix. | Technical Engineer | RMF |
| Design Review | Conduct formal review meetings and execute gap analysis. | R&D | Review Minutes |
| Design Verification | Perform unit, integration, and system testing. | Technical Engineer | Verification_Reports.pdf  |
| Design Validation | See SOP-Clinical_Evaluation.p | Product Manager | CEP.pdf, CER.pdf |
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
📝 TMP-Validation_&_Report.docx
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
  },



  /***********************************************  SOP RISK- *****************************************************/

  SOP_RISK_MANAGEMENT: {
    id: 'SOP', 
    title: '📄 SOP-Risk_Management.pdf', 
    version: '1.0', 
    owner: 'QA/RA',
    content: `
    
## 1. PURPOSE
This SOP defines the continuous process for identifying, analyzing, controlling, and monitoring risks related to patient and user safety.

## 2. SCOPE
Applies to all lifecycle stages of medical devices managed by the organization, from concept to PMS.

## 3. DEFINITIONS & ABBREVIATIONS
Failure Mode and Effects Analysis (FMEA)
Hazard: Potential source of harm to patient, user, or environment
Risk Management File (RMF): Compilation of risk records for a specific device
Risk Evaluation: Comparison of estimated risk against given risk acceptability criteria
Risk Control: Process in which decisions are made and measures implemented to reduce risks
Risk Management Team (RMT): A team of at least one from R&D (CTO), QA/RA (PRRC), and medical expert (MTO).
Residudal risks:
Secondary risks: 

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| Top Management | Define risk acceptability policy and provide adequate resources | 
| Risk Team | Conduct risk evaluations and maintain the FMEA matrix | 
| PRRC/QA/RA | Maintain RMF, ensuring full traceability | 
[TABLE_END]

## 5. THE RISK MANAGEMENT PROCEDURE

PHASE 1. Establish Intended Use 
Responsible: RMT
Before initiating an analysis, the product's Intended Use must be defined in writing. This includes:
- Patient population: Age, gender, medical condition.
- Intended user: Medical doctors, nurses, patients.
- Environment: Hospital, home care, cloud-based deployment.
Output: Intended_Use_Statement.pdf

PHASE 2. Risk Analysis
The Risk Management Team shall systematically identify hazards and hazardous situations based on 
- ISO 14971 (Annex C) and 
- IEC 62304 guidelines.

2.1) Identify Hazards: 
Resonsables:
- SWE: identifierar de tekniska felen (Hazards) i koden eller AI-modellen.
- MTO förklarar hur detta fel leder till en farlig situation för patienten i verkligheten.
- PRRC leder workshopen och ser till att de använder rätt terminologi enligt ISO 14971 och IEC 62304.
Output: Hazard_List.pdf. 
Each hazard has an ID: 
"HZ-001: AI scribe fails to extract a critical diagnosis code (ICD-10)."

2.2) Link to Hazardous Situation
"LK-001: Clinician fails to catch the omission during review --> Patient receives incorrect follow-up care."

2.3) Risk Estimation
Resonsables: RMT
The team scores the initial risk (pre-mitigation) using risk_matrix.pdf.
Output: Current_Risk_Assesment_Report.pdf
(en tabell där varje fara har fått ett tilldelat risktal (S*P) och färgkodats (Grön, Gul eller Röd) baserat på om risken är acceptabel eller inte.)

2.4 Risk Control
Resonsables
R&D/CTO: refactoring code, altering algorithms, or designing popup alerts in the UI.
QA/RA: updates the User Manual with the appropriate regulatory warning texts.
RMT: Evaluation of residual and secondary risks

When a risk must be reduced, the team shall apply the following regulatory priority order for control measures [14971:2019]:
- Inherent safety by design (Highest priority): Modify the code/algorithm to eliminate the fault possibility.
- Protective measures: Implement automated popup alerts in the UI to warn the user if data is missing.
- Information for safety (Lowest priority): Write warning text in the User Manual or provide mandatory user training.

Post-implementation evaluation:
Residual Risk: Is the risk now reduced to an acceptable level?
Secondary Hazards: Did the new code implementation or alert introduce any new risks?

Output: Risk_Control_Specifications.pdf 
These are converted into concrete development requirements (e.g., as tickets in Jira/Linear or requirement lines in Ketryx) 
detailing how the risk will be mitigated, along with updated columns in the risk matrix showing the calculated Residual Risk.


2.5 Verification & Risk Management Report
Responsible:
Verification (Testing): QA Engineers or SWE who execute automated unit/integration tests in GitHub or perform manual user verification.
The Report: You (MDR Compliance Operations Specialist). You draft and compile the entire document.
Approval: Top Management, typically consisting of the CEO, Chief Medical Officer (CMO), and PRRC.

Verification
Every risk control measure must be verified for effectiveness. 
Test results (e.g., automated unit/integration tests in GitHub/Ketryx) must link directly to the Risk ID for full traceability.

Risk Management Report
Once all mitigations are verified, the MDR Compliance Operations Specialist compiles a report. 
This report concludes that the overall residual risk is acceptable and that the clinical benefits outweigh the risks. 
The report is approved by management prior to product release.

Output
- An automated Traceability Matrix (usually in Ketryx) proving an unbroken chain from Hazard ➔ Risk Control ➔ Code/Design Output ➔ Verification Test Case (Passed).
- A signed Risk Management Report (RMR). This is the official document certifying that the device is safe for release.


2.6 Production and Post-Production Monitoring (Post-Market Surveillance)
Responsible
Data Collection: Customer Support (customer complaints) and Data/AI Engineers (bug logs and AI model drift metrics).
Evaluation and Analysis: RA/QA in collaboration with the product team. You monitor if the real-world data contradicts your design-stage assumptions.

The RMF is a living document. Post-launch, the team must:
- Review customer complaints, bug reports, and AI drift logs monthly.
- Evaluate if real-world failures match the estimations made during design.
- If a failure occurs more frequently than estimated, or a new hazard is discovered, the process re-starts at step 3.2 via the CM process.

Output
- Monthly or quarterly PMS Logs / AI Trend Reports.
- CRs in your Change Management process if the risk matrix needs updating or if new risk controls must be engineered due to real-world events.

## 6. MDR COMPLIANCE SUMMARY
ISO 14971:2019 - Application of Risk Management to Medical Devices 
MDR Annex I (GSPR 1-9) - General Safety and Performance Requirements 
MDR Article 10(2) - General Obligations (Risk Management System) 
EN 62366-1:2015 - Application of Usability Engineering to Medical Devices

## 7. APPENDICES
Risk_Plan.pdf
FMEA_Matrix.pdf
Risk_Report.pdf --> Put in TD/RMF

## 8. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

  /***********************************************  RISK PLAN  *****************************************************/
    RISK_PLAN: {
    id: 'TMP', 
    title: '📝 Risk_Management_Plan.docx', 
    version: '1.0', 
    owner: 'QA, CTO',
    content: `
    
## 1. SCOPE
This plan defines the risk acceptability criteria and risk management activities for 
- description of product
- life cycle phases (from D&D until post market phase)

## 2. RESPONSABILITIES
[TABLE_START]

| Role | Responsibility | Competence Verification |
| QA | ... | Certified ISO 14971 Lead |
| CMO | ...  | MD with 10 years clinical practice |
| CTO | ... | MSc Biomedical Engineering / AI |
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
  /***********************************************  RISK MATRIX  *****************************************************/
  FMEA_MATRIX: {
    id: 'TMP', 
    title: '📝 FMEA_Matrix_Template.xlsx', 
    version: '1.0', 
    owner: 'Risk Team, R&D',
    content: `# FAILURE MODES AND EFFECTS ANALYSIS (FMEA) MATRIX TEMPLATE

## 1. PRE-CONTROL RISK ANALYSIS (PHASE 2 & PHASE 3)
Instructions: Identify the failure mode, assign Severity (1-5) and Probability (1-5). Multiply to get Initial Risk Score (1-25).

[TABLE_START]

| System/Feature ID | Potential Failure Mode | Potential Effect of Failure | Severity (S) | Potential Cause of Failure | Probability (P) | Initial Risk Score (S x P) | Risk Acceptability |
| REQ-SAMD-___ | [Enter software failure or AI error] | [Enter consequence for patient or clinician] | _ | [Enter root cause or bug trigger] | _ | __ | [Acceptable / Unacceptable] |
[TABLE_END]

## 2. RISK CONTROL INTEGRATION (PHASE 4)
If Initial Risk Score is ≥ 8 --> define and code design controls to mitigate the hazard.
(Note: If software probability cannot be accurately estimated, P must be set to 5 as a worst-case scenario).

[TABLE_START]
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

/**************************************  SOP - CLINICAL EVALUATION  ****************************************/
  SOP_CLINICAL_EVALUATION: {
    id: 'SOP', 
    title: '📄 SOP-Clinical_Evaluation.pdf', 
    version: '1.0', 
    owner: 'R&D, QA/RA',
    content: `

## 1. PURPOSE
The purpose of this SOP is to define the mandatory process for 
- conducting, 
- documenting, and 
- updating 
the clinical evaluation to ensure compliance with EU MDR 2017/745 Art. 61 and MDCG 2020-13 guidelines.

## 2. SCOPE
Applies to the continuous clinical evaluation of all SaMD products developed by the organization, covering both pre-market evaluation and post-market clinical follow-up (PMCF).

## 3. DEFINITIONS & ABBREVIATIONS
Clinical Evaluation Plan (CEP)
Clinical Evaluation Report (CER): A documented report containing the critical evaluation of all clinical data relevant to the device.
Clinical Evidence: Clinical data and clinical evaluation results pertaining to a device of sufficient amount and quality to allow a qualified assessment of safety and performance.
Post-Market Clinical Follow-up (PMCF): A continuous process to update the clinical evaluation throughout the lifecycle of the device.
Product Manager (PM)
MDCG 2020-13: EU guidance on clinical evaluation assessment for medical device software.

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Product Manager | Act as Clinical Lead, gather clinical literature, and coordinate appraisals |
| Clinical Expert | Appraise clinical data validity and provide expert clinical judgment | 
| RA | Ensure CER formatting meets MDR requirements and monitor MDCG updates | 
| QA | Review and approve the final CER, ensuring alignment with the Risk File | 
| PRRC | Authorize the release of the CER into the TD | 
[TABLE_END]


## 5. PROCEDURE 
/**********************************************************************************/
PHASE 1) PLANNING ➔ 📄 CEP.pdf
Responsible: PM / RA
Input: 📄 Intended_Purpose_Statement.pdf, 📄 Risk_Management_File.pdf (See initial risk).

1.0) DEFINE LITTERATURE SEARCH PROCESS 
1.1) WRITE CLINICAL CLAIMS 
1.2) MAP CLINICAL CLAIMS ↔️ Annex I-GSPR 
1.3) ANALYSE RISK & NOVELTY

/*******************************************************************************************/
PHASE 2) DATA   IDENTIFICATION ➔ 📄 Literature_Report.pdf
Input: ➔ 📄 CEP.pdf (search strategy)
Input: ➔ 📄 Design_Verification_Reports.pdf 

2.2 Internal Data Extraction
Gather internal software verification and usability data.

2.3 External Data Extraction 
Collect data from equivalent devices or clinical registries.

/*******************************************************************************************/
PHASE 3) DATA APPRAISAL ()
Responsible: Clinical Expert

Analyze Risk Class & Novelty to Determine Data Type
Appraise data validity and methodological quality against software algorithms and MDCG guidance

1. RA shall evaluate the device risk class (Class I, IIa, IIb, III) according to MDR Annex VIII and MDCG 2019-11.
2. If the SaMD is Class I or IIa and non-innovative: The clinical data strategy may lean on scientific literature, benchmarking, and equivalent device data.
3. If the SaMD is Class IIb, Class III, or introduces an innovative algorithm: The Product Manager must plan for a dedicated clinical investigation on the device itself,
unless full equivalence can be demonstrated according to MDR Annex XIV Part A (3).


Output: TMP-Clinical_Data_Appraisal_Report.docx
/*******************************************************************************************/
PHASE 4) ANALYSIS & CER ➔ 📄 CER.pdf
Gap Analysis via the Clinical Development Plan (CDP)

Run Gap Analysis, verify data sufficiency, and draft final report showing compliance with GSPR. | Product Manager & RA | TMP-Clinical_Evaluation_Report.docx |

1. The Product Manager shall author the Clinical Development Plan (CDP) as a part of the CEP.
2. The CDP must map all currently available data (e.g., verification testing, usability data, technical performance studies of the software) against the required GSPR milestones and SOTA criteria.
3. The Product Manager shall perform a Gap Analysis to identify missing clinical endpoints or data-shortfalls.
4. Any identified data gaps must be resolved by scheduling targeted literature reviews, usability trials, or formal clinical prövningar before locking the design.

/*******************************************************************************************/
PHASE 5) UPDATE & PMCF ➔ 📄 CER_v2.0.pdf 📄 PMCF_Plan.pdf
Input: 📄 TMP-PMCF_Plan.docx
       📄 CER_v1.0.pdf


Verification of Data Sufficiency via MDCG Vägledning


1. Prior to finalizing the CER, RA and the Clinical Expert shall cross-reference the compiled data package with MDCG 2020-5 (Sufficient Clinical Evidence) and MDCG 2020-6 (Legacy Devices, if applicable).
2. The Clinical Expert must sign off that the quantitative and qualitative level of data is robust enough to prove clinical safety, technical performance (algorithm validity), and clinical benefit as required by MDCG 2020-13.
/*******************************************************************************************/
## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]


| MDR Requirement | Covered By |
| Article 61 | Entirety of this SOP process |
| Annex XIV Part A | Clinical Evaluation implementation requirements |
| Annex XIV Part B | PMCF Phase and documentation structure |
| MDCG 2020-13 | Clinical evaluation logic for software (SaMD) algorithms |
[TABLE_END]

## 7. APPENDICES
Governing SOP to be followed:
📄 SOP-Design_Control.pdf (SOP-DC)
📄 SOP-Risk_Management.pdf (SOP-RM)

Associated Templates and Forms to be executed:
📝 TMP-Clinical_Evaluation_Plan.docx
📝 TMP-Literature_Search_Protocol.docx
📝 TMP-Clinical_Data_Appraisal_Report.docx
📝 TMP-Clinical_Evaluation_Report.docx
📝 TMP-PMCF_Plan.docx

## 8. REVISION HISTORY
[TABLE_START]


| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-25 | Initial release of this Clinical Evaluation SOP | QA |
[TABLE_END]
    `.trim()
  },



/***************************************** CEP **********************************************************/
  CEP: {
    id: 'TMP-CEP', 
    title: '📝 TMP-Clinical_Evaluation_Plan.docx', 
    version: '1.0', 
    owner: 'Product Manager / RA',
    content: `
    
## 1. PURPOSE
The purpose of this document is to define the 
- clinical evaluation strategy, 
- clinical development milestones, and 
- data collection methodologies 
for the Software as a Medical Device (SaMD) to demonstrate conformity with EU MDR 2017/745 General Safety and Performance Requirements (GSPR).

## 2. SCOPE
This plan applies exclusively to the pre-market clinical evaluation planning and clinical development of the specified SaMD product version prior to commercial release or major modification.

## 3. DEFINITIONS & ABBREVIATIONS
Clinical Evaluation Plan CEP
Clinical Development Plan CDP
Software as a Medical Device SaMD
State of the Art SOTA

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility  |
| Product Manager | Complete technical product data, document clinical claims, and align timelines. |
| Clinical Expert | Establish and validate clinical benchmarks, endpoints, and medical rationale. |
| RA | Verify GSPR mapping, validate regulatory pathways, and sign off compliance. |
| QA | Ensure integration with the Risk Management File and approve the final plan. |
[TABLE_END]


## 5. PROCEDURE 



## 11. SIGN-OFF & APPROVAL BLOCK
* Product Manager (Clinical Lead): [Name, Signature, Date]
* Clinical Expert (Medical Reviewer): [Name, Signature, Date]
* Regulatory Affairs (RA): [Name, Signature, Date]
* Quality Assurance (QA): [Name, Signature, Date]
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
| 1. INITIATION | Create a CR ticket in Linear/eQMS. Complete PHASE 1 in 📝 CR_&_Impact.docx. | Change Initiator | QA/RA | 📝 CR_&_Impact_Phase_1_Approved.docx |
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

## PHASE 1.1. INITIATION CHANGE REQUEST
[TABLE_START]

| Field | Input |
| Change Request ID: | CR-________________________ (Linked to Linear ticket) |
| Date of Assessment: | 2026-05-25 |
| Change Initiator: | __________________________________________________ |
| Software Version Affected: | Baseline Version: _________ -> Target Version: _________ |
[TABLE_END]

## PHASE 1.2. INITIATION CHANGE DESCRIPTION & RATIONALE

  Proposed Change: [Describe what code, architecture, or workflow is being modified]
  __________________________________________________________________________________________________

  Rationale: [Why is this change necessary? Bug fix, LLM optimization, security patch, feature request?]
  __________________________________________________________________________________________________

## PHASE 2. ASSESSMENT - REGULATORY CLASSIFICATION MATRIX (MDCG 2020-3)
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

## PHASE 3. APPROVAL - CCB IMPACT CHECKLIST
[TABLE_START]

| Department | Impact Evaluation | Action Required / Reference |

| Risk Management | Does this require an update to the FMEA/Risk Register? | [ ] Yes (Update central FMEA log via SOP-007) [ ] No |
| Technical File | Does this alter Software Architecture Design (SDS)? | [ ] Yes (Update TD Annex II) [ ] No |
| Clinical Report | Does this require updating the CER? | [ ] Yes (CEV)    [ ] No |
| User Labeling | Does this require updates to the IFU? | [ ] Yes (Update Manual)       [ ] No |
[TABLE_END]

## PHASE 4. ECECUTION - VERIFICATION & TRACEABILITY EVIDENCE (Ketryx)
- Ketryx Traceability Matrix ID: TRACE-________________________
- Automated Regression Test Run: [ ] Passed  [ ] Failed  [ ] N/A
- Code Review Sign-off Link: __________________________________________________


## PHASE 5. CLOSURE



## 6. REVISION HISTORY & APPROVAL
[TABLE_START]
| Rev. | Date | Description of Change | Author | Approver of filled form |
| 1.0 | 2026-05-21 | Initial release of this Template | R&D, QA | PRRC, QA, CTO |

[TABLE_END]
    `.trim()
  },
};
