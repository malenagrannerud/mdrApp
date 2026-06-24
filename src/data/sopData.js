/**
 * @file sopData.js
 * @description All QMS SOP templates — 22 SOPs + 4 templates covering ISO 13485:2016 (62/62 clauses) and MDR 2017/745.
 */

export const SOP_DATA = {

// ================== STEP 1: DOCUMENT & DATA CONTROL ==================
SOP_DOC_DATA_CONTROL: {
    id: 'SOP-001',
    title: '📄 SOP-Document_and_Data_Control.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who validates the eQMS, controls QMS documents, and verifies automated backups, to secure data integrity, ensure only approved document revisions are in use, and guarantee full business recovery if system failures occur. Covers ISO 13485 §4.1, §4.2.4, §4.2.5.

## 2. SCOPE
Applies to all QMS software tools, QMS documentation, and data storage systems.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| QA | Process owner for all three sub-processes |
| CTO / IT | Configure servers, manage access, execute backups |
| System Owner | Author URS and execute UAT for software tools |
| Author | Draft documents per document control workflow |
[TABLE_END]

## 4. PART A — SOFTWARE VALIDATION (ISO 13485 §4.1.6)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Inventory | Log new software, determine GAMP 5 category. | QA | Software_Inventory.xlsx |
| 2-Requirements | Author URS with operational, security, and electronic signature needs. | System Owner | URS_Specification.docx |
| 3-Risk Analysis | Run failure mode assessment on data storage, signatures, visibility. | QA | Software_Risk_Assessment.pdf |
| 4-IQ | Document environment setup, security patches, connections. | CTO / IT | IQ_Protocol.pdf |
| 5-OQ | Test user roles, password locks, audit trails. | CTO / IT | OQ_Test_Sheets.pdf |
| 6-PQ | Run real workplace scenarios for end-to-end stability. | System Owner | UAT_Sign-off_Matrix.pdf |
| 7-Release | Compile summary report, audit deviations, grant rollout. | QA | Software_Validation_Report.pdf |
| 8-Maintenance | Monitor change controls, user logs, annual recoverability. | CTO / IT | Change_Control_Log |
[TABLE_END]

## 5. PART B — DOCUMENT CONTROL (ISO 13485 §4.2.4)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Drafting | Initiate document text and revision justifications. | Author | Change_Request.docx |
| 2-Peer Review | Cross-functional validation of accuracy and impacts. | Reviewer | Review_Comments_Log |
| 3-QA Approval | Audit regulatory conformity, apply electronic signatures. | QA | Approved_Master_PDF |
| 4-Distribution | Release via eQMS, archive superseded files. | QA | Master_Document_Register |
[TABLE_END]

## 6. PART C — DATA INTEGRITY & BACKUP (ISO 13485 §4.2.5)
[TABLE_START]
| Phase | Actions | Responsible | Evidence |
| 1-Encryption | Encrypt data at rest and in transit (AES-256). | CTO / IT | Security_Config_Log |
| 2-Snapshot | Automate incremental backup every 24 hours. | CTO / IT | Backup_Log_Reports |
| 3-Restore Test | Execute full restore simulation every 12 months. | CTO / IT | Restore_Test_Report.pdf |
| 4-Log Auditing | Routine checks on electronic tracking logs. | QA | Audit_Trail_Logs |
[TABLE_END]

## 7. MDR COMPLIANCE SUMMARY
[TABLE_START]
| MDR Requirement | Covered By |
| Article 10(8) | Record retention and data integrity |
| Article 10(9) | Software validation and document control |
| Annex IX §2.2 | Data integrity, user authorization, system change tracking |
[TABLE_END]

## 8. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 2.1: QUALITY MANUAL ==================
QUALITY_MANUAL: {
    id: 'QM-001',
    title: '📄 Quality_Manual.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this Quality Manual is to define the scope, structure, and governance of the Quality Management System (QMS) in accordance with ISO 13485:2016 §4.2.2 and applicable regulatory requirements including MDR 2017/745.

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
Product-specific exclusions to ISO 13485:2016 requirements are documented below with justification. The QMS covers all generic processes; exclusions are made per product in the product-specific Technical Documentation.
- [List exclusions, e.g., §7.5.3 Installation — not applicable for plug-and-play devices]

## 5. APPLICABLE REGULATIONS & STANDARDS
- ISO 13485:2016 — Medical devices — Quality management systems
- MDR 2017/745 — EU Medical Device Regulation
- ISO 14971:2019 — Risk management for medical devices
- EN 62366-1 — Usability engineering

## 6. PROCESS INTERACTION MAP
The QMS processes are grouped into three implementation phases:
- Phase 1 (Foundation): Document control, management framework, resource management
- Phase 2 (Product Realization): Design control, risk management, clinical evaluation, operations, purchasing, production
- Phase 3 (Oversight): Measurement, audit, CAPA, complaint handling, regulatory affairs

## 7. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 2.2: MANAGEMENT FRAMEWORK ==================
SOP_MANAGEMENT_FRAMEWORK: {
    id: 'SOP-MGMT-001',
    title: '📄 SOP-Management_Framework.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who sets the Quality Policy and objectives, who is appointed as PRRC, and when Management Reviews are conducted. Covers ISO 13485 §5.3, §5.4.1, §5.5, §5.6 and MDR Art. 15.

## 2. SCOPE
Applies to top management, all department heads, and the appointed PRRC.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| CEO / Top Management | Approve Quality Policy, sign PRRC mandate, chair Management Review, authorize resources |
| QA Manager | Draft policy, coordinate objectives, compile Management Review inputs, document minutes |
| PRRC | Oversee regulatory compliance per MDR Art. 15(3) |
| Department Heads | Propose and track objectives, present performance data at Management Review |
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
| 3-Conduct | Review QMS performance, identify gaps, approve improvement actions. | Top Management | Meeting_Minutes |
| 4-Outputs | Document decisions on QMS improvements, resource needs, policy changes. | QA | Management_Review_Output |
| 5-Follow-up | Track and verify completion of action items. | QA | Action_Item_Log |
[TABLE_END]

## 8. MANAGEMENT REVIEW INPUTS (ISO 13485 §5.6.2)
[TABLE_START]
| Input | Source |
| Audit results | Internal and external audit reports |
| Customer feedback & complaints | Complaint handling and PMS logs |
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
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 3.1: COMPETENCE & TRAINING ==================
SOP_COMPETENCE_TRAINING: {
    id: 'SOP-RES-001',
    title: '📄 SOP-Competence_and_Training.pdf',
    version: '1.0',
    owner: 'HR / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who assesses competence gaps and when personnel training records are updated, to maintain a qualified training matrix and provide objective evidence of staff qualifications during audits. Covers ISO 13485 §6.2.

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

// ================== STEP 3.2: INFRASTRUCTURE & WORK ENVIRONMENT ==================
SOP_INFRASTRUCTURE_IT: {
    id: 'SOP-RES-002',
    title: '📄 SOP-Infrastructure_Work_Environment_and_IT.pdf',
    version: '1.0',
    owner: 'IT / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who maintains IT infrastructure, controls the work environment, and when security updates are performed, to prevent data loss, unauthorized system changes, and ensure a compliant physical and digital workspace. Covers ISO 13485 §6.3 and §6.4.

## 2. SCOPE
Applies to buildings, utilities, IT systems, network infrastructure, cleanrooms, environmental controls, and software tools supporting QMS activities.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| IT Manager | Maintain IT infrastructure, apply security patches, manage user access |
| Facility Manager | Maintain buildings, utilities, environmental controls, and work environment |
| QA | Verify infrastructure and work environment suitability for QMS compliance |
[TABLE_END]

## 4. PART A — INFRASTRUCTURE (§6.3)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Inventory | Maintain register of IT systems, servers, software, and facilities. | IT / Facilities | Asset_Register.xlsx |
| 2-Maintenance | Perform preventive maintenance per schedule. Log all repairs. | IT / Facilities | Maintenance_Log |
| 3-Access Control | Manage user accounts, permissions, password policies. | IT | User_Access_Log |
| 4-Security Updates | Apply critical security patches within 30 days of release. | IT | Patch_Management_Log |
| 5-Backup Verification | Verify automated backups per SOP_Doc_Data_Control. | IT | Backup_Verification_Log |
| 6-Change Control | Document and approve all infrastructure changes. | IT + QA | Change_Request |
| 7-Disaster Recovery | Test disaster recovery plan annually. | IT | DR_Test_Report |
[TABLE_END]

## 5. PART B — WORK ENVIRONMENT (§6.4)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Requirements | Define work environment requirements (cleanroom class, ESD, temperature, humidity, lighting). | R&D + QA | Environment_Specs |
| 2-Monitoring | Monitor and log environmental parameters. Alert on deviations. | Facilities | Environment_Log |
| 3-Control | Implement controls to maintain required conditions. | Facilities | Control_Records |
| 4-Contamination | Implement contamination control where product cleanliness is required. | Production + QA | Contamination_Log |
| 5-Personnel | Define hygiene, clothing, and health requirements for controlled environments. | QA | Personnel_Requirements |
[TABLE_END]
Note: If no controlled work environment is required, document exclusion in Quality Manual per §4.2.2.

## 6. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA/IT |
[TABLE_END]
    `.trim()
},

// ================== STEP 4.1: DESIGN CONTROL ==================
SOP_DESIGN_CONTROL: {
    id: 'SOP-005',
    title: '📄 SOP-Design_Control.pdf',
    version: '1.0',
    owner: 'R&D',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who documents product development phases and when formal design reviews are conducted, to establish a compliant Design History File (DHF) with full traceability from inputs to outputs. Covers ISO 13485 §7.3.1-7.3.7, §7.3.10.

## 2. SCOPE
Applies to all new product development and design changes conducted by the organization.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Product Manager | Gather user needs, safety inputs, establish URS |
| Technical Engineer | Generate technical outputs, execute protocols, compile DHF assets |
| R&D Manager | Authorize design plans, chair formal reviews, oversee development phases |
| QA | Maintain design control compliance, approve protocols, release DHF records |
| PRRC | Verify validation testing meets safety and compliance benchmarks before launch |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| Feasibility | Market analysis, PoC, high-level risk assessment. | Product Manager | Feasibility_Report.pdf |
| Design Planning | Define development structure, milestones, V&V strategy. | R&D Manager | Design_Plan.pdf |
| Design Input | Create URS. Define regulatory, clinical, cybersecurity requirements. | Product Manager | Design_Input_Spec |
| Design Output | Implement software/hardware. Write technical specs. | Technical Engineer | Design_Output_Spec |
| Design Review | Conduct formal review meetings. Execute gap analysis. | R&D Manager | Review_Minutes |
| Design Verification | Perform unit, integration, system testing. | Technical Engineer | Verification_Reports.pdf |
| Design Validation | Execute clinical evaluation per SOP_Clinical_Evaluation. | Product Manager | CER.pdf |
| Design Release | Conduct final DHF review and compliance check. | QA | DoC.pdf |
[TABLE_END]

## 5. DESIGN FILES (§7.3.10)
A Design History File (DHF) shall be maintained for each product, containing or referencing all records generated during design and development.

## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]
| MDR Requirement | Covered By |
| Annex I GSPR 1-9 | Input, Verification, and Validation phases |
| Annex II §3 | Design History File (DHF) Structure |
| Article 10(1) | This entire SOP |
| Article 10(4) | Output phase |
[TABLE_END]

## 7. APPENDICES
DHF_Master_Index.xlsx
SOP-Risk_Management.pdf
SOP-Change_Control.pdf

## 8. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 4.2: RISK MANAGEMENT ==================
SOP_RISK_MANAGEMENT: {
    id: 'SOP-006',
    title: '📄 SOP-Risk_Management.pdf',
    version: '1.0',
    owner: 'QA/RA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who identifies product hazards and when risk assessments are updated, to maintain a lifecycle risk management file and secure patient and user safety. Covers ISO 13485 §7.1 and ISO 14971:2019.

## 2. SCOPE
Applies to all lifecycle stages of medical devices, from concept to post-market surveillance.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Top Management | Define risk acceptability policy and provide adequate resources |
| Risk Management Team (RMT) | Conduct risk evaluations and maintain FMEA matrix |
| PRRC/QA/RA | Maintain Risk Management File (RMF), ensuring full traceability |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Establish Intended Use | Define patient population, intended user, and use environment. | RMT | Intended_Use_Statement.pdf |
| 2-Hazard Identification | Identify hazards per ISO 14971 Annex C and IEC 62304. | RMT | Hazard_List.pdf |
| 3-Risk Estimation | Score severity (1-5) and probability (1-5). Calculate risk score. | RMT | FMEA_Matrix.xlsx |
| 4-Risk Control | Apply mitigations in priority order: inherent safety, protective measures, information for safety. | R&D + QA | Risk_Control_Specs.pdf |
| 5-Residual Risk | Evaluate post-control risk. Determine if acceptable. | RMT | Residual_Risk_Assessment |
| 6-Report | Compile Risk Management Report. Conclude benefit-risk is acceptable. | PRRC + RMT | RMR.pdf |
| 7-Production & Post-Production | Monitor real-world data. Re-evaluate if new hazards emerge. | RA | PMS_Log |
[TABLE_END]

## 5. RISK ACCEPTABILITY MATRIX
[TABLE_START]
| Score Range | Risk Region | Required Action |
| 1-6 | Acceptable | No further controls required |
| 8-25 | Unacceptable | Design mitigations mandatory before release |
[TABLE_END]

## 6. REGULATORY REFERENCES
- ISO 14971:2019 — Risk management for medical devices
- MDR Annex I (GSPR 1-9)
- MDR Article 10(2)
- EN 62366-1:2015 — Usability engineering

## 7. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 4.3: CLINICAL EVALUATION ==================
SOP_CLINICAL_EVALUATION: {
    id: 'SOP-007',
    title: '📄 SOP-Clinical_Evaluation.pdf',
    version: '1.0',
    owner: 'R&D / QA/RA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who performs clinical assessments and when device validation is executed, to gather clinical evidence and confirm that the device meets its intended use and user needs safely. Covers ISO 13485 §7.3.6, §7.3.7 and MDR Art. 61, Annex XIV.

## 2. SCOPE
Applies to the continuous clinical evaluation of all devices, covering pre-market evaluation and post-market clinical follow-up (PMCF).

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Product Manager | Act as Clinical Lead, gather literature, coordinate appraisals |
| Clinical Expert | Appraise data validity and provide expert clinical judgment |
| RA | Ensure CER meets MDR requirements, monitor MDCG updates |
| QA | Review and approve final CER, ensure alignment with Risk File |
| PRRC | Authorize release of CER into Technical Documentation |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Planning | Define search strategy, clinical claims, GSPR mapping. | PM + RA | CEP.pdf |
| 2-Data Identification | Gather internal V&V data. Collect external literature and registry data. | PM | Literature_Report.pdf |
| 3-Data Appraisal | Evaluate validity and methodological quality per MDCG guidance. | Clinical Expert | Appraisal_Report.docx |
| 4-Analysis | Run gap analysis via Clinical Development Plan. Determine data sufficiency. | PM + RA | CDP |
| 5-CER | Draft Clinical Evaluation Report demonstrating GSPR compliance. | PM + Clinical Expert | CER.pdf |
| 6-PMCF | Establish Post-Market Clinical Follow-up plan. Update CER with real-world data. | PM + RA | PMCF_Plan.pdf |
[TABLE_END]

## 5. MDR COMPLIANCE SUMMARY
[TABLE_START]
| MDR Requirement | Covered By |
| Article 61 | Entirety of this SOP |
| Annex XIV Part A | Clinical evaluation requirements |
| Annex XIV Part B | PMCF documentation |
| MDCG 2020-13 | SaMD clinical evaluation guidance |
[TABLE_END]

## 6. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-25 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 4.4: DESIGN TRANSFER ==================
SOP_DESIGN_TRANSFER: {
    id: 'SOP-008',
    title: '📄 SOP-Design_Transfer.pdf',
    version: '1.0',
    owner: 'R&D / Operations',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who translates design outputs to production specifications and when transfer milestones are verified, to ensure production builds match design specs before commercial release. Covers ISO 13485 §7.3.8.

## 2. SCOPE
Applies to all new product introductions and major design changes requiring transfer to production.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| R&D | Define transfer specifications and acceptance criteria |
| Operations | Translate design outputs to production work instructions |
| QA | Verify transfer completeness and approve production readiness |
| PRRC | Final approval of transfer before commercial release |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Transfer Plan | Define milestones, acceptance criteria, and required production validations. | R&D + Operations | Transfer_Plan.pdf |
| 2-Specification Handover | Translate design outputs into production specs, BOM, work instructions, test protocols. | R&D | Production_Specs |
| 3-Supplier Qualification | Qualify suppliers for transferred components per SOP_Supplier_Management. | Operations | ASL_Update |
| 4-First Article | Execute first production run. Inspect output against design specs. | R&D + QA | First_Article_Report |
| 5-Process Validation | Validate production processes where output cannot be verified by subsequent monitoring (§7.5.6). | Operations + QA | Process_Validation_Report |
| 6-Transfer Approval | QA verifies all criteria met. PRRC approves transfer. | QA + PRRC | Transfer_Approval |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 4.5: DESIGN CHANGE CONTROL ==================
SOP_CHANGE_CONTROL: {
    id: 'SOP-009',
    title: '📄 SOP-Change_Control.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who reviews engineering modifications and when changes are approved post-launch, to prevent unintended quality degradation and determine if NB notification is required per MDCG 2020-3. Covers ISO 13485 §7.3.9.

## 2. SCOPE
Applies to all changes affecting product design, manufacturing, suppliers, software, or QMS processes.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Change Initiator | Identify issue and submit CR ticket |
| R&D | Assess technical impact on product design and architecture |
| RA | Evaluate regulatory impact. Determine if change is significant |
| QA | Review impact assessment, final approval of CR |
| CCB | Multi-disciplinary review board (R&D, QA, RA) authorizing releases |
| PRRC | Formally sign off that change maintains compliance before release |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Initiation | Create Change Request (CR). Complete impact assessment. | Initiator | CR_Form.docx |
| 2-Assessment | Run regulatory impact matrix (MDCG 2020-3). Evaluate risk impact via FMEA. | R&D + RA | Impact_Assessment |
| 3-CCB Review | Convene Change Control Board. PRRC signs off on compliance. | CCB + PRRC | CCB_Minutes |
| 4-Execution | Implement change in separate branch. Update TD components. | R&D | Updated_TD |
| 5-Verification | Run automated regression testing. Verify traceability. | QA | Test_Report |
| 6-Closure | Close CR. Notify NB if significant change per Annex IX 4.10. | RA | CR_Closed |
[TABLE_END]

## 5. REGULATORY CLASSIFICATION (MDCG 2020-3)
A change is SIGNIFICANT (requires NB approval) if it alters: intended purpose, clinical logic/algorithm, user interface for critical data, operating environment, or introduces new hazards.

## 6. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== CHANGE CONTROL TEMPLATE ==================
CHANGE_MATRIX: {
    id: 'TMP-009A',
    title: '📝 TMP-Change_Request_and_Impact_Assessment.docx',
    version: '1.0',
    owner: 'R&D / CCB / QA/RA',
    content: `
# CHANGE CLASSIFICATION & IMPACT ASSESSMENT

## PHASE 1 — INITIATION
[TABLE_START]
| Field | Input |
| CR ID | CR-________________________ |
| Date | ________________________ |
| Initiator | ________________________ |
| Affected Version | Baseline: _________ → Target: _________ |
| Proposed Change | [Description] |
| Rationale | [Why is this change necessary?] |
[TABLE_END]

## PHASE 2 — REGULATORY CLASSIFICATION (MDCG 2020-3)
[TABLE_START]
| # | Criteria | YES | NO |
| 1 | Alters intended purpose, indications, or target population? | [ ] | [ ] |
| 2 | Modifies clinical logic, AI model, or diagnostic algorithm? | [ ] | [ ] |
| 3 | Alters how critical clinical data is displayed to user? | [ ] | [ ] |
| 4 | Involves complete migration of cloud infrastructure? | [ ] | [ ] |
| 5 | Introduces new clinical hazards or increases failure probability? | [ ] | [ ] |
[TABLE_END]

FINAL CLASSIFICATION: [ ] MINOR (Non-Significant) — [ ] MAJOR (Significant — NB notification required)

## PHASE 3 — CCB IMPACT CHECKLIST
[TABLE_START]
| Department | Impact | Action Required |
| Risk Management | [ ] Yes [ ] No | Update FMEA per SOP_Risk_Management |
| Technical File | [ ] Yes [ ] No | Update TD Annex II |
| Clinical Report | [ ] Yes [ ] No | Update CER |
| User Labeling | [ ] Yes [ ] No | Update IFU |
[TABLE_END]

## PHASE 4 — VERIFICATION
- Traceability Matrix ID: TRACE-________________________
- Regression Test: [ ] Passed [ ] Failed [ ] N/A
- Code Review: ________________________

## PHASE 5 — APPROVAL
[TABLE_START]
| Role | Signature | Date |
| R&D | | |
| RA | | |
| QA | | |
| PRRC | | |
[TABLE_END]
    `.trim()
},
// ================== STEP 5.1: SUPPLIER MANAGEMENT ==================
SOP_SUPPLIER_MANAGEMENT: {
    id: 'SOP-010',
    title: '📄 SOP-Supplier_Management.pdf',
    version: '1.0',
    owner: 'Operations / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who evaluates, approves, and monitors external vendors, to maintain the Approved Supplier List (ASL), verify purchased product, and ensure all materials meet regulatory requirements. Covers ISO 13485 §7.4.1, §7.4.2, §7.4.3.

## 2. SCOPE
Applies to all suppliers of materials, components, and services that affect product quality.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Procurement | Identify and initiate supplier evaluation |
| QA | Conduct supplier audits, approve QAA, maintain ASL |
| Operations | Monitor supplier performance (delivery, quality) |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Evaluation | Screen suppliers via questionnaire, audit, or certificate review. Define criteria per supplier type and criticality. | Procurement + QA | Supplier_Evaluation_Form |
| 2-QAA | Establish Quality Assurance Agreement defining quality obligations, change notification, right to audit. | QA | Signed_QAA |
| 3-Approval | Approve supplier and add to ASL. | QA | ASL_Record |
| 4-Purchasing Info | Ensure purchase orders specify requirements, acceptance criteria, and applicable QAA. | Procurement | Purchase_Order |
| 5-Verification | Verify purchased product upon receipt per inspection criteria. | QA | Receiving_Inspection |
| 6-Monitoring | Annual review of supplier performance: delivery, conformity, complaints, audit results. | Operations + QA | Supplier_Scorecard |
| 7-SCAR | Issue Supplier Corrective Action Request for non-conformities. Track to closure. | QA | SCAR_Log |
| 8-Re-evaluation | Re-evaluate supplier status annually. Downgrade or disqualify if criteria not met. | QA | ASL_Update |
[TABLE_END]

## 5. SUPPLIER CLASSIFICATION
[TABLE_START]
| Category | Criteria | Evaluation Required |
| Critical | Affects product safety or performance | On-site audit + QAA |
| Standard | Affects product quality but not safety | Questionnaire + QAA |
| Low Risk | Indirect materials, logistics | Certificate review |
[TABLE_END]

## 6. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 5.2: PRODUCTION CONTROL ==================
SOP_PRODUCTION_CONTROL: {
    id: 'SOP-011',
    title: '📄 SOP-Production_Servicing_and_Preservation.pdf',
    version: '1.0',
    owner: 'Operations / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who controls manufacturing, validates production processes, handles customer property, controls product cleanliness, executes installation and servicing, manages sterile production where applicable, assigns UDI for identification and traceability, and preserves product during handling, storage, and distribution. Covers ISO 13485 §7.5.1-7.5.11.

## 2. SCOPE
Applies to all manufacturing, assembly, packaging, labeling, installation, servicing, and storage activities.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Production Manager | Control production schedules and batch records |
| Operations | Execute production, servicing, and preservation |
| QA | Approve batch release and verify process validations |
| IT | Validate production software and maintain traceability systems |
| Warehouse | Manage inventory, FIFO/FEFO, and environmental controls |
[TABLE_END]

## 4. PART A — PRODUCTION CONTROL (§7.5.1)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Planning | Generate batch record with specifications, BOM, acceptance criteria. | Production Manager | Batch_Record |
| 2-Execution | Execute per work instructions. Document materials, equipment, personnel. | Operations | Production_Log |
| 3-In-Process | Monitor critical parameters. Perform in-process inspections. | QA | IPC_Record |
| 4-Final Inspection | Verify finished product against specifications. | QA | Inspection_Report |
[TABLE_END]

## 5. PART B — CLEANLINESS (§7.5.2)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Requirements | Define cleanliness requirements per product specs. | R&D | Product_Specs |
| 2-Control | Implement cleaning procedures. Verify before assembly/packaging. | Operations | Cleanliness_Log |
[TABLE_END]

## 6. PART C — INSTALLATION (§7.5.3)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Requirements | Define installation requirements and acceptance criteria. | R&D | Installation_Specs |
| 2-Execution | Execute installation per procedure. Verify functionality. | Service Engineer | Installation_Report |
| 3-Verification | Confirm installation meets acceptance criteria. | QA | Installation_Approval |
[TABLE_END]

## 7. PART D — SERVICING (§7.5.4)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Service Request | Receive and log service request. | Customer Service | Service_Ticket |
| 2-Execution | Perform service per procedure. Document actions, parts, test results. | Service Engineer | Service_Report |
| 3-Release | Verify service complete. QA approves return. | QA | Service_Release |
| 4-Analysis | Analyze service data for trends. Feed into PMS. | RA | Service_Trend_Log |
[TABLE_END]

## 8. PART E — STERILIZATION (§7.5.5, §7.5.7)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Validation | Validate sterilization per ISO 11135 (EO) or ISO 11137 (radiation). | Operations + QA | Sterilization_Validation |
| 2-Routine | Monitor critical parameters per batch. Release only after verification. | QA | Sterilization_Log |
[TABLE_END]

## 9. PART F — PROCESS VALIDATION (§7.5.6)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Identify | Identify processes where output cannot be verified by subsequent monitoring. | R&D + QA | Process_List |
| 2-Validate | Execute IQ/OQ/PQ. Define monitoring parameters and acceptance criteria. | Operations + QA | Validation_Protocol |
| 3-Revalidate | Revalidate after changes or at defined intervals. | QA | Revalidation_Report |
[TABLE_END]

## 10. PART G — IDENTIFICATION & TRACEABILITY (§7.5.8, §7.5.9)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Identification | Label product with UDI per MDR Art. 27 and Annex VI. | Operations | Label_Verification |
| 2-Traceability | Document UDI-DI and UDI-PI per batch. Link materials to finished product. | Operations + QA | Traceability_Log |
| 3-UDI Upload | Upload to EUDAMED per SOP_TD_EUDAMED. | RA | Upload_Confirmation |
[TABLE_END]

## 11. PART H — CUSTOMER PROPERTY (§7.5.10)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Receipt | Identify, verify, and protect customer property upon receipt. | Warehouse | Receipt_Record |
| 2-Handling | Maintain integrity. Report loss or damage to customer. | Operations | Incident_Report |
[TABLE_END]

## 12. PART I — PRESERVATION (§7.5.11)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Handling | Use appropriate handling methods to prevent damage. | Warehouse | Handling_Procedure |
| 2-Storage | Control environment (temp, humidity). FIFO/FEFO. | Warehouse | Storage_Log |
| 3-Packaging | Use validated packaging to protect during transport. | Operations | Packaging_Specs |
| 4-Distribution | Ensure transport conditions maintain product integrity. | Logistics | Shipping_Record |
[TABLE_END]

## 13. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 5.3: MEASURING EQUIPMENT ==================
SOP_MEASURING_EQUIPMENT: {
    id: 'SOP-012',
    title: '📄 SOP-Control_of_Monitoring_and_Measuring_Equipment.pdf',
    version: '1.0',
    owner: 'QA / Operations',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who calibrates, verifies, and maintains measuring and test equipment, to ensure valid measurement results for product conformity verification and process validation. Covers ISO 13485 §7.6.

## 2. SCOPE
Applies to all measuring and test equipment used for product verification, process validation, and quality control.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| QA Manager | Maintain calibration schedule and approve equipment for use |
| Operations | Perform or coordinate calibration activities |
| External Provider | Execute certified calibrations per service agreement (ISO 17025 accredited) |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Inventory | Register all equipment with unique ID, location, calibration interval, acceptance criteria. | QA | Equipment_Register.xlsx |
| 2-Schedule | Define calibration intervals based on manufacturer, usage, criticality. | QA | Calibration_Schedule |
| 3-Calibration | Calibrate against traceable standards. Use ISO 17025 accredited providers. | Operations / External | Calibration_Certificate |
| 4-Verification | Verify equipment within specified tolerances. Tag with status and next due date. | QA | Calibration_Label |
| 5-Adjustment | Adjust or repair out-of-tolerance equipment. | Operations | Adjustment_Record |
| 6-NC Assessment | If found out-of-tolerance, assess impact on previous measurements. Initiate CAPA if product conformity affected. | QA | NC_Assessment |
| 7-Records | Maintain calibration records for equipment lifetime. | QA | Calibration_History |
| 8-Software | Validate measurement software per SOP_Doc_Data_Control. | IT + QA | Software_Validation |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 5.4: CUSTOMER PROCESSES ==================
SOP_CUSTOMER_PROCESSES: {
    id: 'SOP-013',
    title: '📄 SOP-Customer_Processes_and_Market_Feedback.pdf',
    version: '1.0',
    owner: 'Operations / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who reviews customer requirements, processes orders, and collects market feedback, to ensure customer needs are met and potential complaints are routed to the complaint handling process. Covers ISO 13485 §7.2.1, §7.2.2, §7.2.3.

## 2. SCOPE
Applies to all customer contracts, orders, and market feedback activities.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Sales / Customer Service | Receive and log inquiries, orders, and feedback |
| QA | Review contracts with regulatory impact |
| RA | Triage feedback for PMS and vigilance relevance |
[TABLE_END]

## 4. PART A — CUSTOMER REQUIREMENTS (§7.2.1, §7.2.2)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Determination | Identify customer requirements including delivery, regulatory, intended use. | Sales | Requirement_Spec |
| 2-Review | Review contract before acceptance. Verify capability to meet requirements. | Sales + QA | Contract_Review |
| 3-Communication | Document and confirm agreed requirements with customer. | Sales | Order_Confirmation |
| 4-Changes | If requirements change, re-review and communicate amendments. | Sales | Amendment_Record |
[TABLE_END]

## 5. PART B — MARKET FEEDBACK (§7.2.3)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Collection | Collect feedback from all channels (email, web, phone, sales). | Customer Service | Feedback_Log |
| 2-Triage | Screen for complaints, adverse events, or product issues. | QA | Triage_Record |
| 3-Routing | Route complaints to SOP_Complaint_Handling. Route safety signals to RA within 24 hours. | QA | Routing_Log |
| 4-Trending | Analyze feedback trends. Feed into PMS and Management Review. | RA + QA | Trend_Report |
[TABLE_END]

## 6. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 6.1: COMPLAINT HANDLING ==================
SOP_COMPLAINT_HANDLING: {
    id: 'SOP-014',
    title: '📄 SOP-Complaint_Handling.pdf',
    version: '1.0',
    owner: 'QA / RA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who receives, logs, investigates, and responds to customer complaints, to ensure timely evaluation of feedback, determination of regulatory reporting requirements, and closure with the complainant. Covers ISO 13485 §8.2.1 and §8.2.2.

## 2. SCOPE
Applies to all complaints from customers, users, distributors, and healthcare professionals regarding CE-marked devices.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Customer Service | Receive and log all complaints within 24 hours |
| QA | Lead investigation and determine corrective actions |
| RA | Evaluate regulatory reportability per MDR Art. 87 |
| PRRC | Review serious complaints and approve regulatory submissions |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Timeline |
| 1-Intake | Receive complaint via any channel. Log with unique ID. | Customer Service | 24 hours |
| 2-Acknowledge | Send acknowledgement to complainant. | Customer Service | 48 hours |
| 3-Triage | Assess severity and relation to product quality/safety. | QA | Immediately |
| 4-Regulatory Screen | Screen for serious incident criteria. If met, escalate to RA per SOP_PMS_Vigilance. | QA + RA | 24 hours |
| 5-Investigation | Conduct root cause analysis. Involve R&D, Production, Suppliers. | QA | Per complexity |
| 6-Response | Provide written response with findings and actions taken. | Customer Service | 30 days |
| 7-CAPA Trigger | If systemic issue identified, initiate CAPA per SOP_Audit_CAPA_Release. | QA | Immediately |
| 8-Closure | Document resolution. Update Complaint Register. | QA | Upon resolution |
[TABLE_END]

## 5. COMPLAINT REGISTER FIELDS
Unique ID | Date received | Complainant | Device identification (UDI/batch) | Complaint description | Investigation summary | Regulatory determination | Response date | Closure status

## 6. REGULATORY REFERENCES
- ISO 13485:2016 §8.2.1 (Feedback), §8.2.2 (Complaint handling)
- MDR 2017/745 Art. 87-90 (Vigilance)
- SOP_PMS_Vigilance (regulatory escalation)

## 7. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 6.2: AUDIT, CAPA & PRODUCT RELEASE ==================
SOP_AUDIT_CAPA_RELEASE: {
    id: 'SOP-015',
    title: '📄 SOP-Audit_CAPA_and_Product_Release.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who plans internal audits, investigates non-conformities with root cause analysis, handles returned products including rework decisions, and authorizes batch release, to execute the annual audit plan, track corrective and preventive actions to closure, and verify product conformity before market release. Covers ISO 13485 §8.2.4, §8.2.6, §8.3.1-8.3.4, §8.5.2, §8.5.3.

## 2. SCOPE
Applies to all internal QMS audits, product batch releases, and NC/CAPA activities.

## 3. PART A — INTERNAL AUDIT (§8.2.4)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Schedule | Annual audit plan covering all QMS processes. | QA Manager | Annual_Audit_Plan |
| 2-Planning | Assign independent auditor. Prepare checklist. | Lead Auditor | Audit_Checklist |
| 3-Execution | Gather objective evidence through interviews, observation, document review. | Auditor | Audit_Notes |
| 4-Findings | Classify as Major NC, Minor NC, or Observation. | Lead Auditor | Finding_Report |
| 5-Report | Issue formal report within 5 working days. | Lead Auditor | Audit_Report |
| 6-Follow-up | Verify corrective actions. Close findings. | Lead Auditor | CAPA_Records |
[TABLE_END]

## 4. PART B — NC & CAPA MANAGEMENT (§8.3, §8.5.2, §8.5.3)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Identify | Document NC from any source (audit, complaint, production, supplier). | Originator | NC_Report |
| 2-Contain | Immediately contain. Segregate affected product. | QA | Containment_Record |
| 3-Assess | Evaluate severity and regulatory impact. Determine NB notification need. | QA + PRRC | NC_Assessment |
| 4-Disposition | Decide: release, rework, reject, or concession. For returns per §8.3.3, assess post-delivery impact. | QA | Disposition_Record |
| 5-Root Cause | Investigate using 5-Why, Fishbone, FMEA. | Investigator | Root_Cause_Analysis |
| 6-CAPA | Define corrective action (fix cause) and preventive action (prevent recurrence). | Investigator | CAPA_Plan |
| 7-Implement | Execute actions within timeline. | Assignee | Action_Log |
| 8-Verify | Check CAPA effectiveness. Close or re-open. | QA | Effectiveness_Check |
[TABLE_END]

## 5. PART C — PRODUCT RELEASE (§8.2.6, MDR Art. 15)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Batch Review | Review batch record completeness. | QA | Batch_Review |
| 2-Testing | Verify all testing completed, within spec. | QA | Test_Results |
| 3-Deviation Check | Verify all deviations investigated and closed. | QA | Deviation_Log |
| 4-PRRC Sign-off | PRRC verifies conformity to MDR. | PRRC | PRRC_Release_Check |
| 5-Release | Authorize batch release via eQMS. | QA | Release_Certificate |
[TABLE_END]

## 6. ESCALATION CRITERIA
- NC with patient safety impact: Notify PRRC within 24 hours
- NC requiring NB notification: Per SOP_NB_Communication
- NC requiring field action: Per SOP_PMS_Vigilance

## 7. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
},

// ================== STEP 6.3: DATA ANALYSIS ==================
SOP_015_DATA_ANALYSIS: {
    id: 'SOP-016',
    title: '📄 SOP-Data_Analysis_and_Trends.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who aggregates quality metrics from audits, complaints, CAPA, PMS, suppliers, and production, and when trend reports are compiled, to evaluate QMS effectiveness and drive continual improvement through data-driven management decisions. Covers ISO 13485 §8.4 and §8.5.1.

## 2. SCOPE
Applies to all QMS performance data including audits, complaints, NCs, CAPAs, PMS, supplier performance, and process monitoring.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| QA | Aggregate data, perform trend analysis, compile reports |
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
| 2-Analysis | Apply statistical methods. Identify trends, patterns, outliers. | QA | Trend_Analysis_Report |
| 3-Evaluation | Compare results against targets and thresholds. Identify adverse trends. | QA | Performance_Dashboard |
| 4-Reporting | Compile quarterly data analysis report for Management Review. | QA | Quarterly_Data_Report |
| 5-Action | Escalate adverse trends to process owner for CAPA initiation. | QA | CAPA_Request |
| 6-Improvement | Drive continual improvement (§8.5.1) through data-driven management decisions. | Top Management | Mgmt_Review_Minutes |
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

// ================== STEP 7.1: TD & EUDAMED ==================
SOP_TD_EUDAMED: {
    id: 'SOP-RA-001',
    title: '📄 SOP-TD_Compilation_and_EUDAMED_Registration.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who compiles the Technical Documentation and who registers devices and economic operators in EUDAMED, to package design outputs into submission-ready format and secure SRN issuance with valid UDI data before NB audits. Covers MDR Annex II, III, Art. 27-31.

## 2. SCOPE
Applies to all TD compilation and EUDAMED/UDI registration activities.

## 3. PART A — TD COMPILATION (MDR Annex II & III)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Initiation | Trigger at Design Freeze. Open TD Index. Assign content owners. | RA | TD_Index.xlsx |
| 2-Collection | Gather deliverables per 7-chapter structure. | Content Owners | Draft documents |
| 3-Review | Cross-functional review for accuracy and alignment. | RA | Review_Log |
| 4-Gap Analysis | Verify GSPR, standards, clinical evidence. | RA | GSPR_Matrix.xlsx |
| 5-PRRC Sign-off | PRRC verifies completeness and conformity. | PRRC | Approval_Record |
| 6-Submission | Transmit to NB or CA. | RA | Transmittal_Letter |
| 7-Maintenance | Update upon changes, new data. Version history. | RA | Change_History_Log |
[TABLE_END]

## 4. PART B — EUDAMED & UDI (MDR Art. 27-31, Annex VI)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Actor Registration | Submit economic operator profile. Obtain SRN. | RA | SRN_Confirmation |
| 2-Basic UDI-DI | Assign per issuing entity rules. | RA | Basic_UDI-DI_Register |
| 3-EMDN Mapping | Select EMDN codes. | RA | EMDN_Assignment |
| 4-Device Registration | Upload device listing to EUDAMED. | RA | Device_Registration |
| 5-UDI-DI/PI | Assign UDI-DI per variant. Integrate into labels. | IT/Labeling | UDI-DI_Log |
| 6-Maintenance | Update within 1 week of changes. Reconfirm every 2 years. | RA | EUDAMED_Update_Log |
[TABLE_END]

## 5. TD STRUCTURE (MDR Annex II & III)
[TABLE_START]
| Chapter | Content | Phase |
| 1 | Device Description, Classification, UDI, PRRC | Pre-Market |
| 2 | Labels, IFU, SSCP (Class III) | Pre-Market |
| 3 | Design Specs, Manufacturing, Suppliers | Pre-Market |
| 4 | GSPR Matrix | Pre-Market |
| 5 | Risk Management File (ISO 14971) | Pre-Market |
| 6 | V&V, CER, Clinical Evidence | Pre-Market |
| 7 | PMS Plan, PMCF Plan, PSUR | Post-Market |
[TABLE_END]

## 6. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | RA |
[TABLE_END]
    `.trim()
},

// ================== STEP 7.2: PMS & VIGILANCE ==================
SOP_PMS_VIGILANCE: {
    id: 'SOP-RA-002',
    title: '📄 SOP-Post_Market_Surveillance_and_Vigilance.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who gathers field performance data and who evaluates and reports serious incidents, to compile PSURs, manage FSCA/FSN, and feed real-world safety data back into risk management and clinical evaluation. Covers MDR Art. 83-92.

## 2. SCOPE
Applies to all CE-marked devices throughout their commercial lifecycle.

## 3. PART A — PMS (MDR Art. 83-86, Annex III)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-PMS Plan | Define data sources, metrics, review frequency. | RA | PMS_Plan.pdf |
| 2-Data Collection | Gather from complaints, vigilance, literature, PMCF. | Cross-functional | PMS_Data_Log.xlsx |
| 3-Analysis | Analyze trends, identify safety signals, evaluate benefit-risk. | RA | PMS_Analysis |
| 4-PSUR | Compile per device class schedule. | RA | PSUR.pdf |
| 5-CAPA Trigger | Initiate corrective actions for identified issues. | QA | CAPA_Request |
| 6-CER Update | Feed PMS findings into CER. | Clinical | CER_Update |
[TABLE_END]

## 4. PSUR SCHEDULE (MDR Art. 86)
[TABLE_START]
| Class I | As needed |
| Class IIa | Every 2 years |
| Class IIb | Annually |
| Class III | Annually |
[TABLE_END]

## 5. PART B — VIGILANCE (MDR Art. 87-92)
[TABLE_START]
| Phase | Actions | Responsible | Timeline |
| 1-Intake | Receive and log incident. Triage for seriousness. | RA | 24 hours |
| 2-Investigation | Root cause analysis. | QA/RA | Immediately |
| 3-Seriousness | Determine if serious incident criteria met. | PRRC + Clinical | 48 hours |
| 4-MIR | Submit Manufacturer Incident Report if serious. | RA | 15 days (2 days if death) |
| 5-FSCA | Determine if Field Safety Corrective Action needed. | PRRC | Immediately |
| 6-FSN | Issue Field Safety Notice to users. | RA | Before/with FSCA |
| 7-Trend | Monitor trends. Submit PSR per CA agreement. | RA | PSR |
| 8-Close-out | Document resolution. Update RMF. | RA | Closure |
[TABLE_END]

## 6. MDR COMPLIANCE SUMMARY
[TABLE_START]
| Requirement | Covered By |
| Art. 83-86 | PMS system, plan, report, PSUR |
| Art. 87-92 | Vigilance, serious incidents, FSCA, FSN, trend reporting |
| Annex III | PMS Technical Documentation |
| Art. 15(3) | PRRC oversight |
[TABLE_END]

## 7. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | RA |
[TABLE_END]
    `.trim()
},

// ================== STEP 7.3: NB COMMUNICATION ==================
SOP_NB_COMMUNICATION: {
    id: 'SOP-RA-003',
    title: '📄 SOP-Notified_Body_Communication.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who selects and contracts the NB and who manages audit logistics and NC responses, to coordinate conformity assessments, maintain valid CE certificates, and ensure timely notification of significant changes. Covers MDR Art. 52, Annex IX.

## 2. SCOPE
Applies to all interactions with Designated Notified Bodies for CE marking, surveillance audits, and certificate maintenance.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Regulatory Affairs | Lead NB selection, manage submissions, coordinate audit responses |
| PRRC | Final approval of submission packages and NB correspondence |
| Top Management | Sign NB contract and authorize audit resources |
| QA | Host QMS audits and provide objective evidence |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Selection | Identify designated NBs via NANDO. Evaluate capabilities, timelines, fees. | RA | NB_Selection_Memo |
| 2-Contracting | Execute NB agreement defining audit scope, schedule, confidentiality. | Top Management | NB_Contract |
| 3-Submission | Compile and transmit QMS and TD documentation per audit plan. | RA | Submission_Dossier |
| 4-Audit | Coordinate on-site or remote audit. Ensure subject matter experts available. | QA/RA | Audit_Agenda |
| 5-NC Response | Respond to non-conformities within deadline. Submit CAPA and evidence. | RA | NC_Response |
| 6-Certificate | Receive and archive certificates. Log validity periods. | RA | Certificate_Register |
| 7-Surveillance | Schedule annual audits. Notify NB of significant changes per Annex IX 4.10. | RA | Surveillance_Plan |
| 8-Renewal | Initiate renewal 6 months before expiry. | RA | Renewal_Application |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | RA |
[TABLE_END]
    `.trim()
},

// ================== STEP 7.4: REGULATORY INTELLIGENCE ==================
SOP_REGULATORY_INTELLIGENCE: {
    id: 'SOP-RA-004',
    title: '📄 SOP-Regulatory_Intelligence_and_CA_Interaction.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define who monitors regulatory changes and who handles competent authority queries, to stay current with MDCG updates and standard revisions, and to manage Helsinki Procedure submissions and unannounced audits.

## 2. SCOPE
Applies to all regulatory horizon scanning and CA communication activities.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Regulatory Affairs | Monitor regulatory landscape, manage CA interactions |
| PRRC | Review regulatory intelligence, approve CA correspondence |
| QA | Implement QMS changes resulting from new requirements |
[TABLE_END]

## 4. PART A — REGULATORY INTELLIGENCE
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Horizon Scanning | Monitor EU Commission, MDCG, NBs, standards bodies weekly. | RA | Intel_Log.xlsx |
| 2-Assessment | Evaluate impact of changes on QMS, TD, product portfolio. | RA | Impact_Assessment |
| 3-Dissemination | Brief PRRC and affected departments. Schedule implementation. | RA | Briefing_Record |
| 4-Implementation | Update QMS documents, SOPs, and TD per new requirements. | QA/RA | Change_Records |
| 5-Training | Train personnel on new regulatory requirements. | RA | Training_Record |
[TABLE_END]

## 5. PART B — COMPETENT AUTHORITY INTERACTION
[TABLE_START]
| Phase | Actions | Responsible | Timeline |
| 1-Receive | Log any CA communication (query, request, inspection notice). | RA | 24 hours |
| 2-Assess | Determine scope, urgency, required response. | PRRC + RA | Immediately |
| 3-Respond | Prepare and submit response. PRRC approval required. | RA | Per CA deadline |
| 4-Inspection | Host announced/unannounced CA audits. Provide documentation. | RA + QA | Audit_Record |
| 5-Helsinki | Initiate Helsinki Procedure for borderline/classification queries. | RA | Submission_Dossier |
| 6-Close-out | Document resolution. Update QMS if needed. | RA | Closure_Record |
[TABLE_END]

## 6. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | RA |
[TABLE_END]
    `.trim()
},

// ================== MALLAR ==================
RISK_PLAN: {
    id: 'TMP-006A',
    title: '📝 TMP-Risk_Management_Plan.docx',
    version: '1.0',
    owner: 'QA / CTO',
    content: `
## 1. SCOPE
This plan defines risk acceptability criteria and risk management activities for [product name] across all lifecycle phases.

## 2. RESPONSIBILITIES
[TABLE_START]
| Role | Responsibility | Competence |
| QA | Risk process owner | ISO 14971 Lead |
| CMO | Clinical risk evaluation | MD with 10 years practice |
| CTO | Technical hazard analysis | MSc Biomedical Engineering |
[TABLE_END]

## 3. RISK MATRIX
Based on Severity (1-5) × Probability (1-5). Score range 1-25.
[TABLE_START]
| Score | Region | Action |
| 1-6 | Acceptable | No further controls |
| 8-25 | Unacceptable | Design mitigations mandatory |
[TABLE_END]

## 4. VERIFICATION
All risk controls implemented in code must undergo 100% automated regression testing. Residual risk evaluation frozen before production merge.

## 5. SIGN-OFF
[TABLE_START]
| Rev. | Date | Description | Author | Approver |
| 1.0 | 2026-05-25 | Initial Risk Plan | QA | CTO, QA Manager |
[TABLE_END]
    `.trim()
},

FMEA_MATRIX: {
    id: 'TMP-006B',
    title: '📝 TMP-FMEA_Matrix.xlsx',
    version: '1.0',
    owner: 'Risk Team / R&D',
    content: `
# FAILURE MODES AND EFFECTS ANALYSIS (FMEA) MATRIX

## 1. PRE-CONTROL RISK ANALYSIS
Identify failure mode, assign Severity (1-5) and Probability (1-5). Multiply for Initial Risk Score.

[TABLE_START]
| System ID | Failure Mode | Effect | S | Cause | P | Score | Acceptability |
| REQ-___ | [Software failure] | [Clinical consequence] | _ | [Root cause] | _ | __ | Acceptable/Unacceptable |
[TABLE_END]

## 2. RISK CONTROL INTEGRATION
If Initial Score ≥ 8, define and code design controls.

[TABLE_START]
| System ID | Hazard | Mitigation Strategy | Code Commit | Test Protocol | Status |
| REQ-___ | [Ref] | [Control measure] | github.com/___ | TEST-___ | Passed/Failed |
[TABLE_END]

## 3. RESIDUAL RISK EVALUATION
[TABLE_START]
| System ID | Post-Control S | Post-Control P | Residual Score | Final Acceptability | Traceability ID |
| REQ-___ | _ | _ | __ | Acceptable/STOP | TRACE-___ |
[TABLE_END]

## 4. TEMPLATE CONTROL
[TABLE_START]
| Rev. | Date | Description | Author | Approver |
| 1.0 | 2026-05-21 | Initial release | QA | QA Manager, CTO |
[TABLE_END]
    `.trim()
},

TMP_RISK_REPORT: {
    id: 'TMP-006C',
    title: '📝 TMP-Risk_Management_Report.docx',
    version: '1.0',
    owner: 'QA Manager / PRRC',
    content: `
# RISK MANAGEMENT REPORT — RELEASE AUTHORIZATION

## 1. EXECUTIVE SUMMARY
The Risk Management Plan has been executed for the current version. All identified hazards have been mitigated, and the overall residual risk profile is acceptable. Clinical benefits outweigh residual risks.

## 2. RISK REGISTRATION SUMMARY
[TABLE_START]
| Metric | Value | Status |
| Total Hazards Identified | 42 | Logged in FMEA |
| Pre-Mitigation Unacceptable Risks | 18 | High S or P |
| Implemented Mitigations | 18 | Hard-coded |
| Verified Controls | 18 | 100% pass |
| Post-Mitigation Unacceptable Risks | 0 | All acceptable |
[TABLE_END]

## 3. OVERALL RESIDUAL RISK EVALUATION
The Risk Team and Chief Medical Officer confirm that clinical benefits of the device significantly outweigh remaining residual technical risks.

## 4. SIGN-OFF
[TABLE_START]
| Role | Signature | Date |
| QA Manager | Digitally Signed | |
| PRRC | Digitally Signed | |
| CTO | Digitally Signed | |
[TABLE_END]
    `.trim()
},

CEP: {
    id: 'TMP-007A',
    title: '📝 TMP-Clinical_Evaluation_Plan.docx',
    version: '1.0',
    owner: 'Product Manager / RA',
    content: `
# CLINICAL EVALUATION PLAN (CEP)

## 1. PURPOSE
This document defines the clinical evaluation strategy, clinical development milestones, and data collection methodologies for the device to demonstrate conformity with MDR 2017/745 GSPR.

## 2. SCOPE
Applies to pre-market clinical evaluation planning prior to commercial release or major modification.

## 3. RESPONSIBILITY
[TABLE_START]
| Role | Responsibility |
| Product Manager | Complete product data, document clinical claims, align timelines |
| Clinical Expert | Establish clinical benchmarks, endpoints, and medical rationale |
| RA | Verify GSPR mapping, validate regulatory pathways |
| QA | Ensure integration with Risk File, approve final plan |
[TABLE_END]

## 4. LITERATURE SEARCH PROCESS
[To be defined per device]

## 5. CLINICAL CLAIMS
[To be defined per device]

## 6. GSPR MAPPING
[Clinical claims mapped to Annex I GSPR]

## 7. DATA SOURCES & GAP ANALYSIS
[To be completed per device]

## 8. PMCF STRATEGY
[To be defined per device class and novelty]

## 9. SIGN-OFF
[TABLE_START]
| Role | Name | Signature | Date |
| Product Manager | | | |
| Clinical Expert | | | |
| RA | | | |
| QA | | | |
[TABLE_END]
    `.trim()
}

};