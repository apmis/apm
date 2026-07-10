import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ContentItemsResultSchema = Type.Object({
  title: Type.String(),
  contentType: Type.String(),
  body: Type.Optional(Type.String()),
  assetUrl: Type.Optional(Type.String()),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  targetAudience: Type.Optional(Type.String()),
  language: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
  status: Type.Union([Type.Literal('draft'), Type.Literal('pendingApproval'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('published'), Type.Literal('archived')]),
}, { additionalProperties: false });

export const ContentItemsDataSchema = Type.Object({
  title: Type.String(),
  contentType: Type.String(),
  body: Type.Optional(Type.String()),
  assetUrl: Type.Optional(Type.String()),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  targetAudience: Type.Optional(Type.String()),
  language: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
  status: Type.Union([Type.Literal('draft'), Type.Literal('pendingApproval'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('published'), Type.Literal('archived')]),
}, { additionalProperties: false });

export const ContentItemsPatchSchema = Type.Object({
  title: Type.Optional(Type.String()),
  contentType: Type.Optional(Type.String()),
  body: Type.Optional(Type.Optional(Type.String())),
  assetUrl: Type.Optional(Type.Optional(Type.String())),
  lgaId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  targetAudience: Type.Optional(Type.Optional(Type.String())),
  language: Type.Optional(Type.Optional(Type.String())),
  tags: Type.Optional(Type.Optional(Type.Array(Type.String()))),
  status: Type.Optional(Type.Union([Type.Literal('draft'), Type.Literal('pendingApproval'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('published'), Type.Literal('archived')])),
}, { additionalProperties: false });

export const ContentItemsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type ContentItems = Static<typeof ContentItemsResultSchema>;
export type ContentItemsData = Static<typeof ContentItemsDataSchema>;
export type ContentItemsPatch = Static<typeof ContentItemsPatchSchema>;
export type ContentItemsQuery = Static<typeof ContentItemsQuerySchema>;

// --- Service ---

export class ContentItemsService extends MongoDBService<ContentItems, ContentItemsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('contentItems')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
