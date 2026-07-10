import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const GeneratedReportsResultSchema = Type.Object({
  reportType: Type.String(),
  requestedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  parameters: Type.Object({}),
  format: Type.Union([Type.Literal('pdf'), Type.Literal('xlsx'), Type.Literal('csv')]),
  status: Type.Union([Type.Literal('queued'), Type.Literal('processing'), Type.Literal('completed'), Type.Literal('failed'), Type.Literal('expired')]),
  fileId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: false });

export const GeneratedReportsDataSchema = Type.Object({
  reportType: Type.String(),
  requestedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  parameters: Type.Object({}),
  format: Type.Union([Type.Literal('pdf'), Type.Literal('xlsx'), Type.Literal('csv')]),
  status: Type.Union([Type.Literal('queued'), Type.Literal('processing'), Type.Literal('completed'), Type.Literal('failed'), Type.Literal('expired')]),
  fileId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: false });

export const GeneratedReportsPatchSchema = Type.Object({
  reportType: Type.Optional(Type.String()),
  requestedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  parameters: Type.Optional(Type.Object({})),
  format: Type.Optional(Type.Union([Type.Literal('pdf'), Type.Literal('xlsx'), Type.Literal('csv')])),
  status: Type.Optional(Type.Union([Type.Literal('queued'), Type.Literal('processing'), Type.Literal('completed'), Type.Literal('failed'), Type.Literal('expired')])),
  fileId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
}, { additionalProperties: false });

export const GeneratedReportsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type GeneratedReports = Static<typeof GeneratedReportsResultSchema>;
export type GeneratedReportsData = Static<typeof GeneratedReportsDataSchema>;
export type GeneratedReportsPatch = Static<typeof GeneratedReportsPatchSchema>;
export type GeneratedReportsQuery = Static<typeof GeneratedReportsQuerySchema>;

// --- Service ---

export class GeneratedReportsService extends MongoDBService<GeneratedReports, GeneratedReportsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('generatedReports')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
