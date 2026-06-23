/**
 * @file mdrStepsData.js
 * @description Regulatoriska steg för MDR-efterlevnad.
 * 
 */

import { MDCG_DATA } from './mdcgData.js';
import { DOC_DATA } from './docData.js';
import { TD_DATA } from './tdData.js';

export const MDR_DATA = [

/***********************  STEP 0 ****************************************/
{  
    id: 'm0',
    title: 'Introduction',
    desc: 'A Roadmap to CE Marking Medical Devices According to MDR 2017/745',
    checklist: [
      { t: 'OVERVIEW',
        e: `This introduction step will provide an empty file structure, to be be filled with required documents as the steps progresses. 
Folder names come from the MDR Annex II & III. Folders 1-6 contains records from the pre market phase, and folder 7 contains plans for PMS activities.` }, 

      {t: 'Resulting File Structure', 
       e: `

📁 PRODUCT A
  📁 TECHNICAL DOCUMENTATION
    📁 1-DEVICE DESCRIPTION 
    📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
    📁 3-DESIGN & MANUFACTURING INFO
    📁 4-GSPR 
    📁 5-RISK MANAGEMENT 
    📁 6-V&V
    📁 7-PMS` }
    ]
  },

  /**********************  STEP 1 ****************************************/
    {  

/**
 * t: output: vad du ska göra kort
 * e: beskrive vad outputen gör och vad den används till 
 */
      id: 'm1',
      title: 'Step 1) Decide the intended use and classification',
      checklist: [
        { t: 'Step 1.1) Compile the Qualification Rationale ', 
          r: 'Art. 2(1): Contains the definition of a medical device. ',
          e: `This proves that the product is eligible for, and must carry, a medical device CE mark according to MDR.`},
       
        { t: 'Step 1.2) Compile the Statement of Intended Purpose ', 
          r: 'Art. 2(1): Contains the definition of a medical device. ',
          e: `This  defines what the product does, who it is for, and how it cures or treats a medical condition.`},
        
        { t: 'Step 1.3) Compile the Device Classification Rationale (MDR Annex VIII)', 
          r: 'Annex VIII: Go trough the rules to determine the risk class. ',
          e: `This justifies risk class (I, IIa, IIb, III) which will determine if a NB must audit the product. 
          
          Step 1.1), 1.2) and 1.3) result in the document ➔`, 
          sop: TD_DATA.DD},

        { t: ' ', 
          e: `ℹ️ If you can not classify the future product: request a decision from the CA according to the Helsinki Procedure.`}, 

        {t: 'Resulting File Structure', 
         e: `
  📁 PRODUCT A
  📁 TECHNICAL DOCUMENTATION
    📁 1-DEVICE DESCRIPTION
    📄 Device_description_and_rationale.pdf
    📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
    📁 3-DESIGN & MANUFACTURING INFO
    📁 4-GSPR 
    📁 5-RISK MANAGEMENT 
    📁 6-V&V
    📁 7-PMS `,
        }, 
        
        { t: 'Guidance Documents from the MDCG' },
        { mdcg: MDCG_DATA.INFOGRAPHIC },
        { mdcg: MDCG_DATA.MDCG_2021_24 },
        { mdcg: MDCG_DATA.MDCG_2019_11_REV1 },
        { mdcg: MDCG_DATA.Manual },
        { mdcg: MDCG_DATA.MDCG_2022_5_REV1 },
        { mdcg: MDCG_DATA.MDCG_2025_6 },
        { mdcg: MDCG_DATA.MDCG_2023_4 },
        { mdcg: MDCG_DATA.MDCG_SAMD_AI },
        { mdcg: MDCG_DATA.HELSINKI_PROCEDURE }, 
        
        
      ]
    },

  /**********************  STEP 2 ****************************************/


  {   id: 'm2',
      title: 'Step 2) Establish processes and resources',
      desc: 'Read trough Art. 10: "General obligations of manufacturers". Consider if your company has or must recruit the expertise needed.',
      checklist: [

       {  t: 'Step 2.1) Set up design and manufacturing processes',
          r: 'Art. 10.1: When putting a device into service, a mfr. shall ensure that they have been designed & manufactured according to MDR.',
          e: `This step is translated by following ISO 13485, Ch 7 - Product Realization for design processes, and the entire ISO 13485 for manufacturing processes. This step prove controlled production ➔`,
          sop: TD_DATA.MF_P },
      

        { t: 'Step 2.2) Implement a risk management (RM) process',
          r: 'Art. 10.2: "Mfr shall establish, document, implement and maintain a system for RM as in Annex I - section 3."',
          e: 'This document establishes the ISO 14971 framework, used to systematically identify and control safety hazards across the product lifecycle ➔ ' ,
          sop: TD_DATA.RM }, 

        { t: '2.3) Establish a Clinical Evaluation process',
          r: '\nArt. 10.3: "Mfrs shall conduct a clinical evaluation in accordance with Art. 61 and Annex XIV, including a PMCF."',
          e: 'It outlines data collection methodology. It results in **Clinical_Evaluation_Plan_CEP.pdf** saved in **📁 6-V&V**, used to plan how to scientifically prove device safety and performance on humans.'},
          {doc: DOC_DATA.ART_61},
          {doc:DOC_DATA.AX_I},  
          {doc:DOC_DATA.AX_III}, 
          {doc: DOC_DATA.AX_XIV},
        

        { t: '2.4) Develop and maintain TD, UDI and DoC processes',
          e: 'It creates workflows for legal paperwork. It results in **Technical_File_Index.pdf** saved in **📁 TECHNICAL DOCUMENTATION (Root)**, used to organize all compliance files, assign UDI barcodes, and draft the Declaration of Conformity.' },

        { t: '2.5) Build Quality Management System',
          e: 'It acts as corporate infrastructure. It results in **QMS_Manual.pdf** saved in your **General QMS System**, used to prove overall organizational compliance and resource management to the auditor.' },

        { t: '2.6) Plan Post Market Surveillance activities',
          e: 'It establishes proactive market feedback loops. It results in **PMS_Plan.pdf** saved in **📁 7-PMS**, used to gather real-world safety data after the product is released.' },
          
        { t: '2.7) Create labelling development process, including translations',
          e: 'It controls user-facing text. It results in **Labeling_and_IFU_Pack.pdf** saved in **📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER**, used to secure legal translations and correct warning labels.' },
          
        { t: '2.8) Establish corrective action and recall process',
          e: 'It creates an emergency safety workflow. It results in **CAPA_and_Recall_Procedure.pdf** saved in your **General QMS System**, used to safely pull faulty devices off the market if injuries occur.' },
          
        { t: '2.9) Set up Vigilance process, including serious incident reporting',
          e: 'It creates a fast-track authority channel. It results in **Vigilance_Reporting_Procedure.pdf** saved in your **General QMS System**, used to legally report serious patient injuries or deaths within strict hourly deadlines.' },
          
        { t: '2.10) Define regulatory authority interaction process',
          e: 'It governs official communications. It results in **Regulatory_Interaction_Procedure.pdf** saved in your **General QMS System**, used to handle sample testing, audits, and unannounced inspections smoothly.' },
          
        { t: '2.11) Arrange legal liability and damage compensation',
          e: 'It secures financial protection. It results in **Product_Liability_Insurance_Certificate.pdf** saved in your **Corporate/Admin Archive**, used to prove financial coverage for potential patient injuries.' },
          
        { t: '2.12) Appoint PRRC to oversee regulatory compliance',
          r: 'Art. 15',
          mdcg: MDCG_DATA.MDCG_2019_7_REV1,
          e: 'It assigns individual legal responsibility. It results in **PRRC_Appointment_Letter.pdf** saved in **📁 1-DEVICE DESCRIPTION**, used to officially designate the person who signs off on device releases.' },
          
        { t: '2.13) Secure access to technical, safety, clinical, quality and regulatory expertise',
          e: 'It maps your external brain trust. It results in **External_Expertise_and_Lab_Matrix.pdf** saved in your **General QMS System**, used to prove you have qualified consultants and test labs contracted.' },
        
        { e: '💡 For guidance on clinical evaluation - go to Step 4' },



        { t: 'Guidance Documents from the MDCG' },
        { e: `UDI GUIDANCE` },
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

        { t: 'PMS GUIDANCE' },
        { mdcg: MDCG_DATA.MDCG_2025_10 },
        { mdcg: MDCG_DATA.MDCG_2022_21 },

        { t: 'VIGILANCE GUIDANCE' },
        { mdcg: MDCG_DATA.MDCG_2024_1 },
        { mdcg: MDCG_DATA.MDCG_2023_3_REV2 },

        { t: 'PRRC GUIDANCE' },
        { mdcg: MDCG_DATA.MDCG_2019_7_REV1 }
      ]  
  

},
  





  /**********************  STEP 3 ****************************************/
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
    desc: 'Define the intended purpose and risk class according to Annex VIII.',
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
    title: 'Step 10) Maintain a PMS system',
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
