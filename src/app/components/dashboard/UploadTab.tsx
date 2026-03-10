import { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, Loader } from 'lucide-react';
import { ValidationResults } from '../results/ValidationResults';
import { useGraphContext } from '../../hooks/useGraphContext';
import { useSessions } from '../../hooks/useSessions';
import { useWebSocket } from '../../hooks/useWebSocket';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

const ENGINES = [
  { id: 'zero_trust', name: 'Zero-Trust Engine' },
  { id: 'quantum', name: 'Quantum Risk Engine' },
  { id: 'attack_path', name: 'Attack Path Engine' },
  { id: 'supply_chain', name: 'Supply Chain Engine' },
  { id: 'compliance', name: 'Compliance Engine' },
];

const DEMO_SCENARIOS = [
  { emoji: '🏦', label: 'Load Bank Demo', name: 'demo_bank.json' },
  { emoji: '🏥', label: 'Load Hospital Demo', name: 'demo_hospital.json' },
  { emoji: '🏛️', label: 'Load Government Demo', name: 'demo_govt.json' },
];

type Stage = 'idle' | 'processing' | 'done';

export function UploadTab() {
  const [stage, setStage] = useState<Stage>('idle');
  const [sessionName, setSessionName] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { loadSession } = useGraphContext();
  const { validateInfra } = useSessions();
  const { progress, engineStatuses, isComplete } = useWebSocket(activeSessionId);

  const startValidation = async (name: string, file: File | null, demo: string | null) => {
    setSessionName(name);
    setStage('processing');

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (demo) formData.append('demo', demo);

      const sid = await validateInfra(formData);
      setActiveSessionId(sid);
    } catch (error) {
      setStage('idle');
      alert("Failed to start validation.");
    }
  };

  useEffect(() => {
    if (isComplete && activeSessionId) {
      loadSession(activeSessionId);
      setStage('done');
    }
  }, [isComplete, activeSessionId, loadSession]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) startValidation(file.name.replace(/\.(json|yaml|tf)$/, ''), file, null);
  };

  if (stage === 'done') {
    return (
      <div style={{ padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
        <button
          onClick={() => { setStage('idle'); setActiveSessionId(null); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', color: C.blue,
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            marginBottom: 24, fontFamily: "'DM Sans', sans-serif", padding: 0,
          }}
        >
          ← New Validation
        </button>
        <ValidationResults sessionName={sessionName} />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .upload-zone {
          border: 2px dashed rgba(37,99,235,0.3);
          border-radius: 16px;
          padding: 60px 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: #f8faff;
        }
        .upload-zone:hover, .upload-zone.drag-over {
          border-color: ${C.blue};
          background: ${C.blueLight};
          box-shadow: 0 0 30px rgba(37,99,235,0.08);
        }
        .qa-demo-btn {
          padding: 12px 20px;
          border-radius: 8px;
          border: 1.5px solid rgba(10,22,40,0.15);
          background: #ffffff;
          color: ${C.navy};
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 1px 4px rgba(10,22,40,0.06);
        }
        .qa-demo-btn:hover { border-color: ${C.blue}; background: ${C.blueLight}; }
        .qa-demo-btn:active { transform: scale(0.97); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Drop Zone */}
      <div
        className={`upload-zone${dragOver ? ' drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{ maxWidth: 600, margin: '0 auto 40px' }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".json,.yaml,.yml,.tf"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) startValidation(file.name.replace(/\.(json|yaml|yml|tf)$/, ''), file, null);
          }}
        />
        <div style={{ width: 64, height: 64, background: C.blueLight, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <UploadCloud size={32} color={C.blue} />
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
          Drop your infrastructure file here
        </div>
        <div style={{ color: C.textSub, fontSize: 14, marginBottom: 8 }}>
          Supports JSON, YAML, Terraform (.tf)
        </div>
        <span style={{ color: C.blue, fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}>
          or click to browse
        </span>
      </div>

      {/* Demo scenarios */}
      {stage === 'idle' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ color: C.textSub, fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
            Or try a demo scenario:
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {DEMO_SCENARIOS.map((s) => (
              <button key={s.label} className="qa-demo-btn" onClick={() => startValidation(s.label.split('Load ')[1], null, s.name)}>
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Processing panel */}
      {stage === 'processing' && (
        <div style={{ maxWidth: 560, margin: '0 auto', background: C.card, borderRadius: 16, padding: 32, border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(10,22,40,0.08)' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: C.textSub, fontSize: 12 }}>Session ID: <span style={{ color: C.blue }}>{activeSessionId || 'Connecting...'}</span></span>
              <span style={{ color: C.blue, fontSize: 13, fontWeight: 700 }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(37,99,235,0.12)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: `linear-gradient(90deg, ${C.navy}, ${C.blue})`,
                borderRadius: 3, width: `${progress}%`, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ENGINES.map((eng) => {
              const status = engineStatuses[eng.id] || 'PENDING'; // PENDING, RUNNING, COMPLETE
              const done = status === 'COMPLETE';
              const running = status === 'RUNNING';
              return (
                <div key={eng.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {done ? <CheckCircle size={20} color="#16a34a" /> :
                      running ? <Loader size={18} color={C.blue} style={{ animation: 'spin 1s linear infinite' }} /> :
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid rgba(10,22,40,0.2)` }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: done ? C.navy : running ? C.textMuted : C.textSub, fontSize: 14, fontWeight: done ? 500 : 400 }}>
                      {eng.name}
                    </span>
                    {done && <span style={{ color: '#16a34a', fontSize: 12, marginLeft: 8 }}>✓ Analysis Complete</span>}
                    {running && <span style={{ color: C.blue, fontSize: 12, marginLeft: 8 }}>Analyzing...</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
