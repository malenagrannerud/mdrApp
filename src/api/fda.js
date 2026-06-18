/**
 * openFDA MAUDE API - klient som hämtar medicinsk device adverse event data.
 * 
 * API-dokumentation: https://open.fda.gov/apis/device/event/
 * 
 * MAUDE (Manufacturer and User Facility Device Experience) är FDAs databas
 * över rapporterade biverkningar, felfunktioner och dödsfall kopplade till
 * medicinska produkter.
 * 
 * 
 * 
 * @module api/fda
 */

/** Proxad bas-URL via Vite för att undvika CORS/403 från webbläsare */
const BASE_URL = '/api/fda/device/event.json'

/**
 * Hämtar fördelning av eventtyper från hela MAUDE-databasen.
 * 
 * Eventtyper:
 * - "Death" - Dödsfall där device kan ha varit bidragande orsak
 * - "Injury" - Allvarlig skada kopplad till device
 * - "Malfunction" - Device felfunktion som kunde lett till död/skada
 * 
 * Använder count-endpoint som aggregerar hela databasen.
 * 
 * @returns {Promise<Object>} API-respons med results [{term, count}, ...]
 */
export async function getEventTypeBreakdown() {
  const url = `${BASE_URL}?count=event_type.exact`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`FDA API error: ${res.status}`)
  return res.json()
}

/**
 * Hämtar topp 10 medicinska specialiteter med flest rapporter.
 * 
 * Medicinska specialiteter är FDAs klassificering av vilket
 * medicinskt område en produkt tillhör, t.ex:
 * - "Cardiovascular" - Hjärta/kärl
 * - "Orthopedic" - Ortopedi
 * 
 * @returns {Promise<Object>} API-respons med results [{term, count}, ...]
 */
export async function getTopProductCategories() {
  const url = `${BASE_URL}?count=openfda.medical_specialty_description.exact&limit=10`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`FDA API error: ${res.status}`)
  return res.json()
}

/**
 * Hämtar datumfördelning för trendanalys.
 * 
 * Returnerar dagliga counts (YYYYMMDD) för hela databasen.
 * Gruppera på month = time.substring(0,6) för månadsvy.
 * 
 * @returns {Promise<Object>} API-respons med results [{time, count}, ...]
 */
export async function getMonthlyTrend() {
  const url = `${BASE_URL}?count=date_received&limit=1000`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`FDA API error: ${res.status}`)
  return res.json()
}