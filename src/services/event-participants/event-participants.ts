import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const EventParticipantsResultSchema = Type.Object({
  eventId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  participantType: Type.Union([Type.Literal('stakeholder'), Type.Literal('volunteer'), Type.Literal('user'), Type.Literal('group')]),
  participantId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  displayName: Type.String(),
  attended: Type.Optional(Type.Boolean()),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const EventParticipantsDataSchema = Type.Object({
  eventId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  participantType: Type.Union([Type.Literal('stakeholder'), Type.Literal('volunteer'), Type.Literal('user'), Type.Literal('group')]),
  participantId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  displayName: Type.String(),
  attended: Type.Optional(Type.Boolean()),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const EventParticipantsPatchSchema = Type.Object({
  eventId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  participantType: Type.Optional(Type.Union([Type.Literal('stakeholder'), Type.Literal('volunteer'), Type.Literal('user'), Type.Literal('group')])),
  participantId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  displayName: Type.Optional(Type.String()),
  attended: Type.Optional(Type.Optional(Type.Boolean())),
  notes: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const EventParticipantsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type EventParticipants = Static<typeof EventParticipantsResultSchema>;
export type EventParticipantsData = Static<typeof EventParticipantsDataSchema>;
export type EventParticipantsPatch = Static<typeof EventParticipantsPatchSchema>;
export type EventParticipantsQuery = Static<typeof EventParticipantsQuerySchema>;

// --- Service ---

export class EventParticipantsService extends MongoDBService<EventParticipants, EventParticipantsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('eventParticipants')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
