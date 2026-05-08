/**
 * @file qmsSopData.js
 * Central lagring av alla SOP-texter.
 */
export const QMS_SOP_TEMPLATES = {
  
  SOP_001_VALIDATION: {
    id: 'SOP-001', 
    title: 'Software Validation Process', 
    version: '1.0', 
    owner: 'QA Manager',
    content: `
    ## 1. PURPOSE
    
    Validera eQMS och verktyg.

    ## 2. SCOPE
    
    Riskbedömning enligt GAMP 5.
    `
},
  SOP_002_DOC_CONTROL: {
    id: 'SOP-002', 
    title: 'Dokumentstyrning', 
    version: '1.0', 
    owner: 'QA Manager',
    content: `
    
    ## 1. PUROPSE
    Styra granskning och godkännande.
    
    ## 2. SCOPE
    Pull Requests motsvarar signaturer.
    `
  },
  // STEG 3
  SOP_003_MGMT_PROCESS: {
    id: 'SOP-003', title: 'Management Processes', version: '1.0', owner: 'VD',
    content: '# 1. SYFTE\nLedningens genomgång och kvalitetsmål.\n## 2. FREKVENS\nMinst en gång per halvår.'
  },
  // STEG 4
  SOP_004_TRAINING: {
    id: 'SOP-004', title: 'Utbildning & Kompetens', version: '1.0', owner: 'HR/QA',
    content: '# 1. SYFTE\nSäkra att personalen kan sina SOP:er.\n## 2. REGISTRERING\nAnvänd Training Matrix.'
  },
  // STEG 5
  SOP_006_DESIGN_CONTROL: {
    id: 'SOP-006', title: 'Design & Development', version: '1.0', owner: 'CTO',
    content: '# 1. SYFTE\nStyra produktutvecklingen.\n## 2. INPUT/OUTPUT\nKravspecifikationer och verifieringsrapporter.'
  },
  SOP_007_RISK_MGMT: {
    id: 'SOP-007', title: 'Risk Management', version: '1.0', owner: 'RA Manager',
    content: '# 1. SYFTE\nHantera produktrisker enligt ISO 14971.\n## 2. ANALYS\nFMEA ska uppdateras löpande.'
  },
  // STEG 9
  SOP_012_NC_CAPA: {
    id: 'SOP-012', title: 'NC & CAPA Process', version: '1.0', owner: 'QA Manager',
    content: '# 1. SYFTE\nHantera avvikelser och förbättringar.\n## 2. ROTORSAK\nAnvänd 5-Whys metoden för utredning.'
  }
};
