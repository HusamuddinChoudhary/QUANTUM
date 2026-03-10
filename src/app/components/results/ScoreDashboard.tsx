import { useEffect, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useGraphContext } from '../../hooks/useGraphContext';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
};

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const circumference = 2 * Math.PI * (size / 2 - 10);

  useEffect(() => {
    let current = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= score) { setDisplayed(score); clearInterval(timer); return; }
      setDisplayed(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 10} fill="none" stroke="rgba(37,99,235,0.12)" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={size / 2 - 10}
          fill="none" stroke={C.blue} strokeWidth={10}
          strokeDasharray={`${(displayed / 100) * circumference} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'none' }}
        />
      </svg>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: size > 100 ? 32 : 20, fontWeight: 800, color: C.blue, lineHeight: 1 }}>
          {displayed}
        </div>
        <div style={{ color: C.textSub, fontSize: 11 }}>/100</div>
      </div>
    </div>
  );
}

function getBarColor(score: number) {
  if (score >= 80) return '#16a34a';
  if (score >= 70) return '#d97706';
  return '#dc2626';
}

export function ScoreDashboard() {
  const { scores } = useGraphContext();

  const engines = [
    { name: 'Zero-Trust', score: scores.zeroTrust, label: 'Zero-Trust Score' },
    { name: 'Quantum Vuln', score: scores.quantumVuln, label: 'Quantum Vuln Index' },
    { name: 'Attack Path', score: scores.attackPath, label: 'Attack Path Score' },
    { name: 'Supply Chain', score: scores.supplyChain, label: 'Supply Chain Score' },
    { name: 'Compliance', score: scores.compliance, label: 'Compliance Score' },
  ];

  const radarData = engines.map((e) => ({ subject: e.name, score: e.score }));

  return (
    <div style={{ display: 'flex', gap: 24, padding: 16 }}>
      {/* Radar Chart side */}
      <div style={{ flex: 1, minWidth: 320, background: '#f8faff', borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 16 }}>
          Risk Surface Mapping
        </div>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(10,22,40,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: C.textSub, fontSize: 12, fontFamily: 'DM Sans, sans-serif' }} />
              <Radar name="Score" dataKey="score" stroke={C.blue} fill={C.blue} fillOpacity={0.15} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: `1px solid ${C.border}`, borderRadius: 8, color: C.navy }}
                formatter={(val) => [`${val}/100`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Individual Scores side */}
      <div style={{ flex: 1, background: '#f8faff', borderRadius: 12, border: `1px solid ${C.border}`, padding: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 16 }}>
          Individual Scores
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {engines.map((engine) => (
            <div key={engine.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <ScoreRing score={engine.score} size={100} />
              <div style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{engine.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
