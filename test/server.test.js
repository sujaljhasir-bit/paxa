'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { createApp } = require('../app');

test('Fastify serves the app, with no upload endpoint', async t => {
  const app = createApp();
  t.after(() => app.close());
  for (const url of ['/', '/index.html']) {
    const response = await app.inject({ method: 'GET', url });
    assert.equal(response.statusCode, 200);
    assert.match(response.headers['content-type'], /text\/html/);
    assert.match(response.body, /PromptLens/);
    assert.match(response.body, /connect-src 'none'/);
    assert.equal(response.headers['referrer-policy'], 'no-referrer');
    assert.doesNotMatch(response.body, /fetch\(|XMLHttpRequest|localStorage\.|document\.cookie/);
  }
  assert.equal((await app.inject({ method: 'POST', url: '/upload' })).statusCode, 404);
  assert.equal((await app.inject({ method: 'GET', url: '/missing' })).statusCode, 404);
});

test('Vercel handler serves a real HTTP request without opening its own port', async t => {
  const handler = require('../api/index');
  const server = createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Give permission to get started/);
});
