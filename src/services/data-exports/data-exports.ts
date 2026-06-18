import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const DataExportsResultSchema = Type.Object({
  requestedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  exportType: Type.String(),
  filters: Type.Object({}),
  sensitivity: Type.Union([Type.Literal('internal'), Type.Literal('restricted'), Type.Literal('highlyRestricted')]),
  approvalStatus: Type.Union([Type.Literal('pending'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('expired')]),
  status: Type.Union([Type.Literal('requested'), Type.Literal('generating'), Type.Literal('ready'), Type.Literal('failed'), Type.Literal('expired'), Type.Literal('revoked')]),
}, { additionalProperties: false });

export const DataExportsDataSchema = Type.Object({
  requestedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  exportType: Type.String(),
  filters: Type.Object({}),
  sensitivity: Type.Union([Type.Literal('internal'), Type.Literal('restricted'), Type.Literal('highlyRestricted')]),
  approvalStatus: Type.Union([Type.Literal('pending'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('expired')]),
  status: Type.Union([Type.Literal('requested'), Type.Literal('generating'), Type.Literal('ready'), Type.Literal('failed'), Type.Literal('expired'), Type.Literal('revoked')]),
});

export const DataExportsPatchSchema = Type.Object({
  requestedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  exportType: Type.Optional(Type.String()),
  filters: Type.Optional(Type.Object({})),
  sensitivity: Type.Optional(Type.Union([Type.Literal('internal'), Type.Literal('restricted'), Type.Literal('highlyRestricted')])),
  approvalStatus: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('expired')])),
  status: Type.Optional(Type.Union([Type.Literal('requested'), Type.Literal('generating'), Type.Literal('ready'), Type.Literal('failed'), Type.Literal('expired'), Type.Literal('revoked')])),
});

export const DataExportsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type DataExports = Static<typeof DataExportsResultSchema>;
export type DataExportsData = Static<typeof DataExportsDataSchema>;
export type DataExportsPatch = Static<typeof DataExportsPatchSchema>;
export type DataExportsQuery = Static<typeof DataExportsQuerySchema>;

// --- Service ---

export class DataExportsService extends MongoDBService<DataExports, DataExportsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'dataExports'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
