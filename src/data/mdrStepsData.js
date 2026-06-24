/**
 * @file mdrStepsData.js
 * @description Regulatoriska steg för MDR-efterlevnad.
 * 
 */

/**
 * t: output: vad du ska göra kort
 * e: beskrive vad outputen gör och vad den används till 
 */

import { MDCG_DATA } from './mdcgData.js';
import { DOC_DATA } from './docData.js';
import { TD_DATA } from './tdData.js';

export const MDR_DATA = [

/***********************  STEP 0 ****************************************/
{  id: 'm0',
    title: 'Introduction',
    desc: 'A Roadmap to CE Marking Medical Devices According to MDR 2017/745',
    checklist: [
      { t: 'OVERVIEW',
        e: `This introduction step will provide an empty file structure, to be be filled with required documents as the steps progresses. 
Folder names come from the MDR Annex II & III. Folders 1-6 contains records from the pre market phase, and folder 7 contains plans for PMS activities.` }, 

      {t: 'Resulting File Structure', 
       e: `
📁 PRODUCT X
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
    {     id: 'm1',
      title: 'Step 1) Decide the intended use and classification',
      checklist: [

        {t: ' '}, 
    
        { t: 'Step 1.1) Compile the Qualification Rationale ', 
          r: 'Art. 2(1): Contains the definition of a medical device. ',
          e: `This rationale proves that the product is eligible for, and must carry, a CE mark according to MDR.`},
       
        { t: 'Step 1.2) Compile the Statement of Intended Purpose ', 
          r: 'Art. 2(1): Contains the definition of a medical device. ',
          e: `This statement defines what the product does, who it is for, and how it cures or treats a medical condition.`},
        
        { t: 'Step 1.3) Compile the Device Classification Rationale', 
          r: 'Annex VIII: Go trough the rules to determine risk class.',
          e: `This statement justifies risk class (I, IIa, IIb, III) which will determine if a NB must audit the product. 
          
          Step 1.1), 1.2) and 1.3) result in the document ➔`, 
          sop: TD_DATA.DD},

        { t: ' ', 
          e: `💡 If you can not classify the future product: request a decision from the CA according to the Helsinki Procedure.`}, 

        {t: 'Resulting File Structure', 
         e: `
  📁 PRODUCT X
  📁 TECHNICAL DOCUMENTATION
    📁 1-DEVICE DESCRIPTION
    📄 Device_description_and_rationale.pdf
    📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
    📁 3-DESIGN & MANUFACTURING INFO
    📁 4-GSPR 
    📁 5-RISK MANAGEMENT 
    📁 6-V&V
    📁 7-PMS `,}, 
        
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
  { id: 'm2',
    title: 'Step 2) Establish processes and resources',
    desc: 'This step establishes the corporate infrastructure and processes required to comply with MDR ',
    checklist: [
       
      { t: ' ', 
        e: `For the following steps, read trough Art. 10: "General obligations of manufacturers". Consider if your company has or must recruit the expertise needed.`,},

        { t: 'Step 2.1) Set up design and manufacturing processes',
        r: 'Art. 10.1 & 10.9(g): "When putting a device into service, a mfr. shall ensure that they have been designed & manufactured according to MDR."',
        e: `This step is translated by following ISO 13485, Ch 7 - Product Realization for design processes, and the entire ISO 13485 for manufacturing processes. This step prove controlled production ➔`,
        sop: TD_DATA.MF_P },
      
        { t: 'Step 2.2) Implement a risk management (RM) process',
        r: 'Art. 10.2 & Annex I Ch. I (2-9)',
        e: `This document establishes the ISO 14971 framework to identify and control hazards across the lifecycle. It must integrate post-market data (Art. 83-86) and include a dedicated human factors/usability sub-process following EN 62366 ➔ `,
        sop: TD_DATA.RM },

        { t: 'Step 2.3) Establish a Clinical Evaluation Process (CEP)',
        r: 'Art. 10.3, Art. 61 & Annex XIV Part A',
        e: `This document defines a 5-stage methodology (Plan, Identify, Appraise, Analyse, Report) based on Annex XIV and MEDDEV 2.7/1. It must explicitly govern the Clinical Evaluation Plan (CEP), PMCF Plan, and PMCF Evaluation Reports ➔ `,
        sop: TD_DATA.CLIN_EVAL},

        { t: 'Step 2.4) Develop and maintain TD, UDI and DoC processes',
        r: 'Art. 10.4, 10.6, 10.7 & 10.8',
        e: `Use the 7-chapter structure as a project deliverables tracker on the critical path. The process must enforce a final alignment check for vocabulary and state-of-the-art arguments, alongside a change history log for NB compliance ➔ `,
        sop: TD_DATA.TD_PROCESS },

      { t: 'Step 2.5) Build a Quality Management System (QMS) manual',
        r: 'Art. 10.9',
        e: `Non-product specific document. Created in QMS path. See QMS path ➔ Step 0` }, 

      { t: 'Step 2.6) Plan PMS activities',
        r: 'Art. 10.10',
        e: 'This document establishes proactive market feedback loops, used to gather real-world safety data after the product is released ➔ ',
        sop: TD_DATA.PMS_PROCESS  },

      { t: 'Step 2.7) Create labelling development process, including translations',
        r: 'Art. 10.11',
        e: `Non-product specific process. Created in QMS path. See QMS path ➔ Step 2` },

      { t: 'Step 2.8) Establish corrective action and recall process',
        r: 'Art. 10.12',
        e: `Non-product specific process. Created in QMS path. See QMS path ➔ Step 3` }, 

      { t: 'Step 2.9) Set up Vigilance process, including serious incident reporting',
        r: 'Art. 10.13',
        e: `Non-product specific process. Created in QMS path. See QMS path ➔ Step 3` }, 

      {  t: 'Step 2.10) Define regulatory authority interaction process',
        r: 'Art. 10.14',
        e: `Non-product specific process. Created in QMS path. See QMS path ➔ Step 2` }, 

      { t: 'Step 2.11) Arrange legal liability and damage compensation',
        r: 'Art. 10.16',
        e: `Non-product specific setup. Maintained in corporate archive. See QMS path ➔ Step 2` }, 

      { t: 'Step 2.12) Appoint PRRC to oversee regulatory compliance',
        r: 'Art. 15',
        e: 'This document assigns individual legal responsibility, used to officially designate the person who signs off on device releases ➔ ',
        sop: TD_DATA.PRRC_APPOINT },

      { t: 'Step 2.13) Secure access to technical, safety, clinical, quality and regulatory expertise',
        e: `Non-product specific matrix. Maintained in corporate HR/Vendor records. See QMS path ➔ Step 2` }, 

      { t: ' ',
        e: '💡 For guidance on clinical evaluation - go to Step 4' },

      { t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT X
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
      📁 4-GSPR 
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf `,},
        
      { t: 'Guidance Documents from the MDCG' },
      { t: ' ', 
        e: 'UDI GUIDANCE'  },
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

      { t: ' ', 
        e: 'PMS GUIDANCE' },
      { mdcg: MDCG_DATA.MDCG_2025_10 },
      { mdcg: MDCG_DATA.MDCG_2022_21 },

      { t: ' ', 
        e: 'VIGILANCE GUIDANCE' },
      { mdcg: MDCG_DATA.MDCG_2024_1 },
      { mdcg: MDCG_DATA.MDCG_2023_3_REV2 },

      { t: ' ', 
        e: 'PRRC GUIDANCE'  },
      { mdcg: MDCG_DATA.MDCG_2019_7_REV1 }
    ]  
  },
    /**********************  STEP 3 ****************************************/
  {
    id: 'm3',
    title: 'Step 3) Minimise the risks and fulfil the GSPR',
    desc: 'All devices must comply with the general safety and performance requirements set out in MDR Annex I.',
    checklist: [
      
      { 
        t: 'Step 3.1) Execute risk management activities and benefit-risk evaluation',
        r: 'Art. 5.2, Annex I Ch. I',
        e: `This activity updates the product safety profiles. It ensures that all design hazards are reduced as far as possible and legally outweighed by the claimed medical benefits ➔ `,
        sop: TD_DATA.RM 
      },

      { 
        t: 'Step 3.2) Compile the GSPR checklist and applicability matrix',
        r: 'Annex I Ch. II',
        e: `This document creates a requirements checklist, mapping every applicable Annex I requirement to specific development testing evidence and design parameters ➔ `,
        sop: TD_DATA.GSPR_MATRIX 
      },

      { 
        t: 'Step 3.3) Map harmonised standards and EU common specifications',
        r: 'Art. 8 & Art. 9',
        e: `This activity identifies and applies the official EN, CENELEC, and common specification standards published in the Official Journal of the EU to prove state-of-the-art compliance.` 
      },

      { 
        t: 'Step 3.4) Verify compliance with other applicable EU directives',
        r: 'MDR Core Mandate',
        e: `This activity tracks environmental and chemical safety regulations, ensuring environmental compliance for batteries or health and safety controls for hazardous substances.` 
      },

      { 
        t: 'Step 3.5) Finalize labeling, instructions for use, and high-risk database summaries',
        r: 'Annex I Ch. III, Art. 18 & Art. 32',
        e: `This pack compiles all user-facing information, instructions for use (IFU), and carton labels, including implant cards and Summaries of Safety and Clinical Performance (SSCP) for Class III devices ➔ `,
        sop: TD_DATA.LABEL_PACK 
      },

      { 
        t: 'Step 3.6) Compile the post-market surveillance plan for the device',
        r: 'Art. 84 & Annex III Sec. 1.1',
        e: `This document establishes the proactive data-gathering framework required to continuously monitor and re-validate product safety after commercial launch ➔ `,
        sop: TD_DATA.PMS_PROCESS 
      },

      { 
        t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT X
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
        📄 Labeling_and_IFU_Pack_product_X.pdf
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
      📁 4-GSPR 
        📄 GSPR_compliance_matrix_product_X.xlsx
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf `,
      },

      { t: 'Guidance Documents from the MDCG & SCHEER' },
      { mdcg: MDCG_DATA.MDCG_2024_13 },
      { mdcg: MDCG_DATA.MDCG_2021_8 },
      { mdcg: MDCG_DATA.MDCG_2021_11 },
      { mdcg: MDCG_DATA.MDCG_2021_5_REV1 },
      { mdcg: MDCG_DATA.MDCG_2019_16_REV1 },
      { mdcg: MDCG_DATA.MDCG_2019_8_REV2 },
      { mdcg: MDCG_DATA.SCHEER_GUIDELINES }
    ]
  },

  /**********************  STEP 4 ****************************************/
  {
    id: 'm4',
    title: 'Step 4) Complete the clinical evaluation',
    desc: 'All devices must fulfil the clinical requirements of Article 61 and Part A of Annex XIV to demonstrate performance and safety.',
    checklist: [
      
      { 
        t: 'Step 4.1) Author and update the Clinical Evaluation Plan (CEP)',
        r: 'Art. 5.3 & Annex XIV Part A 1(a)',
        e: `This document locks down the initial planning stage. It defines the methodology, data search criteria, and establishes endpoints for sufficient clinical evidence ➔ `,
        sop: TD_DATA.CLIN_EVAL 
      },

      { 
        t: 'Step 4.2) Appraise literature and evaluate data for equivalence or novelty',
        r: 'Art. 61.3 & Annex XIV Part A',
        e: `This activity systematically searches, identifies, and appraises relevant scientific literature and alternative treatment options to determine data sufficiency or gaps.` 
      },

      { 
        t: 'Step 4.3) Compile Clinical Investigation documentation if trial data is required',
        r: 'Art. 62-81 & Annex XV',
        e: `This documentation package governs human trials. It compiles the Investigator's Brochure, Clinical Investigation Plan, and submission forms required for high-risk or novel devices.` 
      },

      { 
        t: 'Step 4.4) Author the final Clinical Evaluation Report (CER)',
        r: 'Art. 61.11 & Annex XIV Part A 4',
        e: `This report documents the final analysis of all clinical data. It provides the core scientific proof that the device achieves its claimed medical benefits and operates safely ➔ `,
        sop: TD_DATA.CER_REPORT 
      },

      { 
        t: 'Step 4.5) Establish the Post-Market Clinical Follow-up (PMCF) plan',
        r: 'Annex XIV Part B 6',
        e: `This plan outlines the post-launch clinical data collection lifecycle. It schedules proactive studies and registry tracking to gather continuous safety data over the lifespan of the device ➔ `,
        sop: TD_DATA.PMCF_PLAN 
      },

      { 
        t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT A
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
        📄 Labeling_and_IFU_Pack_product_X.pdf
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
      📁 4-GSPR 
        📄 GSPR_compliance_matrix_product_X.xlsx
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
        📄 CER_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf
        📄 PMCF_plan_product_X.pdf `,
      }, 

      { t: 'Guidance Documents from the MDCG' },
      { e: 'CLINICAL EVALUATION GUIDANCE' },
      { mdcg: MDCG_DATA.MDCG_2024_10 },
      { mdcg: MDCG_DATA.MDCG_2020_6 },
      { mdcg: MDCG_DATA.MDCG_2020_5 },
      { mdcg: MDCG_DATA.MDCG_2020_1 },
      { mdcg: MDCG_DATA.MDCG_2019_9_REV1 },
      { mdcg: MDCG_DATA.MDCG_2019_3_REV1 },
      
      { e: 'CLINICAL INVESTIGATIONS GUIDANCE' },
      { mdcg: MDCG_DATA.MDCG_2024_15 },
      { mdcg: MDCG_DATA.MDCG_2024_5 },
      { mdcg: MDCG_DATA.MDCG_2024_5_APP_A },
      { mdcg: MDCG_DATA.MDCG_2024_3 },
      { mdcg: MDCG_DATA.MDCG_2024_3_APP_A },
      { mdcg: MDCG_DATA.MDCG_2023_7 },
      { mdcg: MDCG_DATA.MDCG_2021_28 },
      { mdcg: MDCG_DATA.MDCG_2021_20 },
      { mdcg: MDCG_DATA.MDCG_2021_8 },
      { mdcg: MDCG_DATA.MDCG_2021_6_REV1 },
      { mdcg: MDCG_DATA.MDCG_2020_10_1_REV1 },
      { mdcg: MDCG_DATA.MDCG_2020_10_2_REV1 },

      { e: 'POST MARKET CLINICAL FOLLOW-UP GUIDANCE' },
      { mdcg: MDCG_DATA.MDCG_2020_8 },
      { mdcg: MDCG_DATA.MDCG_2020_7 }
    ]
  },



    /**********************  STEP 5 ****************************************/

  /**********************  STEP 5 ****************************************/
  {
    id: 'm5',
    title: 'Step 5) Compile the technical documentation',
    desc: 'Organize and present all generated data from previous steps to demonstrate compliance with MDR Annex II and Annex III.',
    checklist: [
      
      { 
        t: 'Step 5.1) Compile the Technical Documentation checklist and index',
        r: 'Annex II',
        e: `This file acts as the master index and contents table for the pre-market phase, providing an audited roadmap over folders 1–6 to prove the device is safe and performs as intended ➔ `,
        sop: TD_DATA.TF_INDEX 
      },

      { 
        t: 'Step 5.2) Assign Basic UDI-DI and establish the UDI traceability plan',
        r: 'Art. 27 & Annex VI Part C',
        e: `This document defines the unique device identification barcode structures, enabling full data tracking, scanning, and device allocation across the European Union market ➔ `,
        sop: TD_DATA.UDI_PLAN 
      },

      { 
        t: 'Step 5.3) Compile the Technical Documentation on post-market surveillance',
        r: 'Annex III',
        e: `This file acts as the master index for the post-market phase, structuring folder 7 into active surveillance logs, data analytics channels, and mandatory safety update plans ➔ `,
        sop: TD_DATA.PMS_PROCESS 
      },

      { t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT A
    📄 Technical_File_Index_product_X.pdf
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
        📄 UDI_and_Traceability_Plan_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
        📄 Labeling_and_IFU_Pack_product_X.pdf
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
      📁 4-GSPR 
        📄 GSPR_compliance_matrix_product_X.xlsx
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
        📄 Clinical_Evaluation_Report_CER_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf
        📄 PMCF_plan_product_X.pdf `,
      }, // KORRIGERING: Endast de 2 nya filerna från detta steg har adderats till trädet på sina exakta platser.

      { t: 'Guidance Documents from the MDCG' },
      { mdcg: MDCG_DATA.MDCG_2022_7 },
      { mdcg: MDCG_DATA.MDCG_2021_19 },
      { mdcg: MDCG_DATA.MDCG_2021_10 },
      { mdcg: MDCG_DATA.MDCG_2021_09 },
      { mdcg: MDCG_DATA.MDCG_2018_1_REV4 },
      { mdcg: MDCG_DATA.MDCG_2020_18 },
      { mdcg: MDCG_DATA.MDCG_2019_2 },
      { mdcg: MDCG_DATA.MDCG_2019_1 },
      { mdcg: MDCG_DATA.MDCG_2018_7 },
      { mdcg: MDCG_DATA.MDCG_2018_6 },
      { mdcg: MDCG_DATA.MDCG_2018_5 },
      { mdcg: MDCG_DATA.MDCG_2018_4 },
      { mdcg: MDCG_DATA.MDCG_2018_3_REV1 }
    ]
  },


    /**********************  STEP 6 ****************************************/
  /**********************  STEP 6 ****************************************/
  {
    id: 'm6',
    title: 'Step 6) Arrange distribution',
    desc: 'Establish compliant European distribution channels and define obligations for Authorized Representatives, Importers, and Distributors.',
    checklist: [
      
      { 
        t: 'Step 6.1) Map and establish distributor compliance information loops',
        r: 'Art. 14',
        e: `This activity defines the workflows with European distributors, ensuring they actively verify device conformity and establish dual-channel communication for reporting complaints and serious incidents.` 
      },

      { 
        t: 'Step 6.2) Appoint an EU Authorised Representative (Foreign manufacturers only)',
        r: 'Art. 11',
        e: `This mandate legally appoints your representative within the EU to act on your behalf in front of the Authorities, defining their exact scope and regulatory mandate.` 
      },

      { 
        t: 'Step 6.3) Appoint the primary EU Importer and align registration data',
        r: 'Art. 13',
        e: `This activity secures a registered Importer into the EU who must verify compliance, register with Authorities, log customer complaints, and report serious incidents.` 
      },

      { 
        t: 'Step 6.4) Compile the final distribution agreements and traceability matrix',
        r: 'Art. 11, 13 & 14',
        e: `This document records the legal entities fulfilling the roles of AR, Importer, and Distributor, tracking how data flows to maintain the device state-of-the-art ➔ `,
        sop: TD_DATA.DIST_MATRIX 
      },

      { t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT A
    📄 Technical_File_Index_product_X.pdf
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
        📄 UDI_and_Traceability_Plan_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
        📄 Labeling_and_IFU_Pack_product_X.pdf
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
        📄 Distribution_and_traceability_matrix_product_X.pdf
      📁 4-GSPR 
        📄 GSPR_compliance_matrix_product_X.xlsx
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
        📄 Clinical_Evaluation_Report_CER_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf
        📄 PMCF_plan_product_X.pdf `,
      }, // KORRIGERING: Endast den nya matrisen har lagts till i Mapp 3 i filträdet.

      { t: 'Guidance Documents from the MDCG' },
      { mdcg: MDCG_DATA.MDCG_2025_4 },
      { mdcg: MDCG_DATA.MDCG_2022_16 },
      { mdcg: MDCG_DATA.MDCG_2021_27 },
      { mdcg: MDCG_DATA.MDCG_2021_26 }
    ]
  },

  /**********************  STEP 7 ****************************************/
  { id: 'm7',
    title: 'Step 7) Register the device and the manufacturer',
    desc: 'Register economic operators to obtain an SRN and upload required device and UDI data module elements to EUDAMED.',
    checklist: [
      
      { t: 'Step 7.1) Submit economic operator data to obtain the Single Registration Number (SRN)',
        r: 'Art. 31 & Annex VI Part A Sec. 1',
        e: `This activity initiates actor registration. It submits establishment profiles to national competent authorities to validate and issue your mandatory SRN ➔ `,
        sop: TD_DATA.EUDAMED_REC },

      { 
        t: 'Step 7.2) Select European Medical Device Nomenclature (EMDN) codes and map device listing elements',
        r: 'Art. 29 & Annex VI Part A Sec. 2',
        e: `This activity assigns official nomenclature codes, auditing device classifications and structural listing properties required for public cataloging ➔ `,
        sop: TD_DATA.EMDN_DATA 
      },

      { 
        t: 'Step 7.3) Upload final UDI data elements to the EUDAMED database module',
        r: 'Art. 29 & Annex VI Part B',
        e: `This activity enters the spired Basic UDI-DI and specific device identification attributes into the central system before launching conformity assessment.` 
      },

      { 
        t: 'Step 7.4) Evaluate Class I criteria for direct step bypass rules',
        r: 'Art. 52.7',
        e: `This check verifies if the device is a non-sterile, non-reusable, and non-measuring Class I unit. If all conditions match, bypass Step 8 and proceed directly to Step 9.` 
      },

      { t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT A
    📄 Technical_File_Index_product_X.pdf
    📄 EUDAMED_SRN_and_Registration_Record_product_X.pdf
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
        📄 UDI_and_Traceability_Plan_product_X.pdf
        📄 EMDN_and_Device_Listing_Data_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
        📄 Labeling_and_IFU_Pack_product_X.pdf
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
        📄 Distribution_and_traceability_matrix_product_X.pdf
      📁 4-GSPR 
        📄 GSPR_compliance_matrix_product_X.xlsx
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
        📄 Clinical_Evaluation_Report_CER_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf
        📄 PMCF_plan_product_X.pdf `,
      }, 

      { t: 'Guidance Documents from the MDCG' },
      { e: 'EUROPEAN MEDICAL DEVICE NOMENCLATURE (EMDN) GUIDANCE' },
      { mdcg: MDCG_DATA.MDCG_2025_1 },
      { mdcg: MDCG_DATA.MDCG_2024_2_REV1 },
      { mdcg: MDCG_DATA.MDCG_2021_12_REV1 },
      
      { e: 'EUDAMED MODULE REGISTRATION GUIDANCE' },
      { mdcg: MDCG_DATA.EUDAMED_GRADUAL_ROLLOUT },
      { mdcg: MDCG_DATA.MDCG_2021_13_REV1 },
      { mdcg: MDCG_DATA.MDCG_2021_1_REV1 },
      { mdcg: MDCG_DATA.MDCG_2020_15 },
      { mdcg: MDCG_DATA.MDCG_2019_5 },
      { mdcg: MDCG_DATA.MDCG_2019_4 }
    ]
  },

      /**********************  STEP 8 ****************************************/
  { id: 'm8',
    title: 'Step 8) Complete the conformity assessment',
    desc: 'Select an authorized Notified Body and pass the mandatory QMS and technical documentation audits to secure official EU compliance certification.',
    checklist: [
      
      { t: 'Step 8.1) Evaluate alternative conformity assessment routes and select a Designated Notified Body via NANDO',
        r: 'Art. 52',
        e: `This activity audits Notified Body capabilities using the EU Commission's NANDO database to ensure the chosen registrar is designated for your product code and risk tier.` },

      { t: 'Step 8.2) Execute full quality management system assessment under Annex IX Chapter I criteria',
        r: 'Annex IX Ch. I',
        e: `This audit verifies compliance across the manufacturer's corporate quality workflows. Success yields the official EU Quality Management System Certificate ➔ `,
        sop: TD_DATA.QMS_CERT },

      { t: 'Step 8.3) Pass product-specific Technical Documentation review under Annex IX Chapter II parameters',
        r: 'Annex IX Ch. II',
        e: `This audit assesses the product-specific technical file (folders 1–6). Success yields the official EU Technical Documentation Assessment Certificate ➔ `,
        sop: TD_DATA.TD_CERT },

      { t: 'Step 8.4) Implement alternative assessment certification routes for outsourced or custom-made devices if applicable',
        r: 'Annex X, XI & XIII',
        e: `This fallback check tracks special routes (EU type-examination certificates via Annex X, or Product Verification certificates via Annex XI Part B, or Custom-Made controls via Annex XIII).` },

      { t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT A
    📄 Technical_File_Index_product_X.pdf
    📄 EUDAMED_SRN_and_Registration_Record_product_X.pdf
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
        📄 UDI_and_Traceability_Plan_product_X.pdf
        📄 EMDN_and_Device_Listing_Data_product_X.pdf
        📄 MDR_EU_QMS_Certificate_product_X.pdf
        📄 MDR_EU_Technical_Documentation_Certificate_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
        📄 Labeling_and_IFU_Pack_product_X.pdf
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
        📄 Distribution_and_traceability_matrix_product_X.pdf
      📁 4-GSPR 
        📄 GSPR_compliance_matrix_product_X.xlsx
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
        📄 Clinical_Evaluation_Report_CER_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf
        📄 PMCF_plan_product_X.pdf `,
      } // KORRIGERING: Endast de 2 nya certifikatsfilerna från detta steg har adderats till Mapp 1.
    ]
  },
/**********************  STEP 9 ****************************************/
  { id: 'm9',
    title: 'Step 9) Complete the final administrative procedures before launch',
    desc: 'Finalize legal declarations, complete national language packaging requirements, and verify importer/distributor operational records.',
    checklist: [
      
      { t: 'Step 9.1) Finalize and sign the official EU Declaration of Conformity',
        r: 'Annex IV & Annex VI Sec. 2.2',
        e: `This document establishes the sole legal responsibility of the manufacturer. It must include all required language versions for target distribution countries before commercialization ➔ `,
        sop: TD_DATA.DOC_CONF },

      { t: 'Step 9.2) Finalize manufacturer registration and transfer technical tokens to the Authorised Representative',
        r: 'Art. 11',
        e: `This activity transfers the finalized Technical Documentation, Notified Body certificates, and registration confirmations to the EU AR to enable their mandatory mandate listing.` },

      { t: 'Step 9.3) Provide the designated EU Importer with the signed DoC and device labeling data',
        r: 'Art. 13',
        e: `This transfer provides the Importer with verified artwork, UDI parameters, and signed legal declarations required for custom borders and regulatory lot tracking.`  },

      { t: 'Step 9.4) Deliver localized language packaging, instructions, and importer data to supply chain Distributors',
        r: 'Art. 14',
        e: `This activity verifies that initial supply chain distributors receive national language versions of the packaging, instructions for use (IFU), and correct Importer address attachments.`  },

      { t: 'Step 9.5) Publish localized packaging artwork and technical instructions on the corporate website',
        r: 'Annex I Sec. 23.1',
        e: `This action uploads and publishes all target national language iterations of the device instructions and labeling to the public corporate website.` },

      { t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT A
    📄 Technical_File_Index_product_X.pdf
    📄 EUDAMED_SRN_and_Registration_Record_product_X.pdf
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
        📄 UDI_and_Traceability_Plan_product_X.pdf
        📄 EMDN_and_Device_Listing_Data_product_X.pdf
        📄 MDR_EU_QMS_Certificate_product_X.pdf
        📄 MDR_EU_Technical_Documentation_Certificate_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
        📄 Labeling_and_IFU_Pack_product_X.pdf
        📄 Signed_EU_Declaration_of_Conformity_product_X.pdf
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
        📄 Distribution_and_traceability_matrix_product_X.pdf
      📁 4-GSPR 
        📄 GSPR_compliance_matrix_product_X.xlsx
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
        📄 Clinical_Evaluation_Report_CER_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf
        📄 PMCF_plan_product_X.pdf `,
      }, // KORRIGERING: Endast den slutgiltiga guld-filen (Signed DoC) har adderats till Mapp 2 i filträdet.

      { t: 'Guidance Documents from the MDCG' },
      { mdcg: MDCG_DATA.MDCG_LANGUAGE_REQUIREMENTS }
    ]
  },
/**********************  STEP 10 ****************************************/
  {
    id: 'm10',
    title: 'Step 10) Fulfil the ongoing obligations in the post launch phase',
    desc: 'Maintain continuous compliance, execute proactive post-market clinical follow-ups, and manage lifecycle vigilance reporting requirements.',
    checklist: [
      { t: '10.1) The benefit-risk determination has been reviewed', 
        e: `Maintain the risk management system according to Annex I, Section 3. Ensure that real-world performance data is fed back to re-verify product safety profiles (Art. 10.2).` },

      { t: '10.2) PMCF is being performed and the clinical evaluation is being updated', 
        e: `Conduct the planned PMCF activities according to Annex XIV, Part B. Use real-world outcomes to update the Clinical Evaluation Report (Art. 10.3).` },

      { t: '10.3) Up-to-date technical documentation, including AR’s copy and history of changes', 
        e: `Technical documentation must be kept up to date according to Annex II and III. Maintain a full history log of changes for national authority audits (Art. 10.4 & 10.8).` },

      { t: '10.4) The QMS covers all required processes and is being reviewed and updated', 
        e: `Keep the QMS updated and continuously improve it; (a) to ensure that the manufactured product continues to comply with the requirements, including any changes in harmonized standards, and (b) that the multiple procedures and systems required by the Regulation (listed a to m) remain effective and compliant (Article 10.9).` },

      { t: '10.5) PMS activities are taking place with the required scope', 
        e: `Maintain PMS activities according to Art. 83, paying particular attention to the interfaces listed in paragraph 3 a–h. Compile periodic safety files based on risk class ➔ `,
        sop: TD_DATA.PSUR_REPORT }, 

      { t: '10.6) Deviations and complaints are investigated, corrective actions are taken to address nonconformities, and appropriate parties are informed', 
        e: `Take corrective actions for non-compliant products, and inform distributors, the AR, and the importer. Immediately inform competent authorities and the NB about products presenting a serious risk (Art. 10.12).` },

      { t: '10.7) Incidents are investigated and serious incidents are reported within the required time', 
        e: `Report all serious incidents to the authorities no later than 15 days after becoming aware of them. Report all field safety corrective actions (FSCA), preferably before the action is taken, as well as changes in trends for other incidents, all as described in Articles 87 and 88 (Article 10.13) ➔ `,
        sop: TD_DATA.VIGILANCE_LOG }, 

      { t: '10.8) The PRRC is carrying out their duties', 
        e: `Ensure the Person Responsible for Regulatory Compliance (PRRC) systematically oversees batch release conformity, technical documentation maintenance, and fast-track post-market vigilance tasks (Article 15).` },
      
      { t: '10.9) Traceability of supply', 
        e: `Maintain traceability records for all products received or supplied to other economic operators (e.g., importers or distributors) or supplied to health institutions or healthcare professionals (Art. 25.2).` },
      
      { t: '10.10) Updating or confirming registration data', 
        e: `Update EUDAMED within one week of any changes to the registration data and reconfirm the accuracy of the data every second year (Art. 31.4 and 31.5).` },

      { t: 'Resulting File Structure', 
        e: `
  📁 PRODUCT X
    📄 Technical_File_Index_product_X.pdf
    📄 EUDAMED_SRN_and_Registration_Record_product_X.pdf
    📁 TECHNICAL DOCUMENTATION
      📁 1-DEVICE DESCRIPTION
        📄 Device_description_&_rationale_product_X.pdf
        📄 PRRC_appointment_&_mandate_letter_product_X.pdf
        📄 UDI_and_Traceability_Plan_product_X.pdf
        📄 EMDN_and_Device_Listing_Data_product_X.pdf
        📄 MDR_EU_QMS_Certificate_product_X.pdf
        📄 MDR_EU_Technical_Documentation_Certificate_product_X.pdf
      📁 2-INFO TO BE SUPPLIED BY THE MANUFACTURER
        📄 Labeling_and_IFU_Pack_product_X.pdf
        📄 Signed_EU_Declaration_of_Conformity_product_X.pdf
      📁 3-DESIGN & MANUFACTURING INFO
        📄 Manufacturing_process_description_product_X.pdf
        📄 Distribution_and_traceability_matrix_product_X.pdf
      📁 4-GSPR 
        📄 GSPR_compliance_matrix_product_X.xlsx
      📁 5-RISK MANAGEMENT 
        📄 RM_procedure_product_X.pdf
      📁 6-V&V
        📄 CEP_product_X.pdf
        📄 Clinical_Evaluation_Report_CER_product_X.pdf
      📁 7-PMS 
        📄 PMS_procedure_product_X.pdf
        📄 PMCF_plan_product_X.pdf
        📄 PSUR_Report_product_X.pdf
        📄 Periodic_Vigilance_and_Trend_Log_product_X.pdf `,
      }, 
        
      { t: 'Guidance Documents from the MDCG & Templates' },
      { e: 'SUPPLY CHAIN INTERRUPTION GUIDANCE' },
      { mdcg: MDCG_DATA.MDCG_2024_16 },
      { mdcg: MDCG_DATA.MDCG_2024_16_ANNEX },
      { mdcg: MDCG_DATA.MDCG_SUPPLY_Q_A_REV1 },

      { e: 'POST MARKET SURVEILLANCE GUIDANCE' },
      { mdcg: MDCG_DATA.MDCG_2022_21 },

      { e: 'VIGILANCE & REPORTING FORMS' },
      { mdcg: MDCG_DATA.MDCG_2024_1 },
      { mdcg: MDCG_DATA.MDCG_2023_3_REV2 },
      { mdcg: MDCG_DATA.MIR_FORM_V7_3_1 },
      { mdcg: MDCG_DATA.MIR_DATABASE_XSD_XSL },
      { mdcg: MDCG_DATA.MIR_HELPTEXT },
      { mdcg: MDCG_DATA.FSCA_REPORT_V2_11 },
      { mdcg: MDCG_DATA.FSN_TEMPLATE_REV1 },
      { mdcg: MDCG_DATA.FSN_CUSTOMER_REPLY_REV1 },
      { mdcg: MDCG_DATA.FSN_DISTRIBUTOR_REPLY_REV1 },
      { mdcg: MDCG_DATA.FSN_Q&A },
      { mdcg: MDCG_DATA.TREND_REPORT_V12_11 },
      { mdcg: MDCG_DATA.PSR_FORM_V12_11 }
    ]  
  }
];