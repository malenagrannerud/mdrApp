/**
 * @file qmsData.js
 * @description Central Roadmap-struktur som importerar mallar från qmsSopData.
 */
import { QMS_SOP_TEMPLATES } from './qmsSopData.js';

export const QMS_DATA = [
   { 
      id: 'step1', 
      title: 'Steg 1: Grundläggande Systemuppbyggnad', 
      desc: 'Etablera fundamentet för ditt QMS med fokus på mjukvaruvalidering, dokumentstyrning och dataintegritet.',
      checklist: [
        { 
          t: '1.1 Validering av eQMS (ISO 4.1.6)', 
          e: 'SOP för validering samt Valideringsrapport (SVR).',
          sop: QMS_SOP_TEMPLATES.SOP_001_VALIDATION // <--- NU KOMMER KNAPPEN SYNAS
        },
        { 
          t: '1.2 Dokument- och registerstyrning (ISO 4.2.3)', 
          e: 'SOP som beskriver workflow för granskning.',
          sop: QMS_SOP_TEMPLATES.SOP_002_DOC_CONTROL // <--- NU KOMMER KNAPPEN SYNAS
        },
        { t: '1.3 Dataintegritet & Backup (ISO 4.2.5)', e: 'Testprotokoll för återläsning.' }
      ]
    }
    
    ,
    { 
      id: 'step2', 
      title: 'Steg 2: Kvalitetsmanual & Omfattning', 
      desc: 'Definiera vad systemet täcker och hur det förhåller sig till lagkrav.',
      checklist: [
        { t: 'Quality Manual (ISO 4.2.2)', e: 'Manualen som beskriver hur organisationen uppfyller ISO 13485 och MDR.' },
        { t: 'QMS Scope & Exclusions', e: 'Dokumentation av vad QMS täcker och vilka delar av ISO 13485 som inte är tillämpliga.' }
      ]
    },
    { 
      id: 'step3', 
      title: 'Steg 3: Ledningens Ansvar & Planering', 
      desc: 'Säkerställ att ledningen är engagerad och att en plan för efterlevnad finns.',
      checklist: [
        { t: '3.1 Kvalitetspolicy & Mål (ISO 5.1)', e: 'Signerad policy och mätbara mål för kvaliteten.' },
        { t: '3.2 Roller & PRRC (MDR Art 15)', e: 'Utnämning av ansvarig person (PRRC) och organisationsschema.' },
        { t: '3.3 GAP-analys & Roadmap', e: 'Checklista som visar skillnad mellan nuläge och full efterlevnad.' }
      ]
    },
    { 
      id: 'step4', 
      title: 'Steg 4: Resurshantering', 
      desc: 'Säkerställ kompetens, utbildning och en säker arbetsmiljö.',
      checklist: [
        { t: '4.1 Kompetens & Utbildning (ISO 6.2)', e: 'Utbildningsmatris och bevis på personalens skicklighet (CV/Diplom).' },
        { t: '4.2 Infrastruktur & IT-miljö (ISO 6.3)', e: 'SOP för underhåll av IT-system och säkerhetsuppdateringar.' }
      ]
    },
    { 
      id: 'step5', 
      title: 'Steg 5: Produktrealisering & Design', 
      desc: 'Styr utvecklingen från idé till färdig produkt med full spårbarhet.',
      checklist: [
        { t: '5.1 Design Control (ISO 7.3)', e: 'Design & Development Plan samt Design History File (DHF).' },
        { t: '5.2 Risk Management (ISO 14971)', e: 'Riskhanteringsfil med riskanalys och kontrollåtgärder.' }
      ]
    },
    { 
      id: 'step6', 
      title: 'Steg 6: Leverantörsstyrning & Inköp', 
      desc: 'Kraven på kontroll över de tjänster och komponenter ni köper in.',
      checklist: [
        { t: '6.1 Approved Supplier List (ASL)', e: 'Register över utvärderade och godkända leverantörer.' },
        { t: '6.2 Quality Agreements (QAA)', e: 'Kvalitetsavtal med kritiska leverantörer (t.ex. molntjänster).' }
      ]
    },
    { 
      id: 'step7', 
      title: 'Steg 7: Mätutrustning & Kalibrering', 
      desc: 'Säkerställ att alla instrument och verktyg ger korrekta resultat.',
      checklist: [
        { t: '7.1 Utrustningsregister (ISO 7.6)', e: 'Lista över all mätutrustning med serienummer och kalibreringsintervall.' }
      ]
    },
    { 
      id: 'step8', 
      title: 'Steg 8: Övervakning & Mätning', 
      desc: 'Processer för att kontrollera att produkten och systemet fungerar.',
      checklist: [
        { t: '8.1 Inspection Plans', e: 'Definitioner för vad som kontrolleras vid frisläppning av produkt.' }
      ]
    },
    { 
      id: 'step9', 
      title: 'Steg 9: Avvikelser & CAPA', 
      desc: 'System för att hantera fel och förhindra att de upprepas.',
      checklist: [
        { t: '9.1 NC & CAPA-process (ISO 8.5)', e: 'Logg för avvikelser och utredningsrapporter för rotorsaker.' }
      ]
    },
    { 
      id: 'step10', 
      title: 'Steg 10: Internrevision & NB-redo', 
      desc: 'Slutkontroll av hela systemet innan extern granskning.',
      checklist: [
        { t: '10.1 Internrevisionsrapport (ISO 8.2.2)', e: 'Fullständig genomgång av QMS:et för att säkra att ni är redo för NB.' }
      ]
    }

];
