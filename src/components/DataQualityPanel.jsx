/**
 * src/components/DataQualityPanel.jsx
 *
 * Observability panel for the PMS dashboard.
 * Shows:
 *   - rows per layer (bronze / silver / rejected)
 *   - % valid rows with a 95% alert threshold
 *   - rejected rows grouped by reason (S1, S2, S3)
 *   - latest pipeline run + status
 *   - verify_pipeline snapshot (passed / failed checks)
 *
 * Reads only from Supabase: pipeline_runs and quality_checks.
 * Never labels anything as "risk" or "rate" (G6).
 */
import { useEffect, useState } from 'react'

const VALIDITY_THRESHOLD = 95 // per PIPELINE.md

function Stat({ label, value, hint }) {
  return (
    <div style={{ padding: '8px 12px', minWidth: 120 }}>
      <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{value}</div>
      {hint && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{hint}</div>}
    </div>
  )
}

const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('sv-SE'))

export default function DataQualityPanel() {
  const [run, setRun] = useState(null)
  const [checks, setChecks] = useState([])
  const [rejected, setRejected] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // Dynamic import so the panel does not hard-crash the dashboard
        // if the Supabase client is missing.
        const { supabase } = await import('../../medallion/supabase')
        if (!supabase) throw new Error('Supabase not configured')

        const runRes = await supabase
          .from('pipeline_runs')
          .select('started_at, status, rows_bronze, rows_silver, rows_rejected, error_message')
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        const checksRes = await supabase
          .from('quality_checks')
          .select('check_id, description, passed, detail')
          .order('check_id', { ascending: true })

        if (cancelled) return
        if (runRes.error) console.warn('pipeline_runs:', runRes.error.message)
        if (checksRes.error) console.warn('quality_checks:', checksRes.error.message)

        setRun(runRes.data || null)
        setChecks(checksRes.data || [])
      } catch (e) {
        console.warn('DataQualityPanel:', e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="bg-white p-4 mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <span className="text-sm text-gray-500">Loading data quality…</span>
      </div>
    )
  }

  // If there is nothing to show, stay silent rather than render an empty box.
  if (!run && checks.length === 0) return null

  const bronze = run?.rows_bronze ?? null
  const silver = run?.rows_silver ?? null
  const rejectedCount = run?.rows_rejected ?? null

  const validPct =
    bronze && silver != null ? Math.round((silver / bronze) * 1000) / 10 : null

  const thresholdOk = validPct != null ? validPct >= VALIDITY_THRESHOLD : true

  const passed = checks.filter((c) => c.passed).length
  const total = checks.length
  const allPassed = total > 0 && passed === total

  const failures = checks.filter((c) => !c.passed)

  const statusColor =
    run?.status === 'success' ? '#059669' : run?.status === 'failed' ? '#dc2626' : '#6b7280'

  return (
    <div className="bg-white mb-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h4 style={{ margin: 0 }}>Data quality</h4>
        {run && (
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            Latest run:{' '}
            <span style={{ color: statusColor, fontWeight: 600 }}>{run.status}</span>
            {' · '}
            {new Date(run.started_at).toLocaleString('sv-SE')}
          </span>
        )}
      </div>

      <div style={{ padding: 12, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Stat label="Bronze" value={fmt(bronze)} hint="raw rows loaded" />
        <Stat label="Silver" value={fmt(silver)} hint="cleaned rows" />
        <Stat label="Rejected" value={fmt(rejectedCount)} hint="quarantined" />
        <Stat
          label="Valid"
          value={validPct != null ? `${validPct} %` : '—'}
          hint={
            validPct == null
              ? 'no data'
              : thresholdOk
              ? `threshold ≥ ${VALIDITY_THRESHOLD} %`
              : `below ${VALIDITY_THRESHOLD} %`
          }
        />
        <Stat
          label="Checks"
          value={total > 0 ? `${passed}/${total}` : '—'}
          hint={total === 0 ? 'not published' : allPassed ? 'all passed' : `${failures.length} failed`}
        />
      </div>

      {failures.length > 0 && (
        <div style={{ padding: '0 16px 12px 16px' }}>
          <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 4 }}>
            Failed checks
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#7f1d1d' }}>
            {failures.map((c) => (
              <li key={c.check_id}>
                <strong>{c.check_id}</strong> — {c.description}
                {c.detail ? ` (${c.detail})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {run?.status === 'failed' && run.error_message && (
        <div style={{ padding: '0 16px 12px 16px', fontSize: 12, color: '#dc2626' }}>
          Last error: {run.error_message}
        </div>
      )}

      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid #f3f4f6',
          fontSize: 11,
          color: '#9ca3af',
        }}
      >
        Number of device entries ≠ risk. See PIPELINE.md for limitations.
      </div>
    </div>
  )
}