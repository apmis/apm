import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

const ScoreSchema = Type.Integer({ minimum: 1, maximum: 10 });

export const StakeholdersResultSchema = Type.Object({
  fullName: Type.String(),
  profileRole: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  bank: Type.Optional(Type.String()),
  accountNumber: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  commitments: Type.Optional(Type.String()),
  trackerStatus: Type.Optional(Type.String()),
  trackerPercentage: Type.Optional(Type.Integer({ minimum: 0, maximum: 100 })),
  riskScore: Type.Optional(ScoreSchema),
  influenceScore: Type.Optional(ScoreSchema),
  alignmentScore: Type.Optional(ScoreSchema),
  consent: Type.Optional(ConsentRecordSchema),
}, { additionalProperties: false });

export const StakeholdersDataSchema = Type.Object({
  fullName: Type.String(),
  profileRole: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  bank: Type.Optional(Type.String()),
  accountNumber: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  commitments: Type.Optional(Type.String()),
  trackerStatus: Type.Optional(Type.String()),
  trackerPercentage: Type.Optional(Type.Integer({ minimum: 0, maximum: 100 })),
  riskScore: Type.Optional(ScoreSchema),
  influenceScore: Type.Optional(ScoreSchema),
  alignmentScore: Type.Optional(ScoreSchema),
  consent: Type.Optional(ConsentRecordSchema),
}, { additionalProperties: false });

export const StakeholdersPatchSchema = Type.Object({
  fullName: Type.Optional(Type.String()),
  profileRole: Type.Optional(Type.Optional(Type.String())),
  phoneNumber: Type.Optional(Type.Optional(Type.String())),
  email: Type.Optional(Type.Optional(Type.String({ format: 'email' }))),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  bank: Type.Optional(Type.Optional(Type.String())),
  accountNumber: Type.Optional(Type.Optional(Type.String())),
  description: Type.Optional(Type.Optional(Type.String())),
  commitments: Type.Optional(Type.Optional(Type.String())),
  trackerStatus: Type.Optional(Type.Optional(Type.String())),
  trackerPercentage: Type.Optional(Type.Optional(Type.Integer({ minimum: 0, maximum: 100 }))),
  riskScore: Type.Optional(Type.Optional(ScoreSchema)),
  influenceScore: Type.Optional(Type.Optional(ScoreSchema)),
  alignmentScore: Type.Optional(Type.Optional(ScoreSchema)),
  consent: Type.Optional(Type.Optional(ConsentRecordSchema)),
}, { additionalProperties: false });

export const StakeholdersQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Stakeholders = Static<typeof StakeholdersResultSchema>;
export type StakeholdersData = Static<typeof StakeholdersDataSchema>;
export type StakeholdersPatch = Static<typeof StakeholdersPatchSchema>;
export type StakeholdersQuery = Static<typeof StakeholdersQuerySchema>;

// --- Service ---

export class StakeholdersService extends MongoDBService<Stakeholders, StakeholdersData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('stakeholders')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
