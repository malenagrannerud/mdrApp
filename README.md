# Aegis Compliance Webb App

**A regulatory workflow and post-market surveillance tool for medical device manufacturers**, guiding cross-functional teams — regulatory affairs, quality, data, and leadership — through EU MDR compliance, ISO 13485 QMS setup, and real-world safety signal analysis.

🔗 **Live demo:** [mdr-qms-steps.vercel.app](https://mdr-qms-steps.vercel.app/)
📄 **Data pipeline deep-dive:** [PIPELINE.md](./PIPELINE.md)

---
## Why this exists
Getting a medical device to market — and keeping it there — means navigating two dense regulatory frameworks (EU MDR 2017/745, ISO 13485) and continuously monitoring post-market data for safety signals. In practice, this knowledge lives scattered across legal text, SOPs, and spreadsheets, and rarely talks to the *data* teams need for post-market surveillance.

Aegis Compliance brings these together in one place: the regulatory roadmap, the QMS structure, and a live dashboard built on real FDA adverse event data — so regulatory, quality, and data roles can work from the same picture.

---
## What it does

### 🧭 MDR Steps
Translates the EU 2017/745 regulation into a visual, navigable roadmap of the CE-marking journey — turning dense legal text into a process a cross-functional team can actually follow.

### ✅ QMS Steps
Maps the core requirements of ISO 13485:2016 into a step-by-step implementation guide, with a practical focus on SOPs and Work Instructions — a roadmap for startups and manufacturers building an audit-ready QMS from scratch.

### 📊 Dashboard — Post-Market Surveillance
### 📊 Dashboard — Post-Market Surveillance
A live dashboard built on a custom-engineered data pipeline (see [PIPELINE.md](./PIPELINE.md)) processing real FDA MAUDE adverse event data — the kind of dataset manufacturers use to monitor their own products' safety trends over time.

- **Signal detection** — surfaces which products and manufacturers generate the most reports, the first step in spotting an emerging safety trend before it becomes a bigger problem
- **Self-monitoring** — a manufacturer can filter down to their own products to track their own incident trends, feeding into downstream processes like CAPA or risk file updates
- **Benchmarking** — compare incident volume across product categories and manufacturers to spot outliers

The pipeline itself — not just the dashboard — is the technical core: a medallion architecture (bronze → silver → gold) processing 20,000 real reports with a 99.75% validation rate. Full breakdown in [PIPELINE.md](./PIPELINE.md).

---
## Tech stack
| Layer | Tools |
|---|---|
| Frontend | React |
| Data pipeline | Python, SQL, Pydantic |
| Database | PostgreSQL (Supabase) |
| Deployment | Vercel |

---
## Running it locally
```bash
npm install
npm run dev
```

To rebuild the underlying dataset from scratch (ingest → clean → aggregate), follow the pipeline steps in [PIPELINE.md](./PIPELINE.md).

---
## Roadmap

**QA/RA**
- [ ] Map dependencies between MDR and QMS documentation requirements
- [ ] Add sample audit checklists
- [ ] Clickable regulatory abbreviations with inline definitions

**PMS Data Analysis**
- [ ] Expand beyond top-10 view — searchable/filterable product and manufacturer tables
- [ ] Time-series view of report volume by product code

---
## Contact
**Malena Grannerud**
malena.grannerud@gmail.com
[LinkedIn](https://www.linkedin.com/in/malena-grannerud)

*Created by Malena Grannerud, 2026*