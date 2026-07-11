import { MongoClient } from 'mongodb';
import type { Application } from '@feathersjs/feathers';

const clientPromiseMap = new WeakMap<Application, Promise<MongoClient>>();

export function getCollection(app: Application, name: string) {
  const p = clientPromiseMap.get(app);
  if (!p) {
    throw new Error(
      'MongoDB not initialized. configureMongoDB must be called before getCollection.',
    );
  }
  return p.then((client) => client.db().collection(name));
}

export async function configureMongoDB(app: Application) {
  const uri = (process.env.mongodb || app.get('mongodb') || 'mongodb://localhost:27017/apm-campaign') as string;
  const client = new MongoClient(uri);
  const connectPromise = client.connect().then(() => client);

  clientPromiseMap.set(app, connectPromise);

  const db = client.db();
  app.set('mongodbClient', connectPromise);
  app.set('database', db);

  console.log('Connected to MongoDB:', uri);

  app.on('dispose', () => {
    client.close().catch(console.error);
  });
}
