/*
  03a_seed_manufacturers.sql
  Author: Malena | Updated: 2026-10-15
  Parent = current owner of the brand/legal entity (acquisitions up to 2025).

  Parent-company keyword rules that drive auto-generation of manufacturer_mapping in SILVER

  RULE S5
*/

TRUNCATE TABLE manufacturer_parent;

INSERT INTO manufacturer_parent (parent_name, keywords) VALUES
-- ------------------------------------------------------------
-- Big cardio / ortho / imaging
-- ------------------------------------------------------------
-- ASSUMPTION (unverified): MPRI = Medtronic Puerto Rico Operations.
-- Covers ~34,885 rows. Verify against source before trusting Gold.
('MEDTRONIC',            ARRAY['MEDTRONIC','COVIDIEN','MPRI','US SURGICAL','TYCO','MICRO THERAPEUTICS','EV3','HEARTWARE','MDT POWERED',
                                'WARSAW ORTHOPEDIC','MITG','RF SURGICAL','SOFRADIM','DAVIS & GECK','COMPANION MEDICAL']),
('ABBOTT',               ARRAY['ABBOTT','ST JUDE','THORATEC']),
('JOHNSON & JOHNSON',    ARRAY['JOHNSON & JOHNSON','ETHICON','DEPUY','SYNTHES','ABIOMED','AURIS','CERENOVUS',
                                'BIOSENSE WEBSTER','AMO PUERTO RICO','MEDOS INTERNATIONAL','MENTOR','MEGADYNE','NEURAVI']),
('BECTON DICKINSON',     ARRAY['BECTON','BARD','CR BARD','CAREFUSION','ALARIS','BARD PERIPHERAL','BARD ACCESS','BD SUZHOU','BD MEDICAL','BD INFUSION','MEDIVANCE']),
('BOSTON SCIENTIFIC',    ARRAY['BOSTON SCIENTIFIC','SILK ROAD MEDICAL','BAYLIS MEDICAL']),
('PHILIPS',              ARRAY['PHILIPS','RESPIRONICS','VOLCANO CORPORATION','VOLCANO']),
('GE HEALTHCARE',        ARRAY['GE HEALTHCARE','DATEX','OHMEDA','GE MEDICAL']),
('SIEMENS HEALTHINEERS', ARRAY['SIEMENS','VARIAN']),
('BIOTRONIK',            ARRAY['BIOTRONIK']),
('EDWARDS LIFESCIENCES', ARRAY['EDWARDS LIFESCIENCE']),
('LIVANOVA',             ARRAY['LIVANOVA','SORIN','CYBERONICS']),
('ZOLL',                 ARRAY['ZOLL','CARDIAC SCIENCE']),
('DEFIBTECH',            ARRAY['DEFIBTECH']),
('W.L. GORE',            ARRAY['W L GORE','WL GORE','GORE & ASSOCIATES']),
('MERIT MEDICAL',        ARRAY['MERIT MEDICAL']),
('TERUMO',               ARRAY['TERUMO','MICROVENTION','BOLTON MEDICAL']),
('MICROPORT',            ARRAY['MICROPORT']),

-- ------------------------------------------------------------
-- Ortho / dental / implants
-- ------------------------------------------------------------
('STRAUMANN',            ARRAY['STRAUMANN','ANTHOGYR','JJGC','INSTITUT STRAUMANN']),
('ENVISTA',              ARRAY['NOBEL BIOCARE','IMPLANT DIRECT','SYBRON']),
('ZIMMER BIOMET',        ARRAY['ZIMMER','BIOMET']),
('DENTSPLY',             ARRAY['DENTSPLY','TULSA DENTAL','MAILLEFER','VDW GMBH','VDW']),
('ARTHREX',              ARRAY['ARTHREX']),
('BIOHORIZONS',          ARRAY['BIOHORIZONS']),
('SMITH & NEPHEW',       ARRAY['SMITH & NEPHEW','SMITH AND NEPHEW','ARTHROCARE','BLUE BELT']),
('PALTOP',               ARRAY['PALTOP']),
('STAAR SURGICAL',       ARRAY['STAAR SURGICAL']),
('EXACTECH',             ARRAY['EXACTECH']),
('STRYKER',              ARRAY['STRYKER','TORNIER','MOOG MEDICAL','MAKO SURGICAL','PHYSIO-CONTROL']),
('ALTATEC',              ARRAY['ALTATEC']),
('INTRA-LOCK',           ARRAY['INTRA-LOCK']),
('KEYSTONE DENTAL',      ARRAY['KEYSTONE DENTAL']),
('MEDARTIS',             ARRAY['MEDARTIS']),
('ENOVIS',               ARRAY['ENOVIS','ENCORE MEDICAL','LIMACORPORATE','DJO']),
('TREACE MEDICAL',       ARRAY['TREACE MEDICAL']),
('SPATZ',                ARRAY['SPATZ']),
('ACUMED',               ARRAY['ACUMED']),
('ORTHOFIX',             ARRAY['ORTHOFIX','SEASPINE']),
('ONKOS SURGICAL',       ARRAY['ONKOS SURGICAL']),
('ACCESS DENTAL LAB',    ARRAY['ACCESS DENTAL']),
('ZEST ANCHORS',         ARRAY['ZEST ANCHORS','ZEST']),

-- ------------------------------------------------------------
-- Diabetes / CGM / pumps
-- ------------------------------------------------------------
('DEXCOM',               ARRAY['DEXCOM']),
('TANDEM',               ARRAY['TANDEM DIABETES']),
('INSULET',              ARRAY['INSULET']),
('ROCHE',                ARRAY['ROCHE DIABETES','ROCHE DIAGNOSTICS']),
('SENSEONICS',           ARRAY['SENSEONICS']),
('ASCENSIA',             ARRAY['ASCENSIA']),
('LIFESCAN',             ARRAY['LIFESCAN']),
('NOVO NORDISK',         ARRAY['NOVO NORDISK']),
('MANNKIND',             ARRAY['MANNKIND']),

-- ------------------------------------------------------------
-- Ophthalmology
-- ------------------------------------------------------------
('ALCON',                ARRAY['ALCON','WAVELIGHT','IVANTIS']),
('OLYMPUS',              ARRAY['OLYMPUS','AIZU OLYMPUS','SHIRAKAWA OLYMPUS','AOMORI OLYMPUS','GYRUS ACMI']),
('BAUSCH',               ARRAY['BAUSCH']),
('RAYNER',               ARRAY['RAYNER INTRAOCULAR','RAYNER']),

-- ------------------------------------------------------------
-- Respiratory / anesthesia
-- ------------------------------------------------------------
('VYAIRE',               ARRAY['VYAIRE']),
('HAMILTON MEDICAL',     ARRAY['HAMILTON MEDICAL']),
('THOMMEN MEDICAL',      ARRAY['THOMMEN MEDICAL']),
('GETINGE',              ARRAY['GETINGE','MAQUET','DATASCOPE','PULSION MEDICAL']),
('DRÄGER',               ARRAY['DRAEGER','DRAGER','DRAEGERWERK']),
('RESMED',               ARRAY['RESMED']),
('FRESENIUS',            ARRAY['FRESENIUS','FRESENIUS VIAL']),
('ARJOHUNTLEIGH',        ARRAY['ARJOHUNTLEIGH','ARJO']),

-- ------------------------------------------------------------
-- Infusion / vascular access
-- ------------------------------------------------------------
('ICU MEDICAL',          ARRAY['ICU MEDICAL','SMITHS MEDICAL','SMITHS HEALTHCARE']),
('B. BRAUN',             ARRAY['B BRAUN','BRAUN MELSUNGEN','BRAUN GMBH','AESCULAP']),
('TELEFLEX',             ARRAY['TELEFLEX','ARROW INTERNATIONAL','ESSENTIAL MEDICAL']),
('MEDLINE INDUSTRIES',   ARRAY['MEDLINE INDUSTRIES']),

-- ------------------------------------------------------------
-- Surgery / endoscopy / urology
-- ------------------------------------------------------------
('COOK MEDICAL',         ARRAY['COOK INC','COOK MEDICAL','COOK IRELAND','COOK BIOTECH','WILLIAM COOK']),
('INTUITIVE SURGICAL',   ARRAY['INTUITIVE SURGICAL']),
('SONOVA',               ARRAY['SONOVA','ADVANCED BIONICS']),
('COCHLEAR',             ARRAY['COCHLEAR','OTICON MEDICAL','NEURELEC']),
('SIENTRA',              ARRAY['SIENTRA']),
('COLOPLAST',            ARRAY['COLOPLAST']),
('CONCORD MANUFACTURING',ARRAY['CONCORD MANUFACTURING']),
('ABBVIE',               ARRAY['ABBVIE','ALLERGAN','LIFECELL']),
('BAXTER',               ARRAY['BAXTER','HILL-ROM','BATESVILLE']),
('LUMENIS',              ARRAY['LUMENIS']),
('RICHARD WOLF',         ARRAY['RICHARD WOLF']),
('VERATHON MEDICAL',     ARRAY['VERATHON']),
('BOVIE MEDICAL',        ARRAY['BOVIE MEDICAL','BOVIE']),
('OSCOR',                ARRAY['OSCOR']),
('GLOBUS MEDICAL',       ARRAY['GLOBUS MEDICAL','NEVRO']),
('KENDALL',              ARRAY['KENDALL GAMMATRON','KENDALL']),
('INTEGER',              ARRAY['INTEGER HOLDINGS','LAKE REGION MEDICAL','GREATBATCH']),
('MEDICAL COMPONENTS',   ARRAY['MEDICAL COMPONENTS']),
('PERFUSION SYSTEMS',    ARRAY['PERFUSION SYSTEMS']),
('SCHILLER',             ARRAY['SCHILLER']),
('MIRADRY',              ARRAY['MIRADRY']),
('CORDIS',               ARRAY['CORDIS']),
('ORTHOPEDIATRICS',      ARRAY['ORTHOPEDIATRICS','APIFIX']),
('REMOTE DIAGNOSTIC',    ARRAY['REMOTE DIAGNOSTIC']),
('HAEMONETICS',          ARRAY['HAEMONETICS','CARDIVA MEDICAL']),
('STRAIGHT SMILE',       ARRAY['STRAIGHT SMILE']),
('IRHYTHM',              ARRAY['IRHYTHM']),
('BMC MEDICAL',          ARRAY['BMC MEDICAL']),
('HALEON',               ARRAY['HALEON','BLOCK DRUG']),
('GN HEARING',           ARRAY['GN HEARING']),
('OK BIOTECH',           ARRAY['OK BIOTECH']),
('BETA BIONICS',         ARRAY['BETA BIONICS']),
('FUJIFILM',             ARRAY['FUJIFILM']),
('BERLIN HEART',         ARRAY['BERLIN HEART']),
('ENDOLOGIX',            ARRAY['ENDOLOGIX']),

-- ------------------------------------------------------------
-- Diagnostics / lab / imaging
-- ------------------------------------------------------------
('AGILENT',              ARRAY['AGILENT']),
('QUIDELORTHO',          ARRAY['QUIDELORTHO','QUIDEL','ORTHO-CLINICAL','ORTHO CLINICAL']),
('NIHON KOHDEN',         ARRAY['NIHON KOHDEN']),
('NATUS MEDICAL',        ARRAY['NATUS MEDICAL']),

-- ------------------------------------------------------------
-- Neuro / vascular
-- ------------------------------------------------------------
('PENUMBRA',             ARRAY['PENUMBRA']),
('LEMAITRE VASCULAR',    ARRAY['LEMAITRE VASCULAR']),
('CORCYM',               ARRAY['CORCYM']),

-- ------------------------------------------------------------
-- Other
-- ------------------------------------------------------------
('INTEGRA LIFESCIENCES', ARRAY['INTEGRA LIFESCIENCE','ACCLARENT']),
('CARDINAL HEALTH',      ARRAY['CARDINAL HEALTH']),
('STERIS',               ARRAY['STERIS']),
('MED-EL',               ARRAY['MED-EL']),
('DEMANT',               ARRAY['OTICON']),
('AVANOS MEDICAL',       ARRAY['AVANOS MEDICAL','AVANOS']),
('CHRISTOPH MIETHKE',    ARRAY['CHRISTOPH MIETHKE','MIETHKE']),
('INSPIRE MEDICAL',      ARRAY['INSPIRE MEDICAL']),
('NALU MEDICAL',         ARRAY['NALU MEDICAL']),
('SALUDA MEDICAL',       ARRAY['SALUDA MEDICAL']),
('TERRAGENE',            ARRAY['TERRAGENE']),
('SANTA BARBARA',        ARRAY['SANTA BARBARA']);

-- Verify: parents and keywords loaded
SELECT
    COUNT(*)                       AS parents,
    SUM(array_length(keywords, 1)) AS keywords
FROM manufacturer_parent;