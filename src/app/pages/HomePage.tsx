import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Shield, Zap, Package, FileCheck, Upload, GitBranch, BarChart3, FileText, Moon, Sun } from 'lucide-react';
import { ThreeJSHero } from '../components/home/ThreeJSHero';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const NAV_LINKS = ['Features', 'How It Works', 'Why India'];

const FEATURES = [
  {
    icon: Shield,
    title: 'Zero-Trust Validation',
    desc: '100+ rules mapped to MITRE ATT&CK. Every trust boundary validated.',
  },
  {
    icon: Zap,
    title: 'Quantum Risk (HNDL)',
    desc: 'Detects cryptography broken by 2030. Migrate before harvest-now-decrypt-later attacks hit.',
  },
  {
    icon: Package,
    title: 'Supply Chain Security',
    desc: 'SBOM generation + CVE scanning for every dependency in your stack.',
  },
  {
    icon: FileCheck,
    title: 'Blockchain Reports',
    desc: 'Tamper-proof, verifiable evidence anchored on-chain for auditors and regulators.',
  },
];

const STEPS = [
  { num: '01', icon: Upload, title: 'Upload', desc: 'Drop your infrastructure file (JSON, YAML, Terraform)' },
  { num: '02', icon: GitBranch, title: 'Graph', desc: 'We build a live topology graph of your entire system' },
  { num: '03', icon: BarChart3, title: 'Score', desc: '5 engines score your design. Zero-Trust, Quantum, Supply Chain, Compliance, Attack Path.' },
  { num: '04', icon: FileText, title: 'Report', desc: 'Get a blockchain-anchored PDF report your CISO can show regulators.' },
];

const INDIA_STATS = [
  { value: '₹8,500 Cr', label: 'lost to infra-level breaches annually' },
  { value: '₹380 Cr', label: 'in DPDP fines issued in Q1 2026 alone' },
  { value: '1.5M+', label: 'attacks per year targeting Indian infrastructure' },
];

/* ── Colour palette mapping to CSS variables ── */
const C = {
  bg: 'var(--c-bg)',
  bgAlt: 'var(--c-bg-alt)',
  bgCard: 'var(--c-bg-card)',
  navy: 'var(--c-primary)',
  navyMid: 'var(--c-primary-mid)',
  navyLight: 'var(--c-primary-light)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  textMain: 'var(--c-text-main)',
  textMuted: 'var(--c-text-muted)',
  textSub: 'var(--c-text-sub)',
  border: 'var(--c-border)',
  borderNav: 'var(--c-border-nav)',
  accent: 'var(--c-accent)',      // links / highlights
  danger: 'var(--c-danger)',
};

export function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCTA = () => {
    if (isAuthenticated) navigate('/dashboard');
    else navigate('/login');
  };

  return (
    <div style={{ background: C.bg, color: C.textMain, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        .grid-dots-home {
          background-image: radial-gradient(circle, rgba(37,99,235,0.08) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .qa-nav-link {
          color: ${C.textSub};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .qa-nav-link:hover { color: ${C.navy}; }
        .qa-btn-navy {
          background: ${C.navy};
          color: #ffffff;
          border: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(10,22,40,0.25);
          letter-spacing: 0.02em;
          position: relative;
          z-index: 2;
        }
        .qa-btn-navy:hover { background: ${C.navyMid}; box-shadow: 0 6px 24px rgba(10,22,40,0.35); }
        .qa-btn-navy:active { transform: scale(0.97); }
        .qa-btn-outline-navy {
          background: transparent;
          color: ${C.navy};
          border: 1.5px solid ${C.navy};
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          z-index: 2;
        }
        .qa-btn-outline-navy:hover { background: ${C.blueLight}; }
        .qa-btn-outline-navy:active { transform: scale(0.97); }
        .feature-card {
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-top: 3px solid ${C.blue};
          border-radius: 12px;
          padding: 28px;
          transition: all 0.3s;
          cursor: default;
          box-shadow: 0 2px 8px rgba(10,22,40,0.06);
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(37,99,235,0.12);
          border-color: rgba(37,99,235,0.35);
        }
        .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 24px;
          border: 1px solid ${C.border};
          background: ${C.blueLight};
          color: ${C.textMuted};
          font-size: 13px;
          font-weight: 500;
        }
        .pulsing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
          animation: pulse-green 2s ease-in-out infinite;
        }
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(22,163,74,0); }
        }
        @keyframes qa-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .qa-animate-in { animation: qa-fade-in 0.7s ease forwards; }

        /* ── Creative background animations ── */
        @keyframes orb-drift-1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(60px, -40px) scale(1.08); }
          66%  { transform: translate(-30px, 60px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes orb-drift-2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(-50px, 40px) scale(1.1); }
          66%  { transform: translate(40px, -60px) scale(0.92); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes orb-drift-3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(30px, 50px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-ring {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.25; }
          50%       { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
        }
        @keyframes float-ring-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
          50%       { transform: translateY(16px) rotate(-120deg); opacity: 0.35; }
        }
        @keyframes hero-particle-float {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-80vh) translateX(30px); opacity: 0; }
        }
        @keyframes aurora-shift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes grid-line-glow {
          0%, 100% { opacity: 0.04; }
          50%       { opacity: 0.12; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          will-change: transform;
        }
        .hero-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(37,99,235,0.18);
          pointer-events: none;
        }
        .hero-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: hero-particle-float linear infinite;
        }
        .hero-aurora {
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 220px;
          background: linear-gradient(90deg, rgba(37,99,235,0.08), rgba(139,92,246,0.07), rgba(37,99,235,0.06), rgba(96,165,250,0.09), rgba(37,99,235,0.07));
          background-size: 400% 400%;
          animation: aurora-shift 8s ease-in-out infinite;
          mask-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%);
          -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%);
          pointer-events: none;
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: '0 40px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s',
        background: scrolled
          ? theme === 'dark' ? 'rgba(6,14,28,0.95)' : 'rgba(255,255,255,0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: C.navy, letterSpacing: '0.1em' }}>
            QUANTUM·ARES
          </span>
        </Link>

        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="qa-nav-link">{link}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: '50%',
              transition: 'background 0.2s', padding: 0
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.blueLight}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="qa-btn-navy" style={{ padding: '8px 20px', fontSize: 14 }} onClick={handleCTA}>
            {isAuthenticated ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="grid-dots-home"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '100px 80px 60px',
          gap: 60,
          position: 'relative',
          overflow: 'visible',
          background: theme === 'dark'
            ? 'linear-gradient(160deg, #060e1c 0%, #091525 50%, #0d1f3c 100%)'
            : 'linear-gradient(160deg, #ffffff 0%, #f0f6ff 50%, #e8f0fe 100%)',
        }}
      >
        {/* ── LARGE DRIFTING ORBS ── */}
        <div className="hero-orb" style={{
          width: 700, height: 700,
          top: '-15%', right: '-5%',
          background: 'radial-gradient(circle at 40% 40%, rgba(37,99,235,0.13), rgba(139,92,246,0.07) 50%, transparent 70%)',
          animation: 'orb-drift-1 18s ease-in-out infinite',
        }} />
        <div className="hero-orb" style={{
          width: 500, height: 500,
          bottom: '-10%', left: '-8%',
          background: 'radial-gradient(circle at 60% 60%, rgba(96,165,250,0.12), rgba(37,99,235,0.06) 50%, transparent 70%)',
          animation: 'orb-drift-2 22s ease-in-out infinite',
        }} />
        <div className="hero-orb" style={{
          width: 350, height: 350,
          top: '50%', left: '40%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)',
          animation: 'orb-drift-3 28s ease-in-out infinite',
        }} />

        {/* ── ANIMATED GEOMETRIC RINGS ── */}
        <div className="hero-ring" style={{
          width: 480, height: 480,
          top: '50%', right: '5%',
          marginTop: -240,
          animation: 'float-ring 12s ease-in-out infinite',
        }} />
        <div className="hero-ring" style={{
          width: 320, height: 320,
          top: '50%', right: '12%',
          marginTop: -160,
          border: '1px solid rgba(139,92,246,0.12)',
          animation: 'float-ring-slow 16s ease-in-out infinite',
        }} />
        <div className="hero-ring" style={{
          width: 160, height: 160,
          top: '15%', left: '20%',
          border: '1.5px solid rgba(37,99,235,0.10)',
          animation: 'float-ring 20s ease-in-out infinite reverse',
        }} />
        <div className="hero-ring" style={{
          width: 90, height: 90,
          bottom: '20%', left: '35%',
          border: '1px solid rgba(96,165,250,0.15)',
          animation: 'float-ring-slow 14s ease-in-out infinite 2s',
        }} />

        {/* ── SPINNING LARGE RING (background accent) ── */}
        <div style={{
          position: 'absolute',
          width: 800, height: 800,
          top: '50%', right: '-20%',
          marginTop: -400,
          borderRadius: '50%',
          border: '1px solid rgba(37,99,235,0.05)',
          animation: 'spin-slow 60s linear infinite',
          pointerEvents: 'none',
        }}>
          {/* Ring notch dot */}
          <div style={{
            position: 'absolute', top: 8, left: '50%',
            width: 8, height: 8, borderRadius: '50%',
            background: 'rgba(37,99,235,0.3)',
            transform: 'translateX(-50%)',
          }} />
        </div>

        {/* ── ANIMATED SVG GRID LINES ── */}
        <svg style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          opacity: 1, pointerEvents: 'none',
        }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <g stroke="url(#gridGrad)" strokeWidth="1" fill="none" style={{ animation: 'grid-line-glow 4s ease-in-out infinite' }}>
            {/* Horizontal lines */}
            {[150, 300, 450, 600, 750].map(y => (
              <line key={`h${y}`} x1="0" y1={y} x2="1440" y2={y} />
            ))}
            {/* Vertical lines */}
            {[240, 480, 720, 960, 1200].map(x => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="900" />
            ))}
            {/* Diagonal accent lines */}
            <line x1="0" y1="900" x2="600" y2="0" strokeOpacity="0.04" />
            <line x1="840" y1="900" x2="1440" y2="0" strokeOpacity="0.04" />
          </g>
          {/* Glowing intersection dots */}
          {[[240, 150], [480, 300], [720, 450], [960, 150], [1200, 300], [480, 600], [960, 600]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5"
              fill="rgba(37,99,235,0.18)"
              style={{ animation: `grid-line-glow ${3 + i * 0.4}s ease-in-out infinite ${i * 0.3}s` }}
            />
          ))}
        </svg>

        {/* ── FLOATING PARTICLES ── */}
        {[
          { left: '8%', delay: 0, dur: 12, size: 4, color: 'rgba(37,99,235,0.4)' },
          { left: '15%', delay: 2, dur: 15, size: 3, color: 'rgba(139,92,246,0.35)' },
          { left: '25%', delay: 4, dur: 10, size: 5, color: 'rgba(96,165,250,0.5)' },
          { left: '55%', delay: 1, dur: 14, size: 3, color: 'rgba(37,99,235,0.3)' },
          { left: '70%', delay: 6, dur: 11, size: 4, color: 'rgba(167,139,250,0.4)' },
          { left: '80%', delay: 3, dur: 16, size: 3, color: 'rgba(96,165,250,0.45)' },
          { left: '90%', delay: 7, dur: 13, size: 5, color: 'rgba(37,99,235,0.35)' },
        ].map((p, i) => (
          <div key={i} className="hero-particle" style={{
            width: p.size, height: p.size,
            left: p.left, bottom: '10%',
            background: p.color,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}

        {/* ── AURORA WAVE ── */}
        <div className="hero-aurora" />

        {/* ── 3D HERO MODEL (RIGHT) ── */}
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50.5%)', zIndex: 1, pointerEvents: 'none' }}>
          <ThreeJSHero />
        </div>

        {/* LEFT */}
        <div style={{ flex: 1, maxWidth: 600 }} className="qa-animate-in">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
            padding: '6px 14px', borderRadius: 20, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.35)'
          }}>
            <div className="pulsing-dot" />
            <span style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>v7.45 Ship-Ready</span>
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(42px,5vw,68px)', fontWeight: 800, lineHeight: 1.1, margin: 0, marginBottom: 8, color: C.navy }}>
            Architecture is the
          </h1>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(42px,5vw,68px)', fontWeight: 800, lineHeight: 1.1, margin: 0, marginBottom: 28, color: C.navy }}>
            new{' '}
            <span style={{ color: C.blue, textShadow: '0 0 30px rgba(37,99,235,0.25)' }}>perimeter.</span>
          </h1>

          <p style={{ fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
            Validate your infrastructure design before attackers exploit it. QUANTUM-ARES gives your CISO a Security Index — like CIBIL for your tech stack.
          </p>

          <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
            <button className="qa-btn-navy" onClick={handleCTA}>Try Demo →</button>
            <button className="qa-btn-outline-navy">Watch How It Works</button>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['100+ MITRE Rules', '5 Validation Engines', 'Blockchain Anchored'].map((s) => (
              <div key={s} className="stat-pill">
                <span style={{ color: C.blue, fontSize: 16 }}>●</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — CIBIL ANALOGY */}
      <section id="features" className="grid-dots-home" style={{ padding: '100px 80px', background: C.bgAlt }}>
        <div style={{ display: 'flex', gap: 80, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 12 }}>
              THE SECURITY INDEX
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,3vw,42px)', fontWeight: 800, color: C.navy, margin: 0, marginBottom: 20, lineHeight: 1.2 }}>
              Your infrastructure gets a score. Just like your credit.
            </h2>
            <p style={{ color: C.textMuted, fontSize: 16, lineHeight: 1.8 }}>
              Just as CIBIL turns your financial history into one trusted number, QUANTUM-ARES turns your infrastructure design into a Security Index (0–100) that every CISO, auditor, and regulator can understand and verify.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 300, display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
            {/* CIBIL Card */}
            <div style={{ background: C.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, textAlign: 'center', flex: 1, boxShadow: '0 4px 16px rgba(10,22,40,0.08)' }}>
              <div style={{ color: C.textSub, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12 }}>CIBIL SCORE</div>
              <div style={{ fontSize: 48, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>742</div>
              <div style={{ color: C.textSub, fontSize: 12 }}>/900</div>
              <div style={{ marginTop: 12, padding: '6px 12px', background: 'rgba(22,163,74,0.1)', borderRadius: 20, color: '#16a34a', fontSize: 12, fontWeight: 600 }}>
                Financial Trustworthiness
              </div>
            </div>

            <div style={{ color: C.navy, fontSize: 24, fontWeight: 800 }}>→</div>

            {/* QA Index Card */}
            <div style={{ background: C.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, textAlign: 'center', flex: 1, boxShadow: '0 4px 16px rgba(10,22,40,0.08)' }}>
              <div style={{ color: C.textSub, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12 }}>QUANTUM-ARES INDEX</div>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 12px' }}>
                <svg viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke={C.blue} strokeWidth="8" strokeDasharray={`${(84 / 100) * 201} 201`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: C.blue }}>
                  84
                </div>
              </div>
              <div style={{ color: C.textSub, fontSize: 12 }}>/100</div>
              <div style={{ marginTop: 8, padding: '6px 12px', background: C.blueLight, borderRadius: 20, color: C.blue, fontSize: 12, fontWeight: 600 }}>
                Infrastructure Security
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURES */}
      <section id="how-it-works" className="grid-dots-home" style={{ padding: '100px 80px', background: C.bg }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,3vw,42px)', fontWeight: 800, color: C.navy, margin: 0 }}>
            Four Pillars of Infrastructure Assurance
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{ marginBottom: 16, width: 44, height: 44, background: C.blueLight, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <f.icon size={22} color={C.blue} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.navy, margin: 0, marginBottom: 10, fontSize: 18 }}>
                {f.title}
              </h3>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section style={{ padding: '100px 80px', background: C.bgAlt }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,3vw,42px)', fontWeight: 800, color: C.navy, margin: 0 }}>
            How It Works
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0, position: 'relative' }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px', position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', top: 28, left: '60%', right: '-40%', height: 2,
                  borderTop: `2px dashed rgba(37,99,235,0.3)`, zIndex: 0,
                }} />
              )}
              <div style={{
                width: 56, height: 56, borderRadius: '50%', border: `2px solid ${C.blue}`,
                background: C.bgCard, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, position: 'relative', zIndex: 1,
                fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: C.blue,
                boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
              }}>
                {step.num}
              </div>
              <div style={{ width: 36, height: 36, background: C.blueLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <step.icon size={18} color={C.blue} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", color: C.navy, fontWeight: 700, fontSize: 18, margin: 0, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — INDIA IMPACT */}
      <section id="why-india" style={{ padding: '80px', background: C.bgAlt, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 40 }}>
            THE INDIA IMPACT
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32, marginBottom: 48 }}>
            {INDIA_STATS.map((s) => (
              <div key={s.value} style={{ padding: '28px', background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: '0 4px 16px rgba(10,22,40,0.06)' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#dc2626', marginBottom: 8 }}>{s.value}</div>
                <div style={{ color: C.textSub, fontSize: 14 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ color: C.navy, fontSize: 20, fontWeight: 700, marginBottom: 28 }}>
            Don't be the next breach.
          </p>
          <button className="qa-btn-navy" onClick={handleCTA}>
            Validate now →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bgAlt, padding: '60px 80px 30px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: C.navy, letterSpacing: '0.1em', marginBottom: 12 }}>
              QUANTUM·ARES
            </div>
            <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>Architecture is the new perimeter.</p>
          </div>
          <div>
            <div style={{ color: C.navy, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Links</div>
            {['GitHub', 'Docs', 'Contact'].map((l) => (
              <div key={l} style={{ marginBottom: 8 }}>
                <a href="#" style={{ color: C.textMuted, fontSize: 13, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.blue)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>{l}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: C.navy, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Legal</div>
            {['Privacy Policy', 'Terms of Service'].map((l) => (
              <div key={l} style={{ marginBottom: 8 }}>
                <a href="#" style={{ color: C.textMuted, fontSize: 13, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.blue)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>{l}</a>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, color: C.textSub, fontSize: 12, textAlign: 'center' }}>
          © 2025 QUANTUM-ARES. v7.45 ShipReady. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
