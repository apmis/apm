import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const SystemSettingsResultSchema = Type.Object({
  key: Type.String(),
  environment: Type.Union([Type.Literal('development'), Type.Literal('staging'), Type.Literal('production')]),
  value: Type.Unknown(),
  valueType: Type.Union([Type.Literal('string'), Type.Literal('number'), Type.Literal('boolean'), Type.Literal('object'), Type.Literal('array')]),
  category: Type.String(),
  version: Type.Integer(),
  isSensitive: Type.Boolean(),
  status: Type.Union([Type.Literal('draft'), Type.Literal('active'), Type.Literal('retired')]),
  updatedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
}, { additionalProperties: false });

export const SystemSettingsDataSchema = Type.Object({
  key: Type.String(),
  environment: Type.Union([Type.Literal('development'), Type.Literal('staging'), Type.Literal('production')]),
  value: Type.Unknown(),
  valueType: Type.Union([Type.Literal('string'), Type.Literal('number'), Type.Literal('boolean'), Type.Literal('object'), Type.Literal('array')]),
  category: Type.String(),
  version: Type.Integer(),
  isSensitive: Type.Boolean(),
  status: Type.Union([Type.Literal('draft'), Type.Literal('active'), Type.Literal('retired')]),
  updatedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
}, { additionalProperties: false });

export const SystemSettingsPatchSchema = Type.Object({
  key: Type.Optional(Type.String()),
  environment: Type.Optional(Type.Union([Type.Literal('development'), Type.Literal('staging'), Type.Literal('production')])),
  value: Type.Optional(Type.Unknown()),
  valueType: Type.Optional(Type.Union([Type.Literal('string'), Type.Literal('number'), Type.Literal('boolean'), Type.Literal('object'), Type.Literal('array')])),
  category: Type.Optional(Type.String()),
  version: Type.Optional(Type.Integer()),
  isSensitive: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Union([Type.Literal('draft'), Type.Literal('active'), Type.Literal('retired')])),
  updatedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: false });

export const SystemSettingsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type SystemSettings = Static<typeof SystemSettingsResultSchema>;
export type SystemSettingsData = Static<typeof SystemSettingsDataSchema>;
export type SystemSettingsPatch = Static<typeof SystemSettingsPatchSchema>;
export type SystemSettingsQuery = Static<typeof SystemSettingsQuerySchema>;

// --- Service ---

export class SystemSettingsService extends MongoDBService<SystemSettings, SystemSettingsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('systemSettings')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
