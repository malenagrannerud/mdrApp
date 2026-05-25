/**
 * @file sopData.js
 * Central lagring av alla SOPer.
 */


export const SOP_DATA = {

  SOP_001: {
    id: 'SOP',
    title: '📄 SOP-Software_Validation_Process.pdf', 
    version: '1.0', 
    owner: 'QA',
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

  SOP_002_DOC_CONTROL: {
    title: '📄 SOP-Document_Control.pdf',
    version: '1.0',
    owner: 'QA Manager',
    content: 'Document control procedure...'
  },










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
