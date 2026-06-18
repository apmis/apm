import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const SyncOperationsResultSchema = Type.Object({
  operationId: Type.String(),
  deviceId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  servicePath: Type.String(),
  method: Type.Union([Type.Literal('create'), Type.Literal('patch'), Type.Literal('remove'), Type.Literal('custom')]),
  status: Type.Union([Type.Literal('received'), Type.Literal('applied'), Type.Literal('duplicate'), Type.Literal('conflict'), Type.Literal('rejected'), Type.Literal('failed')]),
  retryCount: Type.Integer(),
}, { additionalProperties: false });

export const SyncOperationsDataSchema = Type.Object({
  operationId: Type.String(),
  deviceId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  servicePath: Type.String(),
  method: Type.Union([Type.Literal('create'), Type.Literal('patch'), Type.Literal('remove'), Type.Literal('custom')]),
  status: Type.Union([Type.Literal('received'), Type.Literal('applied'), Type.Literal('duplicate'), Type.Literal('conflict'), Type.Literal('rejected'), Type.Literal('failed')]),
  retryCount: Type.Integer(),
});

export const SyncOperationsPatchSchema = Type.Object({
  deviceId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  userId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  servicePath: Type.Optional(Type.String()),
  method: Type.Optional(Type.Union([Type.Literal('create'), Type.Literal('patch'), Type.Literal('remove'), Type.Literal('custom')])),
  status: Type.Optional(Type.Union([Type.Literal('received'), Type.Literal('applied'), Type.Literal('duplicate'), Type.Literal('conflict'), Type.Literal('rejected'), Type.Literal('failed')])),
  retryCount: Type.Optional(Type.Integer()),
});

export const SyncOperationsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type SyncOperations = Static<typeof SyncOperationsResultSchema>;
export type SyncOperationsData = Static<typeof SyncOperationsDataSchema>;
export type SyncOperationsPatch = Static<typeof SyncOperationsPatchSchema>;
export type SyncOperationsQuery = Static<typeof SyncOperationsQuerySchema>;

// --- Service ---

export class SyncOperationsService extends MongoDBService<SyncOperations, SyncOperationsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'syncOperations'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
