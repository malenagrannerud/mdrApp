/**
 * @file docData.js
 * @description Central lagring av alla dokument (TD, SOP:ar, etc.)
 */

export const DOC_DATA = {

  /*****   TECHNICAL DOCUMENTATION  ********/ 

  TD: {
    id: 'TD',
    title: 'Technical Documentation Structure',
    content: `
# Technical Documentation (Annex II & III)

## Overview
The Technical Documentation shall contain:

- Part 1-6 of the TD: **Records** of the pre-market phase
- Part 7 of the TD: **Plans** for the PMS phase

---

## TD Structure

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
│   ├── 📄 CER.pdf
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
    ├── 📄 GSPR_Checklist.xlsx
    ├── 📄 DoC.pdf
    ├── 📄 ISO_13485_Certification.pdf
    ├── 📄 Risk_Management_Compliance_ISO14971.pdf
    └── 📄 Regulatory_Submissions_Dossier.pdf

---

## Key Requirements

- **Annex II**: Technical Documentation requirements
- **Annex III**: Technical Documentation on Post-Market Surveillance
- **Article 10(4)**: Manufacturers shall establish and maintain technical documentation
    `.trim()
  },

  /*****   GSPR CHECKLIST  ********/ 

  GSPR_CHECKLIST: {
    id: 'GSPR',
    title: 'General Safety and Performance Requirements',
    content: `
# GSPR Checklist (Annex I)

## Chapter I - General Requirements

- GSPR 1: Risk management and benefit-risk ratio
- GSPR 2: Risk control and information for safety
- GSPR 3: Characteristics and performances
- GSPR 4: Undesirable side-effects
- GSPR 5: Acceptable benefit-risk ratio
- GSPR 6: Clinical evaluation
- GSPR 7: Chemical, physical and biological properties
- GSPR 8: Infection and microbial contamination
- GSPR 9: Construction and environmental properties

## Chapter II - Requirements Regarding Design and Manufacture

- GSPR 10: Measuring function
- GSPR 11: Radiation
- GSPR 12: Medical devices connected to or equipped with an energy source
- GSPR 13: Software
- GSPR 14: Active implantable devices
- GSPR 15: Protection against mechanical and thermal risks
- GSPR 16: Protection against the risks posed to the patient or user by devices supplying energy or substances
- GSPR 17: Information supplied with the device
    `.trim()
  },

  /*****   UDI SYSTEM  ********/ 

  UDI_SYSTEM: {
    id: 'UDI',
    title: 'Unique Device Identification System',
    content: `
# UDI System Requirements

## Basic UDI-DI
- Assigned per device group
- Listed on EUDAMED and certificates

## UDI-DI (Device Identifier)
- Specific to each device model
- Appears on labels and packaging

## UDI-PI (Production Identifier)
- Lot/batch number
- Serial number
- Expiration date
- Manufacturing date

## UDI Carrier
- AIDC (Automatic Identification and Data Capture)
- HRI (Human Readable Interpretation)
- Placed on label or device itself
    `.trim()
  }
};