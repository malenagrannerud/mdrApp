/**
 * @file sopData2.js
 * @description Quality Manual, Management Framework, and Resource Management SOPs - Steps 2, 3
 */

export const SOP_DATA2 = {

  // ------------------ STEP 2.1: QUALITY MANUAL ------------------
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
- Phase 1 (Foundation): Document control, management framework, resource management
- Phase 2 (Product Realization): Design control, risk management, clinical evaluation, operations
- Phase 3 (Oversight): Measurement/analysis, CAPA, regulatory affairs

## 7. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 2.2: MANAGEMENT FRAMEWORK ------------------
  SOP_MANAGEMENT_FRAMEWORK: {
    id: 'SOP-MGMT-001',
    title: '📄 SOP-Management_Framework.pdf',
    version: '1.0',
    owner: 'Top Management / QA',
    content: `
## 1. PURPOSE
The purpose of this SOP is to consolidate management responsibilities required by ISO 13485:2016 §5.3, §5.4.1, §5.5, §5.6 and MDR 2017/745 Article 15 into a single controlled document. It defines the corporate Quality Policy, measurable Quality Objectives, organizational roles including formal PRRC appointment, and the annual Management Review framework.

## 2. SCOPE
Applies to top management, all department heads, and the appointed PRRC.

## 3. RESPONSIBILITY
[TABLE_START]

| Role | Responsibility |
| CEO / Top Management | Approve Quality Policy, sign PRRC mandate, chair Management Review, and authorize resources |
| QA Manager | Draft policy, coordinate objectives, compile Management Review inputs, and document minutes |
| PRRC | Oversee regulatory compliance per MDR Art. 15(3) |
| Department Heads | Propose and track departmental objectives, present performance data at Management Review |
[TABLE_END]

## 4. PART A — QUALITY POLICY (ISO 13485 §5.3)
[COMPANY NAME] is committed to designing, manufacturing, and delivering safe and effective medical devices that meet or exceed customer expectations and comply with all applicable regulatory requirements including ISO 13485:2016 and MDR 2017/745.

Top management commits to:
- Maintaining an effective Quality Management System
- Establishing and reviewing measurable Quality Objectives
- Providing adequate resources for QMS implementation
- Driving continuous improvement through data-driven decisions
- Communicating this policy to all employees

Signed: _________________ (CEO)  Date: _______________

## 5. PART B — QUALITY OBJECTIVES (ISO 13485 §5.4.1)
[TABLE_START]

| Objective | Metric | Target | Responsible | Review |
| Customer satisfaction | Complaint rate | <1% of units sold | Customer Service | Quarterly |
| Product quality | Batch rejection rate | <0.5% | QA | Monthly |
| On-time delivery | Order fulfillment | >95% | Operations | Monthly |
| Regulatory compliance | Audit NC count | 0 major NCs | QA / RA | Per audit |
| Supplier performance | Defect rate | <2% | Purchasing | Quarterly |
| Training completion | Training records up to date | 100% | HR | Quarterly |
[TABLE_END]

## 6. PART C — ROLES & PRRC APPOINTMENT (ISO 13485 §5.5, MDR Art. 15)
[TABLE_START]

| PRRC Duty (MDR Art. 15) | Description |
| Conformity Verification | Ensure device conformity is checked before batch release |
| Technical Documentation | Ensure TD and DoC are drawn up and maintained |
| Post-Market Surveillance | Ensure PMS obligations are complied with |
| Vigilance Reporting | Ensure serious incident reporting obligations are fulfilled |
| High-Risk Devices | For Class III/custom-made: ensure SSCP is issued (Art. 32) |
[TABLE_END]

PRRC Appointment:
Name: _________________
Title: _________________
Signed: _________________ (CEO)  Date: _______________
Signed: _________________ (PRRC)  Date: _______________

## 7. PART D — MANAGEMENT REVIEW (ISO 13485 §5.6)
[TABLE_START]

| Phase | Actions | Responsible | Record |
| 1-Schedule | Schedule Management Review at least annually. | QA | Meeting_Invitation |
| 2-Inputs | Compile: audit results, customer feedback, process performance, CAPA status, PMS data, previous actions, changes, recommendations. | QA | Management_Review_Pack |
| 3-Conduct | Review QMS performance, identify gaps, and approve improvement actions. | Top Management | Meeting_Minutes |
| 4-Outputs | Document decisions on QMS improvements, resource needs, and policy changes. | QA | Management_Review_Output |
| 5-Follow-up | Track and verify completion of action items. | QA | Action_Item_Log |
[TABLE_END]

## 8. MANAGEMENT REVIEW INPUTS (ISO 13485 §5.6.2)
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

## 9. MANAGEMENT REVIEW OUTPUTS (ISO 13485 §5.6.3)
- Improvements needed to maintain QMS effectiveness
- Resource requirements
- Any changes to Quality Policy or Objectives

## 10. REVISION HISTORY
[TABLE_START]

| Rev. | Date | Description of Change | Author |
| 1.0 | 2026-06-24 | Initial release — consolidates SOP_QUALITY_POLICY, SOP_ROLES_PRRC, and SOP_MANAGEMENT_REVIEW | QA |
[TABLE_END]
    `.trim()
  },

  // ------------------ STEP 3.1: COMPETENCE & TRAINING ------------------
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

  // ------------------ STEP 3.2: INFRASTRUCTURE & IT ------------------
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