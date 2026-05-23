
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
    title: 'SOP-008_Supplier_Management.pdf', 
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
    title: 'SOP-011_Customer_Processes.pdf', 
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
    title: 'SOP-012_Production_and_Traceability.pdf', 
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
  }
};

