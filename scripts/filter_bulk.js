/**
 * filter_bulk.js
 * 
 * Rensar och aggregerar produkt- och tillverkardata från src/data/DEVICE2024.txt
 * och laddar upp i snabba bulk-batcher till Supabase med Service Role-rättigheter.
 */

import fs from 'fs'
import readline from 'readline'
import 'dotenv/config' // <--- Laddar dina hemliga nycklar från .env-filen automatiskt!

console.log('🚀 Startar inläsning och städning av src/data/DEVICE2024.txt...')

const rl = readline.createInterface({
  input: fs.createReadStream('src/data/DEVICE2024.txt'), 
  crlfDelay: Infinity
})

let count = 0, kept = 0, removedNoProductCode = 0, removedBadManufacturer = 0, removedDuplicate = 0

let colIdx = { reportKey: -1, productCode: -1, brandName: -1, genericName: -1, manufacturerRaw: -1 }
const seenKeys = new Set()
const productInfo = {}

function normalizeManufacturer(name) {
  if (!name) return ''
  return name.replace(/,/g, ' ').replace(/\./g, '').replace(/\s+/g, ' ').trim()
    .replace(/\s(inc|llc|ltd|co|corp|corporation|as|ag|gmbh|sa|ab)$/i, '').replace(/\s+/g, ' ').trim()
}

function mergeKnownDuplicates(name) {
  const nameUpper = name.toUpperCase()
  const merges = {
    'NOBEL BIOCARE GÖTEBORG': 'NOBEL BIOCARE',
    'MEDTRONIC MINIMED': 'MEDTRONIC',
    'MEDTRONIC PUERTO RICO OPERATIONS': 'MEDTRONIC',
    'AIZU OLYMPUS': 'OLYMPUS',
    'SHIRAKAWA OLYMPUS': 'OLYMPUS',
  }
  return merges[nameUpper] || name
}

function isInvalidValue(name) {
  if (!name) return true
  const invalid = ['NI', 'UNK', '*', 'N/A', 'NA', 'UNKNOWN', 'NO INFORMATION', '?', 'NONE']
  return invalid.includes(name.toUpperCase().trim()) || name.trim().length < 2
}

rl.on('line', (line) => {
  if (count === 0) {
    const headers = line.split('|').map(h => h.trim())
    colIdx.reportKey = headers.indexOf('MDR_REPORT_KEY')
    colIdx.productCode = headers.indexOf('DEVICE_REPORT_PRODUCT_CODE')
    colIdx.brandName = headers.indexOf('BRAND_NAME')
    colIdx.genericName = headers.indexOf('GENERIC_NAME')
    colIdx.manufacturerRaw = headers.indexOf('MANUFACTURER_D_NAME')
    count++
    return
  }

  if (count % 500000 === 0) console.log(`  ⏳ Bearbetat ${count.toLocaleString()} rader...`)

  const f = line.split('|')
  const reportKey = (f[colIdx.reportKey] || '').trim()
  const productCode = (f[colIdx.productCode] || '').trim()
  const brandName = (f[colIdx.brandName] || '').trim()
  const genericName = (f[colIdx.genericName] || '').trim()
  const manufacturerRaw = (f[colIdx.manufacturerRaw] || '').trim()

  if (!productCode) { removedNoProductCode++; count++; return }
  if (isInvalidValue(manufacturerRaw)) { removedBadManufacturer++; count++; return }
  if (seenKeys.has(reportKey)) { removedDuplicate++; count++; return }

  seenKeys.add(reportKey)
  const manufacturer = mergeKnownDuplicates(normalizeManufacturer(manufacturerRaw))
  kept++

  if (!productInfo[productCode]) {
    productInfo[productCode] = { count: 0, brands: {}, generics: {}, manufacturers: {} }
  }
  productInfo[productCode].count++

  if (!isInvalidValue(brandName)) {
    const b = brandName.toUpperCase().replace(/\s+/g, ' ').trim()
    productInfo[productCode].brands[b] = (productInfo[productCode].brands[b] || 0) + 1
  }
  if (!isInvalidValue(genericName)) {
    const g = genericName.toUpperCase().replace(/\s+/g, ' ').trim()
    productInfo[productCode].generics[g] = (productInfo[productCode].generics[g] || 0) + 1
  }
  if (manufacturer) {
    productInfo[productCode].manufacturers[manufacturer] = (productInfo[productCode].manufacturers[manufacturer] || 0) + 1
  }
  count++
})

rl.on('close', async () => {
  console.log(`\n=== 📊 Datakvalitetsrapport ===`)
  console.log(`  Totalt bearbetade rader: ${count.toLocaleString()}`)
  console.log(`  Behållna unika rader:   ${kept.toLocaleString()} (${((kept / count) * 100).toFixed(1)}%)`)

  const { createClient } = await import('@supabase/supabase-js')
  
  // Kontrollera att miljövariabeln faktiskt hittades
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Fel: SUPABASE_SERVICE_ROLE_KEY saknas i din .env-fil!');
    process.exit(1);
  }

  // Initiera klienten säkert med ADMIN-nyckeln från din .env
  const supabase = createClient(
    'https://kgoxvplsaceqdvorqsle.supabase.co', 
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Läses säkert in här!
    {
      auth: { persistSession: false },
      global: { fetch: (...args) => fetch(...args) }
    }
  )

  console.log('\n📦 Transformerar produktdata...')
  const allProducts = Object.entries(productInfo).map(([code, info]) => {
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


  console.log('📦 Transformerar tillverkardata...')
  const manufacturerMap = {}
  Object.values(productInfo).forEach(info => {
    Object.entries(info.manufacturers).forEach(([name, c]) => {
      manufacturerMap[name] = (manufacturerMap[name] || 0) + c
    })
  })
  const allManufacturers = Object.entries(manufacturerMap).map(([name, count]) => ({ name, count }))

  const BATCH_SIZE = 1000

  async function uploadInBatches(tableName, dataArray, onConflictKey) {
    console.log(`\n📤 Startar bulk-upload för [${tableName}] (${dataArray.length.toLocaleString()} rader)...`)
    for (let i = 0; i < dataArray.length; i += BATCH_SIZE) {
      const batch = dataArray.slice(i, i + BATCH_SIZE)
      const { error } = await supabase.from(tableName).upsert(batch, { onConflict: onConflictKey })

      if (error) {
        console.error(`  ❌ Fel i batch ${i / BATCH_SIZE + 1}:`, error.message)
      } else {
        console.log(`  ✅ [${tableName}] Skickat ${Math.min(i + BATCH_SIZE, dataArray.length).toLocaleString()} rader.`)
      }
    }
  }

  await uploadInBatches('product_stats', allProducts, 'product_code')
  await uploadInBatches('manufacturer_stats', allManufacturers, 'name')

  console.log('\n🎉 ALL DATA STÄDAD OCH UPPLADDAD TILL SUPABASE!')
})
