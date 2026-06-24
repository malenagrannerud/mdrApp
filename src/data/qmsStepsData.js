/**
 * @file qmsStepsData.js
 * @description Central Roadmap structure that imports templates from sopData.
 * 
 * Phases:
 *   Phase 1 (Parallel): Steps 1-3 — Foundation
 *   Phase 2 (Parallel): Steps 4-5 — Product Realization & Operations
 *   Phase 3 (Parallel): Steps 6-7 — Oversight & Regulatory
 * 
 * ISO 13485:2016 Coverage: 62/62 clauses covered — Full compliance
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
      e: `
      This QMS roadmap provides deliverables to build a compliant Quality Management System (QMS), covering all clauses in ISO 13485.     
      

      TIME DEPENDENCIES

      Steps are grouped into three phases based on dependencies and parallel execution potential.
   
      Phase 1 — Foundation (Steps 1-3)
      Can all start immediately. Builds document control, management framework, and resource infrastructure in parallel.
   
      Phase 2 — Product Realization & Operations (Steps 4-5)
      Starts after Phase 1 is in place. Design control and operational processes run in parallel.
    
      Phase 3 — Oversight & Regulatory (Steps 6-7)
      Starts after Phase 2 processes are operational. Measurement, CAPA, and regulatory affairs run in parallel.

      
      DOCUMENTATION HIERARCHY

      Level 1. Quality Policy & Objectives
      Defines the corporate commitment to quality and regulatory compliance, establishing measurable targets.
   
     Level 2. Quality Manual (QM)
     Describes the scope of the QMS, system structure, and justifications for requirement exclusions. 
    
     Level 3. Standard Operating Procedure (SOP) & Work Instructions (WIs)
     SOPs describe who does what and when, while WIs describes how to do specific tasks.

    Level 4. Forms & Records
    Provides evidence of actions, documenting what was done, when, and by whom to ensure full traceability.
    
   `},
    { t: ' Resulting File Structure ', 
      e: `

📁 ISO 13485-QMS
  📁 4-QMS
  📁 5-MANAGEMENT RESPONSIBILITY
  📁 6-RESOURCE MANAGEMENT
  📁 7-PRODUCT REALIZATION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT
  📁 9-REGULATORY AFFAIRS`,
      files: {}
    }
  ]
},

/************************************************** STEP 1 ********************************************/
{   id: 'step1', 
    title: 'Phase 1: Step 1) Set Up Document & Data Control', 
    desc: 'Solidify essential QMS foundations: document control, software validation, and data integrity. Runs in parallel with Steps 2-3. Covers ISO 13485 §4.1, §4.2.4, §4.2.5.',
    checklist: [
      { t: '1.1) Perform a GAP Analysis', 
        e: 'A GAP analysis is done by QA and the report shows the gap between current state of the company and full QMS compliance. Management can use this to prioritize improvement initiatives.' },

      { t: '1.2) Create a SOP for Document & Data Control (4.1, 4.2.4, 4.2.5)', 
        e: 'This SOP defines who validates the eQMS, controls QMS documents, and verifies automated backups, to secure data integrity, ensure only approved document revisions are in use, and guarantee full business recovery if system failures occur.',
        sop: SOP_DATA.SOP_DOC_DATA_CONTROL
      },
      
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
    '4-QMS': [
      { sop: SOP_DATA.SOP_DOC_DATA_CONTROL, indent: '    ' }
    ]
  }
 }
]
},

/************************************************** STEP 2 ********************************************/
{ id: 'step2', 
      title: 'Phase 1: Step 2) Create the Management Framework',
      desc: 'Define the QMS scope, structure, quality policy, objectives, organizational roles (including PRRC), and management review cycles. Runs in parallel with Steps 1, 3. Covers ISO 13485 §4.2.2, §5.3, §5.4.1, §5.5, §5.6 & MDR Art. 15.',
      checklist: [
        { t: '2.1) Generate the Quality Manual (4.2.2)', 
          e: 'The QM describes what the QMS covers and why. It defines the QMS scope, structure, process interaction map, and provides documented justifications for any requirement exclusions. It is the starting document for NB auditors, new employees, and external parties.', 
          sop: SOP_DATA.QUALITY_MANUAL 
        },

        { t: '2.2) Establish Management Framework (5.3, 5.4.1, 5.5, 5.6 & MDR Art. 15)', 
          e: 'This SOP defines who sets the Quality Policy and objectives, who is appointed as PRRC, and when Management Reviews are conducted. It proves to auditors that management is committed, a PRRC exists, and the QMS is systematically reviewed.',
          sop: SOP_DATA.SOP_MANAGEMENT_FRAMEWORK
        },
        
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
    '4-QMS': [
      { sop: SOP_DATA.QUALITY_MANUAL, indent: '    ' }
    ],
    '5-MANAGEMENT RESPONSIBILITY': [
      { sop: SOP_DATA.SOP_MANAGEMENT_FRAMEWORK, indent: '  ' }
    ]
  }
        }       
      ]
    },

/************************************************** STEP 3 ********************************************/
    { id: 'step3', 
      title: 'Phase 1: Step 3) Establish Resource Management', 
      desc: 'Ensure competence, training, infrastructure, IT environment, and work environment controls. Runs in parallel with Steps 1-2. Covers ISO 13485 §6.2, §6.3, §6.4.',
      checklist: [
        { t: '3.1) Create a SOP for Competence & Training (6.2)', 
          e: 'This SOP defines who assesses competence gaps and when personnel training records are updated, to maintain a qualified training matrix and provide objective evidence of staff qualifications during audits.',
          sop: SOP_DATA.SOP_COMPETENCE_TRAINING
        },
        { t: '3.2) Create a SOP for Infrastructure, Work Environment & IT (6.3, 6.4)', 
          e: 'This SOP defines who maintains IT infrastructure, controls the work environment (cleanrooms, ESD, temperature), and when security updates are performed, to prevent data loss, unauthorized system changes, and ensure a compliant physical and digital workspace.',
          sop: SOP_DATA.SOP_INFRASTRUCTURE_IT
        }, 
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
            '6-RESOURCE MANAGEMENT': [
              { sop: SOP_DATA.SOP_COMPETENCE_TRAINING, indent: '  ' },
              { sop: SOP_DATA.SOP_INFRASTRUCTURE_IT, indent: '  ' }
            ]
          }
        }
      ]
    },

/************************************************** STEP 4 ********************************************/
{ id: 'step4', 
  title: 'Phase 2: Step 4) Establish Product Realisation & Design', 
  desc: 'Control development from idea to finished product with full traceability. Records feed into Technical Documentation. Runs in parallel with Step 5. Covers ISO 13485 §7.1, §7.3.1-7.3.10.',
  
  checklist: [
    { t: '4.1) Create a SOP for Design Control (7.3.1-7.3.7, 7.3.10)',
      e: 'This SOP defines who documents product development phases and when formal design reviews are conducted, to establish a compliant Design History File (DHF) with full traceability from inputs to outputs.',
      sop: SOP_DATA.SOP_DESIGN_CONTROL 
    },

    { t: '4.2) Create a SOP for Risk Management throughout Lifecycle (7.1 & ISO 14971)',
      e: 'This SOP defines who identifies product hazards and when risk assessments are updated, to maintain a lifecycle risk management file and secure patient and user safety.',
      sop: SOP_DATA.SOP_RISK_MANAGEMENT 
    },
    
    { t: '4.3) Create a SOP for Clinical Evaluation & Device Validation (7.3.6, 7.3.7)',
      e: 'This SOP defines who performs clinical assessments and when device validation is executed, to gather clinical evidence and confirm that the device meets its intended use and user needs safely.', 
      sop: SOP_DATA.SOP_CLINICAL_EVALUATION 
    },

    { t: '4.4) Create a SOP for Design Transfer (7.3.8)',
      e: 'This SOP defines who translates design outputs to production specifications and when transfer milestones are verified. It is used to ensure production builds match design specs before commercial release.',
      sop: SOP_DATA.SOP_DESIGN_TRANSFER
    },

    { t: '4.5) Create a SOP for Design Change Control (7.3.9)',
      e: 'This SOP defines who reviews engineering modifications and when changes are approved post-launch, to prevent unintended quality degradation and determine if NB notification is required per MDCG 2020-3.',
      sop: [SOP_DATA.SOP_CHANGE_CONTROL, SOP_DATA.CHANGE_MATRIX]
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
      📁 Design Transfer
      📁 Design Changes
      📁 Design Maintenance
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT
  📁 9-REGULATORY AFFAIRS
  `,
      files: { 
        '7-PRODUCT REALIZATION': [{ sop: SOP_DATA.SOP_DESIGN_CONTROL, indent:'  ' }],
        'Device Risk/Usability': [{ sop: SOP_DATA.SOP_RISK_MANAGEMENT, indent:'      ' }],
        'Design Validation': [{ sop: SOP_DATA.SOP_CLINICAL_EVALUATION, indent:'      ' }],
        'Design Transfer': [{ sop: SOP_DATA.SOP_DESIGN_TRANSFER, indent:'      ' }],
        'Design Changes': [{ sop: SOP_DATA.SOP_CHANGE_CONTROL, indent:'      ' }]
      }
    }
  ]
},

/************************************************** STEP 5 ********************************************/
{     id: 'step5', 
      title: 'Phase 2: Step 5) Establish Operations, Procurement & Traceability', 
      desc: 'Secure control over suppliers, production, product preservation, customer requirements, and measurement equipment. Runs in parallel with Step 4. Covers ISO 13485 §7.2, §7.4.1-7.4.3, §7.5.1-7.5.11, §7.6.',
      checklist: [
        { t: '5.1) Create a SOP for Supplier Control & Evaluation (7.4.1, 7.4.2, 7.4.3)',
          e: 'This SOP defines who evaluates, approves, and monitors external vendors, to maintain the Approved Supplier List (ASL), verify purchased product, and ensure all materials meet regulatory requirements.',
          sop: SOP_DATA.SOP_SUPPLIER_MANAGEMENT
        },
        { t: '5.2) Create a SOP for Production, Servicing & Preservation (7.5.1, 7.5.2, 7.5.3, 7.5.4, 7.5.5, 7.5.6, 7.5.7, 7.5.8, 7.5.9, 7.5.10, 7.5.11)',
          e: 'This SOP defines who controls manufacturing, validates production processes where output cannot be verified by subsequent monitoring, handles customer property, controls product cleanliness, executes installation and servicing, manages sterile production where applicable, assigns UDI for identification and traceability, and preserves product during handling, storage, and distribution.',
          sop: SOP_DATA.SOP_PRODUCTION_CONTROL
        },
        { t: '5.3) Create a SOP for Control of Monitoring & Measuring Equipment (7.6)',
          e: 'This SOP defines who calibrates, verifies, and maintains measuring and test equipment, to ensure valid measurement results for product conformity verification and process validation.',
          sop: SOP_DATA.SOP_MEASURING_EQUIPMENT
        },
        { t: '5.4) Create a SOP for Customer Processes & Market Feedback (7.2.1, 7.2.2, 7.2.3)',
          e: 'This SOP defines who reviews customer requirements, logs orders, and collects market feedback, to ensure customer needs are met and potential complaints are routed to the complaint handling process.',
          sop: SOP_DATA.SOP_CUSTOMER_PROCESSES
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
    📁 7.6-MEASURING_EQUIPMENT
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT
  📁 9-REGULATORY AFFAIRS`,
          files: {
            '7.4-PURCHASING': [
              { sop: SOP_DATA.SOP_SUPPLIER_MANAGEMENT, indent: '    ' }
            ],
            '7.5-PRODUCTION': [
              { sop: SOP_DATA.SOP_PRODUCTION_CONTROL, indent: '    ' }
            ],
            '7.6-MEASURING_EQUIPMENT': [
              { sop: SOP_DATA.SOP_MEASURING_EQUIPMENT, indent: '    ' }
            ]
          }
        }
      ]
    },

/************************************************** STEP 6 ********************************************/
    { id: 'step6', 
      title: 'Phase 3: Step 6) Establish Measurement, Analysis & Improvement', 
      desc: 'Monitor QMS performance, handle complaints, control non-conforming products, manage returns, and drive continuous improvement. Runs in parallel with Step 7. Covers ISO 13485 §8.1, §8.2.1-8.2.6, §8.3.1-8.3.4, §8.4, §8.5.1-8.5.3.',
      checklist: [

        { t: '6.1) Create a SOP for Complaint Handling (8.2.1, 8.2.2)',
          e: 'This SOP defines who receives, logs, investigates, and responds to customer complaints. It is used to ensure timely evaluation of feedback, determination of regulatory reporting requirements, and closure with the complainant.',
          sop: SOP_DATA.SOP_COMPLAINT_HANDLING
        },

        { t: '6.2) Create a SOP for Audit, CAPA & Product Release (8.2.4, 8.2.6, 8.3.1-8.3.4, 8.5.2, 8.5.3)', 
          e: 'This SOP defines who plans internal audits, investigates non-conformities with root cause analysis, handles returned products including rework decisions, and authorizes batch release. It is used to execute the annual audit plan, track corrective and preventive actions to closure, and verify product conformity before market release.',
          sop: SOP_DATA.SOP_AUDIT_CAPA_RELEASE
        },
       
        { t: '6.3) Create a SOP for Data Analysis & Continual Improvement (8.4, 8.5.1)', 
          e: 'This SOP defines who aggregates quality metrics from audits, complaints, CAPA, PMS, suppliers, and production, and when trend reports are compiled. It is used to evaluate QMS effectiveness and drive continual improvement through data-driven management decisions.',
          sop: SOP_DATA.SOP_015_DATA_ANALYSIS 
        },

        { t: '  — PMS and Vigilance:',
          e: '  Managed under Step 7 (Regulatory Affairs) per MDR Art. 83-92. Feedback loops between Step 5 (Customer Processes), Step 6 (Complaints, CAPA), and Step 7 (PMS/Vigilance) ensure all post-market data sources feed into the PMS system and CER updates.' 
        },
        
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
            '8-MEASUREMENT, ANALYSIS & IMPROVEMENT': [
              { sop: SOP_DATA.SOP_COMPLAINT_HANDLING, indent: '  ' },
              { sop: SOP_DATA.SOP_AUDIT_CAPA_RELEASE, indent: '  ' },
              { sop: SOP_DATA.SOP_015_DATA_ANALYSIS, indent: '  ' }
            ]
          }
        } 
      ]
    },

/************************************************** STEP 7 ********************************************/
    { id: 'step7', 
      title: 'Phase 3: Step 7) Establish Regulatory Affairs', 
      desc: 'Build the regulatory infrastructure for CE marking, submissions, and post-market compliance. Owned by Regulatory Affairs under PRRC oversight. Runs in parallel with Step 6. Covers MDR Art. 15, 27-31, 52, 83-92, Annex II, III, VI, IX.',
      checklist: [

        { t: '7.1) Create a SOP for Technical Documentation & EUDAMED Registration (MDR Annex II, III, Art. 29-31)',
          e: 'This SOP defines who compiles the Technical Documentation and who registers devices and economic operators in EUDAMED. It is used to package design outputs into submission-ready format and secure SRN issuance with valid UDI data before NB audits.',
          sop: SOP_DATA.SOP_TD_EUDAMED
        },

        { t: '7.2) Create a SOP for Post-Market Surveillance & Vigilance (MDR Art. 83-92)',
          e: 'This SOP defines who gathers field performance data and who evaluates and reports serious incidents. It is used to compile PSURs, manage FSCA/FSN, and feed real-world safety data back into risk management and clinical evaluation.',
          sop: SOP_DATA.SOP_PMS_VIGILANCE
        },

        { t: '7.3) Create a SOP for Notified Body Communication (MDR Art. 52, Annex IX)',
          e: 'This SOP defines who selects and contracts the NB and who manages audit logistics and NC responses. It is used to coordinate conformity assessments, maintain valid CE certificates, and ensure timely notification of significant changes.',
          sop: SOP_DATA.SOP_NB_COMMUNICATION
        },

        { t: '7.4) Create a SOP for Regulatory Intelligence & CA Interaction',
          e: 'This SOP defines who monitors regulatory changes and who handles competent authority queries. It is used to stay current with MDCG updates and standard revisions, and to manage Helsinki Procedure submissions and unannounced audits.',
          sop: SOP_DATA.SOP_REGULATORY_INTELLIGENCE
        },
       
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
              { sop: SOP_DATA.SOP_TD_EUDAMED, indent: '  ' },
              { sop: SOP_DATA.SOP_PMS_VIGILANCE, indent: '  ' },
              { sop: SOP_DATA.SOP_NB_COMMUNICATION, indent: '  ' },
              { sop: SOP_DATA.SOP_REGULATORY_INTELLIGENCE, indent: '  ' }
            ]
          }
        } 
      ]
    },
];