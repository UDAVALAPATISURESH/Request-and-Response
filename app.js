const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile('message', 'utf8', (err, data) => {
      const messages = err ? '' : data;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`
        <html>
          <head>
            <title>Message Board</title>
            <style>
              body { font-family: Arial; margin: 2em; }
              h1 { color: #333; }
              form { margin-top: 1em; }
              input[type="text"] { width: 300px; padding: 8px; }
              button { padding: 8px 12px; }
              pre { background: #f0f0f0; padding: 1em; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>Message Board</h1>
            <h3>Messages:</h3>
            <pre>${messages}</pre>
            <form action="/" method="POST">
              <input type="text" name="message" placeholder="Type your message..." required />
              <button type="submit">Submit</button>
            </form>
          </body>
        </html>
      `);
      res.end();
    });
  } else if (req.method === 'POST' && req.url === '/') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const message = params.get('message');
      fs.readFile('message', 'utf8', (err, oldData) => {
        const newData = `${message}\n${oldData || ''}`;
        fs.writeFile('message', newData, (err) => {
          res.writeHead(302, { Location: '/' });
          res.end();
        });
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));
