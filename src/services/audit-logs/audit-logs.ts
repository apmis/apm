import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const AuditLogsResultSchema = Type.Object({
  actorId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  actorType: Type.Union([Type.Literal('user'), Type.Literal('system'), Type.Literal('worker'), Type.Literal('integration')]),
  action: Type.String(),
  servicePath: Type.String(),
  method: Type.Optional(Type.String()),
  recordId: Type.Optional(Type.String()),
  success: Type.Boolean(),
  errorCode: Type.Optional(Type.String()),
  occurredAt: Type.String({ format: 'date-time' }),
  metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  beforeHash: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const AuditLogsDataSchema = Type.Object({
  actorId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  actorType: Type.Union([Type.Literal('user'), Type.Literal('system'), Type.Literal('worker'), Type.Literal('integration')]),
  action: Type.String(),
  servicePath: Type.String(),
  method: Type.Optional(Type.String()),
  recordId: Type.Optional(Type.String()),
  success: Type.Boolean(),
  errorCode: Type.Optional(Type.String()),
  occurredAt: Type.String({ format: 'date-time' }),
  metadata: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  beforeHash: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const AuditLogsPatchSchema = Type.Object({
  actorId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  actorType: Type.Optional(Type.Union([Type.Literal('user'), Type.Literal('system'), Type.Literal('worker'), Type.Literal('integration')])),
  action: Type.Optional(Type.String()),
  servicePath: Type.Optional(Type.String()),
  method: Type.Optional(Type.Optional(Type.String())),
  recordId: Type.Optional(Type.Optional(Type.String())),
  success: Type.Optional(Type.Boolean()),
  errorCode: Type.Optional(Type.Optional(Type.String())),
  occurredAt: Type.Optional(Type.String({ format: 'date-time' })),
  metadata: Type.Optional(Type.Optional(Type.Record(Type.String(), Type.Unknown()))),
  beforeHash: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const AuditLogsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type AuditLogs = Static<typeof AuditLogsResultSchema>;
export type AuditLogsData = Static<typeof AuditLogsDataSchema>;
export type AuditLogsPatch = Static<typeof AuditLogsPatchSchema>;
export type AuditLogsQuery = Static<typeof AuditLogsQuerySchema>;

// --- Service ---

export class AuditLogsService extends MongoDBService<AuditLogs, AuditLogsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('auditLogs')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
