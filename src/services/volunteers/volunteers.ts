import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const VolunteersResultSchema = Type.Object({
  fullName: Type.String(),
  phoneNumber: Type.String(),
  email: Type.Optional(Type.String()),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  skills: Type.Optional(Type.String()),
  availability: Type.Optional(Type.String()),
  onboarded: Type.Boolean(),
  consent: Type.Optional(ConsentRecordSchema),
}, { additionalProperties: false });

export const VolunteersDataSchema = Type.Object({
  fullName: Type.String(),
  phoneNumber: Type.String(),
  onboarded: Type.Boolean(),
});

export const VolunteersPatchSchema = Type.Object({
  fullName: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  email: Type.Optional(Type.Optional(Type.String())),
  lgaId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  wardId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  skills: Type.Optional(Type.Optional(Type.String())),
  availability: Type.Optional(Type.Optional(Type.String())),
  onboarded: Type.Optional(Type.Boolean()),
  consent: Type.Optional(Type.Optional(ConsentRecordSchema)),
});

export const VolunteersQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Volunteers = Static<typeof VolunteersResultSchema>;
export type VolunteersData = Static<typeof VolunteersDataSchema>;
export type VolunteersPatch = Static<typeof VolunteersPatchSchema>;
export type VolunteersQuery = Static<typeof VolunteersQuerySchema>;

// --- Service ---

export class VolunteersService extends MongoDBService<Volunteers, VolunteersData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'volunteers'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
