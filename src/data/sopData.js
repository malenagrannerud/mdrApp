/**
 * @file sopData.js
 * Central lagring av alla SOPer.
 */

export const SOP_DATA = {
  
  SOP_001_VALIDATION: {
    id: 'SOP-001', 
    title: 'SOP-001_Software_Validation_Process.pdf', 
    version: '1.0', 
    owner: 'QA Manager',
    content: `
    ## 1. PURPOSE
    Validera eQMS och verktyg.

    ## 2. SCOPE
    Denna SOP omfattar all mjukvara som används för att hantera, lagra eller processa kvalitetsdata inom företagets QMS, inklusive men inte begränsat till:
    - eQMS-plattformar
    - Dokumenthanteringssystem
    - CAPA/NCR-system
    - Utbildningsdatabaser

    ## 3. DEFINITIONS
    - Validering: Dokumenterad process som bekräftar att mjukvaran konsekvent producerar förväntade resultat
    - Installation/Operational/Performance Qualification (IQ/OQ/PQ): Standardiserade testfaser för att verifiera korrekt installation, funktion och prestanda 

    ## 4. RESPONSIBILITY
  - QA Manager: Ansvarig för att godkänna valideringsplan och slutrapport
  - System Administrator: Utför tekniska tester och dokumenterar resultat
  - Process Owner: Verifierar att mjukvaran uppfyller verksamhetskraven

    ## 5. PROCEDURE 
    - Steg 1: Upprätta en Valideringsplan som identifierar mjukvarans avsedda användning och risknivå
    - Steg 2: Genomför IQ och dokumentera systemkonfigurationen
    - Steg 3: Utför OQ och dokumentera systemets funktioner
    - Steg 4: Slutför PQ under verkliga driftsförhållanden
    - Steg 5: Sammanställ resultaten i en SVR
    - Steg 6: Erhåll sign-off från QA innan systemet tas i drift

    ## 6. REFERENCES 
    - ISO 13485:2016, Avsnitt 4.1.6
    - IEC 62304:2006 - Medical Device Software
    - GAMP 5 Guidelines
    ## 7. APPENDICES 
    ## 8. REVISION HISTORY
    Version 1.0: Initial release (2024-01-15)
        `.trim()
      },




/******************* STEP 5 - PRODUCT REALISATION & DESIGN *******************/

  SOP_006_DESIGN_CONTROL: {
    id: 'SOP-006', 
    title: 'SOP-006_Design_Control.pdf', 
    version: '1.0', 
    owner: 'CTO / R&D Manager',
    content: `
## 1. PURPOSE
Define how design and development of medical devices is planned, controlled and documented to meet:
ISO 13485:2016, Section 7.3 - Design and Development
Annex I GSPR 1-9 
Annex II §3 - Technical Documentation – design and manufacturing information
Article 10(1) - Design and manufacture in accordance with MDR
Article 10(4) - establish and maintain Technical Documentation
Article 10(9) - QMS shall include design control
Annex IX §4.10 / Annex X §5.2 - Changes to approved design

## 2. SCOPE
Applies to all new product development and significant design changes to existing medical devices.

## 3. DEFINITIONS
User Requirements Specification (URS) – what the user needs
Design History File (DHF) – all records proving design was controlled per ISO 13485 §7.3
Design Review: Formal check that design meets requirements at each phase
Design Transfer: Moving design from R&D to production
Verification: Did we build it right? (Testing against specifications)
Validation: Did we build the right thing? (Testing with intended users)

## 4. RESPONSIBILITY
See each procedure step for specific roles.

## 5. PROCEDURE
### 5.1 Design & Development Planning
Responsible: CTO / R&D Manager
- Step 1: Create Design & Development Plan (phases, reviews, deliverables, responsibilities)
- Step 2: Assign responsibilities per phase
- Step 3: QA Manager approves the plan
- Step 4: Ensure plan covers all GSPR requirements (MDR Annex I)

### 5.2 Design Input
Responsible: Product Manager
- Step 1: Collect user needs (interviews, surveys, clinical input)
- Step 2: Document User Requirements Specification (URS)
- Step 3: Include: intended use, safety, performance, regulatory, usability requirements
- Step 4: Ensure inputs address all applicable GSPRs from MDR Annex I
- Step 5: Review and approve URS

### 5.3 Design Output
Responsible: R&D Engineer
- Step 1: Produce design outputs (drawings, specifications, BOM, code)
- Step 2: Verify each output against its input requirement
- Step 3: Document in Design History File (DHF) per ISO 13485 §7.3

### 5.4 Design Review
Responsible: CTO / R&D Manager
- Step 1: Hold formal design review at each phase end
- Step 2: Verify: inputs met? Issues resolved? Ready for next phase?
- Step 3: Check GSPR compliance progress (MDR Annex I)
- Step 4: Document decisions and action items in Design Review Record

### 5.5 Design Verification
Responsible: R&D Engineer
- Step 1: Create Verification Plan (tests, methods, acceptance criteria)
- Step 2: Execute tests and document results
- Step 3: QA Manager approves verification results
- Step 4: Ensure verification covers all GSPR requirements (MDR Annex I)

### 5.6 Design Validation
Responsible: Clinical team + R&D Engineer
- Step 1: Create Validation Plan (clinical, usability, performance)
- Step 2: Execute validation under real or simulated use conditions
- Step 3: Document results – demonstrate device meets user needs and intended uses
- Step 4: QA Manager and PRRC approve validation results per MDR Article 15

### 5.7 Design Transfer
Responsible: Production Manager
- Step 1: Create production specifications from design outputs
- Step 2: Create work instructions
- Step 3: Train production staff
- Step 4: Perform first article inspection
- Step 5: QA Manager approves transfer to production

### 5.8 Design Changes
Responsible: CTO / R&D Manager
- Step 1: Initiate Change Request (CR)
- Step 2: Assess impact (design, risk, regulatory, suppliers)
- Step 3: QA Manager approves or rejects change
- Step 4: If significant change per Annex IX §4.10 / Annex X §5.2, RA Manager notifies NB before implementation
- Step 5: Implement change and update documents
- Step 6: Verify/validate the change
- Step 7: Update DHF and Technical Documentation per Annex II
- Step 8: Update GSPR checklist if affected (MDR Annex I)

## 6. DESIGN HISTORY FILE (DHF)
Each product shall have a DHF containing:
- Design & Development Plan
- User Requirements Specification (URS)
- Technical specifications
- Design outputs (drawings, BOM, schematics, code)
- Design review records
- Verification records (plans, protocols, reports)
- Validation records
- Risk management file references
- Change records
- GSPR compliance tracking (MDR Annex I)

## 7. MDR COMPLIANCE SUMMARY
| MDR Requirement | Covered By |
|-----------------|------------|
| Annex I GSPR 1-9 | Design inputs, verification, validation |
| Annex II §3 | DHF → Technical Documentation |
| Article 10(1) | This entire SOP |
| Article 10(4) | Design outputs → TD |
| Article 10(9) | This SOP |
| Annex IX §4.10 / Annex X §5.2 | Section 5.8 |

## 8. REFERENCES
- ISO 13485:2016, Section 7.3
- MDR 2017/745, Annex I, Annex II §3, Annex IX §4.10, Annex X §5.2
- MDR 2017/745, Article 10(1), 10(4), 10(9)

## 9. APPENDICES
- TMP-DHF-Index: DHF contents checklist
- TMP-Design-Review: Design Review Record template
- TMP-URS: User Requirements Specification template
- TMP-V&V-Plan: Verification & Validation Plan template

## 10. REVISION HISTORY
Version 1.0: Initial release
    `.trim()
  },
  

  SOP_007_RISK_MANAGEMENT: {
    id: 'SOP-007', 
    title: 'SOP-007_Risk_Management.pdf', 
    version: '1.0', 
    owner: 'CTO / R&D Manager',
    content: `
## 1. PURPOSE
Define how risk management is performed throughout the product lifecycle to meet:
- ISO 14971:2019 (Medical devices – Application of risk management)
- MDR 2017/745, Annex I GSPR 1-9 (General Safety and Performance Requirements)
- MDR 2017/745, Article 10(2) (establish, document, implement and maintain a risk management system)
- EN 62366-1:2015 (Usability Engineering – human factors and usability risks per Annex I §5)

## 2. SCOPE
Applies to all medical devices from initial design through post-market phase until decommissioning.

## 3. DEFINITIONS
- Risk: Combination of probability of harm and severity of that harm
- Hazard: Potential source of harm
- FMEA: Failure Mode and Effects Analysis
- RMF: Risk Management File
- ALARP: As Low As Reasonably Practicable

## 4. RESPONSIBILITY
- CTO / R&D Manager: Process Owner – overall risk management, plan approval
- Risk Management Team: Perform risk analysis, evaluation and control
- QA Manager: Review and approve risk documentation
- PRRC: Ensure risk management meets MDR requirements
- All employees: Report hazards and incidents

## 5. PROCEDURE

### 5.1 Risk Management Planning
- Responsible: CTO / R&D Manager
- Step 1: Create Risk Management Plan per product per ISO 14971 §4
- Step 2: Define risk acceptability criteria
- Step 3: Assign risk management team
- Step 4: Plan review and update intervals
- Step 5: Ensure plan covers all lifecycle phases (design, production, use, disposal)

### 5.2 Risk Analysis
- Responsible: Risk Management Team
- Step 1: Identify hazards (design, materials, use, environment, usability per EN 62366)
- Step 2: Estimate probability and severity for each hazardous situation per ISO 14971 §5
- Step 3: Document in FMEA or equivalent method

### 5.3 Risk Evaluation
- Responsible: CTO / R&D Manager
- Step 1: Compare estimated risks against acceptability criteria per ISO 14971 §6
- Step 2: Determine which risks require reduction
- Step 3: Document decisions

### 5.4 Risk Control
- Responsible: Risk Management Team
- Step 1: Identify risk control measures per ISO 14971 §7 (design changes, protections, labelling)
- Step 2: Implement controls and verify effectiveness
- Step 3: Evaluate residual risk per ISO 14971 §7.4
- Step 4: If residual risk not acceptable, repeat control process

### 5.5 Benefit-Risk Analysis
- Responsible: CTO / R&D Manager
- Step 1: Summarize clinical benefits
- Step 2: Summarize residual risks from RMF
- Step 3: Determine if benefits outweigh risks per MDR Annex I §1 and §8

### 5.6 Risk Management Report
- Responsible: CTO / R&D Manager
- Step 1: Compile all risk management activities per ISO 14971 §8
- Step 2: Conclude on overall residual risk acceptability
- Step 3: QA Manager and PRRC approve per MDR Article 15

### 5.7 Post-Market Risk Management
- Responsible: QA Manager
- Step 1: Collect PMS data per MDR Article 83-86 (complaints, incidents, literature)
- Step 2: Risk Management Team updates risk analysis when new hazards or trends identified per ISO 14971 §10
- Step 3: Process Owner reviews RMF at least annually

## 6. RISK MANAGEMENT FILE (RMF)
Each product shall have a RMF per ISO 14971 containing:
- Risk Management Plan
- Risk analysis (FMEA)
- Risk evaluation records
- Risk control records
- Benefit-risk analysis
- Risk Management Report
- Post-market updates

## 7. MDR COMPLIANCE SUMMARY
| MDR Requirement | Covered By |
|-----------------|------------|
| Annex I §1 (risk management) | Entire SOP |
| Annex I §2 (eliminate/reduce risks) | Section 5.4 |
| Annex I §3 (residual risk) | Section 5.4 |
| Annex I §4 (benefit-risk) | Section 5.5 |
| Annex I §5 (usability risks) | EN 62366 integration |
| Annex I §6 (design/manufacture) | Section 5.2 |
| Annex I §7 (label/IFU) | Risk control via labelling |
| Annex I §8 (clinical evaluation) | Section 5.5 |
| Annex I §9 (safety principles) | Entire SOP |
| Article 10(2) | Entire SOP |

## 8. REFERENCES
- ISO 14971:2019
- MDR 2017/745, Annex I §1-9, Article 10(2), Article 83-86
- EN 62366-1:2015 (Usability Engineering)
- SOP-006 Design Control

## 9. APPENDICES
- TMP-FMEA: FMEA template
- TMP-RM-Plan: Risk Management Plan template
- TMP-RM-Report: Risk Management Report template

## 10. REVISION HISTORY
Version 1.0: Initial release
    `.trim()
  },


  SOP_008_SUPPLIER_MANAGEMENT: {
    id: 'SOP-008', 
    title: 'SOP-008_Supplier_Management.pdf', 
    version: '1.0', 
    owner: 'Operations Manager',
    content: `
## 1. PURPOSE
Define how suppliers are evaluated, selected, approved and monitored to ensure purchased products and services meet quality requirements per:
- ISO 13485:2016, Section 7.4 (Purchasing)
- MDR 2017/745, Article 10(1) (design and manufacture in accordance with MDR)
- MDR 2017/745, Article 10(9) (QMS shall include purchasing controls)

## 2. SCOPE
Applies to all suppliers of materials, components, software and services that affect product quality.

## 3. DEFINITIONS
Approved Supplier List (ASL)
Quality Assurance Agreement (QAA)
Critical Supplier: Supplier whose product/service directly affects device safety or performance

## 4. RESPONSIBILITY
- Operations Manager: Process Owner – overall supplier management
- Purchasing: Initiate supplier selection, maintain ASL
- QA Manager: Approve suppliers, conduct supplier audits
- R&D: Define technical requirements for purchased items
- Production: Report supplier quality issues

## 5. PROCEDURE
### 5.1 Supplier Evaluation and Selection
Responsible: Purchasing
- Step 1: Identify need for new supplier
- Step 2: Define requirements (technical, quality, regulatory per MDR)
- Step 3: Evaluate candidate suppliers (questionnaire, audit, samples)
- Step 4: Classify supplier as critical or non-critical based on impact on device safety/performance
- Step 5: QA Manager approves and adds to ASL

### 5.2 Quality Assurance Agreements
- Responsible: QA Manager
- Step 1: Establish QAA with all critical suppliers
- Step 2: Define quality requirements, change notification obligation, right to audit
- Step 3: Both parties sign QAA

### 5.3 Supplier Monitoring
- Responsible: Purchasing
- Step 1: Track supplier performance (delivery, quality, complaints)
- Step 2: Review critical suppliers quarterly
- Step 3: Review non-critical suppliers annually
- Step 4: Take action if performance declines (CAPA, re-audit, disqualification)

### 5.4 Supplier Audits
Responsible: QA Manager
- Step 1: Schedule audits based on risk and performance
- Step 2: Conduct on-site or remote audit
- Step 3: Document findings and follow up on CAPAs
- Step 4: Update supplier status on ASL

## 6. REFERENCES
ISO 13485:2016, Section 7.4
MDR 2017/745, Article 10(1), 10(9)

## 7. APPENDICES
TMP-001 Quality Assurance Agreement template
TMP-Supplier-Questionnaire: Supplier evaluation form
TMP-Supplier-Audit: Supplier audit checklist

## 8. REVISION HISTORY
Version 1.0: Initial release
    `.trim()
  },

  SOP_009_CLINICAL_EVALUATION: {
    id: 'SOP-009', 
    title: 'SOP-009_Clinical_Evaluation.pdf', 
    version: '1.0', 
    owner: 'RA Manager',
    content: `
## 1. PURPOSE
Define how clinical evaluation is planned, conducted and documented to demonstrate conformity with GSPR per:
- MDR 2017/745, Article 61 (Clinical Evaluation)
- MDR 2017/745, Annex XIV Part A (Clinical Evaluation)
- MDR 2017/745, Annex XIV Part B (Post-Market Clinical Follow-up)
- MEDDEV 2.7/1 rev.4 (Clinical Evaluation: Guide for Manufacturers and Notified Bodies)

## 2. SCOPE
Applies to all medical devices requiring clinical evaluation under MDR.

## 3. DEFINITIONS
Clinical Evaluation Plan (CEP)
Clinical Evaluation Report (CER)
Post-Market Clinical Follow-up (PMCF)

## 4. RESPONSIBILITY
- QA Manager: Review and approve
- PRRC: Final approval per MDR Article 15

## 5. PROCEDURE
### 5.1 Clinical Evaluation Plan (Stage 0)
Responsible: Clinical Evaluator
- Step 1: Create CEP per device/device family per Annex XIV §1(a)
- Step 2: Define scope, methodology, data sources
- Step 3: Assign clinical evaluation team
- Step 4: RA Manager approves CEP

### 5.2 Identify Clinical Data (Stage 1)
Responsible: Clinical Evaluator
- Step 1: Systematic literature search (PubMed, Embase, Cochrane)
- Step 2: Collect own clinical investigation data
- Step 3: Collect PMS and complaint data
- Step 4: Collect equivalent device data if equivalence claimed per MDCG 2020-5

### 5.3 Appraise Clinical Data (Stage 2)
Responsible: Clinical Evaluator + Medical Expert
- Step 1: Evaluate scientific validity of each data set
- Step 2: Evaluate relevance to subject device
- Step 3: Evaluate weight/contribution to clinical evidence
- Step 4: Document appraisal results per Annex XIV §1(b)

### 5.4 Analyse Clinical Data (Stage 3)
Responsible: Clinical Evaluator
- Step 1: Analyse safety data (adverse events, incidents) per Annex XIV §1(c)
- Step 2: Analyse performance data (endpoints, outcomes)
- Step 3: Perform benefit-risk analysis per MDR Annex I §1 and §8
- Step 4: Determine if new clinical data is needed

### 5.5 Clinical Evaluation Report (Stage 4)
Responsible: Clinical Evaluator
- Step 1: Document all stages in CER per Annex XIV §4
- Step 2: Conclude on GSPR conformity per MDR Annex I
- Step 3: Define PMCF activities per Annex XIV Part B
- Step 4: RA Manager and PRRC approve and sign CER
- Step 5: Update CER per device class schedule

## 6. CER UPDATE FREQUENCY
- Class I: Every 5 years or when PMS signals
- Class IIa: Every 3-5 years
- Class IIb: At least every 2 years
- Class III / Implantable: Annually

## 7. REFERENCES
MDR 2017/745, Article 61, Annex XIV
MEDDEV 2.7/1 rev.4
MDCG 2020-5 (Equivalence)
MDCG 2020-6 (Legacy devices)
ISO 14155 (Clinical investigations)
SOP-007 Risk Management

## 8. APPENDICES
TMP-CEP: Clinical Evaluation Plan template
TMP-CER: Clinical Evaluation Report template
TMP-PMCF: PMCF Plan template

## 9. REVISION HISTORY
Version 1.0: Initial release
    `.trim()
  },

  SOP_010_CHANGE_CONTROL: {
    id: 'SOP-010', 
    title: 'SOP-010_Change_Control.pdf', 
    version: '1.0', 
    owner: 'QA Manager',
    content: `
## 1. PURPOSE
Define how changes to products, processes, and QMS are initiated, assessed, approved, implemented and verified to meet:
- ISO 13485:2016, Section 7.3.7 (Design and Development Changes)
- MDR 2017/745, Annex IX §4.10 (changes to approved design – NB notification)
- MDR 2017/745, Annex X §5.2 (changes to approved design – type examination)

## 2. SCOPE
Applies to all changes affecting: Product design or specifications, Manufacturing processes, 
Suppliers of critical materials, Software (device or QMS), QMS processes and documentation

## 3. DEFINITIONS
- CR: Change Request
- Significant Change: Change that could affect safety or performance per MDR Annex IX §4.10 / Annex X §5.2

## 4. RESPONSIBILITY
Change Initiator: Submit Change Request (any employee)
See each step for specific responsibilities in impact assessment and approval.

## 5. PROCEDURE

5.1 Initiate Change
Responsible: Change Initiator (any employee)
- Step 1: Identify need for change
- Step 2: Complete Change Request (CR) form
- Step 3: Describe change and reason

5.2 Impact Assessment
Responsible: R&D Manager (design), RA Manager (regulatory)
- Step 1: R&D assesses design impact per SOP-006
- Step 2: R&D assesses risk impact (update FMEA per SOP-007)
- Step 3: RA assesses regulatory impact (new NB submission required?)
- Step 4: Purchasing assesses supplier impact (new components?)
- Step 5: QA assesses QMS document impact

5.3 Approval
Responsible: QA Manager
- Step 1: Review impact assessment
- Step 2: Approve, reject, or request more information
- Step 3: If significant change per Annex IX §4.10 / Annex X §5.2, RA Manager notifies NB prior to implementation

5.4 Implementation
Responsible: R&D Manager / Production Manager
- Step 1: Execute change according to plan
- Step 2: Update affected documents and records
- Step 3: Train affected personnel

5.5 Verification
Responsible: R&D Manager (testing), QA Manager (review)
- Step 1: R&D verifies change was implemented correctly
- Step 2: R&D verifies effectiveness (no new risks introduced)
- Step 3: R&D updates DHF (SOP-006) and RMF (SOP-007)
- Step 4: QA Manager reviews and closes CR

## 6. SIGNIFICANT CHANGES (NB NOTIFICATION)
Per MDR Annex IX §4.10 and Annex X §5.2, notify NB before implementing changes that:
- Affect device safety or performance
- Change intended purpose
- Introduce new materials or technologies
- Change manufacturing location
- Change sterilization method

## 7. REFERENCES
ISO 13485:2016, Section 7.3.7
MDR 2017/745, Annex IX §4.10, Annex X §5.2
SOP-006 Design Control
SOP-007 Risk Management

## 8. APPENDICES
TMP-Change-Request: Change Request form
TMP-Change-Log: Change history log

## 9. REVISION HISTORY
Version 1.0: Initial release
    `.trim()
  },

/******************* END  - STEP 5 - PRODUCT REALISATION & DESIGN *******************/









 /*********************** STEP 6 - CONTROL OF NONCONFORMING PRODUCT & CAPA *******************/






  SOP_013_AUDITS_AND_RELEASE: {
    id: 'SOP-013',
    title: 'Internal Audits & Product Release Process',
    version: '1.0',
    owner: 'QA Manager',
    content: `
    
    ## 1. PURPOSE
    Syftet med denna SOP är att fastställa processen för planering, 
    genomförande och uppföljning av interna revisioner samt att definiera 
    rutinen för slutgiltig produktfrisläppning. Detta säkerställer att 
    QMS kontinuerligt uppfyller kraven i ISO 13485:2016, 
    MDR 2017/745 och tillämpliga regulatoriska krav.

    ## 2. SCOPE
    Denna SOP omfattar:
- Samtliga processer inom företagets kvalitetsledningssystem
- Alla produkter som genomgår slutlig inspektion och frisläppning
- Interna revisioner av QMS, tillverkningsprocesser och leverantörer
- Revisionsplanering, genomförande, rapportering och uppföljning av korrigerande åtgärder


    ## 3. DEFINITIONS
   Denna SOP omfattar:
- Samtliga processer inom företagets kvalitetsledningssystem
- Alla produkter som genomgår slutlig inspektion och frisläppning
- Interna revisioner av QMS, tillverkningsprocesser och leverantörer
- Revisionsplanering, genomförande, rapportering och uppföljning av korrigerande åtgärder

    ## 4. RESPONSIBILITY
 Denna SOP omfattar:
- Samtliga processer inom företagets kvalitetsledningssystem
- Alla produkter som genomgår slutlig inspektion och frisläppning
- Interna revisioner av QMS, tillverkningsprocesser och leverantörer
- Revisionsplanering, genomförande, rapportering och uppföljning av korrigerande åtgärder

    ## 5. PROCEDURE 
  5.1 ÅRLIG REVISIONSPLANERING
- QA Manager upprättar en årlig revisionsplan senast 15 december för kommande kalenderår
- Revisionsplanen ska omfatta samtliga QMS-processer minst en gång per år
- Kritiska processer (t.ex. designkontroll, riskhantering, CAPA) kan schemaläggas för tätare intervall baserat på riskbedömning och tidigare revisionsresultat
- Revisionsplanen godkänns av ledningens representant och distribueras till alla processägare

5.2 FÖRBEREDELSE AV REVISION
- Lead Auditor meddelar processägaren minst 2 veckor före planerad revision
- Revisionsagenda och omfattning kommuniceras skriftligt
- Revisorer granskar tidigare revisionsrapporter, CAPA-status och relevant dokumentation innan revisionen
- Revisorer måste vara oberoende från den process som revideras

5.3 GENOMFÖRANDE AV REVISION
- Öppningsmöte hålls med processägaren för att bekräfta omfattning och agenda
- Intervjuer genomförs med relevant personal
- Processer, dokumentation och arbetssätt granskas mot gällande krav (ISO 13485, MDR, interna procedurer)
- Stickprov på produkter, dokument och register genomförs
- Observationer och avvikelser dokumenteras löpande
- Avslutande möte hålls där preliminära fynd presenteras för processägaren

5.4 RAPPORTERING
- Lead Auditor sammanställer en formell revisionsrapport inom 10 arbetsdagar
- Rapporten ska innehålla:
  - Revisionens omfattning och datum
  - Identifierade avvikelser klassificerade som Major eller Minor
  - Observationer och förbättringsmöjligheter
  - Sammanfattande bedömning av processens efterlevnad
- Rapporten distribueras till processägaren, QA Manager och ledningens representant

5.5 UPPFÖLJNING AV AVVIKELSER
- Processägaren ansvarar för att initiera CAPA inom 14 dagar efter mottagen revisionsrapport
- Grundorsaksanalys ska genomföras för samtliga avvikelser
- Korrigerande åtgärder med tidsplan ska dokumenteras i CAPA-systemet
- Lead Auditor verifierar effekten av vidtagna åtgärder inom 30 dagar
- Samtliga avvikelser ska vara stängda inom 90 dagar om inte särskilda skäl föreligger och godkänns av QA Manager

5.6 PRODUKTFRISLÄPPNING
- Slutinspektion genomförs enligt produktspecifikation och kontrollplan
- Följande dokumentation ska vara komplett och godkänd innan frisläppning:
  - Tillverkningsdokumentation (batch record / DHR)
  - Testresultat och inspektionsprotokoll
  - Avvikelserapporter (om tillämpligt) med godkänd disposition
  - Steriliseringsdokumentation (för sterila produkter)
- QA granskar och godkänner samtlig dokumentation
- PRRC eller delegerad QA-representant signerar frisläppningsintyget (Product Release Certificate)
- Frisläppt produkt märks och överförs till färdigvarulager
- Dokumentation arkiveras i enlighet med gällande krav (minst 10 år för medicintekniska produkter)

5.7 MANAGEMENT REVIEW INPUT
- QA sammanställer kvartalsvis revisionsresultat till ledningens genomgång
- Trender i avvikelser, återkommande fynd och status för öppna CAPA presenteras

## 6. REFERENCES
- ISO 13485:2016, Avsnitt 8.2.2 (Intern revision) och 8.2.4 (Interna revisioner)
- ISO 13485:2016, Avsnitt 8.2.6 (Övervakning och mätning av produkt)
- MDR 2017/745, Artikel 15 (PRRC) och Artikel 10 (Tillverkarens allmänna skyldigheter)
- ISO 19011:2018 - Guidelines for auditing management systems
- SOP-014 NC & CAPA Management
- SOP-007 Document Control

## 7. APPENDICES
- Årlig Revisionsplan Mall (SOP-013-F01)
- Internrevisionsrapport Mall (SOP-013-F02)
- Produktfrisläppningsintyg Mall (SOP-013-F03)
- Revisionschecklista ISO 13485 (SOP-013-F04)

## 8. REVISION HISTORY
- Version 1.0: Initial release


    
    
    `.trim()
  },
  SOP_014_NC_CAPA_MANAGEMENT: {
    id: 'SOP-014',
    title: 'Non-Conformance & CAPA Management',
    version: '1.0',
    owner: 'QA Manager',
    content: `## 1. PURPOSE\nDefiniera hantering och utredning av avvikelser.`
  },
  SOP_015_DATA_ANALYSIS: {
    id: 'SOP-015',
    title: 'Quality Data Analysis & Trend Reporting',
    version: '1.0',
    owner: 'QA Manager',
    content: `## 1. PURPOSE\nFastställa metoder för insamling och analys av kvalitetsdata.`
  }
};
