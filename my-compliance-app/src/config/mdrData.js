// mdr
/**
 * @file mdrData.js
 * @description Regulatoriska steg för MDR-efterlevnad.
 */
import { QMS_SOP_TEMPLATES } from './qmsSopData';

export const MDR_DATA = [
  {
    id: 'm1',
    title: 'Steg 1: Klassificering & Syfte',
    desc: 'Definiera produktens avsedda ändamål och riskklass enligt Annex VIII.',
    checklist: [
      { t: 'Intended Purpose Statement', e: 'Klar definition av vad produkten ska göra och för vem.' },
      { t: 'MDR Klassificeringsrapport', e: 'Motivering av klass (t.ex. IIa enl. Regel 11).' }
    ]
  },
  {
    id: 'm2',
    title: 'Steg 2: GSPR (Annex I)',
    desc: 'Visa efterlevnad av de allmänna kraven på säkerhet och prestanda.',
    checklist: [
      { t: 'GSPR Checklista', e: 'Mappning av varje krav mot bevis och standarder (t.ex. IEC 62304).' }
    ]
  },
  {
    id: 'm3',
    title: 'Steg 3: Teknisk Dokumentation',
    desc: 'Sammanställ den tekniska filen (Technical File) enligt Annex II & III.',
    checklist: [
      { t: 'Technical File Index', e: 'Struktur: Device Description, Risk, Clinical Evaluation, Labeling.' }
    ]
  }
];
