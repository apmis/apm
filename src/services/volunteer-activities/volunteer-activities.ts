import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const VolunteerActivitiesResultSchema = Type.Object({
  volunteerId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  activityType: Type.String(),
  description: Type.Optional(Type.String()),
  durationHours: Type.Optional(Type.Number()),
  completedAt: Type.String({ format: 'date-time' }),
}, { additionalProperties: false });

export const VolunteerActivitiesDataSchema = Type.Object({
  volunteerId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  activityType: Type.String(),
  description: Type.Optional(Type.String()),
  durationHours: Type.Optional(Type.Number()),
  completedAt: Type.String({ format: 'date-time' }),
}, { additionalProperties: false });

export const VolunteerActivitiesPatchSchema = Type.Object({
  volunteerId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  activityType: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  durationHours: Type.Optional(Type.Optional(Type.Number())),
  completedAt: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const VolunteerActivitiesQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type VolunteerActivities = Static<typeof VolunteerActivitiesResultSchema>;
export type VolunteerActivitiesData = Static<typeof VolunteerActivitiesDataSchema>;
export type VolunteerActivitiesPatch = Static<typeof VolunteerActivitiesPatchSchema>;
export type VolunteerActivitiesQuery = Static<typeof VolunteerActivitiesQuerySchema>;

// --- Service ---

export class VolunteerActivitiesService extends MongoDBService<VolunteerActivities, VolunteerActivitiesData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('volunteerActivities')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
