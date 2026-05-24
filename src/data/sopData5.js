import swAsmdImage from '../assets/sw_asmd.png';

export const SOP_DATA5 = {

/*******************************  SOP 006 - ***********************************/
  SOP_006_DESIGN_CONTROL: {
    id: 'SOP-006', 
    title: 'Design_Control.pdf', 
    version: '1.0', 
    owner: 'R&D',
    content: `
## 1. PURPOSE
The purpose of this SOP is to establish, document, and maintain a controlled system for the design and development of medical devices to meet, and.

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
| QA  | Maintain design control compliance, approve protocols, and release DHF records | ISO 13485 §4.2.4 |
| PRRC | Verify that validation testing meets safety and compliance benchmarks before launch | MDR Article 15 |
[TABLE_END]

## 5. PROCEDURE

The phases of designing and devoping a MD are described in the table below. Records are stored in a DHF and indexed in the DHF Index by each process owner. 
[TABLE_START]

| Phase | Purpose | Activities | Responsible | Approver  | Output (Progression check) |
|---------------------|---------|----------------|----------------------------------|--------------------------------------|--------------------|
| Feasibility | Assess technical, clinical, and regulatory viability | Market analysis, PoC, high-level risk assessment | Product Manager | R&D | Feasibility Report, RMF |
| Design Planning | Define development structure and controls | Design planning, milestones, V&V strategy, resource allocation | R&D | QA | Design Plan, Development Timeline |
| Design Input | Define product requirements | URS creation, regulatory, clinical & cybersecurity requirements | Product Manager | PRRC | Design Input Spec (DIS), SRS |
| Design Output | Translate requirements into technical solution | Software/hardware design, implementation, documentation | Technical Engineer | R&D | Source code, architecture docs, IFU, BOM |
| Device Risk / Usability | Identify and control risks and usability issues | ISO 14971 analysis, FMEA, usability engineering | Technical Engineer | QA | RMF, Usability Engineering File |
| Design Review | Ensure readiness before phase progression | Formal review meetings, gap analysis | R&D | QA | Review minutes, sign-offs, action logs |
| Design Verification | Confirm outputs meet inputs | Unit/integration/system testing, static analysis | Technical Engineer | QA | Test protocols, verification reports, traceability matrix |
| Design Validation | Confirm user needs and intended use are met | Clinical validation, usability testing | Product Manager | PRRC | Validation reports, CER, summative usability report |
| Design Release | Approve product for market release | Final DHF review, compliance check | QA | PRRC | Design freeze, release approval, DoC |
| Design Transfer | Move design into production environment | Manufacturing specs, supplier onboarding | Technical Engineer | R&D | Transfer checklist, production documentation |
| Design Changes | Control post-release modifications | Change requests, impact analysis | Technical Engineer | QA | Change log, updated DHF, updated risk file |
| Design Maintenance | Maintain post-market compliance | PMS, CAPA, complaint handling | Product Manager | PRRC | PMS reports, CAPA logs, updated risk files |

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

## 7. REFERENCES 
ISO 13485:2016, Section 7.3 - Design and Development 
MDR Annex I - GSPR 
MDR Annex II §3 - Technical Documentation – Design and Manufacturing Information 
MDR Article 10(1), 10(4), 10(9) - General Obligations of Manufacturers 
MDR Annex IX §4.10 - Changes to Approved Design (NB Notification) 
MDR Annex X §5.2 - Changes to Approved Design 

## 8. APPENDICES

📁 DHF
├── 📁 Feasibility
├── 📁 Design Planning
├── 📁 Design Input
├── 📁 Design Output
├── 📁 Device Risk/Usability
├── 📁 Design Review
├── 📁 Design Verification
├── 📁 Design Release
├── 📁 Design Validation
├── 📁 Design Changes
├── 📁 Design Transfer
├── 📁 Design Maintenance


## 9. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-05-21 | Initial release of this SOP | QA |
[TABLE_END]
    `.trim()
  },


  
/*******************  SOP 007 - RISK MANAGEMENT *******************/
  SOP_007_RISK_MANAGEMENT: {
    id: 'SOP-007', 
    title: 'Risk_Management.pdf', 
    version: '1.0', 
    owner: 'R&D',
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
| 1. PLANNING | Create a Risk Management Plan defining the scope, responsibilities, and criteria for risk acceptability. | CTO & QA Manager | Approved Risk Plan |
| 2. ANALYSIS | Identify known and predictable hazards under normal and fault conditions. Document in FMEA. | Risk Team | Active FMEA Matrix |
| 3. EVALUATION | Score each hazard based on severity and probability to determine if risk control is required. | Risk Team | Evaluated FMEA Record |
| 4. CONTROL | Implement risk mitigation measures (design safety, protective measures, or safety information). | Technical Engineer | Verified Risk Controls |
| 5. RESIDUAL RISK | Evaluate overall residual risk profile. Ensure all individual risks are within acceptable criteria. | Risk Team & PRRC | Residual Risk Review |
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



/*******************  SOP 009 - CLINICAL EVALUATION (5.4) *******************/
  SOP_009_CLINICAL_EVALUATION: {
    id: 'SOP-009', 
    title: 'Clinical_Evaluation.pdf', 
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
| 1. STRATEGY | Establish a Clinical Evaluation Plan (CEP) defining scope, benchmarks, and data search criteria. | RA Manager | Approved CEP Document |
| 2. SEARCH | Conduct systematic literature reviews, clinical database searches, and screen clinical field logs. | Medical Expert | Logged Search Queries |
| 3. APPRAISAL | Evaluate retrieved data packages for methodological soundness, scientific weight, and relevance. | Medical Expert | Signed Data Appraisal Sheet |
| 4. ANALYSIS | Analyze data against criteria to prove device safety, clinical performance, and benefit-risk ratios. | Medical Expert & RA | Formulated CER Draft |
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
    title: 'Change_Control.pdf', 
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
| 1. INITIATION | Complete the CR form. | Change Initiator | Submitted CR Form |
| 2. ASSESSMENT | Evaluate impact and classify change significance using risk criteria. Assess regulatory and QMS impacts. | R&D & RA | Approved Impact Assessment |
| 3. APPROVAL | Conduct cross-functional review of the assessment. PRRC signs off on MDR compliance status. QA formally approves or rejects the CR. | PRRC & QA | QA Approval / NB Record (if Significant) |
| 4. EXECUTION | Execute change. Update TD. Train affected personnel on the new version. | R&D & Production | Updated TD & Training Records |
| 5. CLOSURE | Run full regression testing. Update DHF and RMF. QA reviews evidence and closes the CR. | R&D & QA | Closed CR & Updated DHF / RMF |
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
