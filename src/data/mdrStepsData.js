
/**
 * @file mdrStepsData.js
 * @description Regulatoriska steg för MDR-efterlevnad.
 */

import { MDCG_DATA } from './mdcgData.js';
export const MDR_DATA = [



  /*******STEP 1 ****************/
        {  
      id: 'm1',
      title: 'Step 1) Decide the intended use and classification',
      checklist: [
        { t: 'Step 1.1) The rationale for deciding if the product is a medical device', mdcg: MDCG_DATA.INFOGRAPHIC },
        { t: 'Step 1.2) The statement of the intended purpose and users of the device' }, 
        { 
          t: 'Step 1.3) The device classification rationale', 
          e: '💡 If you can not classify the future product: request a decision from the CA. The CA have an agreed procedure for handling such enquiries.'
        },
        { t: '' },
        { mdcg: MDCG_DATA.MDCG_2021_24 },
        { mdcg: MDCG_DATA.MDCG_2019_11_REV1 },
        { mdcg: MDCG_DATA.MANUAL_BORDERLINE },
        { t: '' },
        { mdcg: MDCG_DATA.MDCG_2022_5_REV1 },
        { mdcg: MDCG_DATA.MDCG_2025_6 },
        { mdcg: MDCG_DATA.MDCG_2023_4 },
        { mdcg: MDCG_DATA.MDCG_SAMD_AI },
        { mdcg: MDCG_DATA.HELSINKI_PROCEDURE }
      ]
    },




    /*******STEP 2 ****************/

  {
    id: 'm2',
    title: 'Step 2) Establish the necessary processes and resources',
    desc: 'This step centers around Art. 10 - General obligations of manufacturers. How will the QMS be organized to manufacture safe and efficient medical device, before continuing with a safe and efficient medical device? ',

    checklist: [
      
      { t: 'Step 2.1) Set up the Design and Manufacturing processes (Art. 10, 1)' },
      { t: 'Step 2.2) Set up the Risk Management process (Article 10, 2)' },
      { 
        t: 'Step 2.3) Set up the Clinical Evaluation Process (CEP) (Art.10.3)',
        e: 'Art.10.3 requires a documented CEP, detailed in Annex XIV and Art.61.',
        checklist: [
          { e: 'A CEP template --> Later: An approved and filled CEP to put in the technical file' },
          { e: 'A CER template --> Later: An approved and filled CER to put in the technical file' },
          { e: 'A PMCF plan template' },
          { e: 'Connection to other requirements:' },
          
          { e: 'Results feed into Risk Management (Article 10(2))' },
          { e: 'Results feed into Technical Documentation (Annex II)' }
        ]
      },
      { t: 'Step 2.4) Set up the processes for development and maintenance of TD, UDI and the EU declaration of conformity (Article 10, 4-8)' },
      { t: 'Step 2.5) Set up the QMS (Article 10, 9)' },
      { t: 'Step 2.6) Set up the PMS planning process (Article 10, 10)' },
      { t: 'Step 2.7) Set up the labelling development process, including producing language translations (Article 10, 11)' },
      { t: 'Step 2.8) Set up the corrective action and recall process (Article 10, 12)' },
      { t: 'Step 2.9) Set up the Vigilance process, including reporting of serious incidents and field safety corrective actions (Article 10, 13)' },
      { t: 'Step 2.10) Set up the regulatory authority interaction process (Article 10, 14)' },
      { t: 'Step 2.11) Set up the legal liability and damage compensation process (Article 10, 16)' },
      { t: 'Step 2.12) Appoint one or more persons overseeing the regulatory compliance (Article 15)' },
      { t: 'Step 2.13) Ensure access to technical, safety (risk), clinical, quality and regulatory expertise' },
    
    
    
      {e: '💡 For guidance on clinical evaluation - go to Step 4)'},

          // UDI
      { t: 'UDI' },
      { mdcg: MDCG_DATA.MDCG_2022_7 },
      { mdcg: MDCG_DATA.MDCG_2021_19 },
      { mdcg: MDCG_DATA.MDCG_2021_10 },
      { mdcg: MDCG_DATA.MDCG_2021_9 },
      { mdcg: MDCG_DATA.MDCG_2018_1_REV4 },
      { mdcg: MDCG_DATA.MDCG_2020_18 },
      { mdcg: MDCG_DATA.MDCG_2019_2 },
      { mdcg: MDCG_DATA.MDCG_2019_1 },
      { mdcg: MDCG_DATA.MDCG_2018_7 },
      { mdcg: MDCG_DATA.MDCG_2018_6 },
      { mdcg: MDCG_DATA.MDCG_2018_5 },
      { mdcg: MDCG_DATA.MDCG_2018_4 },
      { mdcg: MDCG_DATA.MDCG_2018_3_REV1 },

      { t: 'PMS' },
      { mdcg: MDCG_DATA.MDCG_2025_10 },
      { mdcg: MDCG_DATA.MDCG_2022_21 },

      { t: 'VIGILANCE' },
      { mdcg: MDCG_DATA.MDCG_2024_1 },
      { mdcg: MDCG_DATA.MDCG_2023_3_REV2 },

      { t: 'PRRC' },
      { mdcg: MDCG_DATA.MDCG_2019_7_REV1 }
    
    
    
    
    ]
  },
  {
    id: 'm3',
    title: 'Step 3) Comply with GSPR',
    desc: 'Compile the technical file according to Annex II & III.',
    checklist: [
      { t: 'Technical File Index', e: 'Structure: Device Description, Risk, Clinical Evaluation, Labeling.' }
    ]
  }, 
  {
    id: 'm4',
    title: 'Step 4) Finalize clinical evaluation',
    desc: 'Define the product’s intended purpose and risk class according to Annex VIII.',
    checklist: [
      { t: 'Intended Purpose Statement', e: 'Clear definition of what the product is intended to do and for whom.' },
      { t: 'MDR Classification Report', e: 'Justification of class (e.g., IIa according to Rule 11).' }
    ]
  },
  {
    id: 'm5',
    title: 'Step 5) Finalize Technical Documentation',
    desc: 'Demonstrate compliance with the general safety and performance requirements.',
    checklist: [
      { t: 'GSPR Checklist', e: 'Mapping of each requirement against evidence and standards (e.g., IEC 62304).' }
    ]
  },
  {
    id: 'm6',
    title: 'Step 6) Arrange distribution',
    desc: 'Compile the technical file according to Annex II & III.',
    checklist: [
      { t: 'Technical File Index', e: 'Structure: Device Description, Risk, Clinical Evaluation, Labeling.' }
    ]
  }, 
  {
    id: 'm7',
    title: 'Step 7) Register the product',
    desc: 'Define the product’s intended purpose and risk class according to Annex VIII.',
    checklist: [
      { t: 'Intended Purpose Statement', e: 'Clear definition of what the product is intended to do and for whom.' },
      { t: 'MDR Classification Report', e: 'Justification of class (e.g., IIa according to Rule 11).' }
    ]
  },
  {
    id: 'm8',
    title: 'Step 8) Finalize conformity assessment',
    desc: 'Demonstrate compliance with the general safety and performance requirements.',
    checklist: [
      { t: 'GSPR Checklist', e: 'Mapping of each requirement against evidence and standards (e.g., IEC 62304).' }
    ]
  },
  {
    id: 'm9',
    title: 'Step 9) Finalize the last administrative details',
    desc: 'Compile the technical file according to Annex II & III.',
    checklist: [
      { t: 'Technical File Index', e: 'Structure: Device Description, Risk, Clinical Evaluation, Labeling.' }
    ]
  }, 
  {
    id: 'm10',
    title: 'Step 10) Maintain surveillance systems',
    desc: 'Show documentation that:',
    checklist: [
      { t: '10.1) The benefit-risk determination has been reviewed', 
        e: 'Maintain the risk management system according to Annex I, Section 3 (Art. 10.2)' },

      { t: '10.2) PMCF is being performed and the clinical evaluation is being updated', 
        e: 'Conduct the planned PMCF activities according to Annex XIV, Part B (Art. 10.3)' },

      { t: '10.3) Up-to-date technical documentation, including AR’s copy and history of changes', 
        e: 'Technical documentation is kept up to date according to Annex II and III (Art. 10.4)' },

      { t: '10.4) The QMS covers all required processes and is being reviewed and updated', 
        e: 'Keep the QMS updated and continuously improve it; (a) to ensure that the manufactured product continues to comply with the requirements, including any changes in harmonized standards, and (b) that the multiple procedures and systems required by the Regulation (listed a to m) remain effective and compliant (Article 10.9)' },

      { t: '10.5) PMS activities are taking place with the required scope', 
        e: 'Maintain PMS activities according to Art. 83, with particular attention to the interfaces listed in paragraph 3 a–h (Art. 10.10)' },

      { t: '10.6) Deviations and complaints are investigated, corrective actions are taken to address nonconformities, and appropriate parties are informed', 
        e: 'Take corrective actions for non-compliant products, and inform distributors, the AR, and the importer. Immediately inform competent authorities and the NB about products presenting a serious risk (Art. 10.12)' },

      { t: '10.7) Incidents are investigated and serious incidents are reported within the required time', 
        e: '...' },
      
      { t: '10.8) The PRRC is carrying out their duties', 
        e: 'Report all serious incidents to the authorities no later than 15 days after becoming aware of them. Report all field safety corrective actions (FSCA), preferably before the action is taken, as well as changes in trends for other incidents, all as described in Articles 87 and 88 (Article 10.13).' },
      
      { t: '10.9) Traceability of supply', 
        e: 'Maintain traceability records for all products received or supplied to other economic operators (e.g., importers or distributors) or supplied to health institutions or healthcare professionals (Art. 25.2)' },
      
      { t: '10.10) Updating or confirming registration data', 
        e: 'Update EUDAMED within one week of any changes to the registration data and reconfirm the accuracy of the data every second year (Art. 31.4 and 31.5)' },
    ]
  } 
];
