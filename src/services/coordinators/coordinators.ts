import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';

// --- Schemas ---

export const CoordinatorsResultSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  fullName: Type.String(),
  phone: Type.Optional(Type.String()),
  role: Type.Union([Type.Literal('coordinator'), Type.Literal('agent'), Type.Literal('supervisor')]),
  status: Type.Union([Type.Literal('active'), Type.Literal('inactive'), Type.Literal('pending')]),
  assignedBy: Type.Optional(Type.String()),
  assignedAt: Type.Optional(Type.String({ format: 'date-time' })),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const CoordinatorsDataSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  fullName: Type.String(),
  phone: Type.Optional(Type.String()),
  role: Type.Union([Type.Literal('coordinator'), Type.Literal('agent'), Type.Literal('supervisor')]),
  status: Type.Union([Type.Literal('active'), Type.Literal('inactive'), Type.Literal('pending')]),
  assignedBy: Type.Optional(Type.String()),
  assignedAt: Type.Optional(Type.String({ format: 'date-time' })),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const CoordinatorsPatchSchema = Type.Object({
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  fullName: Type.Optional(Type.String()),
  phone: Type.Optional(Type.String()),
  role: Type.Optional(Type.Union([Type.Literal('coordinator'), Type.Literal('agent'), Type.Literal('supervisor')])),
  status: Type.Optional(Type.Union([Type.Literal('active'), Type.Literal('inactive'), Type.Literal('pending')])),
  assignedBy: Type.Optional(Type.Optional(Type.String())),
  assignedAt: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
  notes: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const CoordinatorsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: true });

export type Coordinators = Static<typeof CoordinatorsResultSchema>;
export type CoordinatorsData = Static<typeof CoordinatorsDataSchema>;
export type CoordinatorsPatch = Static<typeof CoordinatorsPatchSchema>;
export type CoordinatorsQuery = Static<typeof CoordinatorsQuerySchema>;

// --- Service ---

export class CoordinatorsService extends MongoDBService<Coordinators, CoordinatorsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('coordinators')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
