import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const WardsResultSchema = Type.Object({
  name: Type.String(),
  code: Type.String(),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  displayOrder: Type.Optional(Type.Integer()),
}, { additionalProperties: false });

export const WardsDataSchema = Type.Object({
  name: Type.String(),
  code: Type.String(),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
});

export const WardsPatchSchema = Type.Object({
  name: Type.Optional(Type.String()),
  code: Type.Optional(Type.String()),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  displayOrder: Type.Optional(Type.Optional(Type.Integer())),
});

export const WardsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Wards = Static<typeof WardsResultSchema>;
export type WardsData = Static<typeof WardsDataSchema>;
export type WardsPatch = Static<typeof WardsPatchSchema>;
export type WardsQuery = Static<typeof WardsQuerySchema>;

// --- Service ---

export class WardsService extends MongoDBService<Wards, WardsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'wards'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
