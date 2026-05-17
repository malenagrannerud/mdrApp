
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
    desc: 'Sammanställ den tekniska filen enligt Annex II & III.',
    checklist: [
      { t: 'Technical File Index', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' }
    ]
  }, 
  {
    id: 'm10',
    title: 'Steg 10) Upprätthåll system för övervakning',
    desc: 'Visa dokumentation på att:',
    checklist: [
      { t: '10.1) Nytta-riskbedömningen har granskats ', 
        e: 'Upprätthåll riskhanteringssystem enligt Annex I, avsnitt 3 (Art. 10.2)' },

      { t: '10.2) PMCF genomförs och den kliniska utvärderingen uppdateras ', 
        e: 'Genomför de planerade aktiviteterna för PMCF Annex XIV, del B (Art. 10.3)' },

      { t: '10.3) Uppdaterad teknisk dokumentation, inklusive ARs kopia samt ändringshistorik', 
        e: 'Teknisk dokumentation är uppdaterad enligt Annex II och III (Art. 10.4)' },

      { t: '10.4) QMS omfattar alla nödvändiga processer och att det granskas och uppdateras', 
        e: 'QMS hålls uppdaterat och kontinuerligt förbättra det; (a) för att säkerställa att den tillverkade produkten fortsätter att överensstämma med kraven, inklusive eventuella ändringar i harmoniserade standarder, och (b) att de flertal procedurer och system som krävs enligt förordningen (listade a till m) förblir effektiva och efterlever kraven (artikel 10.9)' },

      { t: '10.5) PMS aktiviteter sker med nödvändig omfattning', 
        e: 'Upprätthåll aktiviteterna för PMS enligt Art. 83, med särskild uppmärksamhet på de gränssnitt som listas i punkt 3 a–h (Art. 10.10)' },

      { t: '10.6) Avvikelser och klagomål utreds och att korrigerande åtgärder vidtas för att hantera bristande överensstämmelse, samt att berörda parter informeras', 
        e: 'Vidta korrigerande åtgärder för produkter som inte uppfyller kraven, samt informera distributörer, AR och importören. Informera omedelbart behöriga myndigheterna och NB om produkter som utgör en allvarlig risk (Art. 10.12)' },

      { t: '10.7) Incidenter utreds och allvarliga incidenter rapporteras inom föreskriven tid', 
        e: '...' },
      
      { t: '10.8) PRRC utför sina uppgifter ', 
        e: 'Rapportera alla allvarliga tillbud till myndigheterna, senast 15 dagar efter att man fått kännedom om dem. Rapportera alla korrigerande säkerhetsåtgärder på marknaden (FSCA), helst innan åtgärden vidtas, samt förändringar i trender för andra tillbud, allt enligt beskrivningen i artiklarna 87 och 88 (artikel 10.13).' },
      
      { t: '10.9) Leveransspårbarhet', 
        e: 'Upprätthålla register över spårbarhet för alla produkter som tagits emot eller levererats till andra ekonomiska aktörer (t.ex. importörer eller distributörer) eller som levererats till hälso- och sjukvårdsinstitutioner eller personal (Art. 25.2)' },
      
      { t: '10.10) Uppdatering eller bekräftelse av registreringsuppgifter', 
        e: 'Uppdatera EUDAMED inom en vecka efter eventuella ändringar i registreringsuppgifterna och återbekräfta uppgifternas korrekthet vartannat år (Art. 31.4 och 31.5)' },
    ]
  } 
];
