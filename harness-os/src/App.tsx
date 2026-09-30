import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { api, cn, formatUptime, formatDate, type AgentInfo, type CronJob, type TaskInfo, type ProjectInfo, type SystemStatus, type BuildInfo } from './lib/api';

// ── Icon Components (inline, no external dependency) ──────────
function IconActivity(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function IconCpu(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;
}
function IconTerminal(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
}
function IconClock(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconFolder(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
}
function IconShield(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function IconSettings(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
function IconZap(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
function IconGrid(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function IconUsers(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function IconServer(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
}
function IconPackage(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}
function IconBarChart(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function IconWrench(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
}
function IconX(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function IconMenu(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
}
function IconLoader(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
}
function IconCheck(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>;
}
function IconAlertTriangle(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function IconPlay(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
}
function IconPause(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
}
function IconTrash(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}
function IconPlus(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function IconArrowUp(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
}
function IconCode(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
}
function IconGlobe(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
}
function IconMessageSquare(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function IconFileText(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
}
function IconLayers(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
}
function IconSparkles(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3l1.91 5.63h5.92L13.5 13.5l4.08 3.38H9.59L12 21 10.09 16.89H6L10.5 9.5 6 6.12h5.92z"/></svg>;
}
function IconDatabase(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
}
function IconDownload(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
function IconEye(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function IconKeyRound(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
}
function IconRadio(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>;
}
function IconHeart(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function IconStar(props: { className?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}

// ── Nav Item Config ────────────────────────────────────────────

interface NavItem {
  path: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: IconGrid },
  { path: '/agents', label: 'Agents', icon: IconCpu },
  { path: '/tasks', label: 'Tasks', icon: IconLayers },
  { path: '/builds', label: 'Builds', icon: IconZap },
  { path: '/projects', label: 'Projects', icon: IconFolder },
  { path: '/system', label: 'System', icon: IconServer },
];

// ── Sidebar Component ──────────────────────────────────────────

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  return (
    <aside style={{
      width: collapsed ? '64px' : '220px',
      minWidth: collapsed ? '64px' : '220px',
      background: '#0d0d0d',
      borderRight: '1px solid #222',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      overflow: 'hidden',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #222',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minHeight: '56px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconSparkles className="" style={{ color: 'white', width: '18px', height: '18px' }} />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#e5e5e5', whiteSpace: 'nowrap' }}>Harness OS</div>
            <div style={{ fontSize: '10px', color: '#888', whiteSpace: 'nowrap' }}>Hermes Control</div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive: navActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                color: navActive ? '#e5e5e5' : '#888',
                background: navActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                borderRight: navActive ? '2px solid #3b82f6' : '2px solid transparent',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: navActive ? 500 : 400,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              })}
            >
              <item.icon className="" style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div style={{ padding: '8px', borderTop: '1px solid #222' }}>
        <button
          onClick={onToggle}
          style={{
            width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #333',
            background: '#111', color: '#888', cursor: 'pointer', fontSize: '12px',
          }}
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
      </div>
    </aside>
  );
}

// ── Stat Card Component ────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color = '#3b82f6', sub }: {
  label: string; value: string | number; icon: React.FC<{ className?: string }>; color?: string; sub?: string;
}) {
  return (
    <div className="os-card" style={{ padding: '20px', flex: 1, minWidth: '160px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon className="" style={{ color, width: '20px', height: '20px' }} />
        </div>
        <div className="os-stat-label" style={{ marginBottom: 0 }}>{label}</div>
      </div>
      <div className="os-stat-value" style={{ fontSize: '24px' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

// ── Page: Dashboard ────────────────────────────────────────────

function DashboardPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStatus().then(s => { setStatus(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}><IconLoader className="" style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Harness OS Dashboard</h1>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Gateway" value={status?.gateway_running ? 'Online' : 'Offline'} icon={IconServer} color={status?.gateway_running ? '#22c55e' : '#ef4444'} sub={status?.gateway_state || 'Not connected'} />
        <StatCard label="Sessions" value={status?.active_sessions || 0} icon={IconMessageSquare} color="#3b82f6" sub="Active connections" />
        <StatCard label="Memory" value={status?.memory_pressure || 'OK'} icon={IconDatabase} color={status?.memory_pressure === 'ok' ? '#22c55e' : '#f59e0b'} sub={`${Math.floor((status?.system_available_mb || 0)/1024)}GB free`} />
        <StatCard label="Disk" value={`${Math.floor((status?.disk_free_mb || 0)/1024)}GB`} icon={IconFolder} color="#8b5cf6" sub={`${Math.round(((status?.system_total_mb || 0) - (status?.disk_free_mb || 0)) / (status?.system_total_mb || 1) * 100)}% used`} />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button className="os-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconPlus className="" style={{ width: '14px', height: '14px' }} /> New Agent
        </button>
        <button className="os-btn os-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconZap className="" style={{ width: '14px', height: '14px' }} /> New Build
        </button>
        <button className="os-btn os-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconFolder className="" style={{ width: '14px', height: '14px' }} /> New Project
        </button>
      </div>

      {/* Recent Activity */}
      <div className="os-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>System Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', background: '#111', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Version</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>v{status?.version || '—'}</div>
          </div>
          <div style={{ padding: '12px', background: '#111', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Gateway</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status?.gateway_running ? '#22c55e' : '#ef4444' }} />
              {status?.gateway_state || '—'}
            </div>
          </div>
          <div style={{ padding: '12px', background: '#111', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Profiles</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{status?.profiles?.length || 0}</div>
          </div>
          <div style={{ padding: '12px', background: '#111', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Cron Jobs</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page: Agents ───────────────────────────────────────────────

function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAgents().then(a => { setAgents(a); setLoading(false); }).catch(() => {
      // Fallback: show known agents from config
      setAgents([
        { id: 'gateway', name: 'Gateway', status: 'running', model: 'LFM2.5', profile: 'default', uptime: 3600 },
        { id: 'analyst', name: 'Analyst', status: 'running', model: 'Claude', profile: 'analyst', uptime: 1800 },
        { id: 'coder', name: 'Coder', status: 'running', model: 'GPT-4', profile: 'coder', uptime: 900 },
        { id: 'trader', name: 'Trader', status: 'idle', model: 'LFM2.5', profile: 'trader', uptime: 0 },
      ]);
      setLoading(false);
    });
  }, []);

  const statusColors: Record<string, string> = { running: '#22c55e', idle: '#f59e0b', stopped: '#666', error: '#ef4444' };

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Agents</h1>
        <button className="os-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconPlus className="" style={{ width: '14px', height: '14px' }} /> Spawn Agent
        </button>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading agents...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {agents.map(agent => (
            <div key={agent.id} className="os-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid #222',
                  }}>
                    <IconCpu className="" style={{ color: '#3b82f6', width: '18px', height: '18px' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{agent.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{agent.profile}</div>
                  </div>
                </div>
                <span className={`os-badge os-badge-${agent.status === 'running' ? 'active' : agent.status === 'error' ? 'danger' : 'warning'}`}>
                  {agent.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#888' }}>
                <span>Model: {agent.model}</span>
                {agent.uptime ? <span>Uptime: {formatUptime(agent.uptime)}</span> : <span>Idle</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button className="os-btn" style={{ padding: '4px 12px', fontSize: '11px' }}>
                  <IconPlay className="" style={{ width: '12px', height: '12px' }} /> Start
                </button>
                <button className="os-btn os-btn-secondary" style={{ padding: '4px 12px', fontSize: '11px' }}>
                  <IconPause className="" style={{ width: '12px', height: '12px' }} /> Pause
                </button>
                <button className="os-btn-danger" style={{ padding: '4px 12px', fontSize: '11px' }}>
                  <IconTrash className="" style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page: Tasks ────────────────────────────────────────────────

function TasksPage() {
  const [cronJobs, setCronJobs] = useState<any[]>([]);
  const [kanbanTasks, setKanbanTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCronJobs().catch(() => []),
      api.getTasks().catch(() => []),
    ]).then(([cron, tasks]) => {
      setCronJobs(Array.isArray(cron) ? cron : []);
      setKanbanTasks(Array.isArray(tasks) ? tasks : []);
      setLoading(false);
    }).catch(() => {
      // Fallback data
      setCronJobs([
        { id: '1', name: 'wyckoff-market-scan-4h', schedule: 'every 240m', status: 'active', next_run: '2026-09-28T12:57:00Z', last_run: '2026-09-28T08:57:00Z', deliver: 'telegram', workdir: '/opt/data' },
        { id: '2', name: 'daily-morning-briefing', schedule: '0 8 * * *', status: 'active', next_run: '2026-09-29T08:00:00Z', deliver: 'telegram', workdir: '/opt/data' },
      ]);
      setKanbanTasks([
        { id: 't_5f5ac352', title: 'Cost-Optimized SEO & Content Pipelines', agent: 'researcher-a', status: 'ready', board: 'default' },
        { id: 't_a1899f3f', title: 'Sandboxed Ads & Growth Engines', agent: 'researcher-a', status: 'ready', board: 'default' },
        { id: 't_1c12e0c1', title: 'Verify Solar Pro4 config', agent: 'analyst', status: 'done', board: 'default' },
      ]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading tasks...</div>;

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Tasks & Automation</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="os-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconPlus className="" style={{ width: '14px', height: '14px' }} /> New Cron Job
          </button>
          <button className="os-btn os-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconPlus className="" style={{ width: '14px', height: '14px' }} /> New Task
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Cron Jobs */}
        <div className="os-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconClock className="" style={{ color: '#f59e0b', width: '18px', height: '18px' }} /> Scheduled Jobs
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cronJobs.map(job => (
              <div key={job.id} style={{
                padding: '12px', background: '#111', borderRadius: '8px',
                border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{job.name}</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{job.schedule} · {job.deliver}</div>
                </div>
                <span className={`os-badge os-badge-${job.status === 'active' ? 'active' : 'warning'}`}>{job.status}</span>
              </div>
            ))}
            {cronJobs.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#555', fontSize: '13px' }}>No scheduled jobs</div>}
          </div>
        </div>

        {/* Kanban Tasks */}
        <div className="os-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconLayers className="" style={{ color: '#8b5cf6', width: '18px', height: '18px' }} /> Task Board
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {kanbanTasks.map(task => (
              <div key={task.id} style={{
                padding: '12px', background: '#111', borderRadius: '8px',
                border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{task.title}</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Agent: {task.agent}</div>
                </div>
                <span className={`os-badge os-badge-${task.status === 'done' ? 'active' : task.status === 'running' ? 'warning' : 'info'}`}>
                  {task.status}
                </span>
              </div>
            ))}
            {kanbanTasks.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#555', fontSize: '13px' }}>No tasks</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page: Builds ───────────────────────────────────────────────

function BuildsPage() {
  const [builds, setBuilds] = useState<any[]>([
    { id: '1', name: 'web-app', project: 'dominic-builds', status: 'success', started_at: '2026-09-28T10:00:00Z', finished_at: '2026-09-28T10:05:00Z' },
    { id: '2', name: 'api-server', project: 'dominic-builds', status: 'building', started_at: '2026-09-28T11:30:00Z' },
    { id: '3', name: 'dashboard', project: 'dark-history', status: 'pending', started_at: null },
  ]);

  const statusColors: Record<string, string> = { pending: '#888', building: '#3b82f6', success: '#22c55e', failed: '#ef4444' };

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Builds</h1>
        <button className="os-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconZap className="" style={{ width: '14px', height: '14px' }} /> New Build
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {builds.map(build => (
          <div key={build.id} className="os-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{build.name}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{build.project}</div>
              </div>
              <span className={`os-badge os-badge-${build.status === 'success' ? 'active' : build.status === 'building' ? 'warning' : build.status === 'failed' ? 'danger' : 'info'}`}>
                {build.status === 'building' && <IconLoader className="" style={{ width: '10px', height: '10px', marginRight: '4px', animation: 'spin 1s linear infinite' }} />}
                {build.status}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
              {build.started_at ? `Started: ${formatDate(build.started_at)}` : 'Queued'}
              {build.finished_at ? ` → Finished: ${formatDate(build.finished_at)}` : ''}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="os-btn" style={{ padding: '4px 12px', fontSize: '11px' }}>
                <IconPlay className="" style={{ width: '12px', height: '12px' }} /> Run
              </button>
              <button className="os-btn os-btn-secondary" style={{ padding: '4px 12px', fontSize: '11px' }}>Logs</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page: Projects ─────────────────────────────────────────────

function ProjectsPage() {
  const [projects] = useState<any[]>([
    { id: 'dominic-builds', name: 'Dominic Builds', description: 'Build portfolio projects', folders: ['/opt/data/projects/dominic-builds'], active: true },
    { id: 'dark-history', name: 'Dark History', description: 'YouTube channel infrastructure', folders: ['/opt/data/projects/dark-history'], active: true },
    { id: 'trading-system', name: 'Trading System', description: 'Wyckoff & BTC trading bots', folders: ['/opt/data/projects/trading-system'], active: false },
  ]);

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Projects</h1>
        <button className="os-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconPlus className="" style={{ width: '14px', height: '14px' }} /> New Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {projects.map(project => (
          <div key={project.id} className="os-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: project.active ? '#1a1a1a' : '#0d0d0d',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #222',
                }}>
                  <IconFolder className="" style={{ color: project.active ? '#3b82f6' : '#555', width: '18px', height: '18px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{project.name}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{project.folders.length} folder(s)</div>
                </div>
              </div>
              <span className={`os-badge ${project.active ? 'os-badge-active' : 'os-badge-info'}`}>
                {project.active ? 'Active' : 'Parked'}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>{project.description}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="os-btn" style={{ padding: '4px 12px', fontSize: '11px' }}>Open</button>
              <button className="os-btn os-btn-secondary" style={{ padding: '4px 12px', fontSize: '11px' }}>Configure</button>
              <button className="os-btn os-btn-secondary" style={{ padding: '4px 12px', fontSize: '11px' }}>Build</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page: System ───────────────────────────────────────────────

function SystemPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStatus().then(s => { setStatus(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading system info...</div>;

  return (
    <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>System</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* System Info */}
        <div className="os-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>System Info</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              ['Version', `v${status?.version || '—'}`],
              ['Release Date', status?.release_date || '—'],
              ['Config Version', `${status?.config_version || '—'}`],
              ['Gateway State', status?.gateway_state || '—'],
              ['Gateway Platforms', status?.gateway_platforms ? Object.keys(status.gateway_platforms).length : 0],
              ['Active Profiles', status?.profiles?.length || 0],
              ['Active Sessions', status?.active_sessions || 0],
              ['Memory Pressure', status?.memory_pressure || 'OK'],
              ['Disk Free', `${Math.floor((status?.disk_free_mb || 0)/1024)}GB`],
              ['Disk Total', `${Math.floor((status?.system_total_mb || 0)/1024)}GB`],
              ['Can Update', status?.can_update_hermes ? 'Yes' : 'Current'],
              ['Install ID', status?.install_id || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ fontSize: '13px', color: '#888' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools & Commands */}
        <div className="os-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Quick Commands</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Restart Gateway', icon: IconServer, action: () => window.location.reload() },
              { label: 'Check Updates', icon: IconArrowUp, action: () => {} },
              { label: 'Run hermes doctor', icon: IconWrench, action: () => {} },
              { label: 'View Logs', icon: IconFileText, action: () => {} },
              { label: 'Backup Hermes', icon: IconDownload, action: () => {} },
              { label: 'Spawn Agent', icon: IconTerminal, action: () => {} },
            ].map(({ label, icon: Icon, action }) => (
              <button key={label} onClick={action} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', background: '#111', border: '1px solid #222',
                borderRadius: '6px', color: '#e5e5e5', cursor: 'pointer', fontSize: '13px',
                textAlign: 'left', width: '100%',
              }}>
                <Icon className="" style={{ color: '#3b82f6', width: '16px', height: '16px' }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App Component ─────────────────────────────────────────

export function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    api.getStatus().then(s => setStatus(s)).catch(() => {});
    const interval = setInterval(() => {
      api.getStatus().then(s => setStatus(s)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main style={{
        marginLeft: sidebarCollapsed ? '64px' : '220px',
        flex: 1,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        transition: 'margin-left 0.2s ease',
      }}>
        {/* Top Bar */}
        <header style={{
          height: '56px', borderBottom: '1px solid #222',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', background: '#0d0d0d', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '16px', fontWeight: 700 }}>Harness OS</h1>
            <span className="os-badge os-badge-active">{status?.gateway_running ? 'Online' : 'Offline'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#888' }}>
            <span>v{status?.version || '—'}</span>
            <span style={{ color: '#333' }}>|</span>
            <span>Hermes</span>
          </div>
        </header>

        {/* Content */}
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/builds" element={<BuildsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/system" element={<SystemPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
