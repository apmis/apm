import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const VoterContactsResultSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  contactDate: Type.String({ format: 'date-time' }),
  voterName: Type.Optional(Type.String()),
  voterPhone: Type.Optional(Type.String()),
  supportLevel: Type.Union([Type.Literal('STRONG_SUPPORT'), Type.Literal('LEANING_SUPPORT'), Type.Literal('UNDECIDED'), Type.Literal('LEANING_OPPOSITION'), Type.Literal('STRONG_OPPOSITION')]),
  concerns: Type.Optional(Type.String()),
  issues: Type.Optional(Type.String()),
  reportedById: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  verified: Type.Boolean(),
  verifiedById: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const VoterContactsDataSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  contactDate: Type.String({ format: 'date-time' }),
  voterName: Type.Optional(Type.String()),
  voterPhone: Type.Optional(Type.String()),
  supportLevel: Type.Union([Type.Literal('STRONG_SUPPORT'), Type.Literal('LEANING_SUPPORT'), Type.Literal('UNDECIDED'), Type.Literal('LEANING_OPPOSITION'), Type.Literal('STRONG_OPPOSITION')]),
  concerns: Type.Optional(Type.String()),
  issues: Type.Optional(Type.String()),
  reportedById: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  verified: Type.Boolean(),
  verifiedById: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  notes: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const VoterContactsPatchSchema = Type.Object({
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  contactDate: Type.Optional(Type.String({ format: 'date-time' })),
  voterName: Type.Optional(Type.Optional(Type.String())),
  voterPhone: Type.Optional(Type.Optional(Type.String())),
  supportLevel: Type.Optional(Type.Union([Type.Literal('STRONG_SUPPORT'), Type.Literal('LEANING_SUPPORT'), Type.Literal('UNDECIDED'), Type.Literal('LEANING_OPPOSITION'), Type.Literal('STRONG_OPPOSITION')])),
  concerns: Type.Optional(Type.Optional(Type.String())),
  issues: Type.Optional(Type.Optional(Type.String())),
  reportedById: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  verified: Type.Optional(Type.Boolean()),
  verifiedById: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  notes: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const VoterContactsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type VoterContacts = Static<typeof VoterContactsResultSchema>;
export type VoterContactsData = Static<typeof VoterContactsDataSchema>;
export type VoterContactsPatch = Static<typeof VoterContactsPatchSchema>;
export type VoterContactsQuery = Static<typeof VoterContactsQuerySchema>;

// --- Service ---

export class VoterContactsService extends MongoDBService<VoterContacts, VoterContactsData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('voterContacts')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
