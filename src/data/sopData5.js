import swAsmdImage from '../assets/sw_asmd.png';

export const SOP_DATA5 = {

/*******************  SOP 006 - DESIGN CONTROL (5.1) *******************/
  SOP_006_DESIGN_CONTROL: {
    id: 'SOP-006', 
    title: 'SOP-006_Design_Control.pdf', 
    version: '1.0', 
    owner: 'CTO / R&D Manager',
    image: swAsmdImage,
    content: `
## 1. PURPOSE
The purpose of this SOP is to establish, document, and maintain a controlled system for the design and development of medical devices to meet, and.

## 2. SCOPE
Applies to all new product development and design changes conducted by the organization.

## 3. DEFINITIONS & ABBREVIATIONS
User Requirements Specification (URS): Document defining what the user needs from the device
Design History File (DHF): Compilation of records proving the design was controlled and verified
Design Review: Formal milestone to evaluate design compliance before proceeding
Design Transfer: Process of translating development outputs into final manufacturing specifications
Verification: Evaluation confirming that design outputs meet the specified design input requirements
Validation: Evaluation confirming that the device meets user needs and its intended use

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Product Manager | Gather user needs, safety inputs, and establish the URS | MDR Annex I (GSPR) |
| Technical Engineer | Generate technical outputs, execute protocols, and compile DHF assets | ISO 13485 §7.3.4 |
| CTO / R&D Manager | Authorize design plans, chair formal reviews, and oversee development phases | ISO 13485 §7.3.1 |
| QA Manager | Maintain design control compliance, approve protocols, and release DHF records | ISO 13485 §4.2.4 |
| PRRC | Verify that validation testing meets safety and compliance benchmarks before launch | MDR Article 15 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. PLANNING ⬇️ | Establish a Design Plan defining phases, reviews, milestones, and regulatory benchmarks. | CTO / R&D Manager | Approved Design Plan |
| 2. INPUT ⬇️ | Compile user inputs, safety requirements, and applicable regulations into a formal URS. | Product Manager | Approved URS |
| 3. OUTPUT ⬇️ | Generate drawings and technical specifications. Verify that outputs match input criteria. | Technical Engineer | Verified Specs / DHF Index |
| 4. REVIEW ⬇️ | Conduct formal milestones to evaluate design compliance and resolve open issues. | CTO & QA Manager | Signed Design Review Record |
| 5. VERIFICATION ⬇️ | Generate protocols, execute engineering tests or inspections, and document compliance data. | Technical Engineer | Approved Verification Report |
| 6. VALIDATION ⬇️ | Conduct usability, performance, or clinical testing with representative users under real use conditions. | Clinical Team & PRRC | Approved Validation Report |
| 7. TRANSFER ⬇️ | Translate design outputs into definitive production specifications and work instructions. Train staff. | Production Manager | Approved Production Spec / Training Records |
| 8. CHANGES | Evaluate, track, and execute design modifications according to established change parameters. | CTO / R&D Manager | Logged CR File |
[TABLE_END]

## 6. DESIGN HISTORY FILE (DHF)
The DHF shall be maintained for each product lifecycle and contain: Design Plan, URS, Technical Specifications, Design Review Records, Verification Plans & Reports, Validation Plans & Reports, Risk Files, Change Logs, and the GSPR Checklist.

## 7. MDR COMPLIANCE SUMMARY
[TABLE_START]

| MDR Requirement | Covered By |
| Annex I GSPR 1-9 | Input, Verification, and Validation phases |
| Annex II §3 | Design History File (DHF) Structure |
| Article 10(1) | This entire SOP |
| Article 10(4) | Output phase |
| Article 10(9) | This SOP |
| Annex IX §4.10 / Annex X §5.2 | Changes phase |
[TABLE_END]

## 8. REFERENCES ISO 13485:2016, Section 7.3 - Design and Development MDR Annex I - General Safety and Performance Requirements (GSPR) MDR Annex II §3 - Technical Documentation – Design and Manufacturing Information MDR Article 10(1), 10(4), 10(9) - General Obligations of Manufacturers MDR Annex IX §4.10 - Changes to Approved Design (NB Notification) MDR Annex X §5.2 - Changes to Approved Design (Type Examination)

## 9. APPENDICES
TMP-DHF-Index: DHF contents checklist
TMP-Design-Review: Design Review Record template
TMP-URS: User Requirements Specification template

## 10. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

/*******************  SOP 007 - RISK MANAGEMENT (5.2) *******************/
  SOP_007_RISK_MANAGEMENT: {
    id: 'SOP-007', 
    title: 'SOP-007_Risk_Management.pdf', 
    version: '1.0', 
    owner: 'CTO / R&D Manager',
    image: swAsmdImage,
    content: `
## 1. PURPOSE
The purpose of this SOP is to establish, document, and maintain a continuous risk management system throughout the product lifecycle to meet,, and.

## 2. SCOPE
Applies to all lifecycle stages of medical devices managed by the organization, from concept to post-market surveillance.

## 3. DEFINITIONS & ABBREVIATIONS
As Low As Reasonably Practicable (ALARP)
Failure Mode and Effects Analysis (FMEA)
Risk Management File (RMF): Systematic compilation of risk records for a specific device
Hazard: Potential source of harm to patient, user, or environment
Risk Evaluation: Comparison of estimated risk against given risk acceptability criteria
Risk Control: Process in which decisions are made and measures implemented to reduce risks

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Top Management | Define risk acceptability policy and provide adequate resources | ISO 14971 §4.2 |
| Technical Engineer | Identify technical hazards, implement controls, and execute testing | ISO 14971 §7.1 |
| Risk Team | Conduct multi-disciplinary risk evaluations and maintain the FMEA matrix | ISO 14971 §4.4 |
| PRRC | Verify that the overall residual risk profile is acceptable under MDR | MDR Article 15 |
| QA Manager | Audit the risk process, approve plans, and release the final Risk Report | ISO 13485 §4.1.3 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. PLANNING ⬇️ | Create a Risk Management Plan defining the scope, responsibilities, and criteria for risk acceptability. | CTO & QA Manager | Approved Risk Plan |
| 2. ANALYSIS ⬇️ | Identify known and predictable hazards under normal and fault conditions. Document in FMEA. | Risk Team | Active FMEA Matrix |
| 3. EVALUATION ⬇️ | Score each hazard based on severity and probability to determine if risk control is required. | Risk Team | Evaluated FMEA Record |
| 4. CONTROL ⬇️ | Implement risk mitigation measures (design safety, protective measures, or safety information). | Technical Engineer | Verified Risk Controls |
| 5. RESIDUAL RISK ⬇️ | Evaluate overall residual risk profile. Ensure all individual risks are within acceptable criteria. | Risk Team & PRRC | Residual Risk Review |
| 6. CLOSURE | Compile and sign the Risk Management Report confirming plan objectives are achieved. | QA Manager | Approved Risk Report / RMF |
[TABLE_END]

## 6. REFERENCES ISO 14971:2019 - Application of Risk Management to Medical Devices MDR Annex I (GSPR 1-9) - General Safety and Performance Requirements MDR Article 10(2) - General Obligations (Risk Management System) EN 62366-1:2015 - Application of Usability Engineering to Medical Devices

## 7. APPENDICES
TMP-Risk-Plan: Risk Management Plan template
TMP-FMEA-Matrix: Risk Analysis spreadsheet layout
TMP-Risk-Report: Risk Management Report template

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

/*******************  SOP 008 - SUPPLIER MANAGEMENT (5.3) *******************/
  SOP_008_SUPPLIER_MANAGEMENT: {
    id: 'SOP-008', 
    title: 'SOP-008_Supplier_Management.pdf', 
    version: '1.0', 
    owner: 'Operations Manager',
    image: swAsmdImage,
    content: `
## 1. PURPOSE
The purpose of this SOP is to establish a controlled process for the evaluation, approval, qualification, and monitoring of suppliers to meet and.

## 2. SCOPE
Applies to all procurement of critical components, materials, or services that directly impact medical device quality or QMS compliance status.

## 3. DEFINITIONS & ABBREVIATIONS
Approved Supplier List (ASL): Official register of suppliers authorized to provide critical assets
Quality Assurance Agreement (QAA): Contract defining specific quality obligations between parties
Critical Supplier: A supplier providing items that affect product safety, performance, or legal conformity

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Procurement | Conduct market research, handle initial contact, and manage purchasing logs | ISO 13485 §7.4.1 |
| Operations Manager | Evaluate technical capability, review capacity, and coordinate active workflows | ISO 13485 §7.4.2 |
| QA Manager | Execute quality audits, review certifications, approve QAAs, and maintain the ASL | ISO 13485 §4.1.3 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. EVALUATION ⬇️ | Screen prospective suppliers via questionnaires, quality audits, or certificate reviews. | Procurement & QA | Completed Evaluation Form |
| 2. APPROVAL ⬇️ | Establish a formal Quality Assurance Agreement (QAA) mapping compliance expectations. | QA Manager | Signed QAA Contract |
| 3. REGISTER ⬇️ | Log the qualified entity into the controlled Master Register of authorized suppliers. | QA Manager | Updated ASL Record |
| 4. EXECUTION ⬇️ | Place orders exclusively with active, approved suppliers using approved procurement logs. | Procurement Team | Authorized Purchase Order |
| 5. MONITORING | Conduct annual reviews of delivery accuracy, item conformity, and certificate validity. | Operations & QA | Supplier Audit Report |
[TABLE_END]

## 6. REFERENCES ISO 13485:2016, Section 7.4 - Purchasing Control MDR Article 10(9) - Quality Management System structure

## 7. APPENDICES
TMP-Supplier-Audit: Evaluation questionnaire layout
TMP-QAA-Template: Quality Assurance Agreement baseline
REG-ASL-Index: Approved Supplier List master template

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

/*******************  SOP 009 - CLINICAL EVALUATION (5.4) *******************/
  SOP_009_CLINICAL_EVALUATION: {
    id: 'SOP-009', 
    title: 'SOP-009_Clinical_Evaluation.pdf', 
    version: '1.0', 
    owner: 'RA Manager',
    image: swAsmdImage,
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for conducting and documenting clinical evaluations to prove safety and performance to meet,, and.

## 2. SCOPE
Applies to the continuous assessment of clinical data for all medical devices manufactured by the organization across their entire lifecycle.

## 3. DEFINITIONS & ABBREVIATIONS
Clinical Evaluation Plan (CEP): Document outlining the strategy, criteria, and methods for clinical evaluation
Clinical Evaluation Report (CER): Document compiling clinical data and evaluation results proving conformity
Equivalent Device: A device that shares identical intended use, technical criteria, and biological components
Clinical Data: Information concerning safety or performance generated from actual clinical use of a device

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Medical Expert | Analyze clinical studies, evaluate literature profiles, and write appraisal text | MDR Annex XIV Part A |
| RA Manager | Compile regulatory inputs, define equivalent baselines, and author the CEP | MDR Article 10(1) |
| PRRC | Review evaluation findings and verify compliance metrics prior to release | MDR Article 15 |
| QA Manager | Release the finalized CER into the Technical Documentation architecture | ISO 13485 §4.2.4 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. STRATEGY ⬇️ | Establish a Clinical Evaluation Plan (CEP) defining scope, benchmarks, and data search criteria. | RA Manager | Approved CEP Document |
| 2. SEARCH ⬇️ | Conduct systematic literature reviews, clinical database searches, and screen clinical field logs. | Medical Expert | Logged Search Queries |
| 3. APPRAISAL ⬇️ | Evaluate retrieved data packages for methodological soundness, scientific weight, and relevance. | Medical Expert | Signed Data Appraisal Sheet |
| 4. ANALYSIS ⬇️ | Analyze data against criteria to prove device safety, clinical performance, and benefit-risk ratios. | Medical Expert & RA | Formulated CER Draft |
| 5. RELEASING | Cross-functional review of the CER. Final sign-off by the PRRC and structural archiving. | PRRC & QA Manager | Approved CER / TD Update |
[TABLE_END]

## 6. REFERENCES MDR Article 61 - Clinical Evaluation MDR Annex XIV Part A - Clinical Evaluation Plan and Report MEDDEV 2.7/1 Rev. 4 - Clinical Evaluation Guide for Manufacturers ISO 14155:2020 - Clinical Investigation of Medical Devices

## 7. APPENDICES
TMP-CEP-Layout: Clinical Evaluation Plan framework
TMP-CER-Report: Clinical Evaluation Report master template

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },

/*******************  SOP 010 - CHANGE CONTROL (5.5) *******************/
  SOP_010_CHANGE_CONTROL: {
    id: 'SOP-010', 
    title: 'SOP-010_Change_Control.pdf', 
    version: '1.0', 
    owner: 'QA Manager',
    image: swAsmdImage,
    content: `
## 1. PURPOSE
This SOP defines how changes to products, processes, and QMS are initiated, assessed, approved, implemented and verified to meet, and.

## 2. SCOPE
Applies to all changes affecting: Product design or specifications, Manufacturing processes, 
Suppliers of critical materials, Software (device or QMS), QMS processes and documentation

## 3. DEFINITIONS & ABBREVIATIONS
EU Medical Device Regulation 2017/745 (MDR)
Change Request (CR): Formal document to propose a change
Change Initiator: Any employee who identifies the need for change and submits CR
Impact Assessment: Evaluation of how proposed change affects design, risk, regulatory status, suppliers, QMS

## 4. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility | Regulatory Compliance |
| Change Initiator | Identify issue and submit CR | ISO 13485 §4.2.4 |
| R&D Manager | Assess technical impact on product design, source code and architecture | ISO 13485 §7.3.7 |
| RA Manager | Evaluate regulatory impact and determine if change is significant | MDR Annex IX §4.10 |
| QA Manager | Review impact assessment, final approval of CR and verify implementation | ISO 13485 §4.2.4 |
| PRRC | Ensure change maintains compliance with MDR before release | MDR Article 15 |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Evidence |
| 1. INITIATION ⬇️ | Complete the CR form. | Change Initiator | Submitted CR Form |
| 2. ASSESSMENT ⬇️ | Evaluate impact and classify change significance using risk criteria. Assess regulatory and QMS impacts. | R&D & RA Manager | Approved Impact Assessment |
| 3. APPROVAL ⬇️ | Conduct cross-functional review of the assessment. PRRC signs off on MDR compliance status. QA formally approves or rejects the CR. | PRRC & QA | QA Approval / NB Record (if Significant) |
| 4. EXECUTION ⬇️ | Execute change. Update TD. Train affected personnel on the new version. | R&D & Production | Updated TD & Training Records |
| 5. CLOSURE | Run full regression testing. Update DHF and RMF. QA reviews evidence and closes the CR. | R&D & QA Manager | Closed CR & Updated DHF / RMF |
[TABLE_END]

## 6. REFERENCES 
ISO 13485:2016, Section 7.3.7  
MDR Annex IX §4.10  
MDR Annex X §5.2

## 7. APPENDICES
TMP-Change-Request: CR form
TMP-Change-Log: Change history log

## 8. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  }
};
