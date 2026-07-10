import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ResultReconciliationsResultSchema = Type.Object({
  electionCode: Type.String(),
  scopeLevel: Type.Union([Type.Literal('pollingUnit'), Type.Literal('ward'), Type.Literal('lga'), Type.Literal('state')]),
  scopeId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  sourceType: Type.Union([Type.Literal('campaignAggregate'), Type.Literal('officialAnnouncement'), Type.Literal('legalDocument'), Type.Literal('other')]),
  partyTotals: Type.Array(PartyResultSchema),
  status: Type.Union([Type.Literal('pending'), Type.Literal('matched'), Type.Literal('discrepancy'), Type.Literal('resolved')]),
}, { additionalProperties: false });

export const ResultReconciliationsDataSchema = Type.Object({
  electionCode: Type.String(),
  scopeLevel: Type.Union([Type.Literal('pollingUnit'), Type.Literal('ward'), Type.Literal('lga'), Type.Literal('state')]),
  scopeId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  sourceType: Type.Union([Type.Literal('campaignAggregate'), Type.Literal('officialAnnouncement'), Type.Literal('legalDocument'), Type.Literal('other')]),
  partyTotals: Type.Array(PartyResultSchema),
  status: Type.Union([Type.Literal('pending'), Type.Literal('matched'), Type.Literal('discrepancy'), Type.Literal('resolved')]),
}, { additionalProperties: false });

export const ResultReconciliationsPatchSchema = Type.Object({
  electionCode: Type.Optional(Type.String()),
  scopeLevel: Type.Optional(Type.Union([Type.Literal('pollingUnit'), Type.Literal('ward'), Type.Literal('lga'), Type.Literal('state')])),
  scopeId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  sourceType: Type.Optional(Type.Union([Type.Literal('campaignAggregate'), Type.Literal('officialAnnouncement'), Type.Literal('legalDocument'), Type.Literal('other')])),
  partyTotals: Type.Optional(Type.Array(PartyResultSchema)),
  status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('matched'), Type.Literal('discrepancy'), Type.Literal('resolved')])),
}, { additionalProperties: false });

export const ResultReconciliationsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type ResultReconciliations = Static<typeof ResultReconciliationsResultSchema>;
export type ResultReconciliationsData = Static<typeof ResultReconciliationsDataSchema>;
export type ResultReconciliationsPatch = Static<typeof ResultReconciliationsPatchSchema>;
export type ResultReconciliationsQuery = Static<typeof ResultReconciliationsQuerySchema>;

// --- Service ---

export class ResultReconciliationsService extends MongoDBService<ResultReconciliations, ResultReconciliationsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('resultReconciliations')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
