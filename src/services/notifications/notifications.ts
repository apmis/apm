import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const NotificationsResultSchema = Type.Object({
  recipientUserId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  type: Type.Union([Type.Literal('task'), Type.Literal('content'), Type.Literal('rapidResponse'), Type.Literal('electionDay'), Type.Literal('result'), Type.Literal('incident'), Type.Literal('sync'), Type.Literal('system')]),
  title: Type.String(),
  body: Type.String(),
  priority: Type.Union([Type.Literal('normal'), Type.Literal('high'), Type.Literal('urgent')]),
  channels: Type.Array(Type.Union([Type.Literal('inApp'), Type.Literal('push'), Type.Literal('sms'), Type.Literal('email')])),
  delivery: NotificationDeliverySchema,
}, { additionalProperties: false });

export const NotificationsDataSchema = Type.Object({
  recipientUserId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  type: Type.Union([Type.Literal('task'), Type.Literal('content'), Type.Literal('rapidResponse'), Type.Literal('electionDay'), Type.Literal('result'), Type.Literal('incident'), Type.Literal('sync'), Type.Literal('system')]),
  title: Type.String(),
  body: Type.String(),
  priority: Type.Union([Type.Literal('normal'), Type.Literal('high'), Type.Literal('urgent')]),
  channels: Type.Array(Type.Union([Type.Literal('inApp'), Type.Literal('push'), Type.Literal('sms'), Type.Literal('email')])),
  delivery: NotificationDeliverySchema,
}, { additionalProperties: false });

export const NotificationsPatchSchema = Type.Object({
  recipientUserId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  type: Type.Optional(Type.Union([Type.Literal('task'), Type.Literal('content'), Type.Literal('rapidResponse'), Type.Literal('electionDay'), Type.Literal('result'), Type.Literal('incident'), Type.Literal('sync'), Type.Literal('system')])),
  title: Type.Optional(Type.String()),
  body: Type.Optional(Type.String()),
  priority: Type.Optional(Type.Union([Type.Literal('normal'), Type.Literal('high'), Type.Literal('urgent')])),
  channels: Type.Optional(Type.Array(Type.Union([Type.Literal('inApp'), Type.Literal('push'), Type.Literal('sms'), Type.Literal('email')]))),
  delivery: Type.Optional(NotificationDeliverySchema),
}, { additionalProperties: false });

export const NotificationsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Notifications = Static<typeof NotificationsResultSchema>;
export type NotificationsData = Static<typeof NotificationsDataSchema>;
export type NotificationsPatch = Static<typeof NotificationsPatchSchema>;
export type NotificationsQuery = Static<typeof NotificationsQuerySchema>;

// --- Service ---

export class NotificationsService extends MongoDBService<Notifications, NotificationsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('notifications')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
