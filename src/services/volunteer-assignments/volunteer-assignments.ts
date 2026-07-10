import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const VolunteerAssignmentsResultSchema = Type.Object({
  volunteerId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  role: Type.Optional(Type.String()),
  status: Type.Union([Type.Literal('active'), Type.Literal('completed'), Type.Literal('cancelled')]),
  assignedAt: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const VolunteerAssignmentsDataSchema = Type.Object({
  volunteerId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  role: Type.Optional(Type.String()),
  status: Type.Union([Type.Literal('active'), Type.Literal('completed'), Type.Literal('cancelled')]),
  assignedAt: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const VolunteerAssignmentsPatchSchema = Type.Object({
  volunteerId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  lgaId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  wardId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  role: Type.Optional(Type.Optional(Type.String())),
  status: Type.Optional(Type.Union([Type.Literal('active'), Type.Literal('completed'), Type.Literal('cancelled')])),
  assignedAt: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
}, { additionalProperties: false });

export const VolunteerAssignmentsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type VolunteerAssignments = Static<typeof VolunteerAssignmentsResultSchema>;
export type VolunteerAssignmentsData = Static<typeof VolunteerAssignmentsDataSchema>;
export type VolunteerAssignmentsPatch = Static<typeof VolunteerAssignmentsPatchSchema>;
export type VolunteerAssignmentsQuery = Static<typeof VolunteerAssignmentsQuerySchema>;

// --- Service ---

export class VolunteerAssignmentsService extends MongoDBService<VolunteerAssignments, VolunteerAssignmentsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('volunteerAssignments')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
