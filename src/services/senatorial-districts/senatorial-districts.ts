import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const SenatorialDistrictsResultSchema = Type.Object({
  name: Type.String(),
  code: Type.String(),
  region: Type.Optional(Type.String()),
  displayOrder: Type.Optional(Type.Integer()),
}, { additionalProperties: false });

export const SenatorialDistrictsDataSchema = Type.Object({
  name: Type.String(),
  code: Type.String(),
});

export const SenatorialDistrictsPatchSchema = Type.Object({
  name: Type.Optional(Type.String()),
  code: Type.Optional(Type.String()),
  region: Type.Optional(Type.Optional(Type.String())),
  displayOrder: Type.Optional(Type.Optional(Type.Integer())),
});

export const SenatorialDistrictsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type SenatorialDistricts = Static<typeof SenatorialDistrictsResultSchema>;
export type SenatorialDistrictsData = Static<typeof SenatorialDistrictsDataSchema>;
export type SenatorialDistrictsPatch = Static<typeof SenatorialDistrictsPatchSchema>;
export type SenatorialDistrictsQuery = Static<typeof SenatorialDistrictsQuerySchema>;

// --- Service ---

export class SenatorialDistrictsService extends MongoDBService<SenatorialDistricts, SenatorialDistrictsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'senatorialDistricts'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
