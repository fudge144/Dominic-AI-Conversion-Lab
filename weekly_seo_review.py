#!/usr/bin/env python3
"""Weekly SEO review script for Dark History YouTube channel.
Runs weekly on Sunday 12:00 UTC via cron.
Reviews SEO_Log.md, writes summary to stdout + Telegram.
"""
import os
from datetime import datetime, timezone

SEO_LOG = "/opt/data/obsidian_vault/03_Projects/Dark_History_Channel/SEO_Log.md"
CHANNEL_VAULT = "/opt/data/obsidian_vault/03_Projects/Dark_History_Channel"

def check_seo_log():
    if not os.path.exists(SEO_LOG):
        print("[WARN] SEO_Log.md not found — no weekly data to review yet.")
        return False
    with open(SEO_LOG) as f:
        content = f.read()
    # Extract most recent entry
    lines = content.strip().split("\n")
    print(f"SEO_Log.md found — {len(lines)} lines")
    print(f"\nMost recent entries:")
    for line in lines[-15:]:
        print(f"  {line}")
    return True

def check_episodes():
    """List episode scripts and their status"""
    if not os.path.exists(CHANNEL_VAULT):
        print("[WARN] Channel vault not found")
        return
    scripts = [f for f in os.listdir(CHANNEL_VAULT) if f.endswith(".md") and f.startswith("ep_")]
    print(f"\nEpisode scripts in vault ({len(scripts)}):")
    for s in sorted(scripts):
        size = os.path.getsize(os.path.join(CHANNEL_VAULT, s))
        print(f"  {s} ({size} bytes)")

def main():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    print(f"# Weekly SEO Review — {today}")
    print("=" * 50)

    has_data = check_seo_log()
    check_episodes()

    if not has_data:
        print("\n[ACTION] First weekly SEO review — SEO_Log.md is empty.")
        print("Next step: Publish an episode and record its performance in SEO_Log.md")

    return True

if __name__ == "__main__":
    main()
