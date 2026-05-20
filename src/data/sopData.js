/**
 * @file sopData.js
 * Central lagring av alla SOPer.
 */

export const SOP_DATA = {
  
  SOP_001_VALIDATION: {
    id: 'SOP-001', 
    title: 'Software Validation Process', 
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






SOP_006_DESIGN_CONTROL: {
    id: 'SOP-006', 
    title: 'Design Control Procedure', 
    version: '1.0', 
    owner: 'CTO / R&D Manager',
    content: `
## 1. PURPOSE
Define how design and development of medical devices is planned, controlled and documented to meet ISO 13485 Section 7.3 and MDR requirements.

## 2. SCOPE
Applies to all new product development and significant design changes to existing medical devices.

## 3. DEFINITIONS
- URS: User Requirements Specification – what the user needs
- DHF: Design History File – all records proving design was controlled
- Design Review: Formal check that design meets requirements at each phase
- Design Transfer: Moving design from R&D to production
- Verification: Did we build it right? (Testing against specifications)
- Validation: Did we build the right thing? (Testing with intended users)

## 4. RESPONSIBILITY
- R&D Manager: Overall design control, plan approvals, design reviews
- R&D Engineer: Execute design, produce outputs, perform verification
- Product Manager: User needs, URS
- QA Manager: Approve plans, review verification/validation results
- Clinical team: Validation (clinical evaluation, usability)
- Production Manager: Design transfer, work instructions
- RA Manager: NB notifications, significant change assessment

## 5. PROCEDURE

### 5.1 Design & Development Planning
- Step 1: Create Design & Development Plan (phases, reviews, deliverables, responsibilities)
- Step 2: Assign responsibilities per phase
- Step 3: QA Manager approves the plan

### 5.2 Design Input
- Step 1: Collect user needs (interviews, surveys, clinical input)
- Step 2: Document User Requirements Specification (URS)
- Step 3: Include: intended use, safety, performance, regulatory, usability requirements
- Step 4: Review and approve URS

### 5.3 Design Output
- Step 1: Produce design outputs (drawings, specifications, BOM, code)
- Step 2: Verify each output against its input requirement
- Step 3: Document in Design History File (DHF)

### 5.4 Design Review
- Step 1: Hold formal design review at each phase end
- Step 2: Verify: inputs met? Issues resolved? Ready for next phase?
- Step 3: Document decisions and action items in Design Review Record

### 5.5 Design Verification
- Step 1: Create Verification Plan (tests, methods, acceptance criteria)
- Step 2: Execute tests and document results
- Step 3: QA Manager approves verification results

### 5.6 Design Validation
- Step 1: Create Validation Plan (clinical, usability, performance)
- Step 2: Execute validation under real or simulated use conditions
- Step 3: Document results
- Step 4: QA Manager and PRRC approve validation results

### 5.7 Design Transfer
- Step 1: Create production specifications from design outputs
- Step 2: Create work instructions
- Step 3: Train production staff
- Step 4: Perform first article inspection
- Step 5: Approve transfer to production

### 5.8 Design Changes
- Step 1: Initiate Change Request (CR)
- Step 2: Assess impact (design, risk, regulatory, suppliers)
- Step 3: QA Manager approves or rejects change
- Step 4: Implement change and update documents
- Step 5: Verify/validate the change
- Step 6: Update DHF and Technical Documentation
- Step 7: Notify Notified Body if significant change

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

## 7. REFERENCES
- ISO 13485:2016, Section 7.3
- MDR 2017/745, Annex II, Annex IX, Annex X
- SOP-007 Risk Management
- SOP-009 Clinical Evaluation
- SOP-010 Change Control

## 8. APPENDICES
- TMP-DHF-Index: DHF contents checklist
- TMP-Design-Review: Design Review Record template
- TMP-Change-Request: Change Request form

## 9. REVISION HISTORY
Version 1.0: Initial release
    `.trim()
  },













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
