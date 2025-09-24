const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Internal server error');
            }
            return;
        }

        // Set content type based on file extension
        const ext = path.extname(filePath);
        let contentType = 'text/plain';
        switch (ext) {
            case '.html':
                contentType = 'text/html';
                break;
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Open your browser to: http://localhost:${PORT}/browser-test.html`);
    console.log('Press Ctrl+C to stop the server');
});