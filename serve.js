/**
 * Minimal Zero-Dependency Static File Server for RITW Local Reconstruction
 * Usage: node serve.js [port]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || process.argv[2] || '5000', 10);
const ROOT = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
    let reqUrl = '/index.html';
    try {
        reqUrl = decodeURIComponent(req.url.split('?')[0]);
    } catch (e) {
        reqUrl = req.url.split('?')[0];
    }
    if (reqUrl === '/' || reqUrl === '') {
        reqUrl = '/index.html';
    }

    let filePath = path.join(ROOT, reqUrl);

    // Security check to avoid directory traversal
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    try {
        // If directory, check for index.html with canonical redirect
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            const pathname = req.url.split('?')[0];
            if (!pathname.endsWith('/')) {
                const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
                res.writeHead(301, { 'Location': pathname + '/' + query });
                res.end();
                return;
            }
            filePath = path.join(filePath, 'index.html');
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`404 Not Found: ${reqUrl}`);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache'
        });

        const stream = fs.createReadStream(filePath);
        stream.on('error', (streamErr) => {
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
            }
            res.end();
        });
        stream.pipe(res);
    });
});

server.on('error', (err) => {
    console.error('HTTP Server Error:', err.message);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  RITW Local Reconstruction Server Running!`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  Press Ctrl+C to stop.`);
    console.log(`======================================================\n`);
});

