import { Bell, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router';
import { useTheme } from '../../hooks/useTheme';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/history': 'Validation History',
  '/dashboard/upload': 'New Validation',
  '/dashboard/reports': 'Generated Reports',
};

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
};

export function Header() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'Dashboard';
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--c-bg-card)',
      borderBottom: `1px solid ${C.border}`,
      padding: '0 32px', height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 1px 8px var(--c-shadow)',
    }}>
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 20, fontWeight: 700,
        color: C.navy, margin: 0,
      }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 14px',
          background: 'var(--c-success-bg)',
          border: '1px solid var(--c-success-border)',
          borderRadius: 20,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-success)', boxShadow: '0 0 6px var(--c-success)' }} />
          <span style={{ color: 'var(--c-success)', fontSize: 12, fontWeight: 600 }}>Last scan: 2 mins ago</span>
        </div>

        {/* Right nav */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              position: 'relative', width: 36, height: 36,
              borderRadius: '50%', background: 'transparent', border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'background 0.2s', padding: 0,
              color: C.navy
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-bg-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button style={{
            position: 'relative', width: 36, height: 36,
            borderRadius: '50%', background: 'transparent', border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'background 0.2s', padding: 0
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--c-bg-alt)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <Bell size={18} color={C.navy} />
            <span style={{
              position: 'absolute', top: 8, right: 10,
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--c-danger)', boxShadow: '0 0 6px var(--c-danger)'
            }} />
          </button>
        </div>
      </div>
    </header>
  );
}
