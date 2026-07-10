import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const RolesResultSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  permissionCodes: Type.Array(Type.String()),
  isSystemRole: Type.Boolean(),
  status: Type.Union([Type.Literal('active'), Type.Literal('inactive')]),
}, { additionalProperties: false });

export const RolesDataSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  permissionCodes: Type.Array(Type.String()),
  isSystemRole: Type.Boolean(),
  status: Type.Union([Type.Literal('active'), Type.Literal('inactive')]),
}, { additionalProperties: false });

export const RolesPatchSchema = Type.Object({
  code: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  permissionCodes: Type.Optional(Type.Array(Type.String())),
  isSystemRole: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Union([Type.Literal('active'), Type.Literal('inactive')])),
}, { additionalProperties: false });

export const RolesQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Roles = Static<typeof RolesResultSchema>;
export type RolesData = Static<typeof RolesDataSchema>;
export type RolesPatch = Static<typeof RolesPatchSchema>;
export type RolesQuery = Static<typeof RolesQuerySchema>;

// --- Service ---

export class RolesService extends MongoDBService<Roles, RolesData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('roles')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
