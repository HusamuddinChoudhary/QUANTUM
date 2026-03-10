import { NavLink, useNavigate } from 'react-router';
import { LayoutDashboard, Clock, Upload, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', to: '/dashboard', end: true },
  { icon: Clock, label: 'History', to: '/dashboard/history' },
  { icon: Upload, label: 'Upload', to: '/dashboard/upload' },
  { icon: FileText, label: 'Reports', to: '/dashboard/reports' },
];

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  sidebar: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
  textMuted: 'var(--c-text-muted)',
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };
  const displayName = user?.fullName ?? user?.name ?? user?.email ?? 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).toUpperCase().join('').slice(0, 2);

  return (
    <aside style={{
      width: 240, minHeight: '100vh',
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0,
      zIndex: 50,
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '2px 0 12px rgba(10,22,40,0.06)',
    }}>
      <style>{`
        .qa-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: ${C.textSub};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-left: 3px solid transparent;
          transition: all 0.2s;
          cursor: pointer;
        }
        .qa-nav-item:hover {
          color: ${C.navy};
          background: ${C.blueLight};
        }
        .qa-nav-item.active {
          color: var(--c-accent);
          border-left-color: var(--c-accent);
          background: var(--c-accent-hover);
          font-weight: 600;
        }
        .qa-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          color: ${C.textSub};
          background: none;
          border: none;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: color 0.2s, background 0.2s;
          border-radius: 6px;
        }
        .qa-logout-btn:hover { color: #b91c1c; background: rgba(185,28,28,0.06); }
      `}</style>

      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, minWidth: 0 }}>
          <img src="/src/assets/logo.png" alt="QUANTUM Logo" style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0 }} />
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 15,
            fontWeight: 800,
            color: C.navy,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1
          }}>
            QUANTUM·ARES
          </div>
        </div>
        <span style={{ background: C.blueLight, color: C.blue, fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
          v7.45
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `qa-nav-item${isActive ? ' active' : ''}`}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'var(--c-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: 'var(--c-text-inverse)',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: C.navy, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ background: 'var(--c-accent-light)', color: 'var(--c-accent)', fontSize: 10, padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>
                {user?.role ?? 'CISO'}
              </span>
            </div>
          </div>
        </div>
        <button className="qa-logout-btn" onClick={handleLogout}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}
