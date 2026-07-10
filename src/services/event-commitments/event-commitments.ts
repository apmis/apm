import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const EventCommitmentsResultSchema = Type.Object({
  eventId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  stakeholderId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  commitment: Type.String(),
  ownerId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  dueAt: Type.Optional(Type.String({ format: 'date-time' })),
  priority: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
  status: Type.Union([Type.Literal('open'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('declined'), Type.Literal('cancelled')]),
}, { additionalProperties: false });

export const EventCommitmentsDataSchema = Type.Object({
  eventId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  stakeholderId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  commitment: Type.String(),
  ownerId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  dueAt: Type.Optional(Type.String({ format: 'date-time' })),
  priority: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
  status: Type.Union([Type.Literal('open'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('declined'), Type.Literal('cancelled')]),
}, { additionalProperties: false });

export const EventCommitmentsPatchSchema = Type.Object({
  eventId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  stakeholderId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  commitment: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  dueAt: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
  priority: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')])),
  status: Type.Optional(Type.Union([Type.Literal('open'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('declined'), Type.Literal('cancelled')])),
}, { additionalProperties: false });

export const EventCommitmentsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type EventCommitments = Static<typeof EventCommitmentsResultSchema>;
export type EventCommitmentsData = Static<typeof EventCommitmentsDataSchema>;
export type EventCommitmentsPatch = Static<typeof EventCommitmentsPatchSchema>;
export type EventCommitmentsQuery = Static<typeof EventCommitmentsQuerySchema>;

// --- Service ---

export class EventCommitmentsService extends MongoDBService<EventCommitments, EventCommitmentsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('eventCommitments')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
