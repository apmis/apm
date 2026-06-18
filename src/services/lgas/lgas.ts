import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const LgasResultSchema = Type.Object({
  name: Type.String(),
  code: Type.String(),
  senatorialDistrictId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  region: Type.Optional(Type.String()),
  displayOrder: Type.Optional(Type.Integer()),
}, { additionalProperties: false });

export const LgasDataSchema = Type.Object({
  name: Type.String(),
  code: Type.String(),
});

export const LgasPatchSchema = Type.Object({
  name: Type.Optional(Type.String()),
  code: Type.Optional(Type.String()),
  senatorialDistrictId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  region: Type.Optional(Type.Optional(Type.String())),
  displayOrder: Type.Optional(Type.Optional(Type.Integer())),
});

export const LgasQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Lgas = Static<typeof LgasResultSchema>;
export type LgasData = Static<typeof LgasDataSchema>;
export type LgasPatch = Static<typeof LgasPatchSchema>;
export type LgasQuery = Static<typeof LgasQuerySchema>;

// --- Service ---

export class LgasService extends MongoDBService<Lgas, LgasData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'lgas'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
