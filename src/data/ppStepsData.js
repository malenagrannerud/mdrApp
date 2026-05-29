export const PP_DATA = [
  {
    id: 'p1',
    title: 'Step 1) Preclinical Development',
    desc: 'Characterize the chemical and biological properties of the substance in vitro and in vivo before initiating human studies.',
    checklist: [
      { t: 'Laboratory Studies & Characterization', 
        e: 'Documentation of molecular structure, stability, purity, and pharmaceutical formulation development.' },
     
      { t: 'In Vivo Toxicity & Safety Studies', 
        e: 'Mandatory preclinical animal studies to determine toxicity profile, pharmacokinetics (ADME), and starting dose for humans.' }
    ]
  },
  {
    id: 'p2',
    title: 'Step 2) Clinical Trials (CTR)',
    desc: 'Apply for and conduct clinical Phase I–III studies in humans in accordance with Regulation (EU) No 536/2014 via the CTIS portal.',
    checklist: [
      { t: 'Phase I: Human Safety & Dosing', 
        e: 'Testing on a small group of healthy volunteers (20–100 people) to evaluate tolerability and pharmacodynamics.' },
      { t: 'Phase II: Therapeutic Indication & Efficacy', 
        e: 'Exploratory studies on a smaller, homogeneous patient group (100–500 people) to evaluate efficacy and side effect profile.' },
      { t: 'Phase III: Final Confirmation of Benefit/Risk', 
        e: 'Large-scale, multicenter, randomized studies (thousands of patients) to demonstrate statistically significant therapeutic benefit versus placebo or standard of care.' }
    ]
  },
  {
    id: 'p3',
    title: 'Step 3) Marketing Authorization Application',
    desc: 'Compile the complete technical documentation in CTD format for regulatory review and authority approval.',
    checklist: [
      { t: 'Centralized Approval via EMA', 
        e: "Mandatory pathway for biotechnological and innovative medicinal products. Scientific evaluation is conducted by EMA's CHMP committee, with final decision by the European Commission." },
      { t: 'National / Decentralized Procedure (MRP/DCP)', 
        e: "Pathway via the Swedish Medical Products Agency for products not covered by EMA's mandatory scope, such as generics or local substances." },
      { t: 'Pharma Package Regulatory Data Protection', 
        e: 'Ensure compliance with the new data protection and market exclusivity periods for the innovative substance.' }
    ]
  },
  {
    id: 'p4',
    title: 'Step 4) National Pricing & Reimbursement',
    desc: 'After EU approval, the medicinal product must be integrated into the national pricing and reimbursement system.',
    checklist: [
      { t: 'Application to TLV (Sweden)', 
        e: 'Health economic documentation is submitted to the Dental and Pharmaceutical Benefits Agency for decisions on reimbursement and inclusion in the high-cost protection scheme.' },
      { t: 'Value-Based Pricing', 
         e: "Development of evidence demonstrating that the drug's cost is proportionate to its clinical benefit compared to existing care." }
    ]
  },
  {
    id: 'p5',
    title: 'Step 5) Post-Market Phase & Pharmacovigilance',
    desc: 'Fulfill the continuous obligations for safety monitoring after the medicinal product has been introduced to the market.',
    checklist: [
      { t: '5.1) Pharmacovigilance System (QPPV)', 
        e: 'Establish a safety monitoring system under the leadership of a Qualified Person Responsible for Pharmacovigilance to collect adverse reactions.' },
      { t: '5.2) Reporting to EudraVigilance', 
        e: "Immediate electronic reporting of all serious suspected adverse reactions to the EU's common adverse reaction database in accordance with the new pharmacovigilance directive." },
      { t: '5.3) Periodic Safety Update Reports (PSUR)', 
        e: 'Ongoing compilation and submission of Periodic Safety Update Reports to authorities to demonstrate that the benefit-risk balance remains positive.' },
      { t: '5.4) Traceability & Safety Features', 
        e: 'Ensure each package carries a unique 2D code (datamatrix) and an anti-tampering seal at pharmacy level to prevent falsified medicines.' },
      { t: '5.5) Management of Product Defects & Recalls', 
        e: 'Maintain procedures to immediately halt distribution and recall an entire batch (product recall) at the slightest suspicion of quality defects.' }
    ]
  }
];