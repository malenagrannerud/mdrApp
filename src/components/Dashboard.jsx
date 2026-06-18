/**
 * Post-Market Surveillance Dashboard
 * 
 * Visualiserar FDA MAUDE adverse event-data för medicintekniska produkter.
 * 
 * DATAKÄLLOR:
 * 1. openFDA API (via Vite-proxy) - KPI:er, cirkeldiagram, trend
 * 2. Supabase (product_stats + manufacturer_stats) - produkter, tillverkare
 * 
 * LAYOUT (Power BI-stil):
 * Rad 1: 4 KPI-kort (Total, Deaths, Injuries, Malfunctions) 1992-2025
 * Rad 2: Cirkeldiagram + Trendlinje
 * Rad 3: Produktkategorier 2024 + Tillverkare 2024
 * 
 * @component
 */
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, Area, ComposedChart
} from 'recharts'
import { Activity, Heart, AlertCircle, AlertTriangle, Loader } from 'lucide-react'
import PBICard from './PBICard'
import { supabase } from '../lib/supabase'

const BASE = '/api/fda/device/event.json'
const COLORS = { Death: '#ef4444', Injury: '#f59e0b', Malfunction: '#3b82f6' }

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
  const [eventData, setEventData] = useState(null)
  const [trendData, setTrendData] = useState(null)
  const [productData, setProductData] = useState(null)
  const [manufacturerData, setManufacturerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        const [eventRes, trendRes, sbRes, mfrRes] = await Promise.all([
          fetch(`${BASE}?count=event_type.exact`).then(r => r.json()),
          fetch(`${BASE}?count=date_received`).then(r => r.json()),
          supabase.from('product_stats').select('*').order('total_reports', { ascending: false }),
          supabase.from('manufacturer_stats').select('*').order('count', { ascending: false })
        ])
        if (sbRes.error) throw new Error(sbRes.error.message)
        if (mfrRes.error) throw new Error(mfrRes.error.message)
        setEventData(eventRes)
        setTrendData(trendRes)
        setProductData(sbRes.data)
        setManufacturerData(mfrRes.data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return (
    <div className="page-layout text-center">
      <Loader className="w-8 h-8 animate-spin mx-auto" style={{color: '#1e40af'}} />
      <p>Loading MAUDE data from FDA...</p>
    </div>
  )

  if (error) return (
    <div className="page-layout text-center">
      <p style={{color: '#DC2626'}}>Failed to load data: {error}</p>
    </div>
  )

  const results = eventData?.results || []
  const find = (t) => results.find(r => r.term === t)?.count || 0
  const total = results.reduce((s, r) => s + r.count, 0)
  const deaths = find('Death')
  const injuries = find('Injury')
  const malfunctions = find('Malfunction')

  const fmt = (n) => n?.toLocaleString('en-US') || '0'
  const pct = (part, whole) => {
    if (!whole || whole === 0 || !part) return '0.0%'
    return ((part / whole) * 100).toFixed(1) + '%'
  }

  const monthly = {}
  trendData?.results?.forEach(({ time, count }) => {
    const m = time.substring(0, 6)
    monthly[m] = (monthly[m] || 0) + count
  })
  const trend = Object.entries(monthly)
    .map(([m, c]) => ({ month: m.substring(4,6)+'/'+m.substring(0,4), reports: c, sort: m }))
    .sort((a, b) => a.sort.localeCompare(b.sort))

  const productChartData = (productData || []).map(p => ({
    category: PRODUCT_CATEGORY[p.product_code]?.category || p.product_code,
    code: p.product_code,
    count: p.total_reports,
    deviceClass: PRODUCT_CATEGORY[p.product_code]?.class || '?'
  }))

  const manufacturerChartData = (manufacturerData || []).map(m => ({
    name: m.name,
    count: m.count
  }))

  return (
    <div className="page-layout">
      <h1>Post-Market Surveillance Dashboard</h1>
      <h2>Reports from the FDA MAUDE Database</h2>

      <div className="grid grid-cols-4 gap-4 mt-8 mb-4">
        <PBICard title="Total Reports" subtitle="1992–2025">
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>{fmt(total)}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0 0' }}>All event types</p>
        </PBICard>
        <PBICard title="Reported Deaths" subtitle="1992–2025">
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#DC2626', margin: 0 }}>{fmt(deaths)}</p>
          <p style={{ fontSize: 11, color: '#DC2626', margin: '2px 0 0 0' }}>{pct(deaths, total)} of total</p>
        </PBICard>
        <PBICard title="Reported Injuries" subtitle="1992–2025">
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#D97706', margin: 0 }}>{fmt(injuries)}</p>
          <p style={{ fontSize: 11, color: '#D97706', margin: '2px 0 0 0' }}>{pct(injuries, total)} of total</p>
        </PBICard>
        <PBICard title="Reported Malfunctions" subtitle="1992–2025">
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#2563EB', margin: 0 }}>{fmt(malfunctions)}</p>
          <p style={{ fontSize: 11, color: '#2563EB', margin: '2px 0 0 0' }}>{pct(malfunctions, total)} of total</p>
        </PBICard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <PBICard title="Severity Distribution 1992–2025" subtitle="Breakdown of reported event types">
          {total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[{n:'Deaths',v:deaths},{n:'Injuries',v:injuries},{n:'Malfunctions',v:malfunctions}]}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  dataKey="v"
                  label={({n,v}) => `${n} ${pct(v, total)}`}
                >
                  <Cell fill={COLORS.Death} /><Cell fill={COLORS.Injury} /><Cell fill={COLORS.Malfunction} />
                </Pie>
                <Tooltip formatter={(v) => [fmt(v), pct(v, total)]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{textAlign:'center', padding: 40}}>No data available</p>
          )}
        </PBICard>

        <PBICard title="Monthly Trend 1992–2025" subtitle="Reports per month across all years">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} interval={Math.floor(trend.length / 6)} />
              <YAxis tickFormatter={fmt} />
              <Tooltip formatter={v => fmt(v)} />
              <Area type="monotone" dataKey="reports" fill="#3b82f620" stroke="#3b82f6" name="Reports" />
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </PBICard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <PBICard title="20 Most Reported Product Categories 2024" subtitle="Data from Supabase">
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={productChartData} layout="vertical" margin={{ left: 185 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} />
              <YAxis type="category" dataKey="category" width={175} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v, _, props) => [fmt(v), `Class ${props.payload.deviceClass}`]} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {productChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.deviceClass === '3' ? '#ef4444' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </PBICard>

        <PBICard title="20 Most Reported Manufacturers 2024" subtitle="Data from Supabase">
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={manufacturerChartData} layout="vertical" margin={{ left: 180 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} />
              <YAxis type="category" dataKey="name" width={175} tick={{ fontSize: 9 }} />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PBICard>
      </div>

      <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', padding: '16px', color: '#92400E' }}>
        <p>
          <strong>Important:</strong> MAUDE data reflects reported events and cannot be used
          to determine frequency or causality.
        </p>
      </div>
    </div>
  )
}