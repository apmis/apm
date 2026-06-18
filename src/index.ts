import { createApp } from './app.js';

async function main() {
  const app = await createApp();
  const port = app.get('port');

  app.listen(port).then(() => {
    console.log(`APM Campaign backend running on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
