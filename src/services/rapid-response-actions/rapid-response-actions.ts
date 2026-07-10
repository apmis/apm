import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const RapidResponseActionsResultSchema = Type.Object({
  issueId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  actionType: Type.Union([Type.Literal('investigation'), Type.Literal('drafting'), Type.Literal('approval'), Type.Literal('publication'), Type.Literal('fieldIntervention')]),
  content: Type.String(),
  publishedAt: Type.Optional(Type.String({ format: 'date-time' })),
  publishedBy: Type.Optional(Type.String()),
  platform: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const RapidResponseActionsDataSchema = Type.Object({
  issueId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  actionType: Type.Union([Type.Literal('investigation'), Type.Literal('drafting'), Type.Literal('approval'), Type.Literal('publication'), Type.Literal('fieldIntervention')]),
  content: Type.String(),
  publishedAt: Type.Optional(Type.String({ format: 'date-time' })),
  publishedBy: Type.Optional(Type.String()),
  platform: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const RapidResponseActionsPatchSchema = Type.Object({
  issueId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  actionType: Type.Optional(Type.Union([Type.Literal('investigation'), Type.Literal('drafting'), Type.Literal('approval'), Type.Literal('publication'), Type.Literal('fieldIntervention')])),
  content: Type.Optional(Type.String()),
  publishedAt: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
  publishedBy: Type.Optional(Type.Optional(Type.String())),
  platform: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const RapidResponseActionsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type RapidResponseActions = Static<typeof RapidResponseActionsResultSchema>;
export type RapidResponseActionsData = Static<typeof RapidResponseActionsDataSchema>;
export type RapidResponseActionsPatch = Static<typeof RapidResponseActionsPatchSchema>;
export type RapidResponseActionsQuery = Static<typeof RapidResponseActionsQuerySchema>;

// --- Service ---

export class RapidResponseActionsService extends MongoDBService<RapidResponseActions, RapidResponseActionsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('rapidResponseActions')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
