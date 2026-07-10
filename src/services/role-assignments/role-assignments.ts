import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const RoleAssignmentsResultSchema = Type.Object({
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  roleId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  roleCode: Type.String(),
  effectiveFrom: Type.String({ format: 'date-time' }),
  effectiveTo: Type.Optional(Type.String({ format: 'date-time' })),
  isPrimary: Type.Boolean(),
  status: Type.Union([Type.Literal('active'), Type.Literal('expired'), Type.Literal('revoked')]),
}, { additionalProperties: false });

export const RoleAssignmentsDataSchema = Type.Object({
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  roleId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  roleCode: Type.String(),
  effectiveFrom: Type.String({ format: 'date-time' }),
  effectiveTo: Type.Optional(Type.String({ format: 'date-time' })),
  isPrimary: Type.Boolean(),
  status: Type.Union([Type.Literal('active'), Type.Literal('expired'), Type.Literal('revoked')]),
}, { additionalProperties: false });

export const RoleAssignmentsPatchSchema = Type.Object({
  userId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  roleId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  roleCode: Type.Optional(Type.String()),
  effectiveFrom: Type.Optional(Type.String({ format: 'date-time' })),
  effectiveTo: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
  isPrimary: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Union([Type.Literal('active'), Type.Literal('expired'), Type.Literal('revoked')])),
}, { additionalProperties: false });

export const RoleAssignmentsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type RoleAssignments = Static<typeof RoleAssignmentsResultSchema>;
export type RoleAssignmentsData = Static<typeof RoleAssignmentsDataSchema>;
export type RoleAssignmentsPatch = Static<typeof RoleAssignmentsPatchSchema>;
export type RoleAssignmentsQuery = Static<typeof RoleAssignmentsQuerySchema>;

// --- Service ---

export class RoleAssignmentsService extends MongoDBService<RoleAssignments, RoleAssignmentsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('roleAssignments')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
