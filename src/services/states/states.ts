import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';

export const StatesResultSchema = Type.Object({
  name: Type.String(),
  code: Type.String(),
  displayOrder: Type.Optional(Type.Integer()),
}, { additionalProperties: false });

export const StatesDataSchema = Type.Object({
  name: Type.String(),
  code: Type.String(),
});

export const StatesPatchSchema = Type.Object({
  name: Type.Optional(Type.String()),
  code: Type.Optional(Type.String()),
  displayOrder: Type.Optional(Type.Optional(Type.Integer())),
});

export const StatesQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type States = Static<typeof StatesResultSchema>;
export type StatesData = Static<typeof StatesDataSchema>;
export type StatesPatch = Static<typeof StatesPatchSchema>;
export type StatesQuery = Static<typeof StatesQuerySchema>;

export class StatesService extends MongoDBService<States, StatesData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'states'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
