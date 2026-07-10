import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const UserSessionsResultSchema = Type.Object({
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  refreshTokenHash: Type.String(),
  deviceId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  ipAddress: Type.Optional(Type.String()),
  expiresAt: Type.String({ format: 'date-time' }),
  loggedOutAt: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const UserSessionsDataSchema = Type.Object({
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  refreshTokenHash: Type.String(),
  deviceId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  ipAddress: Type.Optional(Type.String()),
  expiresAt: Type.String({ format: 'date-time' }),
  loggedOutAt: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const UserSessionsPatchSchema = Type.Object({
  userId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  refreshTokenHash: Type.Optional(Type.String()),
  deviceId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  ipAddress: Type.Optional(Type.Optional(Type.String())),
  expiresAt: Type.Optional(Type.String({ format: 'date-time' })),
  loggedOutAt: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
}, { additionalProperties: false });

export const UserSessionsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type UserSessions = Static<typeof UserSessionsResultSchema>;
export type UserSessionsData = Static<typeof UserSessionsDataSchema>;
export type UserSessionsPatch = Static<typeof UserSessionsPatchSchema>;
export type UserSessionsQuery = Static<typeof UserSessionsQuerySchema>;

// --- Service ---

export class UserSessionsService extends MongoDBService<UserSessions, UserSessionsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('userSessions')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
