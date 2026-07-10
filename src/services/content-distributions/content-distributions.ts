import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ContentDistributionsResultSchema = Type.Object({
  contentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  channel: Type.String(),
  recipientCount: Type.Optional(Type.Integer()),
  acknowledgedCount: Type.Optional(Type.Integer()),
  distributedAt: Type.String({ format: 'date-time' }),
}, { additionalProperties: false });

export const ContentDistributionsDataSchema = Type.Object({
  contentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  channel: Type.String(),
  recipientCount: Type.Optional(Type.Integer()),
  acknowledgedCount: Type.Optional(Type.Integer()),
  distributedAt: Type.String({ format: 'date-time' }),
}, { additionalProperties: false });

export const ContentDistributionsPatchSchema = Type.Object({
  contentId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  channel: Type.Optional(Type.String()),
  recipientCount: Type.Optional(Type.Optional(Type.Integer())),
  acknowledgedCount: Type.Optional(Type.Optional(Type.Integer())),
  distributedAt: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const ContentDistributionsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type ContentDistributions = Static<typeof ContentDistributionsResultSchema>;
export type ContentDistributionsData = Static<typeof ContentDistributionsDataSchema>;
export type ContentDistributionsPatch = Static<typeof ContentDistributionsPatchSchema>;
export type ContentDistributionsQuery = Static<typeof ContentDistributionsQuerySchema>;

// --- Service ---

export class ContentDistributionsService extends MongoDBService<ContentDistributions, ContentDistributionsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('contentDistributions')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
