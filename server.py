import http.server
import socketserver
import os

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # If the request path is just the root '/', serve index.html
        if self.path == "/":
            self.path = "/index.html"
        
        # Log for debugging: check the current path being served
        print(f"Requested path: {self.path}")
        
        # Ensure the file is properly found and served
        return super().do_GET()

Handler = MyHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving at port {PORT}")
httpd.serve_forever()
