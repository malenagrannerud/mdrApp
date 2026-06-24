/**
 * @file qmsStepsData.js
 * @description Central Roadmap structure that imports templates from sopData.
 * 
 * Phases:
 *   Phase 1 (Parallel): Steps 1-3 — Foundation
 *   Phase 2 (Parallel): Steps 4-5 — Product Realization & Operations
 *   Phase 3 (Parallel): Steps 6-7 — Oversight & Regulatory
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
   
    { t: '  Phase 1 — Foundation (Steps 1-3)',
      e: '  Can all start immediately. Builds document control, management framework, and resource infrastructure in parallel.'}, 
   
    { t: '  Phase 2 — Product Realization & Operations (Steps 4-5)',
      e: '  Starts after Phase 1 foundation is in place. Design control and operational processes run in parallel.'}, 
    
    { t: '  Phase 3 — Oversight & Regulatory (Steps 6-7)',
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
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT
  📁 9-REGULATORY AFFAIRS`,
      files: {}
    }
  ]
},

/************************************************** STEP 1 ********************************************/
{   id: 'step1', 
    title: 'Phase 1: Step 1) Set Up Document & Data Control', 
    desc: 'Solidify essential QMS foundations: document control, software validation, and data integrity. Runs in parallel with Steps 2-3.',
    checklist: [
      { t: '1.1) Perform a GAP Analysis', 
        e: 'A GAP analysis is done by QA and the report shows the gap between current state of the company and full QMS compliance. Management can use this information to prioritize improvement initiatives.' },

      { t: '1.2) Create a SOP for Document & Data Control (4.1, 4.2.4, 4.2.5)', 
        e: 'This SOP consolidates three interconnected documentation processes: (a) Software Validation — validates eQMS and automated tools to secure data integrity; (b) Document Control — ensures only approved, current document revisions are available at points of use; (c) Data Integrity & Backup — verifies automated system backups for full business recovery. Consolidated because all three share the same owner (QA) and are audited together.',
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
      desc: 'Define the QMS scope, structure, quality policy, objectives, organizational roles (including PRRC), and management review cycles. Runs in parallel with Steps 1, 3.',
      checklist: [
        { t: '2.1) Generate the Quality Manual (4.2.2)', 
          e: 'The QM describes what the QMS covers and why. It defines the QMS scope, structure, process interaction map, and justifies any ISO 13485 exclusions. It is the starting document for NB auditors, new employees, and external parties.', 
          sop: SOP_DATA.QUALITY_MANUAL 
        },

        { t: '2.2) Establish Management Framework (5.3, 5.4.1, 5.5, 5.6 & MDR Art. 15)', 
          e: 'This SOP consolidates four management processes: Quality Policy, measurable objectives, organizational roles with PRRC appointment (MDR Art. 15), and annual Management Review. Proves to auditors that management is committed, a PRRC exists, and the QMS is systematically reviewed. Without it → ISO 13485 §5 fails → no CE marking.',
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
      desc: 'Ensure competence, training, and a secure working environment. Runs in parallel with Steps 1-2.',
      checklist: [
        { t: '3.1) Create a SOP for Competence & Training (6.2)', 
          e: 'This SOP defines who assesses competence gaps and when personnel training records are updated, to maintain a qualified training matrix and provide objective evidence of staff qualifications.',
          sop: SOP_DATA.SOP_COMPETENCE_TRAINING
        },
        { t: '3.2) Create a SOP for Infrastructure & IT Environment (6.3)', 
          e: 'This SOP defines who maintains IT infrastructure and when security updates are performed, to prevent data loss, unauthorized system changes, and secure a compliant digital validation environment.',
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
  desc: 'Control development from idea to finished product with full traceability. Records feed into Technical Documentation. Runs in parallel with Step 5.',
  
  checklist: [
    { t: '4.1) Create a SOP for Design Control (7.3)',
      e: 'This SOP defines who documents product development phases and when formal design reviews are conducted, used to establish a compliant Design History File (DHF) with traceability from inputs to outputs.',
      sop: SOP_DATA.SOP_DESIGN_CONTROL 
    },

    { t: '4.2) Create a SOP for Risk Management throughout Lifecycle (7.1 & ISO 14971)',
      e: 'This SOP defines who identifies product hazards and when risk assessments are updated, to maintain a lifecycle risk management file and secure patient and user safety.',
      sop: SOP_DATA.SOP_RISK_MANAGEMENT 
    },
    
    { t: '4.3) Create a SOP for Clinical Evaluation & Device Validation (7.3.7)',
      e: 'This SOP defines who performs clinical assessments and when device validation is executed, to gather clinical evidence and confirm that the device meets its intended use and user needs safely.', 
      sop: SOP_DATA.SOP_CLINICAL_EVALUATION 
    },

    { t: '4.4) Create a SOP for Design Transfer & Change Control (7.3.8, 7.3.9)',
      e: 'This SOP consolidates two linked processes: (a) Design Transfer — ensures design outputs are properly translated to production specifications; (b) Design Change Control — defines who reviews engineering modifications and when changes are approved post-launch, including regulatory classification per MDCG 2020-3. Consolidated because changes often span both design and production.',
      sop: [SOP_DATA.SOP_DESIGN_TRANSFER_CHANGE, SOP_DATA.CHANGE_MATRIX]
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
        'Design Transfer': [{ sop: SOP_DATA.SOP_DESIGN_TRANSFER_CHANGE, indent:'      ' }]
      }
    }
  ]
},

/************************************************** STEP 5 ********************************************/
{     id: 'step5', 
      title: 'Phase 2: Step 5) Establish Operations, Procurement & Traceability', 
      desc: 'Secure control over suppliers, production, customer requirements, and traceability. Runs in parallel with Step 4.',
      checklist: [
        { t: '5.1) Create a SOP for Supplier & Production Control (7.4, 7.5, 7.6)',
          e: 'This SOP consolidates three operational processes: (a) Purchasing & Supplier Control — evaluates external vendors and maintains the Approved Supplier List (ASL); (b) Supplier Evaluation — qualifies new suppliers through audits and performance monitoring; (c) Production, Servicing & UDI Traceability — controls manufacturing batches and secures end-to-end device traceability. Consolidated because supplier quality directly impacts production quality.',
          sop: SOP_DATA.SOP_SUPPLIER_PRODUCTION
        },
        { t: '5.2) Create a SOP for Customer Processes & Market Feedback (7.2)',
          e: 'This SOP defines who logs user input and when market data is analyzed, to address customer requirements, manage post-market feedback, and capture potential complaints. Kept separate because customer feedback routes to RA for PMS/vigilance, not to production.',
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
    📁 7.4-SUPPLIER_&_PRODUCTION
  📁 8-MEASUREMENT, ANALYSIS & IMPROVEMENT
  📁 9-REGULATORY AFFAIRS`,
          files: {
            '7.4-SUPPLIER_&_PRODUCTION': [
              { sop: SOP_DATA.SOP_SUPPLIER_PRODUCTION, indent: '    ' }
            ]
          }
        }
      ]
    },

/************************************************** STEP 6 ********************************************/
    { id: 'step6', 
      title: 'Phase 3: Step 6) Establish Measurement, Analysis & Improvement', 
      desc: 'Monitor QMS performance, control non-conforming products, and drive continuous improvement. ISO 13485 Section 8. Runs in parallel with Step 7.',
      checklist: [

        { t: '6.1) Create a SOP for Audit, CAPA & Product Release (8.2.4, 8.2.6, 8.3, 8.5.2, 8.5.3)', 
          e: 'This SOP consolidates three interconnected quality processes: (a) Internal Audit — plans and conducts annual QMS audits; (b) Product Release — verifies batch conformity before market release per PRRC oversight; (c) NC & CAPA Management — logs non-conformities, triggers root-cause investigation, and tracks corrective/preventive actions to closure. Consolidated because audit findings directly feed CAPA, and CAPA effectiveness is verified at product release.',
          sop: SOP_DATA.SOP_AUDIT_CAPA_RELEASE
        },
       
        { t: '6.2) Create a SOP for Data Analysis & Trends (8.4)', 
          e: 'This SOP defines who aggregates quality metrics and when trend reports are compiled, to evaluate QMS effectiveness and feed crucial data into management reviews. Kept separate because data analysis serves both QA and RA functions.',
          sop: SOP_DATA.SOP_015_DATA_ANALYSIS 
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
      desc: 'Build the regulatory infrastructure for CE marking, submissions, and post-market compliance. Owned by Regulatory Affairs under PRRC oversight. Runs in parallel with Step 6.',
      checklist: [

        { t: '7.1) Create a SOP for Technical Documentation & EUDAMED Registration (MDR Annex II, III, Art. 29-31)',
          e: 'This SOP consolidates two submission-related processes: (a) TD Compilation — packages design outputs into submission-ready format per MDR Annex II & III; (b) EUDAMED & UDI Registration — registers economic operators and devices, assigns Basic UDI-DI and UDI-DI. Consolidated because both are submission prerequisites handled by the same RA team.',
          sop: SOP_DATA.SOP_TD_EUDAMED
        },

        { t: '7.2) Create a SOP for Post-Market Surveillance & Vigilance (MDR Art. 83-92)',
          e: 'This SOP consolidates two post-market processes: (a) PMS — gathers field performance data, compiles PSUR, and feeds data back to risk/clinical; (b) Vigilance — evaluates incidents, reports serious incidents within 15 days, manages FSCA/FSN. Consolidated because both share the same data sources (complaints, feedback, literature) and are audited together.',
          sop: SOP_DATA.SOP_PMS_VIGILANCE
        },

        { t: '7.3) Create a SOP for Notified Body Communication (MDR Art. 52, Annex IX)',
          e: 'This SOP defines who manages NB interactions — selection via NANDO, submission dossiers, audit coordination, NC responses, and certificate maintenance. Kept separate because NB communication is a distinct competency from submission preparation.',
          sop: SOP_DATA.SOP_NB_COMMUNICATION
        },

        { t: '7.4) Create a SOP for Regulatory Intelligence & CA Interaction',
          e: 'This SOP defines who monitors regulatory changes (MDCG updates, standard revisions, new legislation) and when competent authority interactions are required (Helsinki Procedure, registration queries, unannounced audits). Kept separate because it requires continuous horizon scanning, not event-driven execution.',
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