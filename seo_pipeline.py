#!/usr/bin/env python3
"""SEO & Content Pipeline — scheduled task.
Routes through inclusionai/ling-3.0-flash:free (262K context, zero-cost).
"""
import sys
sys.path.insert(0, "/opt/data")
from pipeline_hub import seo_pipeline, call_openrouter, PIPELINES_DIR
import json, os
from datetime import datetime

def run_seo_pipeline():
    results = []
    
    # 1. Blog Post Generation
    r1 = seo_pipeline("blog-post", 
        keywords="AI automation, conversion optimization",
        topic="Cost-Optimized Agentic AI Pipelines",
        brand_context="Dominic AI Conversion Lab - £500 one-off optimization packages. Stripe payment: buy.stripe.com/14A00i5Wlf51e44anJa3u00")
    results.append({"task": "blog-post", "status": "done" if r1.get("success") else "failed"})
    
    # 2. Content Brief
    r2 = seo_pipeline("content-brief",
        keywords="AI automation, conversion optimization",
        topic="Cost-Optimized Agentic AI Pipelines",
        brand_context="Dominic AI Conversion Lab")
    results.append({"task": "content-brief", "status": "done" if r2.get("success") else "failed"})
    
    # 3. SEO Review (of recent content)
    recent_files = []
    seo_dir = os.path.join(PIPELINES_DIR, "seo")
    if os.path.exists(seo_dir):
        recent_files = sorted(os.listdir(seo_dir))[-2:]
    
    r3 = seo_pipeline("seo-review",
        keywords="AI automation, conversion optimization",
        content="Recent content pipeline outputs" if recent_files else "No recent content")
    results.append({"task": "seo-review", "status": "done" if r3.get("success") else "failed"})
    
    # Save results
    timestamp = int(datetime.now().timestamp())
    output = os.path.join(PIPELINES_DIR, "seo", f"batch_{timestamp}.json")
    with open(output, "w") as f:
        json.dump(results, f, indent=2)
    
    # Send summary via Telegram
    summary = f"📋 SEO Pipeline Complete\n" + "\n".join(f"  {'✓' if r['status']=='done' else '✗'} {r['task']}" for r in results)
    return {"success": True, "results": results, "output": output, "summary": summary}

if __name__ == "__main__":
    result = run_seo_pipeline()
    print(json.dumps(result, indent=2))
