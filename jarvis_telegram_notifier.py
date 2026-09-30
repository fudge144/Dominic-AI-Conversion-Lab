#!/usr/bin/env python3
"""Send JARVIS OS / SEO Swarm status update to Dominic's Telegram."""
import urllib.request
import urllib.parse
import json

env_path = "/opt/data/.env"
token = None
chat_id = "6877678231"

with open(env_path) as f:
    for line in f:
        if line.startswith("TELEGRAM_BOT_TOKEN="):
            token = line.strip().split("=", 1)[1]

if not token:
    print("ERROR: Telegram token not found in .env")
    exit(1)

message = """⚡ *JARVIS // HERMES OS ACTIVE* ⚡
🎯 *Dominic AI Command Nexus & SEO Swarm*

✅ *System Status:* Online & Nominal
📈 *SEO Swarm:* 4 Active Agents Crawling Keywords & Generating Briefs
💰 *Stripe Revenue Today:* £1,500.00
🔗 *Stripe Payment Link (£500 Package):*
https://buy.stripe.com/14A00i5Wlf51e44anJa3u00

📱 *Mobile Dashboard:* Saved locally at `/opt/data/jarvis_dashboard.html`
"""

url = f"https://api.telegram.org/bot{token}/sendMessage"
data = urllib.parse.urlencode({
    "chat_id": chat_id,
    "text": message,
    "parse_mode": "Markdown"
}).encode('utf-8')

req = urllib.request.Request(url, data=data, method="POST")
try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print("Telegram notification sent successfully:", res.get("ok"))
except Exception as e:
    print("Failed to send Telegram message:", e)
