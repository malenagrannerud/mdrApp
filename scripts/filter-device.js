/**
 * filter-device.js
 * 
 * Filtrerar DEVICE2024.txt och extraherar aggregerad statistik
 * till en liten JSON-fil för dashboarden.
 * 
 * Input: src/data/DEVICE2024.txt (600MB)
 * Output: src/data/device_summary.json (några KB)
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

const byManufacturer = {}
const byProductCode = {}

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
  const manufacturer = (f[idx('MANUFACTURER_D_NAME')] || '').trim()

  if (productCode) {
    byProductCode[productCode] = (byProductCode[productCode] || 0) + 1
  }

  if (manufacturer && manufacturer.length > 0) {
    byManufacturer[manufacturer] = (byManufacturer[manufacturer] || 0) + 1
  }

  count++
})

rl.on('close', () => {
  console.log(`Klart! ${count.toLocaleString()} rader`)

  const topProducts = Object.entries(byProductCode)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)

  const topManufacturers = Object.entries(byManufacturer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)

  const summary = {
    total_rows: count,
    top_product_codes: topProducts,
    top_manufacturers: topManufacturers,
    generated: new Date().toISOString()
  }

  fs.writeFileSync('src/data/device_summary.json', JSON.stringify(summary, null, 2))
  console.log(`\nSparat till src/data/device_summary.json`)
  console.log(`Storlek: ${(fs.statSync('src/data/device_summary.json').size / 1024).toFixed(1)} KB`)

  console.log('\nTopp 10 produktkoder:')
  topProducts.slice(0, 10).forEach(([code, n]) => console.log(`  ${code}: ${n.toLocaleString()}`))
})