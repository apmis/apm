import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const EventReportsResultSchema = Type.Object({
  eventId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  attendanceEstimate: Type.Optional(Type.Integer()),
  keyComplaints: Type.Optional(Type.Array(Type.String())),
  oppositionReaction: Type.Optional(Type.String()),
  volunteerSignups: Type.Optional(Type.Integer()),
  conversionScore: Type.Optional(Type.Integer()),
  followUpRequired: Type.Boolean(),
  submittedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
}, { additionalProperties: false });

export const EventReportsDataSchema = Type.Object({
  eventId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  followUpRequired: Type.Boolean(),
  submittedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
});

export const EventReportsPatchSchema = Type.Object({
  eventId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  attendanceEstimate: Type.Optional(Type.Optional(Type.Integer())),
  keyComplaints: Type.Optional(Type.Optional(Type.Array(Type.String()))),
  oppositionReaction: Type.Optional(Type.Optional(Type.String())),
  volunteerSignups: Type.Optional(Type.Optional(Type.Integer())),
  conversionScore: Type.Optional(Type.Optional(Type.Integer())),
  followUpRequired: Type.Optional(Type.Boolean()),
  submittedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
});

export const EventReportsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type EventReports = Static<typeof EventReportsResultSchema>;
export type EventReportsData = Static<typeof EventReportsDataSchema>;
export type EventReportsPatch = Static<typeof EventReportsPatchSchema>;
export type EventReportsQuery = Static<typeof EventReportsQuerySchema>;

// --- Service ---

export class EventReportsService extends MongoDBService<EventReports, EventReportsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'eventReports'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
