/**
 * @file sopData.js
 * 
 */


export const SOP_DATA1 = {

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
  }

}








