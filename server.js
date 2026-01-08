const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const PORT = 8080;

const server = http.createServer((req, res) => {
    // Secure CORS headers - only allow localhost origins
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5173', // Vite dev server
        'http://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss://ws-api.runware.ai https://generativelanguage.googleapis.com");
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Construct file path
    let requestPath = req.url === '/' ? 'index.html' : req.url;
    
    // Enhanced security: comprehensive directory traversal protection
    try {
        // Remove query string and decode URL encoding
        requestPath = decodeURIComponent(requestPath.split('?')[0]);
        
        // Build absolute path and verify it's within ROOT_DIR
        const filePath = path.resolve(ROOT_DIR, requestPath.replace(/^\//, ''));
        const normalizedRoot = path.resolve(ROOT_DIR);
        
        if (!filePath.startsWith(normalizedRoot + path.sep) && filePath !== normalizedRoot) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('403 Forbidden - Access denied');
            return;
        }
        
        // Check if file exists and is readable
        fs.stat(filePath, (statErr, stats) => {
            if (statErr || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
            
            // Determine content type with comprehensive MIME mapping
            const ext = path.extname(filePath).toLowerCase();
            const contentTypes = {
                '.html': 'text/html',
                '.htm': 'text/html',
                '.js': 'application/javascript',
                '.mjs': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.webp': 'image/webp',
                '.ico': 'image/x-icon',
                '.pdf': 'application/pdf',
                '.txt': 'text/plain',
                '.md': 'text/markdown',
                '.xml': 'application/xml',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.ttf': 'font/ttf',
                '.otf': 'font/otf',
                '.csv': 'text/csv'
            };
            const contentType = contentTypes[ext] || 'application/octet-stream';
            
            // Read and serve the file
            fs.readFile(filePath, (readErr, data) => {
                if (readErr) {
                    console.error('File read error:', readErr.message, 'Path:', filePath);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 Internal Server Error');
                    return;
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        });
        
    } catch (error) {
        console.error('Request handling error:', error.message, 'URL:', req.url);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('400 Bad Request - Invalid path');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Open your browser to: http://localhost:${PORT}/`);
    console.log(`Main application available at: http://localhost:${PORT}/index.html`);
    console.log('Press Ctrl+C to stop the server');
});