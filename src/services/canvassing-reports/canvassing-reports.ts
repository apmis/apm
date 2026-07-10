import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const CanvassingReportsResultSchema = Type.Object({
  sessionTitle: Type.String(),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  teamLead: Type.Optional(Type.String()),
  teamSize: Type.Optional(Type.Integer()),
  status: Type.Union([Type.Literal('planned'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('cancelled')]),
  scheduledDate: Type.Optional(Type.String({ format: 'date-time' })),
  visitSummaries: Type.Optional(Type.Array(Type.Object({ name: Type.String(), phone: Type.Optional(Type.String()), supportLevel: Type.Optional(Type.String()), outcome: Type.Optional(Type.String()) }))),
}, { additionalProperties: false });

export const CanvassingReportsDataSchema = Type.Object({
  sessionTitle: Type.String(),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  teamLead: Type.Optional(Type.String()),
  teamSize: Type.Optional(Type.Integer()),
  status: Type.Union([Type.Literal('planned'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('cancelled')]),
  scheduledDate: Type.Optional(Type.String({ format: 'date-time' })),
  visitSummaries: Type.Optional(Type.Array(Type.Object({ name: Type.String(), phone: Type.Optional(Type.String()), supportLevel: Type.Optional(Type.String()), outcome: Type.Optional(Type.String()) }))),
}, { additionalProperties: false });

export const CanvassingReportsPatchSchema = Type.Object({
  sessionTitle: Type.Optional(Type.String()),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  teamLead: Type.Optional(Type.Optional(Type.String())),
  teamSize: Type.Optional(Type.Optional(Type.Integer())),
  status: Type.Optional(Type.Union([Type.Literal('planned'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('cancelled')])),
  scheduledDate: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
  visitSummaries: Type.Optional(Type.Optional(Type.Array(Type.Object({ name: Type.String(), phone: Type.Optional(Type.String()), supportLevel: Type.Optional(Type.String()), outcome: Type.Optional(Type.String()) })))),
}, { additionalProperties: false });

export const CanvassingReportsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type CanvassingReports = Static<typeof CanvassingReportsResultSchema>;
export type CanvassingReportsData = Static<typeof CanvassingReportsDataSchema>;
export type CanvassingReportsPatch = Static<typeof CanvassingReportsPatchSchema>;
export type CanvassingReportsQuery = Static<typeof CanvassingReportsQuerySchema>;

// --- Service ---

export class CanvassingReportsService extends MongoDBService<CanvassingReports, CanvassingReportsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('canvassingReports')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
