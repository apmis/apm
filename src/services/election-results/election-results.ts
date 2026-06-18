import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application, Id, NullableId, Params } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ElectionResultsResultSchema = Type.Object({
  clientSubmissionId: Type.String(),
  electionCode: Type.String(),
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  geography: GeographySnapshotSchema,
  registeredVoters: Type.Optional(Type.Integer()),
  accreditedVoters: Type.Integer(),
  partyResults: Type.Array(PartyResultSchema),
  rejectedVotes: Type.Integer(),
  totalValidVotes: Type.Integer(),
  totalVotesCast: Type.Integer(),
  resultSheetMediaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  submittedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  validation: ResultValidationSchema,
  verificationStatus: Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('superseded')]),
  rejectionReason: Type.Optional(Type.String()),
  revision: Type.Integer(),
}, { additionalProperties: false });

export const ElectionResultsDataSchema = Type.Object({
  clientSubmissionId: Type.String(),
  electionCode: Type.String(),
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  geography: GeographySnapshotSchema,
  accreditedVoters: Type.Integer(),
  partyResults: Type.Array(PartyResultSchema),
  rejectedVotes: Type.Integer(),
  totalValidVotes: Type.Integer(),
  totalVotesCast: Type.Integer(),
  resultSheetMediaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  submittedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  validation: ResultValidationSchema,
  verificationStatus: Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('superseded')]),
  revision: Type.Integer(),
});

export const ElectionResultsPatchSchema = Type.Object({
  electionCode: Type.Optional(Type.String()),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  geography: Type.Optional(GeographySnapshotSchema),
  registeredVoters: Type.Optional(Type.Optional(Type.Integer())),
  accreditedVoters: Type.Optional(Type.Integer()),
  partyResults: Type.Optional(Type.Array(PartyResultSchema)),
  rejectedVotes: Type.Optional(Type.Integer()),
  totalValidVotes: Type.Optional(Type.Integer()),
  totalVotesCast: Type.Optional(Type.Integer()),
  resultSheetMediaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  submittedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  validation: Type.Optional(ResultValidationSchema),
  verificationStatus: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('verified'), Type.Literal('rejected'), Type.Literal('disputed'), Type.Literal('superseded')])),
  rejectionReason: Type.Optional(Type.Optional(Type.String())),
  revision: Type.Optional(Type.Integer()),
});

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
  async create(data: any, params?: Params) {
    const method = params?.route?.__method;
    const id = params?.route?.id;
    if (method) (params as any).__customMethod = true;
    if (method === 'verifyResult') return this.verifyResult(id, params);
    if (method === 'rejectResult') return this.rejectResult(id, data || {}, params);
    if (method === 'getDashboard') return this.getDashboard(params);
    if (method === 'reconcile') return this.reconcile(params);
    return super.create(data, params);
  }

  async verifyResult(id: Id, params?: Params) {
    const result = await this.get(id, params);
    const validation = (result as any).validation;
    if (!validation?.isMathematicallyValid) {
      throw new BadRequest('Result is not mathematically valid');
    }
    return this.patch(id, { verificationStatus: 'verified', revision: (result as any).revision + 1 }, params);
  }

  async rejectResult(id: Id, data: { reason: string }, params?: Params) {
    const result = await this.get(id, params);
    return this.patch(id, {
      verificationStatus: 'rejected',
      rejectionReason: data.reason,
      revision: (result as any).revision + 1,
    } as any, params);
  }

  async getDashboard(params?: Params) {
    const model = (await (this as any).options.Model);
    const pipeline = [
      { $match: { verificationStatus: { $in: ['verified', 'pending'] } } },
      { $group: {
        _id: '$verificationStatus',
        totalUnits: { $sum: 1 },
        totalVotes: { $sum: '$totalValidVotes' },
        accreditedVoters: { $sum: '$accreditedVoters' },
      }},
    ];
    const stats = await model.aggregate(pipeline).toArray();
    const partyPipeline = [
      { $match: { verificationStatus: 'verified' } },
      { $unwind: '$partyResults' },
      { $group: {
        _id: '$partyResults.partyCode',
        partyName: { $first: '$partyResults.partyName' },
        totalVotes: { $sum: '$partyResults.votes' },
        unitCount: { $sum: 1 },
      }},
      { $sort: { totalVotes: -1 } },
    ];
    const partyStats = await model.aggregate(partyPipeline).toArray();
    const lgaPipeline = [
      { $match: { verificationStatus: 'verified' } },
      { $group: {
        _id: '$geography.lgaId',
        totalVotes: { $sum: '$totalValidVotes' },
        accredited: { $sum: '$accreditedVoters' },
        unitCount: { $sum: 1 },
      }},
    ];
    const lgaStats = await model.aggregate(lgaPipeline).toArray();
    const totalResults = stats.reduce((acc: any, s: any) => ({
      totalUnits: (acc.totalUnits || 0) + s.totalUnits,
      totalVotes: (acc.totalVotes || 0) + s.totalVotes,
      accredited: (acc.accredited || 0) + s.accreditedVoters,
    }), {});
    return { stats, partyStats, lgaStats, totals: totalResults, capturedAt: new Date() };
  }

  async reconcile(params?: Params) {
    const model = (await (this as any).options.Model);
    const pipeline = [
      { $match: { verificationStatus: 'verified' } },
      { $group: {
        _id: '$geography.lgaId',
        totalVotesCast: { $sum: '$totalVotesCast' },
        totalValidVotes: { $sum: '$totalValidVotes' },
        rejectedVotes: { $sum: '$rejectedVotes' },
        accreditedVoters: { $sum: '$accreditedVoters' },
        registeredVoters: { $sum: { $ifNull: ['$registeredVoters', 0] } },
        unitCount: { $sum: 1 },
      }},
    ];
    const byLga = await model.aggregate(pipeline).toArray();
    const discrepancies = byLga.filter((lga: any) => {
      const expected = lga.accreditedVoters;
      const actual = lga.totalVotesCast;
      return Math.abs(expected - actual) > 5;
    });
    return { byLga, discrepancyCount: discrepancies.length, discrepancies, discrepancyFlagged: discrepancies.length > 0, reconciledAt: new Date() };
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'electionResults'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
