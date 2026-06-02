/**
 * @file qmsStepsData.js
 * @description Central Roadmap structure that imports templates from qmsSopData.
 */
import { SOP_DATA1 } from './sopData1.js';
import { SOP_DATA5 } from './sopData5.js';
import { SOP_DATA6 } from './sopData6.js';
export const QMS_DATA = [

/************************************************** STEP 0 ********************************************/
{  id: 'q0',
    title: 'Implementing a QMS',
    desc: 'An ISO 13485 and MDR-compliant structure for manufacturers.',
    checklist: [
      { t: 'Project Overview',
        e: `This roadmap provides deliverables and templates to build a compliant QMS. 
        The start is an empty file structure, that will be filled with clickable example SOPs, registers, and records, as steps proceeds.`},
      { t: 'Resulting File Structure', 
        e: `
    
📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: []
      }
  ]
},

/************************************************** STEP 1 ********************************************/
{   id: 'step1', 
    title: 'Step 1) Set Up an Initial System ', 
    desc: 'Solidify essential foundations for an ISO 13485 & MDR compliant system by validating documentation software & controlling documents.',
    checklist: [
      {t:'1.1) Create a SOP for Software Validation ', 
       e: 'Create a SOP for validating the software used to manage QMS documentation and records. This ensures that the tools themselves are compliant and reliable → ',
       sop: SOP_DATA1.SOP_SW_VAL,
      },
      {t:'1.2) Create a SOP for Document Control', 
       sop: SOP_DATA1.SOP_DOC_CONTROL},

      {t:'Resulting File Structure', 
       e: `

📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: {'1-SCOPE': [
            { sop: SOP_DATA1.SOP_SW_VAL, indent: '    ' }, 
            { sop: SOP_DATA1.SOP_DOC_CONTROL, indent: '    ' }
          ]
        }
      }
    ]
},

/************************************************** STEP 2 ********************************************/
    { id: 'step2', 
      title: 'Step 2) Quality Manual & Scope', 
      desc: 'Define what the system covers and how it relates to legal requirements.',
      checklist: [
        { t: '2.1) Quality Manual ', 
          e: 'The manual describing how the organization meets ISO 13485 and MDR.' },
        { t: '2.2) QMS Scope & Exclusions', 
          e: 'Documentation of what the QMS covers and which parts of ISO 13485 are not applicable.' },
        { t: 'Resulting File Structure', 
          e: `
    
📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: []
        }       
      ]
    },
/************************************************** STEP 3 ********************************************/
    { id: 'step3', 
      title: 'Step 3) Management Responsibility & Planning', 
      desc: 'Ensure management commitment and that a compliance plan is in place.',
      checklist: [
        { t: '3.1) Quality Policy & Objectives ', 
          e: 'Signed policy and measurable quality objectives.' },
        { t: '3.2) Roles & PRRC ', 
          e: 'Appointment of Person Responsible for Regulatory Compliance (PRRC) and organizational chart.' },
        { t: '3.3) GAP Analysis & Roadmap', 
          e: 'Checklist showing the gap between current state and full compliance.' },
        { t: 'Resulting File Structure', 
          e: `
    
📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: []
        }
      ]
    },
/************************************************** STEP 4 ********************************************/
    { id: 'step4', 
      title: 'Step 4) Resource Management', 
      desc: 'Ensure competence, training, and a secure working environment.',
      checklist: [
        { t: '4.1) Competence & Training', 
          e: 'Training matrix and evidence of personnel qualifications (CV/Diplomas), iso 6.2.' },
        { t: '4.2) Infrastructure & IT Environment', 
          e: 'SOP for maintenance of IT systems and security updates.' }, 
        { t: 'Resulting File Structure', 
          e: `
    
📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: []
        }
      ]
    },


/************************************************** STEP 5 ********************************************/
{ id: 'step5', 
  title: 'Step 5) Product Realisation & Design', 
  desc: 'Control development from idea to finished product with full traceability. Records from this step are fed into the Technical Documentation.',
  
  checklist: [
    { t: '5.1) Design Control ',
      e: 'Create a SOP for product development and establish a DHF structure → ',
      sop: SOP_DATA5.SOP_DESIGN_CONTROL },

    { t: '5.2) Risk Management throughout Lifecycle ',
      e: 'Create a SOP for risk management throughout product lifecycle - ISO 14971 → ',
      sop: SOP_DATA5.SOP_RISK_MANAGEMENT },
    
    { t: '5.3) Clinical Evaluation & Device Validation ',
      e: 'Create a SOP for clinical evaluation → ', 
      sop: SOP_DATA5.SOP_CLINICAL_EVALUATION },
        
    { t: '5.4) Design Change Control',
      e: 'Create a SOP for design change control post-launch → ', 
      sop: [SOP_DATA5.SOP_CHANGE_CONTROL, SOP_DATA5.CHANGE_MATRIX]},

    { t: 'Resulting File Structure', 
      e: `


📁 7-PRODUCT REALIZATION
  📁 7-DHF
    📁 Feasibility
    📁 Design Planning
    📁 Design Input
    📁 Design Output
    📁 Device Risk/Usability
      📁 Risk Management
    📁 Design Review
    📁 Design Verification
    📁 Design Release
    📁 Design Validation
      📁 Clinical Evaluation
    📁 Design Changes
    📁 Design Transfer
    📁 Design Maintenance
  `,
  files: { '7-DHF': 
           [{ sop: SOP_DATA5.SOP_DESIGN_CONTROL, indent: '  ' }],
           'Risk Management': [{ sop: SOP_DATA5.SOP_RISK_MANAGEMENT, indent: '      ' }],
           'Clinical Evaluation': [{ sop: SOP_DATA5.SOP_CLINICAL_EVALUATION, indent: '      ' }],
           'Design Changes': [{ sop: SOP_DATA5.SOP_CHANGE_CONTROL, indent: '    ' }],
          }
    }
  ]
},

/******************* STEP 6 - OPERATIONS, PROCUREMENT & TRACEABILITY (ISO 7.4 - 7.6) *******************/
{     id: 'step6', 
      title: 'Step 6) Operations, Procurement & Traceability ', 
      desc: 'Secure control over suppliers, product delivery, customer requirements, and measurement tools. ISO 13485 Section 7.4-7.6.',
      checklist: [
        { t: '6.1) Purchasing & Supplier Control (ISO 7.4.1 - 7.4.3)',
          e: 'Create a SOP for purchasing controls and supplier evaluation → ',
          sop: SOP_DATA6.SOP_008_SUPPLIER_MANAGEMENT,
          checklist: [
            { e: 'Establish Approved Supplier List (ASL) (ISO 7.4.1.1) → REG-009' },
            { e: 'Create Quality Assurance Agreement (QAA) template (ISO 7.4.2) → TMP-001' },
            { e: 'Evaluate, monitor, and re-approve critical suppliers (ISO 7.4.1.1)' }
          ]
        },
        { t: '6.2) Customer Processes & Market Feedback (ISO 7.2.2, 7.2.3 & 8.2.1)',
          checklist: [
            { e: 'Create a SOP for handling customer requirements and post-market feedback (ISO 7.2.2) → ',
              sop: SOP_DATA6.SOP_011_CUSTOMER_PROCESSES },
            { e: 'Establish a register to log and evaluate customer complaints and market feedback (ISO 7.2.3) → REG-010' }
          ]
        },
        { 
          t: '6.3) Production, Servicing & UDI Traceability (ISO 7.5.1, 7.5.8, 7.5.9 & 7.6)',
          checklist: [
            { e: 'Create a SOP for product release, deployment pipelines, and unique device tracking (ISO 7.5.1 & 7.5.4) → ',
              sop: SOP_DATA6.SOP_012_PRODUCTION_AND_TRACEABILITY },
            { e: 'Create a SOP for the qualification and validation of automated test software (ISO 7.5.6 & 7.6) → SOP-013' },
            { e: 'Establish a register for allocated UDI codes and device release versions (ISO 7.5.8 & 7.5.9) → REG-011' }, 
            { t: 'Resulting File Structure', 
        e: `
    
📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: []
        }
          ]
        }
      ]
    },
/****************************************************************************************************/
    { id: 'step7', 
      title: 'Step 7) Measurement, Analysis & Improvement ', 
      desc: 'ISO 8.2',
      checklist: [
        { t: '7.1) Internal Audit & Product Release (ISO 8.2.4 & 8.2.6)', 
          e: 'Create SOP for internal audits and the final product release routine. Establish an annual audit plan for the quality management system as well as control plans and protocols for final inspection.',
          sop: SOP_DATA.SOP_013_AUDITS_AND_RELEASE },
        { t: '7.2) Non-Conformance (NC) & CAPA Management (ISO 8.3 & 8.5)', 
          e: 'Create SOP for handling deviations (Non-Conformances) and corrective/preventive actions (CAPA). Establish a central register to log, track, and close cases, as well as investigate root cause.',
          sop: SOP_DATA.SOP_014_NC_CAPA_MANAGEMENT },
        { t: '7.3) Data Analysis & Trends (ISO 8.4)', 
          e: 'Create SOP for data analysis (how KPIs and error rates are measured) and compile regular trend reports on quality data for management.',
          sop: SOP_DATA.SOP_015_DATA_ANALYSIS }, 
        { t: 'Resulting File Structure', 
        e: `
    
📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: []
        } 
      ]
    },

/****************************************************************************************************/
    { id: 'step8', 
      title: 'Step 8) Post-Market & Vigilance ', 
      desc: 'Processes to control that the product and system are functioning.',
      checklist: [
        { t: '8.1) Inspection Plans', e: 'Definitions for what is checked at product release.' }, 
        { t: 'Resulting File Structure', 
        e: `
    
📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: []
        }
      ]
    },



/****************************************************************************************************/
    { id: 'step9', 
      title: 'Step 9) Internal Audit & NB-Ready', 
      desc: 'Final review of the entire system before external audit.',
      checklist: [
        { t: '9.1) Internal Audit Report (ISO 8.2.2)', 
          e: 'Full review of the QMS to ensure readiness for Notified Body.' }, 
          { t: ' RESULTING FILE STRUCTURE ', 
        e: `
    
📁 QMS
  📁 1-SCOPE
  📁 2-NORMATIVE REFERENCES
  📁 3-TERMS & DEFINITIONS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: []
        }
      ]
    }
]
