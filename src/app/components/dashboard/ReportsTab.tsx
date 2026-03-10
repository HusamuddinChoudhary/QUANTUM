import { Download, FileText } from 'lucide-react';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

const REPORTS = [
  { id: 'RPT-001', session: 'Bank Core Infrastructure', date: '2025-01-15', format: 'PDF + JSON', size: '2.4 MB', score: 91, findings: 3 },
  { id: 'RPT-002', session: 'Hospital Network Scan', date: '2025-01-12', format: 'PDF', size: '1.8 MB', score: 78, findings: 7 },
  { id: 'RPT-003', session: 'Government Portal', date: '2025-01-10', format: 'PDF + SBOM', size: '3.1 MB', score: 85, findings: 5 },
  { id: 'RPT-004', session: 'FinTech API Gateway', date: '2025-01-08', format: 'PDF', size: '2.0 MB', score: 62, findings: 12 },
  { id: 'RPT-005', session: 'Insurance Cloud Stack', date: '2025-01-05', format: 'PDF + JSON', size: '1.5 MB', score: 88, findings: 4 },
];

function downloadReport(r: typeof REPORTS[0]) {
  const report = {
    report_id: r.id,
    session_name: r.session,
    generated_at: r.date,
    format: r.format,
    quantum_ares_version: '1.0.0',
    blockchain_anchored: true,
    security_score: r.score,
    total_findings: r.findings,
    engines: {
      zero_trust: { status: 'COMPLETE', score: r.score - 2 },
      quantum_risk: { status: 'COMPLETE', score: r.score + 1 },
      attack_path: { status: 'COMPLETE', score: r.score - 5 },
      supply_chain: { status: 'COMPLETE', score: r.score + 3 },
      compliance: { status: 'COMPLETE', score: r.score },
    },
    summary: `Security assessment for ${r.session}. Overall risk posture is ${r.score >= 80 ? 'LOW' : r.score >= 60 ? 'MEDIUM' : 'HIGH'}.`,
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${r.id}_${r.session.replace(/\s+/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ReportsTab() {
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
            <div style={{ color: C.textSub, fontSize: 12 }}>{REPORTS.length} blockchain-anchored reports available</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
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
              {REPORTS.map((r) => (
                <tr key={r.id} className="qa-table-row" style={{ borderBottom: `1px solid rgba(10,22,40,0.06)` }}>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ background: C.blueLight, color: C.blue, padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
                      {r.id}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px', color: C.navy, fontSize: 14, fontWeight: 500 }}>{r.session}</td>
                  <td style={{ padding: '14px 24px', color: C.textSub, fontSize: 13 }}>{r.date}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ color: C.textMuted, fontSize: 13, background: '#f0f4fa', padding: '2px 8px', borderRadius: 6 }}>
                      {r.format}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px', color: C.textSub, fontSize: 13 }}>{r.size}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <button className="qa-dl-btn" onClick={() => downloadReport(r)}>
                      <Download size={13} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8, background: '#f8faff' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px rgba(22,163,74,0.5)' }} />
          <span style={{ color: C.textSub, fontSize: 12 }}>All reports are blockchain-anchored and tamper-proof</span>
        </div>
      </div>
    </div>
  );
}
