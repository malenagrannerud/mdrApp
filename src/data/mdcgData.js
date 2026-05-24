/**
 * @file mdcgData.js
 * Central lagring av alla MDCG-dokument och sammanfattningar.
 */

export const MDCG_DATA = {

  /*****   STEP 1  ********/ 

  TD: {
    id: 'TD',
    title: 'Tech file',
    content: `
# Content

- Part 1 - 6  of the TD
*Records* of the pre-market phase

- Part 7 of the TD
*Plans* for the PMS phase


📁 TECHNICAL FILE PRODUCT A
├── 📁 01_Device_Description_and_Specification
│   ├── 📄 Device_Description.pdf
│   ├── 📄 Product_Variants_and_Configurations.xlsx
│   └── 📄 Technical_Specification_TDS-001.pdf
│
├── 📁 02_Design_and_Manufacturing_Information
│   ├── 📁 System_Architecture
│   │   ├── 📄 System_Architecture_Diagram.pdf
│   │   └── 📄 Software_Hardware_Interaction.pdf
│   ├── 📁 Software
│   │   ├── 📄 Software_Architecture.pdf
│   │   ├── 📄 Source_Code_Repository_Link.txt
│   │   ├── 📄 Build_Release_Notes.pdf
│   │   └── 📄 Software_Requirements_Specification_SRS.pdf
│   ├── 📁 Hardware 
│   │   ├── 📄 Hardware_Design_Schematics.pdf
│   │   ├── 📄 PCB_Layouts.pdf
│   │   └── 📄 Component_Specifications.xlsx
│   └── 📁 Manufacturing
│       ├── 📄 Manufacturing_Process.pdf
│       ├── 📄 Work_Instructions.pdf
│       └── 📄 Supplier_List_and_Control.xlsx
│
├── 📁 03_Risk_Management_and_Usability
│   ├── 📁 RMF
│   │   ├── 📄 Risk_Management_Plan.pdf
│   │   ├── 📄 Hazard_Analysis.xlsx
│   │   ├── 📄 FMEA_System_and_Software.xlsx
│   │   ├── 📄 Risk_Control_Measures.pdf
│   │   └── 📄 Residual_Risk_Evaluation.pdf
│   ├── 📁 Usability_Engineering_File
│   │   ├── 📄 Use_Specification.pdf
│   │   ├── 📄 User_Interface_Risk_Analysis.pdf
│   │   ├── 📄 Formative_Studies.pdf
│   │   └── 📄 Summative_Usability_Report.pdf
│
├── 📁 04_V&V
│   ├── 📁 Verification
│   │   ├── 📄 Verification_Plan.pdf
│   │   ├── 📄 Unit_Test_Reports.pdf
│   │   ├── 📄 Integration_Test_Reports.pdf
│   │   ├── 📄 System_Test_Reports.pdf
│   │   └── 📄 Traceability_Matrix.xlsx
│   ├── 📁 Validation
│   │   ├── 📄 Validation_Plan.pdf
│   │   ├── 📄 Clinical_Validation_Report.pdf
│   │   └── 📄 Usability_Validation_Report.pdf
│
├── 📁 05_Clinical_Evaluation
│   ├── 📄 CEP.pdf
│   ├── 📄 Literature_Review.pdf
│   ├── 📄 Clinical_Data_Analysis.pdf
    ├── 📄 CER.pdf
│
├── 📁 06_Cybersecurity_and_Data_Protection
│   ├── 📄 Threat_Modeling_Report.pdf
│   ├── 📄 Security_Risk_Assessment.pdf
│   ├── 📄 Access_Control_Design.pdf
│   ├── 📄 Encryption_and_Data_Protection.pdf
│   └── 📄 Penetration_Test_Report.pdf
│
├── 📁 07_Labeling_and_IFU
│   ├── 📄 Instructions_for_Use_IFU.pdf
│   ├── 📄 Product_Labeling.pdf
│   ├── 📄 Packaging_Design.pdf
│   └── 📄 Symbols_and_Standards_Used.pdf
│
├── 📁 08_Production_and_Process_Validation
│   ├── 📄 Process_Validation_Report.pdf
│   ├── 📄 IQ_OQ_PQ.pdf
│   └── 📄 Supplier_Validation_Reports.pdf
│
├── 📁 09_Post_Market_Surveillance
│   ├── 📄 PMS_Plan.pdf
│   ├── 📄 PMS_Report.xlsx
│   ├── 📄 Complaint_Handling_Procedure.pdf
│   ├── 📄 Vigilance_Reports.pdf
│   └── 📄 CAPA_Records.xlsx
│
├── 📁 10_Change_Control
│   ├── 📄 Change_Control_Procedure.pdf
│   ├── 📄 CR_Log.xlsx
│   ├── 📄 Impact_Assessment_Reports.pdf
│   └── 📄 Design_Update_History.pdf
│
└── 📁 11_Regulatory_and_Compliance
    ├── 📄 GSPR_Checklist.xlsx    // From DHF
    ├── 📄 DoC.pdf
    ├── 📄 ISO_13485_Certification.pdf
    ├── 📄 Risk_Management_Compliance_ISO14971.pdf
    └── 📄 Regulatory_Submissions_Dossier.pdf






`.trim()
  },





  MANUAL_BORDERLINE: {
    id: 'MANUAL-BORDERLINE-v3',
    title: 'Manual on borderline and classification under Regulations (EU) 2017/745 and 2017/746 v3',
    content: `
# Content

`.trim()
  },

  MDCG_2022_5_REV1: {
    id: 'MDCG 2022-5 Rev.1',
    title: 'Guidance on borderline between MD and medicinal products under MDR',
    content: `
# Content

`.trim()
  },

  MDCG_2021_24: {
    id: 'MDCG 2021-24',
    title: 'Guidance on classification of MD',
    content: `
# Content

`.trim()
  },

  HELSINKI_PROCEDURE: {
    id: 'HELSINKI-PROCEDURE',
    title: 'Helsinki Procedure for borderline and classification under MDR & IVDR',
    content: `
# Content

`.trim()
  },

  MDCG_SAMD_AI: {
    id: 'MDCG-SAMD-AI',
    title: 'MDCG on the classification of SAMD and the interplay with Artificial Intelligence Act (AIA)',
    content: `
    # Content
    `.trim()
  },

  INFOGRAPHIC: {
    id: 'MDCG-INFO',
    title: 'Infographic - Is your software a MD?',
    content: `
# Content

`.trim()
  },

  MDCG_2025_6: {
    id: 'MDCG 2025-6',
    title: 'FAQ on Interplay between MDR & IVDR and the AI Act (AIA)',
    content: `
# Content

`.trim()
  },

  MDCG_2023_4: {
    id: 'MDCG 2023-4',
    title: 'Medical Device Software (MDSW) - Hardware combinations',
    content: `
# Content

`.trim()
  },

  MDCG_2019_11_REV1: {
    id: 'MDCG 2019-11 Rev.1',
    title: 'Qualification and classification of software - MDR & IVDR',
    content: `
# Content

`.trim()
    },



  /*****   STEP 2  ********/ 

  MDCG_2022_7: {
    id: 'MDCG 2022-7',
    title: 'Q&A on the Unique Device Identification system under Regulation (EU) 2017/745 and Regulation (EU) 2017/746',
    content: `
# Content

`.trim()
  },

  MDCG_2021_19: {
    id: 'MDCG 2021-19',
    title: 'Guidance note integration of the UDI within an organisation\'s quality management system',
    content: `
# Content

`.trim()
  },

  MDCG_2021_10: {
    id: 'MDCG 2021-10',
    title: 'The status of Appendixes E-I of IMDRF N48 under the EU regulatory framework for medical devices',
    content: `
# Content

`.trim()
  },

  MDCG_2021_9: {
    id: 'MDCG 2021-09',
    title: 'MDCG Position Paper on the Implementation of UDI requirements for contact lenses, spectacle frames, spectacle lenses & ready readers',
    content: `
# Content

`.trim()
  },

  MDCG_2018_1_REV4: {
    id: 'MDCG 2018-1 Rev.4',
    title: 'Guidance on basic UDI-DI and changes to UDI-DI',
    content: `
# Content

`.trim()
  },

  MDCG_2020_18: {
    id: 'MDCG 2020-18',
    title: 'MDCG Position Paper on UDI assignment for Spectacle lenses & Ready readers',
    content: `
# Content

`.trim()
  },

  MDCG_2019_2: {
    id: 'MDCG 2019-2',
    title: 'Guidance on application of UDI rules to device-part of products referred to in article 1(8), 1(9) and 1(10) of Regulation 745/2017',
    content: `
# Content

`.trim()
  },

  MDCG_2019_1: {
    id: 'MDCG 2019-1',
    title: 'MDCG guiding principles for issuing entities rules on basic UDI-DI',
    content: `
# Content

`.trim()
  },

  MDCG_2018_7: {
    id: 'MDCG 2018-7',
    title: 'Provisional considerations regarding language issues associated with the UDI database',
    content: `
# Content

`.trim()
  },

  MDCG_2018_6: {
    id: 'MDCG 2018-6',
    title: 'Clarifications of UDI related responsibilities in relation to article 16',
    content: `
# Content

`.trim()
  },

  MDCG_2018_5: {
    id: 'MDCG 2018-5',
    title: 'UDI assignment to medical device software',
    content: `
# Content

`.trim()
  },

  MDCG_2018_4: {
    id: 'MDCG 2018-4',
    title: 'Definitions/descriptions and formats of the UDI core elements for systems or procedure packs',
    content: `
# Content

`.trim()
  },

  MDCG_2018_3_REV1: {
    id: 'MDCG 2018-3 Rev.1',
    title: 'Guidance on UDI for systems and procedure packs',
    content: `
# Content

`.trim()
  },

  MDCG_2025_10: {
    id: 'MDCG 2025-10',
    title: 'Guidance on post-market surveillance of medical devices and in vitro diagnostic medical devices',
    content: `
# Content

`.trim()
  },

  MDCG_2022_21: {
    id: 'MDCG 2022-21',
    title: 'Guidance on Periodic Safety Update Report (PSUR) according to Regulation (EU) 2017/745',
    content: `
# Content

`.trim()
  },

  MDCG_2024_1: {
    id: 'MDCG 2024-1',
    title: 'Device Specific Vigilance Guidance (DSVG) Template',
    content: `
# Content

`.trim()
  },

  MDCG_2023_3_REV2: {
    id: 'MDCG 2023-3 Rev.2',
    title: 'Questions and Answers on vigilance terms and concepts as outlined in the Regulation (EU) 2017/745 on medical devices and Regulation (EU) 2017/746',
    content: `
# Content

`.trim()
  },

  MDCG_2019_7_REV1: {
    id: 'MDCG 2019-7 Rev.1',
    title: 'Guidance on article 15 of the medical device regulation (MDR) and in vitro diagnostic device regulation (IVDR) on a \'person responsible for regulatory compliance\' (PRRC)',
    content: `
# Content

`.trim()
  }





}  