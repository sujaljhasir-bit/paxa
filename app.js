'use strict';
const Fastify = require('fastify');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

// The server serves the app only. There are no upload or analysis endpoints.
function createApp() {
  const app = Fastify({ logger: false, bodyLimit: 1024 });
  const html = readFileSync(join(__dirname, 'web', 'index.html'), 'utf8');
  app.addHook('onSend', async (_request, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('Referrer-Policy', 'no-referrer');
    return payload;
  });
  const serve = (_request, reply) => reply
    .header('Cache-Control', 'no-store')
    .type('text/html; charset=utf-8')
    .send(html);
  app.get('/', serve);
  app.get('/index.html', serve);
  return app;
}
module.exports = { createApp };
