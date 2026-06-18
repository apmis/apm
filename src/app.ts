import { feathers } from '@feathersjs/feathers';
import { koa, rest, bodyParser, errorHandler, serveStatic } from '@feathersjs/koa';
import socketio from '@feathersjs/socketio';
import configuration from '@feathersjs/configuration';
import { configureMongoDB } from './mongodb.js';
import { configureAuthentication } from './authentication.js';
import { configureChannels } from './channels.js';
import { registerServices } from './services/index.js';
import { registerHooks } from './hooks/register-hooks.js';

export type { Application } from '@feathersjs/feathers';

export async function createApp(overrides?: Record<string, unknown>) {
  const app = koa(feathers());

  app.configure(configuration());
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      app.set(key, value);
    }
  }
  app.use(errorHandler());
  app.use(serveStatic(app.get('public') as string));
  app.use(bodyParser());

  app.configure(rest());
  app.configure(socketio());
  app.configure(configureMongoDB);
  app.configure(configureAuthentication);
  app.configure(registerServices);
  app.configure(registerHooks);
  app.configure(configureChannels);

  return app;
}
