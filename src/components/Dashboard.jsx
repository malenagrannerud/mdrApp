/**
 * Post-Market Surveillance Dashboard
 * 
 * Hämtar och visualiserar städad DEVICE2024-data från Supabase.
 * 
 * 
 */
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader, ShieldAlert, Factory } from 'lucide-react'
import PBICard from './PBICard'
import { supabase } from '../lib/supabase'


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
        // Reads product stats from Supabase, ordered by total_reports descending, limited to top 10
        const productsHook = await supabase
          .from('product_stats')
          .select('*')
          .order('total_reports', { ascending: false })
          .limit(10)

        // Reads manufacturer stats from Supabase, ordered by count descending, limited to top 10
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
  category: p.brand_name || p.generic_name || `Kod: ${p.product_code}`,    reports: p.total_reports,
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
        <PBICard title="Topp 10 Rapporterade Medicintekniska Produkter till FDA 2024" subtitle=" ">
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
