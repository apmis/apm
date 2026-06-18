import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const AgentTrainingRecordsResultSchema = Type.Object({
  agentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  trainingCode: Type.String(),
  sessionAt: Type.String(),
  attendanceStatus: Type.Union([Type.Literal('registered'), Type.Literal('attended'), Type.Literal('absent'), Type.Literal('excused')]),
  assessmentScore: Type.Optional(Type.Integer({ minimum: 0, maximum: 100 })),
  completed: Type.Boolean(),
  trainerId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: false });

export const AgentTrainingRecordsDataSchema = Type.Object({
  agentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  trainingCode: Type.String(),
  sessionAt: Type.String(),
  attendanceStatus: Type.Union([Type.Literal('registered'), Type.Literal('attended'), Type.Literal('absent'), Type.Literal('excused')]),
  completed: Type.Boolean(),
});

export const AgentTrainingRecordsPatchSchema = Type.Object({
  agentId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  trainingCode: Type.Optional(Type.String()),
  sessionAt: Type.Optional(Type.String()),
  attendanceStatus: Type.Optional(Type.Union([Type.Literal('registered'), Type.Literal('attended'), Type.Literal('absent'), Type.Literal('excused')])),
  assessmentScore: Type.Optional(Type.Optional(Type.Integer({ minimum: 0, maximum: 100 }))),
  completed: Type.Optional(Type.Boolean()),
  trainerId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
});

export const AgentTrainingRecordsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type AgentTrainingRecords = Static<typeof AgentTrainingRecordsResultSchema>;
export type AgentTrainingRecordsData = Static<typeof AgentTrainingRecordsDataSchema>;
export type AgentTrainingRecordsPatch = Static<typeof AgentTrainingRecordsPatchSchema>;
export type AgentTrainingRecordsQuery = Static<typeof AgentTrainingRecordsQuerySchema>;

// --- Service ---

export class AgentTrainingRecordsService extends MongoDBService<AgentTrainingRecords, AgentTrainingRecordsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'agentTrainingRecords'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
