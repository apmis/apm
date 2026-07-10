import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const GeographyAssignmentsResultSchema = Type.Object({
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  scopeLevel: Type.Union([Type.Literal('state'), Type.Literal('senatorialDistrict'), Type.Literal('lga'), Type.Literal('ward'), Type.Literal('pollingUnit')]),
  stateId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  senatorialDistrictId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  canViewChildren: Type.Boolean(),
  effectiveFrom: Type.String({ format: 'date-time' }),
  effectiveTo: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const GeographyAssignmentsDataSchema = Type.Object({
  userId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  scopeLevel: Type.Union([Type.Literal('state'), Type.Literal('senatorialDistrict'), Type.Literal('lga'), Type.Literal('ward'), Type.Literal('pollingUnit')]),
  stateId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  senatorialDistrictId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  canViewChildren: Type.Boolean(),
  effectiveFrom: Type.String({ format: 'date-time' }),
  effectiveTo: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const GeographyAssignmentsPatchSchema = Type.Object({
  userId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  scopeLevel: Type.Optional(Type.Union([Type.Literal('state'), Type.Literal('senatorialDistrict'), Type.Literal('lga'), Type.Literal('ward'), Type.Literal('pollingUnit')])),
  stateId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  senatorialDistrictId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  lgaId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  wardId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  pollingUnitId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  canViewChildren: Type.Optional(Type.Boolean()),
  effectiveFrom: Type.Optional(Type.String({ format: 'date-time' })),
  effectiveTo: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
}, { additionalProperties: false });

export const GeographyAssignmentsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type GeographyAssignments = Static<typeof GeographyAssignmentsResultSchema>;
export type GeographyAssignmentsData = Static<typeof GeographyAssignmentsDataSchema>;
export type GeographyAssignmentsPatch = Static<typeof GeographyAssignmentsPatchSchema>;
export type GeographyAssignmentsQuery = Static<typeof GeographyAssignmentsQuerySchema>;

// --- Service ---

export class GeographyAssignmentsService extends MongoDBService<GeographyAssignments, GeographyAssignmentsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('geographyAssignments')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
