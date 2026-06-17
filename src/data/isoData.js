/**
 * @file isoData.js
 * @description Global regulatory reference standard for ISO 13485:2016 clauses and definitions.
 */

export const ISO_DATA = {
  metadata: {
    title: "ISO 13485 Headlines and Short Description",
    source: "https://www.iso.org/standard/59752.html",
    version: "2016"
  },

/**********************************************************************************************/

  scope: {
    title: "1 Scope",
    content: `
This Standard specifies requirements for a quality management system (QMS) where an organization needs to 
demonstrate its ability to provide medical devices (MD) and related services that consistently meet customer 
and applicable regulatory requirements.

Such organizations can be involved in one or more stages of the life-cycle, including 
- design and development, 
- production, 
- storage and distribution, 
- installation, or 
- servicing of a MD and design and development or provision of associated activities (e.g. technical support). 
*You may certify regardless of whether you only design or manufacture or do everything*

This Standard can also be used by suppliers or external parties that provide product, including QMS related services to such organizations. 
Requirements of this Standard are applicable to organizations regardless of size and type except where explicitly stated. 
Wherever requirements are specified as applying to medical devices, the requirements apply equally to associated services as supplied 
by the organization. 

The processes required by this Standard that are applicable to the organization, but which are not performed by the organization, 
are the responsibility of the organization and are accounted for in the organizations QMS by monitoring, maintaining, and controlling 
the processes. 
*If the organization outsources activities, it remains responsible for ensuring those processes are properly controlled within the QMS.*

If applicable regulatory requirements permit exclusions of design and development controls, this can be used as a justification for 
their exclusion from the QMS. These regulatory requirements can provide alternative approaches that are to be addressed in the QMS. 
It is the responsibility of the organization to ensure that claims of conformity to this Standard reflect any exclusion of design and 
development controls.

If any requirement in Clauses 6, 7 or 8 of this Standard is not applicable due to the activities undertaken by the organization 
or the nature of the MD for which the QMS is applied, the organization does not need to include such a requirement in its QMS. 
For any clause that is determined to be not applicable, the organization records the justification as described in 4.2.2.

* Skip sections in 6, 7 or 8 in case they are not applicable *
`.trim()
  },

/**********************************************************************************************/
  references: {
    title: "2 Normative references",
    content: `
The following documents, in whole or in part, are normatively referenced in this document and are indispensable for its application. 
For dated references, only the edition cited applies. For undated references, the latest edition of the referenced document (& amendments) applies.

ISO 9000:2015, Quality management systems — Fundamentals and vocabulary`.trim()
  },

/**********************************************************************************************/

  definitions: {
    title: "3 Terms and definitions",
    subtitle: "Terms and Definitions - ISO 13485:2016",
    desc: "This document lists the terms and definitions as defined in Clause 3 of ISO 13485:2016. These definitions apply to the entire Quality Management System (QMS).",
    table: `
[TABLE_START]

| Ref | Term | Definition |
| :--- | :--- | :--- |
| **3.1** | **advisory notice** | Notice issued by the organization, subsequent to delivery of the MD, to provide supplementary information or to advise on what action should be taken in the use, modification, return or destruction of a MD. |
| **3.2** | **authorized representative** | Natural or legal person established within a country or jurisdiction who has received a written mandate from the manufacturer to act on his behalf in relation to specified tasks with regard to the manufacturer’s obligations under that country’s or jurisdiction’s legislation. |
| **3.3** | **clinical evaluation** | Assessment and analysis of clinical data pertaining to a MD to verify the clinical safety and performance of the device when used as intended by the manufacturer. |
| **3.4** | **complaint** | Written, electronic or oral communication that alleges deficiencies related to the identity, quality, durability, reliability, usability, safety or performance of a MD that has been released from the organization’s control or related to a service that affects the performance of such medical devices. |
| **3.5** | **distributor** | Natural or legal person in the supply chain who, on his own behalf, furthers the availability of a medical device to the further user. |
| **3.6** | **importer** | First natural or legal person in the supply chain who makes a MD originating in another country or jurisdiction available on the market where it is to be distributed. |
| **3.7** | **labelling** | Label, instructions for use, and any other information that is related to identification, technical description, intended purpose and proper use of the MD, but excluding shipping documents. |
| **3.8** | **life-cycle** | All phases in the life of a MD, from the initial conception to final decommissioning and disposal. |
| **3.9** | **manufacturer** | Natural or legal person with responsibility for design and/or manufacture of a MD with the intention of making the MD available for use, under his name; whether or not such a MD is designed and/or manufactured by that person himself or on his behalf by another person(s). |
| **3.10** | **medical device** | Instrument, apparatus, implement, machine, appliance, implant, reagent for in vitro use, software, material or other similar or related article, intended by the manufacturer to be used, alone or in combination, for human beings, for one or more of the specific medical purpose(s) of: diagnosis, prevention, monitoring, prediction, prognosis, treatment or alleviation of disease; diagnosis, monitoring, treatment, alleviation of or compensation for an injury; investigation, replacement, modification, or support of the anatomy or of a physiological process; supporting or sustaining life; control of conception; disinfection of medical devices; providing information by means of in vitro examination of specimens derived from the human body; and does not achieve its primary intended action by pharmacological, immunological or metabolic means, in or on the human body, but which may be assisted in its intended function by such means. |
| **3.11** | **medical device family** | Group of medical devices made by or for the same organization and having the same basic design and performance characteristics related to safety, intended use and function. |
| **3.12** | **performance evaluation** | Assessment and analysis of data to establish or verify the ability of an in vitro diagnostic MD to achieve its intended use. |
| **3.13** | **post-market surveillance** | Systematic process to collect and analyse experience gained from MD that have been placed on the market. |
| **3.14** | **product** | Result of a process. (There are four generic product categories: services, software, hardware and processed materials). |
| **3.15** | **purchased product** | Product provided by a party outside the organization’s quality management system. |
| **3.16** | **risk** | Combination of the probability of occurrence of harm and the severity of that harm. |
| **3.17** | **risk management** | Systematic application of management policies, procedures and practices to the tasks of analysing, evaluating, controlling and monitoring risk. |
| **3.18** | **sterile barrier system** | Minimum package that prevents ingress of microorganisms and allows aseptic presentation of the product at the point of use. |
| **3.19** | **sterile medical device** | Medical device intended to meet the requirements for sterility. |
| **3.20** | **verification** | Confirmation, through the provision of objective evidence, that specified requirements have been fulfilled. |
[TABLE_END]
*Note: For terms not defined above, the definitions in ISO 9000:2015 apply.*`.trim()
  },

/**********************************************************************************************/
  documentation_requirements: {
    title: "4.2 Documentation requirements",
    content: `

4. QMS
    4.1 General requirements
    4.2 Documentation requirements
        4.2.1 General requirements
        4.2.2 Quality manual
        4.2.3 Control of documents
        4.2.4 Control of records
        4.2.5 Control of records 

5. Management responsibility 
    5.1 Management commitment 
    5.2 Customer focus 
    5.3 Quality policy 
    5.4 Planning 
        5.4.1 Quality objectives 
        5.4.2 Quality management system planning 
    5.5 Responsibility, authority and communication 
        5.5.1 Responsibility and authority 
        5.5.2 Management representative 
        5.5.3 Internal communication 
    5.6 Management review
        5.6.1 General
        5.6.2 Review input 
        5.6.3 Review output
    
6. Resource management 
    6.1 Provision of resources
    6.2 Human resources 
        6.2.1 General 
        6.2.2 Competence, training and awareness 
    6.3 Infrastructure 
    6.4 Work environment and contamination control

7 Product realization 
    7.1 Planning of product realization 
    7.2 Customer-related processes 
        7.2.1 Determination of requirements related to product
        7.2.2 Review of requirements related to product
        7.2.3 Communication 
    7.3 Design and development 
        7.3.1 General 
        7.3.2 Design and development planning 
        7.3.3 Design and development inputs 
        7.3.4 Design and development outputs 
        7.3.5 Design and development review 
        7.3.6 Design and development verification 
        7.3.7 Design and development validation 
        7.3.8 Design and development transfer 
        7.3.9 Control of design and development changes 
        7.3.10 Design and development files 
    7.4 Purchasing 
        7.4.1 Purchasing process 
        7.4.2 Purchasing information 
        7.4.3 Verification of purchased product 
    7.5 Production and service provision 
        7.5.1 Control of production and service provision 
        7.5.2 Cleanliness of product 
        7.5.3 Installation activities 
        7.5.4 Servicing activities 
        7.5.5 Particular requirements for sterile medical devices 
        7.5.6 Validation of processes for production and service provision 
        7.5.7 Particular requirements for validation of processes for sterilization and sterile barrier systems 
        7.5.8 Identification 
        7.5.9 Traceability 
        7.5.10 Customer property 
        7.5.11 Preservation of product 
    7.6 Control of monitoring and measuring equipment 

8 Measurement, analysis and improvement 
    8.1 General
    8.2 Monitoring and measurement 
        8.2.1 Feedback 
        8.2.2 Complaint handling 
        8.2.3 Reporting to regulatory authorities 
        8.2.4 Internal audit 
        8.2.5 Monitoring and measurement of processes 
        8.2.6 Monitoring and measurement of product 
    8.3 Control of nonconforming product 
        8.3.1 General 
        8.3.2 Actions in response to nonconforming product detected before delivery 
        8.3.3 Actions in response to nonconforming product detected after delivery 
        8.3.4 Rework 
    8.4 Analysis of data 
    8.5 Improvement 
        8.5.1 General 
        8.5.2 Corrective action 
        8.5.3 Preventive action 

Annex A Comparison of content between ISO 13485:2003 and ISO 13485:2016
Annex B Correspondence between ISO 13485:2016 and ISO 9001:2015
Bibliography
[1]	ISO 9001:2015^3, Quality management systems — Requirements
[2]	ISO 10012, Measurement management systems — Requirements for measurement processes and measuring equipment
[3]	ISO 11607-1:2006, Packaging for terminally sterilized medical devices — Part 1: Requirements for materials, sterile barrier systems and packaging systems
[4]	ISO 11607-2, Packaging for terminally sterilized medical devices — Part 2: Validation requirements for forming, sealing and assembly processes
[5]	ISO 14644 (all parts), Cleanrooms and associated controlled environments
[6]	ISO 14698 (all parts), Cleanrooms and associated controlled environments — Biocontamination control
[7]	ISO 14971:2007, Medical devices — Application of risk management to medical devices
[8]	ISO 19011, Guidelines for auditing management systems
[9]	IEC 62366-1, Medical devices — Part 1: Application of usability engineering to medical devices
[10]	GHTF/SG1/N055:20094^4, Definition of the Terms “Manufacturer”, “Authorised Representative”, “Distributor” and “Importer”
[11]	GHTF/SG5/N4:20105^5, Post-Market Clinical Follow-Up Studies
[12]	GHTF/SG1/N70:20116^6, Label and Instructions for Use for Medical Devices
[13]	GHTF/SG1/N071:20127^7, Definition of the Terms “Medical Device” and “In Vitro Diagnostic (IVD) Medical Device”

1 Supersedes ISO 9000:2005.
2 Superseded by ISO 9000:2015.
3 Supersedes ISO 9001:2008.
4 Available from website: http://www.imdrf.org/documents/doc-ghtf-sg1.asp
5 Available from website: http://www.imdrf.org/documents/doc-ghtf-sg5.asp
6 Available from website: http://www.imdrf.org/documents/doc-ghtf-sg1.asp
7 Available from website: http://www.imdrf.org/documents/doc-ghtf-sg1.asp











`.trim()
  
  }
}


