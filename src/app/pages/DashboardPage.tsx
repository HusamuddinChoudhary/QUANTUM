import { Outlet } from 'react-router';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export function DashboardPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--c-bg-alt)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .grid-dots-dash {
          background-image: radial-gradient(circle, var(--c-border-accent) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className="grid-dots-dash"
        style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
