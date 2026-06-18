/**
 * filter.js
 * 
 * Rensar och aggregerar FDA MAUDE DEVICE2024.txt.
 * Laddar upp direkt till Supabase.
 * 
 * ========================================
 * INPUT: src/data/DEVICE2024.txt
 * ========================================
 * Format: Pipe-delimited (|), 34 kolumner, ca 2.6M rader
 * 
 * Kolumner som ANVÄNDS (5 av 34):
 * - MDR_REPORT_KEY (kolonn 1): Unik rapportnyckel, dubblettkontroll
 * - DEVICE_REPORT_PRODUCT_CODE (kolonn 29): 3-bokstavskod (t.ex. "DZE")
 * - BRAND_NAME (kolonn 10): Varumärkesnamn (t.ex. "Dexcom G6")
 * - GENERIC_NAME (kolonn 11): Generiskt produktnamn
 * - MANUFACTURER_D_NAME (kolonn 12): Tillverkarens företagsnamn
 * 
 * ========================================
 * RENSNINGSSTEG (5 st)
 * ========================================
 * 1. FILTRERA BORT RADER UTAN PRODUKTKOD
 * 2. FILTRERA BORT OGILTIGA TILLVERKARNAMN
 * 3. TA BORT DUBBLETTER (samma MDR_REPORT_KEY)
 * 4. NORMALISERA TILLVERKARNAMN (ta bort suffix: Inc, LLC, Ltd, Corp, etc.)
 * 5. SLÅ IHOP KÄNDA DUBBLETTER (samma företag, olika stavning)
 * 
 * ========================================
 * OUTPUT: Supabase
 * ========================================
 * product_stats: product_code, total_reports, brand_name, generic_name, manufacturer_name
 * manufacturer_stats: name, count (aggregerat totalt, inga dubletter)
 * 
 * @module scripts/filter
 */

import fs from 'fs'
import readline from 'readline'

console.log('Läser DEVICE2024.txt...')

const rl = readline.createInterface({
  input: fs.createReadStream('src/data/DEVICE2024.txt'),
  crlfDelay: Infinity
})

let count = 0, kept = 0
let removedNoProductCode = 0, removedBadManufacturer = 0, removedDuplicate = 0
let headers = []
const seenKeys = new Set()
const productInfo = {}

/**
 * Normaliserar tillverkarnamn.
 * Tar bort företagssuffix (Inc, LLC, Ltd, Corp, AG, etc.) och punkter.
 * Behåller ursprunglig kapitalisering.
 * 
 * @param {string} name - Rått tillverkarnamn
 * @returns {string} Normaliserat namn utan suffix
 */
function normalizeManufacturer(name) {
  return name.trim()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .replace(/ inc\.?$/i, '')
    .replace(/ llc\.?$/i, '')
    .replace(/ ltd\.?$/i, '')
    .replace(/ co\.?$/i, '')
    .replace(/ CO\.?$/i, '')
    .replace(/ CO\.?$/i, '')
    .replace(/ corp\.?$/i, '')
    .replace(/ corporation$/i, '')
    .replace(/ a\/s$/i, '')
    .replace(/ ag$/i, '')
    .replace(/ gmbh$/i, '')
    .replace(/ sa$/i, '')
    .replace(/ ab$/i, '')
    .replace(/,/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Slår ihop kända tillverkardubletter.
 * @param {string} name - Normaliserat tillverkarnamn
 * @returns {string} Enhetligt företagsnamn
 */
function mergeKnownDuplicates(name) {
  const merges = {
    'NOBEL BIOCARE GÖTEBORG': 'NOBEL BIOCARE',
    'MEDTRONIC MINIMED': 'MEDTRONIC',
    'MEDTRONIC PUERTO RICO OPERATIONS': 'MEDTRONIC',
    'AIZU OLYMPUS': 'OLYMPUS',
    'SHIRAKAWA OLYMPUS': 'OLYMPUS',
  
  }
  return merges[name] || name
}

/**
 * Kontrollerar om tillverkarnamn är ogiltigt.
 * @param {string} name
 * @returns {boolean}
 */
function isInvalidManufacturer(name) {
  const invalid = ['NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN', 'NO INFORMATION', '', '?']
  return !name || invalid.includes(name.toUpperCase()) || name.length < 3
}

const idx = (n) => headers.indexOf(n)

rl.on('line', (line) => {
  if (count === 0) { headers = line.split('|'); count++; return }
  if (count % 500000 === 0) console.log(`  Rad ${count.toLocaleString()}...`)

  const f = line.split('|')
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
  const manufacturer = mergeKnownDuplicates(normalizeManufacturer(manufacturerRaw))
  kept++

  if (!productInfo[productCode]) {
    productInfo[productCode] = { count: 0, brands: {}, generics: {}, manufacturers: {} }
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

rl.on('close', async () => {
  console.log(`\n=== Datakvalitetsrapport ===`)
  console.log(`  Totalt: ${count.toLocaleString()}`)
  console.log(`  Behållna: ${kept.toLocaleString()} (${((kept/count)*100).toFixed(1)}%)`)
  console.log(`  Utan produktkod: ${removedNoProductCode.toLocaleString()}`)
  console.log(`  Ogiltig tillverkare: ${removedBadManufacturer.toLocaleString()}`)
  console.log(`  Dubbletter: ${removedDuplicate.toLocaleString()}`)

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient('https://kgoxvplsaceqdvorqsle.supabase.co', 'sb_publishable_rdmGgZU7C_hFS5QtQUrQsg_zRoStrnN')

  // Produkter
  const topProducts = Object.entries(productInfo)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .map(([code, info]) => {
      const topBrand = Object.entries(info.brands).sort((a, b) => b[1] - a[1])[0]
      const topGeneric = Object.entries(info.generics).sort((a, b) => b[1] - a[1])[0]
      const topMfr = Object.entries(info.manufacturers).sort((a, b) => b[1] - a[1])[0]
      return {
        product_code: code,
        total_reports: info.count,
        brand_name: topBrand ? topBrand[0] : null,
        generic_name: topGeneric ? topGeneric[0] : null,
        manufacturer_name: topMfr ? topMfr[0] : null
      }
    })

  console.log('\nLaddar upp produkter...')
  for (const p of topProducts) {
    const { error } = await supabase.from('product_stats').upsert(p)
    if (error) console.error(`  Fel ${p.product_code}:`, error.message)
    else console.log(`  OK: ${p.product_code}`)
  }

  // Manufacturers (aggregerade totalt)
  const allManufacturers = {}
  Object.values(productInfo).forEach(info => {
    Object.entries(info.manufacturers).forEach(([name, c]) => {
      allManufacturers[name] = (allManufacturers[name] || 0) + c
    })
  })

  const topManufacturers = Object.entries(allManufacturers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)

  console.log('\nLaddar upp manufacturers...')
  for (const [name, count] of topManufacturers) {
    const { error } = await supabase.from('manufacturer_stats').upsert({ name, count })
    if (error) console.error(`  Fel ${name}:`, error.message)
    else console.log(`  OK: ${name}`)
  }

  console.log('\nKlart!')
})