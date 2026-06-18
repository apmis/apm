import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const StakeholderEngagementsResultSchema = Type.Object({
  stakeholderId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  engagementType: Type.Union([Type.Literal('meeting'), Type.Literal('call'), Type.Literal('visit'), Type.Literal('event'), Type.Literal('followUp')]),
  conductedAt: Type.String(),
  conductedBy: Type.Optional(Type.String()),
  notes: Type.Optional(Type.String()),
  outcome: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const StakeholderEngagementsDataSchema = Type.Object({
  stakeholderId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  engagementType: Type.Union([Type.Literal('meeting'), Type.Literal('call'), Type.Literal('visit'), Type.Literal('event'), Type.Literal('followUp')]),
  conductedAt: Type.String(),
});

export const StakeholderEngagementsPatchSchema = Type.Object({
  stakeholderId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  engagementType: Type.Optional(Type.Union([Type.Literal('meeting'), Type.Literal('call'), Type.Literal('visit'), Type.Literal('event'), Type.Literal('followUp')])),
  conductedAt: Type.Optional(Type.String()),
  conductedBy: Type.Optional(Type.Optional(Type.String())),
  notes: Type.Optional(Type.Optional(Type.String())),
  outcome: Type.Optional(Type.Optional(Type.String())),
});

export const StakeholderEngagementsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type StakeholderEngagements = Static<typeof StakeholderEngagementsResultSchema>;
export type StakeholderEngagementsData = Static<typeof StakeholderEngagementsDataSchema>;
export type StakeholderEngagementsPatch = Static<typeof StakeholderEngagementsPatchSchema>;
export type StakeholderEngagementsQuery = Static<typeof StakeholderEngagementsQuerySchema>;

// --- Service ---

export class StakeholderEngagementsService extends MongoDBService<StakeholderEngagements, StakeholderEngagementsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'stakeholderEngagements'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
