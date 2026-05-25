/**
 * @file qmsStepsData.js
 * @description Central Roadmap-struktur som importerar mallar från qmsSopData.
 */
import { SOP_DATA } from './sopData.js';
import { SOP_DATA5 } from './sopData5.js';
import { SOP_DATA6 } from './sopData6.js';

export const QMS_DATA = [

/************************************************** STEP 0 ********************************************/
{  
    id: 'q0',
    title: 'Introduction',
    desc: 'A Step by Step Roadmap to Implementing a QMS for Manufacturers',
    checklist: [
      { 
        t: 'QMS Steps Overview',
        e: `
The headings are structured according to ISO 13485 sections, with a focus on the most critical requirements for MDR compliance. Each step includes specific tasks and deliverables, along with references to relevant SOPs and templates to guide you through the implementation process.

📁 QMS
  📁 1-SCOPE OF QMS
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: {}
      
      }
    ]
},

 
/************************************************** STEP 1 ********************************************/
{   
    id: 'step1', 
    title: 'Steg 1) Grundläggande Systemuppbyggnad', 
    desc: 'Etablera fundamentet för ett QMS.',
    checklist: [
      { 
        t: '1.1) Create a SOP for Software Validation', 
        e: `📁 QMS
  📁 1-SCOPE OF QMS
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
        
  files: {
          '1-SCOPE OF QMS': [
            { sop: SOP_DATA.SOP_001, indent: '           ' }
          ]
        }
      }
    ]
},

/************************************************** STEP 2 ********************************************/
    { 
      id: 'step2', 
      title: 'Steg 2) Kvalitetsmanual & Omfattning', 
      desc: 'Definiera vad systemet täcker och hur det förhåller sig till lagkrav.',
      checklist: [
        { t: '2.1) Quality Manual (ISO 4.2.2)', e: 'Manualen som beskriver hur organisationen uppfyller ISO 13485 och MDR.' },
        { t: '2.2) QMS Scope & Exclusions', e: 'Dokumentation av vad QMS täcker och vilka delar av ISO 13485 som inte är tillämpliga.' }
      ]
    },

/************************************************** STEP 3 ********************************************/

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
/************************************************** STEP 4 ********************************************/

    { 
      id: 'step4', 
      title: 'Steg 4) Resurshantering', 
      desc: 'Säkerställ kompetens, utbildning och en säker arbetsmiljö.',
      checklist: [
        { t: '4.1) Kompetens & Utbildning (ISO 6.2)', e: 'Utbildningsmatris och bevis på personalens skicklighet (CV/Diplom).' },
        { t: '4.2) Infrastruktur & IT-miljö (ISO 6.3)', e: 'SOP för underhåll av IT-system och säkerhetsuppdateringar.' }
      ]
    },


/************************************************** STEP 5 ********************************************/
{ 
  id: 'step5', 
  title: 'Step 5) Product Realisation & Design', 
  desc: 'Control development from idea to finished product with full traceability. ISO 13485 Section 7.1-7.3 + MDR.',
  checklist: [
    { 
      t: '5.1) Design Control & Planning',
      e: 'Create a SOP for product development and establish a DHF structure → ',
      sop: SOP_DATA5.SOP_DESIGN_CONTROL 
    },
    { 
      t: '5.2) Risk Management throughout Lifecycle ',
      e: 'Create a SOP for risk management throughout product lifecycle - ISO 14971 → ',
      sop: SOP_DATA5.SOP_RISK_MANAGEMENT
    },

    { 
      t: '5.3) Clinical Evaluation & Device Validation ',
      checklist: [
        { 
          e: 'Create a SOP for clinical evaluation → ', 
          sop: SOP_DATA5.SOP_CLINICAL_EVALUATION 
        },
        { e: 'Create a Clinical Evaluation Plan (CEP) per product (MDR Annex XIV Part A)' },
        { e: 'Conduct a literature review and clinical data collection (MDR Art. 61)' },
        { e: 'Produce a Clinical Evaluation Report (CER) (MDR Annex XIV)' }
      ]
    },
    { 
      t: '5.4) Design Change Control ',
      checklist: [  
        { 
          e: 'Create a SOP for design change control post-launch → ', 
          sop: [SOP_DATA5.SOP_CHANGE_CONTROL, SOP_DATA5.CHANGE_MATRIX]
        }
      ]
    },
    { 
      t: 'Resulting File Structure',
      e: `
  
📁 QMS
  📁 1-SCOPE 
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
    📁 7-DHF
        📁 Feasibility
        📁 Design Planning
        📁 Design Input
        📁 Design Output
        📁 Device Risk/Usability
        📁 Design Review
        📁 Design Verification
        📁 Design Release
        📁 Design Validation
        📁 Design Changes
        📁 Design Transfer
        📁 Design Maintenance
    📁 Risk Management
    📁 Clinical Evaluation
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
      
  files: {
        '7-DHF': [{ sop: SOP_DATA5.SOP_DESIGN_CONTROL, indent: '    ', label: 'SOP-Design_Control.pdf ⬅ ' }],
        'Risk Management': [{ sop: SOP_DATA5.SOP_RISK_MANAGEMENT, indent: '          ' }],
        'Design Validation': [{ sop: SOP_DATA5.SOP_CLINICAL_EVALUATION, indent: '          ' }],
        'Design Changes': [{ sop: SOP_DATA5.SOP_CHANGE_CONTROL, indent: '          ' }],

      }
    }
  ]
},



/******************* STEP 6 - OPERATIONS, PROCUREMENT & TRACEABILITY (ISO 7.4 - 7.6) *******************/


{ 
      id: 'step6', 
      title: 'Steg 6) Driftsättning, Inköp & Spårbarhet (ISO 7.4 - 7.6)', 
      desc: 'Säkra kontroll över leverantörer, produktleverans, kundkrav och mätverktyg. ISO 13485 Section 7.4-7.6.',
      checklist: [
        { 
          t: '6.1) Inköp & Leverantörsstyrning (ISO 7.4.1 - 7.4.3)',
          e: 'Create a SOP for purchasing controls and supplier evaluation → ',
          sop: SOP_DATA6.SOP_008_SUPPLIER_MANAGEMENT,
          checklist: [
            { e: 'Establish Approved Supplier List (ASL) (ISO 7.4.1.1) → REG-009' },
            { e: 'Create Quality Assurance Agreement (QAA) template (ISO 7.4.2) → TMP-001' },
            { e: 'Evaluate, monitor, and re-approve critical suppliers (ISO 7.4.1.1)' }
          ]
        },
        { 
          t: '6.2) Kundprocesser & Marknadsfeedback (ISO 7.2.2, 7.2.3 & 8.2.1)',
          checklist: [
            { 
              e: 'Create a SOP for handling customer requirements and post-market feedback (ISO 7.2.2) → ',
              sop: SOP_DATA6.SOP_011_CUSTOMER_PROCESSES 
            },
            { e: 'Establish a register to log and evaluate customer complaints and market feedback (ISO 7.2.3) → REG-010' }
          ]
        },
        { 
          t: '6.3) Produktion, Servicing & UDI-Spårbarhet (ISO 7.5.1, 7.5.8, 7.5.9 & 7.6)',
          checklist: [
            { 
              e: 'Create a SOP for product release, deployment pipelines, and unique device tracking (ISO 7.5.1 & 7.5.4) → ',
              sop: SOP_DATA6.SOP_012_PRODUCTION_AND_TRACEABILITY 
            },
            { e: 'Create a SOP for the qualification and validation of automated test software (ISO 7.5.6 & 7.6) → SOP-013' },
            { e: 'Establish a register for allocated UDI codes and device release versions (ISO 7.5.8 & 7.5.9) → REG-011' }
          ]
        }
      ]
    },


/******************* END STEP 6 *******************/













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
]
