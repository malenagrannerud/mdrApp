/**
 * @file sopData.js
 * 
 */


export const SOP_DATA = {

// ================== NYA KONSOLIDERADE SOP:er ==================

SOP_DOC_DATA_CONTROL: {
    id: 'SOP-001',
    title: '📄 SOP-Document_and_Data_Control.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to consolidate three interconnected documentation and data integrity processes into a single controlled document: (a) Software Validation — validates eQMS and automated tools per ISO 13485 §4.1.6; (b) Document Control — ensures only approved, current document revisions are available per §4.2.4; (c) Data Integrity & Backup — verifies automated system backups for full business recovery per §4.2.5. 
Consolidated because all three share the same owner (QA) and are audited together.

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
| 1.0 | 2026-06-24 | Initial release — consolidates SOP_SW_VAL, SOP_DOC_CONTROL, SOP_BACKUP_RESTORE | QA |
[TABLE_END]
    `.trim()
},

// --- Step 4: Ersätter SOP_CHANGE_CONTROL + nytt Design Transfer-innehåll ---
SOP_DESIGN_TRANSFER_CHANGE: {
    id: 'SOP-007',
    title: '📄 SOP-Design_Transfer_and_Change_Control.pdf',
    version: '1.0',
    owner: 'R&D / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to consolidate two linked design processes: (a) Design Transfer — ensures design outputs are properly translated to production specifications per ISO 13485 §7.3.8; (b) Design Change Control — defines who reviews modifications and when changes are approved post-launch per §7.3.9. Consolidated because changes often span both design and production.

## 2. SCOPE
Applies to all design transfers to production and all post-release design changes.

## 3. PART A — DESIGN TRANSFER (§7.3.8)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Transfer Plan | Define transfer milestones, acceptance criteria, and production validation requirements. | R&D + Operations | Transfer_Plan.pdf |
| 2-Production Specs | Translate design outputs into production specifications, work instructions, and test protocols. | R&D | Production_Specifications |
| 3-Supplier Onboarding | Qualify suppliers for transferred components per SOP_Supplier_Production. | Operations | ASL_Update |
| 4-First Article | Execute first production run. Verify output matches design specifications. | R&D + QA | First_Article_Report |
| 5-Transfer Sign-off | QA verifies all transfer criteria met. PRRC approves. | QA + PRRC | Transfer_Approval |
[TABLE_END]

## 4. PART B — DESIGN CHANGE CONTROL (§7.3.9, MDCG 2020-3)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Initiation | Create Change Request (CR) ticket. Complete impact assessment. | Initiator | CR_Form.docx |
| 2-Assessment | Run regulatory impact matrix (MDCG 2020-3). Evaluate risk impact via FMEA. | R&D + RA | Impact_Assessment |
| 3-CCB Review | Convene Change Control Board. PRRC signs off on compliance. | CCB + PRRC | CCB_Minutes |
| 4-Execution | Implement change in separate branch. Update TD components. | R&D | Updated_TD |
| 5-Verification | Run automated regression testing. Verify traceability. | QA | Test_Report |
| 6-Closure | Close CR ticket. Notify NB if significant change per Annex IX 4.10. | RA | CR_Closed |
[TABLE_END]

## 5. REGULATORY CLASSIFICATION (MDCG 2020-3)
A change is SIGNIFICANT (requires NB approval) if it alters: intended purpose, clinical logic/algorithm, user interface for critical data, operating environment, or introduces new hazards.

## 6. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release — consolidates design transfer and change control | QA |
[TABLE_END]
    `.trim()
},

// --- Step 5: Ersätter SOP_008_SUPPLIER_MANAGEMENT + SOP_PRODUCTION_UDI ---
SOP_SUPPLIER_PRODUCTION: {
    id: 'SOP-008',
    title: '📄 SOP-Supplier_and_Production_Control.pdf',
    version: '1.0',
    owner: 'Operations / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to consolidate three operational processes: (a) Purchasing & Supplier Control — evaluates vendors and maintains the ASL per ISO 13485 §7.4; (b) Supplier Evaluation — qualifies new suppliers through audits and monitoring; (c) Production, Servicing & UDI Traceability — controls manufacturing batches and secures device traceability per §7.5-7.6. Consolidated because supplier quality directly impacts production quality.

## 2. SCOPE
Applies to all supplier selection, purchasing, production, and UDI activities.

## 3. PART A — SUPPLIER MANAGEMENT (§7.4)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Evaluation | Screen suppliers via questionnaires, audits, certificate reviews. | Procurement + QA | Evaluation_Form |
| 2-Approval | Establish Quality Assurance Agreement (QAA). | QA | Signed_QAA |
| 3-Register | Log qualified supplier in Approved Supplier List (ASL). | QA | ASL_Record |
| 4-Monitoring | Annual review of delivery, conformity, certificate validity. | Operations + QA | Supplier_Audit_Report |
| 5-Supplier CAPA | Issue SCAR for non-conforming supplies. Track to closure. | QA | SCAR_Log |
[TABLE_END]

## 4. PART B — PRODUCTION & UDI TRACEABILITY (§7.5, §7.6, MDR Art. 27)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Production Planning | Generate batch records with UDI-DI and UDI-PI. | Production Manager | Batch_Record |
| 2-Assembly | Execute per work instructions. Document materials. | Production | Assembly_Log |
| 3-Labeling | Apply UDI label (AIDC + Human Readable). Verify. | Production | Label_Verification |
| 4-Inspection | In-process and final inspection per criteria. | QA | Inspection_Report |
| 5-Batch Release | QA reviews batch records. PRRC verifies conformity. | QA + PRRC | Release_Certificate |
| 6-UDI Upload | Upload to EUDAMED per SOP_TD_EUDAMED. | RA | Upload_Confirmation |
| 7-Servicing | Execute and document servicing. Verify no unintended changes. | Production | Service_Report |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]
| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release — consolidates supplier management and production/UDI | QA |
[TABLE_END]
    `.trim()
},

// --- Step 6: Ersätter SOP_013_AUDITS_AND_RELEASE + SOP_014_NC_CAPA_MANAGEMENT ---
SOP_AUDIT_CAPA_RELEASE: {
    id: 'SOP-009',
    title: '📄 SOP-Audit_CAPA_and_Product_Release.pdf',
    version: '1.0',
    owner: 'QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to consolidate three interconnected quality processes: (a) Internal Audit — plans and conducts annual QMS audits per ISO 13485 §8.2.4; (b) Product Release — verifies batch conformity per §8.2.6 with PRRC oversight; (c) NC & CAPA Management — logs non-conformities and tracks corrective/preventive actions per §8.3, §8.5.2-8.5.3. Consolidated because audit findings feed CAPA, and CAPA effectiveness is verified at product release.

## 2. SCOPE
Applies to all internal audits, product batch releases, and NC/CAPA activities.

## 3. PART A — INTERNAL AUDIT (§8.2.4)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Schedule | Annual audit plan covering all QMS processes. | QA Manager | Annual_Audit_Plan |
| 2-Planning | Assign independent auditor. Prepare checklist. | Lead Auditor | Audit_Checklist |
| 3-Execution | Gather objective evidence. | Auditor | Audit_Notes |
| 4-Findings | Classify as Major NC, Minor NC, or Observation. | Lead Auditor | Finding_Report |
| 5-Report | Issue formal report within 5 working days. | Lead Auditor | Audit_Report |
| 6-Follow-up | Verify corrective actions. | Lead Auditor | CAPA_Records |
[TABLE_END]

## 4. PART B — NC & CAPA MANAGEMENT (§8.3, §8.5.2, §8.5.3)
[TABLE_START]
| Phase | Actions | Responsible | Record |
| 1-Identify | Document NC from any source. | Originator | NC_Report |
| 2-Contain | Immediately contain. Segregate affected product. | QA | Containment_Record |
| 3-Assess | Evaluate severity and regulatory impact. | QA + PRRC | NC_Assessment |
| 4-Root Cause | Investigate using 5-Why, Fishbone, FMEA. | Investigator | Root_Cause_Analysis |
| 5-CAPA | Define corrective and preventive actions. | Investigator | CAPA_Plan |
| 6-Implement | Execute actions within timeline. | Assignee | Action_Log |
| 7-Verify | Check CAPA effectiveness. Close or re-open. | QA | Effectiveness_Check |
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
| 1.0 | 2026-06-24 | Initial release — consolidates audit, CAPA, and product release | QA |
[TABLE_END]
    `.trim()
},

// --- Step 7.1: Ersätter SOP_TD_COMPILATION + SOP_EUDAMED_UDI ---
SOP_TD_EUDAMED: {
    id: 'SOP-RA-001',
    title: '📄 SOP-TD_Compilation_and_EUDAMED_Registration.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to consolidate two submission-related processes: (a) TD Compilation — packages design outputs into submission-ready format per MDR Annex II & III; (b) EUDAMED & UDI Registration — registers economic operators and devices, assigns Basic UDI-DI and UDI-DI per MDR Art. 27-31. Consolidated because both are submission prerequisites handled by the same RA team.

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
| 1.0 | 2026-06-24 | Initial release — consolidates TD compilation and EUDAMED/UDI | RA |
[TABLE_END]
    `.trim()
},

// --- Step 7.2: Ersätter SOP_PMS + SOP_VIGILANCE ---
SOP_PMS_VIGILANCE: {
    id: 'SOP-RA-002',
    title: '📄 SOP-Post_Market_Surveillance_and_Vigilance.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to consolidate two post-market processes: (a) PMS — gathers field data, compiles PSUR per MDR Art. 83-86; (b) Vigilance — evaluates incidents, reports serious incidents within 15 days per MDR Art. 87-92. Consolidated because both share data sources (complaints, feedback, literature) and are audited together.

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
| 1.0 | 2026-06-24 | Initial release — consolidates PMS and Vigilance | RA |
[TABLE_END]
    `.trim()
},

// --- Step 7.4: Ny ---
SOP_REGULATORY_INTELLIGENCE: {
    id: 'SOP-RA-004',
    title: '📄 SOP-Regulatory_Intelligence_and_CA_Interaction.pdf',
    version: '1.0',
    owner: 'Regulatory Affairs',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for monitoring regulatory changes (MDCG updates, standard revisions, new legislation) and managing competent authority interactions (Helsinki Procedure, registration queries, unannounced audits).

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
| 1-Horizon Scanning | Monitor EU Commission, MDCG, NBs, and standard bodies weekly. | RA | Intel_Log.xlsx |
| 2-Assessment | Evaluate impact of changes on QMS, TD, and product portfolio. | RA | Impact_Assessment |
| 3-Dissemination | Brief PRRC and affected departments. Schedule implementation. | RA | Briefing_Record |
| 4-Implementation | Update QMS documents, SOPs, and TD per new requirements. | QA/RA | Change_Records |
| 5-Training | Train personnel on new regulatory requirements. | RA | Training_Record |
[TABLE_END]

## 5. PART B — COMPETENT AUTHORITY INTERACTION
[TABLE_START]
| Phase | Actions | Responsible | Timeline |
| 1-Receive | Log any CA communication (query, request, inspection notice). | RA | 24 hours |
| 2-Assess | Determine scope, urgency, and required response. | PRRC + RA | Immediately |
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
}
}; 








