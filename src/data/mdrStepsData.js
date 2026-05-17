
/**
 * @file mdrStepsData.js
 * @description Regulatoriska steg för MDR-efterlevnad.
 */

export const MDR_DATA = [
  {
    id: 'm1',
    title: 'Steg 1) Klassificering',
    desc: 'Definiera produktens avsedda ändamål och riskklass enligt Annex VIII.',
    checklist: [
      { t: 'Intended Purpose Statement', e: 'Klar definition av vad produkten ska göra och för vem.' },
      { t: 'MDR Klassificeringsrapport', e: 'Motivering av klass (t.ex. IIa enl. Regel 11).' }
    ]
  },
  {
    id: 'm2',
    title: 'Steg 2) Processer & resurser ',
    desc: 'Visa efterlevnad av de allmänna kraven på säkerhet och prestanda.',
    checklist: [
      { t: 'GSPR Checklista', e: 'Mappning av varje krav mot bevis och standarder (t.ex. IEC 62304).' }
    ]
  },
  {
    id: 'm3',
    title: 'Steg 3) Följ GSPR',
    desc: 'Sammanställ den tekniska filen (Technical File) enligt Annex II & III.',
    checklist: [
      { t: 'Technical File Index', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' }
    ]
  }, 
  {
    id: 'm4',
    title: 'Steg 4) Färdigställ klinisk utvärdering',
    desc: 'Definiera produktens avsedda ändamål och riskklass enligt Annex VIII.',
    checklist: [
      { t: 'Intended Purpose Statement', e: 'Klar definition av vad produkten ska göra och för vem.' },
      { t: 'MDR Klassificeringsrapport', e: 'Motivering av klass (t.ex. IIa enl. Regel 11).' }
    ]
  },
  {
    id: 'm5',
    title: 'Steg 5) Färdigställ Teknisk dokumentation ',
    desc: 'Visa efterlevnad av de allmänna kraven på säkerhet och prestanda.',
    checklist: [
      { t: 'GSPR Checklista', e: 'Mappning av varje krav mot bevis och standarder (t.ex. IEC 62304).' }
    ]
  },
  {
    id: 'm6',
    title: 'Steg 6) Arrangera distribution',
    desc: 'Sammanställ den tekniska filen (Technical File) enligt Annex II & III.',
    checklist: [
      { t: 'Technical File Index', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' }
    ]
  }, 
  {
    id: 'm7',
    title: 'Steg 7) Registrera produkten ',
    desc: 'Definiera produktens avsedda ändamål och riskklass enligt Annex VIII.',
    checklist: [
      { t: 'Intended Purpose Statement', e: 'Klar definition av vad produkten ska göra och för vem.' },
      { t: 'MDR Klassificeringsrapport', e: 'Motivering av klass (t.ex. IIa enl. Regel 11).' }
    ]
  },
  {
    id: 'm8',
    title: 'Steg 8) Färdigställ bedömning av överensstämmelsen ',
    desc: 'Visa efterlevnad av de allmänna kraven på säkerhet och prestanda.',
    checklist: [
      { t: 'GSPR Checklista', e: 'Mappning av varje krav mot bevis och standarder (t.ex. IEC 62304).' }
    ]
  },
  {
    id: 'm9',
    title: 'Steg 9) Färdigställ det sista administrativa',
    desc: 'Sammanställ den tekniska filen (Technical File) enligt Annex II & III.',
    checklist: [
      { t: 'Technical File Index', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' }
    ]
  }, 
  {
    id: 'm10',
    title: 'Steg 10) Upprätthålla system för övervakning',
    desc: 'Visa dokumentation på att:',
    checklist: [
      { t: '10.1) Nytta-riskbedömningen har granskats ', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.2) Klinisk uppföljning efter marknadsintroduktion (PMCF) genomförs och att den kliniska utvärderingen uppdateras ', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.3) Uppdaterad teknisk dokumentation, inklusive ARs kopia samt ändringshistorik', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.4) Kvalitetsledningssystemet omfattar alla nödvändiga processer och att det granskas och uppdateras', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.5) PMS aktiviteter sker med nödvändig omfattning', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.6) Avvikelser och klagomål utreds och att korrigerande åtgärder vidtas för att hantera bristande överensstämmelse, samt att berörda parter informeras', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.7) Incidenter utreds och att allvarliga incidenter rapporteras inom föreskriven tid', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.8) PRRC utför sina uppgifter ', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.9) Leveransspårbarhet', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
      { t: '10.10) Uppdatering eller bekräftelse av registreringsuppgifter', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' },
    ]
  } 
];
