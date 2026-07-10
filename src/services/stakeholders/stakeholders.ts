import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const StakeholdersResultSchema = Type.Object({
  fullName: Type.String(),
  phoneNumber: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  stakeholderType: Type.Union([Type.Literal('traditional'), Type.Literal('religious'), Type.Literal('political'), Type.Literal('community'), Type.Literal('youth'), Type.Literal('women'), Type.Literal('professional'), Type.Literal('market')]),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  affiliation: Type.Optional(Type.String()),
  influenceLevel: Type.Union([Type.Literal('high'), Type.Literal('medium'), Type.Literal('low')]),
  conversionStatus: Type.Union([Type.Literal('untouched'), Type.Literal('engaged'), Type.Literal('leaning'), Type.Literal('won'), Type.Literal('lost'), Type.Literal('hostile')]),
  consent: Type.Optional(ConsentRecordSchema),
}, { additionalProperties: false });

export const StakeholdersDataSchema = Type.Object({
  fullName: Type.String(),
  phoneNumber: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  stakeholderType: Type.Union([Type.Literal('traditional'), Type.Literal('religious'), Type.Literal('political'), Type.Literal('community'), Type.Literal('youth'), Type.Literal('women'), Type.Literal('professional'), Type.Literal('market')]),
  lgaId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  affiliation: Type.Optional(Type.String()),
  influenceLevel: Type.Union([Type.Literal('high'), Type.Literal('medium'), Type.Literal('low')]),
  conversionStatus: Type.Union([Type.Literal('untouched'), Type.Literal('engaged'), Type.Literal('leaning'), Type.Literal('won'), Type.Literal('lost'), Type.Literal('hostile')]),
  consent: Type.Optional(ConsentRecordSchema),
}, { additionalProperties: false });

export const StakeholdersPatchSchema = Type.Object({
  fullName: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.Optional(Type.String())),
  email: Type.Optional(Type.Optional(Type.String({ format: 'email' }))),
  stakeholderType: Type.Optional(Type.Union([Type.Literal('traditional'), Type.Literal('religious'), Type.Literal('political'), Type.Literal('community'), Type.Literal('youth'), Type.Literal('women'), Type.Literal('professional'), Type.Literal('market')])),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  affiliation: Type.Optional(Type.Optional(Type.String())),
  influenceLevel: Type.Optional(Type.Union([Type.Literal('high'), Type.Literal('medium'), Type.Literal('low')])),
  conversionStatus: Type.Optional(Type.Union([Type.Literal('untouched'), Type.Literal('engaged'), Type.Literal('leaning'), Type.Literal('won'), Type.Literal('lost'), Type.Literal('hostile')])),
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
