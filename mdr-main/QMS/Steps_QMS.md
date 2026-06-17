# QMS-implementeringsguide enligt ISO 13485:2016 och MDR 2017/745 i 10 steg  

Exempel på SOPar som kan komma att behövas baserat på krav i standarder eller regelverk är identifierade enligt formuleringar i ISO 13485:2016 eller MDR
1. *"shall establish a documented procedure"*, 
2. eller *"shall document"* i ISO 13485:2016
3. Etablerade processer som krävs i MDR


## Prefix
- SOP-XXX = Procedurer
- RPT-XXX = Rapport / Bevis
- REG-XXX = Register / Log. Löpande lista
- CERT-XXX = Externa certifikat
- PLN-XXX = Planer
- TMP-XXX = Mallar

***

## Steg 1) Etablera ett dokumentstyrt ledningssystem  (ISO 4.1 & 4.2)
Processägare: QA (CTO stöttar teknisk validering/backup)

### Steg 1.1) Validera eQMS-mjukvaran innan första användning  (ISO 4.1.6)
Innan mjukvaran används formellt måste den valideras för att bevisa att data och elektroniska signaturer är säkra.
- [ ] Skapa SOP för hur ni riskbedömer och validerar mjukvara → 📄 SOP_001_Software_Validation.pdf
- [ ] Skriv en kort rapport som bekräftar att rätt personer har åtkomst och att historik inte kan raderas → 📄 RPT_Software_Validation_Report.pdf
- [ ] Dokumentera och arkivera leverantörens kvalitetsbevis → 📄 CERT_Supplier_ISO_Certificate.pdf

### Steg 1.2) Bygg systemet för dokumenthantering (ISO 4.2.3)
- [ ] Skapa SOP för dokument- och ändringshantering (granskning, godkännande och versionskontroll) → 📄 SOP_002_Document_Control.pdf
- [ ] Upprätta ett Master Document Register över alla gällande interna och externa dokument →
      📄 REG_001_Master_Document_Register.xlsx
- [ ] Definiera arkiveringstid enligt gällande lagkrav (Se MDR Artikel 10.8).

### Steg 1.3) Säkra Dataintegritet & Backup (ISO 4.2.5)
- [ ] Verifiera backup: Dokumentera rutinen och genomför ett återläsningstest →
      📄 RPT_002-Backup_and_Restore_Test.pdf

```
📁 QMS
  📁 04_Quality_Management_System
      📁 04_01_General_Requirements
          📄 SOP-001-Software-Validation.pdf
          📄 RPT-001-Software-Validation-Report.pdf
          📄 CERT-001-Supplier-ISO-Certificate.pdf
      📁 04_02_Documentation_Requirements
          📄 SOP-002-Document-Control.pdf
          📄 REG-001-Master-Document-Register.xlsx
          📄 RPT-002-Backup-Restore-Test.pdf
```
***


## Steg 2: Quality Manual & Scope (ISO 4.2.2)
Processägare: VD (QA stöttar med struktur, RA ansvarar for klassificering)

### Steg 2.1) Klassificera produkterna 
- [ ] Granska MDR Annex VIII för varje produkt → 📄 RPT-003_MDR_Classification.pdf

### Steg 2.2) Definiera QMS omfattning och undantag
- [ ] Gå igenom ISO Kap 7, vad gör vi/gör vi inte? → 📄 RPT_004_QMS_Scope_and_Exclusions_Report.pdf
      
### Steg 2.3) Upprätta Quality Manual (Täcker ISO 4.2.2 a, b...)
- [ ] Skapa rubriker för ISO 4 - 8. Visualisera flöden, från produktutveckling till PMS, inklusive korsreferensmatris → 📄 QM_001_Quality_Manual.pdf 
```
📁 QMS
  📁 04_02_Documentation_Requirements
   📄 QM_001_Quality_Manual.pdf
   📄 RPT_003_MDR_Classification.pdf
   📄 RPT_004_QMS_Scope_and_Exclusions_Report.pdf
```
- [Exempel QM filer](Exempel/04_Quality_Manual.md)
***


***
## Steg 3) Management Responsibility (ISO 5)
Processägare: VD (QA stöttar med mallar) 

### Steg 3.1) Formalisera ledningens processer och kvalitetsmål 
- [ ] Skapa SOP för ledningen. Beskriver målsättning och möten (Management Review) →                   📄 SOP_003_Management_Processes.pdf
- [ ] Skriv och signera företagets quality policy →  📄 POL_001_Quality_Policy.pdf 
- [ ] Sätt minst 3 mätbara mål för innevarande år → 📄 REG_002_Quality_Objectives.pdf 
- [ ] Håll första genomgången → 📄 RPT_005_Management_Review_Minutes.pdf

### Steg 3.2) Fastställ roller (ISO 5.5)
- [ ] Skapa befattningsbeskrivningar → 📄 REG_003_Organizational_Chart.pdf, 📄 REG_004_Job_Descriptions.pdf
- [ ] Utse PRRC formellt (MDR Art. 15) → 📄 REG_005_PRRC_Appointment.pdf

### Steg 3.3) Genomför GAP-analys mot ISO 13485 och MDR
Kartlägg samtliga krav i ISO 13485 och MDR mot nuläge. Bevisa för en auditör att ni har en plan för att nå full efterlevnad.
- [ ] Kartlägg nuläget mot samtliga krav i standard och lagtext → 📄 RPT_006_Gap_Analysis_Report.xlsx 
- [ ] Upprätta tidsatt plan → 📄 PLN_001_QMS_Implementation_Roadmap.pdf 

```
📁 QMS
  └── 📁 05_Management_Responsibility
        ├── 📄 SOP_003_Management_Processes.pdf
        ├── 📁 05_03_Policy_and_Objectives
        │     ├── 📄 POL_001_Quality_Policy.pdf 
        │     └── 📄 REG_002_Quality_Objectives.pdf 
        ├── 📁 05_04_Planning
        │     ├── 📄 RPT_006_Gap_Analysis_Report.xlsx 
        │     └── 📄 PLN_001_QMS_Implementation_Roadmap.pdf
        ├── 📁 05_05_Responsibility_and_Authority
        │     ├── 📄 REG_003_Organizational_Chart.pdf
        │     ├── 📄 REG_004_Job_Descriptions.pdf
        │     └── 📄 REG_005_PRRC_Appointment.pdf
        └── 📁 05_06_Management_Review
              └── 📄 RPT_005_Management_Review_Minutes.pdf
```
***


***
## Steg 4) Resurshantering (ISO 6) 
Processägare: Operations Manager/HR. Mindre bolag → QA eller VD.

### Steg 4.1) Bygg systemet för utbildning, kompetens och medvetenhet (ISO 6.2)
- [ ] Beskriv hur ni tränar personal på nya SOP:er → 📄 SOP_004_Training_Process.pdf
- [ ] Lista utbildningskrav per roll → 📄 REG_006_Training_Matrix.xlsx, 
- [ ] Bevis på att personal förstått tilldelade SOP:er → 📄 REG_007_Individual_Training_Logs.pdf

### Steg 4.2) Säkra lokaler, utrustning och arbetsmiljö (ISO 6.3 & 6.4)
- [ ] Beskriv process för underhåll av kritisk infrastruktur, IT-system och lokaler → 📄 SOP_005_Infrastructure_Maintenance.pdf
- [ ] Upprätta underhållsplan. För IT innebär detta t.ex. patch-management och säkerhetsuppdateringar → 📄 PLN_002_Infrastructure_Maintenance_Plan.pdf
- [ ] Logga miljöförhållanden eller IT-säkerhetskontroller → 📄 REG_008_Environment_Logs.xlsx
```
📁 QMS
      📁 06_Resource_Management
            📁 06_02_Human_Resources
                  📄 SOP-004_Training_Process.pdf
                  📄 REG_006_Training_Matrix_2024.xlsx
                  📄 REG_007_Individual_Training_Logs.pdf
            📁 06_03_Infrastructure
                  📄 SOP-005_Infrastructure_Maintenance.pdf
                  📄 PLN_002_Infrastructure_Maintenance_Plan.xlsx
            📁 06_04_Work_environment_and_contamination_control
                  📄 REG_008_Environment_Logs.xlsx
```
*** 





*** 
## Steg 5) Produktrealisering (ISO 7 / MDR)
Processägare: CTO / R&D (QA styr ramverket, RA styr klinisk del)

### Steg 5.1) Design Control & Planning (ISO 7.1-7.3)
- [ ] Skapa SOP för produktutveckling (Design Controls) → 📄 SOP_006_Design_Control.pdf
- [ ] Dokumentera användarkrav (URS) och tekniska produktspecifikationer → 📄SPEC_001_Product_Requirements.pdf
- [ ] Planera och dokumentera verifiering och validering → 📄 PLN_003_Design_Verification_Validation_Plan.pdf
- [ ] Upprätta Design History File struktur per produkt → 📁 Design_History_File/

### Steg 5.2) Risk Management (ISO 14971)
- [ ] Skapa SOP för riskhantering genom produktens hela livscykel → 📄 SOP_007_Risk_Management.pdf
- [ ] Upprätta Risk Management File per produkt (riskplan, riskanalys/FMEA) → 📁 Risk_Management_File/

#### Exempel: Riskhantering
- [Exempel SOP-010](Exempel/Ex_SOP-010_Risk_Management_Procedure.md)
- [Exempel FMEA](Exempel/Ex_07_FMEA_samd.md)
- [Exempel Risk Management Report SAMD](Exempel/Ex_07_Risk_Management_Report.md)

### Steg 5.3) Purchasing & Suppliers (ISO 7.4)
- [ ] Skapa SOP för inköpskontroller och utvärdering av leverantörer → 📄 SOP_008_Supplier-Management.pdf
- [ ] Upprätta listan över godkända leverantörer → 📄 REG_009_Approved_Supplier_List.xlsx
- [ ] Upprätta mallar för kvalitetsavtal (Quality Assurance Agreements) → 📄 TMP_001_Quality_Assurance_Agreement.pdf

### Steg 5.4) Clinical Evaluation & Change Control
- [ ]Skapa SOP för klinisk utvärdering (planering och sammanställning av klinisk evidens) → 📄 SOP_009_Clinical_Evaluation.pdf
- [ ]Skapa SOP för ändringshantering (Change Control) efter produktlansering → 📄 SOP_010_Change_Control.pdf

```
📁 07_Product_Realization
      📄 SOP_006_Design_Control.pdf
      📄 SOP_007_Risk_Management.pdf
      📄 SPEC_001_Product_Requirements.pdf
      📄 PLN_003_Design_Verification_Validation_Plan.pdf
      📁 Design_History_File/           [Slutgiltig CAD-ritning] ──> Läggs i teknisk fil 📁 Mapp 03 (Design & Manufacturing)
      📁 Risk_Management_File/          [Slutgiltig, godkänd testrapport] ──> Läggs i 📁 Mapp 06 (V&V)
      📄 SOP_008_Supplier-Management.pdf
      📄 REG_009_Approved_Supplier_List.xlsx
      📄 TMP_001_Quality_Assurance_Agreement.pdf
      📄 SOP_009_Clinical_Evaluation.pdf
      📄 SOP_010_Change_Control.pdf


📁 Product_A
      📁 Technical_Documentation/
            
      


```
*** 




***
## Steg 6) Produktion, Spårbarhet & Mätutrustning (ISO 7)
Processägare: Operations Manager / Produktion (QA övervakar)

### Steg 6.1) Bygg system för styrning av produktion och service
- [ ] Skapa SOP för produktionsstyrning, märkning och spårbarhet → 📄 SOP_011_Production_Control.pdf
- [ ] Upprätta gällande arbetsinstruktioner för packprocesser → 📁 Work_Instructions/
- [ ] Skapa mall för tillverkningshistorik (Batch Record) → 📄 TMP_002_Batch_Record.pdf
- [ ] Implementera system för tilldelning av UDI-koder (MDR Art. 27) → 📄 REG_010_UDI_Register.xlsx

### Steg 6.2) Kontroll av övervaknings- och mätutrustning (ISO 7.6)
- [ ] Skapa SOP för kalibrering och kontroll av mätutrustning → 📄 SOP_012_Equipment_Calibration.pdf
- [ ] Upprätta ett register över all mät- och testutrustning → 📄 REG_011_Measuring_Equipment_Register.xlsx
- [ ] Logga genomförda kalibreringar och arkivera certifikat → 📄 REG_012_Calibration_Log.xlsx, 📁 Calibration_Certificates/

```
📁 QMS
      📁 07_Product_Realization
            📁 07_05_Production_and_Service
                  📄 SOP-011-Production-Control.pdf
                  📄 TMP-002-Batch-Record.pdf
                  📄 REG-010-UDI-Register.xlsx
            📁 07_06_Monitoring_and_Measuring_Equipment
                  📄 SOP-012-Equipment-Calibration.pdf
                  📄 REG-011-Measuring-Equipment-Register.xlsx
                  📄 REG-012-Calibration-Log.xlsx
```
***


***
## Steg 7) Mätning, Analys & Förbättring (ISO 8)
Processägare: QA Manager

### Steg 7.1) Internrevision & Produktfrisläppning  (ISO 8.2.4 & 8.2.6)
- [ ] Skapa SOP för internrevision och rutinen för slutgiltig produktfrisläppning → 📄 SOP-013-Audits-and-Release.pdf
- [ ] Upprätta en årlig revisionsplan för kvalitetsledningssystemet → 📄 PLN-004-Internal-Audit-Schedule.pdf
- [ ] Skapa kontrollplaner och protokoll för slutinspektion → 📄 REG-013-Final-Inspection-Record.pdf

### Steg 7.2) Avvikelsehantering, Non-Conformance (NC) & CAPA (ISO 8.3 & 8.5)
- [ ] Skapa SOP för hantering av avvikelser (Non-Conformances) och korrigerande/förebyggande åtgärder (CAPA) → 📄 SOP-014-NC-CAPA-Management.pdf
- [ ] Upprätta ett centralt register för att logga, spåra och stänga NC- och CAPA-ärenden → 📄 REG-014-NC-CAPA-Log.xlsx
- [ ] Utred och dokumentera grundorsaken för specifika avvikelser → 📄 RPT-007-NC-Investigation-Report.pdf

### Steg 7.3) Data Analysis & Trends (ISO 8.4)
- [ ] Skapa SOP för dataanalys (hur KPI:er och felmängder mäts) → 📄 SOP-015-Data-Analysis.pdf
- [ ] Sammanställ regelbundna trendrapporter över kvalitetsdata till ledningen → 📄 RPT-008-Quality-Trend-Analysis.pdf

```
📁 QMS
  └── 📁 08_Measurement_Analysis_Improvement
        ├── 📁 08_02_Monitoring_and_Measurement
        │     ├── 📄 SOP-013-Audits-and-Release.pdf
        │     ├── 📄 PLN-004-Internal-Audit-Schedule.pdf
        │     └── 📄 REG-013-Final-Inspection-Record.pdf
        ├── 📁 08_03_Control_of_Nonconforming_Product
        │     ├── 📄 SOP-014-NC-CAPA-Management.pdf
        │     ├── 📄 REG-014-NC-CAPA-Log.xlsx
        │     └── 📄 RPT-007-NC-Investigation-Report.pdf
        └── 📁 08_04_Analysis_of_Data
              ├── 📄 SOP-015-Data-Analysis.pdf
              └── 📄 RPT-008-Quality-Trend-Analysis.pdf
```
      
***



***
## Steg 8) Post-Market & Vigilance (MDR Art. 83-92)
Processägare: QA Manager (RA stöttar med myndighetsrapportering)

### Steg 8.1) PMS & Reklamationshantering (MDR Art. 83-86)
- [ ] Skapa SOP för eftermarknadskontroll (PMS) och hantering av kundklagomål → 📄 SOP-016-PMS-and-Complaints.pdf
- [ ] Upprätta ett centralt register för att logga och kategorisera alla kundklagomål → 📄 REG-015-Complaint-Log.xlsx
- [ ] Skapa en proaktiv PMS-plan samt tillhörande slutrapport → 📄 PLN-005-PMS-Plan.pdf, 📄 RPT-009-PMS-Report.pdf

### Steg 8.2) Vigilance & Incidentrapporting (MDR Art. 87-92)
- [ ] Skapa SOP för rapportering av allvarliga incidenter till behörig myndighet → 📄 SOP-017-Vigilance-Management.pdf
- [ ] Upprätta en mall för initial risk- och incidentbedömning av inkomna klagomål → 📄 TMP-003-Incident-Assessment-Form.pdf
- [ ] Skapa en mall för säkerhetsmeddelanden till marknaden vid eventuell produktåterkallelse → 📄 TMP-004-Field-Safety-Notice-Template.pdf

```
📁 QMS
      📁 08_Measurement_Analysis_Improvement
            📁 08_02_Monitoring_and_Measurement
                  📄 SOP-016-PMS-and-Complaints.pdf
                  📄 SOP-017-Vigilance-Management.pdf
                  📄 REG-015-Complaint-Log.xlsx
                  📄 PLN-005-PMS-Plan.pdf
                  📄 RPT-009-PMS-Report.pdf
                  📄 TMP-003-Incident-Assessment-Form.pdf
                  📄 TMP-004-Field-Safety-Notice-Template.pdf
```
***



***
## Steg 9) Certifiering och Teknisk dokumentation (MDR Annex II/III)
Processägare: RA Manager (QA levererar indata från QMS)

### Steg 9.1) Skapa strukturen för teknisk dokumentation enligt MDR Annex II/III
- [ ] Skapa SOP för upprättande och underhåll av produktens tekniska fil → 📄 SOP-018-Technical-Documentation.pdf

### Steg 9.2) Sammanställ Technical File för pilotprodukten
- [ ] Sammanställ och strukturera insamlad data från DHF, Risk Management och PMS → 📄 REG-016-Technical-File-Index.pdf

### Steg 9.3) Fyll i GSPR-checklistan – mappa varje krav mot bevis
- [ ] Skapa ett utkast till DoC enligt kraven i MDR Artikel 19 och Annex V → 📄 TMP-005-Draft-Declaration-of-Conformity.pdf

### Steg 9.4) Upprätta utkast till Declaration of Conformity (DoC)
- [ ] Fyll i enligt MDR Artikel 19 och Annex V → 📄 Draft DoC — MDR Art. 19

### 9.5 Välj Notified Body och skicka in ansökan
- [ ] Utvärdera och dokumentera val av granskningsorgan baserat på produktkod → 📄 RPT-010-NB-Selection-Justification.pdf
- [ ] Sammanställ och skicka in den formella ansökan om produktcertifiering → 📄 REG-018-Application-Conformity-Assessment.pdf
***
```
📁 MDR_Technical_Documentation
  ├── 📄 SOP-018-Technical-Documentation.pdf
  ├── 📄 REG-016-Technical-File-Index.pdf
  ├── 📄 REG-017-GSPR-Checklist.xlsx
  ├── 📄 TMP-005-Draft-Declaration-of-Conformity.pdf
  ├── 📄 RPT-010-NB-Selection-Justification.pdf
  └── 📄 REG-018-Application-Conformity-Assessment.pdf



📁 Product_A
      
  ├── 📁 01_Product_Description_and_Specification
  │     ├── 📄 SPEC-001-Product-Specification.pdf
  │     ├── 📄 SPEC-002-Intended-Use-Statement.pdf
  │     ├── 📄 REG-021-MDR-Classification-Rationale.pdf
  │     └── 📄 TMP-005-Draft-Declaration-of-Conformity.pdf
  │
  ├── 📁 02_Information_to_be_Supplied_by_Manufacturer
  │     ├── 📄 SPEC-003-Product-Labelling-Packaging.pdf
  │     ├── 📄 SPEC-004-Instructions-for-Use-IFU.pdf
  │     └── 📁 Translations
  │
  ├── 📁 03_Design_and_Manufacturing_Information
  │     ├── 📄 RPT-016-Design-Overview-and-Schematics.pdf
  │     ├── 📄 SOP-011-Production-Control.pdf
  │     ├── 📄 RPT-017-Manufacturing-Process-Flowchart.pdf
  │     └── 📄 REG-009-Approved-Supplier-List.xlsx
  │
  ├── 📁 04_General_Safety_and_Performance_Requirements
  │     └── 📄 REG-017-GSPR-Checklist.xlsx
  │
  ├── 📁 05_Benefit_Risk_Analysis_and_Risk_Management
  │     ├── 📄 PLN-006-Risk-Management-Plan.pdf
  │     ├── 📄 RPT-018-Risk-Analysis-FMEA.xlsx
  │     └── 📄 RPT-019-Risk-Management-Report.pdf
  │
  ├── 📁 06_Product_Verification_and_Validation
  │     ├── 📁 06_01_Pre_Clinical_Data (Biokompatibilitet, stabilitet, bänk-tester)
  │     ├── 📁 06_02_Clinical_Evaluation (CER, CEP, PMCF-plan)
  │     └── 📁 06_03_Software_Validation (Om tillämpligt)
  │
  └── 📁 07_Post_Market_Surveillance (MDR Annex III)
        ├── 📄 PLN-005-PMS-Plan.pdf
        ├── 📄 PLN-007-PMCF-Plan.pdf
        └── 📄 RPT-013-PMSR_or_PSUR.pdf
 ```     

***

## Steg 10) Mock Audit & NB-förberedelse
Processägare: QA Manager (Ledningsgruppen deltar)

### 10.1 Genomför internrevision av hela QMS:et
- [ ] Granska hela QMS-strukturen mot ISO 13485 och MDR Artikel 10.9 → 📄 RPT-011-Mock-Audit-Report.pdf
- [ ] Logga alla identifierade avvikelser och observationer → 📄 REG-019-Mock-Audit-Findings-Log.xlsx

### 10.2 Stäng alla kvarvarande GAPs och avvikelser
- [ ] Initiera CAPA-ärenden för samtliga avvikelser från internrevisionen och verifiera deras effekt → 📄 REG-014-NC-CAPA-Log.xlsx

### 10.3 Säkerställ att varje process har minst en komplett "loop" av bevis
- [ ] Kontrollera varje process: SOP → WI → Record → Analysis
* Exempel: en CAPA från start till effectiveness check
* Exempel: en designändring från CR till godkänd verifiering

### 10.4 Träna nyckelpersonal inför NB-intervjuer
- [ ] Håll förberedande intervjuer med alla som ska prata med NB
- [ ] Gå igenom vanliga frågor: "Visa mig...", "Vad gör du om..."
- [ ] Säkra att alla vet var deras SOP:ar och instruktioner finns

### Steg 10.5) Gå igenom NB Readiness Checklist – är ni redo?
- [ ] Utvärdera sista checklistan och signera att organisationen är redo för extern granskning → 📄 REG-020-NB-Readiness-Checklist.xlsx

```
📁 QMS
  └── 📁 08_Measurement_Analysis_Improvement
        └── 📁 08_02_Audit_Records
              ├── 📄 RPT-011-Mock-Audit-Report.pdf
              ├── 📄 REG-019-Mock-Audit-Findings-Log.xlsx
              └── 📄 REG-020-NB-Readiness-Checklist.xlsx
```
***



## Steg 11) QMS-cykeln efter produktlansering (CE-märkt produkt på marknaden)
Efter produktlansering skiftar QA/RA-rollen från uppbyggnad till löpande förvaltning enligt en strukturerad års- och kvartalscykel:



```
                Q1                  Q2                  Q3                   Q4
        ┌───────────────────┬───────────────────┬───────────────────┬───────────────────┐
        │                   │                   │                   │                   │
PMS     │                        ... Samla in data löpande ...                          │
        │ ______________________________________________________________________________│
        │                   │                   │                   │                   │
CAPA    │ Öppna → Utred     │ Stäng → Verifiera │ Öppna → Utred     │ Stäng → Verifiera │
        │ (löpande)         │ (löpande)         │ (löpande)         │ (löpande)         │
        │                   │                   │                   │                   │
Audit   │ Internrevision #1 │                   │ Internrevision #2 │                   │
        │                   │                   │                   │                   │
Mgmt    │                   │ Mgmt Review       │                   │ Mgmt Review       │
Review  │                   │ (halvår)          │                   │ (halvår)          │
        │                   │                   │                   │                   │
PSUR    │                   │                   │                   │ PSUR (årlig/      │
        │                   │                   │                   │ vartannat år)     │
        │                   │                   │                   │                   │
CER     │                   │                   │                   │ CER-uppdatering   │
        │                   │                   │                   │ (vid behov)       │
        │                   │                   │                   │                   │
NB      │                   │                   │ NB-uppföljnings-  │                   │
        │                   │                   │ revision (årlig)  │                   │
        │                   │                   │                   │                   │
Leveran-│ Utvärdera         │ Utvärdera         │ Utvärdera         │ Utvärdera         │
törer   │ (löpande)         │ (löpande)         │ (löpande)         │ (löpande)         │
        │                   │                   │                   │                   │
Dok-    │ Uppdatera SOP:ar  │ Uppdatera SOP:ar  │ Uppdatera SOP:ar  │ Uppdatera SOP:ar  │
styrning│ (vid behov)       │ (vid behov)       │ (vid behov)       │ (vid behov)       │
        └───────────────────┴───────────────────┴───────────────────┴───────────────────┘

```

### Steg 11.1) PMS – Post-Market Surveillance (ISO 8.2.1 & MDR Art. 83-86)
Kontinuerlig insamling av proaktiv och reaktiv eftermarknadsdata (klagomål, litteratur, registerdata, kundfeedback).
- [ ] Logga inkomna kundklagomål i det centrala registret → 📄 REG-015-Complaint-Log.xlsx (ISO 8.2.1 / MDR Art. 83)
- [ ] Genomför statistisk trendanalys av kvalitetsdata kvartalsvis → 📄 RPT-012-Quality-Trend-Analysis.pdf (SOP-015)
- [ ] Uppdatera produktens riskanalys/FMEA omedelbart vid nya signaler → 📄 FMEA-Update (SOP-007)
- [ ] Sammanställ regulatorisk PMS-rapport baserat på produktklass:
  - **Klass I:** PMS Report uppdateras vid behov → 📄 RPT-013-PMSR.pdf (MDR Art. 85)
  - **Klass IIa+:** Periodic Safety Update Report (PSUR) sammanställs minst vartannat år → 📄 RPT-014-PSUR.pdf (MDR Art. 86)


| Frekvens | Aktivitet | Styrande dokument |
| :--- | :--- | :--- |
| Löpande | Insamling av PMS-data och klagomål | 📄 SOP-016-PMS-and-Complaints.pdf |
| Kvartalsvis | Trendanalys av avvikelser och klagomål | 📄 SOP-015-Data-Analysis.pdf |
| Enligt produktklass | Upprättande av PMSR (Klass I) eller PSUR (Klass IIa) | 📄 SOP-016-PMS-and-Complaints.pdf |
| Vid signal | Uppdatering av riskhanteringsfil (FMEA) | 📄 SOP-007-Risk-Management.pdf |


### Steg 11.2) CAPA – Avvikelser och förbättringar (ISO 8.3 & 8.5)
Hantering av korrigerande och förebyggande åtgärder triggade av klagomål, interna avvikelser (NC), revisionsfynd eller leverantörsavvikelser.
- [ ] Initiera CAPA-ärenden, genomför rotfelsanalys (t.ex. 5 Whys / Ishikawa) och implementera åtgärder → 📄 REG-014-NC-CAPA-Log.xlsx (SOP-014)
- [ ] Verifiera åtgärdernas effekt (Effectiveness Check) 3–6 månader efter stängning → 📄 RPT-015-CAPA-Effectiveness-Verification.pdf (SOP-014)


| Frekvens | Aktivitet | Styrande dokument |
| :--- | :--- | :--- |
| Vid trigger | Öppna CAPA-ärende och spärra defekt material | 📄 SOP-014-NC-CAPA-Management.pdf |
| Inom 30 dagar | Slutföra utredning och rotorsaksanalys | 📄 SOP-014-NC-CAPA-Management.pdf |
| Inom 60–90 dagar | Implementera och dokumentera korrigerande åtgärder | 📄 SOP-014-NC-CAPA-Management.pdf |
| 3–6 mån efter stängning | Genomföra effektivitetskontroll (Effectiveness Check) | 📄 SOP-014-NC-CAPA-Management.pdf |

### Steg 11.3) Internrevision (ISO 8.2.2)
Planering och genomförande av interna granskningar fördelat över kalenderåret.
- [ ] Upprätta och följ den årliga revisionsplanen → 📄 PLN-004-Internal-Audit-Schedule.pdf (SOP-013)
  - **Kvartal 1 (Fokus R&D):** Design Control, Risk Management, Klinisk utvärdering, Teknisk dokumentation.
  - **Kvartal 3 (Fokus Operations):** Produktion, Leverantörsstyrning, Mätutrustning, NC/CAPA, PMS/Vigilance.
- [ ] Säkerställ att organisationens samtliga processer granskas minst en gång per år.


| Frekvens | Aktivitet | Styrande dokument |
| :--- | :--- | :--- |
| Årligen | Fullständig internrevision av samtliga QMS-processer | 📄 SOP-013-Audits-and-Release.pdf |
| Halvårsvis | Riktad revision av kritiska processer (CAPA, PMS, Inköp) | 📄 SOP-013-Audits-and-Release.pdf |

### Steg 11.4) Management Review – Ledningens genomgång (ISO 5.6)
Strategisk utvärdering av eQMS-prestanda baserat på objektiva data.
- [ ] Sammanställ indata (revisionsresultat, PMS-trender, CAPA-status, leverantörsprestanda, regulatoriska ändringar) och protokollför mötet → 📄 RPT-005-Management-Review-Minutes.pdf (SOP-003)
- [ ] Uppdatera organisationens mätbara kvalitetsmål baserat på ledningens beslut → 📄 REG-002-Quality-Objectives.xlsx (SOP-003)


| Frekvens | Aktivitet | Styrande dokument |
| :--- | :--- | :--- |
| Halvårsvis | Genomföra formell ledningens genomgång (Management Review) | 📄 SOP-003-Management-Processes.pdf |
| Årligen | Genomföra strategisk översyn av kvalitetspolicyn | 📄 SOP-003-Management-Processes.pdf |

### Steg 11.5) Teknisk dokumentation och CER (MDR Annex II/III & Art. 61)
Löpande underhåll av produktens tekniska fil (Technical File) vid designändringar, processförändringar, uppdaterade standarder eller nya kliniska data.
- [ ] Uppdaterar den kliniska utvärderingsrapporten (CER) periodiskt baserat på produktklass:
  - **Klass III / Implantat:** Årligen.
  - **Klass IIb:** Minst vartannat år.
  - **Klass IIa / Klass I:** Vart 3–5 år (eller vid kritiska PMS-signaler).
- [ ] Uppdatera checklistan för allmänna krav på säkerhet och prestanda vid regulatoriska ändringar → 📄 REG-017-GSPR-Checklist.xlsx (SOP-018)


| Frekvens | Aktivitet | Styrande dokument |
| :--- | :--- | :--- |
| Vid ändring | Uppdatera teknisk dokumentation (Technical File) och DoC | 📄 SOP-018-Technical-Documentation.pdf |
| Periodiskt (enligt klass) | Uppdatera Clinical Evaluation Report (CER) | 📄 SOP-009-Clinical-Evaluation.pdf |

### Steg 11.6) Notified Body – Tillsynsrevisioner (MDR Art. 52 & Annex IX)
Förberedelser och samarbete med det anmälda organet (Notified Body) för att behålla CE-certifikatet.
- [ ] Tillhandahåll nödvändig indata (PMS-rapporter, CAPA-loggar, internrevisionsrapporter) inför den årliga tillsynsrevisionen (Surveillance Audit) [Externa certifieringsaudits (Notified Body / Certifieringsorgan)].
- [ ] Genomgå fullständig recertifiering med omfattande granskning av QMS och teknisk dokumentation vart 3–5 år.


| Frekvens | Aktivitet | Regulatorisk referens |
| :--- | :--- | :--- |
| Årligen | Extern uppföljningsrevision av anmält organ (Notified Body) | MDR Artikel 52 + Annex IX |
| Vart 3–5 år | Fullständig förnyelse av CE-certifikat (Recertifiering) | MDR Annex IX |

### Steg 11.7) Löpande operativa aktiviteter (Månadsöversikt)

| Aktivitet | Frekvens | Styrande dokument |
| :--- | :--- | :--- |
| Granska och kategorisera inkomna kundreklamationer | Varje vecka | 📄 SOP-016-PMS-and-Complaints.pdf |
| Genomföra operativ genomgång av öppna avvikelser och CAPA | Månadsvis | 📄 SOP-014-NC-CAPA-Management.pdf |
| Utvärdera leverantörsprestanda mot uppsatta kvalitetsavtal | Kvartalsvis | 📄 SOP-008-Supplier-Management.pdf |
| Kontrollera kalibreringsintervall för registrerad mätutrustning | Enligt schema | 📄 SOP-012-Equipment-Calibration.pdf |
| Kontrollera utbildningsstatus och signeringar för nyanställda/SOP-ändringar | Löpande | 📄 SOP-004-Training-Process.pdf |
| Genomföra omvärldsbevakning (nya harmoniserade standarder, MDCG-guidelines) | Månadsvis | 📄 SOP-002-Document-Control.pdf |

### Steg 11.8) Händelsestyrda aktiviteter (Triggers)

| Regulatorisk Trigger | Omedelbar åtgärd och dokumentation | Styrande dokument |
| :--- | :--- | :--- |
| **Design- eller processändring** | Aktivera Change Control; uppdatera DHF, riskanalys (FMEA) och teknisk fil. | 📄 SOP-010-Change-Control.pdf <br> 📄 SOP-007-Risk-Management.pdf |
| **Ny underleverantör (kritisk)** | Genomför leverantörsbedömning och audit; signera QAA; uppdatera ASL. | 📄 SOP-008-Supplier-Management.pdf <br> 📄 REG-009-Approved-Supplier-List.xlsx |
| **Allvarlig incident (Vigilance)** | Rapportera till behörig myndighet (Läkemedelsverket/Eudamed) inom lagstadgad tid (2, 10 eller 15 dagar beroende på allvarlighetsgrad). | 📄 SOP-017-Vigilance-Management.pdf <br> 📄 TMP-003-Incident-Assessment-Form.pdf |
| **Ny harmoniserad standard** | Initiera GAP-analys; uppdatera berörda SOP:er samt GSPR-checklistan. | 📄 SOP-002-Document-Control.pdf <br> 📄 REG-017-GSPR-Checklist.xlsx |
| **Säkerhetsrelaterad fältåtgärd** | Aktivera FSCA (Field Safety Corrective Action); distribuera säkerhetsmeddelande (FSN) till marknaden samt anmäl till myndighet. | 📄 SOP-017-Vigilance-Management.pdf <br> 📄 TMP-004-Field-Safety-Notice-Template.pdf |

### Steg 11.9) Ungefärlig strategisk tidsfördelning i rollen som QA Manager

| Strategiskt ansvarsområde | Ungefärlig andel av arbetstid |
| :--- | :--- |
| PMS-data, trendanalys och löpande klagomålshantering | 25 % |
| CAPA-utredningar, rotorsaksanalyser och effektivitetskontroller | 20 % |
| Regulatoriskt dokumentunderhåll (SOP:er, ändringshantering, tekniska filer) | 15 % |
| Planering och genomförande av internrevisioner samt NB-förberedelser | 15 % |
| Ledningens genomgång, KPI-rapportering och strategisk måluppföljning | 10 % |
| Regulatorisk omvärldsbevakning (nya lagkrav, standarder och MDCg-dokument) | 10 % |
| Leverantörsuppföljning, externa audits och kvalitetsavtal (QAA) | 5 % |


## TO DO
1. Tidsuppskattningar
2. Beroenden mellan steg
3. Mallar och exempelinnehåll
4. Riskbaserade prioriteringar
5. Feedback loopar
6. MVP för startups och små företag

