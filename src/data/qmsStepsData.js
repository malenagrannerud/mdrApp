/**
 * @file qmsStepsData.js
 * @description Central Roadmap structure that imports templates from qmsSopData.
 * 
 * 
 * 
 * t: output: vad du ska göra kort
 * e: beskriver vad outputen gör och vad den används till 
 */

import { SOP_DATA1 } from './sopData1.js';
import { SOP_DATA2 } from './sopData2.js';
import { SOP_DATA5 } from './sopData5.js';
import { SOP_DATA6 } from './sopData6.js';

export const QMS_DATA = [

/************************************************** STEP 0 ********************************************/
{  id: 'q0',
    title: 'Implementing a QMS',
    desc: '',
    checklist: [
      { t: 'Project Overview',
        e: `This roadmap provides deliverables and templates to build a compliant Qualit management system (QMS). 
        
        The hierarchy of the QMS follows:
          1. Quality Manual (QM) - Describes the scope of the QMS and what it covers.
          2. Standard Operating Procedure (SOP) - Describe who does what and when.
          3. Work Instructions (WIs) - Describe how to do it, step by step.
          4. Records - Evidence of what was done, when, and by whom.
        
        `},
      { t: 'Resulting File Structure', 
        e: `
    
📁 ISO 13485-QMS
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
    title: 'Step 1) Set Up an Initial System', 
    desc: 'Solidify essential foundations for a QMS by finding gaps, establishing a roadmap, and implementing core SOPs.',
    checklist: [

/**  FÖLJ FORMEN
 * t: output: vad du ska göra kort
 * e: beskriver vad outputen gör och vad den används till 
 */

      { t: '1.1) Perform a GAP Analysis', 
        e: 'A GAP analysis is done by QA and the report shows the gap between current state of the company and full QMS compliance. Management can use this information to prioritize improvement initiatives.' },

      { t: '1.2) Create a SOP for Software Validation (ISO 4.1 - General requirements)', 
        e: 'This SOP defines who validates the eQMS and when, to secure data integrity.',
        sop: SOP_DATA1.SOP_SW_VAL,
      },

      { t: '1.3) Create a SOP for Document Control (ISO 4.2.4 - Control of documents)', 
        e: 'This SOP defines who is responsible for document control and when it is done, to ensure only approved and current document revisions are available at points of use.',        
        sop: SOP_DATA1.SOP_DOC_CONTROL
      },

      { t: '1.4) Create a SOP for Data Integrity & Backup Verification (ISO 4.2.5 - Control of records)',
        e: 'This SOP defines who maintains records and when to verify automated, system backups to secure data integrity and ensure full business recovery if system failures occur.' },
      
        { t: 'Resulting File Structure', 
        e: `

📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: {
    '4-QMS': [
      { sop: SOP_DATA1.SOP_SW_VAL, indent: '    ' }, 
      { sop: SOP_DATA1.SOP_DOC_CONTROL, indent: '    ' },
      { sop: SOP_DATA1.SOP_BACKUP_RESTORE, indent: '    ' }
    ]
  }
 }
]
},

/************************************************** STEP 2 ********************************************/


{ id: 'step2', 
      title: 'Step 2) CreateQuality Manual & Scope',
      checklist: [
        { t: '2.1) Generate the Quality Manual (ISO 4.2.2 - Quality manual)', 
          e: 'The QM describes what the QMS covers and why. It is used as a staring documment for anyone who what to understand the copmany. This can be the NB, auditors, new employees and external parties. It is also used to motivate exclutions.   ', 
          sop: SOP_DATA2.QUALITY_MANUAL 
        },
        { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
  files: { '4-QMS': 
           [{ sop: SOP_DATA2.QUALITY_MANUAL, indent: '   ' }],
          }
        }       
      ]
    },
/************************************************** STEP 3 ********************************************/
    

{ id: 'step3', 
      title: 'Step 3) Establish Management Responsibility', 
      desc: 'Ensure executive management commitment, formalize roles, and establish review cycles.',
      checklist: [
        { t: '3.1) Create a SOP for Quality Policy & Objectives (ISO 5.3 - Quality policy & ISO 5.4.1 - Quality objectives) ', 
          e: 'This SOP defines who drafts quality objectives and when management signs them, to align the organization with corporate quality commitments and measure QMS performance.'},
        
          { t: '3.2) Create a SOP for Roles & Appoint PRRC (ISO 5.5 - Responsibility, authority and communication & MDR Art. 15)', 
          e: 'This SOP defines who appoints regulatory roles and when the organizational chart is updated, to secure formal PRRC assignment and fulfill legal EU MDR requirements.'  },
 
        { t: '3.3) Create a SOP for Management Review (ISO 5.6 - Management review)', 
          e: 'This SOP defines who conducts executive reviews and when they are scheduled, to evaluate audits and complaints to ensure continuous suitability and effectiveness of the QMS.' 
        },
        
      { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
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
      title: 'Step 4) Establish Resource Management', 
      desc: 'Ensure competence, training, and a secure working environment.',
      checklist: [
        { t: '4.1) Create a SOP for Competence & Training (ISO 6.2 - Human resources)', 
          e: 'This SOP defines who assesses competence gaps and when personnel training records are updated, to maintain a qualified training matrix and provide objective evidence of staff qualifications.' 
        },
        { t: '4.2) Create a SOP for Infrastructure & IT Environment (ISO 6.3 - Infrastructure)', 
          e: 'This SOP defines who maintains IT infrastructure and when security updates are performed, to prevent data loss, unauthorized system changes, and secure a compliant digital validation environment.' 
        }, 
        { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
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
  title: 'Step 5) Establish Product Realisation & Design', 
  desc: 'Control development from idea to finished product with full traceability. Records from this step are fed into the Technical Documentation.',
  
  checklist: [
    { t: '5.1) Create a SOP for Design Control (ISO 7.3 - Design and development)',
      e: 'This SOP defines who documents product development phases and when formal design reviews are conducted, used to establish a compliant Design History File (DHF) with traceability from inputs to outputs.',
      sop: SOP_DATA5.SOP_DESIGN_CONTROL 
    },

    { t: '5.2) Create a SOP for Risk Management throughout Lifecycle (ISO 7.1 - Planning of product realization & ISO 14971 - Application of risk management to medical devices)',
      e: 'This SOP defines who identifies product hazards and when risk assessments are updated, to maintain a lifecycle risk management file and secure patient and user safety.',
      sop: SOP_DATA5.SOP_RISK_MANAGEMENT 
    },
    
    { t: '5.3) Create a SOP for Clinical Evaluation & Device Validation (ISO 7.3.7 - Design and development validation)',
      e: 'This SOP defines who performs clinical assessments and when device validation is executed, to gather clinical evidence and confirm that the device meets its intended use and user needs safely.', 
      sop: SOP_DATA5.SOP_CLINICAL_EVALUATION 
    },
        
    { t: '5.4) Create a SOP for Design Change Control (ISO 7.3.9 - Control of design and development changes)',
      e: 'This SOP defines who reviews engineering modifications and when product changes are approved post-launch, to prevent unintended quality degradation and verify that modifications do not impact device safety.', 
      sop: [SOP_DATA5.SOP_CHANGE_CONTROL, SOP_DATA5.CHANGE_MATRIX]
    },

    { t: 'Resulting File Structure', 
      e: `

📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
    📁 7.1-DHF
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
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT
  `,
      files: { 
        '7.1-DHF': [{ sop: SOP_DATA5.SOP_DESIGN_CONTROL, indent: '  ' }],
        'Risk Management': [{ sop: SOP_DATA5.SOP_RISK_MANAGEMENT, indent: '      ' }],
        'Clinical Evaluation': [{ sop: SOP_DATA5.SOP_CLINICAL_EVALUATION, indent: '      ' }],
        'Design Changes': [{ sop: SOP_DATA5.SOP_CHANGE_CONTROL, indent: '    ' }]
      }
    }
  ]
},

/******************* STEP 6 - OPERATIONS, PROCUREMENT & TRACEABILITY *******************/
{     id: 'step6', 
      title: 'Step 6) Establish Operations, Procurement & Traceability ', 
      desc: 'Secure control over suppliers, product delivery, customer requirements, and measurement tools. ',
      checklist: [
        { t: '6.1) Create a SOP for Purchasing & Supplier Control (ISO 7.4 - Purchasing)',
          e: 'This SOP defines who evaluates external vendors and when supplier audits are performed, to maintain the Approved Supplier List (ASL) and ensure materials meet regulatory requirements.',
          sop: SOP_DATA6.SOP_008_SUPPLIER_MANAGEMENT,
        
        },
        { t: '6.2) Create a SOP for Customer Processes & Market Feedback (ISO 7.2 - Customer-related processes )',
          e: 'This SOP defines who logs user input and when market data is analyzed, to address customer requirements, manage post-market feedback, and capture potential complaints.'
        },
        { t: '6.3) Create a SOP for Production, Servicing & UDI Traceability (ISO 7.5 - Production and service provision & ISO 7.6 - Control of monitoring and measuring equipment)',
          e: 'This SOP defines who controls manufacturing batches and when production software is validated, to secure end-to-end device traceability, track UDI codes, and prevent unvalidated software from running production tests.',
          
        },
        { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
    📁 7.4-PURCHASING
    📁 7.5-PRODUCTION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
          files: {
            '7.4-PURCHASING': [
              { sop: SOP_DATA6.SOP_008_SUPPLIER_MANAGEMENT, indent: '    ' }
            ],
            '7.5-PRODUCTION': [
              { sop: SOP_DATA6.SOP_012_PRODUCTION_AND_TRACEABILITY, indent: '    ' }
            ]
          }
        }
      ]
    },

/****************************************************************************************************/
    { id: 'step7', 
      title: 'Step 7) Establish Measurement, Analysis & Improvement ', 
      desc: 'Monitor QMS performance, control non-conforming products, and drive continuous improvement. ISO 13485 Section 8.',
      checklist: [
        { t: '7.1) Create a SOP for Internal Audit & Product Release (ISO 8.2.4 - Internal audit & ISO 8.2.6 - Monitoring and measurement of product)', 
          e: 'This SOP defines who conducts internal audits and when final product release inspections are performed, used to establish the annual audit plan and provide objective evidence that products meet specifications before distribution.',
          sop: SOP_DATA6.SOP_013_AUDITS_AND_RELEASE 
        },
        { t: '7.2) Create a SOP for Non-Conformance & CAPA Management (ISO 8.3 - Control of nonconforming product & ISO 8.5.2 - Corrective action & ISO 8.5.3 - Preventive action)', 
          e: 'This SOP defines who documents product deviations and when a formal root-cause investigation is triggered, used to isolate nonconforming items and track corrective or preventive actions to closure.',
          sop: SOP_DATA6.SOP_014_NC_CAPA_MANAGEMENT 
        },
        { t: '7.3) Create a SOP for Data Analysis & Trends (ISO 8.4 - Analysis of data)', 
          e: 'This SOP defines who aggregates quality metrics and when trend reports are compiled, used to evaluate QMS effectiveness and feed crucial data into management reviews.',
          sop: SOP_DATA6.SOP_015_DATA_ANALYSIS 
        }, 
        { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
          files: {
            '8-MEASUREMENT, ANALYSIS & IMPROVEMENT': [
              { sop: SOP_DATA6.SOP_013_AUDITS_AND_RELEASE, indent: '    ' },
              { sop: SOP_DATA6.SOP_014_NC_CAPA_MANAGEMENT, indent: '    ' },
              { sop: SOP_DATA6.SOP_015_DATA_ANALYSIS, indent: '    ' }
            ]
          }
        } 
      ]
    },

/****************************************************************************************************/
    { id: 'step8', 
      title: 'Step 8) Establish Post-Market & Vigilance ', 
      desc: 'Processes to control that the product and system are functioning after commercial launch.',
      checklist: [
        { t: '8.1) Create Inspection Plans & Post-Market Surveillance (ISO 8.2.1 - Feedback & ISO 8.5.1 - General improvement)', 
          e: 'This document defines who performs field safety evaluations and when regulatory authorities are notified of incidents, used to protect patient safety and maintain compliance post-launch.' 
        }, 
        { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
          files: {
            '8-MEASUREMENT, ANALYSIS & IMPROVEMENT': [
              { sop: 'Post-Market Surveillance Plan', indent: '    ' }
            ]
          }
        }
      ]
    },

/****************************************************************************************************/
    { id: 'step9', 
      title: 'Step 9) Establish Internal Audits & NB-Readiness ', 
      desc: 'Final review of the entire system before external audit.',
      checklist: [
        { t: '9.1) Generate Internal Audit Report & Audit Readiness (ISO 8.2.4 - Internal audit)', 
          e: 'This process defines who reviews the gathered QMS records and when final readiness status is approved, used to compile the ultimate objective evidence required by the Notified Body.' 
        }, 
        { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
          files: {
            '8-MEASUREMENT, ANALYSIS & IMPROVEMENT': [
              { sop: 'Internal Audit Report', indent: '    ' }
            ]
          }
        }
      ]
    }
];