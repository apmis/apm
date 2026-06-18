import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const RapidResponseIssuesResultSchema = Type.Object({
  platform: Type.Union([Type.Literal('facebook'), Type.Literal('whatsapp'), Type.Literal('twitter'), Type.Literal('tiktok'), Type.Literal('instagram'), Type.Literal('radio'), Type.Literal('print'), Type.Literal('other')]),
  title: Type.String(),
  content: Type.Optional(Type.String()),
  mentionUrl: Type.Optional(Type.String()),
  sentiment: Type.Optional(Type.String()),
  reach: Type.Optional(Type.Integer()),
  isUrgent: Type.Boolean(),
  status: Type.Union([Type.Literal('new'), Type.Literal('investigating'), Type.Literal('responded'), Type.Literal('resolved'), Type.Literal('monitoring')]),
  geography: Type.Optional(GeographySnapshotSchema),
}, { additionalProperties: false });

export const RapidResponseIssuesDataSchema = Type.Object({
  platform: Type.Union([Type.Literal('facebook'), Type.Literal('whatsapp'), Type.Literal('twitter'), Type.Literal('tiktok'), Type.Literal('instagram'), Type.Literal('radio'), Type.Literal('print'), Type.Literal('other')]),
  title: Type.String(),
  isUrgent: Type.Boolean(),
  status: Type.Union([Type.Literal('new'), Type.Literal('investigating'), Type.Literal('responded'), Type.Literal('resolved'), Type.Literal('monitoring')]),
});

export const RapidResponseIssuesPatchSchema = Type.Object({
  platform: Type.Optional(Type.Union([Type.Literal('facebook'), Type.Literal('whatsapp'), Type.Literal('twitter'), Type.Literal('tiktok'), Type.Literal('instagram'), Type.Literal('radio'), Type.Literal('print'), Type.Literal('other')])),
  title: Type.Optional(Type.String()),
  content: Type.Optional(Type.Optional(Type.String())),
  mentionUrl: Type.Optional(Type.Optional(Type.String())),
  sentiment: Type.Optional(Type.Optional(Type.String())),
  reach: Type.Optional(Type.Optional(Type.Integer())),
  isUrgent: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Union([Type.Literal('new'), Type.Literal('investigating'), Type.Literal('responded'), Type.Literal('resolved'), Type.Literal('monitoring')])),
  geography: Type.Optional(Type.Optional(GeographySnapshotSchema)),
});

export const RapidResponseIssuesQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type RapidResponseIssues = Static<typeof RapidResponseIssuesResultSchema>;
export type RapidResponseIssuesData = Static<typeof RapidResponseIssuesDataSchema>;
export type RapidResponseIssuesPatch = Static<typeof RapidResponseIssuesPatchSchema>;
export type RapidResponseIssuesQuery = Static<typeof RapidResponseIssuesQuerySchema>;

// --- Service ---

export class RapidResponseIssuesService extends MongoDBService<RapidResponseIssues, RapidResponseIssuesData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'rapidResponseIssues'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
