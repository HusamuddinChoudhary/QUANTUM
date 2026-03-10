import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, Shield, Zap, Link2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  navy: 'var(--c-primary)',
  navyMid: 'var(--c-primary-mid)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  bg: 'var(--c-bg)',
  bgLeft: 'var(--c-bg-alt)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  text: 'var(--c-text-main)',
  textMuted: 'var(--c-text-muted)',
  textSub: 'var(--c-text-sub)',
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) { navigate('/dashboard', { replace: true }); return; }
    setMounted(true);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    try {
      let success = false;
      if (isSignUp) {
        success = await signup(email, password, name);
        if (!success) setError('Could not create account. Email might already be registered.');
      } else {
        success = await login(email, password);
        if (!success) setError('Invalid email or password.');
      }

      if (success) navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.data?.detail || err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes float-particle {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0.35; }
          50%  { opacity: 0.7; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes scan-line {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .login-particle {
          position: absolute;
          border-radius: 50%;
          animation: float-particle linear infinite;
        }
        .qa-login-enter { animation: qa-fade-up 0.6s ease forwards; }
        @keyframes qa-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .qa-btn-login:active { transform: scale(0.97); }
        .qa-input-light {
          background: #f8faff !important;
          border: 1.5px solid rgba(10,22,40,0.15) !important;
          color: ${C.navy} !important;
          padding: 10px 14px;
          border-radius: 8px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
        }
        .qa-input-light:focus {
          border-color: ${C.blue} !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .qa-input-light::placeholder { color: ${C.textSub}; }
        .qa-feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(10,22,40,0.15);
          background: rgba(255,255,255,0.6);
          color: ${C.navy};
          font-size: 13px;
          backdrop-filter: blur(6px);
        }
        .grid-dots-login {
          background-image: radial-gradient(circle, rgba(37,99,235,0.09) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* LEFT — brand panel */}
      <div
        className="grid-dots-login"
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0a1628 0%, #1a3560 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
        }}
      >
        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="login-particle"
            style={{
              width: i % 3 === 0 ? 6 : i % 3 === 1 ? 3 : 4,
              height: i % 3 === 0 ? 6 : i % 3 === 1 ? 3 : 4,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(147,197,253,0.7)',
              left: `${(i * 8.3) % 100}%`,
              bottom: '-10px',
              animationDuration: `${8 + i * 1.5}s`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}

        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          animation: 'scan-line 6s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* Circuit SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}
          viewBox="0 0 500 700" preserveAspectRatio="xMidYMid slice">
          <g stroke="#ffffff" strokeWidth="1" fill="none">
            <path d="M50 100 L200 100 L200 200 L350 200 L350 350" strokeDasharray="4 4" />
            <path d="M100 300 L100 450 L300 450 L300 600" strokeDasharray="6 3" />
            <path d="M400 50 L400 250 L250 250 L250 400 L450 400" strokeDasharray="3 6" />
            <circle cx="200" cy="100" r="4" fill="#ffffff" />
            <circle cx="350" cy="200" r="4" fill="#ffffff" />
            <circle cx="300" cy="450" r="4" fill="#93c5fd" />
            <circle cx="400" cy="250" r="4" fill="#ffffff" />
          </g>
        </svg>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#ffffff', letterSpacing: '0.12em', marginBottom: 16 }}>
            QUANTUM·ARES
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, marginBottom: 40, fontStyle: 'italic' }}>
            "Architecture is the new perimeter."
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div className="qa-feature-pill">
              <Shield size={14} color={C.blue} /> Zero-Trust Validation
            </div>
            <div className="qa-feature-pill">
              <Zap size={14} color={C.blue} /> Quantum Risk (HNDL)
            </div>
            <div className="qa-feature-pill">
              <Link2 size={14} color={C.blue} /> Blockchain Reports
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT — login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: C.bg }}>
        <div
          className={mounted ? 'qa-login-enter' : ''}
          style={{
            width: '100%', maxWidth: 420,
            background: C.card,
            borderRadius: 16,
            padding: '40px',
            border: `1px solid ${C.border}`,
            boxShadow: '0 8px 40px rgba(10,22,40,0.1)',
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: C.navy, margin: 0, marginBottom: 8 }}>
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p style={{ color: C.textSub, fontSize: 14, margin: 0 }}>
              {isSignUp ? 'Sign up for a new QUANTUM-ARES workspace' : 'Sign in to your QUANTUM-ARES workspace'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {isSignUp && (
              <div>
                <label style={{ display: 'block', color: C.textMuted, fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="qa-input-light"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <label style={{ display: 'block', color: C.textMuted, fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                Email Address
              </label>
              <input
                type="email"
                className="qa-input-light"
                placeholder="admin@bank.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ display: 'block', color: C.textMuted, fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="qa-input-light"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: C.textSub, padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                color: '#b91c1c', fontSize: 13, padding: '10px 14px',
                background: 'rgba(185,28,28,0.06)', borderRadius: 6, border: '1px solid rgba(185,28,28,0.2)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="qa-btn-login"
              style={{
                width: '100%', padding: '12px',
                background: loading ? '#94a3b8' : C.navy,
                color: '#ffffff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Syne', sans-serif", letterSpacing: '0.05em', transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(10,22,40,0.25)',
              }}
            >
              {loading ? (isSignUp ? 'Creating Account…' : 'Authenticating…') : (isSignUp ? 'Sign Up →' : 'Sign In →')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setName(''); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: C.navyMid, fontSize: 13, fontWeight: 600, padding: '8px 16px'
              }}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link
              to="/"
              style={{ color: C.textSub, fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.blue)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textSub)}
            >
              Learn more about QUANTUM-ARES →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
