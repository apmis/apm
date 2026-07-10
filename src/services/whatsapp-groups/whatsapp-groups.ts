import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const WhatsappGroupsResultSchema = Type.Object({
  level: Type.Union([Type.Literal('state'), Type.Literal('senatorial'), Type.Literal('lga'), Type.Literal('ward')]),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  groupLink: Type.Optional(Type.String()),
  adminName: Type.Optional(Type.String()),
  adminPhone: Type.Optional(Type.String()),
  memberCount: Type.Optional(Type.Integer()),
}, { additionalProperties: false });

export const WhatsappGroupsDataSchema = Type.Object({
  level: Type.Union([Type.Literal('state'), Type.Literal('senatorial'), Type.Literal('lga'), Type.Literal('ward')]),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  groupLink: Type.Optional(Type.String()),
  adminName: Type.Optional(Type.String()),
  adminPhone: Type.Optional(Type.String()),
  memberCount: Type.Optional(Type.Integer()),
}, { additionalProperties: false });

export const WhatsappGroupsPatchSchema = Type.Object({
  level: Type.Optional(Type.Union([Type.Literal('state'), Type.Literal('senatorial'), Type.Literal('lga'), Type.Literal('ward')])),
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  groupLink: Type.Optional(Type.Optional(Type.String())),
  adminName: Type.Optional(Type.Optional(Type.String())),
  adminPhone: Type.Optional(Type.Optional(Type.String())),
  memberCount: Type.Optional(Type.Optional(Type.Integer())),
}, { additionalProperties: false });

export const WhatsappGroupsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type WhatsappGroups = Static<typeof WhatsappGroupsResultSchema>;
export type WhatsappGroupsData = Static<typeof WhatsappGroupsDataSchema>;
export type WhatsappGroupsPatch = Static<typeof WhatsappGroupsPatchSchema>;
export type WhatsappGroupsQuery = Static<typeof WhatsappGroupsQuerySchema>;

// --- Service ---

export class WhatsappGroupsService extends MongoDBService<WhatsappGroups, WhatsappGroupsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('whatsappGroups')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
