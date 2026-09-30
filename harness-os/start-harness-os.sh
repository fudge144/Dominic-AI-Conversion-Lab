#!/bin/bash
# Harness OS Startup Script
# Usage: ./start-harness-os.sh

cd /opt/data/harness-os

# Clean up stale server.js if it exists
rm -f /opt/data/harness-os/server.js 2>/dev/null

# Check if already running
if pgrep -f "server.mjs" > /dev/null 2>&1; then
    PID=$(pgrep -f "server.mjs" | head -1)
    echo "Harness OS is already running (PID: $PID)"
    echo "Dashboard: http://localhost:9120"
    echo "To restart: pkill -f 'server.mjs' && ./start-harness-os.sh"
    exit 0
fi

# Start the server
nohup node server.mjs > harness.log 2>&1 &
sleep 1

if curl -s http://localhost:9120/ > /dev/null 2>&1; then
    echo "Harness OS started successfully on port 9120"
    echo "Dashboard: http://localhost:9120"
    echo "To stop: pkill -f 'server.mjs'"
else
    echo "Failed to start. Check logs: cat /opt/data/harness-os/harness.log"
fi
