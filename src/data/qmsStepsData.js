/**
 * @file qmsStepsData.js
 * @description Central Roadmap-struktur som importerar mallar från qmsSopData.
 */
import { SOP_DATA } from './sopData.js';

export const QMS_DATA = [

  /******************* STEP 1 -  *******************/

   { 
      id: 'step1', 
      title: 'Steg 1) Grundläggande Systemuppbyggnad', 
      desc: 'Etablera fundamentet för ett QMS.',
      checklist: [
        { 
          t: '1.1) Validera programvaran ', 
          e: ' (ISO 4.1.6) SOP för validering samt Valideringsrapport (SVR).',
          sop: SOP_DATA.SOP_001_VALIDATION 
        },
        { 
          t: '1.2) Dokument- och registerstyrning (ISO 4.2.3)', 
          e: 'SOP som beskriver workflow för granskning.',
          sop: SOP_DATA.SOP_002_DOC_CONTROL 
        },
        { t: '1.3) Dataintegritet & Backup (ISO 4.2.5)', e: 'Testprotokoll för återläsning.' }
      ]
    }
    
    ,
    { 
      id: 'step2', 
      title: 'Steg 2) Kvalitetsmanual & Omfattning', 
      desc: 'Definiera vad systemet täcker och hur det förhåller sig till lagkrav.',
      checklist: [
        { t: '2.1) Quality Manual (ISO 4.2.2)', e: 'Manualen som beskriver hur organisationen uppfyller ISO 13485 och MDR.' },
        { t: '2.2) QMS Scope & Exclusions', e: 'Dokumentation av vad QMS täcker och vilka delar av ISO 13485 som inte är tillämpliga.' }
      ]
    },
    { 
      id: 'step3', 
      title: 'Steg 3) Ledningens Ansvar & Planering', 
      desc: 'Säkerställ att ledningen är engagerad och att en plan för efterlevnad finns.',
      checklist: [
        { t: '3.1) Kvalitetspolicy & Mål (ISO 5.1)', e: 'Signerad policy och mätbara mål för kvaliteten.' },
        { t: '3.2) Roller & PRRC (MDR Art 15)', e: 'Utnämning av ansvarig person (PRRC) och organisationsschema.' },
        { t: '3.3) GAP-analys & Roadmap', e: 'Checklista som visar skillnad mellan nuläge och full efterlevnad.' }
      ]
    },
    { 
      id: 'step4', 
      title: 'Steg 4) Resurshantering', 
      desc: 'Säkerställ kompetens, utbildning och en säker arbetsmiljö.',
      checklist: [
        { t: '4.1) Kompetens & Utbildning (ISO 6.2)', e: 'Utbildningsmatris och bevis på personalens skicklighet (CV/Diplom).' },
        { t: '4.2) Infrastruktur & IT-miljö (ISO 6.3)', e: 'SOP för underhåll av IT-system och säkerhetsuppdateringar.' }
      ]
    },


/******************* STEP 5 - PRODUCT REALISATION & DESIGN *******************/
      { 
      id: 'step5', 
      title: 'Step 5) Product Realisation & Design', 
      desc: 'Control development from idea to finished product with full traceability. ISO 13485 Section 7 + MDR.',
      checklist: [
        { 
          t: '5.1) Design Control & Planning (ISO 7.1-7.3)',
          e: 'Create SOP for product development and establish DHF structure.',
          sop: SOP_DATA.SOP_006_DESIGN_CONTROL,
          checklist: [
            { t: 'Document User Requirements (URS) and technical product specifications → SPEC-001' },
            { t: 'Plan and document verification and validation → PLN-003' },
            { t: 'Establish Design History File (DHF) structure per product' }
          ]
        },
        { 
          t: '5.2) Risk Management (ISO 14971)',
          e: 'Create a SOP for risk management throughout product lifecycle.',
          sop: SOP_DATA.SOP_007_RISK_MANAGEMENT,
          checklist: [
            { t: 'Establish a Risk Management File per product (Risk Plan, FMEA)' },
            { t: 'Perform risk analysis and risk evaluation' },
            { t: 'Implement risk control measures' },
            { t: 'Document residual risk and benefit-risk analysis' },
            { t: 'Produce a Risk Management Report' }
          ]
        },
        { 
          t: '5.3) Purchasing & Supplier Management (ISO 7.4)',
          e: 'Create a SOP for purchasing controls and supplier evaluation.',
          sop: SOP_DATA.SOP_008_SUPPLIER_MANAGEMENT,
          checklist: [
            { t: 'Establish Approved Supplier List (ASL) → REG-009' },
            { t: 'Create Quality Assurance Agreement (QAA) template → TMP-001' },
            { t: 'Evaluate and approve critical suppliers' }
          ]
        },
        { 
          t: '5.4) Clinical Evaluation & Change Control',
          checklist: [
            { 
              t: 'Create a SOP for clinical evaluation', 
              sop: SOP_DATA.SOP_009_CLINICAL_EVALUATION 
            },
            { t: 'Create a Clinical Evaluation Plan (CEP) per product' },
            { t: 'Conduct a literature review and clinical data collection' },
            { t: 'Produce a Clinical Evaluation Report (CER)' },
            { 
              t: 'Create a SOP for change control post-launch', 
              sop: SOP_DATA.SOP_010_CHANGE_CONTROL 
            }
          ]
        }
      ]
    },
/******************* END STEP 5 - PRODUCT REALISATION & DESIGN *******************/





/******************* STEP 6 - Supplier Management & Procurement *******************/

    { 
      id: 'step6', 
      title: 'Steg 6) Leverantörsstyrning & Inköp', 
      desc: 'Kraven på kontroll över de tjänster och komponenter ni köper in.',
      checklist: [
        { t: '6.1) Approved Supplier List (ASL)', e: 'Register över utvärderade och godkända leverantörer.' },
        { t: '6.2) Quality Agreements (QAA)', e: 'Kvalitetsavtal med kritiska leverantörer (t.ex. molntjänster).' }
      ]
    },

    { 
      id: 'step7', 
      title: 'Steg 7) Mätning, Analys & Förbättring (ISO 8)', 
      desc: 'Processägare: QA Manager',
      checklist: [
        { 
          t: '7.1) Internrevision & Produktfrisläppning (ISO 8.2.4 & 8.2.6)', 
          e: 'Skapa SOP för internrevision och rutinen för slutgiltig produktfrisläppning. Upprätta en årlig revisionsplan för kvalitetsledningssystemet samt kontrollplaner och protokoll för slutinspektion.',
          sop: SOP_DATA.SOP_013_AUDITS_AND_RELEASE 
        },
        { 
          t: '7.2) Avvikelsehantering, Non-Conformance (NC) & CAPA (ISO 8.3 & 8.5)', 
          e: 'Skapa SOP för hantering av avvikelser (Non-Conformances) och korrigerande/förebyggande åtgärder (CAPA). Upprätta ett centralt register för att logga, spåra och stänga ärenden, samt utred grundorsaken.',
          sop: SOP_DATA.SOP_014_NC_CAPA_MANAGEMENT 
        },
        { 
          t: '7.3) Data Analysis & Trends (ISO 8.4)', 
          e: 'Skapa SOP för dataanalys (hur KPI:er och felmängder mäts) och sammanställ regelbundna trendrapporter över kvalitetsdata till ledningen.',
          sop: SOP_DATA.SOP_015_DATA_ANALYSIS 
        } 
      ]
    },





    { 
      id: 'step8', 
      title: 'Steg 8)  Post-Market & Vigilance (MDR Art. 83-92)', 
      desc: 'Processer för att kontrollera att produkten och systemet fungerar.',
      checklist: [
        { t: '8.1) Inspection Plans', e: 'Definitioner för vad som kontrolleras vid frisläppning av produkt.' }
      ]
    },
    { 
      id: 'step9', 
      title: 'Steg 9) Avvikelser & CAPA', 
      desc: 'System för att hantera fel och förhindra att de upprepas.',
      checklist: [
        { t: '9.1) NC & CAPA-process (ISO 8.5)', e: 'Logg för avvikelser och utredningsrapporter för rotorsaker.' }
      ]
    },
    { 
      id: 'step10', 
      title: 'Steg 10) Internrevision & NB-redo', 
      desc: 'Slutkontroll av hela systemet innan extern granskning.',
      checklist: [
        { t: '10.1) Internrevisionsrapport (ISO 8.2.2)', e: 'Fullständig genomgång av QMS:et för att säkra att ni är redo för NB.' }
      ]
    }

];
