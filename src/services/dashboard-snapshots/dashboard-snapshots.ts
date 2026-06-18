import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const DashboardSnapshotsResultSchema = Type.Object({
  snapshotType: Type.String(),
  scopeLevel: Type.Union([Type.Literal('state'), Type.Literal('district'), Type.Literal('lga'), Type.Literal('ward')]),
  scopeId: Type.String(),
  periodCode: Type.String(),
  metrics: Type.Object({}),
  generatedAt: Type.String(),
  version: Type.Integer(),
}, { additionalProperties: false });

export const DashboardSnapshotsDataSchema = Type.Object({
  snapshotType: Type.String(),
  scopeLevel: Type.Union([Type.Literal('state'), Type.Literal('district'), Type.Literal('lga'), Type.Literal('ward')]),
  scopeId: Type.String(),
  periodCode: Type.String(),
  metrics: Type.Object({}),
  generatedAt: Type.String(),
  version: Type.Integer(),
});

export const DashboardSnapshotsPatchSchema = Type.Object({
  snapshotType: Type.Optional(Type.String()),
  scopeLevel: Type.Optional(Type.Union([Type.Literal('state'), Type.Literal('district'), Type.Literal('lga'), Type.Literal('ward')])),
  scopeId: Type.Optional(Type.String()),
  periodCode: Type.Optional(Type.String()),
  metrics: Type.Optional(Type.Object({})),
  generatedAt: Type.Optional(Type.String()),
  version: Type.Optional(Type.Integer()),
});

export const DashboardSnapshotsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type DashboardSnapshots = Static<typeof DashboardSnapshotsResultSchema>;
export type DashboardSnapshotsData = Static<typeof DashboardSnapshotsDataSchema>;
export type DashboardSnapshotsPatch = Static<typeof DashboardSnapshotsPatchSchema>;
export type DashboardSnapshotsQuery = Static<typeof DashboardSnapshotsQuerySchema>;

// --- Service ---

export class DashboardSnapshotsService extends MongoDBService<DashboardSnapshots, DashboardSnapshotsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'dashboardSnapshots'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
