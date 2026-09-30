import type { ComponentType } from 'react';

// ── Types ──────────────────────────────────────────────────────

export interface AgentInfo {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'stopped' | 'error';
  model: string;
  profile: string;
  uptime?: number;
  tasks?: number;
  started_at?: string;
}

export interface SessionInfo {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  model: string;
  status: string;
  messages?: number;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  status: 'active' | 'paused' | 'error';
  next_run: string;
  last_run?: string;
  deliver: string;
  workdir: string;
  execution_id?: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  folders: string[];
  active: boolean;
}

export interface TaskInfo {
  id: string;
  title: string;
  agent: string;
  status: 'ready' | 'running' | 'blocked' | 'done';
  priority: string;
  board: string;
  created_at: string;
}

export interface SystemStatus {
  version: string;
  gateway_running: boolean;
  gateway_state: string;
  active_sessions: number;
  active_agents: number;
  memory_pressure: 'ok' | 'warning' | 'critical';
  disk_free_mb: number;
  system_total_mb: number;
  uptime_seconds: number;
}

export interface BuildInfo {
  id: string;
  name: string;
  project: string;
  status: 'pending' | 'building' | 'success' | 'failed';
  started_at?: string;
  finished_at?: string;
  output?: string;
}

// ── API Client ─────────────────────────────────────────────────

const BASE = '/api';
const SESSION_TOKEN = import.meta.env.VITE_HERMES_TOKEN || '';

function headers(extra?: HeadersInit): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(SESSION_TOKEN ? { 'X-Hermes-Session-Token': SESSION_TOKEN } : {}),
    ...extra,
  };
}

async function fetchJSON<T>(url: string, opts?: RequestInit): Promise<T> {
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
  getStatus: () => fetchJSON<SystemStatus>('/status'),
  getHealth: () => fetchJSON<Record<string, unknown>>('/health'),
  getConfig: () => fetchJSON<Record<string, unknown>>('/config'),

  // Sessions
  getSessions: () => fetchJSON<SessionInfo[]>('/sessions'),
  getSession: (id: string) => fetchJSON<SessionInfo>(`/sessions/${id}`),
  createSession: (data: { prompt?: string; model?: string }) =>
    fetchJSON<SessionInfo>('/sessions', { method: 'POST', body: JSON.stringify(data) }),
  deleteSession: (id: string) => fetchJSON<Record<string, unknown>>(`/sessions/${id}`, { method: 'DELETE' }),

  // Agents (via gateway)
  getAgents: () => fetchJSON<AgentInfo[]>('/gateway/agents'),
  getGatewayStatus: () => fetchJSON<Record<string, unknown>>('/gateway/status'),

  // Cron Jobs
  getCronJobs: () => fetchJSON<CronJob[]>('/cron/jobs'),
  createCronJob: (data: Record<string, unknown>) =>
    fetchJSON<CronJob>('/cron/jobs', { method: 'POST', body: JSON.stringify(data) }),
  deleteCronJob: (id: string) => fetchJSON<Record<string, unknown>>(`/cron/jobs/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => fetchJSON<ProjectInfo[]>('/projects'),
  getProject: (id: string) => fetchJSON<ProjectInfo>(`/projects/${id}`),

  // Kanban Tasks
  getTasks: (board?: string) => fetchJSON<TaskInfo[]>(`/kanban/tasks${board ? `?board=${board}` : ''}`),
  getBoards: () => fetchJSON<Record<string, unknown>[]>('/kanban/boards'),

  // Models
  getModels: () => fetchJSON<Record<string, unknown>>('/models'),
  getModelOptions: () => fetchJSON<Record<string, unknown>>('/model/options'),

  // Toolsets
  getToolsets: () => fetchJSON<Record<string, unknown>[]>('/toolsets'),

  // Skills
  getSkills: () => fetchJSON<Record<string, unknown>[]>('/skills'),

  // Analytics
  getAnalytics: () => fetchJSON<Record<string, unknown>>('/analytics'),
};

// ── Helpers ────────────────────────────────────────────────────

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Icon mapping for the sidebar
export const iconComponents: Record<string, ComponentType<{ className?: string }>> = {};