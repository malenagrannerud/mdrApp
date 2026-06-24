/**
 * @file sopData2.js
 * @description Quality Manual, Management Responsibility, and Resource Management SOPs - Steps 2, 3, 4
 */

export const SOP_DATA2 = {

  // ------------------ STEP 2: QUALITY MANUAL ------------------
  QUALITY_MANUAL: {
    id: 'QM-001',
    title: '📄 Quality_Manual.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this Quality Manual is to define the scope, structure, and governance of the Quality Management System (QMS) in accordance with ISO 13485:2016 and applicable regulatory requirements including MDR 2017/745.

## 2. SCOPE
This QMS applies to all activities related to the design, development, manufacturing, and distribution of medical devices placed on the EU market.

## 3. QMS STRUCTURE
[TABLE_START]

| Level | Document Type | Description |
| 1 | Quality Policy & Objectives | Corporate commitment and measurable targets |
| 2 | Quality Manual | QMS scope, structure, and exclusion justifications |
| 3 | Standard Operating Procedures (SOPs) | Who does what and when |
| 4 | Work Instructions (WIs) | How to execute specific tasks |
| 5 | Forms & Records | Objective evidence of compliance |
[TABLE_END]

## 4. EXCLUSIONS
The following ISO 13485:2016 requirements are excluded with justification:
- [List any exclusions, e.g., §7.5.3 Installation activities — not applicable as device is plug-and-play]

## 5. APPLICABLE REGULATIONS & STANDARDS
- ISO 13485:2016 — Medical devices — Quality management systems
- MDR 2017/745 — EU Medical Device Regulation
- ISO 14971:2019 — Risk management for medical devices
- EN 62366-1 — Usability engineering

## 6. PROCESS INTERACTION MAP
The QMS processes are grouped into three implementation phases:
- Phase 1 (Foundation): Document control, management responsibility, resource management
- Phase 2 (Product Realization): Design control, risk management, clinical evaluation, operations
- Phase 3 (Oversight): Measurement/analysis, CAPA, regulatory affairs

## 7. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 3.1: QUALITY POLICY & OBJECTIVES ------------------
  SOP_QUALITY_POLICY: {
    id: 'SOP-MGMT-001',
    title: '📄 SOP-Quality_Policy_and_Objectives.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for establishing, communicating, and reviewing the Quality Policy and measurable Quality Objectives in accordance with ISO 13485:2016 §5.3 and §5.4.1.

## 2. SCOPE
Applies to the corporate Quality Policy and all departmental and product-specific Quality Objectives.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| Top Management | Approve Quality Policy and authorize Quality Objectives |
| QA | Draft Quality Policy, coordinate objective setting, and monitor progress |
| Department Heads | Propose and track departmental objectives |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Draft | Draft Quality Policy stating commitment to regulatory compliance and customer satisfaction. | QA | Quality_Policy_Draft |
| 2-Review | Management reviews policy for alignment with strategic direction. | Top Management | Management_Review_Minutes |
| 3-Approve | CEO signs and dates the Quality Policy. | Top Management | Signed_Quality_Policy |
| 4-Communicate | Distribute policy to all employees. Post in common areas and eQMS. | QA | Training_Record |
| 5-Objectives | Establish SMART quality objectives for each department. | QA + Dept Heads | Quality_Objectives_Matrix.xlsx |
| 6-Monitor | Review objective performance quarterly. Update as needed. | QA | Quarterly_Review_Report |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 3.2: ROLES & PRRC ------------------
  SOP_ROLES_PRRC: {
    id: 'SOP-MGMT-002',
    title: '📄 SOP-Roles_Responsibility_and_PRRC_Appointment.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define organizational roles, responsibilities, and authorities within the QMS, and to formalize the appointment of the Person Responsible for Regulatory Compliance (PRRC) in accordance with ISO 13485:2016 §5.5 and MDR 2017/745 Article 15.

## 2. SCOPE
Applies to all personnel whose work affects product quality or regulatory compliance.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| Top Management | Approve organizational structure, appoint PRRC, and provide adequate resources |
| PRRC | Oversee regulatory compliance per MDR Art. 15(3) |
| QA | Maintain organizational chart and job descriptions |
[TABLE_END]

## 4. PRRC MANDATE (MDR Art. 15)
[TABLE_START]

| Duty | Description |
| Conformity Verification | Ensure that conformity of devices is appropriately checked before batch release |
| Technical Documentation | Ensure that TD and DoC are drawn up and maintained |
| Post-Market Surveillance | Ensure that PMS obligations are complied with |
| Vigilance Reporting | Ensure that serious incident reporting obligations are fulfilled |
| High-Risk Devices | For Class III/custom-made: ensure SSCP is issued (Art. 32) |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Org Chart | Create and maintain organizational chart showing QMS roles. | QA | Organizational_Chart |
| 2-PRRC Appointment | Top Management appoints PRRC via signed mandate letter. | Top Management | PRRC_Mandate_Letter |
| 3-Job Descriptions | Define qualifications and responsibilities for all QMS roles. | QA + Dept Heads | Job_Descriptions |
| 4-Communication | Ensure personnel are aware of their QMS responsibilities. | QA | Training_Records |
[TABLE_END]

## 6. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 3.3: MANAGEMENT REVIEW ------------------
  SOP_MANAGEMENT_REVIEW: {
    id: 'SOP-MGMT-003',
    title: '📄 SOP-Management_Review.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for conducting periodic Management Reviews to evaluate the continuing suitability, adequacy, and effectiveness of the QMS in accordance with ISO 13485:2016 §5.6.

## 2. SCOPE
Applies to all scheduled and ad-hoc Management Reviews of the QMS.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| Top Management | Chair review meetings and authorize resource allocation |
| QA | Prepare meeting agenda, compile data inputs, and document minutes |
| PRRC | Present regulatory compliance status |
| Department Heads | Present departmental performance data |
[TABLE_END]

## 4. INPUTS (ISO 13485 §5.6.2)
[TABLE_START]

| Input | Source |
| Audit results | Internal and external audit reports |
| Customer feedback & complaints | PMS and vigilance logs |
| Process performance & product conformity | Production and QA reports |
| Status of CAPA | NC/CAPA register |
| Follow-up from previous reviews | Previous meeting minutes |
| Changes affecting QMS | Regulatory intelligence, organizational changes |
| Recommendations for improvement | All departments |
[TABLE_END]

## 5. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Schedule | Schedule Management Reviews at least annually. | QA | Meeting_Invitation |
| 2-Prepare | Compile input data from all departments. | QA | Management_Review_Pack |
| 3-Conduct | Review QMS performance, identify gaps, and approve improvement actions. | Top Management | Meeting_Minutes |
| 4-Output | Document decisions on QMS improvements, resource needs, and policy changes. | QA | Management_Review_Output |
| 5-Follow-up | Track and verify completion of action items. | QA | Action_Item_Log |
[TABLE_END]

## 6. OUTPUTS (ISO 13485 §5.6.3)
- Improvements needed to maintain QMS effectiveness
- Resource requirements
- Any changes to Quality Policy or Objectives

## 7. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 4.1: COMPETENCE & TRAINING ------------------
  SOP_COMPETENCE_TRAINING: {
    id: 'SOP-RES-001',
    title: '📄 SOP-Competence_and_Training.pdf',
    version: '1.0',
    owner: 'HR / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for identifying competence requirements, providing training, and evaluating effectiveness in accordance with ISO 13485:2016 §6.2.

## 2. SCOPE
Applies to all personnel whose work affects product quality or QMS performance.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| HR | Maintain training records and coordinate training logistics |
| Department Heads | Identify competence gaps and nominate personnel for training |
| QA | Verify training effectiveness and maintain training matrix |
| Employees | Complete assigned training and document attendance |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Competence Mapping | Define required competencies for each QMS role. | Dept Heads | Competence_Matrix.xlsx |
| 2-Gap Analysis | Assess current personnel against required competencies. | HR + Dept Heads | Training_Needs_Assessment |
| 3-Training Plan | Develop annual training plan addressing identified gaps. | HR | Annual_Training_Plan |
| 4-Delivery | Execute training (internal, external, or e-learning). | HR | Training_Attendance_Sheet |
| 5-Effectiveness Check | Evaluate training effectiveness via test, observation, or performance review. | QA | Training_Effectiveness_Record |
| 6-Records | Maintain training records for each employee. | HR | Personnel_Training_File |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 4.2: INFRASTRUCTURE & IT ------------------
  SOP_INFRASTRUCTURE_IT: {
    id: 'SOP-RES-002',
    title: '📄 SOP-Infrastructure_and_IT_Environment.pdf',
    version: '1.0',
    owner: 'IT / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to define the process for maintaining infrastructure and IT environment to ensure product quality and data integrity in accordance with ISO 13485:2016 §6.3.

## 2. SCOPE
Applies to buildings, utilities, IT systems, network infrastructure, and software tools supporting QMS activities.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| IT Manager | Maintain IT infrastructure, apply security patches, and manage user access |
| Facility Manager | Maintain buildings, utilities, and environmental controls |
| QA | Verify infrastructure suitability for QMS compliance |
[TABLE_END]

## 4. PROCEDURE
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Inventory | Maintain inventory of IT systems, servers, and software tools. | IT | IT_Asset_Register.xlsx |
| 2-Maintenance | Perform preventive maintenance per schedule. Log all repairs. | IT / Facilities | Maintenance_Log |
| 3-Access Control | Manage user accounts, permissions, and password policies. | IT | User_Access_Log |
| 4-Security Updates | Apply critical security patches within 30 days of release. | IT | Patch_Management_Log |
| 5-Backup Verification | Verify automated backups per SOP_Backup_and_Restore. | IT | Backup_Verification_Log |
| 6-Change Control | Document and approve all infrastructure changes. | IT + QA | Change_Request |
| 7-Disaster Recovery | Test disaster recovery plan annually. | IT | DR_Test_Report |
[TABLE_END]

## 5. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA/IT |
[TABLE_END]
    `.trim()
  }
};