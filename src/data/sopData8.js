/**
 * @file sopData8.js
 * @description Regulatory Affairs SOPs - Step 8
 * Ägare: Regulatory Affairs / PRRC
 */

export const SOP_DATA8 = {

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