import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const PollingUnitAgentsResultSchema = Type.Object({
  fullName: Type.String(),
  phoneNumber: Type.String(),
  userId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  smartphoneAvailable: Type.Boolean(),
  powerBankAvailable: Type.Boolean(),
  dataBundleReady: Type.Boolean(),
  status: Type.Union([Type.Literal('prospective'), Type.Literal('approved'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('withdrawn')]),
}, { additionalProperties: false });

export const PollingUnitAgentsDataSchema = Type.Object({
  fullName: Type.String(),
  phoneNumber: Type.String(),
  userId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  smartphoneAvailable: Type.Boolean(),
  powerBankAvailable: Type.Boolean(),
  dataBundleReady: Type.Boolean(),
  status: Type.Union([Type.Literal('prospective'), Type.Literal('approved'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('withdrawn')]),
}, { additionalProperties: false });

export const PollingUnitAgentsPatchSchema = Type.Object({
  fullName: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  userId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  smartphoneAvailable: Type.Optional(Type.Boolean()),
  powerBankAvailable: Type.Optional(Type.Boolean()),
  dataBundleReady: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Union([Type.Literal('prospective'), Type.Literal('approved'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('withdrawn')])),
}, { additionalProperties: false });

export const PollingUnitAgentsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type PollingUnitAgents = Static<typeof PollingUnitAgentsResultSchema>;
export type PollingUnitAgentsData = Static<typeof PollingUnitAgentsDataSchema>;
export type PollingUnitAgentsPatch = Static<typeof PollingUnitAgentsPatchSchema>;
export type PollingUnitAgentsQuery = Static<typeof PollingUnitAgentsQuerySchema>;

// --- Service ---

export class PollingUnitAgentsService extends MongoDBService<PollingUnitAgents, PollingUnitAgentsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('pollingUnitAgents')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
