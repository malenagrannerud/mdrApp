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
{  
  id: 'q0',
  title: 'Implementing a QMS',
  desc: 'A Roadmap to Implementing a Quality Management System According to ISO 13485',
  checklist: [
    { t: 'OVERVIEW',
      e: 'This roadmap provides deliverables and templates to build a compliant Quality Management System (QMS), with reference chapters to the standard.'},
   
    { t: '  Level 1. Quality Policy & Objectives',
      e: '  Defines the corporate commitment to quality and regulatory compliance, establishing measurable targets signed by Management.'}, 
   
    { t: '  Level 2. Quality Manual (QM)',
      e: '  Describes the scope of the QMS, details the overall system structure, and provides documented justifications for any requirement exclusions.'}, 
    
    { t: '  Level 3. Standard Operating Procedure (SOP) & Work Instructions (WIs)',
      e: '  SOPs describe who does what and when (operational workflows), while WIs describe how to execute specific tasks step-by-step.'},

    { t: '  Level 4. Forms & Records',
      e: '  Provides objective evidence of actions taken, documenting what was done, when, and by whom to ensure full regulatory traceability.'},
    
    { t: ' Resulting File Structure ', 
      e: `

📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
      files: {}
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

      { t: '1.2) Create a SOP for Software Validation (4.1 General requirements)', 
        e: 'This SOP defines who validates the eQMS and when, to secure data integrity.',
        sop: SOP_DATA1.SOP_SW_VAL,
      },

      { t: '1.3) Create a SOP for Document Control (4.2.4 Control of documents)', 
        e: 'This SOP defines who is responsible for document control and when it is done, to ensure only approved and current document revisions are available at points of use.',        
        sop: SOP_DATA1.SOP_DOC_CONTROL
      },

      { t: '1.4) Create a SOP for Data Integrity & Backup Verification (4.2.5 Control of records)',
        e: 'This SOP defines who maintains records and when to verify automated, system backups to secure data integrity and ensure full business recovery if system failures occur.', 
        sop: SOP_DATA1.SOP_BACKUP_RESTORE},
      
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
      title: 'Step 2) Create the Quality Manual & Scope',
      checklist: [
        { t: '2.1) Generate the Quality Manual (4.2.2 Quality manual)', 
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
           [{ sop: SOP_DATA2.QUALITY_MANUAL, indent: '    ' }],
          }
        }       
      ]
    },
/************************************************** STEP 3 ********************************************/
    

{ id: 'step3', 
      title: 'Step 3) Establish Management Responsibility', 
      desc: 'Ensure executive management commitment, formalize roles, and establish review cycles.',
      checklist: [
        { t: '3.1) Create a SOP for Quality Policy & Objectives (5.3 Quality policy & 5.4.1 Quality objectives) ', 
          e: 'This SOP defines who drafts quality objectives and when management signs them, to align the organization with corporate quality commitments and measure QMS performance.'},
        
          { t: '3.2) Create a SOP for Roles & Appoint PRRC (5.5 Responsibility, authority and communication & MDR Art. 15)', 
          e: 'This SOP defines who appoints regulatory roles and when the organizational chart is updated, to secure formal PRRC assignment and fulfill legal EU MDR requirements.'  },
 
        { t: '3.3) Create a SOP for Management Review (5.6 Management review)', 
          e: 'This SOP defines who conducts executive reviews and when they are scheduled, to evaluate audits and complaints to ensure continuous suitability and effectiveness of the QMS.' },
        
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
        { t: '4.1) Create a SOP for Competence & Training (6.2 Human resources)', 
          e: 'This SOP defines who assesses competence gaps and when personnel training records are updated, to maintain a qualified training matrix and provide objective evidence of staff qualifications.' 
        },
        { t: '4.2) Create a SOP for Infrastructure & IT Environment (6.3 Infrastructure)', 
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
    { t: '5.1) Create a SOP for Design Control (7.3 Design and development)',
      e: 'This SOP defines who documents product development phases and when formal design reviews are conducted, used to establish a compliant Design History File (DHF) with traceability from inputs to outputs.',
      sop: SOP_DATA5.SOP_DESIGN_CONTROL 
    },

    { t: '5.2) Create a SOP for Risk Management throughout Lifecycle (7.1 Planning of product realization & ISO 14971 - Application of risk management to medical devices)',
      e: 'This SOP defines who identifies product hazards and when risk assessments are updated, to maintain a lifecycle risk management file and secure patient and user safety.',
      sop: SOP_DATA5.SOP_RISK_MANAGEMENT 
    },
    
    { t: '5.3) Create a SOP for Clinical Evaluation & Device Validation (7.3.7 Design and development validation)',
      e: 'This SOP defines who performs clinical assessments and when device validation is executed, to gather clinical evidence and confirm that the device meets its intended use and user needs safely.', 
      sop: SOP_DATA5.SOP_CLINICAL_EVALUATION 
    },
        
    { t: '5.4) Create a SOP for Design Change Control (7.3.9 Control of design and development changes)',
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
    📁 DHF
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
        '7-PRODUCT REALIZATION': [{ sop: SOP_DATA5.SOP_DESIGN_CONTROL, indent:'  ' }],
        'Device Risk/Usability': [{ sop: SOP_DATA5.SOP_RISK_MANAGEMENT, indent:'      ' }],
        'Design Validation': [{ sop: SOP_DATA5.SOP_CLINICAL_EVALUATION, indent:'      ' }],
        'Design Changes': [{ sop: SOP_DATA5.SOP_CHANGE_CONTROL, indent:'      ' }]
      }
    }
  ]
},

/******************* STEP 6  *******************/
{     id: 'step6', 
      title: 'Step 6) Establish Operations, Procurement & Traceability ', 
      desc: 'Secure control over suppliers, product delivery, customer requirements, and measurement tools. ',
      checklist: [
        { t: '6.1) Create a SOP for Purchasing & Supplier Control (7.4 Purchasing)',
          e: 'This SOP defines who evaluates external vendors and when supplier audits are performed, to maintain the Approved Supplier List (ASL) and ensure materials meet regulatory requirements.',
          sop: SOP_DATA6.SOP_008_SUPPLIER_MANAGEMENT,
        
        },
        { t: '6.2) Create a SOP for Customer Processes & Market Feedback (7.2 Customer-related processes )',
          e: 'This SOP defines who logs user input and when market data is analyzed, to address customer requirements, manage post-market feedback, and capture potential complaints.'
        },
        { t: '6.3) Create a SOP for Production, Servicing & UDI Traceability (7.5 Production and service provision, 7.6 Control of monitoring and measuring equipment)',
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
          files: {}
        }
      ]
    },

/****************************************************************************************************/
    { id: 'step7', 
      title: 'Step 7) Establish Measurement, Analysis & Improvement ', 
      desc: 'Monitor QMS performance, control non-conforming products, and drive continuous improvement. ISO 13485 Section 8.',
      checklist: [

        { t: '7.1) Create a SOP for Post-Market Surveillance (8.2.1 Feedback, 8.5.1 General improvement)', 
          e: 'This SOP defines who gathers field performance data and when user feedback is reviewed, to proactively monitor product safety and maintain regulatory compliance post-launch.' 
        },

        { t: '7.2) Create a SOP for Vigilance & Adverse Event Reporting (8.2.3 Reporting to regulatory authorities & MDR Art. 87)', 
          e: 'This SOP defines who evaluates product incidents and when regulatory authorities must be notified, to secure legally mandated reporting timelines and protect patient safety.' 
        },

        { t: '7.3) Create a SOP for Internal Audit & Product Release (8.2.4 Internal audit, 8.2.6 Monitoring and measurement of product)', 
          e: 'This SOP defines who conducts internal quality audits and when final product inspections are performed, to execute the annual audit plan and provide objective evidence of device release approval,',
          sop: SOP_DATA6.SOP_013_AUDITS_AND_RELEASE  
        },
        
        { t: '7.4) Create a SOP for Non-Conformance & CAPA Management (8.3 Control of nonconforming product, 8.5.2 Corrective action, 8.5.3 Preventive action)', 
          e: 'This SOP defines who logs product deviations and when a formal root-cause investigation is triggered, to isolate nonconforming items and track corrective or preventive actions to closure.',
          sop: SOP_DATA6.SOP_014_NC_CAPA_MANAGEMENT 
        },
       
        { t: '7.5) Create a SOP for Data Analysis & Trends (8.4 Analysis of data)', 
          e: 'This SOP defines who aggregates quality metrics and when trend reports are compiled, to evaluate QMS effectiveness and feed crucial data into management reviews.',
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
          files: { }
        } 
      ]
    },
];