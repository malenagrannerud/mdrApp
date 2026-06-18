import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, Area, ComposedChart
} from 'recharts'
import { Activity, Heart, AlertCircle, AlertTriangle, Loader } from 'lucide-react'
import PBICard from './PBICard'
import deviceSummary from '../data/device_summary.json'

const BASE = '/api/fda/device/event.json'
const COLORS = { Death: '#ef4444', Injury: '#f59e0b', Malfunction: '#3b82f6' }

/**
 * FDA Product Code → Category mapping
 */
const PRODUCT_CATEGORY = {
  'DZE': { category: 'Dental Implant, Root-Form', class: '2' },
  'QBJ': { category: 'Continuous Glucose Monitor', class: '2' },
  'QFG': { category: 'Insulin Infusion Pump', class: '2' },
  'OZP': { category: 'Automated Insulin Dosing System', class: '3' },
  'BZD': { category: 'Ventilator, Non-Continuous', class: '2' },
  'FRN': { category: 'Infusion Pump', class: '2' },
  'FPA': { category: 'IV Administration Set', class: '2' },
  'QLG': { category: 'Continuous Glucose Monitor (Standalone)', class: '2' },
  'LGW': { category: 'Spinal Cord Stimulator, Implanted', class: '3' },
  'FTR': { category: 'Silicone Breast Implant', class: '3' },
}

export default function Dashboard() {
  const [eventData, setEventData] = useState(null)
  const [trendData, setTrendData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      fetch(`${BASE}?count=event_type.exact`).then(r => r.json()),
      fetch(`${BASE}?count=date_received`).then(r => r.json())
    ])
      .then(([eventRes, trendRes]) => {
        setEventData(eventRes)
        setTrendData(trendRes)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
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

  const dq = deviceSummary?.data_quality || {}

  const productData = (deviceSummary?.top_products || []).map(p => ({
    category: PRODUCT_CATEGORY[p.code]?.category || p.code,
    code: p.code,
    count: p.count,
    deviceClass: PRODUCT_CATEGORY[p.code]?.class || '?'
  }))

  const manufacturerData = (deviceSummary?.top_manufacturers || []).map(m => ({
    name: m.name,
    count: m.count
  }))

  return (
    <div className="page-layout">
      <h1>Post-Market Surveillance Dashboard</h1>
      <h2>Reports from the FDA MAUDE Database</h2>

      <p style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginTop: 4 }}>
        Data quality: {fmt(dq.total_rows_kept)} clean rows ({(dq.total_rows_kept/dq.total_rows_input*100).toFixed(1)}% kept)
        | {fmt(dq.removed_duplicate)} duplicates removed
        | {fmt(dq.removed_bad_manufacturer)} invalid manufacturers removed
      </p>

      <div className="grid grid-cols-4 gap-4 mt-6 mb-4">
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
        <PBICard title="20 Most Reported Product Categories 2024" subtitle={`${fmt(deviceSummary?.total_reports_analyzed || 0)} reports analyzed`}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={productData} layout="vertical" margin={{ left: 185 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} />
              <YAxis type="category" dataKey="category" width={175} tick={{ fontSize: 9 }} />
              <Tooltip formatter={(v, _, props) => [fmt(v), `Class ${props.payload.deviceClass}`]} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {productData.map((entry, i) => (
                  <Cell key={i} fill={entry.deviceClass === '3' ? '#ef4444' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </PBICard>

        <PBICard title="20 Most Reported Manufacturers 2024" subtitle={`${fmt(deviceSummary?.total_reports_analyzed || 0)} reports analyzed`}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={manufacturerData} layout="vertical" margin={{ left: 180 }}>
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
          to determine frequency or causality. Data cleaned: {(dq.total_rows_kept/dq.total_rows_input*100).toFixed(1)}% retained.
        </p>
      </div>
    </div>
  )
}