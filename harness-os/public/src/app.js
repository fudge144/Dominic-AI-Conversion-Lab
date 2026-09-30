// ═══════════════════════════════════════════════════════════
// Hermes Harness OS — Main Application
// Zero-build vanilla JS app connecting to Hermes API on :9119
// ═══════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:9118/api';
const WS_BASE = 'ws://localhost:9119';

// ── Navigation Configuration ───────────────────────────────
const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', icon: 'grid' },
    { path: '/agents', label: 'Agents', icon: 'cpu' },
    { path: '/tasks', label: 'Tasks', icon: 'layers' },
    { path: '/builds', label: 'Builds', icon: 'zap' },
    { path: '/projects', label: 'Projects', icon: 'folder' },
    { path: '/system', label: 'System', icon: 'server' },
];

// ── Icon SVGs ──────────────────────────────────────────────
const ICONS = {
    grid: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    cpu: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/></svg>',
    layers: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    zap: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    folder: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    server: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    play: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    pause: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    loader: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
    message: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    wrench: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    sparkles: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.91 5.63h5.92L13.5 13.5l4.08 3.38H9.59L12 21 10.09 16.89H6L10.5 9.5 6 6.12h5.92z"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    database: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    code: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    terminal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    fileText: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
};

function icon(name, extra = '') {
    return (ICONS[name] || ICONS.grid) + extra;
}

// ── API Client ─────────────────────────────────────────────
async function apiFetch(url, method = 'GET', body = null) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    try {
        const res = await fetch(`${API_BASE}${url}`, opts);
        if (!res.ok) {
            const err = await res.json().catch(() => ({ detail: res.statusText }));
            throw new Error(err.detail || `HTTP ${res.status}`);
        }
        return await res.json();
    } catch (e) {
        // Return mock data if API unavailable
        return null;
    }
}

// ── Application State ──────────────────────────────────────
const state = {
    currentPage: '/',
    sidebarCollapsed: false,
    status: null,
    agents: [],
    cronJobs: [],
    tasks: [],
    builds: [],
    projects: [],
    loading: true,
};

// ── Render Functions ───────────────────────────────────────
function render() {
    const app = document.getElementById('app');
    app.innerHTML = renderShell();
    renderPage();
    initLucideIcons();
    bindEvents();
}

function renderShell() {
    return `
        <div style="display:flex;height:100vh;overflow:hidden;">
            ${renderSidebar()}
            <main style="flex:1;margin-left:${state.sidebarCollapsed ? '64px' : '220px'};display:flex;flex-direction:column;min-height:100vh;transition:margin-left 0.2s;">
                ${renderHeader()}
                <div id="page-content" style="flex:1;overflow-y:auto;padding:24px;"></div>
            </main>
        </div>`;
}

function renderSidebar() {
    const navItems = NAV_ITEMS.map(item => `
        <a href="${item.path}" data-page="${item.path}" class="sidebar-item ${state.currentPage === item.path ? 'active' : ''}">
            ${icon(item.icon)}
            <span>${item.label}</span>
        </a>`).join('');
    
    return `
        <aside style="width:${state.sidebarCollapsed ? '64px' : '220px'};min-width:${state.sidebarCollapsed ? '64px' : '220px'};background:#0d0d0d;border-right:1px solid #222;display:flex;flex-direction:column;position:fixed;left:0;top:0;height:100vh;z-index:50;transition:width 0.2s;">
            <div style="padding:16px;border-bottom:1px solid #222;display:flex;align-items:center;gap:10px;min-height:56px;">
                <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    ${icon('sparkles')}
                </div>
                ${!state.sidebarCollapsed ? `<div><div style="font-weight:700;font-size:14px;">Harness OS</div><div style="font-size:10px;color:#888;">Hermes Control</div></div>` : ''}
            </div>
            <nav style="flex:1;padding:'8px 0';overflow-y:auto;">${navItems}</nav>
            <div style="padding:8px;border-top:1px solid #222;">
                <button onclick="toggleSidebar()" style="width:100%;padding:8px;border-radius:6px;border:1px solid #333;background:#111;color:#888;cursor:pointer;font-size:12px;">${state.sidebarCollapsed ? '→' : '← Collapse'}</button>
            </div>
        </aside>`;
}

function renderHeader() {
    const st = state.status || {};
    return `
        <header style="height:56px;border-bottom:1px solid #222;display:flex;align-items:center;justify-content:space-between;padding:'0 24px';background:#0d0d0d;flex-shrink:0;">
            <div style="display:flex;align-items:center;gap:12px;">
                <h1 style="font-size:16px;font-weight:700;">Harness OS</h1>
                <span class="badge-${st.gateway_running ? 'active' : 'danger'}">${st.gateway_running ? 'Online' : 'Offline'}</span>
            </div>
            <div style="display:flex;align-items:center;gap:16px;font-size:12px;color:#888;">
                <span>v${st.version || '—'}</span>
                <span style="color:#333;">|</span>
                <span>${st.gateway_state || '—'}</span>
            </div>
        </header>`;
}

function renderPage() {
    const el = document.getElementById('page-content');
    if (!el) return;
    switch (state.currentPage) {
        case '/': el.innerHTML = renderDashboard(); break;
        case '/agents': el.innerHTML = renderAgents(); break;
        case '/tasks': el.innerHTML = renderTasks(); break;
        case '/builds': el.innerHTML = renderBuilds(); break;
        case '/projects': el.innerHTML = renderProjects(); break;
        case '/system': el.innerHTML = renderSystem(); break;
        default: el.innerHTML = renderDashboard();
    }
}

// ── Page: Dashboard ────────────────────────────────────────
function renderDashboard() {
    const s = state.status || {};
    return `
        <h1 style="font-size:22px;font-weight:700;margin-bottom:24px;">Dashboard</h1>
        <div style="display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap;">
            <div class="card-hover" style="flex:1;min-width:160px;background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
                    <div style="width:40px;height:40px;border-radius:10px;background:${s.gateway_running ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};display:flex;align-items:center;justify-content:center;">${icon('server', `style="color:${s.gateway_running ? '#22c55e' : '#ef4444'};width:20px;height:20px"`) }</div>
                    <div><div style="font-size:11px;color:#888;text-transform:uppercase;">Gateway</div><div style="font-size:24px;font-weight:700;">${s.gateway_running ? 'Online' : 'Offline'}</div></div>
                </div>
                <div style="font-size:11px;color:#888;">${s.gateway_state || 'Not connected'}</div>
            </div>
            <div class="card-hover" style="flex:1;min-width:160px;background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
                    <div style="width:40px;height:40px;border-radius:10px;background:rgba(59,130,246,0.15);display:flex;align-items:center;justify-content:center;">${icon('message', 'style="color:#3b82f6;width:20px;height:20px"')}</div>
                    <div><div style="font-size:11px;color:#888;text-transform:uppercase;">Sessions</div><div style="font-size:24px;font-weight:700;">${s.active_sessions || 0}</div></div>
                </div>
                <div style="font-size:11px;color:#888;">Active connections</div>
            </div>
            <div class="card-hover" style="flex:1;min-width:160px;background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
                    <div style="width:40px;height:40px;border-radius:10px;background:rgba(34,197,94,0.15);display:flex;align-items:center;justify-content:center;">${icon('database', 'style="color:#22c55e;width:20px;height:20px"')}</div>
                    <div><div style="font-size:11px;color:#888;text-transform:uppercase;">Memory</div><div style="font-size:24px;font-weight:700;">${s.memory_pressure || 'OK'}</div></div>
                </div>
                <div style="font-size:11px;color:#888;">${Math.floor((s.system_available_mb || 0)/1024)}GB free</div>
            </div>
            <div class="card-hover" style="flex:1;min-width:160px;background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
                    <div style="width:40px;height:40px;border-radius:10px;background:rgba(139,92,246,0.15);display:flex;align-items:center;justify-content:center;">${icon('folder', 'style="color:#8b5cf6;width:20px;height:20px"')}</div>
                    <div><div style="font-size:11px;color:#888;text-transform:uppercase;">Disk</div><div style="font-size:24px;font-weight:700;">${Math.floor((s.disk_free_mb || 0)/1024)}GB</div></div>
                </div>
                <div style="font-size:11px;color:#888;">${Math.round(((s.system_total_mb||0)-(s.disk_free_mb||0))/(s.system_total_mb||1)*100)}% used</div>
            </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:24px;">
            <button class="btn-primary" style="display:flex;align-items:center;gap:8px;">${icon('plus')} New Agent</button>
            <button class="btn-secondary" style="display:flex;align-items:center;gap:8px;">${icon('zap')} New Build</button>
            <button class="btn-secondary" style="display:flex;align-items:center;gap:8px;">${icon('folder')} New Project</button>
        </div>
        <div style="display:grid;grid-template-columns:'repeat(auto-fill,minmax(300px,1fr))';gap:16px;">
            <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <h3 style="font-size:16px;font-weight:600;margin-bottom:16px;">System Status</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${[['Version', `v${s.version || '—'}`], ['Release', s.release_date || '—'], ['Profiles', s.profiles?.length || 0], ['Agents', s.active_agents || 0]].map(([k,v]) => `
                        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1a1a1a;">
                            <span style="font-size:12px;color:#888;">${k}</span>
                            <span style="font-size:13px;font-weight:600;">${v}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <h3 style="font-size:16px;font-weight:600;margin-bottom:16px;">Quick Access</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${['Spawn Agent','New Build','View Logs','Check Status','Run Doctor'].map(label => `
                        <button style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#111;border:1px solid #222;border-radius:6px;color:#e5e5e5;cursor:pointer;font-size:13px;text-align:left;width:100%;">${icon('terminal', 'style="color:#3b82f6;width:16px;height:16px"')} ${label}</button>
                    `).join('')}
                </div>
            </div>
        </div>`;
}

// ── Page: Agents ───────────────────────────────────────────
function renderAgents() {
    const agents = state.agents.length ? state.agents : [
        { id: 'gw', name: 'Gateway', status: 'running', model: 'LFM2.5', profile: 'default', uptime: 3600 },
        { id: 'an', name: 'Analyst', status: 'running', model: 'Claude', profile: 'analyst', uptime: 1800 },
        { id: 'co', name: 'Coder', status: 'running', model: 'GPT-4', profile: 'coder', uptime: 900 },
        { id: 'tr', name: 'Trader', status: 'idle', model: 'LFM2.5', profile: 'trader', uptime: 0 },
    ];
    return `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h1 style="font-size:22px;font-weight:700;">Agents</h1>
            <button class="btn-primary" style="display:flex;align-items:center;gap:8px;">${icon('plus')} Spawn Agent</button>
        </div>
        <div style="display:grid;grid-template-columns:'repeat(auto-fill,minmax(280px,1fr))';gap:16px;">
            ${agents.map(a => `
                <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="width:36px;height:36px;border-radius:8px;background:#1a1a1a;display:flex;align-items:center;justify-content:center;border:1px solid #222;">${icon('cpu', 'style="color:#3b82f6;width:18px;height:18px"')}</div>
                            <div><div style="font-weight:600;font-size:14px;">${a.name}</div><div style="font-size:11px;color:#888;">${a.profile}</div></div>
                        </div>
                        <span class="badge-${a.status === 'running' ? 'active' : a.status === 'error' ? 'danger' : 'warning'}">${a.status}</span>
                    </div>
                    <div style="font-size:12px;color:#888;margin-bottom:8px;">Model: ${a.model} ${a.uptime ? `| Uptime: ${formatUptime(a.uptime)}` : '| Idle'}</div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn-primary" style="padding:4px 12px;font-size:11px;">${icon('play')} Start</button>
                        <button class="btn-secondary" style="padding:4px 12px;font-size:11px;">${icon('pause')} Pause</button>
                        <button class="btn-danger" style="padding:4px 10px;font-size:11px;">${icon('trash')}</button>
                    </div>
                </div>
            `).join('')}
        </div>`;
}

// ── Page: Tasks ────────────────────────────────────────────
function renderTasks() {
    const cronJobs = state.cronJobs.length ? state.cronJobs : [
        { id: '1', name: 'wyckoff-market-scan-4h', schedule: 'every 240m', status: 'active', next_run: '2026-09-28T12:57:00Z', deliver: 'telegram' },
        { id: '2', name: 'daily-morning-briefing', schedule: '0 8 * * *', status: 'active', next_run: '2026-09-29T08:00:00Z', deliver: 'telegram' },
    ];
    const tasks = state.tasks.length ? state.tasks : [
        { id: 't_5f5ac352', title: 'Cost-Optimized SEO & Content Pipelines', agent: 'researcher-a', status: 'ready' },
        { id: 't_a1899f3f', title: 'Sandboxed Ads & Growth Engines', agent: 'researcher-a', status: 'ready' },
        { id: 't_1c12e0c1', title: 'Verify Solar Pro4 config', agent: 'analyst', status: 'done' },
    ];
    return `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h1 style="font-size:22px;font-weight:700;">Tasks & Automation</h1>
            <div style="display:flex;gap:8px;">
                <button class="btn-primary" style="display:flex;align-items:center;gap:8px;">${icon('plus')} New Cron Job</button>
                <button class="btn-secondary" style="display:flex;align-items:center;gap:8px;">${icon('plus')} New Task</button>
            </div>
        </div>
        <div style="display:grid;grid-template-columns:'1fr 1fr';gap:24px;">
            <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <h2 style="font-size:16px;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px;">${icon('clock')} Scheduled Jobs</h2>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${cronJobs.map(j => `
                        <div style="padding:12px;background:#111;border-radius:8px;border:1px solid #222;display:flex;justify-content:space-between;align-items:center;">
                            <div><div style="font-size:13px;font-weight:600;">${j.name}</div><div style="font-size:11px;color:#888;margin-top:2px;">${j.schedule} · ${j.deliver}</div></div>
                            <span class="badge-${j.status === 'active' ? 'active' : 'warning'}">${j.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <h2 style="font-size:16px;font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px;">${icon('layers')} Task Board</h2>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${tasks.map(t => `
                        <div style="padding:12px;background:#111;border-radius:8px;border:1px solid #222;display:flex;justify-content:space-between;align-items:center;">
                            <div><div style="font-size:13px;font-weight:600;">${t.title}</div><div style="font-size:11px;color:#888;margin-top:2px;">Agent: ${t.agent}</div></div>
                            <span class="badge-${t.status === 'done' ? 'active' : t.status === 'running' ? 'warning' : 'info'}">${t.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
}

// ── Page: Builds (FULLY WIRED) ──────────────────────────
function renderBuilds() {
    const builds = state.builds || [];
    if (builds.length === 0) {
        return `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h1 style="font-size:22px;font-weight:700;">Builds</h1>
            <button class="btn-primary" id="btn-new-build" style="display:flex;align-items:center;gap:8px;">${icon('plus')} New Build</button>
        </div>
        <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:40px;text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">⚡</div>
            <div style="font-size:16px;font-weight:600;margin-bottom:8px;">No builds yet</div>
            <div style="font-size:13px;color:#888;margin-bottom:20px;">Create your first build to get started</div>
            <button class="btn-primary" id="btn-new-build-empty" style="display:flex;align-items:center;gap:8px;margin:0 auto;">${icon('plus')} New Build</button>
        </div>
        
        <!-- Create Build Modal -->
        <div id="build-modal" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:100;display:flex;align-items:center;justify-content:center;">
            <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;width:480px;max-width:90vw;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <h2 style="font-size:18px;font-weight:700;">New Build</h2>
                    <button id="btn-close-modal" style="background:none;border:none;color:#888;cursor:pointer;font-size:20px;">${icon('x')}</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="font-size:12px;color:#888;display:block;margin-bottom:6px;">Build Name</label>
                        <input id="modal-build-name" type="text" placeholder="my-build" style="width:100%;padding:10px;background:#0d0d0d;border:1px solid #333;border-radius:6px;color:#e5e5e5;font-size:14px;outline:none;">
                    </div>
                    <div>
                        <label style="font-size:12px;color:#888;display:block;margin-bottom:6px;">Project</label>
                        <select id="modal-build-project" style="width:100%;padding:10px;background:#0d0d0d;border:1px solid #333;border-radius:6px;color:#e5e5e5;font-size:14px;outline:none;">
                            ${state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:12px;color:#888;display:block;margin-bottom:6px;">Build Command</label>
                        <textarea id="modal-build-cmd" rows="3" placeholder="npm run build" style="width:100%;padding:10px;background:#0d0d0d;border:1px solid #333;border-radius:6px;color:#e5e5e5;font-size:14px;outline:none;resize:vertical;font-family:monospace;"></textarea>
                    </div>
                    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
                        <button class="btn-secondary" id="btn-cancel-build" style="padding:8px 20px;">Cancel</button>
                        <button class="btn-primary" id="btn-submit-build" style="padding:8px 20px;display:flex;align-items:center;gap:6px;">${icon('plus')} Create Build</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Log Viewer Modal -->
        <div id="log-modal" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:100;align-items:center;justify-content:center;">
            <div style="background:#0d0d0d;border:1px solid #333;border-radius:12px;padding:24px;width:640px;max-width:90vw;max-height:80vh;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h2 style="font-size:18px;font-weight:700;" id="log-modal-title">Build Logs</h2>
                    <button id="btn-close-log" style="background:none;border:none;color:#888;cursor:pointer;font-size:20px;">${icon('x')}</button>
                </div>
                <div id="log-content" style="background:#000;border:1px solid #222;border-radius:8px;padding:16px;font-family:monospace;font-size:13px;color:#22c55e;overflow-y:auto;max-height:60vh;white-space:pre-wrap;"></div>
                <div style="margin-top:16px;text-align:right;">
                    <button class="btn-secondary" id="btn-refresh-logs" style="padding:8px 20px;">${icon('refresh')} Refresh</button>
                </div>
            </div>
        </div>`;
    }
    return `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h1 style="font-size:22px;font-weight:700;">Builds</h1>
            <button class="btn-primary" id="btn-new-build" style="display:flex;align-items:center;gap:8px;">${icon('plus')} New Build</button>
        </div>
        <div style="display:grid;grid-template-columns:'repeat(auto-fill,minmax(340px,1fr))';gap:16px;">
            ${builds.map(b => renderBuildCard(b))}
        </div>
        
        <!-- Create Build Modal -->
        <div id="build-modal" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:100;display:flex;align-items:center;justify-content:center;">
            <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;width:480px;max-width:90vw;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <h2 style="font-size:18px;font-weight:700;">New Build</h2>
                    <button id="btn-close-modal" style="background:none;border:none;color:#888;cursor:pointer;font-size:20px;">${icon('x')}</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="font-size:12px;color:#888;display:block;margin-bottom:6px;">Build Name</label>
                        <input id="modal-build-name" type="text" placeholder="my-build" style="width:100%;padding:10px;background:#0d0d0d;border:1px solid #333;border-radius:6px;color:#e5e5e5;font-size:14px;outline:none;">
                    </div>
                    <div>
                        <label style="font-size:12px;color:#888;display:block;margin-bottom:6px;">Project</label>
                        <select id="modal-build-project" style="width:100%;padding:10px;background:#0d0d0d;border:1px solid #333;border-radius:6px;color:#e5e5e5;font-size:14px;outline:none;">
                            ${state.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:12px;color:#888;display:block;margin-bottom:6px;">Build Command</label>
                        <textarea id="modal-build-cmd" rows="3" placeholder="npm run build" style="width:100%;padding:10px;background:#0d0d0d;border:1px solid #333;border-radius:6px;color:#e5e5e5;font-size:14px;outline:none;resize:vertical;font-family:monospace;"></textarea>
                    </div>
                    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
                        <button class="btn-secondary" id="btn-cancel-build" style="padding:8px 20px;">Cancel</button>
                        <button class="btn-primary" id="btn-submit-build" style="padding:8px 20px;display:flex;align-items:center;gap:6px;">${icon('plus')} Create Build</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Log Viewer Modal -->
        <div id="log-modal" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:100;align-items:center;justify-content:center;">
            <div style="background:#0d0d0d;border:1px solid #333;border-radius:12px;padding:24px;width:640px;max-width:90vw;max-height:80vh;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h2 style="font-size:18px;font-weight:700;" id="log-modal-title">Build Logs</h2>
                    <button id="btn-close-log" style="background:none;border:none;color:#888;cursor:pointer;font-size:20px;">${icon('x')}</button>
                </div>
                <div id="log-content" style="background:#000;border:1px solid #222;border-radius:8px;padding:16px;font-family:monospace;font-size:13px;color:#22c55e;overflow-y:auto;max-height:60vh;white-space:pre-wrap;"></div>
                <div style="margin-top:16px;text-align:right;">
                    <button class="btn-secondary" id="btn-refresh-logs" style="padding:8px 20px;">${icon('refresh')} Refresh</button>
                </div>
            </div>
        </div>`;
}

function renderBuildCard(b) {
    const statusColors = { success: '#22c55e', building: '#f59e0b', failed: '#ef4444', queued: '#6366f1', pending: '#6366f1' };
    const statusColor = statusColors[b.status] || '#6366f1';
    const statusBadge = b.status === 'building' ? `${icon('loader')} ` : '';
    return `
        <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div>
                    <div style="font-weight:600;font-size:14px;">${b.name}</div>
                    <div style="font-size:11px;color:#888;margin-top:2px;">${b.projectName || b.project}</div>
                </div>
                <span class="badge-${b.status === 'success' ? 'active' : b.status === 'building' ? 'warning' : b.status === 'failed' ? 'danger' : 'info'}" style="border-color:${statusColor};">${statusBadge}${b.status}</span>
            </div>
            <div style="font-size:12px;color:#888;margin-bottom:8px;">
                ${b.started_at ? `Started: ${new Date(b.started_at).toLocaleString()}` : 'Queued'}
                ${b.finished_at ? ` → Finished: ${new Date(b.finished_at).toLocaleString()}` : ''}
            </div>
            <div style="font-size:11px;color:#555;margin-bottom:12px;font-family:monospace;">${b.command || '—'}</div>
            <div style="display:flex;gap:8px;">
                ${b.status === 'queued' || b.status === 'failed' || !b.started_at ? `<button class="btn-primary" style="padding:4px 12px;font-size:11px;" data-action="run-build" data-id="${b.id}">${icon('play')} Run</button>` : ''}
                <button class="btn-secondary" style="padding:4px 12px;font-size:11px;" data-action="show-logs" data-id="${b.id}">${icon('log')} Logs</button>
                ${b.status !== 'building' ? `<button class="btn-secondary" style="padding:4px 10px;font-size:11px;color:#ef4444;" data-action="delete-build" data-id="${b.id}">${icon('trash')}</button>` : ''}
            </div>
            ${b.status === 'building' ? `<div style="margin-top:12px;"><div style="height:4px;background:#222;border-radius:2px;overflow:hidden;"><div style="height:100%;width:60%;background:#f59e0b;border-radius:2px;animation:loading 1s ease-in-out infinite;"></div></div></div>` : ''}
        </div>`;
}

// ── Page: Projects ─────────────────────────────────────────
function renderProjects() {
    const projects = state.projects.length ? state.projects : [
        { id: 'dominic-builds', name: 'Dominic Builds', description: 'Build portfolio projects', folders: ['/opt/data/projects/dominic-builds'], active: true },
        { id: 'dark-history', name: 'Dark History', description: 'YouTube channel infrastructure', folders: ['/opt/data/projects/dark-history'], active: true },
        { id: 'trading-system', name: 'Trading System', description: 'Wyckoff & BTC trading bots', folders: ['/opt/data/projects/trading-system'], active: false },
    ];
    return `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h1 style="font-size:22px;font-weight:700;">Projects</h1>
            <button class="btn-primary" style="display:flex;align-items:center;gap:8px;">${icon('plus')} New Project</button>
        </div>
        <div style="display:grid;grid-template-columns:'repeat(auto-fill,minmax(300px,1fr))';gap:16px;">
            ${projects.map(p => `
                <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="width:36px;height:36px;border-radius:8px;background:${p.active ? '#1a1a1a' : '#0d0d0d'};display:flex;align-items:center;justify-content:center;border:1px solid #222;">${icon('folder', `style="color:${p.active ? '#3b82f6' : '#555'};width:18px;height:18px"`) }</div>
                            <div><div style="font-weight:600;font-size:14px;">${p.name}</div><div style="font-size:11px;color:#888;">${p.folders.length} folder(s)</div></div>
                        </div>
                        <span class="${p.active ? 'badge-active' : 'badge-info'}">${p.active ? 'Active' : 'Parked'}</span>
                    </div>
                    <div style="font-size:13px;color:#888;margin-bottom:16px;">${p.description}</div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn-primary" style="padding:4px 12px;font-size:11px;">Open</button>
                        <button class="btn-secondary" style="padding:4px 12px;font-size:11px;">Configure</button>
                        <button class="btn-secondary" style="padding:4px 12px;font-size:11px;">Build</button>
                    </div>
                </div>
            `).join('')}
        </div>`;
}

// ── Page: System ───────────────────────────────────────────
function renderSystem() {
    const s = state.status || {};
    return `
        <h1 style="font-size:22px;font-weight:700;margin-bottom:24px;">System</h1>
        <div style="display:grid;grid-template-columns:'1fr 1fr';gap:24px;">
            <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <h2 style="font-size:16px;font-weight:600;margin-bottom:16px;">System Info</h2>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${[['Version', `v${s.version || '—'}`], ['Release Date', s.release_date || '—'], ['Config Version', s.config_version || '—'], ['Gateway State', s.gateway_state || '—'], ['Profiles', s.profiles?.length || 0], ['Active Sessions', s.active_sessions || 0], ['Memory', s.memory_pressure || 'OK'], ['Disk Free', `${Math.floor((s.disk_free_mb||0)/1024)}GB`], ['Disk Total', `${Math.floor((s.system_total_mb||0)/1024)}GB`]].map(([k,v]) => `
                        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1a1a1a;">
                            <span style="font-size:12px;color:#888;">${k}</span>
                            <span style="font-size:13px;font-weight:600;">${v}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:20px;">
                <h2 style="font-size:16px;font-weight:600;margin-bottom:16px;">Quick Commands</h2>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${['Restart Gateway','Check Updates','Run Doctor','View Logs','Backup Herme','Spawn Agent'].map(label => `
                        <button style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#111;border:1px solid #222;border-radius:6px;color:#e5e5e5;cursor:pointer;font-size:13px;text-align:left;width:100%;">${icon('wrench', 'style="color:#3b82f6;width:16px;height:16px"')} ${label}</button>
                    `).join('')}
                </div>
            </div>
        </div>`;
}

// ── Helpers ────────────────────────────────────────────────
function formatUptime(seconds) {
    if (!seconds || seconds < 60) return '< 1m';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

// ── Build Action Functions ────────────────────────
async function createBuild() {
    const name = document.getElementById('modal-build-name')?.value?.trim();
    const projectId = document.getElementById('modal-build-project')?.value;
    const command = document.getElementById('modal-build-cmd')?.value?.trim();
    if (!name) { alert('Please enter a build name'); return; }
    const result = await apiFetch('/builds', 'POST', { name, projectId, command });
    if (result) { closeModal('build-modal'); fetchData(); }
    else alert('Failed to create build');
}

async function runBuild(id) {
    const result = await apiFetch(`/builds/${id}/run`, 'POST');
    if (result) {
        const build = state.builds.find(b => b.id === id);
        if (build) { build.status = 'building'; build.started_at = new Date().toISOString(); }
        render();
        pollBuildStatus(id);
    } else alert('Failed to start build');
}

async function deleteBuild(id) {
    if (!confirm('Delete this build?')) return;
    const result = await apiFetch(`/builds/${id}`, 'DELETE');
    if (result) fetchData();
    else alert('Failed to delete build');
}

async function showLogs(id) {
    const build = state.builds.find(b => b.id === id);
    if (!build) return;
    const title = document.getElementById('log-modal-title');
    const content = document.getElementById('log-content');
    if (title) title.textContent = `Logs: ${build.name}`;
    if (content) content.textContent = build.log || 'No logs yet. Run the build first.';
    const modal = document.getElementById('log-modal');
    if (modal) modal.style.display = 'flex';
}

async function pollBuildStatus(id) {
    let attempts = 0;
    const interval = setInterval(async () => {
        attempts++;
        const build = await apiFetch(`/builds/${id}`);
        if (build && build.status === 'building' && attempts < 30) {
            const b = state.builds.find(b => b.id === id);
            if (b) b.status = 'building';
            render();
            const logs = await apiFetch(`/builds/${id}/logs`);
            if (logs && document.getElementById('log-content')) document.getElementById('log-content').textContent = logs.logs || logs.log || '';
        } else { clearInterval(interval); fetchData(); render(); }
    }, 2000);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function initLucideIcons() {
    try { lucide.createIcons(); } catch(e) {}
}

function bindEvents() {
    // Navigation
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const page = el.dataset.page;
            if (page) navigateTo(page);
        });
    });
    
    // New Build buttons
    document.getElementById('btn-new-build')?.addEventListener('click', () => {
        document.getElementById('build-modal').style.display = 'flex';
    });
    document.getElementById('btn-new-build-empty')?.addEventListener('click', () => {
        document.getElementById('build-modal').style.display = 'flex';
    });
    
    // Modal close buttons
    document.getElementById('btn-close-modal')?.addEventListener('click', () => closeModal('build-modal'));
    document.getElementById('btn-cancel-build')?.addEventListener('click', () => closeModal('build-modal'));
    document.getElementById('btn-submit-build')?.addEventListener('click', createBuild);
    
    // Build modal backdrop click to close
    document.getElementById('build-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'build-modal') closeModal('build-modal');
    });
    
    // Log modal
    document.getElementById('btn-close-log')?.addEventListener('click', () => closeModal('log-modal'));
    document.getElementById('log-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'log-modal') closeModal('log-modal');
    });
    
    // Delegated build action buttons (Run, Logs, Delete)
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            if (action === 'run-build') runBuild(id);
            else if (action === 'show-logs') showLogs(id);
            else if (action === 'delete-build') deleteBuild(id);
        });
    });
}

function navigateTo(page) {
    state.currentPage = page;
    render();
}

function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    render();
}

// ── Data Fetching ──────────────────────────────────────────
async function fetchData() {
    const status = await apiFetch('/status');
    if (status) state.status = status;
    
    const agents = await apiFetch('/gateway/agents');
    if (agents) state.agents = agents;
    
    const cronJobs = await apiFetch('/cron/jobs');
    if (cronJobs) state.cronJobs = cronJobs;
    
    const tasks = await apiFetch('/tasks');
    if (tasks) state.tasks = tasks;
    
    const projects = await apiFetch('/projects');
    if (projects) state.projects = projects;
    
    // Fetch builds — the key data source
    const builds = await apiFetch('/builds');
    if (builds) state.builds = builds;
    
    state.loading = false;
    render();
}

// ── Init ───────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    // Check current path
    const path = window.location.pathname || '/';
    state.currentPage = path;
    
    fetchData();
    
    // Refresh status every 30s
    setInterval(fetchData, 30000);
});

window.navigateTo = navigateTo;
window.toggleSidebar = toggleSidebar;
window.createBuild = createBuild;
window.runBuild = runBuild;
window.deleteBuild = deleteBuild;
window.showLogs = showLogs;
window.closeModal = closeModal;