/**
 * @file qmsStepsData.js
 * @description Central Roadmap structure that imports templates from qmsSopData.
 * 
 * Phases:
 *   Phase 1 (Parallel): Steps 1-4 — Foundation
 *   Phase 2 (Parallel): Steps 5-6 — Product Realization & Operations
 *   Phase 3 (Parallel): Steps 7-8 — Oversight & Regulatory
 * 
 * t: output: vad du ska göra kort
 * e: beskriver vad outputen gör och vad den används till 
 */

import { SOP_DATA } from './sopData.js';
export const QMS_DATA = [

/************************************************** STEP 0 ********************************************/
{  
  id: 'q0',
  title: 'Implementing a QMS',
  desc: 'A Roadmap to Implementing a Quality Management System According to ISO 13485',
  checklist: [
    { t: 'OVERVIEW',
      e: 'This roadmap provides deliverables and templates to build a compliant Quality Management System (QMS), with reference chapters to the standard. Steps are grouped into three phases based on dependencies and parallel execution potential.'},
   
    { t: '  Phase 1 — Foundation (Steps 1-4)',
      e: '  Can all start immediately. Builds document control, management commitment, and resource infrastructure in parallel.'}, 
   
    { t: '  Phase 2 — Product Realization & Operations (Steps 5-6)',
      e: '  Starts after Phase 1 foundation is in place. Design control and operational processes run in parallel.'}, 
    
    { t: '  Phase 3 — Oversight & Regulatory (Steps 7-8)',
      e: '  Starts after Phase 2 processes are operational. Measurement, CAPA, and regulatory affairs run in parallel.'},

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
    title: 'Phase 1: Step 1) Set Up an Initial System', 
    desc: 'Solidify essential foundations for a QMS by finding gaps, establishing a roadmap, and implementing core SOPs. Runs in parallel with Steps 2-4.',
    checklist: [
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
      title: 'Phase 1: Step 2) Create the management framework',
      desc: 'Define the QMS scope, structure, exclusions, quality policy, organizational roles (including PRRC), and management review cycles. Runs in parallel with Steps 1, 3, 4.',
      checklist: [
        { t: '2.1) Generate the Quality Manual (4.2.2 Quality manual)', 
          e: 'The QM describes what the QMS covers and why. It defines the QMS scope, structure, process interaction map, and justifies any ISO 13485 exclusions. It is the starting document for NB auditors, new employees, and external parties.', 
          sop: SOP_DATA2.QUALITY_MANUAL 
        },

        { t: '2.2) Establish Management Framework (5.3, 5.4.1, 5.5, 5.6 & MDR Art. 15)', 
          e: 'This SOP covers Quality Policy, measurable objectives, PRRC appointment, and annual Management Review. It proves to auditors that management is committed, a PRRC exists, and that the QMS is systematically reviewed. Without it → ISO 13485 §5 fails → no CE marking',
          sop: SOP_DATA2.SOP_MANAGEMENT_FRAMEWORK
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
    '4-QMS': [
      { sop: SOP_DATA2.QUALITY_MANUAL, indent: '    ' }
    ],
    '5-MANAGEMENT RESPONSIBILITY': [
      { sop: SOP_DATA2.SOP_MANAGEMENT_FRAMEWORK, indent: '  ' }
    ]
  }
        }       
      ]
    },

/************************************************** STEP 4 ********************************************/
    { id: 'step4', 
      title: 'Phase 1: Step 4) Establish Resource Management', 
      desc: 'Ensure competence, training, and a secure working environment. Runs in parallel with Steps 1, 2, 3.',
      checklist: [
        { t: '4.1) Create a SOP for Competence & Training (6.2 Human resources)', 
          e: 'This SOP defines who assesses competence gaps and when personnel training records are updated, to maintain a qualified training matrix and provide objective evidence of staff qualifications.',
          sop: SOP_DATA2.SOP_COMPETENCE_TRAINING
        },
        { t: '4.2) Create a SOP for Infrastructure & IT Environment (6.3 Infrastructure)', 
          e: 'This SOP defines who maintains IT infrastructure and when security updates are performed, to prevent data loss, unauthorized system changes, and secure a compliant digital validation environment.',
          sop: SOP_DATA2.SOP_INFRASTRUCTURE_IT
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
            '6-RESOURCE MANAGEMENT': [
              { sop: SOP_DATA2.SOP_COMPETENCE_TRAINING, indent: '  ' },
              { sop: SOP_DATA2.SOP_INFRASTRUCTURE_IT, indent: '  ' }
            ]
          }
        }
      ]
    },

/************************************************** STEP 5 ********************************************/
{ id: 'step5', 
  title: 'Phase 2: Step 5) Establish Product Realisation & Design', 
  desc: 'Control development from idea to finished product with full traceability. Records feed into Technical Documentation. Runs in parallel with Step 6.',
  
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

// lägg till design transfer
        
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

/************************************************** STEP 6 ********************************************/
{     id: 'step6', 
      title: 'Phase 2: Step 6) Establish Operations, Procurement & Traceability', 
      desc: 'Secure control over suppliers, product delivery, customer requirements, and measurement tools. Runs in parallel with Step 5.',
      checklist: [
        { t: '6.1) Create a SOP for Purchasing, Supplier Control & Supplier Evaluation (7.4 Purchasing)',
          e: 'This SOP defines who evaluates external vendors and when supplier audits are performed, to maintain the Approved Supplier List (ASL) and ensure materials meet regulatory requirements.',
          sop: SOP_DATA6.SOP_008_SUPPLIER_MANAGEMENT,
        },
        { t: '6.2) Create a SOP for Customer Processes & Market Feedback (7.2 Customer-related processes)',
          e: 'This SOP defines who logs user input and when market data is analyzed, to address customer requirements, manage post-market feedback, and capture potential complaints.',
          sop: SOP_DATA6.SOP_CUSTOMER_PROCESSES
        },
        { t: '6.3) Create a SOP for Production, Servicing & UDI Traceability (7.5 Production and service provision, 7.6 Control of monitoring and measuring equipment)',
          e: 'This SOP defines who controls manufacturing batches and when production software is validated, to secure end-to-end device traceability, track UDI codes, and prevent unvalidated software from running production tests.',
          sop: SOP_DATA6.SOP_PRODUCTION_UDI
        },
        { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
    📁 DHF
    📁 7.4-PURCHASING
    📁 7.5-PRODUCTION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT`,
          files: {
            '7.4-PURCHASING': [
              { sop: SOP_DATA6.SOP_008_SUPPLIER_MANAGEMENT, indent: '    ' }
            ],
            '7.5-PRODUCTION': [
              { sop: SOP_DATA6.SOP_PRODUCTION_UDI, indent: '    ' }
            ]
          }
        }
      ]
    },

/************************************************** STEP 7 ********************************************/
    { id: 'step7', 
      title: 'Phase 3: Step 7) Establish Measurement, Analysis & Improvement', 
      desc: 'Monitor QMS performance, control non-conforming products, and drive continuous improvement. ISO 13485 Section 8. Runs in parallel with Step 8.',
      checklist: [

        { t: '7.1) Create a SOP for Internal Audit & Product Release (8.2.4 Internal audit, 8.2.6 Monitoring and measurement of product)', 
          e: 'This SOP defines who conducts internal quality audits and when final product inspections are performed, to execute the annual audit plan and provide objective evidence of device release approval.',
          sop: SOP_DATA6.SOP_013_AUDITS_AND_RELEASE  
        },
        
        { t: '7.2) Create a SOP for Non-Conformance & CAPA Management (8.3 Control of nonconforming product, 8.5.2 Corrective action, 8.5.3 Preventive action)', 
          e: 'This SOP defines who logs product deviations and when a formal root-cause investigation is triggered, to isolate nonconforming items and track corrective or preventive actions to closure.',
          sop: SOP_DATA6.SOP_014_NC_CAPA_MANAGEMENT 
        },
       
        { t: '7.3) Create a SOP for Data Analysis & Trends (8.4 Analysis of data)', 
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
          files: {
            '8-MEASUREMENT, ANALYSIS & IMPROVEMENT': [
              { sop: SOP_DATA6.SOP_013_AUDITS_AND_RELEASE, indent: '  ' },
              { sop: SOP_DATA6.SOP_014_NC_CAPA_MANAGEMENT, indent: '  ' },
              { sop: SOP_DATA6.SOP_015_DATA_ANALYSIS, indent: '  ' }
            ]
          }
        } 
      ]
    },

/************************************************** STEP 8 ********************************************/
    { id: 'step8', 
      title: 'Phase 3: Step 8) Establish Regulatory Affairs', 
      desc: 'Build the regulatory infrastructure for CE marking, submissions, and post-market compliance. Owned by Regulatory Affairs under PRRC oversight. Runs in parallel with Step 7.',
      checklist: [

        { t: '8.1) Create a SOP for Technical Documentation (TD) Compilation (MDR Annex II & III)',
          e: 'This SOP defines who compiles the TD and when final review gates are executed, to package design outputs into a submission-ready format and ensure alignment with MDR Annex II and III requirements.',
          sop: SOP_DATA8.SOP_TD_COMPILATION
        },

        { t: '8.2) Create a SOP for EUDAMED & UDI Registration (MDR Art. 29-31)', 
          e: 'This SOP defines who registers economic operators and devices in EUDAMED and when registration data must be updated, to secure SRN issuance and maintain UDI/Device data modules.',
          sop: SOP_DATA8.SOP_EUDAMED_UDI
        },

        { t: '8.3) Create a SOP for NB communication (MDR Art. 52, Annex IX)',
          e: 'This SOP defines who manages NB interactions and when submission dossiers are transmitted, to coordinate audits, respond to non-conformities, and maintain valid CE certificates.',
          sop: SOP_DATA8.SOP_NB_COMMUNICATION
        },

        { t: '8.4) Create a SOP for Post-Market Surveillance (MDR Art. 83-86)',
          e: 'This SOP defines who gathers field performance data and when PMS reports are compiled, to proactively monitor product safety, update the PSUR, and feed real-world data back into the risk management and clinical evaluation processes.',
          sop: SOP_DATA8.SOP_PMS
        },
        
        { t: '8.5) Create a SOP for Vigilance & Adverse Event Reporting (MDR Art. 87-92)',
          e: 'This SOP defines who evaluates product incidents and when regulatory authorities must be notified, to secure legally mandated 15-day serious incident reporting, manage Field Safety Corrective Actions (FSCA), and track trend analyses.',
          sop: SOP_DATA8.SOP_VIGILANCE
        },

        // lägg till regulatory intelligence

        // lägg till CA interaction
       
        { t: 'Resulting File Structure', 
          e: `
    
📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT
  📁 9-REGULATORY AFFAIRS`,
          files: {
            '9-REGULATORY AFFAIRS': [
              { sop: SOP_DATA8.SOP_TD_COMPILATION, indent: '  ' },
              { sop: SOP_DATA8.SOP_EUDAMED_UDI, indent: '  ' },
              { sop: SOP_DATA8.SOP_NB_COMMUNICATION, indent: '  ' },
              { sop: SOP_DATA8.SOP_PMS, indent: '  ' },
              { sop: SOP_DATA8.SOP_VIGILANCE, indent: '  ' }
            ]
          }
        } 
      ]
    },
];