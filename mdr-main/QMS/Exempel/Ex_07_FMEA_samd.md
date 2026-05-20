
# Risk Analysis (FMEA) 

**Product:** SkinScan AI (Class IIa)  
**Document ID:** FMEA-001  
**Version:** 1.0  
**Related SOP:** [SOP-010: Risk Management Procedure](../../QMS/Ex_SOP-010_Risk_Management_Procedure.md)

## 1. Risk Analysis Table


| ID | Hazard (Fara) | Potential Cause | Severity (S) | Prob. (P) | Initial Risk | Risk Control Measure (MDR Hierarchy) | Residual Risk |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: |
| **S1** | **False Negative** (Missad cancer) | AI-algoritmen är inte tränad på mörkare hudtoner. | 5 | 3 | **15 (H)** | **1. Design:** Inkludera diverse dataset (Fitzpatrick scale) i träning av algoritm. | **5 (L)** |
| **S2** | **Corrupted Data** | Instabil Bluetooth/Cloud-överföring vid bilduppladdning. | 3 | 4 | **12 (H)** | **2. Protective:** Implementera lokal lagring (checksums) tills överföring bekräftats. | **3 (L)** |
| **S3** | **Use Error** | Användaren tar bild i för mörkt rum (felaktig analys). | 4 | 4 | **16 (H)** | **3. Info:** Appen använder telefonens sensor för att blockera analys om ljuset är < 300 lux. | **4 (L)** |
| **S4** | **Cybersecurity** | Obehörig åtkomst till patientdata (Hacking). | 4 | 2 | **8 (M)** | **1. Design:** End-to-end kryptering och krav på Multi-Factor Authentication (MFA). | **4 (L)** |

---

## 2. Key to Risk Scores

- **S (Severity):** 1 (Negligible) to 5 (Catastrophic)
- **P (Probability):** 1 (Improbable) to 5 (Frequent)
- **Risk Score (R):** S x P


| Score | Rating | Action Required |
| :--- | :--- | :--- |
| **10-25** | **High (Red)** | **Unacceptable.** Immediate risk control required. |
| **5-9** | **Medium (Yellow)** | **ALAP.** Must be reduced as low as possible. |
| **1-4** | **Low (Green)** | **Acceptable.** |

---

## 3. Verification of Controls
All risk control measures listed above are verified through:
1. **Software Verification (Unit Tests):** See [Software Validation Report](../../QMS/Software_Validation_Report_DMS.md).
2. **Usability Testing:** Confirmed in Summative Usability Report (IEC 62366).
3. **Clinical Evaluation:** Sensitivity/Specificity validated in Clinical Evaluation Report (CER).

## 4. Conclusion
Through the implementation of the above risk control measures, all identified risks have been reduced to an acceptable level. The **Benefit-Risk Analysis** confirms that the clinical benefit of early detection outweighs the residual risks.

---
**Author:** [Ditt Namn]  
**Date:** 2024-05-01
