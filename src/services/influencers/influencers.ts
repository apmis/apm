import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';

// --- Schemas ---

export const InfluencersResultSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  name: Type.String(),
  phone: Type.Optional(Type.String()),
  role: Type.Union([Type.Literal('traditional'), Type.Literal('religious'), Type.Literal('political'), Type.Literal('community'), Type.Literal('youth'), Type.Literal('women'), Type.Literal('other')]),
  influenceLevel: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high')]),
  alignment: Type.Optional(Type.Union([Type.Literal('apm'), Type.Literal('apc'), Type.Literal('pdp'), Type.Literal('other'), Type.Literal('neutral')])),
  notes: Type.Optional(Type.String()),
  addedBy: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const InfluencersDataSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  name: Type.String(),
  phone: Type.Optional(Type.String()),
  role: Type.Union([Type.Literal('traditional'), Type.Literal('religious'), Type.Literal('political'), Type.Literal('community'), Type.Literal('youth'), Type.Literal('women'), Type.Literal('other')]),
  influenceLevel: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high')]),
  alignment: Type.Optional(Type.Union([Type.Literal('apm'), Type.Literal('apc'), Type.Literal('pdp'), Type.Literal('other'), Type.Literal('neutral')])),
  notes: Type.Optional(Type.String()),
  addedBy: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const InfluencersPatchSchema = Type.Object({
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  name: Type.Optional(Type.String()),
  phone: Type.Optional(Type.String()),
  role: Type.Optional(Type.Union([Type.Literal('traditional'), Type.Literal('religious'), Type.Literal('political'), Type.Literal('community'), Type.Literal('youth'), Type.Literal('women'), Type.Literal('other')])),
  influenceLevel: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high')])),
  alignment: Type.Optional(Type.Union([Type.Literal('apm'), Type.Literal('apc'), Type.Literal('pdp'), Type.Literal('other'), Type.Literal('neutral')])),
  notes: Type.Optional(Type.Optional(Type.String())),
  addedBy: Type.Optional(Type.Optional(Type.String())),
}, { additionalProperties: false });

export const InfluencersQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: true });

export type Influencers = Static<typeof InfluencersResultSchema>;
export type InfluencersData = Static<typeof InfluencersDataSchema>;
export type InfluencersPatch = Static<typeof InfluencersPatchSchema>;
export type InfluencersQuery = Static<typeof InfluencersQuerySchema>;

// --- Service ---

export class InfluencersService extends MongoDBService<Influencers, InfluencersData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('influencers')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
