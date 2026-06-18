/**
 * filter-device.js
 * 
 * Filtrerar och rensar DEVICE2024.txt.
 * Extraherar aggregerad statistik med datakvalitetskontroller och viktning.
 * 
 * Rensningssteg:
 * 1. Tar bort rader med ogiltiga tillverkarnamn (NI, UNK, *, N/A, tomma, <3 tecken)
 * 2. Tar bort dubbletter per MDR_REPORT_KEY (behåller första)
 * 3. Normaliserar tillverkarnamn (trimmar whitespace, versaler)
 * 4. Filtrerar bort rader utan produktkod
 * 
 * Viktning (uppskattad):
 * MAUDE-data kan inte visa faktisk incidentfrekvens eftersom:
 * - Vi saknar exponeringsdata (antal sålda enheter)
 * - Rapporteringsbenägenhet varierar mellan tillverkare
 * - Allvarliga händelser rapporteras oftare
 * 
 * Som proxy använder vi:
 * - report_share: produktens andel av totala rapporter (%)
 * - manufacturer_concentration: hur dominerande är en tillverkare för produkten (%)
 * - risk_flag: "HIGH" om produkten tillhör Class III eller har >10% av alla rapporter
 * 
 * Input: src/data/DEVICE2024.txt
 * Output: src/data/device_summary.json
 */

import fs from 'fs'
import readline from 'readline'

console.log('Läser DEVICE2024.txt...')

const rl = readline.createInterface({
  input: fs.createReadStream('src/data/DEVICE2024.txt'),
  crlfDelay: Infinity
})

let count = 0
let kept = 0
let removedNoProductCode = 0
let removedBadManufacturer = 0
let removedDuplicate = 0
let headers = []

const seenKeys = new Set()
const productInfo = {}

/**
 * Normalisera tillverkarnamn.
 * Trimma, gör versaler, ta bort punkter och extra mellanslag.
 * @param {string} name
 * @returns {string}
 */
function normalizeManufacturer(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .replace(/ INC$/, ' INC.')
    .replace(/ LLC$/, ' LLC.')
    .replace(/ LTD$/, ' LTD.')
    .replace(/ CO$/, ' CO.')
    .replace(/ CORP$/, ' CORP.')
    .replace(/ CORPORATION$/, ' CORP.')
}

/**
 * Kolla om tillverkarnamnet är ogiltigt.
 * @param {string} name
 * @returns {boolean}
 */
function isInvalidManufacturer(name) {
  const invalid = ['NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN', 'NO INFORMATION', '', '?']
  return !name || invalid.includes(name.toUpperCase()) || name.length < 3
}

// FDA device class mapping från classification API
const DEVICE_CLASS = {
  'DZE': '2', 'QBJ': '2', 'QFG': '2', 'OZP': '3', 'BZD': '2',
  'FRN': '2', 'FPA': '2', 'QLG': '2', 'LGW': '3', 'FTR': '3',
}

rl.on('line', (line) => {
  if (count === 0) {
    headers = line.split('|')
    count++
    return
  }

  if (count % 500000 === 0) console.log(`  Rad ${count.toLocaleString()}...`)

  const f = line.split('|')
  const idx = (n) => headers.indexOf(n)

  const reportKey = (f[idx('MDR_REPORT_KEY')] || '').trim()
  const productCode = (f[idx('DEVICE_REPORT_PRODUCT_CODE')] || '').trim()
  const brandName = (f[idx('BRAND_NAME')] || '').trim()
  const genericName = (f[idx('GENERIC_NAME')] || '').trim()
  const manufacturerRaw = (f[idx('MANUFACTURER_D_NAME')] || '').trim()

  count++

  if (!productCode) { removedNoProductCode++; return }
  if (isInvalidManufacturer(manufacturerRaw)) { removedBadManufacturer++; return }
  if (seenKeys.has(reportKey)) { removedDuplicate++; return }
  
  seenKeys.add(reportKey)
  const manufacturer = normalizeManufacturer(manufacturerRaw)
  kept++

  if (!productInfo[productCode]) {
    productInfo[productCode] = {
      count: 0,
      brands: {},
      generics: {},
      manufacturers: {}
    }
  }

  productInfo[productCode].count++

  if (brandName && brandName.length > 1 && !isInvalidManufacturer(brandName)) {
    const b = normalizeManufacturer(brandName)
    productInfo[productCode].brands[b] = (productInfo[productCode].brands[b] || 0) + 1
  }

  if (genericName && genericName.length > 1 && !isInvalidManufacturer(genericName)) {
    const g = genericName.toUpperCase().trim()
    productInfo[productCode].generics[g] = (productInfo[productCode].generics[g] || 0) + 1
  }

  if (manufacturer) {
    productInfo[productCode].manufacturers[manufacturer] = (productInfo[productCode].manufacturers[manufacturer] || 0) + 1
  }
})

rl.on('close', () => {
  console.log(`\n=== Datakvalitetsrapport ===`)
  console.log(`  Totalt: ${count.toLocaleString()}`)
  console.log(`  Behållna: ${kept.toLocaleString()} (${((kept/count)*100).toFixed(1)}%)`)
  console.log(`  Utan produktkod: ${removedNoProductCode.toLocaleString()}`)
  console.log(`  Ogiltig tillverkare: ${removedBadManufacturer.toLocaleString()}`)
  console.log(`  Dubbletter: ${removedDuplicate.toLocaleString()}`)

  const totalReports = Object.values(productInfo).reduce((s, p) => s + p.count, 0)

  const topProducts = Object.entries(productInfo)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .map(([code, info]) => {
      const topBrand = Object.entries(info.brands).sort((a, b) => b[1] - a[1])[0]
      const topGeneric = Object.entries(info.generics).sort((a, b) => b[1] - a[1])[0]
      
      // Hitta dominerande tillverkare för denna produktkod
      const topMfr = Object.entries(info.manufacturers).sort((a, b) => b[1] - a[1])[0]
      
      /**
       * Uppskattad viktning - rationale:
       * 
       * report_share: produktens andel av alla rapporter.
       * Hög andel = produkten syns mycket i MAUDE. Kan betyda antingen
       * många problem eller stor marknadsandel. Utan exponeringsdata går
       * det inte att skilja på dessa.
       * 
       * mfr_concentration: hur stor andel av produktens rapporter kommer
       * från en enda tillverkare. Hög koncentration (>80%) tyder på att
       * en tillverkare dominerar rapporteringen - antingen pga dominerande
       * marknadsandel eller aktiv rapporteringskultur.
       * 
       * device_class: FDA riskklass (1=låg, 2=medium, 3=hög).
       * Class III-produkter är högre risk och övervakas mer.
       * 
       * risk_flag: "HIGH" om Class III ELLER >10% av alla rapporter.
       * Indikerar att produkten bör prioriteras för granskning.
       */
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
      total_rows_input: count,
      total_rows_kept: kept,
      removed_no_product_code: removedNoProductCode,
      removed_bad_manufacturer: removedBadManufacturer,
      removed_duplicate: removedDuplicate
    },
    weighting_rationale: "MAUDE-data visar rapporterade händelser, inte faktisk incidentfrekvens. Utan exponeringsdata (antal sålda enheter) kan vi inte beräkna sannolikhet. report_share visar hur stor andel av rapporterna som rör produkten. mfr_concentration visar om en tillverkare dominerar rapporteringen. risk_flag indikerar produkter som bör granskas baserat på riskklass och rapporteringsvolym.",
    total_reports_analyzed: totalReports,
    top_products: topProducts,
    top_manufacturers: topManufacturers,
    generated: new Date().toISOString()
  }

  fs.writeFileSync('src/data/device_summary.json', JSON.stringify(summary, null, 2))
  console.log(`\nSparat (${(fs.statSync('src/data/device_summary.json').size / 1024).toFixed(1)} KB)`)

  console.log('\nTopp 10 produkter (viktade):')
  topProducts.slice(0, 10).forEach(p => {
    const name = p.brand || p.generic || p.code
    console.log(`  ${p.code} [${p.risk_flag}] ${p.report_share_pct}% | ${name} | Dom: ${p.dominant_manufacturer} (${p.mfr_concentration_pct}%)`)
  })
})