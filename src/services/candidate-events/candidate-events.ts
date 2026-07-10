import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const CandidateEventsResultSchema = Type.Object({
  title: Type.String(),
  eventType: Type.Union([Type.Literal('rally'), Type.Literal('townHall'), Type.Literal('stakeholderMeeting'), Type.Literal('campaignEvent'), Type.Literal('other')]),
  geography: GeographySnapshotSchema,
  description: Type.Optional(Type.String()),
  eventDate: Type.String({ format: 'date-time' }),
  expectedAttendees: Type.Optional(Type.Integer()),
  actualAttendees: Type.Optional(Type.Integer()),
  status: Type.Union([Type.Literal('planned'), Type.Literal('confirmed'), Type.Literal('completed'), Type.Literal('cancelled')]),
}, { additionalProperties: false });

export const CandidateEventsDataSchema = Type.Object({
  title: Type.String(),
  eventType: Type.Union([Type.Literal('rally'), Type.Literal('townHall'), Type.Literal('stakeholderMeeting'), Type.Literal('campaignEvent'), Type.Literal('other')]),
  geography: GeographySnapshotSchema,
  description: Type.Optional(Type.String()),
  eventDate: Type.String({ format: 'date-time' }),
  expectedAttendees: Type.Optional(Type.Integer()),
  actualAttendees: Type.Optional(Type.Integer()),
  status: Type.Union([Type.Literal('planned'), Type.Literal('confirmed'), Type.Literal('completed'), Type.Literal('cancelled')]),
}, { additionalProperties: false });

export const CandidateEventsPatchSchema = Type.Object({
  title: Type.Optional(Type.String()),
  eventType: Type.Optional(Type.Union([Type.Literal('rally'), Type.Literal('townHall'), Type.Literal('stakeholderMeeting'), Type.Literal('campaignEvent'), Type.Literal('other')])),
  geography: Type.Optional(GeographySnapshotSchema),
  description: Type.Optional(Type.Optional(Type.String())),
  eventDate: Type.Optional(Type.String({ format: 'date-time' })),
  expectedAttendees: Type.Optional(Type.Optional(Type.Integer())),
  actualAttendees: Type.Optional(Type.Optional(Type.Integer())),
  status: Type.Optional(Type.Union([Type.Literal('planned'), Type.Literal('confirmed'), Type.Literal('completed'), Type.Literal('cancelled')])),
}, { additionalProperties: false });

export const CandidateEventsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type CandidateEvents = Static<typeof CandidateEventsResultSchema>;
export type CandidateEventsData = Static<typeof CandidateEventsDataSchema>;
export type CandidateEventsPatch = Static<typeof CandidateEventsPatchSchema>;
export type CandidateEventsQuery = Static<typeof CandidateEventsQuerySchema>;

// --- Service ---

export class CandidateEventsService extends MongoDBService<CandidateEvents, CandidateEventsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('candidateEvents')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
