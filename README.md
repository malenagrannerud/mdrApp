
# MDR STEPS - READ ONLY 

## SE STEGEN

  1) Gå in i mappen mdr-main
  2) I mappen QMS - se stegen för att bygga & underhålla ett QMS enligt ISO 13485
  3) I mappen MDR - se stegen för att sätta en medicinteknisk produkt på marknaden

## SYFTE

Jag byggde detta repo för att demonstrera min förmåga att omsätta regulatoriska krav i praktisk dokumentation. 

## Vad repot innehåller

- **Kvalitetssystem (QMS)** – Processkarta, dokumentstyrning och CAPA-process enligt ISO 13485
- **MDR-efterlevnad** – Intended purpose, klassificering (Annex VIII) och GSPR-checklista (Annex I)
- **Riskhantering** – Hazard analysis och FMEA enligt ISO 14971
- **Klinisk utvärdering** – Litteratursökningsplan och analys av klinisk nytta
- **Change Management** – Bedömning av regulatorisk påverkan vid produktuppdateringar
- **Spårbarhet** – Matriser som länkar krav till GSPR, risk och test

## Viktigt att veta

> **Allt innehåll i detta repo är fiktivt.** Produkten, företaget och all klinisk data är påhittade och används enbart i utbildnings- och portfoliosyfte för att demonstrera regulatorisk metodik.

## Teknisk approach

All dokumentation är skriven i **Markdown (.md)** och **CSV** – versionshanterbara, diff-bara format som fungerar i utvecklingsnära miljöer. Detta speglar hur moderna medicinteknikbolag arbetar med sin dokumentation: spårbart, granskningsbart och integrerat i utvecklingsverktygen.

---

*Skapat av Malena Grannerud, april 2026*



# MDR STEPS - THE WEB APP
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
