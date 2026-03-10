import { useState } from 'react';
import { toast } from 'sonner';
import { useGraphContext } from '../../hooks/useGraphContext';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

const SEVERITY_CONFIG: Record<string, { bg: string; color: string }> = {
  CRITICAL: { bg: 'var(--c-danger-bg)', color: 'var(--c-danger)' },
  HIGH: { bg: 'var(--c-warning-bg)', color: 'var(--c-warning)' },
  MEDIUM: { bg: 'rgba(202,138,4,0.12)', color: '#ca8a04' },
  LOW: { bg: 'var(--c-accent-hover)', color: 'var(--c-accent)' },
};

const ENGINES = ['All Engines', 'Zero-Trust', 'Quantum Risk', 'Supply Chain', 'Compliance'];
const SEVERITIES = ['All Severities', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export function ViolationPanel() {
  const [engineFilter, setEngineFilter] = useState('All Engines');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const { violationDetails } = useGraphContext();

  const filtered = violationDetails.filter((v) => {
    const matchEngine = engineFilter === 'All Engines' || v.engine === engineFilter;
    const matchSeverity = severityFilter === 'All Severities' || v.severity === severityFilter;
    const matchSearch = !search || v.id.toLowerCase().includes(search.toLowerCase()) || v.node.toLowerCase().includes(search.toLowerCase());
    return matchEngine && matchSeverity && matchSearch;
  });

  const handleRowClick = (id: string, node: string) => {
    setHighlighted(id);
    toast.success(`Node highlighted in Graph view: ${node}`, {
      style: { background: '#ffffff', border: '1px solid rgba(37,99,235,0.25)', color: '#0a1628' },
      duration: 2500,
    });
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .qa-viol-row { transition: background 0.15s; cursor: pointer; }
        .qa-viol-row:hover { background: ${C.blueLight} !important; }
        .qa-viol-row.highlighted { background: ${C.blueLight} !important; outline: 1px solid rgba(37,99,235,0.2); }
        .qa-filter-select {
          background: #ffffff;
          border: 1.5px solid rgba(10,22,40,0.15);
          color: ${C.navy};
          padding: 8px 12px;
          border-radius: 7px;
          outline: none;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
        }
        .qa-filter-input {
          background: #ffffff;
          border: 1.5px solid rgba(10,22,40,0.15);
          color: ${C.navy};
          padding: 8px 12px;
          border-radius: 7px;
          outline: none;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          width: 180px;
        }
        .qa-filter-input::placeholder { color: ${C.textSub}; }
        .qa-filter-input:focus, .qa-filter-select:focus { border-color: ${C.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
      `}</style>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select className="qa-filter-select" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
          {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="qa-filter-select" value={engineFilter} onChange={(e) => setEngineFilter(e.target.value)}>
          {ENGINES.map((e) => <option key={e}>{e}</option>)}
        </select>
        <input
          className="qa-filter-input"
          placeholder="Search rule or node..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,22,40,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Rule ID', 'Severity', 'MITRE Technique', 'Affected Node', 'Engine', 'Remediation'].map((h) => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: C.textSub, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', whiteSpace: 'nowrap', background: '#f8faff' }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => {
                const sev = SEVERITY_CONFIG[v.severity];
                return (
                  <tr
                    key={v.id}
                    className={`qa-viol-row${highlighted === v.id ? ' highlighted' : ''}`}
                    style={{ borderBottom: `1px solid rgba(10,22,40,0.06)` }}
                    onClick={() => handleRowClick(v.id, v.node)}
                  >
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.blue, fontSize: 13 }}>{v.id}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: 10, background: sev.bg, color: sev.color, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
                        {v.severity}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', color: C.textMuted, fontSize: 13 }}>
                      {v.mitreId !== '—' ? (
                        <span>
                          <span style={{ color: C.blue }}>{v.mitreId}</span>{' '}{v.mitreName}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '12px 20px', color: C.navy, fontSize: 13, fontWeight: 500 }}>{v.node}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ color: C.textSub, fontSize: 12, background: '#f0f4fa', padding: '2px 8px', borderRadius: 6 }}>
                        {v.engine}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', color: C.textMuted, fontSize: 13 }}>{v.remediation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, background: '#f8faff' }}>
          <span style={{ color: C.textSub, fontSize: 12 }}>
            {filtered.length} violation{filtered.length !== 1 ? 's' : ''} shown · Click a row to highlight node in Graph view
          </span>
        </div>
      </div>
    </div>
  );
}
