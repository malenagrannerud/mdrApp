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
 * Product code → namn/klass mapping från FDA API.
 * Uppslaget 2024-06-17.
 */
const PRODUCT_INFO = {
  'DZE': { name: 'Dental Implant, Root-Form', class: 'II' },
  'QBJ': { name: 'Continuous Glucose Monitor', class: 'II' },
  'QFG': { name: 'Insulin Infusion Pump', class: 'II' },
  'OZP': { name: 'Automated Insulin Dosing System', class: 'III' },
  'BZD': { name: 'Ventilator, Non-Continuous', class: 'II' },
  'FRN': { name: 'Infusion Pump', class: 'II' },
  'FPA': { name: 'IV Administration Set', class: 'II' },
  'QLG': { name: 'Continuous Glucose Monitor (Standalone)', class: 'II' },
  'LGW': { name: 'Spinal Cord Stimulator', class: 'III' },
  'FTR': { name: 'Silicone Breast Implant', class: 'III' },
}

/**
 * Post-Market Surveillance Dashboard
 * 
 * Visar FDA MAUDE-data + lokalt extraherad device-statistik.
 * 
 * @component
 */
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
  const pct = (part, whole) => whole > 0 ? ((part / whole) * 100).toFixed(1) + '%' : '0.0%'

  const monthly = {}
  trendData?.results?.forEach(({ time, count }) => {
    const m = time.substring(0, 6)
    monthly[m] = (monthly[m] || 0) + count
  })
  const trend = Object.entries(monthly)
    .map(([m, c]) => ({ month: m.substring(4,6)+'/'+m.substring(0,4), reports: c, sort: m }))
    .sort((a, b) => a.sort.localeCompare(b.sort))

  const productData = (deviceSummary?.top_product_codes || [])
    .map(([code, count]) => ({
      name: PRODUCT_INFO[code]?.name || code,
      code,
      count,
      deviceClass: PRODUCT_INFO[code]?.class || '?'
    }))

  const manufacturerData = (deviceSummary?.top_manufacturers || [])
    .map(([name, count]) => ({ name, count }))

  return (
    <div className="page-layout">
      <h1>Post-Market Surveillance Dashboard</h1>
      <h2>FDA MAUDE Database • All reports 1992–2025</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mt-8 mb-4">
        <PBICard title="Total Reports" subtitle="All event types">
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>{fmt(total)}</p>
        </PBICard>
        <PBICard title="Deaths" subtitle={pct(deaths, total)}>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#DC2626', margin: 0 }}>{fmt(deaths)}</p>
        </PBICard>
        <PBICard title="Injuries" subtitle={pct(injuries, total)}>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#D97706', margin: 0 }}>{fmt(injuries)}</p>
        </PBICard>
        <PBICard title="Malfunctions" subtitle={pct(malfunctions, total)}>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#2563EB', margin: 0 }}>{fmt(malfunctions)}</p>
        </PBICard>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <PBICard title="Severity Distribution" subtitle="Breakdown of reported event types">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[{n:'Deaths',v:deaths},{n:'Injuries',v:injuries},{n:'Malfunctions',v:malfunctions}]}
                cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                dataKey="v"
                label={({n,p})=>`${n} ${(p*100).toFixed(1)}%`}
              >
                <Cell fill={COLORS.Death} /><Cell fill={COLORS.Injury} /><Cell fill={COLORS.Malfunction} />
              </Pie>
              <Tooltip formatter={v => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </PBICard>

        <PBICard title="20 Most Reported Product Categories 2024" subtitle={`From ${fmt(deviceSummary?.total_rows || 0)} device records`}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData} layout="vertical" margin={{ left: 160 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v, _, props) => [fmt(v), `${props.payload.code} (Class ${props.payload.deviceClass})`]} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {productData.map((entry, i) => (
                  <Cell key={i} fill={entry.deviceClass === 'III' ? '#ef4444' : entry.deviceClass === 'II' ? '#f59e0b' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </PBICard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <PBICard title="20 Most Reported Manufacturers 2024" subtitle={`From ${fmt(deviceSummary?.total_rows || 0)} device records`}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={manufacturerData} layout="vertical" margin={{ left: 140 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PBICard>

        <PBICard title="Monthly Trend" subtitle="Reports per month across all years">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={Math.floor(trend.length / 12)} />
              <YAxis tickFormatter={fmt} />
              <Tooltip formatter={v => fmt(v)} />
              <Area type="monotone" dataKey="reports" fill="#3b82f620" stroke="#3b82f6" name="Reports" />
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </ComposedChart>
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