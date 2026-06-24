/**
 * @file sopData.js
 * 
 */


export const SOP_DATA = {

SOP_SW_VAL: {
    id: 'SOP', 
    title: '📄 SOP-Software_Validation.pdf', 
    version: '1.0', 
    owner: 'QA & CTO',
    content: `
## 1. PURPOSE
The purpose of this SOP is to establish, document, and maintain a risk-based validation lifecycle for 
- computer systems, 
- cloud applications (SaaS), and 
- automated software tools 
used within the Quality Management System (QMS) to meet ISO 13485:2016 §4.1.6 requirements and ensure absolute data integrity.

## 2. SCOPE
Applies to all non-device software used to automate 
- QMS processes, 
- document control, 
- production environments, and 
- traceability operations (e.g., eQMS, ERP/SAP, issue trackers). 

It does not apply to software embedded in or running as a medical device (SaMD).

## 3. DEFINITIONS & ABBREVIATIONS
Audit Trail: Secure, computer-generated, time-stamped electronic record of system modifications.
GAMP 5: Good Automated Manufacturing Practice software categorization framework.
UAT: User Acceptance Testing conducted by business process owners under QA oversight.
User Requirements Specification (URS): Documented operational and compliance needs.


## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| QA | Serve as process owner, evaluate risk categories, and approve validation assets | ISO 13485 §4.1.6 |
| CTO / IT | Configure servers, manage user access rights, and execute automated backup loops | ISO 13485 6.3 |
| System Owner | Author user requirements (URS) and orchestrate user acceptance testing protocols | ISO 13485 §4.2.4 |
[TABLE_END]

## 5. PROCEDURE
The life cycle of validating a QMS-supporting software tool is outlined in the process matrix below. 
[TABLE_START]


| Phase | Actions | Responsible | Record |
| 1-Inventory | Log new software systems and determine the GAMP 5 category. | QA | REG_003_Software_Inventory.xlsx |
| 2-Requirement | Author explicit operational, security, and electronic signature needs. | System Owner | URS_Software_Specification.docx |
| 3-Risk Analysis | Run failure mode assessments on data storage, signatures, and visibility. | QA  | Software_Risk_Assessment.pdf |
| 4-Technical IQ | Document environment setups, active security patches, and connections. | CTO / IT | IQ_Protocol_and_Report.pdf |
| 5-Functional OQ | Execute scripts testing user roles, password locks, and audit trails. | CTO / IT | OQ_Test_Sheets.pdf |
| 6-Performance PQ | Run actual workplace workflow scenarios to verify end-to-end stability. | System Owner | UAT_Sign-off_Matrix.pdf |
| 7-Final Release | Compile a summary report auditing deviations and grant active rollout. | QA | Software_Validation_Report.pdf |
| 8-Maintenance | Monitor system change controls, user logs, and annual recoverability. | CTO / IT | SOP_005_QMS_Change_Control.pdf |
[TABLE_END]

## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]


| MDR Requirement | Covered By |
| Article 10(9) | This entire SOP |
| Annex IX §2.2 | Data integrity, user authorization, and system change tracking |
[TABLE_END]

## 7. APPENDICES
Software_Inventory_Index.xlsx

Governing Standard Operating Procedures to be followed:
SOP_002_Document_Control.pdf

Associated Templates and Forms to be executed:
📝 TMP-URS_Software_Specification.docx
📝 TMP-Software_Risk_Assessment.docx
📝 TMP-IQ_OQ_PQ_Combined_Protocol.docx
📝 TMP-User_Acceptance_Test_Script.docx
📄 RPT_002-Backup_and_Restore_Test.pdf

## 8. REVISION HISTORY
[TABLE_START]


| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-08 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },


  SOP_DOC_CONTROL: {
    id: 'SOP',
    title: '📄 SOP-Document_Control.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define requirements for creating, reviewing, approving, issuing, and modifying Quality Management System (QMS) documentation to ensure alignment with ISO 13485:2016 §4.2.4 parameters.

## 2. SCOPE
Governs all standard operating procedures, manuals, work instructions, forms, and regulatory logs maintained within the company ecosystem.

## 3. DEFINITIONS & ABBREVIATIONS
Master Document Register (MDR): Central register listing active document revisions and statuses.
Obsolete: Revoked or outdated document versions locked from operational deployment.

## 4. RESPONSIBILITY
[TABLE_START]


| Role | Responsibility | Regulatory Compliance |
| Author | Draft procedural revisions and compile modification justifications | ISO 13485 §4.2.4 |
| Reviewer | Conduct cross-functional validation of procedural accuracy and impacts | ISO 13485 §7.1 |
| QA | Enforce numbering criteria, audit formats, and authorize formal release loops | ISO 13485 §4.2.4 |
[TABLE_END]

## 5. PROCEDURE
The mandatory stages of a document lifecycle are outlined in the process matrix below.
[TABLE_START]


| Phase | Actions | Responsible | Record |
| 1-Drafting | Initiate text parameters and document revision justifications. | Author | Change_Request.docx |
| 2-Peer Review | Distribute to affected sectors to verify cross-departmental logic. | Reviewer | Review_Comments_Log |
| 3-QA Approval | Audit operational regulatory conformity and apply electronic signatures. | QA | Approved_Master_PDF |
| 4-Distribution | Release active copies via eQMS and safely archive superseded files. | QA | Master_Register_Update |
[TABLE_END]

## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]


| MDR Requirement | Covered By |
| Article 10(8) | Record retention policies (10 and 15 year archival mandates) |
| Annex IX §2 | Integrity and structural consistency of quality documentation tracking |
[TABLE_END]

## 7. APPENDICES
REG_001_Master_Document_Register.xlsx

Associated Templates and Forms to be executed:
📝 TMP-Change_Request_Form.docx
📝 TMP-Standard_SOP_Template.docx

## 8. REVISION HISTORY
[TABLE_START]


| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-08 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  }, 

  SOP_BACKUP_RESTORE: {
    id: 'SOP',
    title: '📄 SOP-Backup_and_Restore.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define rules for automated file replication, access control provisioning, and emergency recovery drills to safeguard QMS metrics and maintain compliance with ISO 13485:2016 §4.2.5.

## 2. SCOPE
Applies to all database architectures, server configurations, and cloud deployment nodes storing quality history data, device logs, or audit trail indexes.

## 3. DEFINITIONS & ABBREVIATIONS
ALCOA+: Data integrity framework ensuring records are Attributable, Legible, Contemporaneous, Original, and Accurate.
Restore Test: Physical verification checking data recoverability from a raw backup instance.

## 4. RESPONSIBILITY
[TABLE_START]


| Role | Responsibility | Regulatory Compliance |
| IT Lead / CTO | Manage snapshot tasks, audit error exceptions, and map server infrastructure | ISO 13485 §6.3 |
| QA Manager | Enforce record access barriers, monitor audit logs, and audit annual restore tasks | ISO 13485 §4.2.5 |
[TABLE_END]

## 5. PROCEDURE
Data protection workflows and recoverability scripts are configured in accordance with the matrix below.
[TABLE_START]


| Phase | Actions | Responsible | Evidence |
| 1-Encryption | Encrypt raw data streams at rest and in transit using active AES-256 keys. | IT Lead / CTO | Security Configuration Log |
| 2-Snapshot | Automate complete incremental data backup processes every 24 hours. | IT Lead / CTO | Backup Log Reports |
| 3-Restore Test | Execute a full physical restore simulation on secondary systems every 12 months. | IT Lead / CTO | Restore_Test_Report.pdf |
| 4-Log Auditing | Conduct routine checks on electronic tracking logs to secure attribution. | QA Manager | Audit Trail Logs |
[TABLE_END]

## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]


| MDR Requirement | Covered By |
| Article 10(8) | Guarantees long-term uncorrupted storage of engineering validation logs |
| Annex IX §2.2 | Technical access controls, identification tracking, and secure record storage |
[TABLE_END]

## 7. APPENDICES
PLN_002_IT_Disaster_Recovery_Plan.pdf

Associated Templates and Forms to be executed:
📄 RPT_002-Backup_and_Restore_Test.pdf
📝 TMP-Data_Integrity_Checklist.docx

## 8. REVISION HISTORY
[TABLE_START]


| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-08 | Initial release of this SOP | QA/IT |
[TABLE_END]
    `.trim()
  }, 



  // ------------------ STEP 2.1: QUALITY MANUAL ------------------
  QUALITY_MANUAL: {
    id: 'QM-001',
    title: '📄 Quality_Manual.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this Quality Manual is to define the scope, structure, and governance of the Quality Management System (QMS) in accordance with ISO 13485:2016 and applicable regulatory requirements including MDR 2017/745.

## 2. SCOPE
This QMS applies to all activities related to the design, development, manufacturing, and distribution of medical devices placed on the EU market.

## 3. QMS STRUCTURE
[TABLE_START]

| Level | Document Type | Description |
| 1 | Quality Policy & Objectives | Corporate commitment and measurable targets |
| 2 | Quality Manual | QMS scope, structure, and exclusion justifications |
| 3 | Standard Operating Procedures (SOPs) | Who does what and when |
| 4 | Work Instructions (WIs) | How to execute specific tasks |
| 5 | Forms & Records | Objective evidence of compliance |
[TABLE_END]

## 4. EXCLUSIONS
The following ISO 13485:2016 requirements are excluded with justification:
- [List any exclusions, e.g., §7.5.3 Installation activities — not applicable as device is plug-and-play]

## 5. APPLICABLE REGULATIONS & STANDARDS
- ISO 13485:2016 — Medical devices — Quality management systems
- MDR 2017/745 — EU Medical Device Regulation
- ISO 14971:2019 — Risk management for medical devices
- EN 62366-1 — Usability engineering

## 6. PROCESS INTERACTION MAP
The QMS processes are grouped into three implementation phases:
- Phase 1 (Foundation): Document control, management framework, resource management
- Phase 2 (Product Realization): Design control, risk management, clinical evaluation, operations
- Phase 3 (Oversight): Measurement/analysis, CAPA, regulatory affairs

## 7. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 2.2: MANAGEMENT FRAMEWORK ------------------
  SOP_MANAGEMENT_FRAMEWORK: {
    id: 'SOP-MGMT-001',
    title: '📄 SOP-Management_Framework.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to consolidate management responsibilities required by ISO 13485:2016 §5.3, §5.4.1, §5.5, §5.6 and MDR 2017/745 Article 15 into a single controlled document. It defines the corporate Quality Policy, measurable Quality Objectives, organizational roles including formal PRRC appointment, and the annual Management Review framework.

## 2. SCOPE
Applies to top management, all department heads, and the appointed PRRC.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| CEO / Top Management | Approve Quality Policy, sign PRRC mandate, chair Management Review, and authorize resources |
| QA Manager | Draft policy, coordinate objectives, compile Management Review inputs, and document minutes |
| PRRC | Oversee regulatory compliance per MDR Art. 15(3) |
| Department Heads | Propose and track departmental objectives, present performance data at Management Review |
[TABLE_END]

## 4. PART A — QUALITY POLICY (ISO 13485 §5.3)
[COMPANY NAME] is committed to designing, manufacturing, and delivering safe and effective medical devices that meet or exceed customer expectations and comply with all applicable regulatory requirements including ISO 13485:2016 and MDR 2017/745.

Top management commits to:
- Maintaining an effective Quality Management System
- Establishing and reviewing measurable Quality Objectives
- Providing adequate resources for QMS implementation
- Driving continuous improvement through data-driven decisions
- Communicating this policy to all employees

Signed: _________________ (CEO)  Date: _______________

## 5. PART B — QUALITY OBJECTIVES (ISO 13485 §5.4.1)
[TABLE_START]

| Objective | Metric | Target | Responsible | Review |
| Customer satisfaction | Complaint rate | <1% of units sold | Customer Service | Quarterly |
| Product quality | Batch rejection rate | <0.5% | QA | Monthly |
| On-time delivery | Order fulfillment | >95% | Operations | Monthly |
| Regulatory compliance | Audit NC count | 0 major NCs | QA / RA | Per audit |
| Supplier performance | Defect rate | <2% | Purchasing | Quarterly |
| Training completion | Training records up to date | 100% | HR | Quarterly |
[TABLE_END]

## 6. PART C — ROLES & PRRC APPOINTMENT (ISO 13485 §5.5, MDR Art. 15)
[TABLE_START]

| PRRC Duty (MDR Art. 15) | Description |
| Conformity Verification | Ensure device conformity is checked before batch release |
| Technical Documentation | Ensure TD and DoC are drawn up and maintained |
| Post-Market Surveillance | Ensure PMS obligations are complied with |
| Vigilance Reporting | Ensure serious incident reporting obligations are fulfilled |
| High-Risk Devices | For Class III/custom-made: ensure SSCP is issued (Art. 32) |
[TABLE_END]

PRRC Appointment:
Name: _________________
Title: _________________
Signed: _________________ (CEO)  Date: _______________
Signed: _________________ (PRRC)  Date: _______________

## 7. PART D — MANAGEMENT REVIEW (ISO 13485 §5.6)
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Schedule | Schedule Management Review at least annually. | QA | Meeting_Invitation |
| 2-Inputs | Compile: audit results, customer feedback, process performance, CAPA status, PMS data, previous actions, changes, recommendations. | QA | Management_Review_Pack |
| 3-Conduct | Review QMS performance, identify gaps, and approve improvement actions. | Top Management | Meeting_Minutes |
| 4-Outputs | Document decisions on QMS improvements, resource needs, and policy changes. | QA | Management_Review_Output |
| 5-Follow-up | Track and verify completion of action items. | QA | Action_Item_Log |
[TABLE_END]

## 8. MANAGEMENT REVIEW INPUTS (ISO 13485 §5.6.2)
[TABLE_START]

| Input | Source |
| Audit results | Internal and external audit reports |
| Customer feedback & complaints | PMS and vigilance logs |
| Process performance & product conformity | Production and QA reports |
| Status of CAPA | NC/CAPA register |
| Follow-up from previous reviews | Previous meeting minutes |
| Changes affecting QMS | Regulatory intelligence, organizational changes |
| Recommendations for improvement | All departments |
[TABLE_END]

## 9. MANAGEMENT REVIEW OUTPUTS (ISO 13485 §5.6.3)
- Improvements needed to maintain QMS effectiveness
- Resource requirements
- Any changes to Quality Policy or Objectives

## 10. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release — consolidates SOP_QUALITY_POLICY, SOP_ROLES_PRRC, and SOP_MANAGEMENT_REVIEW | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 3.1: COMPETENCE & TRAINING ------------------
  SOP_COMPETENCE_TRAINING: {
    id: 'SOP-RES-001',
    title: '📄 SOP-Competence_and_Training.pdf',
    version: '1.0',
    owner: 'HR / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for identifying competence requirements, providing training, and evaluating effectiveness in accordance with ISO 13485:2016 §6.2.

## 2. SCOPE
Applies to all personnel whose work affects product quality or QMS performance.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| HR | Maintain training records and coordinate training logistics |
| Department Heads | Identify competence gaps and nominate personnel for training |
| QA | Verify training effectiveness and maintain training matrix |
| Employees | Complete assigned training and document attendance |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Competence Mapping | Define required competencies for each QMS role. | Dept Heads | Competence_Matrix.xlsx |
| 2-Gap Analysis | Assess current personnel against required competencies. | HR + Dept Heads | Training_Needs_Assessment |
| 3-Training Plan | Develop annual training plan addressing identified gaps. | HR | Annual_Training_Plan |
| 4-Delivery | Execute training (internal, external, or e-learning). | HR | Training_Attendance_Sheet |
| 5-Effectiveness Check | Evaluate training effectiveness via test, observation, or performance review. | QA | Training_Effectiveness_Record |
| 6-Records | Maintain training records for each employee. | HR | Personnel_Training_File |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 3.2: INFRASTRUCTURE & IT ------------------
  SOP_INFRASTRUCTURE_IT: {
    id: 'SOP-RES-002',
    title: '📄 SOP-Infrastructure_and_IT_Environment.pdf',
    version: '1.0',
    owner: 'IT / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for maintaining infrastructure and IT environment to ensure product quality and data integrity in accordance with ISO 13485:2016 §6.3.

## 2. SCOPE
Applies to buildings, utilities, IT systems, network infrastructure, and software tools supporting QMS activities.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| IT Manager | Maintain IT infrastructure, apply security patches, and manage user access |
| Facility Manager | Maintain buildings, utilities, and environmental controls |
| QA | Verify infrastructure suitability for QMS compliance |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Inventory | Maintain inventory of IT systems, servers, and software tools. | IT | IT_Asset_Register.xlsx |
| 2-Maintenance | Perform preventive maintenance per schedule. Log all repairs. | IT / Facilities | Maintenance_Log |
| 3-Access Control | Manage user accounts, permissions, and password policies. | IT | User_Access_Log |
| 4-Security Updates | Apply critical security patches within 30 days of release. | IT | Patch_Management_Log |
| 5-Backup Verification | Verify automated backups per SOP_Backup_and_Restore. | IT | Backup_Verification_Log |
| 6-Change Control | Document and approve all infrastructure changes. | IT + QA | Change_Request |
| 7-Disaster Recovery | Test disaster recovery plan annually. | IT | DR_Test_Report |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA/IT |
[TABLE_END]
    `.trim()
  }, 
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
PHASE 3) DATA APPRAISAL
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
    title: '📝 TMP-Change_Request.docx', 
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

  /*******************  SOP 008 - SUPPLIER MANAGEMENT (6.1) *******************/
  SOP_008_SUPPLIER_MANAGEMENT: {
    id: 'SOP-008', 
    title: 'SOP-Supplier_Management.pdf', 
    version: '1.0', 
    owner: 'Operations Manager',
    content: `
## 1. PURPOSE
The purpose of this SOP is to establish a controlled system for the evaluation, approval, qualification, and continuous monitoring of suppliers to meet and.

## 2. SCOPE
Applies to all procurement of critical components, materials, or services that directly impact medical device quality, performance, or QMS compliance status.

## 3. DEFINITIONS & ABBREVIATIONS
Approved Supplier List (ASL): Official register of suppliers authorized to provide critical assets
Quality Assurance Agreement (QAA): Contract defining specific quality obligations between parties
Critical Supplier: A supplier providing items that affect product safety or legal conformity

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Procurement Team | Conduct initial evaluation and manage purchasing logs | ISO 13485 §7.4.1 |
| Operations Manager | Evaluate technical capability and coordinate supplier workflows | ISO 13485 §7.4.2 |
| QA Manager | Perform quality audits, approve QAAs, and maintain the active ASL | ISO 13485 §4.1.3 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. EVALUATION ⬇️ | Screen prospective suppliers via questionnaires, audits, or certificate reviews. | Procurement & QA | Completed Evaluation Form |
| 2. APPROVAL ⬇️ | Establish a formal Quality Assurance Agreement (QAA) mapping compliance expectations. | QA Manager | Signed QAA Contract |
| 3. REGISTER ⬇️ | Log the qualified entity into the controlled Master Register of authorized suppliers. | QA Manager | Updated ASL Record |
| 4. MONITORING | Conduct annual reviews of delivery accuracy, item conformity, and certificate validity. | Operations & QA | Supplier Audit Report |
[TABLE_END]

## 6. REFERENCES ISO 13485:2016, Section 7.4 - Purchasing MDR Article 10(9) - QMS Obligations

## 7. APPENDICES
TMP-Supplier-Audit: Evaluation questionnaire layout
TMP-QAA-Template: Quality Assurance Agreement baseline
REG-ASL-Index: Approved Supplier List master register

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

/*******************  SOP 011 - CUSTOMER PROCESSES & FEEDBACK (6.2) *******************/
  SOP_011_CUSTOMER_PROCESSES: {
    id: 'SOP-011', 
    title: 'Customer_Processes.pdf', 
    version: '1.0', 
    owner: 'Product Manager',
    content: `
## 1. PURPOSE
This SOP defines how customer requirements are reviewed and how post-market feedback and complaints are systematically collected, evaluated, and logged to meet, and.

## 2. SCOPE
Applies to all customer contracts, product requirement reviews, and all feedback or complaints received from users regarding lanced medical devices.

## 3. DEFINITIONS & ABBREVIATIONS
Post-Market Feedback: Reactive and proactive data collected regarding device performance on the market
Complaint: Any written, electronic, or oral communication that alleges deficiencies related to product identity, quality, safety, or performance

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Product Manager | Review customer requirements and analyze early market feedback trends | ISO 13485 §7.2.2 |
| RA Manager | Evaluate incoming feedback for adverse events and check reporting criteria | MDR Art. 83-92 |
| QA Manager | Log formal complaints, chair investigations, and verify corrective actions | ISO 13485 §8.2.1 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. CONTRACT REVIEW ⬇️ | Review product requirements before accepting any orders to ensure delivery capability. | Product Manager | Signed Order Review |
| 2. INTAKE ⬇️ | Collect feedback and customer communications from all input channels. Log directly. | Product Manager | Raw Feedback Log |
| 3. SCREENING ⬇️ | Screen feedback to isolate formal complaints. Assess immediately for regulatory reporting. | RA & QA Manager | Complaint Triage Record |
| 4. INVESTIGATION ⬇️ | Conduct root-cause analysis for approved complaints to isolate the deficiency source. | Technical Team | Investigation Report |
| 5. CLOSURE | Implement corrective measures if needed and provide final resolution responses to users. | QA Manager | Closed CR Form / REG-010 |
[TABLE_END]

## 6. REFERENCES ISO 13485:2016, Section 7.2 - Customer-Related Processes ISO 13485:2016, Section 8.2.1 - Feedback MDR Article 10(9) - QMS Obligations

## 7. APPENDICES
TMP-Complaint-Form: Customer complaint logging sheet
REG-010-Feedback-Log: Central register for market feedback

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

/*******************  SOP 012 - PRODUCTION, RELEASE & TRACEABILITY (6.3) *******************/
  SOP_012_PRODUCTION_AND_TRACEABILITY: {
    id: 'SOP-012', 
    title: 'Production_and_Traceability.pdf', 
    version: '1.0', 
    owner: 'Operations Manager',
    content: `
## 1. PURPOSE
This SOP defines the methods for product manufacturing or configuration, final release approval, deployment pipelines, unique device tracing (UDI), and automated validation parameters to meet,,, and.

## 2. SCOPE
Applies to all final configurations, release builds, shipments, infrastructure servicing operations, and automated verification tools utilized before device distribution.

## 3. DEFINITIONS & ABBREVIATIONS
Unique Device Identification (UDI): A series of numeric or alphanumeric characters created to identify a device
Technical Documentation (TD): Compiled technical file demonstrating product conformity
Product Release: Formal authorization shifting a batch or build from production status to commercially available status

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Production Engineer | Execute manufacturing or release pipelines and implement the UDI tags | ISO 13485 §7.5.1 |
| Technical Engineer | Perform and maintain automated test validations for release infrastructure | ISO 13485 §7.6 |
| QA Manager | Review final inspection metrics and execute formal commercial release sign-off | ISO 13485 §8.2.6 |
| PRRC | Verify complete device traceability data across delivery channels before market release | MDR Article 15 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. CONFIGURATION ⬇️ | Finalize product assembly or build configurations in accordance with approved specifications. | Production Team | Configuration Log |
| 2. AUTOMATED TESTING ⬇️| Execute validated testing routines to ensure configurations pass all design metrics. | Technical Engineer | Test Summary Report |
| 3. UDI ASSIGNMENT ⬇️ | Allocate and apply the controlled UDI data to the device and shipping layers. | Production Team | UDI Log Record |
| 4. RELEASE SIGN-OFF ⬇️| Complete final inspections. QA confirms DHF state and signs off the release block. | QA Manager | Signed Release Record |
| 5. TRACEABILITY | Log exact shipment parameters, delivery addresses, and customer parameters. | Operations Team | Shipping Log / REG-011 |
[TABLE_END]

## 6. REFERENCES ISO 13485:2016, Section 7.5 - Production and Service Provision ISO 13485:2016, Section 7.6 - Control of Measuring Equipment MDR Article 27 - Unique Device Identification system MDR Annex II §3 - Technical Documentation

## 7. APPENDICES
TMP-Release-Form: Final inspection sign-off checklist
REG-011-Release-Index: Master UDI and device delivery register

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  }, 

  // Lägg till i SOP_DATA6-objektet:

  // ------------------ STEP 6.2: CUSTOMER PROCESSES ------------------
  SOP_CUSTOMER_PROCESSES: {
    id: 'SOP-OPS-002',
    title: '📄 SOP-Customer_Processes_and_Market_Feedback.pdf',
    version: '1.0',
    owner: 'Operations / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for handling customer inquiries, orders, contracts, and market feedback in accordance with ISO 13485:2016 §7.2.

## 2. SCOPE
Applies to all customer-facing activities including order processing, contract review, and post-market feedback collection.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| Sales / Customer Service | Receive and log customer inquiries, orders, and feedback |
| QA | Review and approve contracts with regulatory impact |
| Regulatory Affairs | Triage feedback for PMS and vigilance relevance |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Inquiry | Receive and log customer inquiry or order. | Customer Service | Customer_Inquiry_Log |
| 2-Contract Review | Verify that requirements are defined, agreed, and achievable. | Sales + QA | Contract_Review_Checklist |
| 3-Order Processing | Process order and confirm delivery timeline. | Operations | Order_Confirmation |
| 4-Feedback Collection | Log customer feedback, complaints, and suggestions. | Customer Service | Feedback_Log |
| 5-Regulatory Routing | Route complaints with potential safety signals to RA within 24 hours. | QA | Complaint_Intake_Form |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 6.3: PRODUCTION & UDI ------------------
  SOP_PRODUCTION_UDI: {
    id: 'SOP-OPS-003',
    title: '📄 SOP-Production_Servicing_and_UDI_Traceability.pdf',
    version: '1.0',
    owner: 'Operations / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for production control, servicing activities, and UDI traceability in accordance with ISO 13485:2016 §7.5 and §7.6.

## 2. SCOPE
Applies to all manufacturing, assembly, packaging, labeling, and servicing operations for medical devices.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| Production Manager | Control manufacturing batches and verify production records |
| QA | Approve batch release and verify UDI labeling |
| IT | Validate production software and maintain traceability systems |
| Warehouse | Manage inventory and ensure FIFO/FEFO compliance |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Production Planning | Generate batch records with UDI-DI and UDI-PI assignments. | Production Manager | Batch_Manufacturing_Record |
| 2-Assembly | Execute assembly per work instructions. Document materials used. | Production | Assembly_Log |
| 3-Labeling | Apply UDI-compliant label (AIDC + Human Readable). Verify readability. | Production | Label_Verification_Log |
| 4-Inspection | Perform in-process and final inspection per acceptance criteria. | QA | Inspection_Report |
| 5-Batch Release | QA reviews batch records and authorizes release. | QA | Batch_Release_Certificate |
| 6-UDI Registration | Upload UDI data to EUDAMED per SOP_EUDAMED_UDI. | Regulatory Affairs | EUDAMED_Upload_Confirmation |
| 7-Servicing | Execute and document all servicing activities. Verify no unintended changes. | Production | Service_Report |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  }, 



  // Lägg till i SOP_DATA6-objektet (ersätt befintliga om de redan finns):

  // ------------------ STEP 7.1: INTERNAL AUDIT & PRODUCT RELEASE ------------------
  SOP_013_AUDITS_AND_RELEASE: {
    id: 'SOP-MEA-001',
    title: '📄 SOP-Internal_Audit_and_Product_Release.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for planning and conducting internal audits and performing final product release in accordance with ISO 13485:2016 §8.2.4 and §8.2.6.

## 2. SCOPE
Applies to all internal QMS audits and final product batch release activities.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| QA Manager | Approve audit schedule, select auditors, and authorize product release |
| Lead Auditor | Plan and execute audits, document findings |
| Auditors | Conduct audits per audit plan, report observations |
| Auditees | Cooperate with auditors and implement corrective actions |
| PRRC | Verify batch conformity per MDR Art. 15(3) |
[TABLE_END]

## 4. AUDIT PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Schedule | Develop annual audit plan covering all QMS processes. | QA Manager | Annual_Audit_Plan |
| 2-Planning | Assign auditor (independent of area audited). Prepare audit checklist. | Lead Auditor | Audit_Checklist |
| 3-Opening Meeting | Communicate audit scope, criteria, and schedule to auditees. | Lead Auditor | Meeting_Agenda |
| 4-Execution | Gather objective evidence through interviews, observation, and document review. | Auditor | Audit_Notes |
| 5-Findings | Classify findings as Major NC, Minor NC, or Observation. | Lead Auditor | Audit_Finding_Report |
| 6-Closing Meeting | Present findings to auditees. Agree on corrective action timelines. | Lead Auditor | Meeting_Minutes |
| 7-Report | Issue formal audit report within 5 working days. | Lead Auditor | Internal_Audit_Report |
| 8-Follow-up | Verify corrective actions and close findings. | Lead Auditor | CAPA_Records |
[TABLE_END]

## 5. PRODUCT RELEASE PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Batch Review | Review batch manufacturing record for completeness and accuracy. | QA | Batch_Record_Review |
| 2-Testing | Verify all required testing completed and within specifications. | QA | Test_Results |
| 3-Deviation Review | Verify all deviations are investigated and closed. | QA | Deviation_Log |
| 4-PRRC Verification | PRRC verifies batch conformity to MDR requirements. | PRRC | PRRC_Release_Check |
| 5-Release | Authorize batch release via eQMS. | QA | Batch_Release_Certificate |
[TABLE_END]

## 6. AUDITOR QUALIFICATIONS
- Internal auditors must be trained in ISO 13485 and auditing techniques
- Auditors shall not audit their own work
- Auditor competence must be documented in training records

## 7. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 7.2: NC & CAPA MANAGEMENT ------------------
  SOP_014_NC_CAPA_MANAGEMENT: {
    id: 'SOP-MEA-002',
    title: '📄 SOP-NonConformance_and_CAPA_Management.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for identifying, documenting, investigating, and resolving non-conformities and implementing corrective and preventive actions (CAPA) in accordance with ISO 13485:2016 §8.3, §8.5.2, and §8.5.3.

## 2. SCOPE
Applies to all product non-conformities, process deviations, audit findings, and CAPA activities.

## 3. DEFINITIONS
NC (Non-Conformity): Failure to meet a specified requirement
CAPA: Corrective and Preventive Action
Root Cause: The fundamental reason for the occurrence of a non-conformity

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| QA | Own the NC/CAPA process, maintain NC/CAPA register, and verify effectiveness |
| Originator | Report non-conformities and initiate NC records |
| Investigator | Conduct root cause analysis and propose actions |
| Department Heads | Approve CAPA plans and allocate resources |
| PRRC | Review NCs with regulatory impact |
[TABLE_END]

## 5. NC PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Identification | Identify and document non-conformity from any source (audit, complaint, production, supplier). | Originator | NC_Report |
| 2-Containment | Immediately contain the NC to prevent further impact. Segregate affected product. | QA / Production | Containment_Record |
| 3-Initial Review | Assess severity and regulatory impact. Determine if NB notification required. | QA + PRRC | NC_Assessment |
| 4-Disposition | Decide disposition: release, rework, reject, or concession. | QA | Disposition_Record |
| 5-Root Cause | Investigate root cause using structured methodology (5-Why, Fishbone, FMEA). | Investigator | Root_Cause_Analysis |
| 6-CAPA | Define corrective action (fix the cause) and preventive action (prevent recurrence). | Investigator | CAPA_Plan |
| 7-Implementation | Execute CAPA actions within agreed timeline. | Assignee | CAPA_Action_Log |
| 8-Effectiveness | Verify CAPA effectiveness after implementation. Close if effective; re-open if not. | QA | Effectiveness_Check |
[TABLE_END]

## 6. ESCALATION CRITERIA
- NC with patient safety impact: Notify PRRC within 24 hours
- NC requiring NB notification: Per SOP_NB_Communication (SOP-RA-003)
- NC requiring field action: Per SOP_Vigilance (SOP-RA-005)

## 7. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 7.3: DATA ANALYSIS & TRENDS ------------------
  SOP_015_DATA_ANALYSIS: {
    id: 'SOP-MEA-003',
    title: '📄 SOP-Data_Analysis_and_Trends.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for collecting, analyzing, and reporting QMS data to demonstrate suitability and effectiveness and to drive continuous improvement in accordance with ISO 13485:2016 §8.4.

## 2. SCOPE
Applies to all QMS performance data including audits, complaints, NCs, CAPAs, PMS, supplier performance, and process monitoring.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| QA | Aggregate data, perform trend analysis, and compile reports |
| Department Heads | Provide departmental data and review analysis |
| PRRC | Review regulatory trend data for vigilance implications |
| Top Management | Review trends at Management Review |
[TABLE_END]

## 4. DATA SOURCES
[TABLE_START]

| Data Source | Metric Examples |
| Customer Feedback | Complaint rate, NPS, return rate |
| Audits | NC count, closure time, repeat findings |
| CAPA | Open/closed CAPAs, time to closure, recurrence rate |
| PMS | Adverse event rate, PSUR findings, PMCF progress |
| Suppliers | On-time delivery, defect rate, SCAR count |
| Production | First-pass yield, scrap rate, batch rejection rate |
| Training | Training completion rate, competence gaps |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Collection | Collect data from all QMS processes at defined intervals. | QA | Data_Collection_Log |
| 2-Analysis | Apply statistical methods. Identify trends, patterns, and outliers. | QA | Trend_Analysis_Report |
| 3-Evaluation | Compare results against targets and thresholds. Identify adverse trends. | QA | Performance_Dashboard |
| 4-Reporting | Compile quarterly data analysis report for Management Review. | QA | Quarterly_Data_Report |
| 5-Action | Escalate adverse trends to relevant process owner for CAPA initiation. | QA | CAPA_Request |
| 6-Review | Present data trends at Management Review. Approve improvement initiatives. | Top Management | Management_Review_Minutes |
[TABLE_END]

## 6. TREND THRESHOLDS
[TABLE_START]

| Metric | Threshold | Action |
| Complaint rate increase | >20% YoY | Initiate CAPA |
| Repeat audit finding | Same NC twice | Root cause investigation |
| CAPA overdue | >30 days past due | Escalate to QA Manager |
| Supplier defect rate | >2% | Supplier corrective action |
| Adverse event increase | Any increase | Notify PRRC immediately |
[TABLE_END]

## 7. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  }, 
  // ------------------ 8.1 TD COMPILATION ------------------
  SOP_TD_COMPILATION: {
    id: 'SOP-RA-001',
    title: '📄 SOP-Technical_Documentation_Compilation.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for compiling, reviewing, approving, and maintaining product-specific Technical Documentation (TD) in accordance with MDR 2017/745 Annex II and Annex III.

## 2. SCOPE
Applies to all medical device Technical Documentation compiled for CE marking submissions, Notified Body audits, and post-market maintenance.

## 3. DEFINITIONS & ABBREVIATIONS
TD: Technical Documentation (Annex II + Annex III)
DHF: Design History File (ISO 13485 §7.3)
PRRC: Person Responsible for Regulatory Compliance (MDR Art. 15)
NB: Notified Body

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Reference |
| Regulatory Affairs | Own the TD compilation process, manage submission timelines, and coordinate cross-functional inputs | MDR Annex II |
| PRRC | Final sign-off on TD completeness and conformity before NB submission | MDR Art. 15(3) |
| R&D / Design Owner | Provide design inputs, outputs, verification/validation records | ISO 13485 §7.3 |
| Clinical Affairs | Deliver Clinical Evaluation Report (CER) and PMCF Plan | MDR Annex XIV |
| Quality Assurance | Provide QMS certificates, SOP references, and audit history | MDR Annex IX |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Output Record |
| 1-Initiation | Trigger TD compilation at Design Freeze milestone. Open TD Index and assign content owners. | Regulatory Affairs | TD_Index_Checklist.xlsx |
| 2-Collection | Gather all deliverables from R&D, Clinical, Risk, and QA according to the 7-chapter structure. | Content Owners | Draft documents per chapter |
| 3-Review | Conduct cross-functional review of each chapter for accuracy, consistency, and regulatory alignment. | Regulatory Affairs | Review_Comments_Log |
| 4-Gap Analysis | Verify GSPR coverage, standard compliance, and clinical evidence sufficiency. Escalate gaps to PRRC. | Regulatory Affairs | GSPR_Compliance_Matrix.xlsx |
| 5-PRRC Sign-off | PRRC verifies TD completeness and conformity. Formal sign-off recorded. | PRRC | PRRC_Approval_Record |
| 6-Submission | Transmit finalized TD to Notified Body or Competent Authority per applicable conformity assessment route. | Regulatory Affairs | Submission_Transmittal_Letter |
| 7-Maintenance | Update TD upon design changes, new clinical data, or regulatory updates. Maintain version history. | Regulatory Affairs | TD_Change_History_Log |
[TABLE_END]

## 6. TD STRUCTURE (MDR Annex II & III)
[TABLE_START]

| Chapter | Content | Phase |
| 1-DEVICE DESCRIPTION | Qualification rationale, classification, UDI, PRRC appointment | Pre-Market |
| 2-INFO SUPPLIED BY MFR | Labels, IFU, implant cards, SSCP (Class III) | Pre-Market |
| 3-DESIGN & MFG INFO | Design specs, manufacturing processes, suppliers | Pre-Market |
| 4-GSPR | General Safety and Performance Requirements matrix | Pre-Market |
| 5-RISK MANAGEMENT | Risk management file (ISO 14971) | Pre-Market |
| 6-V&V | Verification/validation, CER, clinical evidence | Pre-Market |
| 7-PMS | PMS Plan, PMCF Plan, PSUR templates | Post-Market |
[TABLE_END]

## 7. MDR COMPLIANCE SUMMARY
[TABLE_START]

| MDR Requirement | Covered By |
| Art. 10(4) | This entire SOP (TD establishment and maintenance) |
| Annex II | TD structure and content requirements |
| Annex III | Post-market surveillance documentation |
| Art. 15(3) | PRRC sign-off obligation |
[TABLE_END]

## 8. APPENDICES
TD_Index_Checklist.xlsx
GSPR_Compliance_Matrix.xlsx

Associated Templates and Forms:
📝 TMP-TD_Chapter_Template.docx
📝 TMP-TD_Review_Checklist.docx
📝 TMP-PRRC_Approval_Record.docx
📝 TMP-Submission_Transmittal_Letter.docx

## 9. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release of this SOP | Regulatory Affairs |
[TABLE_END]
    `.trim()
  },

  // ------------------ 8.2 EUDAMED & UDI ------------------
  SOP_EUDAMED_UDI: {
    id: 'SOP-RA-002',
    title: '📄 SOP-EUDAMED_and_UDI_Registration.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for registering economic operators and medical devices in the EUDAMED database and assigning Unique Device Identification (UDI) codes in accordance with MDR 2017/745 Articles 27-31 and Annex VI.

## 2. SCOPE
Applies to all manufacturer registrations, device listings, and UDI assignments for products placed on the EU market.

## 3. DEFINITIONS & ABBREVIATIONS
SRN: Single Registration Number (EUDAMED Actor ID)
Basic UDI-DI: Product family identifier linking devices to EUDAMED
UDI-DI: Device model-specific identifier
UDI-PI: Production identifier (batch, serial, expiry, manufacturing date)
EMDN: European Medical Device Nomenclature

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Reference |
| Regulatory Affairs | Manage EUDAMED registrations, assign Basic UDI-DI, and maintain data accuracy | MDR Art. 29-31 |
| PRRC | Verify registration data and approve submissions | MDR Art. 15(3) |
| IT / Labeling | Generate UDI barcodes and integrate with labeling artwork | MDR Annex VI Part C |
| Quality Assurance | Verify UDI traceability in production records | ISO 13485 §7.5 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Output Record |
| 1-Actor Registration | Submit economic operator profile to EUDAMED via national competent authority. | Regulatory Affairs | SRN_Registration_Confirmation |
| 2-Basic UDI-DI | Assign Basic UDI-DI for each product family according to issuing entity rules. | Regulatory Affairs | Basic_UDI-DI_Register.xlsx |
| 3-EMDN Mapping | Select applicable EMDN codes for device category and characteristics. | Regulatory Affairs | EMDN_Code_Assignment_Record |
| 4-Device Registration | Upload device listing data and link to Basic UDI-DI in EUDAMED. | Regulatory Affairs | EUDAMED_Device_Registration |
| 5-UDI-DI Assignment | Assign UDI-DI for each device variant and packaging level. | IT / Labeling | UDI-DI_Assignment_Log.xlsx |
| 6-UDI Labeling | Integrate UDI carrier (barcode + human readable) into device labels. | Labeling | Label_Artwork_Approval |
| 7-Maintenance | Update EUDAMED within 1 week of any data change. Reconfirm accuracy every 2 years. | Regulatory Affairs | EUDAMED_Update_Log |
[TABLE_END]

## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]

| MDR Requirement | Covered By |
| Art. 27 | UDI system implementation |
| Art. 28 | UDI database requirements |
| Art. 29 | Device registration in EUDAMED |
| Art. 31 | Economic operator registration (SRN) |
| Annex VI Part A | Actor and device registration data elements |
| Annex VI Part B | UDI core data elements |
| Annex VI Part C | UDI system and carrier specifications |
[TABLE_END]

## 7. APPENDICES
Basic_UDI-DI_Register.xlsx
UDI-DI_Assignment_Log.xlsx

Associated Templates and Forms:
📝 TMP-EUDAMED_Actor_Registration_Form.docx
📝 TMP-EUDAMED_Device_Registration_Form.docx
📝 TMP-UDI_Label_Verification_Checklist.docx

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release of this SOP | Regulatory Affairs |
[TABLE_END]
    `.trim()
  },

  // ------------------ 8.3 NOTIFIED BODY COMMUNICATION ------------------
  SOP_NB_COMMUNICATION: {
    id: 'SOP-RA-003',
    title: '📄 SOP-Notified_Body_Communication_and_Submissions.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for selecting, contracting, and communicating with a Notified Body (NB) for conformity assessment activities under MDR 2017/745 Articles 50-57 and Annexes IX-XI.

## 2. SCOPE
Applies to all interactions with Designated Notified Bodies for CE marking, surveillance audits, and certificate maintenance.

## 3. DEFINITIONS & ABBREVIATIONS
NANDO: New Approach Notified and Designated Organisations database
QMS Certificate: EU Quality Management System Certificate (Annex IX Ch. I)
TD Certificate: EU Technical Documentation Assessment Certificate (Annex IX Ch. II)
NC: Non-Conformity

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Reference |
| Regulatory Affairs | Lead NB selection, manage submission dossiers, and coordinate audit responses | MDR Art. 52 |
| PRRC | Final approval of submission packages and NB correspondence | MDR Art. 15 |
| Top Management | Sign NB contract and authorize audit resources | ISO 13485 §5.1 |
| Quality Assurance | Host QMS audits and provide objective evidence | ISO 13485 §8.2.4 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Output Record |
| 1-NB Selection | Identify designated NBs via NANDO for device scope. Evaluate capabilities, timelines, and fees. | Regulatory Affairs | NB_Selection_Memo |
| 2-Contracting | Execute NB agreement defining audit scope, schedule, and confidentiality terms. | Top Management | NB_Contract |
| 3-Submission | Compile and transmit QMS and TD documentation per agreed audit plan. | Regulatory Affairs | Submission_Dossier |
| 4-Audit Hosting | Coordinate on-site or remote audit logistics. Ensure subject matter experts available. | QA / RA | Audit_Agenda |
| 5-NC Response | Respond to non-conformities within NB deadlines. Submit corrective action plans and evidence. | Regulatory Affairs | NC_Response_Package |
| 6-Certificate Issuance | Receive and archive QMS and TD certificates. Log validity periods. | Regulatory Affairs | Certificate_Register.xlsx |
| 7-Surveillance | Schedule annual surveillance audits. Notify NB of significant changes per Annex IX 4.10. | Regulatory Affairs | Surveillance_Audit_Plan |
| 8-Renewal | Initiate certificate renewal process 6 months before expiry. | Regulatory Affairs | Renewal_Application |
[TABLE_END]

## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]

| MDR Requirement | Covered By |
| Art. 52 | Conformity assessment routes and NB selection |
| Annex IX Ch. I | QMS audit requirements |
| Annex IX Ch. II | TD assessment requirements |
| Annex IX 4.10 | Change notification to NB |
| Art. 56 | Certificate validity and renewal |
[TABLE_END]

## 7. APPENDICES
Certificate_Register.xlsx
NB_Selection_Matrix.xlsx

Associated Templates and Forms:
📝 TMP-NB_Selection_Memo.docx
📝 TMP-Submission_Cover_Letter.docx
📝 TMP-NC_Response_Form.docx
📝 TMP-Change_Notification_to_NB.docx

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release of this SOP | Regulatory Affairs |
[TABLE_END]
    `.trim()
  },

  // ------------------ 8.4 POST-MARKET SURVEILLANCE ------------------
  SOP_PMS: {
    id: 'SOP-RA-004',
    title: '📄 SOP-Post-Market_Surveillance.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the proactive and systematic process for collecting, analyzing, and acting upon post-market data to ensure continued safety and performance of medical devices under MDR 2017/745 Articles 83-86 and Annex III.

## 2. SCOPE
Applies to all CE-marked medical devices throughout their commercial lifecycle, including legacy devices transitioning under MDR.

## 3. DEFINITIONS & ABBREVIATIONS
PMS: Post-Market Surveillance
PSUR: Periodic Safety Update Report
PMCF: Post-Market Clinical Follow-up
FSCA: Field Safety Corrective Action
CAPA: Corrective and Preventive Action

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Reference |
| Regulatory Affairs | Own PMS process, compile PMS Plan and PSUR | MDR Art. 83-84 |
| PRRC | Review and approve PMS outputs, escalate safety signals | MDR Art. 15(3) |
| Customer Service | Log complaints and customer feedback | ISO 13485 §8.2.1 |
| Clinical Affairs | Execute PMCF activities and update CER | MDR Annex XIV Part B |
| Quality Assurance | Trigger CAPA based on PMS trend analysis | ISO 13485 §8.5 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Output Record |
| 1-PMS Plan | Establish PMS Plan per device family. Define data sources, metrics, and review frequency. | Regulatory Affairs | PMS_Plan_dd_mm_yyyy.pdf |
| 2-Data Collection | Gather data from complaints, vigilance, literature, registries, and PMCF studies. | Cross-functional | PMS_Data_Log.xlsx |
| 3-Data Analysis | Analyze trends, identify safety signals, and evaluate benefit-risk ratio. | Regulatory Affairs | PMS_Analysis_Report |
| 4-PSUR | Compile Periodic Safety Update Report per device class schedule. | Regulatory Affairs | PSUR_dd_mm_yyyy.pdf |
| 5-CAPA Trigger | Initiate corrective actions for identified safety or performance issues. | QA | CAPA_Request |
| 6-CER Update | Feed PMS findings into Clinical Evaluation Report updates. | Clinical Affairs | CER_Update_Log |
| 7-PMS Plan Update | Revise PMS Plan based on findings and new regulatory guidance. | Regulatory Affairs | PMS_Plan_Revision |
[TABLE_END]

## 6. PSUR SCHEDULE (MDR Art. 86)
[TABLE_START]

| Device Class | PSUR Frequency |
| Class I | As needed (not mandatory) |
| Class IIa | Every 2 years |
| Class IIb | Annually |
| Class III | Annually |
[TABLE_END]

## 7. MDR COMPLIANCE SUMMARY
[TABLE_START]

| MDR Requirement | Covered By |
| Art. 83 | PMS system obligations |
| Art. 84 | PMS Plan requirements |
| Art. 85 | PMS Report (Class I) |
| Art. 86 | PSUR (Class IIa-IIb-III) |
| Annex III | Technical Documentation on PMS |
[TABLE_END]

## 8. APPENDICES
PMS_Plan_Template.pdf

Associated Templates and Forms:
📝 TMP-PMS_Data_Collection_Form.docx
📝 TMP-PSUR_Report_Template.docx
📝 TMP-PMS_Trend_Analysis_Template.xlsx

## 9. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release of this SOP | Regulatory Affairs |
[TABLE_END]
    `.trim()
  },

  // ------------------ 8.5 VIGILANCE ------------------
  SOP_VIGILANCE: {
    id: 'SOP-RA-005',
    title: '📄 SOP-Vigilance_and_Adverse_Event_Reporting.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for identifying, evaluating, and reporting serious incidents and Field Safety Corrective Actions (FSCA) to Competent Authorities in accordance with MDR 2017/745 Articles 87-92.

## 2. SCOPE
Applies to all reported incidents involving CE-marked devices, including complaints received from healthcare professionals, patients, distributors, and importers.

## 3. DEFINITIONS & ABBREVIATIONS
Serious Incident: Any incident that directly or indirectly led, might have led, or might lead to death, serious deterioration in health, or public health threat.
FSCA: Field Safety Corrective Action - action taken to reduce risk of serious incident.
FSN: Field Safety Notice - communication to users regarding FSCA.
MIR: Manufacturer Incident Report
PSR: Periodic Summary Report

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Reference |
| PRRC | Oversee vigilance system, approve MIR/FSN submissions | MDR Art. 15(3) |
| Regulatory Affairs | Manage incident intake, investigation, and regulatory reporting | MDR Art. 87-90 |
| Quality Assurance | Lead root cause investigations and CAPA | ISO 13485 §8.5 |
| Customer Service | Forward all complaint reports to RA within 24 hours | ISO 13485 §8.2.1 |
| Clinical Affairs | Provide clinical assessment of incident severity | MDR Art. 89(5) |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Timeline |
| 1-Intake | Receive and log incident report from any source. Triage for seriousness. | Regulatory Affairs | 24 hours |
| 2-Investigation | Conduct root cause analysis. Involve R&D, QA, and Clinical as needed. | QA / RA | Immediately |
| 3-Seriousness Assessment | Determine if incident meets serious incident criteria (death, serious health deterioration, public health threat). | PRRC + Clinical | 48 hours |
| 4-MIR Submission | If serious incident: submit Manufacturer Incident Report to Competent Authority. | Regulatory Affairs | 15 days (or 2 days if death/unlisted) |
| 5-FSCA Decision | Determine if Field Safety Corrective Action is required to prevent recurrence. | PRRC | Immediately |
| 6-FSN Issuance | Issue Field Safety Notice to all affected users and distributors. | Regulatory Affairs | Before or with FSCA |
| 7-Trend Reporting | Monitor incident trends. Submit Periodic Summary Report for non-serious incidents if agreed with CA. | Regulatory Affairs | Per CA agreement |
| 8-Close-out | Document final resolution and update risk management file. | Regulatory Affairs | Upon closure |
[TABLE_END]

## 6. REPORTING TIMELINES (MDR Art. 87-89)
[TABLE_START]

| Incident Type | Reporting Deadline |
| Serious public health threat | Immediately, max 2 days |
| Death or unanticipated serious deterioration | Immediately, max 10 days |
| Other serious incidents | Max 15 days |
| Trend increase in non-serious incidents | Per PSR schedule |
[TABLE_END]

## 7. MDR COMPLIANCE SUMMARY
[TABLE_START]

| MDR Requirement | Covered By |
| Art. 87 | Serious incident reporting |
| Art. 88 | Trend reporting |
| Art. 89 | Incident analysis and follow-up |
| Art. 90 | FSCA and FSN requirements |
| Art. 91 | Vigilance data in EUDAMED |
| Art. 92 | PSUR and PSR requirements |
[TABLE_END]

## 8. APPENDICES
Vigilance_Incident_Log.xlsx

Associated Templates and Forms:
📝 TMP-MIR_Manufacturer_Incident_Report.docx
📝 TMP-FSN_Field_Safety_Notice.docx
📝 TMP-FSCA_Action_Plan.docx
📝 TMP-PSR_Periodic_Summary_Report.docx
📝 TMP-Incident_Investigation_Form.docx

## 9. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release of this SOP | Regulatory Affairs |
[TABLE_END]
    `.trim()
  }
}; 








