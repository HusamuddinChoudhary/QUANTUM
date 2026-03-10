import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { useGraphContext } from '../../hooks/useGraphContext';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

function getQviColor(qvi: number) {
  if (qvi >= 80) return 'var(--c-danger)';
  if (qvi >= 60) return 'var(--c-warning)';
  return '#ca8a04';
}

function getPriorityColor(p: string) {
  if (p?.includes('CRITICAL') || p?.includes('Critical')) return { bg: 'rgba(220,38,38,0.10)', color: '#dc2626' };
  return { bg: 'rgba(217,119,6,0.10)', color: '#d97706' };
}

export function QuantumPanel() {
  const { scores, qviDetails } = useGraphContext();

  const baseRisk = scores.quantumVuln;
  const chartData = [
    { year: '2024', current: Math.max(5, baseRisk - 60), migration: 8 },
    { year: '2025', current: Math.max(10, baseRisk - 50), migration: 8 },
    { year: '2026', current: Math.max(15, baseRisk - 40), migration: 7 },
    { year: '2027', current: Math.max(25, baseRisk - 30), migration: 7 },
    { year: '2028', current: Math.max(40, baseRisk - 15), migration: 6 },
    { year: '2029', current: Math.max(60, baseRisk), migration: 6 },
    { year: '2030', current: Math.min(100, baseRisk + 15), migration: 5 },
    { year: '2031', current: Math.min(100, baseRisk + 25), migration: 5 },
    { year: '2032', current: Math.min(100, baseRisk + 30), migration: 4 },
    { year: '2033', current: Math.min(100, baseRisk + 35), migration: 4 },
    { year: '2034', current: Math.min(100, baseRisk + 40), migration: 4 },
    { year: '2035', current: 100, migration: 3 },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 6 }}>
          Harvest-Now-Decrypt-Later (HNDL) Risk Timeline
        </div>
        <p style={{ color: C.textSub, fontSize: 13 }}>
          Cryptographic risk exposure as quantum computing approaches practical capability by 2029.
        </p>
      </div>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: '24px', marginBottom: 28, boxShadow: '0 2px 8px rgba(10,22,40,0.05)', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="currentRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="migrationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            < CartesianGrid strokeDasharray="3 3" stroke="rgba(10,22,40,0.07)" />
            <XAxis dataKey="year" tick={{ fill: C.textSub, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.textSub, fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: '#ffffff', border: `1px solid ${C.border}`, borderRadius: 8, color: C.navy }}
              formatter={(val, name) => [`${val}`, name === 'current' ? 'Current Crypto Risk' : 'Post-Quantum Migration']}
            />
            <Legend
              formatter={(val) => val === 'current' ? 'Current Cryptography Risk' : 'Post-Quantum Migration'}
              wrapperStyle={{ color: C.textMuted, fontSize: 12 }}
            />
            <ReferenceLine y={60} stroke="#d97706" strokeDasharray="5 5" label={{ value: 'Harvest Window', fill: '#d97706', fontSize: 11, position: 'insideTopRight' }} />
            <ReferenceLine x="2029" stroke="#dc2626" strokeDasharray="6 3" label={{ value: 'Quantum Threat Horizon', fill: '#dc2626', fontSize: 11, position: 'insideTopLeft' }} />
            <Area type="monotone" dataKey="current" stroke="#dc2626" strokeWidth={2} fill="url(#currentRisk)" name="current" />
            <Area type="monotone" dataKey="migration" stroke="#16a34a" strokeWidth={2} fill="url(#migrationGrad)" name="migration" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,22,40,0.05)' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: '#f8faff' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.navy, fontSize: 15 }}>
            Quantum Vulnerability Index by Node
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Node', 'Algorithm', 'QVI Score', 'Migration Recommendation', 'Priority'].map((h) => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', color: C.textSub, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap', background: '#f8faff' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qviDetails.map((n: any, idx: number) => {
                const pri = getPriorityColor(n.priority);
                return (
                  <tr key={idx} style={{ borderBottom: `1px solid rgba(10,22,40,0.06)` }}>
                    <td style={{ padding: '12px 20px', color: C.navy, fontSize: 14, fontWeight: 600 }}>{n.node}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ color: '#d97706', fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700 }}>{n.algo}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 10, background: `${getQviColor(n.qvi)}18`, color: getQviColor(n.qvi), fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
                        {n.qvi}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', color: C.textMuted, fontSize: 13 }}>{n.rec}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: 10, background: pri.bg, color: pri.color, fontSize: 11, fontWeight: 700 }}>
                        {n.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {qviDetails.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>No quantum vulnerability details available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
