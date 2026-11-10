'use strict';
const { createApp } = require('./app');
const app = createApp();
app.listen({ port: Number(process.env.PORT || 3000), host: '0.0.0.0' })
  .then(address => console.log(`PromptLens is running at ${address}`))
  .catch(error => { console.error(error); process.exit(1); });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => { await app.close(); process.exit(0); });
}
