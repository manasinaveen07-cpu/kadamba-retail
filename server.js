const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.md': 'text/markdown; charset=utf-8'
};

const routeAliases = {
  '/': '/index.html',
  '/home': '/index.html',
  '/supermart': '/supermart.html',
  '/financial-services': '/financial-services.html',
  '/suppliers': '/suppliers.html',
  '/stores': '/stores.html',
  '/about-us': '/about-us.html',
  '/privacy-policy': '/privacy-policy.html'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Check aliases
  if (routeAliases[pathname]) {
    pathname = routeAliases[pathname];
  } else if (!path.extname(pathname) && pathname !== '/') {
    // Check if pathname.html exists
    if (fs.existsSync(path.join(PUBLIC_DIR, pathname + '.html'))) {
      pathname = pathname + '.html';
    }
  }

  let filePath = path.join(PUBLIC_DIR, pathname);

  // Directory request -> try index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Security check: stay within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 fallback
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>404 - Page Not Found | Kadamba Group</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #fff8f5; color: #26190e; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .box { text-align: center; padding: 40px; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); max-width: 480px; }
            h1 { color: #a93800; font-size: 42px; margin: 0 0 10px; }
            p { color: #58413a; margin-bottom: 24px; font-size: 16px; }
            a { background: #f36b35; color: white; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; display: inline-block; }
            a:hover { background: #a93800; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>404</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/">Return to Kadamba Home</a>
          </div>
        </body>
        </html>
      `);
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
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Kadamba Retail Server running at: http://localhost:${PORT}`);
  console.log(`Available routes:`);
  console.log(`  - Home:               http://localhost:${PORT}/`);
  console.log(`  - Supermart (11k+):   http://localhost:${PORT}/supermart`);
  console.log(`  - Financial Services: http://localhost:${PORT}/financial-services`);
  console.log(`  - FMCG Suppliers:     http://localhost:${PORT}/suppliers`);
  console.log(`  - Store Locations:    http://localhost:${PORT}/stores`);
  console.log(`  - About Us:           http://localhost:${PORT}/about-us`);
  console.log(`  - Privacy Policy:     http://localhost:${PORT}/privacy-policy`);
});
