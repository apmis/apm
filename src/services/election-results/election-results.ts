import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application, Params } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ElectionResultsResultSchema = Type.Object({
  clientSubmissionId: Type.Optional(Type.String()),
  electionCode: Type.Optional(Type.String()),
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  geography: Type.Optional(GeographySnapshotSchema),
  registeredVoters: Type.Optional(Type.Integer()),
  accreditedVoters: Type.Optional(Type.Integer()),
  partyResults: Type.Array(PartyResultSchema),
  rejectedVotes: Type.Optional(Type.Integer()),
  totalValidVotes: Type.Optional(Type.Integer()),
  totalVotesCast: Type.Optional(Type.Integer()),
  resultSheetMediaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  resultSheetBase64: Type.Optional(Type.String()),
  submittedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  validation: Type.Optional(ResultValidationSchema),
  verificationStatus: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('superseded')])),
  revision: Type.Optional(Type.Integer()),
}, { additionalProperties: false });

export const ElectionResultsDataSchema = Type.Object({
  clientSubmissionId: Type.Optional(Type.String()),
  electionCode: Type.Optional(Type.String()),
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  geography: Type.Optional(GeographySnapshotSchema),
  registeredVoters: Type.Optional(Type.Integer()),
  accreditedVoters: Type.Optional(Type.Integer()),
  partyResults: Type.Array(PartyResultSchema),
  rejectedVotes: Type.Optional(Type.Integer()),
  totalValidVotes: Type.Optional(Type.Integer()),
  totalVotesCast: Type.Optional(Type.Integer()),
  resultSheetMediaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  resultSheetBase64: Type.Optional(Type.String()),
  submittedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  validation: Type.Optional(ResultValidationSchema),
  verificationStatus: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('superseded')])),
  revision: Type.Optional(Type.Integer()),
}, { additionalProperties: false });

export const ElectionResultsPatchSchema = Type.Object({
  clientSubmissionId: Type.Optional(Type.String()),
  electionCode: Type.Optional(Type.String()),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  geography: Type.Optional(Type.Optional(GeographySnapshotSchema)),
  registeredVoters: Type.Optional(Type.Optional(Type.Integer())),
  accreditedVoters: Type.Optional(Type.Optional(Type.Integer())),
  partyResults: Type.Optional(Type.Array(PartyResultSchema)),
  rejectedVotes: Type.Optional(Type.Optional(Type.Integer())),
  totalValidVotes: Type.Optional(Type.Optional(Type.Integer())),
  totalVotesCast: Type.Optional(Type.Optional(Type.Integer())),
  resultSheetMediaId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  resultSheetBase64: Type.Optional(Type.Optional(Type.String())),
  submittedBy: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  validation: Type.Optional(Type.Optional(ResultValidationSchema)),
  verificationStatus: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('superseded')])),
  revision: Type.Optional(Type.Optional(Type.Integer())),
}, { additionalProperties: false });

export const ElectionResultsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type ElectionResults = Static<typeof ElectionResultsResultSchema>;
export type ElectionResultsData = Static<typeof ElectionResultsDataSchema>;
export type ElectionResultsPatch = Static<typeof ElectionResultsPatchSchema>;
export type ElectionResultsQuery = Static<typeof ElectionResultsQuerySchema>;

// --- Service ---

export class ElectionResultsService extends MongoDBService<ElectionResults, ElectionResultsData> {
  async create(data: any, params?: Params): Promise<any> {
    const method = params?.route?.__method;
    const id = params?.route?.id;
    if (method) (params as any).__customMethod = true;
    if (method === 'verifyResult') return (this as any).verifyResult(id, params);
    if (method === 'rejectResult') return (this as any).rejectResult(id, data || {}, params);
    if (method === 'getDashboard') return (this as any).getDashboard(params);
    if (method === 'reconcile') return (this as any).reconcile(params);
    return super.create(data, params);
  }

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('electionResults')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
