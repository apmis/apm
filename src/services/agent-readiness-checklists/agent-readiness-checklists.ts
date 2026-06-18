import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const AgentReadinessChecklistsResultSchema = Type.Object({
  assignmentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  cycleCode: Type.String(),
  items: Type.Object({ assignmentConfirmed: Type.Boolean(), trainingCompleted: Type.Boolean(), smartphone: Type.Boolean(), powerBank: Type.Boolean(), dataBundle: Type.Boolean(), supervisorKnown: Type.Boolean(), lgaContactKnown: Type.Boolean(), legalKnown: Type.Boolean(), securityKnown: Type.Boolean(), photoProtocol: Type.Boolean(), reportingUnderstood: Type.Boolean(), arrivalConfirmed: Type.Boolean() }),
  readinessPercent: Type.Integer({ minimum: 0, maximum: 100 }),
  supervisorStatus: Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected')]),
  supervisorId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: false });

export const AgentReadinessChecklistsDataSchema = Type.Object({
  assignmentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  cycleCode: Type.String(),
  items: Type.Object({ assignmentConfirmed: Type.Boolean(), trainingCompleted: Type.Boolean(), smartphone: Type.Boolean(), powerBank: Type.Boolean(), dataBundle: Type.Boolean(), supervisorKnown: Type.Boolean(), lgaContactKnown: Type.Boolean(), legalKnown: Type.Boolean(), securityKnown: Type.Boolean(), photoProtocol: Type.Boolean(), reportingUnderstood: Type.Boolean(), arrivalConfirmed: Type.Boolean() }),
  readinessPercent: Type.Integer({ minimum: 0, maximum: 100 }),
  supervisorStatus: Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected')]),
});

export const AgentReadinessChecklistsPatchSchema = Type.Object({
  assignmentId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  cycleCode: Type.Optional(Type.String()),
  items: Type.Optional(Type.Object({ assignmentConfirmed: Type.Boolean(), trainingCompleted: Type.Boolean(), smartphone: Type.Boolean(), powerBank: Type.Boolean(), dataBundle: Type.Boolean(), supervisorKnown: Type.Boolean(), lgaContactKnown: Type.Boolean(), legalKnown: Type.Boolean(), securityKnown: Type.Boolean(), photoProtocol: Type.Boolean(), reportingUnderstood: Type.Boolean(), arrivalConfirmed: Type.Boolean() })),
  readinessPercent: Type.Optional(Type.Integer({ minimum: 0, maximum: 100 })),
  supervisorStatus: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected')])),
  supervisorId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
});

export const AgentReadinessChecklistsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type AgentReadinessChecklists = Static<typeof AgentReadinessChecklistsResultSchema>;
export type AgentReadinessChecklistsData = Static<typeof AgentReadinessChecklistsDataSchema>;
export type AgentReadinessChecklistsPatch = Static<typeof AgentReadinessChecklistsPatchSchema>;
export type AgentReadinessChecklistsQuery = Static<typeof AgentReadinessChecklistsQuerySchema>;

// --- Service ---

export class AgentReadinessChecklistsService extends MongoDBService<AgentReadinessChecklists, AgentReadinessChecklistsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'agentReadinessChecklists'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
