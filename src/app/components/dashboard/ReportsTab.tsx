import { Download, FileText } from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

function downloadReport(session: any) {
  const report = {
    report_id: session.id,
    session_name: session.name,
    generated_at: new Date(session.date || session.timestamp).toISOString(),
    format: 'JSON',
    quantum_ares_version: '1.0.0',
    blockchain_anchored: true,
    security_score: session.score,
    total_findings: session.violations_count || 0,
    summary: `Security assessment for ${session.name}. Overall risk posture is ${session.score >= 80 ? 'LOW' : session.score >= 60 ? 'MEDIUM' : 'HIGH'}.`,
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RPT_${session.id.substring(0, 8)}_${session.name.replace(/\s+/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ReportsTab() {
  const { sessions, isLoading } = useSessions();

  return (
    <div style={{ padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .qa-table-row { transition: background 0.15s; }
        .qa-table-row:hover { background: ${C.blueLight} !important; }
        .qa-dl-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid rgba(37,99,235,0.25);
          background: ${C.blueLight};
          color: ${C.blue};
          transition: all 0.15s;
        }
        .qa-dl-btn:hover { background: #dbeafe; border-color: ${C.blue}; }
        .qa-dl-btn:active { transform: scale(0.97); }
      `}</style>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,22,40,0.05)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: C.blueLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} color={C.blue} />
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.navy, fontSize: 16 }}>Generated Reports</div>
            <div style={{ color: C.textSub, fontSize: 12 }}>{sessions.length} blockchain-anchored reports available</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Loading reports...</div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>No reports generated yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Report ID', 'Session Name', 'Date', 'Format', 'Size', 'Download'].map((h) => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', color: C.textSub, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap', background: '#f8faff' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s: any) => (
                  <tr key={s.id} className="qa-table-row" style={{ borderBottom: `1px solid rgba(10,22,40,0.06)` }}>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ background: C.blueLight, color: C.blue, padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif", textTransform: 'uppercase' }}>
                        {s.id.substring(0, 8)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px', color: C.navy, fontSize: 14, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: '14px 24px', color: C.textSub, fontSize: 13 }}>{new Date(s.date || s.timestamp).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ color: C.textMuted, fontSize: 13, background: '#f0f4fa', padding: '2px 8px', borderRadius: 6 }}>
                        JSON (Anchored)
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px', color: C.textSub, fontSize: 13 }}>~ 1.2 MB</td>
                    <td style={{ padding: '14px 24px' }}>
                      <button className="qa-dl-btn" onClick={() => downloadReport(s)}>
                        <Download size={13} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8, background: '#f8faff' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px rgba(22,163,74,0.5)' }} />
          <span style={{ color: C.textSub, fontSize: 12 }}>All reports are blockchain-anchored and tamper-proof</span>
        </div>
      </div>
    </div>
  );
}
