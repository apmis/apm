import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const PollingUnitIntelligenceResultSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  riskLevel: Type.Union([Type.Literal('green'), Type.Literal('yellow'), Type.Literal('red'), Type.Literal('grey')]),
  conversionStatus: Type.Union([Type.Literal('untouched'), Type.Literal('engaged'), Type.Literal('won'), Type.Literal('lost')]),
  pastResultApm: Type.Optional(Type.Integer()),
  pastResultPdp: Type.Optional(Type.Integer()),
  pastResultApc: Type.Optional(Type.Integer()),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const PollingUnitIntelligenceDataSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  riskLevel: Type.Union([Type.Literal('green'), Type.Literal('yellow'), Type.Literal('red'), Type.Literal('grey')]),
  conversionStatus: Type.Union([Type.Literal('untouched'), Type.Literal('engaged'), Type.Literal('won'), Type.Literal('lost')]),
});

export const PollingUnitIntelligencePatchSchema = Type.Object({
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  riskLevel: Type.Optional(Type.Union([Type.Literal('green'), Type.Literal('yellow'), Type.Literal('red'), Type.Literal('grey')])),
  conversionStatus: Type.Optional(Type.Union([Type.Literal('untouched'), Type.Literal('engaged'), Type.Literal('won'), Type.Literal('lost')])),
  pastResultApm: Type.Optional(Type.Optional(Type.Integer())),
  pastResultPdp: Type.Optional(Type.Optional(Type.Integer())),
  pastResultApc: Type.Optional(Type.Optional(Type.Integer())),
  notes: Type.Optional(Type.Optional(Type.String())),
});

export const PollingUnitIntelligenceQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type PollingUnitIntelligence = Static<typeof PollingUnitIntelligenceResultSchema>;
export type PollingUnitIntelligenceData = Static<typeof PollingUnitIntelligenceDataSchema>;
export type PollingUnitIntelligencePatch = Static<typeof PollingUnitIntelligencePatchSchema>;
export type PollingUnitIntelligenceQuery = Static<typeof PollingUnitIntelligenceQuerySchema>;

// --- Service ---

export class PollingUnitIntelligenceService extends MongoDBService<PollingUnitIntelligence, PollingUnitIntelligenceData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'pollingUnitIntelligence'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
