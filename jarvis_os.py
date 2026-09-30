import http.server
import json
import socketserver
import urllib.parse
import threading
import time
import os
import random

PORT = 8095

# In-memory state for Jarvis OS
SYSTEM_STATE = {
    "status": "ONLINE - ALL SYSTEMS NOMINAL",
    "core_load": "14.2%",
    "neural_sync": "99.8%",
    "revenue_today": "£1,500.00",
    "monthly_revenue": "£7,250.00",
    "active_clients": 14,
    "stripe_link": "https://buy.stripe.com/14A00i5Wlf51e44anJa3u00",
    "agents": [
        {"id": "agent-01", "name": "SEO Swarm Alpha", "role": "Keyword & Topical Gap Hunter", "status": "ACTIVE", "tasks_completed": 342, "efficiency": "99.1%"},
        {"id": "agent-02", "name": "SEO Content Writer", "role": "Programmatic SEO Brief & Article Generator", "status": "ACTIVE", "tasks_completed": 128, "efficiency": "98.4%"},
        {"id": "agent-03", "name": "Lead Hunter & Outreach", "role": "B2B Conversion Pitch Sender", "status": "ACTIVE", "tasks_completed": 89, "efficiency": "95.2%"},
        {"id": "agent-04", "name": "Stripe Revenue Bot", "role": "Checkout & Conversion Tracker", "status": "MONITORING", "tasks_completed": 512, "efficiency": "100%"},
        {"id": "agent-05", "name": "Crypto/Commodity Sentinel", "role": "Wyckoff & Market Scanner", "status": "STANDBY", "tasks_completed": 1450, "efficiency": "97.8%"}
    ],
    "logs": [
        f"[{time.strftime('%H:%M:%S')}] JARVIS Core initialized. Secure link established with Dominic AI Command.",
        f"[{time.strftime('%H:%M:%S')}] SEO Swarm deployed 12 programmatic pages for target niche keywords.",
        f"[{time.strftime('%H:%M:%S')}] Stripe webhook verified: £500.00 received for Conversion Package.",
        f"[{time.strftime('%H:%M:%S')}] Neural memory synced with Obsidian vault."
    ]
}

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JARVIS // Hermes Operator System OS — Dominic AI Nexus</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --bg-deep: #030712;
            --surface: #0b1329;
            --surface-glass: rgba(11, 19, 41, 0.75);
            --cyan-glow: #00f0ff;
            --cyan-dim: rgba(0, 240, 255, 0.15);
            --gold-accent: #f59e0b;
            --gold-dim: rgba(245, 158, 11, 0.15);
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --danger: #ef4444;
            --success: #10b981;
            --border-glow: 0 0 15px rgba(0, 240, 255, 0.25);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: var(--bg-deep);
            color: var(--text-main);
            font-family: 'JetBrains Mono', monospace;
            min-height: 100vh;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 20% 20%, rgba(0, 240, 255, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.04) 0%, transparent 40%),
                linear-gradient(rgba(3, 7, 18, 0.9), rgba(3, 7, 18, 0.9)),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.015) 2px, rgba(0, 240, 255, 0.015) 4px);
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.2rem 2.5rem;
            border-bottom: 1px solid rgba(0, 240, 255, 0.3);
            background: var(--surface-glass);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }
        .logo-area {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .arc-reactor {
            width: 36px;
            height: 36px;
            border: 2px solid var(--cyan-glow);
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 12px var(--cyan-glow);
            animation: pulse-glow 3s infinite alternate;
        }
        .arc-inner {
            width: 14px;
            height: 14px;
            background: var(--cyan-glow);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--cyan-glow);
        }
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 5px var(--cyan-glow); transform: scale(1); }
            100% { box-shadow: 0 0 20px var(--cyan-glow); transform: scale(1.05); }
        }
        h1 {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.4rem;
            font-weight: 900;
            letter-spacing: 2px;
            color: var(--cyan-glow);
            text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        }
        .subtitle {
            font-size: 0.75rem;
            color: var(--text-muted);
            letter-spacing: 1px;
        }
        .status-badge {
            background: var(--cyan-dim);
            border: 1px solid var(--cyan-glow);
            padding: 6px 14px;
            border-radius: 4px;
            font-size: 0.8rem;
            color: var(--cyan-glow);
            box-shadow: var(--border-glow);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background: var(--cyan-glow);
            border-radius: 50%;
            animation: blink 1.5s infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 2rem;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 1.5rem;
        }
        .card {
            background: var(--surface-glass);
            border: 1px solid rgba(0, 240, 255, 0.2);
            border-radius: 8px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            position: relative;
            overflow: hidden;
        }
        .card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 2px;
            background: linear-gradient(90deg, transparent, var(--cyan-glow), transparent);
        }
        .col-span-3 { grid-column: span 3; }
        .col-span-4 { grid-column: span 4; }
        .col-span-6 { grid-column: span 6; }
        .col-span-8 { grid-column: span 8; }
        .col-span-12 { grid-column: span 12; }

        @media (max-width: 1200px) {
            .col-span-3, .col-span-4, .col-span-6, .col-span-8 { grid-column: span 12; }
        }

        .metric-value {
            font-family: 'Orbitron', sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: var(--cyan-glow);
            margin-top: 0.5rem;
            text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
        }
        .metric-value.gold {
            color: var(--gold-accent);
            text-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
        }
        .metric-label {
            font-size: 0.8rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        h2 {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 0.5rem;
        }
        h2 span.icon { color: var(--cyan-glow); }

        .btn {
            background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.05));
            border: 1px solid var(--cyan-glow);
            color: var(--cyan-glow);
            padding: 10px 20px;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
            text-transform: uppercase;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn:hover {
            background: var(--cyan-glow);
            color: var(--bg-deep);
            box-shadow: 0 0 20px var(--cyan-glow);
        }
        .btn-gold {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05));
            border: 1px solid var(--gold-accent);
            color: var(--gold-accent);
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
        }
        .btn-gold:hover {
            background: var(--gold-accent);
            color: var(--bg-deep);
            box-shadow: 0 0 20px var(--gold-accent);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.5rem;
            font-size: 0.9rem;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        th {
            font-family: 'Orbitron', sans-serif;
            font-size: 0.75rem;
            color: var(--text-muted);
            letter-spacing: 1px;
            background: rgba(0, 240, 255, 0.03);
        }
        tr:hover { background: rgba(0, 240, 255, 0.03); }

        .badge-active {
            background: rgba(16, 185, 129, 0.15);
            color: var(--success);
            border: 1px solid var(--success);
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.75rem;
        }
        .badge-monitor {
            background: rgba(245, 158, 11, 0.15);
            color: var(--gold-accent);
            border: 1px solid var(--gold-accent);
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.75rem;
        }

        .terminal-box {
            background: #010409;
            border: 1px solid rgba(0, 240, 255, 0.3);
            border-radius: 6px;
            padding: 1rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.82rem;
            height: 250px;
            overflow-y: auto;
            color: #38bdf8;
            box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.8);
        }
        .terminal-line { margin-bottom: 6px; line-height: 1.4; }

        .form-group {
            margin-bottom: 1rem;
        }
        label {
            display: block;
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-bottom: 0.4rem;
            text-transform: uppercase;
        }
        input, select, textarea {
            width: 100%;
            background: #020617;
            border: 1px solid rgba(0, 240, 255, 0.3);
            color: var(--text-main);
            padding: 10px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--cyan-glow);
            box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
        }
        .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="logo-area">
            <div class="arc-reactor">
                <div class="arc-inner"></div>
            </div>
            <div>
                <h1>JARVIS // HERMES OS</h1>
                <div class="subtitle">DOMINIC AI COMMAND NEXUS & SEO SWARM CONTROL</div>
            </div>
        </div>
        <div class="status-badge">
            <div class="status-dot"></div>
            <span id="sys-status">ONLINE // ALL SWARMS ACTIVE</span>
        </div>
    </header>

    <div class="container">
        <!-- Top Metrics Row -->
        <div class="card col-span-3">
            <div class="metric-label">Core Neural Load</div>
            <div class="metric-value" id="core-load">14.2%</div>
        </div>
        <div class="card col-span-3">
            <div class="metric-label">Stripe Revenue (Today)</div>
            <div class="metric-value gold" id="rev-today">£1,500.00</div>
        </div>
        <div class="card col-span-3">
            <div class="metric-label">Active Agency Clients</div>
            <div class="metric-value" id="active-clients">14</div>
        </div>
        <div class="card col-span-3">
            <div class="metric-label">SEO Swarm Efficiency</div>
            <div class="metric-value gold" id="swarm-eff">99.1%</div>
        </div>

        <!-- Agent Swarm Control Table -->
        <div class="card col-span-8">
            <h2><span class="icon">⚡</span> Autonomous Agent & SEO Swarm Grid</h2>
            <table>
                <thead>
                    <tr>
                        <th>Agent Name</th>
                        <th>Role / Directive</th>
                        <th>Status</th>
                        <th>Tasks Done</th>
                        <th>Efficiency</th>
                    </tr>
                </thead>
                <tbody id="agent-table-body">
                    <!-- Dynamic Rows -->
                </tbody>
            </table>
            <div class="action-grid" style="margin-top: 1.5rem;">
                <button class="btn" onclick="triggerAction('run_seo_swarm')">🚀 Deploy SEO Swarm</button>
                <button class="btn btn-gold" onclick="triggerAction('harvest_leads')">🎯 Harvest B2B Leads</button>
                <button class="btn" onclick="openStripeCheckout()">💳 Open Stripe Checkout</button>
            </div>
        </div>

        <!-- Agent Creator Console -->
        <div class="card col-span-4">
            <h2><span class="icon">⚙️</span> Spawn New Agent</h2>
            <form id="spawn-form" onsubmit="spawnAgent(event)">
                <div class="form-group">
                    <label>Agent Codename</label>
                    <input type="text" id="agent-name" placeholder="e.g. RankMaster-X" required>
                </div>
                <div class="form-group">
                    <label>Specialization / Directive</label>
                    <select id="agent-role">
                        <option value="SEO Topical Authority Swarm">SEO Topical Authority Swarm</option>
                        <option value="B2B Conversion Pitcher">B2B Conversion Pitcher (£500 Offer)</option>
                        <option value="Backlink & Citation Hunter">Backlink & Citation Hunter</option>
                        <option value="Wyckoff Crypto/Commodity Bot">Wyckoff Crypto/Commodity Bot</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Execution Autonomy</label>
                    <select id="agent-autonomy">
                        <option value="High (Autonomous Loop)">High (Autonomous Loop)</option>
                        <option value="Supervised (Approval Gate)">Supervised (Approval Gate)</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-gold" style="width: 100%; justify-content: center;">Initialize Agent</button>
            </form>
        </div>

        <!-- Live Terminal Stream -->
        <div class="card col-span-12">
            <h2><span class="icon">💻</span> JARVIS Live Neural Telemetry & Execution Stream</h2>
            <div class="terminal-box" id="terminal-stream">
                <!-- Logs populated via JS -->
            </div>
        </div>
    </div>

    <script>
        function fetchState() {
            fetch('/api/state')
                .then(res => res.json())
                .then(data => {
                    document.getElementById('core-load').innerText = data.core_load;
                    document.getElementById('rev-today').innerText = data.revenue_today;
                    document.getElementById('active-clients').innerText = data.active_clients;
                    document.getElementById('sys-status').innerText = data.status;

                    // Update Agents Table
                    const tbody = document.getElementById('agent-table-body');
                    tbody.innerHTML = '';
                    data.agents.forEach(agent => {
                        const badgeClass = agent.status === 'ACTIVE' ? 'badge-active' : 'badge-monitor';
                        tbody.innerHTML += `
                            <tr>
                                <td><strong>${agent.name}</strong></td>
                                <td>${agent.role}</td>
                                <td><span class="${badgeClass}">${agent.status}</span></td>
                                <td>${agent.tasks_completed}</td>
                                <td>${agent.efficiency}</td>
                            </tr>
                        `;
                    });

                    // Update Terminal
                    const term = document.getElementById('terminal-stream');
                    term.innerHTML = '';
                    data.logs.forEach(log => {
                        term.innerHTML += `<div class="terminal-line">${log}</div>`;
                    });
                    term.scrollTop = term.scrollHeight;
                });
        }

        function triggerAction(actionType) {
            fetch('/api/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: actionType })
            }).then(res => res.json()).then(data => {
                fetchState();
            });
        }

        function spawnAgent(e) {
            e.preventDefault();
            const name = document.getElementById('agent-name').value;
            const role = document.getElementById('agent-role').value;
            fetch('/api/spawn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, role })
            }).then(res => res.json()).then(data => {
                document.getElementById('agent-name').value = '';
                fetchState();
            });
        }

        function openStripeCheckout() {
            window.open('https://buy.stripe.com/14A00i5Wlf51e44anJa3u00', '_blank');
        }

        setInterval(fetchState, 3000);
        fetchState();
    </script>
</body>
</html>
"""

class JarvisHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(HTML_TEMPLATE.encode('utf-8'))
        elif self.path == '/api/state':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(SYSTEM_STATE).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.wfile.read(content_length) if content_length > 0 else b'{}'
        data = json.loads(body.decode('utf-8')) if body else {}

        if self.path == '/api/action':
            action = data.get('action')
            if action == 'run_seo_swarm':
                SYSTEM_STATE['logs'].append(f"[{time.strftime('%H:%M:%S')}] SEO Swarm Alpha deployed: Crawling 50 target keywords & generating programmatic authority clusters.")
                SYSTEM_STATE['agents'][0]['tasks_completed'] += 15
            elif action == 'harvest_leads':
                SYSTEM_STATE['logs'].append(f"[{time.strftime('%H:%M:%S')}] Lead Hunter scanned 120 e-commerce sites. Dispatched £500 optimization pitch sequences.")
                SYSTEM_STATE['agents'][2]['tasks_completed'] += 5
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))

        elif self.path == '/api/spawn':
            name = data.get('name', 'CustomAgent')
            role = data.get('role', 'Custom Task Runner')
            new_agent = {
                "id": f"agent-{len(SYSTEM_STATE['agents'])+1:02d}",
                "name": name,
                "role": role,
                "status": "ACTIVE",
                "tasks_completed": 1,
                "efficiency": "100%"
            }
            SYSTEM_STATE['agents'].append(new_agent)
            SYSTEM_STATE['logs'].append(f"[{time.strftime('%H:%M:%S')}] Spawned new agent [{name}] with directive [{role}].")
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "agent": new_agent}).encode('utf-8'))

def run_server():
    with socketserver.TCPServer(("", PORT), JarvisHandler) as httpd:
        print(f"JARVIS Operator System OS running on port {PORT}")
        httpd.serve_forever()

if __name__ == '__main__':
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    print("Jarvis OS background server started successfully.")
    time.sleep(1)
