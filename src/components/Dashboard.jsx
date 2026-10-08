/**
 * src/components/Dashboard.jsx
 * Post-Market Surveillance Dashboard
 *
 * Fetches cleaned DEVICE2024 data from Supabase and visualizes:
 *   - Most reported product categories (G1)
 *   - Most reported manufacturers (G2)
 *
 * Reads from ranked views so that:
 *   - junk manufacturers are excluded (G2)
 *   - manufacturers use normalized names (S5)
 *   - rank is computed at read time, not stored (G5)
 *
 * Labels say "Number of device entries" — never "rate" (G6).
 */
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader } from 'lucide-react'
import { supabase } from '../../medallion/supabase'

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

export default function Dashboard() {
  const [productData, setProductData] = useState([])
  const [manufacturerData, setManufacturerData] = useState([])
  const [lastRun, setLastRun] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchFromSupabase() {
      setLoading(true)
      setError(null)
      try {
        // G1: product categories, sorted by the displayed column.
        const productsHook = await supabase
          .from('product_stats_ranked')
          .select('product_code, generic_name, total_reports')
          .order('total_reports', { ascending: false })
          .order('product_code', { ascending: true })
          .limit(10)

        // G2 / S5: manufacturers, junk already excluded by the view.
        const manufacturersHook = await supabase
          .from('manufacturer_stats_ranked')
          .select('name, total_reports')
          .order('total_reports', { ascending: false })
          .order('name', { ascending: true })
          .limit(10)

        // OBSERVABILITY: when was the data last refreshed?
        const runHook = await supabase
          .from('pipeline_runs')
          .select('started_at, status, rows_silver')
          .eq('status', 'success')
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (productsHook.error) throw new Error(productsHook.error.message)
        if (manufacturersHook.error) throw new Error(manufacturersHook.error.message)
        if (runHook.error) console.warn('pipeline_runs:', runHook.error.message)

        setProductData(productsHook.data)
        setManufacturerData(manufacturersHook.data)
        if (!runHook.error) setLastRun(runHook.data)
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
        <p className="mt-2 text-gray-600 font-medium">Fetching 2024 data from Supabase…</p>
      </div>
    )

  if (error)
    return (
      <div className="text-center pt-20 text-red-600 font-semibold">
        <p>Could not fetch data: {error}</p>
      </div>
    )

  const fmt = (n) => n?.toLocaleString('sv-SE') || '0'

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">PMS Dashboard</h1>
        {lastRun && (
          <p className="text-sm text-gray-500 mt-1">
            Last run: {new Date(lastRun.started_at).toLocaleString('sv-SE')} ·{' '}
            {fmt(lastRun.rows_silver)} rows in silver
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PBICard title="Most reported medical device product categories to FDA 2024">
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
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
                <Tooltip formatter={(value) => [fmt(value), 'Number of device entries']} />
                <Bar dataKey="total_reports" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PBICard>

        <PBICard title="Most reported manufacturers to FDA 2024">
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={manufacturerData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
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
                <Tooltip formatter={(value) => [fmt(value), 'Number of device entries']} />
                <Bar dataKey="total_reports" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PBICard>
      </div>
    </div>
  )
}