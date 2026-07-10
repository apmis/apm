import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ResultVerificationsResultSchema = Type.Object({
  resultId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  action: Type.Union([Type.Literal('verify'), Type.Literal('reject'), Type.Literal('dispute'), Type.Literal('requestCorrection'), Type.Literal('resolveDispute'), Type.Literal('lock')]),
  decision: Type.Union([Type.Literal('accepted'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('corrected'), Type.Literal('locked')]),
  reviewerId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  reviewedAt: Type.String({ format: 'date-time' }),
  reason: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const ResultVerificationsDataSchema = Type.Object({
  resultId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  action: Type.Union([Type.Literal('verify'), Type.Literal('reject'), Type.Literal('dispute'), Type.Literal('requestCorrection'), Type.Literal('resolveDispute'), Type.Literal('lock')]),
  decision: Type.Union([Type.Literal('accepted'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('corrected'), Type.Literal('locked')]),
  reviewerId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  reviewedAt: Type.String({ format: 'date-time' }),
  reason: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const ResultVerificationsPatchSchema = Type.Object({
  resultId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  action: Type.Optional(Type.Union([Type.Literal('verify'), Type.Literal('reject'), Type.Literal('dispute'), Type.Literal('requestCorrection'), Type.Literal('resolveDispute'), Type.Literal('lock')])),
  decision: Type.Optional(Type.Union([Type.Literal('accepted'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('corrected'), Type.Literal('locked')])),
  reviewerId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  reviewedAt: Type.Optional(Type.String({ format: 'date-time' })),
  reason: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const ResultVerificationsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type ResultVerifications = Static<typeof ResultVerificationsResultSchema>;
export type ResultVerificationsData = Static<typeof ResultVerificationsDataSchema>;
export type ResultVerificationsPatch = Static<typeof ResultVerificationsPatchSchema>;
export type ResultVerificationsQuery = Static<typeof ResultVerificationsQuerySchema>;

// --- Service ---

export class ResultVerificationsService extends MongoDBService<ResultVerifications, ResultVerificationsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('resultVerifications')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
