import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application, Params } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const IncidentsResultSchema = Type.Object({
  clientSubmissionId: Type.Optional(Type.String()),
  electionCode: Type.Optional(Type.String()),
  incidentType: Type.Union([Type.Literal('violence'), Type.Literal('intimidation'), Type.Literal('voteBuyingObservation'), Type.Literal('bvasIssue'), Type.Literal('inecDelay'), Type.Literal('resultSheetIssue'), Type.Literal('agentHarassment'), Type.Literal('securityConcern'), Type.Literal('collationDelay'), Type.Literal('other')]),
  geography: GeographySnapshotSchema,
  description: Type.String(),
  severity: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
  reportedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  immediateHelpRequired: Type.Boolean(),
  legalEscalationNeeded: Type.Boolean(),
  securityEscalationNeeded: Type.Boolean(),
  status: Type.Union([Type.Literal('new'), Type.Literal('acknowledged'), Type.Literal('assigned'), Type.Literal('inProgress'), Type.Literal('resolved'), Type.Literal('closed'), Type.Literal('dismissed')]),
}, { additionalProperties: false });

export const IncidentsDataSchema = Type.Object({
  clientSubmissionId: Type.Optional(Type.String()),
  electionCode: Type.Optional(Type.String()),
  incidentType: Type.Union([Type.Literal('violence'), Type.Literal('intimidation'), Type.Literal('voteBuyingObservation'), Type.Literal('bvasIssue'), Type.Literal('inecDelay'), Type.Literal('resultSheetIssue'), Type.Literal('agentHarassment'), Type.Literal('securityConcern'), Type.Literal('collationDelay'), Type.Literal('other')]),
  geography: GeographySnapshotSchema,
  description: Type.String(),
  severity: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
  reportedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  immediateHelpRequired: Type.Boolean(),
  legalEscalationNeeded: Type.Boolean(),
  securityEscalationNeeded: Type.Boolean(),
  status: Type.Union([Type.Literal('new'), Type.Literal('acknowledged'), Type.Literal('assigned'), Type.Literal('inProgress'), Type.Literal('resolved'), Type.Literal('closed'), Type.Literal('dismissed')]),
}, { additionalProperties: false });

export const IncidentsPatchSchema = Type.Object({
  electionCode: Type.Optional(Type.Optional(Type.String())),
  incidentType: Type.Optional(Type.Union([Type.Literal('violence'), Type.Literal('intimidation'), Type.Literal('voteBuyingObservation'), Type.Literal('bvasIssue'), Type.Literal('inecDelay'), Type.Literal('resultSheetIssue'), Type.Literal('agentHarassment'), Type.Literal('securityConcern'), Type.Literal('collationDelay'), Type.Literal('other')])),
  geography: Type.Optional(GeographySnapshotSchema),
  description: Type.Optional(Type.String()),
  severity: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')])),
  reportedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  immediateHelpRequired: Type.Optional(Type.Boolean()),
  legalEscalationNeeded: Type.Optional(Type.Boolean()),
  securityEscalationNeeded: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Union([Type.Literal('new'), Type.Literal('acknowledged'), Type.Literal('assigned'), Type.Literal('inProgress'), Type.Literal('resolved'), Type.Literal('closed'), Type.Literal('dismissed')])),
}, { additionalProperties: false });

export const IncidentsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Incidents = Static<typeof IncidentsResultSchema>;
export type IncidentsData = Static<typeof IncidentsDataSchema>;
export type IncidentsPatch = Static<typeof IncidentsPatchSchema>;
export type IncidentsQuery = Static<typeof IncidentsQuerySchema>;

// --- Service ---

export class IncidentsService extends MongoDBService<Incidents, IncidentsData> {
  async create(data: any, params?: Params): Promise<any> {
    const method = params?.route?.__method;
    const id = params?.route?.id;
    if (method && method !== 'escalate') (params as any).__customMethod = true;
    if (method === 'escalate') return this.escalate(id, data, params);
    if (method === 'getSummary') return this.getSummary(params);
    return super.create(data, params);
  }

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('incidents')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
