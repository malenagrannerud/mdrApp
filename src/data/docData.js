/**
 * @file docData.js
 * @description Central lagring av alla dokument (TD, SOP:ar, etc.)
 */

export const DOC_DATA = {

  ART_2_1: {
  title: 'Article 2(1). Definition of medical device',
  title_short: 'Art.2(1)',
  content_short: 'Definition of a medical device',
  content: `
'medical device' means any instrument, apparatus, appliance, software, 
implant, reagent, material or other article intended by the manufacturer 
to be used, alone or in combination, for human beings for one or more of 
the following specific medical purposes:

— diagnosis, prevention, monitoring, prediction, prognosis, treatment or alleviation of disease,
— diagnosis, monitoring, treatment, alleviation of, or compensation for, an injury or disability,
— investigation, replacement or modification of the anatomy or of a physiological or pathological process or state,
— providing info by means of in vitro examination of specimens derived from the human body, including organ, blood and tissue donations, and which does not achieve its principal intended action by pharmacological, immunological or metabolic means, in or on the human body, but which may be assisted in its function by such means.
  `.trim()
},

ART_2_12: {
  title: 'Article 2(12). Definition of intended purpose',
  title_short: 'Art.2(12)',
  content_short: 'Definition of intended purpose',
  content: `
'intended purpose' means the use for which a device is intended according 
to the data supplied by the manufacturer on the label, in the instructions 
for use or in promotional or sales materials or statements and as specified 
by the manufacturer in the clinical evaluation.
  `.trim()
},

 ART_51: {
    title: 'Article 51. Classification of devices',
    title_short: ' ',
    content_short: ' ', 
    content: `

1. Devices shall be divided into classes per Ax.VIII., taking into account intended purpose and inherent risks. 
2. A dispute between mf and NB when applying Ax.VIII, shall be referred to the CA of the MS where the mf has its RPOB. 
Where the mf has no RPOB in the EU and has not designated an AR, the matter shall be referred to the CA of the MS where the 
AR referred to in the last indent of point (b) of the second paragraph of Section 2.2 of Ax.IX has its RPOB. 

Where the NB is established in a MS other than that of the mf, the CA shall adopt its decision after consultation with the CA 
of the MS that designated the NB.

The CA of the MS where the mf has its RPOB shall notify MDCG and the EU COM of its decision. 
The decision shall be made available upon request.

3. At the request of a MS, EU COM shall after consulting MDCG, decide, by means of IAs, on:
(a)	application of Ax.VIII to a given device, category or group of devices, to determine their classification;
(b)	that a device, category or group of devices, shall for public health reasons based on new scientific evidence, 
or based on information from vigilance and market surveillance activities, be reclassified by way of derogation from Ax.VIII.

4. The EU COM may, on its own initiative and after consulting MDCG, decide by means of IAs on the issues in points (a) and (b) of §3.
5. To ensure uniform application of Ax.VIII, taking account of relevant scientific opinions of relevant scientific committees, COM may adopt IAs to resolve issues of divergent interpretation and practical application.
6. The IAs referred to in §3, §4 and §5 shall be adopted in accordance with the examination procedure in Art.114(3).

    `.trim()
  },

Art_61: {
    title:'Article 61. Clinical evaluation ',
    title_short: ' Art.61',
    content_short: 'Art.61 ', 
    content: `
1. Confirmation of conformity with GSPR (Ax.I) under normal conditions of intended use, evaluation of undesirable side-effects, and acceptability of the BRR in Ax.I.1 and 1.8, shall be based on clinical data providing sufficient clinical evidence, and relevant data as in Ax.III.
- The mf shall specify and justify the level of clinical evidence necessary to demonstrate conformity with relevant GSPR. That level shall be appropriate to the characteristics of the device and its intended purpose.
- To that end, mfs shall plan, conduct and document a CEV in this Art. and Ax.XIV.A.

2. For class III and IIb devices under Art.54.1.(b), the mf may, prior to its CEV/CI, consult an expert panel (Art.106) to review the mf's clinical development strategy and CI proposals. The mf shall consider the panel's views and document them in the CER (§12). The mf may not invoke any rights to the panel's views regarding future conformity assessment.

3. A CEV shall follow a defined, methodologically sound procedure based on:
(a) critical evaluation of relevant scientific literature on safety, performance, design characteristics and intended purpose, provided that:
  - the intended purpose is equivalent to the device to which the data relate (Ax.XIV.3), and
  - the data adequately demonstrate compliance with relevant GSPR;
(b) critical evaluation of all available CIs, considering whether performed under Art.62-80, acts under Art.81, and Ax.XV;
(c) consideration of available alternative options, if any.

4. For implantable and class III devices, CIs shall be performed, except if:
- the device is a modification of one already marketed by the same mf,
- equivalence to the marketed device is demonstrated per Ax.XIV.3 and endorsed by the NB, and
- the CEV of the marketed device sufficiently demonstrates conformity of the modified device.
The NB shall check that the PMCF plan is appropriate and includes post-market studies. CIs need not be performed in the cases under §6.

5. A mf of a device equivalent to one not mf'd by him may rely on §4 to omit a CI provided that:
- the two mfs have a contract granting the second mf full ongoing access to the TD, and
- the original CEV complied with this Regulation,
and the second mf provides clear evidence thereof to the NB.

6. The CI requirement under §4 shall not apply to:
- (a) implantable/class III devices lawfully placed on the market under Directive 90/385/EEC or 93/42/EEC, where the CEV is based on sufficient clinical data and complies with relevant product-specific CS (where available); or
- (b) sutures, staples, dental fillings, dental braces, tooth crowns, screws, wedges, plates, wires, pins, clips or connectors, where the CEV is based on sufficient clinical data and complies with relevant product-specific CS (where available).
7. Cases where §4 is not applied via §6 shall be justified by the mf in the CER and by the NB in the CEV assessment report.
8. The EU COM may, where justified by well-established technologies (similar to those in §6(b)) used in other devices, or to protect health/safety/public health, adopt delegated acts under Art.115 to amend the list of exempted devices in Art.52(4) sub§2 and §6(b), adding or removing implantable/class III devices.
9. For products without an intended medical purpose (Ax.XVI), the requirement to demonstrate clinical benefit shall mean demonstrating device performance. CEVs shall be based on safety data from PMS, PMCF, and where applicable, specific CI. CIs shall be performed unless reliance on clinical data from an analogous MD is duly justified.
10. Without prejudice to §4, where demonstration of GSPR conformity based on clinical data is not deemed appropriate, the mf shall justify based on risk management and the specifics of device-human body interaction, intended clinical performance, and mf's claims. The mf shall substantiate in the TD (Ax.II) why non-clinical testing methods alone (performance evaluation, bench testing, pre-clinical evaluation) are adequate.
11. The CEV and its documentation shall be updated throughout the device life cycle with clinical data from the PMCF plan (Ax.XIV.B) and PMS plan (Art.84). For class III and implantable devices, the PMCF evaluation report and, if indicated, the summary of safety and clinical performance (Art.32) shall be updated at least annually.
12. The CEV, its results and clinical evidence shall be documented in a CER (Ax.XIV.4), which shall be part of the TD (Ax.II), except for custom-made devices.
13. Where necessary to ensure uniform application of Ax.XIV, the EU COM may adopt IAs to resolve divergent interpretation and practical application. These IAs shall be adopted per the examination procedure in Art.114(3).

`.trim()
  },






  /******************************AX 1   ********************************************************************/ 
  Ax_I: {
    title: 'Annex I. General safety and performance requirements',
    title_short: 'Ax.I - GSPR ',
    content_short: ' ', 
    content: `


# CHAPTER I - GENERAL REQUIREMENTS

## 1.   
Devices shall achieve the performance intended by their mf and shall be designed and manufactured in such a way that, during normal conditions of use, they are suitable for their intended purpose. They shall be safe and effective and shall not compromise the clinical condition or the safety of patients, or the safety and health of users or, where applicable, other persons, provided that any risks which may be associated with their use constitute acceptable risks when weighed against the benefits to the patient and are compatible with a high level of protection of health and safety, taking into account the generally acknowledged state of the art.


## 3.
Mfrs shall establish, implement, document and maintain a RMS, a continuous iterative process throughout the lifecycle of a device, requiring regular systematic updating. In carrying out risk management mfrs shall:

(a) establish and document a RMP for each device;
(b) identify and analyse the known and foreseeable hazards associated with each device;
(c) estimate and evaluate the risks associated with, and occurring during, the intended use and during reasonably foreseeable misuse;
(d) eliminate or control the risks referred to in point (c) in accordance with the requirements of Section 4;
(e) evaluate the impact of info from the production phase and, in particular, from the PMS system, on hazards and the frequency of occurrence thereof, on estimates of their associated risks, as well as on the overall risk, benefit-risk ratio and risk acceptability; and
(f) based on the evaluation of the impact of the information in (e), if necessary amend control measures in line with the requirements of Section 4.

## 8.   
All 
- known and foreseeable risks and any 
- undesirable side-effects
shall be minimised and acceptable when weighed against benefits to the patient/user arising from the achieved performance of the device during normal conditions of use.

# CHAPTER II - REQUIREMENTS REGARDING DESIGN AND MANUFACTURE
    `.trim()
  },
  
/*************************  AX.II *************************************************************************/ 

 Ax_II: {
    title:'Annex II. Technical documentation',
    title_short: 'Ax.II',
    content: `

The mf shall draw up the TD. The TD shall demonstrate compliance of the device with the requirements of this Regulation.
The TD shall cover the following elements:

# 1. DEVICE DESCRIPTION AND SPECIFICATION

1.1. Device description and specification
The TD shall include:
- name or trade name, a general description of the device, its intended purpose and intended users/population;
- Basic UDI-DI as referred to in Part C of Annex VI, or any other clear identification in terms of identification code, catalogue number or other unambiguous reference allowing traceability;
- the intended patient population, medical condition to be diagnosed, treated and/or monitored, other considerations such as patient selection criteria, indications, contra-indications, warnings;
- principles of operation of the device and, where appropriate, the scientific concepts proven (mode of action) and its mode of action, if scientifically proven;
- the reason for the qualification of the product as a device (rationale);
- the risk class and the justification for the classification rule(s) applied under Annex VIII;
- explanation of any novel features;
- description of the accessories, other devices and other products that are not devices, which are intended to be used in combination with it;
- description or complete list of the various configurations/variants of the device that will be made available;
- a general description of the key functional elements, e.g. its parts/components, including software if appropriate, its formulation, its composition, its functionality and, where relevant, its qualitative and quantitative composition. Where relevant, this includes labelled pictorial representations (e.g. photographs, drawings) clearly indicating key parts/components, including sufficient explanation to understand the photographs and drawings;
- a description of the raw materials incorporated into key functional elements and those making either direct contact with the human body or indirect contact with the body, e.g. during extracorporeal circulation of body fluids;
- technical specifications (whether features, dimensions, performance attributes) of the device and any variants/configurations and accessories appearing in the information supplied (Annex I.III).

1.2. Reference to previous and similar generations of the device
- An overview of the previous generations of the device produced by the mf, where such devices exist.
- An overview of identified similar devices available on the EU or international markets, where such devices exist.

# 2. INFORMATION TO BE SUPPLIED BY THE MF

The TD shall include:
- the label or labels on the device and on its packaging, such as single unit packaging, sales packaging, transport packaging in case of specific management conditions, in the languages accepted in the Member States where the device is envisaged to be sold; and
- the instructions for use in the languages accepted in the Member States where the device is envisaged to be sold.

# 3. DESIGN AND MANUFACTURING INFORMATION

The TD shall include:
- information to allow the design stages applied to the device to be understood;
- complete information and specifications, including the manufacturing processes and their validation, their adjuvants, the continuous monitoring and the final product testing. Data shall be fully included in the TD.
- identification of all sites, including suppliers and sub-contractors, where design and manufacturing activities are performed.

# 4. GSPR

The TD shall include info for the demonstration of conformity with the GSPR set out in Ax.I that apply to the device. That demonstration shall include:
(a)	the GSPR that apply to the device and an explanation as to why others do not apply;
(b)	the method or methods used to demonstrate conformity with each applicable GSPR;
(c)	the harmonised standards, CS or other solutions applied; and
(d)	the precise identity of the controlled documents offering evidence of conformity with each harmonised standard, CS or other method applied to demonstrate conformity with the GSPR. This shall include a cross-reference to the location of such evidence within the full TD and, where applicable, the summary TD.

# 5. BENEFIT-RISK ANALYSIS AND RISK MANAGEMENT

The TD shall include:
- the benefit-risk analysis referred to in Sections 1 and 8 of Annex I, and
- the solutions adopted and the results of the risk management referred to in Section 3 of Annex I.

    `.trim()
  },


  /**********************************************************************************************/ 

Ax_III: {
    title:'Annex III. Technical documentation on post-market surveillance',
    content: `

The TD on PMS to be drawn up by the mf in accordance with Art.83 to 86 shall be presented in a clear, organised, readily searchable and unambiguous manner and shall include the elements described in this Annex.

# 1.1. The PMS plan drawn up in accordance with Art.84.

The mf shall prove in a PMS plan that it complies with the obligation referred to in Art.83.

(a) The PMS plan shall address the collection and utilization of available info, in particular:
- info concerning serious incidents, including info from PSURs, and field safety corrective actions;
- records referring to non-serious incidents and data on any undesirable side-effects;
- info from trend reporting;
- relevant specialist or technical literature, databases and/or registers;
- info, including feedbacks and complaints, provided by users, distributors and importers; and
- publicly available info about similar MDs.

(b) The PMS plan shall cover at least:
- a proactive and systematic process to collect any info referred to in point (a). The process shall allow a correct characterisation of the performance of the devices and shall also allow a comparison to be made between the device and similar products available on the market;
- effective and appropriate methods and processes to assess the collected data;
- suitable indicators and threshold values that shall be used in the continuous reassessment of the benefit-risk analysis and of the risk management as referred to in Section 3 of Ax.I;
- effective and appropriate methods and tools to investigate complaints and analyse market-related experience collected in the field;
- methods and protocols to manage the events subject to the trend report as provided for in Art.88, including the methods and protocols to be used to establish any statistically significant increase in the frequency or severity of incidents as well as the observation period;
- methods and protocols to communicate effectively with CA, NB, economic operators and users;
- reference to procedures to fulfil the mf's obligations laid down in Art.83, 84 and 86;
- systematic procedures to identify and initiate appropriate measures including corrective actions;
- effective tools to trace and identify devices for which corrective actions might be necessary; and
- a PMCF plan as referred to in Part B of Ax.XIV, or a justification as to why a PMCF is not applicable.

# 1.2. The PSUR referred to in Art.86 and the PMS report referred to in Art.85

The PSUR shall contain at least:
- a summary of the results and conclusions of the analyses of the PMS data gathered as a result of the PMS plan referred to in Section 1.1;
- a rationale and description of any preventive and corrective actions taken;
- the conclusions of the benefit-risk determination as referred to in Art.86(3);
- the main findings of the PMCF as referred to in Part B of Ax.XIV; and
- the volume of sales of the device and an estimated evaluation of the population exposed to the device and, where practicable, the usage frequency of the device.

The PMS report (Art.85) shall contain at least:
- a summary of the results and conclusions of the analyses of the PMS data gathered as a result of the PMS plan referred to in Section 1.1;
- a rationale and description of any preventive and corrective actions taken.

`.trim()
  },


  AX_XIV: {
    title: 'Annex XIV. Clinical evaluation and PMCF ',
    content: `# PART A - CLINICAL EVALUATION
1.   
To plan, continuously conduct and document a clinical evaluation, manufacturers shall:
(a) establish and update a CEP, which shall include at least:
- an identification of the GSPR that require support from relevant clinical data;
— a specification of the intended purpose of the device;
— a clear specification of intended target groups with clear indications and contra-indications;
— a detailed description of intended clinical benefits to patients with relevant and specified clinical outcome parameters;
— a specification of methods to be used for examination of qualitative and quantitative aspects of clinical safety with clear reference to the determination of residual risks and side-effects;
— an indicative list and specification of parameters to be used to determine, based on the state of the art in medicine, the acceptability of the benefit-risk ratio for the various indications and for the intended purpose or purposes of the device;
— an indication how benefit-risk issues relating to specific components such as use of pharmaceutical, non-viable animal or human tissues, are to be addressed; and
— a clinical development plan indicating progression from exploratory investigations, such as first-in-man studies, feasibility and pilot studies, to confirmatory investigations, such as pivotal clinical investigations, and a PMCF as in Part B of this Annex with an indication of milestones and a description of potential acceptance criteria;

(b) identify available clinical data relevant to the device and its intended purpose and any gaps in clinical evidence through a systematic scientific literature review;
(c) appraise all relevant clinical data by evaluating their suitability for establishing the safety and performance of the device;
(d) generate, through properly designed CIs in accordance with the clinical development plan, any new or additional clinical data necessary to address outstanding issues; and
(e) analyse all relevant clinical data in order to reach conclusions about the safety and clinical performance of the device including its clinical benefits.

2.   
The clinical evaluation shall be 
- thorough and objective, and 
- take into account both favourable and unfavourable data. 
Its depth and extent shall be proportionate and appropriate to the 
- nature, 
- classification, 
- intended purpose and 
- risks 
of the device in question, as well as to the manufacturer's claims in respect of the device.

3.   
A clinical evaluation may be based on clinical data relating to a device for which equivalence to the device in question can be demonstrated. The following technical, biological and clinical characteristics shall be taken into consideration for the demonstration of equivalence:

— Technical: the device is of similar design; is used under similar conditions of use; has similar specifications and properties including physicochemical properties such as intensity of energy, tensile strength, viscosity, surface characteristics, wavelength and software algorithms; uses similar deployment methods, where relevant; has similar principles of operation and critical performance requirements;
— Biological: the device uses the same materials or substances in contact with the same human tissues or body fluids for a similar kind and duration of contact and similar release characteristics of substances, including degradation products and leachables;
— Clinical: the device is used for the same clinical condition or purpose, including similar severity and stage of disease, at the same site in the body, in a similar population, including as regards age, anatomy and physiology; has the same kind of user; has similar relevant critical performance in view of the expected clinical effect for a specific intended purpose.
The characteristics listed in the first paragraph shall be similar to the extent that there would be no clinically significant difference in the safety and clinical performance of the device. Considerations of equivalence shall be based on proper scientific justification. It shall be clearly demonstrated that manufacturers have sufficient levels of access to the data relating to devices with which they are claiming equivalence in order to justify their claims of equivalence.

4.   The results of the clinical evaluation and the clinical evidence on which it is based shall be documented in a clinical evaluation report which shall support the assessment of the conformity of the device.
The clinical evidence together with non-clinical data generated from non-clinical testing methods and other relevant documentation shall allow the manufacturer to demonstrate conformity with the general safety and performance requirements and shall be part of the technical documentation for the device in question.
Both favourable and unfavourable data considered in the clinical evaluation shall be included in the technical documentation.

# PART B - POST-MARKET CLINICAL FOLLOW-UP

5. PMCF shall be understood to be a continuous process that updates the clinical evaluation referred to in Article 61 and Part A of this Annex and shall be addressed in the manufacturer's post-market surveillance plan. When conducting PMCF, the manufacturer shall proactively collect and evaluate clinical data from the use in or on humans of a device which bears the CE marking and is placed on the market or put into service within its intended purpose as referred to in the relevant conformity assessment procedure, with the aim of confirming the safety and performance throughout the expected lifetime of the device, of ensuring the continued acceptability of identified risks and of detecting emerging risks on the basis of factual evidence.

6. PMCF shall be performed pursuant to a documented method laid down in a PMCF plan.

6.1. The PMCF plan shall specify the methods and procedures for proactively collecting and evaluating clinical data with the aim of:

(a) confirming the safety and performance of the device throughout its expected lifetime,
(b) identifying previously unknown side-effects and monitoring the identified side-effects and contraindications,
(c) identifying and analysing emergent risks on the basis of factual evidence,
(d) ensuring the continued acceptability of the benefit-risk ratio referred to in Sections 1 and 9 of Annex I, and
(e) identifying possible systematic misuse or off-label use of the device, with a view to verifying that the intended purpose is correct.

6.2.   The PMCF plan shall include at least:
(a) the general methods and procedures of the PMCF to be applied, such as gathering of clinical experience gained, feedback from users, screening of scientific literature and of other sources of clinical data;
(b) the specific methods and procedures of PMCF to be applied, such as evaluation of suitable registers or PMCF studies;
(c) a rationale for the appropriateness of the methods and procedures referred to in points (a) and (b);
(d) a reference to the relevant parts of the clinical evaluation report referred to in Section 4 and to the risk management referred to in Section 3 of Annex I;
(e) the specific objectives to be addressed by the PMCF;
(f) an evaluation of the clinical data relating to equivalent or similar devices;
(g) reference to any relevant CS, harmonised standards when used by the manufacturer, and relevant guidance on PMCF; and
(h) a detailed and adequately justified time schedule for PMCF activities (e.g. analysis of PMCF data and reporting) to be undertaken by the manufacturer.

## 7.   
The mfr shall analyse the findings of the PMCF and document the results in a PMCF evaluation report that shall be part of the CER and the TD.

## 8.   
The conclusions of the PMCF evaluation report shall be taken into account for the clinical evaluation in Art. 61 and Part A of this Annex and in the risk management referred to in Section 3 of Annex I. If, through the PMCF, the need for preventive and/or corrective measures has been identified, the manufacturer shall implement them.





`.trim()
  }, 




 AX_VIII: {
    title:'Annex VIII. Classification rules ',
    content: `
# CHAPTER I - Definitions

1. DURATION OF USE
1.1. Transient - normally intended for continuous use < 60 minutes.
1.2. Short term - normally intended for continuous use between 60 minutes and 30 days.
1.3. Long term - normally intended for continuous use > 30 days.

2. INVASIVE AND ACTIVE DEVICES
2.1. Body orifice - any natural opening in the body, external surface of the eyeball, or permanent artificial opening (e.g. stoma).
2.2. Surgically invasive device - an invasive device penetrating inside the body through the surface of the body (including through mucous membranes of body orifices with aid/in context of surgical operation), or producing penetration other than through a body orifice.
2.3. Reusable surgical instrument - instrument for cutting, drilling, sawing, scratching, scraping, clamping, retracting, clipping or similar procedures, without connection to an active device, intended by mf to be reused after cleaning, disinfection and sterilisation.
2.4. Active therapeutic device - active device used alone or with other devices to support, modify, replace or restore biological functions/structures for treatment/alleviation of illness, injury or disability.
2.5. Active device for diagnosis and monitoring - active device used alone or with other devices to supply information for detecting, diagnosing, monitoring or treating physiological conditions, health states, illnesses or congenital deformities.
2.6. Central circulatory system - arteriae pulmonales, aorta ascendens, arcus aortae, aorta descendens to bifurcatio aortae, arteriae coronariae, arteria carotis communis, arteria carotis externa, arteria carotis interna, arteriae cerebrales, truncus brachiocephalicus, venae cordis, venae pulmonales, vena cava superior, vena cava inferior.
2.7. Central nervous system - brain, meninges and spinal cord.
2.8. Injured skin or mucous membrane - skin or mucous membrane with pathological change, change following disease, or wound.

# CHAPTER II - Implementing rules

3.1. Classification shall be governed by the intended purpose of the devices.
3.2. If used in combination, classification rules shall apply separately to each device. Accessories for a MD and for Annex XVI products shall be classified in their own right separately from the device they are used with.
3.3. SW driving or influencing use of a device shall fall within the same class as the device. Independent SW shall be classified in its own right.
3.4. If not intended solely/principally for a specific body part, classification shall be based on the most critical specified use.
3.5. If several rules/sub-rules apply, the strictest rule resulting in the highest classification shall apply.
3.6. Continuous use means: (a) entire duration without regard to temporary interruption/removal (determined relative to duration before/after); (b) accumulated use where mf intends immediate replacement with same type.
3.7. Direct diagnosis = device provides diagnosis by itself or provides decisive information for diagnosis.

# CHAPTER III - Classification rules

4. NON-INVASIVE DEVICES
4.1. Rule 1 - All non-invasive devices are class I, unless otherwise specified below.
4.2. Rule 2 - Non-invasive devices for channelling/storing blood, body liquids, cells/tissues, liquids/gases for eventual infusion/administration/introduction into body are class IIa if:
- connectable to class IIa/IIb/III active device; or
- intended for channelling/storing blood/body liquids or organs/parts of organs/body cells/tissues (except blood bags).
Blood bags are class IIb. All other cases: class I.

4.3. Rule 3 - Non-invasive devices modifying biological/chemical composition of human tissues/cells, blood, body liquids or liquids for implantation/administration are class IIb.
Exception: filtration, centrifugation, gas/heat exchange = class IIa.
Non-invasive devices consisting of substances intended in vitro in direct contact with human cells/tissues/organs taken from body or used with human embryos before implantation/administration are class III.

4.4. Rule 4 - Non-invasive devices contacting injured skin/mucous membrane are:
- class I if mechanical barrier, compression or absorption of exudates;
- class IIb if for injuries breaching dermis/mucous membrane healing only by secondary intent;
- class IIa if for managing micro-environment of injured skin/mucous membrane;
- class IIa in all other cases.
This rule also applies to invasive devices contacting injured mucous membrane.

5. INVASIVE DEVICES

5.1. Rule 5 - Invasive devices for body orifices (non-surgical) not connected to active device or connected to class I active device are:
- class I if transient use;
- class IIa if short-term use (except oral cavity to pharynx, ear canal to eardrum, nasal cavity = class I);
- class IIb if long-term use (except oral cavity to pharynx, ear canal to eardrum, nasal cavity not absorbed by mucous membrane = class IIa).
Connected to class IIa/IIb/III active device = class IIa.

5.2. Rule 6 - Surgically invasive devices for transient use are class IIa unless:
- specifically control/diagnose/monitor/correct heart/central circulatory system defect through direct contact = class III;
- reusable surgical instruments = class I;
- direct contact with heart/central circulatory system/CNS = class III;
- supply ionising radiation energy = class IIb;
- biological effect or wholly/mainly absorbed = class IIb;
- administer medicinal products via delivery system in potentially hazardous manner = class IIb.

5.3. Rule 7 - Surgically invasive devices for short-term use are class IIa unless:
- specifically control/diagnose/monitor/correct heart/central circulatory system defect through direct contact = class III;
- direct contact with heart/central circulatory system/CNS = class III;
- supply ionizing radiation energy = class IIb;
- biological effect or wholly/mainly absorbed = class III;
- undergo chemical change in body (except placed in teeth) = class IIb;
- administer medicines = class IIb.

5.4. Rule 8 - Implantable and long-term surgically invasive devices are class IIb unless:
- placed in teeth = class IIa;
- direct contact with heart/central circulatory system/CNS = class III;
- biological effect or wholly/mainly absorbed = class III;
- undergo chemical change in body (except placed in teeth) = class III;
- administer medicinal products = class III;
- active implantable devices/accessories = class III;
- breast implants/surgical meshes = class III;
- total/partial joint replacements (except ancillary components: screws, wedges, plates, instruments) = class III;
- spinal disc replacements or implantables contacting spinal column (except screws, wedges, plates, instruments) = class III.

6. ACTIVE DEVICES

6.1. Rule 9 - Active therapeutic devices administering/exchanging energy are class IIa (class IIb if potentially hazardous considering nature/density/site of energy).
Active devices controlling/monitoring class IIb active therapeutic devices or directly influencing their performance = class IIb.
Active devices emitting ionizing radiation for therapy (including control/monitor/direct influence) = class IIb.
Active devices controlling/monitoring/directly influencing active implantable devices = class III.
6.2. Rule 10 - Active devices for diagnosis and monitoring are class IIa if:
- supply energy absorbed by body (except visible spectrum illumination = class I);
- image in vivo radiopharmaceutical distribution; or
- allow direct diagnosis/monitoring of vital physiological processes.
Class IIb if monitoring vital physiological parameters where variations could cause immediate danger (e.g. cardiac performance, respiration, CNS activity) or diagnosis in immediate danger situations.
Active devices emitting ionizing radiation for diagnostic/therapeutic radiology (including interventional devices and control/monitor/direct influence) = class IIb.
6.3. Rule 11 - SW providing info for diagnosis/therapy decisions is class IIa, except class III if decisions may cause death/irreversible deterioration, or class IIb if may cause serious deterioration/surgical intervention.
SW monitoring physiological processes is class IIa, except class IIb if monitoring vital parameters where variations could cause immediate danger.
All other SW is class I.
6.4. Rule 12 - Active devices administering/removing medicinal products, body liquids or substances to/from body are class IIa (class IIb if potentially hazardous considering substance nature, body part, application mode).
6.5. Rule 13 - All other active devices are class I.

# 7. SPECIAL RULES
7.1. Rule 14 - Devices incorporating a medicinal product (per Directive 2001/83/EC Art.1(2), including human blood/plasma derivative per Art.1(10)) with ancillary action are class III.
7.2. Rule 15 - Contraceptive/STD prevention devices are class IIb (class III if implantable or long-term invasive).
7.3. Rule 16 - Devices for disinfecting/cleaning/rinsing/hydrating contact lenses are class IIb.
Devices for disinfecting/sterilising MDs are class IIa (class IIb if disinfecting solutions/washer-disinfectors for invasive devices as final processing).
Not applicable to devices cleaning non-contact-lens devices by physical action only.
7.4. Rule 17 - Devices for recording X-ray diagnostic images are class IIa.
7.5. Rule 18 - Devices using non-viable human/animal tissues/cells/derivatives are class III, unless animal-origin non-viable contacting intact skin only.
7.6. Rule 19 - Devices with nanomaterial are:
- class III if high/medium internal exposure potential;
- class IIb if low internal exposure potential;
- class IIa if negligible internal exposure potential.
7.7. Rule 20 - Invasive devices for body orifices (non-surgical) administering medicinal products by inhalation are class IIa (class IIb if mode of action essentially impacts product efficacy/safety or treating life-threatening conditions).
7.8. Rule 21 - Devices composed of substances introduced via body orifice/applied to skin and absorbed/locally dispersed are:
- class III if systemically absorbed to achieve intended purpose;
- class III if achieving purpose in stomach/lower GI tract and systemically absorbed;
- class IIa if applied to skin/nasal/oral cavity (to pharynx) achieving purpose there;
- class IIb in all other cases.

7.9. Rule 22 - Active therapeutic devices with integrated diagnostic function significantly determining patient management (e.g. closed loop systems, automated external defibrillators) = class III.

`.trim()
  }

  
};