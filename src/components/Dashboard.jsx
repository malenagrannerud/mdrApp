/**
 * src/components/Dashboard.jsx
 * Post-Market Surveillance Dashboard
 *
 * Hämtar och visualiserar städad DEVICE2024-data från Supabase.
 * 
 */
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader } from 'lucide-react'
import { supabase } from '../../medallion/supabase'

/* ------------------------------------------------------------------ */
/*  PBICard – Power BI-inspirerat kort                                 */
/* ------------------------------------------------------------------ */
function PBICard({ children, title, subtitle, className = '' }) {
  return (
    <div
      className={`bg-white ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {title && (
        <div
          style={{
            padding: '10px 16px 8px 16px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
          }}
        >
          <h4 style={{ margin: 0 }}>{title}</h4>
          {subtitle && <p style={{ margin: '2px 0 0 0' }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ padding: '16px', flex: 1 }}>{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */
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
        const productsHook = await supabase
          .from('product_stats')
          .select('*')
          .order('total_reports', { ascending: false })
          .limit(10)

        const manufacturersHook = await supabase
          .from('manufacturer_stats')
          .select('*')
          .order('total_reports', { ascending: false })
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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <Loader className="w-8 h-8 animate-spin text-blue-800" />
        <p className="mt-2 text-gray-600 font-medium">Fetches 2024-data from Supabase...</p>
      </div>
    )

  if (error)
    return (
      <div className="text-center pt-20 text-red-600 font-semibold">
        <p>Could not fetch data: {error}</p>
      </div>
    )

  // Formateringshjälp för stora tal (t.ex. 340691 -> 340 691)
  const fmt = (n) => n?.toLocaleString('sv-SE') || '0'




  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">PMS Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


       <PBICard title="Most reported medical device product categorys to FDA 2024">
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productData}
                margin={{ top: 10, right: 10, left: 10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="generic_name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 9 }}
                  interval={0}
                />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [fmt(value), 'Number of reports']} />
                <Bar dataKey="total_reports" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PBICard>

      

        <PBICard title="Most reported manufacturers to FDA 2024">
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={manufacturerData}
                margin={{ top: 10, right: 10, left: 10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 9 }}
                  interval={0}
                />
                <YAxis tickFormatter={fmt} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [fmt(value), 'Number of reports']} />
                <Bar dataKey="total_reports" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PBICard>

      </div>
    </div>
  )
}