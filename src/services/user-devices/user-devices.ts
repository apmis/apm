import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const UserDevicesResultSchema = Type.Object({
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  deviceType: Type.Union([Type.Literal('mobile'), Type.Literal('browser'), Type.Literal('tablet')]),
  deviceName: Type.Optional(Type.String()),
  pushToken: Type.Optional(Type.String()),
  lastUsedAt: Type.Optional(Type.String()),
  isRevoked: Type.Boolean(),
}, { additionalProperties: false });

export const UserDevicesDataSchema = Type.Object({
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  deviceType: Type.Union([Type.Literal('mobile'), Type.Literal('browser'), Type.Literal('tablet')]),
  isRevoked: Type.Boolean(),
});

export const UserDevicesPatchSchema = Type.Object({
  userId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  deviceType: Type.Optional(Type.Union([Type.Literal('mobile'), Type.Literal('browser'), Type.Literal('tablet')])),
  deviceName: Type.Optional(Type.Optional(Type.String())),
  pushToken: Type.Optional(Type.Optional(Type.String())),
  lastUsedAt: Type.Optional(Type.Optional(Type.String())),
  isRevoked: Type.Optional(Type.Boolean()),
});

export const UserDevicesQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type UserDevices = Static<typeof UserDevicesResultSchema>;
export type UserDevicesData = Static<typeof UserDevicesDataSchema>;
export type UserDevicesPatch = Static<typeof UserDevicesPatchSchema>;
export type UserDevicesQuery = Static<typeof UserDevicesQuerySchema>;

// --- Service ---

export class UserDevicesService extends MongoDBService<UserDevices, UserDevicesData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'userDevices'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
