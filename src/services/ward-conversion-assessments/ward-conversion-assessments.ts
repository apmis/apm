import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const WardConversionAssessmentsResultSchema = Type.Object({
  wardId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  assessmentWeek: Type.String(),
  score: Type.Integer({ minimum: 0, maximum: 100 }),
  status: Type.Union([Type.Literal('green'), Type.Literal('yellow'), Type.Literal('red'), Type.Literal('grey')]),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const WardConversionAssessmentsDataSchema = Type.Object({
  wardId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  assessmentWeek: Type.String(),
  score: Type.Integer({ minimum: 0, maximum: 100 }),
  status: Type.Union([Type.Literal('green'), Type.Literal('yellow'), Type.Literal('red'), Type.Literal('grey')]),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const WardConversionAssessmentsPatchSchema = Type.Object({
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  assessmentWeek: Type.Optional(Type.String()),
  score: Type.Optional(Type.Integer({ minimum: 0, maximum: 100 })),
  status: Type.Optional(Type.Union([Type.Literal('green'), Type.Literal('yellow'), Type.Literal('red'), Type.Literal('grey')])),
  notes: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const WardConversionAssessmentsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type WardConversionAssessments = Static<typeof WardConversionAssessmentsResultSchema>;
export type WardConversionAssessmentsData = Static<typeof WardConversionAssessmentsDataSchema>;
export type WardConversionAssessmentsPatch = Static<typeof WardConversionAssessmentsPatchSchema>;
export type WardConversionAssessmentsQuery = Static<typeof WardConversionAssessmentsQuerySchema>;

// --- Service ---

export class WardConversionAssessmentsService extends MongoDBService<WardConversionAssessments, WardConversionAssessmentsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('wardConversionAssessments')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
