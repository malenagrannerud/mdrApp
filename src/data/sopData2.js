/**
 * @file sopData2.js
 * @description Core Quality Manual and Scope documentation templates for Step 2.
 */

export const SOP_DATA2 = {

  QUALITY_MANUAL: {
    id: 'DOC', 
    title: '📄 DOC-Quality_Manual.pdf', 
    version: '1.0', 
    owner: 'QA / Top Management',
    content: `

## 1. PURPOSE & CONTEXT
The purpose of this Quality Manual is to establish, document, and maintain a compliant corporate Quality Management System (QMS) that 
- Satisfies the requirements of ISO 13485:2016, 
- Medical Device Regulation (EU) 2017/745 (MDR), and 
- Applicable global data integrity standards. 

It serves as the framework for guaranteeing device safety and structural effectiveness.

## 2. SCOPE OF THE MANUAL
This manual outlines 
- the architectural structure of our QMS, 
- the interfaces between operating departments, and 
- maps corporate responsibilities across the device lifecycle from R&D through market delivery and post-market tracking.

Any exclusion of ISO 13485 requirements is detailed and justified within specific sub-procedures based on the product profile.

## 3. DEFINITIONS & ABBREVIATIONS
Device Master Record (DMR): Detailed compilation of manufacturing specifications and operational blueprints.
Design History File (DHF): Comprehensive technical records logging a device's development history.
Medical Device File (MDF): Comprehensive technical records logging a device's development history and manufacturing specifications to satisfy ISO 13485 §4.2.3 and MDR Annex II/III.
Technical Documentation (TD): Regulatory dossier demonstrating compliance with the General Safety and Performance Requirements (GSPR) of the MDR.
Quality Management System (QMS): Interlinked organizational structures, procedures, and data streams deployed to direct quality.



## 4. MANAGEMENT QUALITY POLICY
[TABLE_START]


| Pillar | Executive Directive | Regulatory Framework |
| Patient Safety | Uncompromised dedication to structural device validation and clinical benefit metrics | MDR Article 10(9) |
| Compliance | Strict preservation of harmonized standard operations across engineering and logistics | ISO 13485 §4.1 |
| Data Integrity | Commitment to traceable, attributable, and immutable logging across digital tools | FDA 21 CFR Part 11 |
[TABLE_END]

## 5. PROCESS INTERACTION MATRIX
The structural flow of corporate operations and inter-departmental process links are managed under the following layout.
[TABLE_START]


| ISO 13485 | QMS Core Process | Input  | Output |
| 4.0 | Infrastructure Foundations | Raw e-QMS deployment | Validated System Baseline |
| 5.0 | Management Audits | Field metrics & GAP inputs | Executive Resource Decisions |
| 6.0 | Competency Logging | Employee credential sweeps | Validated Training Matrix |
| 7.3 | Device Engineering | User Requirements Spec (URS) | Sealed Technical File / DHF |
| 7.4 | Supplier Qualification | Vendor certification audits | Approved Supplier List (ASL) |
| 7.5 | Manufacturing Integration | Raw master component builds | Finished Device Release Pass |
| 8.0 | Continuous Surveillance | Customer complaint data | Active CAPA Investigations |
[TABLE_END]

## 6. DOCUMENTATION OVERVIEW
The documentation architecture follows a tiered hierarchy:
- Tier 1: Quality Manual (This Document) - High-level policy and process interactions.
- Tier 2: Standard Operating Procedures (SOPs) - Departmental operational directives.
- Tier 3: Work Instructions (WIs) - Specific machine, software configuration, or batch tasks.
- Tier 4: Quality Records - Forms, batch protocols, training files, and validation reports.

## 7. APPENDICES
REG_001_Master_Document_Register.xlsx

Governing System Regulations:
SOP_001_Software_Validation.pdf
SOP_002_Document_control.pdf

## 8. REVISION HISTORY
[TABLE_START]


| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-08 | Initial corporate release of the Quality Manual | QA |
[TABLE_END]
    `.trim()
  }
};
