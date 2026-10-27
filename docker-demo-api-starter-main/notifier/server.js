'use strict';

// notifier - service minimal : recoit des notifications d'api et les logge.
const http = require('http');

const PORT = Number(process.env.PORT || 3001);

const server = http.createServer((req, res) => {
  const send = (status, obj) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(obj));
  };

  if (req.method === 'GET' && req.url === '/health') {
    return send(200, { status: 'UP' });
  }

  if (req.method === 'POST' && req.url === '/notify') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e5) req.destroy();
    });
    req.on('end', () => {
      console.log(JSON.stringify({ level: 'info', msg: 'notification received', body }));
      send(202, { received: true });
    });
    return;
  }

  send(404, { error: 'not_found' });
});

server.listen(PORT, () => {
  console.log(JSON.stringify({ level: 'info', msg: 'notifier started', port: PORT }));
});

function shutdown(sig) {
  console.log(JSON.stringify({ level: 'info', msg: 'shutting down', sig }));
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 8000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
