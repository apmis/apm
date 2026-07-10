import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const AgentAssignmentsResultSchema = Type.Object({
  agentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  role: Type.Union([Type.Literal('main'), Type.Literal('backup')]),
  wardSupervisorId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  status: Type.Union([Type.Literal('assigned'), Type.Literal('confirmed'), Type.Literal('replaced'), Type.Literal('withdrawn'), Type.Literal('completed')]),
  effectiveFrom: Type.String({ format: 'date-time' }),
  assignedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
}, { additionalProperties: false });

export const AgentAssignmentsDataSchema = Type.Object({
  agentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  role: Type.Union([Type.Literal('main'), Type.Literal('backup')]),
  wardSupervisorId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  status: Type.Union([Type.Literal('assigned'), Type.Literal('confirmed'), Type.Literal('replaced'), Type.Literal('withdrawn'), Type.Literal('completed')]),
  effectiveFrom: Type.String({ format: 'date-time' }),
  assignedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
}, { additionalProperties: false });

export const AgentAssignmentsPatchSchema = Type.Object({
  agentId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  role: Type.Optional(Type.Union([Type.Literal('main'), Type.Literal('backup')])),
  wardSupervisorId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  status: Type.Optional(Type.Union([Type.Literal('assigned'), Type.Literal('confirmed'), Type.Literal('replaced'), Type.Literal('withdrawn'), Type.Literal('completed')])),
  effectiveFrom: Type.Optional(Type.String({ format: 'date-time' })),
  assignedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: false });

export const AgentAssignmentsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type AgentAssignments = Static<typeof AgentAssignmentsResultSchema>;
export type AgentAssignmentsData = Static<typeof AgentAssignmentsDataSchema>;
export type AgentAssignmentsPatch = Static<typeof AgentAssignmentsPatchSchema>;
export type AgentAssignmentsQuery = Static<typeof AgentAssignmentsQuerySchema>;

// --- Service ---

export class AgentAssignmentsService extends MongoDBService<AgentAssignments, AgentAssignmentsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('agentAssignments')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
