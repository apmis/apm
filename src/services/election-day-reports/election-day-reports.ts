import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ElectionDayReportsResultSchema = Type.Object({
  clientSubmissionId: Type.String(),
  electionCode: Type.String(),
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  geography: GeographySnapshotSchema,
  reportType: Type.Union([Type.Literal('agentArrival'), Type.Literal('inecArrival'), Type.Literal('bvasArrival'), Type.Literal('accreditationStart'), Type.Literal('turnoutUpdate'), Type.Literal('countingStart'), Type.Literal('collationMovement'), Type.Literal('operationalUpdate')]),
  reportedAt: Type.String({ format: 'date-time' }),
  reportedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  payload: Type.Object({}),
  syncState: Type.Union([Type.Literal('received'), Type.Literal('validated'), Type.Literal('flagged'), Type.Literal('superseded')]),
}, { additionalProperties: false });

export const ElectionDayReportsDataSchema = Type.Object({
  clientSubmissionId: Type.String(),
  electionCode: Type.String(),
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  geography: GeographySnapshotSchema,
  reportType: Type.Union([Type.Literal('agentArrival'), Type.Literal('inecArrival'), Type.Literal('bvasArrival'), Type.Literal('accreditationStart'), Type.Literal('turnoutUpdate'), Type.Literal('countingStart'), Type.Literal('collationMovement'), Type.Literal('operationalUpdate')]),
  reportedAt: Type.String({ format: 'date-time' }),
  reportedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  payload: Type.Object({}),
  syncState: Type.Union([Type.Literal('received'), Type.Literal('validated'), Type.Literal('flagged'), Type.Literal('superseded')]),
}, { additionalProperties: false });

export const ElectionDayReportsPatchSchema = Type.Object({
  electionCode: Type.Optional(Type.String()),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  geography: Type.Optional(GeographySnapshotSchema),
  reportType: Type.Optional(Type.Union([Type.Literal('agentArrival'), Type.Literal('inecArrival'), Type.Literal('bvasArrival'), Type.Literal('accreditationStart'), Type.Literal('turnoutUpdate'), Type.Literal('countingStart'), Type.Literal('collationMovement'), Type.Literal('operationalUpdate')])),
  reportedAt: Type.Optional(Type.String({ format: 'date-time' })),
  reportedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  payload: Type.Optional(Type.Object({})),
  syncState: Type.Optional(Type.Union([Type.Literal('received'), Type.Literal('validated'), Type.Literal('flagged'), Type.Literal('superseded')])),
}, { additionalProperties: false });

export const ElectionDayReportsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type ElectionDayReports = Static<typeof ElectionDayReportsResultSchema>;
export type ElectionDayReportsData = Static<typeof ElectionDayReportsDataSchema>;
export type ElectionDayReportsPatch = Static<typeof ElectionDayReportsPatchSchema>;
export type ElectionDayReportsQuery = Static<typeof ElectionDayReportsQuerySchema>;

// --- Service ---

export class ElectionDayReportsService extends MongoDBService<ElectionDayReports, ElectionDayReportsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('electionDayReports')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
