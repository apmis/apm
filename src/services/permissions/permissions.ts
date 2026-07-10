import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const PermissionsResultSchema = Type.Object({
  code: Type.String(),
  module: Type.String(),
  action: Type.String(),
  description: Type.Optional(Type.String()),
  riskLevel: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
}, { additionalProperties: false });

export const PermissionsDataSchema = Type.Object({
  code: Type.String(),
  module: Type.String(),
  action: Type.String(),
  description: Type.Optional(Type.String()),
  riskLevel: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
}, { additionalProperties: false });

export const PermissionsPatchSchema = Type.Object({
  code: Type.Optional(Type.String()),
  module: Type.Optional(Type.String()),
  action: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  riskLevel: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')])),
}, { additionalProperties: false });

export const PermissionsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Permissions = Static<typeof PermissionsResultSchema>;
export type PermissionsData = Static<typeof PermissionsDataSchema>;
export type PermissionsPatch = Static<typeof PermissionsPatchSchema>;
export type PermissionsQuery = Static<typeof PermissionsQuerySchema>;

// --- Service ---

export class PermissionsService extends MongoDBService<Permissions, PermissionsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('permissions')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
