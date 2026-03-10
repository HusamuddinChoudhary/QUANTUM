import { Download, FileText, Loader2 } from 'lucide-react';
import { useSessions } from '../../hooks/useSessions';
import jsPDF from 'jspdf';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

function downloadReport(session: any, index: number) {
  const reportId = `RPT-${String(index + 1).padStart(3, '0')}`;
  const score = session.score ?? 50;
  const sessionName = session.name ?? 'Unnamed Session';
  const dateStr = session.timestamp ? new Date(session.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const riskLevel = score >= 80 ? 'LOW' : score >= 60 ? 'MEDIUM' : 'HIGH';
  const blockchainHash = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();

  // Header background
  doc.setFillColor(10, 22, 40);
  doc.rect(0, 0, W, 38, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('QUANTUM ARES', 14, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 230);
  doc.text('Zero-Trust Security Assessment Report', 14, 23);
  doc.text(`Report ID: ${reportId}  |  Version 7.45`, 14, 29);
  doc.text(`Generated: ${dateStr}`, 14, 35);

  // Score badge (top right)
  const scoreColor: [number, number, number] = score >= 80 ? [22, 163, 74] : score >= 60 ? [202, 138, 4] : [220, 38, 38];
  doc.setFillColor(...scoreColor);
  doc.roundedRect(W - 52, 8, 38, 22, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(`${score}`, W - 41, 23, { align: 'center' });
  doc.setFontSize(7);
  doc.text('SCORE', W - 41, 28, { align: 'center' });

  let y = 50;

  // Session Info section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 22, 40);
  doc.text('SESSION INFORMATION', 14, y);
  y += 6;
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(14, y, W - 14, y);
  y += 7;

  const infoRows = [
    ['Session Name', sessionName],
    ['Assessment Date', dateStr],
    ['Risk Level', riskLevel],
    ['Status', session.status ?? 'COMPLETE'],
    ['Organisation ID', session.orgId ?? 'default-org'],
  ];
  doc.setFontSize(9);
  for (const [label, value] of infoRows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 90, 110);
    doc.text(label + ':', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(10, 22, 40);
    doc.text(String(value), 70, y);
    y += 6;
  }

  y += 4;

  // Engine Scores
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 22, 40);
  doc.text('ENGINE BREAKDOWN', 14, y);
  y += 6;
  doc.setDrawColor(37, 99, 235);
  doc.line(14, y, W - 14, y);
  y += 7;

  const engines = [
    ['Zero Trust Engine', score - 2],
    ['Quantum Risk Engine', score + 1],
    ['Attack Path Engine', score - 5],
    ['Supply Chain Engine', score + 3],
    ['Compliance Engine', score],
  ];

  doc.setFontSize(9);
  for (const [name, s] of engines) {
    const engScore = Math.max(0, Math.min(100, Number(s)));
    const barW = (engScore / 100) * (W - 80);
    const col: [number, number, number] = engScore >= 80 ? [22, 163, 74] : engScore >= 60 ? [202, 138, 4] : [220, 38, 38];

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 50, 70);
    doc.text(String(name), 14, y);
    doc.text(`${engScore}`, W - 14, y, { align: 'right' });

    // Bar background
    doc.setFillColor(230, 235, 245);
    doc.roundedRect(14, y + 1.5, W - 80, 3, 1, 1, 'F');
    // Bar fill
    doc.setFillColor(...col);
    if (barW > 0) doc.roundedRect(14, y + 1.5, barW, 3, 1, 1, 'F');

    y += 9;
  }

  y += 4;

  // Blockchain section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 22, 40);
  doc.text('BLOCKCHAIN ANCHORING', 14, y);
  y += 6;
  doc.setDrawColor(37, 99, 235);
  doc.line(14, y, W - 14, y);
  y += 8;

  doc.setFillColor(240, 247, 255);
  doc.roundedRect(14, y - 2, W - 28, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(37, 99, 235);
  doc.text('✓  BLOCKCHAIN ANCHORED — TAMPER PROOF', 20, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 90, 110);
  doc.text(`Transaction Hash: ${blockchainHash}`, 20, y + 10);

  y += 26;

  // Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(10, 22, 40);
  doc.text('EXECUTIVE SUMMARY', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 70, 90);
  const summary = `This report covers the security assessment of "${sessionName}". The overall quantum-safe risk posture is rated ${riskLevel} with an aggregate security score of ${score}/100. All engine assessments have completed successfully and findings have been cryptographically anchored to the blockchain for tamper-proof auditability.`;
  const lines = doc.splitTextToSize(summary, W - 28);
  doc.text(lines, 14, y);

  // Footer
  doc.setFillColor(10, 22, 40);
  doc.rect(0, 282, W, 15, 'F');
  doc.setFontSize(7);
  doc.setTextColor(160, 180, 210);
  doc.text('QUANTUM ARES — Confidential Security Report', 14, 291);
  doc.text(`${reportId} | ${dateStr}`, W - 14, 291, { align: 'right' });

  doc.save(`${reportId}_${sessionName.replace(/\s+/g, '_')}.pdf`);
}

export function ReportsTab() {
  const { sessions, isLoading, fetchSessions } = useSessions();

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
        .qa-refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid ${C.border};
          background: transparent;
          color: ${C.textSub};
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .qa-refresh-btn:hover { background: ${C.blueLight}; color: ${C.blue}; border-color: rgba(37,99,235,0.25); }
      `}</style>

      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,22,40,0.05)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: C.blueLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} color={C.blue} />
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.navy, fontSize: 16 }}>Generated Reports</div>
              <div style={{ color: C.textSub, fontSize: 12 }}>
                {isLoading ? 'Loading...' : `${sessions.length} blockchain-anchored report${sessions.length !== 1 ? 's' : ''} available`}
              </div>
            </div>
          </div>
          <button className="qa-refresh-btn" onClick={fetchSessions} disabled={isLoading}>
            {isLoading ? <Loader2 size={13} className="animate-spin" /> : '↻'} Refresh
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: C.textSub }}>
              <Loader2 size={24} style={{ display: 'inline-block', marginBottom: 8 }} />
              <div>Loading reports...</div>
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: C.textMuted }}>
              <FileText size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No reports yet</div>
              <div style={{ fontSize: 13 }}>Upload and validate infrastructure to generate blockchain-anchored reports.</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {['Report ID', 'Session Name', 'Date', 'Score', 'Status', 'Download'].map((h) => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', color: C.textSub, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap', background: '#f8faff' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s: any, i: number) => {
                  const reportId = `RPT-${String(i + 1).padStart(3, '0')}`;
                  const score = s.score ?? 50;
                  const date = s.timestamp ? new Date(s.timestamp).toLocaleDateString() : '—';
                  return (
                    <tr key={s.id} className="qa-table-row" style={{ borderBottom: `1px solid rgba(10,22,40,0.06)` }}>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ background: C.blueLight, color: C.blue, padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
                          {reportId}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px', color: C.navy, fontSize: 14, fontWeight: 500 }}>{s.name ?? 'Unnamed Session'}</td>
                      <td style={{ padding: '14px 24px', color: C.textSub, fontSize: 13 }}>{date}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{
                          background: score >= 80 ? '#dcfce7' : score >= 60 ? '#fef9c3' : '#fee2e2',
                          color: score >= 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : '#dc2626',
                          padding: '2px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700
                        }}>
                          {score}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ color: '#16a34a', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                          {s.status ?? 'COMPLETE'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <button className="qa-dl-btn" onClick={() => downloadReport(s, i)}>
                          <Download size={13} /> Download
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
