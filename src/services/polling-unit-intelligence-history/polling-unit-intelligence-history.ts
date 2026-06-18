import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const PollingUnitIntelligenceHistoryResultSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  snapshot: Type.Object({}),
  assessedAt: Type.String(),
  assessedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: false });

export const PollingUnitIntelligenceHistoryDataSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  snapshot: Type.Object({}),
  assessedAt: Type.String(),
});

export const PollingUnitIntelligenceHistoryPatchSchema = Type.Object({
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  snapshot: Type.Optional(Type.Object({})),
  assessedAt: Type.Optional(Type.String()),
  assessedBy: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
});

export const PollingUnitIntelligenceHistoryQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type PollingUnitIntelligenceHistory = Static<typeof PollingUnitIntelligenceHistoryResultSchema>;
export type PollingUnitIntelligenceHistoryData = Static<typeof PollingUnitIntelligenceHistoryDataSchema>;
export type PollingUnitIntelligenceHistoryPatch = Static<typeof PollingUnitIntelligenceHistoryPatchSchema>;
export type PollingUnitIntelligenceHistoryQuery = Static<typeof PollingUnitIntelligenceHistoryQuerySchema>;

// --- Service ---

export class PollingUnitIntelligenceHistoryService extends MongoDBService<PollingUnitIntelligenceHistory, PollingUnitIntelligenceHistoryData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'pollingUnitIntelligenceHistory'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
