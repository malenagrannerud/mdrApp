/**
 * aggregate-weighted.js
 * 
 * Aggregerar och viktar redan rensad data från device_clean.json.
 * 
 * Viktning (uppskattad - rationale):
 * MAUDE-data kan inte visa faktisk incidentfrekvens eftersom:
 * - Vi saknar exponeringsdata (antal sålda enheter)
 * - Rapporteringsbenägenhet varierar mellan tillverkare
 * - Allvarliga händelser rapporteras oftare
 * 
 * Som proxy använder vi:
 * - report_share: produktens andel av totala rapporter (%)
 * - manufacturer_concentration: hur dominerande är en tillverkare (%)
 * - risk_flag: "HIGH" om Class III eller >10% av alla rapporter
 * 
 * Input: src/data/device_clean.json (från filter-clean.js)
 * Output: src/data/device_summary.json (viktad, aggregerad)
 * 
 * Användning: node scripts/aggregate-weighted.js
 */

import fs from 'fs'

console.log('Aggregerar och viktar...')

const cleanData = JSON.parse(fs.readFileSync('src/data/device_clean.json', 'utf-8'))

// FDA device class mapping
const DEVICE_CLASS = {
  'DZE': '2', 'QBJ': '2', 'QFG': '2', 'OZP': '3', 'BZD': '2',
  'FRN': '2', 'FPA': '2', 'QLG': '2', 'LGW': '3', 'FTR': '3',
}

// Aggregera per produktkod
const productInfo = {}
cleanData.forEach(row => {
  if (!productInfo[row.product_code]) {
    productInfo[row.product_code] = {
      count: 0,
      brands: {},
      generics: {},
      manufacturers: {}
    }
  }
  
  const p = productInfo[row.product_code]
  p.count++
  
  if (row.brand_name) {
    p.brands[row.brand_name] = (p.brands[row.brand_name] || 0) + 1
  }
  if (row.generic_name) {
    p.generics[row.generic_name] = (p.generics[row.generic_name] || 0) + 1
  }
  if (row.manufacturer) {
    p.manufacturers[row.manufacturer] = (p.manufacturers[row.manufacturer] || 0) + 1
  }
})

const totalReports = cleanData.length

// Bygg viktad topplista
const topProducts = Object.entries(productInfo)
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 20)
  .map(([code, info]) => {
    const topBrand = Object.entries(info.brands).sort((a, b) => b[1] - a[1])[0]
    const topGeneric = Object.entries(info.generics).sort((a, b) => b[1] - a[1])[0]
    const topMfr = Object.entries(info.manufacturers).sort((a, b) => b[1] - a[1])[0]
    
    const reportShare = (info.count / totalReports) * 100
    const mfrConcentration = topMfr ? (topMfr[1] / info.count) * 100 : 0
    const deviceClass = DEVICE_CLASS[code] || '?'
    const riskFlag = (deviceClass === '3' || reportShare > 10) ? 'HIGH' : 'NORMAL'

    return {
      code,
      count: info.count,
      brand: topBrand ? topBrand[0] : null,
      generic: topGeneric ? topGeneric[0] : null,
      dominant_manufacturer: topMfr ? topMfr[0] : null,
      report_share_pct: Math.round(reportShare * 10) / 10,
      mfr_concentration_pct: Math.round(mfrConcentration * 10) / 10,
      device_class: deviceClass,
      risk_flag: riskFlag
    }
  })

// Aggregera tillverkare
const allManufacturers = {}
Object.values(productInfo).forEach(info => {
  Object.entries(info.manufacturers).forEach(([name, c]) => {
    allManufacturers[name] = (allManufacturers[name] || 0) + c
  })
})

const topManufacturers = Object.entries(allManufacturers)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .map(([name, count]) => ({
    name,
    count,
    share_pct: Math.round((count / totalReports) * 1000) / 10
  }))

const summary = {
  data_quality: {
    total_rows_analyzed: cleanData.length
  },
  weighting_rationale: "MAUDE-data visar rapporterade händelser, inte faktisk incidentfrekvens. Utan exponeringsdata kan vi inte beräkna sannolikhet. report_share visar andel av rapporter. mfr_concentration visar om en tillverkare dominerar. risk_flag = HIGH om Class III eller >10% av alla rapporter.",
  total_reports_analyzed: totalReports,
  top_products: topProducts,
  top_manufacturers: topManufacturers,
  generated: new Date().toISOString()
}

fs.writeFileSync('src/data/device_summary.json', JSON.stringify(summary, null, 2))
console.log(`Sparat till src/data/device_summary.json (${(fs.statSync('src/data/device_summary.json').size / 1024).toFixed(1)} KB)`)

console.log('\nTopp 10 produkter (viktade):')
topProducts.slice(0, 10).forEach(p => {
  const name = p.brand || p.generic || p.code
  console.log(`  ${p.code} [${p.risk_flag}] ${p.report_share_pct}% | ${name} | Dom: ${p.dominant_manufacturer} (${p.mfr_concentration_pct}%)`)
})