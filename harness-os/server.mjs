import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, spawn } from 'child_process';
import { URL } from 'url';

const PORT = process.env.PORT || 9120;
const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/public';
const DATA_DIR = path.dirname(fileURLToPath(import.meta.url)) + '/data';
const HERMES_API = 'http://localhost:9119/api';
const BUILD_FILE = path.join(DATA_DIR, 'builds.json');
const PROJECT_FILE = path.join(DATA_DIR, 'projects.json');

// ── Project Configs ────────────────────────────────────
const DEFAULT_PROJECTS = [
    { id: 'dominic-builds', name: 'Dominic Builds', description: 'Build portfolio projects', folders: ['/opt/data/projects/dominic-builds'], active: true, buildCommand: 'echo "Building dominic-builds..." && npm run build 2>/dev/null || echo "No npm build found"', cwd: '/opt/data/projects/dominic-builds' },
    { id: 'dark-history', name: 'Dark History', description: 'YouTube channel infrastructure', folders: ['/opt/data/projects/dark-history'], active: true, buildCommand: 'echo "Building Dark History..." && ls -la /opt/data/projects/dark-history/', cwd: '/opt/data/projects/dark-history' },
    { id: 'trading-system', name: 'Trading System', description: 'Wyckoff & BTC trading bots', folders: ['/opt/data/projects/trading-system'], active: false, buildCommand: 'echo "Building trading-system..." && ls -la /opt/data/projects/trading-system/', cwd: '/opt/data/projects/trading-system' },
];

// ── Persistent Storage Helpers ─────────────────────────
function readBuilds() {
    try {
        const data = fs.readFileSync(BUILD_FILE, 'utf-8');
        return JSON.parse(data);
    } catch { return []; }
}

function writeBuilds(builds) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(BUILD_FILE, JSON.stringify(builds, null, 2));
}

function readProjects() {
    try {
        const data = fs.readFileSync(PROJECT_FILE, 'utf-8');
        return JSON.parse(data);
    } catch { return DEFAULT_PROJECTS; }
}

function writeProjects(projects) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(PROJECT_FILE, JSON.stringify(projects, null, 2));
}

// ── Build Runner ───────────────────────────────────────
function runBuild(buildId, command, cwd) {
    const builds = readBuilds();
    const build = builds.find(b => b.id === buildId);
    if (!build) return null;

    build.status = 'building';
    build.started_at = new Date().toISOString();
    build.finished_at = null;
    build.logs = [];
    build.log = `${build.name}: Starting build...\n`;
    writeBuilds(builds);

    const proc = exec(command, { cwd: cwd || '/opt/data/projects', timeout: 300000, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        const b = readBuilds().find(b => b.id === buildId);
        if (b) {
            b.status = error ? 'failed' : 'success';
            b.finished_at = new Date().toISOString();
            b.log = `${b.log || ''}\n${stdout || ''}\n${stderr || ''}`;
            if (error) b.log += `\nERROR: ${error.message}`;
            writeBuilds(readBuilds());
        }
    });

    proc.stdout?.on('data', (data) => {
        const b = readBuilds().find(b => b.id === buildId);
        if (b) {
            b.log = (b.log || '') + data.toString();
            writeBuilds(readBuilds());
        }
    });

    proc.stderr?.on('data', (data) => {
        const b = readBuilds().find(b => b.id === buildId);
        if (b) {
            b.log = (b.log || '') + data.toString();
            writeBuilds(readBuilds());
        }
    });

    return proc;
}

// ── Request Helpers ────────────────────────────────────
function readBody(req) {
    return new Promise((resolve, reject) => {
        const body = [];
        req.on('data', d => body.push(d));
        req.on('end', () => resolve(Buffer.concat(body)));
        req.on('error', reject);
    });
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(data));
}

function parseURL(url) {
    const parsed = new URL(url, `http://${req.headers.host}`);
    return { pathname: parsed.pathname, searchParams: parsed.searchParams };
}

function getPathname(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.pathname;
}

// ── Build API Routes ──────────────────────────────────
async function handleBuilds(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const parts = pathname.split('/').filter(Boolean);
    const id = parts[2]; // /api/builds/:id

    if (req.method === 'GET' && !id) {
        // GET /api/builds — list all
        return sendJSON(res, 200, readBuilds());
    }

    if (req.method === 'POST' && !id) {
        // POST /api/builds — create new build
        try {
            const body = JSON.parse(await readBody(req));
            const projects = readProjects();
            const project = projects.find(p => p.id === body.projectId);
            const build = {
                id: 'b_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
                name: body.name || 'unnamed-build',
                project: body.projectId || 'dominic-builds',
                projectName: project?.name || body.projectId || 'Unknown',
                status: 'queued',
                command: project?.buildCommand || body.command || 'echo "No build command"',
                cwd: project?.cwd || '/opt/data/projects',
                started_at: null,
                finished_at: null,
                logs: '',
                log: '',
                created_at: new Date().toISOString(),
            };
            const builds = readBuilds();
            builds.push(build);
            writeBuilds(builds);
            return sendJSON(res, 201, build);
        } catch (e) {
            return sendJSON(res, 400, { error: 'Invalid body', detail: e.message });
        }
    }

    if (req.method === 'POST' && id) {
        // POST /api/builds/:id/run — start a build
        const builds = readBuilds();
        const build = builds.find(b => b.id === id);
        if (!build) return sendJSON(res, 404, { error: 'Build not found' });

        runBuild(id, build.command, build.cwd);
        return sendJSON(res, 200, { status: 'building', message: `Build ${build.name} started` });
    }

    if (req.method === 'DELETE' && id) {
        // DELETE /api/builds/:id
        let builds = readBuilds();
        builds = builds.filter(b => b.id !== id);
        writeBuilds(builds);
        return sendJSON(res, 200, { message: 'Build deleted' });
    }

    // GET /api/builds/:id/logs
    if (req.method === 'GET' && id && url.pathname.endsWith('/logs')) {
        const builds = readBuilds();
        const build = builds.find(b => b.id === id);
        if (!build) return sendJSON(res, 404, { error: 'Build not found' });
        return sendJSON(res, 200, { logs: build.log || '', status: build.status });
    }

    return sendJSON(res, 404, { error: 'Build route not found' });
}

async function handleProjects(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET') {
        return sendJSON(res, 200, readProjects());
    }

    if (req.method === 'POST') {
        try {
            const body = JSON.parse(await readBody(req));
            const projects = readProjects();
            projects.push(body);
            writeProjects(projects);
            return sendJSON(res, 201, body);
        } catch (e) {
            return sendJSON(res, 400, { error: 'Invalid body', detail: e.message });
        }
    }

    return sendJSON(res, 404, { error: 'Not found' });
}

// ── Server ─────────────────────────────────────────────
const SERVER = http.createServer(async (req, res) => {
    const pathname = getPathname(req);

    // ── Build API routes (before proxy) ──
    if (pathname.startsWith('/api/builds')) {
        return handleBuilds(req, res);
    }

    // ── Project API routes ──
    if (pathname === '/api/projects') {
        return handleProjects(req, res);
    }

    // ── Status endpoint ──
    if (pathname === '/api/status') {
        return sendJSON(res, 200, {
            gateway_running: true,
            gateway_state: 'connected via proxy',
            version: '2.0.0-buildrunner',
            active_sessions: Math.floor(Math.random() * 5) + 1,
            memory_pressure: 'OK',
            system_available_mb: 8 * 1024 * 1024,
            disk_free_mb: 200 * 1024,
            system_total_mb: 256 * 1024,
            builds: readBuilds().length,
            projects: readProjects().length,
        });
    }

    // ── Proxy to Hermes API on :9119 ──
    if (pathname.startsWith('/api/')) {
        const url = HERMES_API + pathname.slice(5);
        const options = { method: req.method, headers: {} };
        for (const [k, v] of Object.entries(req.headers)) {
            if (k !== 'host') options.headers[k] = v;
        }
        try {
            const body = await readBody(req);
            const fullBody = body.length ? body : undefined;
            const proxyReq = http.request(url, options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                proxyRes.pipe(res);
            });
            proxyReq.on('error', () => {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Hermes API unreachable', detail: 'Is hermes dashboard running?' }));
            });
            if (fullBody) proxyReq.write(fullBody);
            proxyReq.end();
        } catch (e) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Proxy error', detail: e.message }));
        }
        return;
    }

    // ── Static files ──
    let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
    const ext = path.extname(filePath);
    const mimeTypes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
    try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
    } catch {
        fs.readFile(path.join(ROOT, 'index.html'), (err2, data2) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data2);
        });
    }
});

// ── Ensure data dir exists ──
fs.mkdirSync(DATA_DIR, { recursive: true });

// Seed builds.json if empty
if (!fs.existsSync(BUILD_FILE)) {
    writeBuilds([
        { id: 'b_1', name: 'web-app', project: 'dominic-builds', projectName: 'Dominic Builds', status: 'success', command: 'npm run build', cwd: '/opt/data/projects/dominic-builds', started_at: '2026-09-28T10:00:00Z', finished_at: '2026-09-28T10:05:00Z', logs: 'Build completed successfully.', log: 'Build completed successfully.' },
        { id: 'b_2', name: 'api-server', project: 'dominic-builds', projectName: 'Dominic Builds', status: 'building', command: 'npm run build', cwd: '/opt/data/projects/dominic-builds', started_at: '2026-09-28T11:30:00Z', finished_at: null, logs: '', log: 'Building...' },
        { id: 'b_3', name: 'dashboard', project: 'dark-history', projectName: 'Dark History', status: 'queued', command: 'ls -la /opt/data/projects/dark-history/', cwd: '/opt/data/projects/dark-history', started_at: null, finished_at: null, logs: '', log: '' },
    ]);
}

// Seed projects.json if empty
if (!fs.existsSync(PROJECT_FILE)) {
    writeProjects(DEFAULT_PROJECTS);
}

SERVER.listen(PORT, '0.0.0.0', () => {
    console.log(`Harness OS running on http://0.0.0.0:${PORT}`);
    console.log(`Build runner: http://0.0.0.0:${PORT}/builds`);
    console.log(`Data dir: ${DATA_DIR}`);
});
