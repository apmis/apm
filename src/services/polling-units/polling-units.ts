import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const PollingUnitsResultSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  wardId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  registeredVoters: Type.Optional(Type.Integer()),
  location: Type.Optional(Type.Object({ type: Type.Literal('Point'), coordinates: Type.Array(Type.Number(), { minItems: 2, maxItems: 2 }) })),
}, { additionalProperties: false });

export const PollingUnitsDataSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  wardId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
});

export const PollingUnitsPatchSchema = Type.Object({
  code: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  registeredVoters: Type.Optional(Type.Optional(Type.Integer())),
  location: Type.Optional(Type.Optional(Type.Object({ type: Type.Literal('Point'), coordinates: Type.Array(Type.Number(), { minItems: 2, maxItems: 2 }) }))),
});

export const PollingUnitsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type PollingUnits = Static<typeof PollingUnitsResultSchema>;
export type PollingUnitsData = Static<typeof PollingUnitsDataSchema>;
export type PollingUnitsPatch = Static<typeof PollingUnitsPatchSchema>;
export type PollingUnitsQuery = Static<typeof PollingUnitsQuerySchema>;

// --- Service ---

export class PollingUnitsService extends MongoDBService<PollingUnits, PollingUnitsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'pollingUnits'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
