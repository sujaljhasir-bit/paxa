'use strict';
const { createApp } = require('../app');

// Reuse Fastify between warm invocations; do not listen on a port on Vercel.
const app = createApp();
const ready = app.ready();
module.exports = async function handler(request, response) {
  await ready;
  app.server.emit('request', request, response);
};
