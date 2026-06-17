/**
 * filter-device.js
 * 
 * Filtrerar DEVICE2024.txt och extraherar aggregerad statistik
 * inklusive brand name, generic name, manufacturer.
 * 
 * Input: src/data/DEVICE2024.txt (600MB)
 * Output: src/data/device_summary.json
 * 
 * Användning: node scripts/filter-device.js
 */

import fs from 'fs'
import readline from 'readline'

console.log('Läser DEVICE2024.txt...')

const rl = readline.createInterface({
  input: fs.createReadStream('src/data/DEVICE2024.txt'),
  crlfDelay: Infinity
})

let count = 0
let headers = []

// Gruppera per produktkod för att samla info
const productInfo = {}

rl.on('line', (line) => {
  if (count === 0) {
    headers = line.split('|')
    count++
    return
  }

  if (count % 500000 === 0) console.log(`  Rad ${count.toLocaleString()}...`)

  const f = line.split('|')
  const idx = (n) => headers.indexOf(n)

  const productCode = (f[idx('DEVICE_REPORT_PRODUCT_CODE')] || '').trim()
  const brandName = (f[idx('BRAND_NAME')] || '').trim()
  const genericName = (f[idx('GENERIC_NAME')] || '').trim()
  const manufacturer = (f[idx('MANUFACTURER_D_NAME')] || '').trim()

  if (!productCode) { count++; return }

  if (!productInfo[productCode]) {
    productInfo[productCode] = {
      count: 0,
      brands: {},
      generics: {},
      manufacturers: {}
    }
  }

  productInfo[productCode].count++

  if (brandName && brandName.length > 1 && brandName !== 'N/A' && brandName !== '*') {
    productInfo[productCode].brands[brandName] = (productInfo[productCode].brands[brandName] || 0) + 1
  }

  if (genericName && genericName.length > 1 && genericName !== 'N/A' && genericName !== '*') {
    productInfo[productCode].generics[genericName] = (productInfo[productCode].generics[genericName] || 0) + 1
  }

  if (manufacturer && manufacturer.length > 1 && manufacturer !== 'N/A' && manufacturer !== '*') {
    productInfo[productCode].manufacturers[manufacturer] = (productInfo[productCode].manufacturers[manufacturer] || 0) + 1
  }

  count++
})

rl.on('close', () => {
  console.log(`Klart! ${count.toLocaleString()} rader bearbetade`)

  // Hitta vanligaste brand name, generic name per produktkod
  const topProducts = Object.entries(productInfo)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .map(([code, info]) => {
      const topBrand = Object.entries(info.brands).sort((a, b) => b[1] - a[1])[0]
      const topGeneric = Object.entries(info.generics).sort((a, b) => b[1] - a[1])[0]
      return {
        code,
        count: info.count,
        brand: topBrand ? topBrand[0] : null,
        generic: topGeneric ? topGeneric[0] : null
      }
    })

  // Topp manufacturers totalt
  const allManufacturers = {}
  Object.values(productInfo).forEach(info => {
    Object.entries(info.manufacturers).forEach(([name, c]) => {
      allManufacturers[name] = (allManufacturers[name] || 0) + c
    })
  })

  const topManufacturers = Object.entries(allManufacturers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)

  // Filtrera bort korta koder (som "LWS", "NVN") - behåll bara namn med >3 tecken
  const cleanManufacturers = topManufacturers.filter(([name]) => name.length > 3)

  const summary = {
    total_rows: count,
    top_products: topProducts,
    top_manufacturers: cleanManufacturers.slice(0, 20),
    generated: new Date().toISOString()
  }

  fs.writeFileSync('src/data/device_summary.json', JSON.stringify(summary, null, 2))
  console.log(`\nSparat till src/data/device_summary.json`)
  console.log(`Storlek: ${(fs.statSync('src/data/device_summary.json').size / 1024).toFixed(1)} KB`)

  console.log('\nTopp 10 produkter med namn:')
  topProducts.slice(0, 10).forEach(p => {
    const name = p.brand || p.generic || p.code
    console.log(`  ${p.code}: ${p.count.toLocaleString()} - ${name}`)
  })
})