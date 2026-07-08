import { feathers } from '@feathersjs/feathers';
import { koa, rest, bodyParser, errorHandler, serveStatic, cors } from '@feathersjs/koa';
import socketio from '@feathersjs/socketio';
import configuration from '@feathersjs/configuration';
import swaggerModule from 'feathers-swagger';
const swagger = swaggerModule;

import { configureMongoDB } from './mongodb.js';
import { configureAuthentication } from './authentication.js';
import { configureChannels } from './channels.js';
import { registerServices } from './services/index.js';
import { registerHooks } from './hooks/register-hooks.js';
import * as dotenv from 'dotenv';
dotenv.config(); 

export type { Application } from '@feathersjs/feathers';

export async function createApp(overrides?: Record<string, unknown>) {
  const app = koa(feathers());
  const isProduction = process.env.NODE_ENV === 'production';
const serverUrl = isProduction 
  ? 'https://apm-jbpi.onrender.com' 
  : `http://localhost:${app.get('port')}`;

  const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-domain.com'];
  const corsOptions = {
    origin: (ctx: any) => {
      const requestOrigin = ctx.get('Origin');
      return allowedOrigins.includes(requestOrigin) ? requestOrigin : undefined;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // Required if your app uses cookies or JWT in headers
    allowHeaders: ['Content-Type', 'Authorization']
  };

  app.use(cors(corsOptions));

  app.configure(configuration());
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      app.set(key, value);
    }
  }
  app.use(errorHandler());
  app.use(serveStatic(app.get('public') as string));
  app.use(bodyParser());

  app.configure(swagger({
    specs: {
      info: {
        title: 'APM Campaign API',
        description: 'APM Campaign Digital Command System API',
        version: '0.1.0',
      },
      servers: [{ url:  serverUrl, description:isProduction? 'Production server'  : 'Development server' }],
    },
    ui: swagger.swaggerUI({ docsPath: '/docs' }),
  }));


  app.configure(rest());
  app.configure(socketio());
  app.configure(configureMongoDB);
  app.configure(configureAuthentication);
  app.configure(registerServices);
  app.configure(registerHooks);
  app.configure(configureChannels);

  return app;
}
