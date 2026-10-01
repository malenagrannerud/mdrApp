/*
  03a_seed_manufacturers.sql
  Author: Malena | Updated: 2026-10-01

  Parent-company keyword rules that drive auto-generation of
  manufacturer_mapping in 03b_silver.sql.

  HOW TO USE:
    1. Run 01_create_tables.sql
    2. Run this file (fills manufacturer_parent)
    3. Run 03b_silver.sql (reads manufacturer_parent, rebuilds mapping)

  TO EXTEND: add more rows below and re-run this file, then re-run 03b_silver.sql.
*/


-- ============================================================
-- Parent companies and their keyword patterns
-- ============================================================
-- Each keyword is matched case-insensitively against the normalized raw
-- name (see normalize_mfr_name() in 03b_silver.sql). A hit assigns the
-- whole row to the parent_name.

TRUNCATE TABLE manufacturer_parent;

INSERT INTO manufacturer_parent (parent_name, keywords) VALUES
-- ------------------------------------------------------------
-- Big cardio / ortho / imaging
-- ------------------------------------------------------------
('MEDTRONIC',            ARRAY['MEDTRONIC','COVIDIEN','MPRI','US SURGICAL','TYCO','MEDIVANCE','MEDOS INTERNATIONAL','MICRO THERAPEUTICS','EV3','HEARTWARE','MDT POWERED']),
('ABBOTT',               ARRAY['ABBOTT','ST JUDE','ST. JUDE','THORATEC','BIOSENSE WEBSTER','AMO PUERTO RICO']),
('JOHNSON & JOHNSON',    ARRAY['JOHNSON & JOHNSON','ETHICON','DEPUY','SYNTHES','ABIOMED','AURIS','CERENOVUS']),
('BECTON DICKINSON',     ARRAY['BECTON','C.R. BARD','CR BARD','CAREFUSION','ALARIS','BARD PERIPHERAL','BARD ACCESS','BD SUZHOU','BD MEDICAL','BD INFUSION']),
('BOSTON SCIENTIFIC',    ARRAY['BOSTON SCIENTIFIC']),
('PHILIPS',              ARRAY['PHILIPS','RESPIRONICS']),
('GE HEALTHCARE',        ARRAY['GE HEALTHCARE','DATEX','OHMEDA','GE MEDICAL']),
('SIEMENS HEALTHINEERS', ARRAY['SIEMENS','VARIAN','VACUUM']),
('BIOTRONIK',            ARRAY['BIOTRONIK']),
('EDWARDS LIFESCIENCES', ARRAY['EDWARDS LIFESCIENCE']),
('DATASCOPE',            ARRAY['DATASCOPE']),
('LIVANOVA',             ARRAY['LIVANOVA','SORIN']),
('PHYSIO-CONTROL',       ARRAY['PHYSIO-CONTROL']),
('ZOLL',                 ARRAY['ZOLL']),
('CARDIAC SCIENCE',      ARRAY['CARDIAC SCIENCE']),
('DEFIBTECH',            ARRAY['DEFIBTECH']),
('W.L. GORE',            ARRAY['W L GORE','WL GORE','GORE & ASSOCIATES']),
('MERIT MEDICAL',        ARRAY['MERIT MEDICAL']),
('TERUMO',               ARRAY['TERUMO']),
('MICROPORT',            ARRAY['MICROPORT']),

-- ------------------------------------------------------------
-- Ortho / dental / implants
-- ------------------------------------------------------------
('STRAUMANN',            ARRAY['STRAUMANN','NOBEL BIOCARE','ANTHOGYR','JJGC','INSTITUT STRAUMANN']),
('ZIMMER BIOMET',        ARRAY['ZIMMER','BIOMET']),
('DENTSPLY',             ARRAY['DENTSPLY','IMPLANT DIRECT','SYBRON']),
('ARTHREX',              ARRAY['ARTHREX']),
('BIOHORIZONS',          ARRAY['BIOHORIZONS']),
('SMITH & NEPHEW',       ARRAY['SMITH & NEPHEW','SMITH AND NEPHEW']),
('PALTOP',               ARRAY['PALTOP']),
('STAAR SURGICAL',       ARRAY['STAAR SURGICAL']),
('EXACTECH',             ARRAY['EXACTECH']),
('STRYKER',              ARRAY['STRYKER','TORNIER','MOOG MEDICAL','MAKO SURGICAL']),
('ALTATEC',              ARRAY['ALTATEC']),
('INTRA-LOCK',           ARRAY['INTRA-LOCK']),
('KEYSTONE DENTAL',      ARRAY['KEYSTONE DENTAL']),
('MEDARTIS',             ARRAY['MEDARTIS']),
('AESCULAP',             ARRAY['AESCULAP']),
('ENCORE MEDICAL',       ARRAY['ENCORE MEDICAL']),
('TREACE MEDICAL',       ARRAY['TREACE MEDICAL']),
('SPATZ',                ARRAY['SPATZ']),
('ACUMED',               ARRAY['ACUMED']),
('SEASPINE',             ARRAY['SEASPINE']),
('ONKOS SURGICAL',       ARRAY['ONKOS SURGICAL']),
('LIMACORPORATE',        ARRAY['LIMACORPORATE']),
('WARSAW ORTHOPEDICS',   ARRAY['WARSAW ORTHOPEDICS']),
('ACCESS DENTAL LAB',    ARRAY['ACCESS DENTAL']),
('TULSA DENTAL',         ARRAY['TULSA DENTAL']),
('ARTHROCARE',           ARRAY['ARTHROCARE']),
('ZEST ANCHORS',         ARRAY['ZEST ANCHORS','ZEST']),

-- ------------------------------------------------------------
-- Diabetes / CGM / pumps
-- ------------------------------------------------------------
('DEXCOM',               ARRAY['DEXCOM']),
('TANDEM',               ARRAY['TANDEM DIABETES']),
('INSULET',              ARRAY['INSULET']),
('ROCHE',                ARRAY['ROCHE DIABETES','ROCHE DIAGNOSTICS']),
('SENSEONICS',           ARRAY['SENSEONICS']),
('COMPANION MEDICAL',    ARRAY['COMPANION MEDICAL']),
('ASCENSIA',             ARRAY['ASCENSIA']),
('LIFESCAN',             ARRAY['LIFESCAN']),
('NOVO NORDISK',         ARRAY['NOVO NORDISK']),
('MANNKIND',             ARRAY['MANNKIND']),

-- ------------------------------------------------------------
-- Ophthalmology
-- ------------------------------------------------------------
('ALCON',                ARRAY['ALCON']),
('OLYMPUS',              ARRAY['OLYMPUS','AIZU OLYMPUS','SHIRAKAWA OLYMPUS','AOMORI OLYMPUS']),
('BAUSCH',               ARRAY['BAUSCH']),
('WAVELIGHT',            ARRAY['WAVELIGHT']),
('RAYNER',               ARRAY['RAYNER INTRAOCULAR','RAYNER']),

-- ------------------------------------------------------------
-- Respiratory / anesthesia
-- ------------------------------------------------------------
('SMITHS MEDICAL',       ARRAY['SMITHS MEDICAL','SMITHS HEALTHCARE']),
('VYAIRE',               ARRAY['VYAIRE']),
('HAMILTON MEDICAL',     ARRAY['HAMILTON MEDICAL']),
('THOMMEN MEDICAL',      ARRAY['THOMMEN MEDICAL']),
('MAQUET',               ARRAY['MAQUET']),
('GETINGE',              ARRAY['GETINGE']),
('DRÄGER',               ARRAY['DRAEGER','DRAGER','DRAEGERWERK']),
('RESMED',               ARRAY['RESMED']),
('FRESENIUS',            ARRAY['FRESENIUS','FRESENIUS VIAL']),
('HILL-ROM',             ARRAY['HILL-ROM','BATESVILLE']),
('ARJOHUNTLEIGH',        ARRAY['ARJOHUNTLEIGH','ARJO']),

-- ------------------------------------------------------------
-- Infusion / vascular access
-- ------------------------------------------------------------
('ICU MEDICAL',          ARRAY['ICU MEDICAL']),
('B. BRAUN',             ARRAY['B BRAUN','B. BRAUN','BRAUN MELSUNGEN','BRAUN GMBH']),
('ARROW INTERNATIONAL',  ARRAY['ARROW INTERNATIONAL']),
('TELEFLEX',             ARRAY['TELEFLEX']),
('MEDLINE INDUSTRIES',   ARRAY['MEDLINE INDUSTRIES']),

-- ------------------------------------------------------------
-- Surgery / endoscopy / urology
-- ------------------------------------------------------------
('COOK MEDICAL',         ARRAY['COOK INC','COOK MEDICAL','COOK IRELAND','COOK BIOTECH','WILLIAM COOK']),
('DAVIS & GECK',         ARRAY['DAVIS & GECK']),
('INTUITIVE SURGICAL',   ARRAY['INTUITIVE SURGICAL']),
('ADVANCED BIONICS',     ARRAY['ADVANCED BIONICS']),
('COCHLEAR',             ARRAY['COCHLEAR']),
('SIENTRA',              ARRAY['SIENTRA']),
('COLOPLAST',            ARRAY['COLOPLAST']),
('CONCORD MANUFACTURING',ARRAY['CONCORD MANUFACTURING']),
('SOFRADIM',             ARRAY['SOFRADIM']),
('ABBVIE',               ARRAY['ABBVIE','ALLERGAN','MENTOR']),
('BAXTER',               ARRAY['BAXTER']),
('GYRUS ACMI',           ARRAY['GYRUS ACMI']),
('LUMENIS',              ARRAY['LUMENIS']),
('RICHARD WOLF',         ARRAY['RICHARD WOLF']),
('VERATHON MEDICAL',     ARRAY['VERATHON']),
('BOVIE MEDICAL',        ARRAY['BOVIE MEDICAL','BOVIE']),
('MEGADYNE MEDICAL',     ARRAY['MEGADYNE']),
('OSCOR',                ARRAY['OSCOR']),
('NEVRO',                ARRAY['NEVRO']),
('MITG',                 ARRAY['MITG','RF SURGICAL']),
('KENDALL',              ARRAY['KENDALL GAMMATRON','KENDALL']),
('LAKE REGION MEDICAL',  ARRAY['LAKE REGION MEDICAL']),
('MEDICAL COMPONENTS',   ARRAY['MEDICAL COMPONENTS']),
('PERFUSION SYSTEMS',    ARRAY['PERFUSION SYSTEMS']),
('SCHILLER',             ARRAY['SCHILLER']),
('MIRADRY',              ARRAY['MIRADRY']),
('BLUE BELT TECHNOLOGIES', ARRAY['BLUE BELT']),
('ACCLARENT',            ARRAY['ACCLARENT']),
('CORDIS',               ARRAY['CORDIS']),
('APIFIX',               ARRAY['APIFIX']),
('REMOTE DIAGNOSTIC',    ARRAY['REMOTE DIAGNOSTIC']),
('BAYLIS MEDICAL',       ARRAY['BAYLIS MEDICAL']),
('CARDIVA MEDICAL',      ARRAY['CARDIVA MEDICAL']),
('STRAIGHT SMILE',       ARRAY['STRAIGHT SMILE']),
('IRHYTHM',              ARRAY['IRHYTHM']),
('BMC MEDICAL',          ARRAY['BMC MEDICAL']),
('PULSION MEDICAL',      ARRAY['PULSION MEDICAL']),
('BLOCK DRUG',           ARRAY['BLOCK DRUG']),
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
('ORTHO-CLINICAL DIAGNOSTICS', ARRAY['ORTHO-CLINICAL','ORTHO CLINICAL']),
('QUIDELORTHO',          ARRAY['QUIDELORTHO','QUIDEL']),
('NIHON KOHDEN',         ARRAY['NIHON KOHDEN']),
('NATUS MEDICAL',        ARRAY['NATUS MEDICAL']),

-- ------------------------------------------------------------
-- Neuro / vascular
-- ------------------------------------------------------------
('PENUMBRA',             ARRAY['PENUMBRA']),
('MICROVENTION',         ARRAY['MICROVENTION']),
('SILK ROAD MEDICAL',    ARRAY['SILK ROAD MEDICAL']),
('NEURAVI',              ARRAY['NEURAVI']),
('CYBERONICS',           ARRAY['CYBERONICS']),
('BOLTON MEDICAL',       ARRAY['BOLTON MEDICAL']),
('VOLCANO',              ARRAY['VOLCANO CORPORATION','VOLCANO']),
('LEMAITRE VASCULAR',    ARRAY['LEMAITRE VASCULAR']),
('CORCYM',               ARRAY['CORCYM']),

-- ------------------------------------------------------------
-- Other
-- ------------------------------------------------------------
('INTEGRA LIFESCIENCES', ARRAY['INTEGRA LIFESCIENCE']),
('CARDINAL HEALTH',      ARRAY['CARDINAL HEALTH']),
('STERIS',               ARRAY['STERIS']),
('MED-EL',               ARRAY['MED-EL']),
('OTICON MEDICAL',       ARRAY['OTICON MEDICAL','OTICON','NEURELEC']),
('AVANOS MEDICAL',       ARRAY['AVANOS MEDICAL','AVANOS']),
('CHRISTOPH MIETHKE',    ARRAY['CHRISTOPH MIETHKE','MIETHKE']),
('INSPIRE MEDICAL',      ARRAY['INSPIRE MEDICAL']),
('NALU MEDICAL',         ARRAY['NALU MEDICAL']),
('LIFECELL',             ARRAY['LIFECELL']),
('ESSENTIAL MEDICAL',    ARRAY['ESSENTIAL MEDICAL']),
('SALUDA MEDICAL',       ARRAY['SALUDA MEDICAL']),
('MAILLEFER',            ARRAY['MAILLEFER']),
('IVANTIS',              ARRAY['IVANTIS']),
('VDW',                  ARRAY['VDW GMBH','VDW']),
('TERRAGENE',            ARRAY['TERRAGENE']),
('SANTA BARBARA',        ARRAY['SANTA BARBARA']);

-- ============================================================
-- Verify
-- ============================================================
-- SELECT COUNT(*) AS parents FROM manufacturer_parent;
-- SELECT parent_name, array_length(keywords, 1) AS kw_count
-- FROM manufacturer_parent ORDER BY parent_name;