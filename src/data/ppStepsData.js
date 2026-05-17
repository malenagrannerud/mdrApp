






export const PP_DATA = [
  {
    id: 'p1',
    title: 'Steg 1) Preklinisk utveckling',
    desc: 'Kartlägg substansens kemiska och biologiska egenskaper in vitro och in vivo innan studier på människa påbörjas.',
    checklist: [
      { t: 'Laboratoriestudier & karakterisering', 
        e: 'Dokumentation av molekylstruktur, stabilitet, renhetsgrad och farmaceutisk formuleringsutveckling.' },
     
      { t: 'In vivo toxicitets- och säkerhetsstudier', 
        e: 'Obligatoriska prekliniska djurförsök för att fastställa toxicitetsprofil, farmakokinetik (ADME) och startdos för människa.' }
    ]
  },
  {
    id: 'p2',
    title: 'Steg 2) Kliniska prövningar (CTR)',
    desc: 'Ansök om och genomför kliniska fas I–III-studier på människor enligt förordning (EU) nr 536/2014 via CTIS-portalen.',
    checklist: [
      { t: 'Fas I: Human säkerhet och dosering', 
        e: 'Tester på en liten grupp friska frivilliga (20–100 pers) för att utvärdera tolerabilitet och farmakodynamik.' },
      { t: 'Fas II: Terapeutisk indikation och effekt', 
        e: 'Explorativa studier på en mindre, homogen patientgrupp (100–500 pers) för att utvärdera effekt och biverkningsprofil.' },
      { t: 'Fas III: Slutgiltig bekräftelse av nytta/risk', 
        e: 'Storskaliga, multicentriska och randomiserade studier (tusentals patienter) för att bevisa statistiskt säkerställd terapeutisk nytta mot placebo eller standardbehandling.' }
    ]
  },
  {
    id: 'p3',
    title: 'Steg 3) Ansökan om marknadsgodkännande',
    desc: 'Sammanställ den fullständiga tekniska dokumentationen i CTD-format för regulatorisk granskning och myndighetsgodkännande.',
    checklist: [
      { t: 'Centraliserat godkännande via EMA', 
        e: 'Obligatorisk väg för biotekniska och innovativa läkemedel. Vetenskaplig utvärdering görs av EMA:s kommitté CHMP och beslut fattas av EU-kommissionen.' },
      { t: 'Nationell / Decentraliserad procedur (MRP/DCP)', 
        e: 'Väg via Läkemedelsverket för produkter som inte omfattas av EMA:s obligatoriska krav, exempelvis generika eller lokala substanser.' },
      { t: 'Pharma Package regulatoriska dataskydd', 
        e: 'Säkerställ efterlevnad av de nya tidsperioderna för dataskydd och marknadsexklusivitet för den innovativa substansen.' }
    ]
  },
  {
    id: 'p4',
    title: 'Steg 4) Nationell prissättning & subvention',
    desc: 'Efter EU-godkännande måste läkemedlet integreras i det nationella prissättnings- och förmånssystemet.',
    checklist: [
      { t: 'Ansökan till TLV (Sverige)', 
        e: 'Hälsoekonomisk dokumentation skickas till Tandvårds- och läkemedelsförmånsverket för beslut om subvention och inkludering i högkostnadsskyddet.' },
      { t: 'Värdebaserad prissättning', 
         e: 'Framtagande av underlag som visar att läkemedlets kostnad står i rimlig proportion till den kliniska nyttan jämfört med befintlig vård.' }
    ]
  },
  {
    id: 'p5',
    title: 'Steg 5) Eftermarknadsfas & Farmakovigilans',
    desc: 'Uppfyll de kontinuerliga skyldigheterna för säkerhetsövervakning efter att läkemedlet har introducerats på marknaden.',
    checklist: [
      { t: '5.1) Farmakovigilanssystem (QPPV)', 
        e: 'Etablera ett system för säkerhetsövervakning under ledning av en sakkunnig person (Qualified Person Responsible for Pharmacovigilance) för att samla in biverkningar.' },
      { t: '5.2) Rapportering till EudraVigilance', 
        e: 'Omedelbar elektronisk rapportering av alla allvarliga misstänkta biverkningar till EU:s gemensamma biverkningsdatabas enligt det nya biverkningsdirektivet.' },
      { t: '5.3) Periodiska säkerhetsrapporter (PSUR)', 
        e: 'Löpande sammanställning och inskickande av Periodic Safety Update Reports till myndigheterna för att bevisa att nytta-riskbalansen förblir positiv.' },
      { t: '5.4) Spårbarhet & Säkerhetsdetaljer', 
        e: 'Säkerställ att varje förpackning är försedd med en unik 2D-kod (datamatrix) och en säkerhetsförsegling på apoteksnivå för att förhindra förfalskade läkemedel.' },
      { t: '5.5) Hantering av produktfel och indragningar', 
        e: 'Upprätthåll rutiner för att omedelbart kunna stoppa distributionen och dra tillbaka en hel batch (produktåterkallelse) vid minsta misstanke om kvalitetsdefekter.' }
    ]
  }
];
