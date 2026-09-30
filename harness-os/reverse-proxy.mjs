import http from 'http';
import fs from 'fs';
import path from 'path';
import httpProxy from 'http-proxy';
import { fileURLToPath } from 'url';

const { createProxyServer } = httpProxy;
const proxy = createProxyServer({ changeOrigin: true });
const PORT = 9118;
const ROOT = '/opt/data/harness-os/public';

// Serve static files from the harness-os public directory
function serveStatic(req, res, filePath) {
    const ext = path.extname(filePath);
    const mimeTypes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
    try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html', 'Access-Control-Allow-Origin': '*' });
        res.end(data);
    } catch {
        res.writeHead(404);
        res.end('Not found');
    }
}

const SERVER = http.createServer((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    
    // API routes → proxy to build runner on 9120
    if (url.startsWith('/api/')) {
        const target = 'http://localhost:9120' + url;
        http.get(target, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            proxyRes.pipe(res);
        }).on('error', () => { res.writeHead(502); res.end(JSON.stringify({error: 'Build runner unavailable'})); }).end();
        return;
    }
    
    // Static files (HTML, JS, CSS)
    if (url.endsWith('.html') || url.endsWith('.js') || url.endsWith('.css') || url.endsWith('.json')) {
        serveStatic(req, res, path.join(ROOT, url === '/index.html' ? 'index.html' : url));
        return;
    }
    
    // Serve index.html for the harness dashboard
    if (url === '/harness' || url === '/harness/' || url === '/') {
        serveStatic(req, res, path.join(ROOT, 'index.html'));
        return;
    }
    
    // Everything else → proxy to hermes dashboard on 9119
    proxy.web(req, res, { target: 'http://localhost:9119', changeOrigin: true });
});

SERVER.listen(PORT, '0.0.0.0', () => console.log(`Reverse proxy on :${PORT} → 9120 (builds) + 9119 (hermes)`));
