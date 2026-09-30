// ── API Client ─────────────────────────────────────────────────
const BASE = '/api';
const SESSION_TOKEN = import.meta.env.VITE_HERMES_TOKEN || '';
function headers(extra) {
    return {
        'Content-Type': 'application/json',
        ...(SESSION_TOKEN ? { 'X-Hermes-Session-Token': SESSION_TOKEN } : {}),
        ...extra,
    };
}
async function fetchJSON(url, opts) {
    const res = await fetch(`${BASE}${url}`, {
        ...opts,
        headers: headers(opts?.headers),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `API error: ${res.status}`);
    }
    return res.json();
}
export const api = {
    // Status & System
    getStatus: () => fetchJSON('/status'),
    getHealth: () => fetchJSON('/health'),
    getConfig: () => fetchJSON('/config'),
    // Sessions
    getSessions: () => fetchJSON('/sessions'),
    getSession: (id) => fetchJSON(`/sessions/${id}`),
    createSession: (data) => fetchJSON('/sessions', { method: 'POST', body: JSON.stringify(data) }),
    deleteSession: (id) => fetchJSON(`/sessions/${id}`, { method: 'DELETE' }),
    // Agents (via gateway)
    getAgents: () => fetchJSON('/gateway/agents'),
    getGatewayStatus: () => fetchJSON('/gateway/status'),
    // Cron Jobs
    getCronJobs: () => fetchJSON('/cron/jobs'),
    createCronJob: (data) => fetchJSON('/cron/jobs', { method: 'POST', body: JSON.stringify(data) }),
    deleteCronJob: (id) => fetchJSON(`/cron/jobs/${id}`, { method: 'DELETE' }),
    // Projects
    getProjects: () => fetchJSON('/projects'),
    getProject: (id) => fetchJSON(`/projects/${id}`),
    // Kanban Tasks
    getTasks: (board) => fetchJSON(`/kanban/tasks${board ? `?board=${board}` : ''}`),
    getBoards: () => fetchJSON('/kanban/boards'),
    // Models
    getModels: () => fetchJSON('/models'),
    getModelOptions: () => fetchJSON('/model/options'),
    // Toolsets
    getToolsets: () => fetchJSON('/toolsets'),
    // Skills
    getSkills: () => fetchJSON('/skills'),
    // Analytics
    getAnalytics: () => fetchJSON('/analytics'),
};
// ── Helpers ────────────────────────────────────────────────────
export function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0)
        return `${d}d ${h}h ${m}m`;
    if (h > 0)
        return `${h}h ${m}m`;
    return `${m}m`;
}
export function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
// Icon mapping for the sidebar
export const iconComponents = {};
