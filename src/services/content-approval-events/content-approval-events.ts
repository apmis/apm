import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ContentApprovalEventsResultSchema = Type.Object({
  contentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  action: Type.Union([Type.Literal('submitted'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('withdrawn'), Type.Literal('expired')]),
  reviewedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  reason: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const ContentApprovalEventsDataSchema = Type.Object({
  contentId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  action: Type.Union([Type.Literal('submitted'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('withdrawn'), Type.Literal('expired')]),
  reviewedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  reason: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const ContentApprovalEventsPatchSchema = Type.Object({
  contentId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  action: Type.Optional(Type.Union([Type.Literal('submitted'), Type.Literal('approved'), Type.Literal('rejected'), Type.Literal('withdrawn'), Type.Literal('expired')])),
  reviewedBy: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  reason: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const ContentApprovalEventsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type ContentApprovalEvents = Static<typeof ContentApprovalEventsResultSchema>;
export type ContentApprovalEventsData = Static<typeof ContentApprovalEventsDataSchema>;
export type ContentApprovalEventsPatch = Static<typeof ContentApprovalEventsPatchSchema>;
export type ContentApprovalEventsQuery = Static<typeof ContentApprovalEventsQuerySchema>;

// --- Service ---

export class ContentApprovalEventsService extends MongoDBService<ContentApprovalEvents, ContentApprovalEventsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('contentApprovalEvents')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
