/**
 * Post-Market Surveillance Dashboard
 * 
 * Hämtar och visualiserar städad DEVICE2024-data direkt från Supabase.
 */
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader, ShieldAlert, Factory } from 'lucide-react'
import PBICard from './PBICard'
import { supabase } from '../lib/supabase'

const PRODUCT_CATEGORY = {

  'DZE': { category: 'Dental Implant, Root-Form', class: '2' },
  'QBJ': { category: 'Continuous Glucose Monitor, Factory Calibrated', class: '2' },
  'QFG': { category: 'ACE-Enabled Insulin Infusion Pump', class: '2' },
  'OZP': { category: 'Automated Insulin Dosing, Single Hormonal Control', class: '3' },
  'BZD': { category: 'Ventilator, Non-Continuous (Respirator)', class: '2' },
  'FRN': { category: 'Infusion Pump, General', class: '2' },
  'FPA': { category: 'IV Administration Set', class: '2' },
  'QLG': { category: 'Continuous Glucose Monitor, Standalone', class: '2' },
  'LGW': { category: 'Spinal Cord Stimulator, Totally Implanted', class: '3' },
  'FTR': { category: 'Silicone Breast Implant', class: '3' },
  'DTB': { category: 'Pacemaker Electrode, Permanent', class: '3' },
  'LWS': { category: 'Implantable Defibrillator, Non-CRT', class: '3' },
  'PQF': { category: 'Glucose Sensor, Invasive, Non-Adjunctive', class: '3' },
  'NVN': { category: 'Drug-Eluting Pacemaker Electrode', class: '3' },
  'CBK': { category: 'Ventilator, Continuous, Facility Use', class: '2' },
  'OZD': { category: 'Temporary Left Heart Support Blood Pump', class: '3' },
  'LZG': { category: 'Insulin Infusion Pump, Patch', class: '2' },
  'OYC': { category: 'Insulin Pump with Invasive Glucose Sensor', class: '3' },
  'MKJ': { category: 'Automated External Defibrillator, Non-Wearable', class: '3' },
  'MGB': { category: 'Vascular Hemostasis Device', class: '3' },
}

export default function Dashboard() {
  const [productData, setProductData] = useState([])
  const [manufacturerData, setManufacturerData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchFromSupabase() {
      setLoading(true)
      setError(null)
      try {
        // HÄMTNING 1: Motsvarar SELECT * FROM product_stats ORDER BY total_reports DESC LIMIT 10;
        const productsHook = await supabase
          .from('product_stats')
          .select('*')
          .order('total_reports', { ascending: false })
          .limit(10)

        // HÄMTNING 2: Motsvarar SELECT * FROM manufacturer_stats ORDER BY count DESC LIMIT 10;
        const manufacturersHook = await supabase
          .from('manufacturer_stats')
          .select('*')
          .order('count', { ascending: false })
          .limit(10)

        if (productsHook.error) throw new Error(productsHook.error.message)
        if (manufacturersHook.error) throw new Error(manufacturersHook.error.message)

        setProductData(productsHook.data)
        setManufacturerData(manufacturersHook.data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchFromSupabase()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center pt-20">
      <Loader className="w-8 h-8 animate-spin text-blue-800" />
      <p className="mt-2 text-gray-600 font-medium">Hämtar städad 2024-data från Supabase...</p>
    </div>
  )

  if (error) return (
    <div className="text-center pt-20 text-red-600 font-semibold">
      <p>Kunde inte hämta data: {error}</p>
    </div>
  )

  // JS-Transformering: Mappa produktkoder till deras riktiga kategorinamn för diagrammet
  const productChartData = productData.map(p => ({
    category: PRODUCT_CATEGORY[p.product_code]?.category || `Kod: ${p.product_code}`,
    reports: p.total_reports,
    brand: p.brand_name || 'Okänt märke'
  }))

  // Formateringshjälp för stora tal (t.ex. 340691 -> 340 691)
  const fmt = (n) => n?.toLocaleString('sv-SE') || '0'

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">PMS Dashboard </h1>
     
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KORT 1: TOPP PRODUKTER */}
        <PBICard title="Topp 10 Rapporterade Medicintekniska Produkter till FDA 2024" subtitle="Sorterat efter flest antal incidentrapporter">
          
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productChartData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10 }} />
                <YAxis dataKey="category" type="category" width={140} tick={{ fontSize: 9 }} />
                {/* Custom Tooltip som visar det populäraste varumärket när man hovrar över stapeln */}
                <Tooltip formatter={(value, name, props) => [fmt(value), `Incidenter (Topp-märke: ${props.payload.brand})`]} />
                <Bar dataKey="reports" fill="#1e40af" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PBICard>

        {/* KORT 2: TOPP TILLVERKARE */}
        <PBICard title="Topp 10 Rapporterade Tillverkare till FDA 2024" subtitle=" ">
         
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={manufacturerData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                {/* Vi roterar texten -45 grader så att tillverkarnas namn inte krockar med varandra */}
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 9 }} interval={0} />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [fmt(value), 'Totalt antal incidenter']} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PBICard>
      </div>
    </div>
  )
}
