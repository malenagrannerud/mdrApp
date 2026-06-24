
/**
 * 
 * 
 * @file sopData6.js
 * 
 * 
 * 
 */

export const SOP_DATA6 = {

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
  }




};

