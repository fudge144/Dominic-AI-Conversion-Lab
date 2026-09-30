import http.server
import socketserver
import json
import urllib.request
import urllib.error
import os
from threading import Thread

PORT = int(os.environ.get('PORT', 9120))
HERMES_API = 'http://localhost:9119/api'

class HarnessHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)
    
    def do_GET(self):
        if self.path.startswith('/api/'):
            self.proxy_request()
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path.startswith('/api/'):
            self.proxy_request()
        else:
            super().do_POST()
    
    def proxy_request(self):
        try:
            url = HERMES_API + self.path[5:]  # Remove '/api'
            body = None
            if 'Content-Length' in self.headers:
                length = int(self.headers['Content-Length'])
                body = self.rfile.read(length) if length > 0 else None
            
            req = urllib.request.Request(url, data=body, method=self.command)
            for key, value in self.headers.items():
                if key not in ('Host', 'Content-Length'):
                    req.add_header(key, value)
            
            resp = urllib.request.urlopen(req, timeout=10)
            data = resp.read()
            self.send_response(resp.status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Proxy error', 'detail': str(e)}).encode())
    
    def log_message(self, format, *args):
        pass  # Suppress logs

if __name__ == '__main__':
    with socketserver.TCPServer(('0.0.0.0', PORT), HarnessHandler) as httpd:
        print(f'Harness OS serving on http://0.0.0.0:{PORT}')
        httpd.serve_forever()
