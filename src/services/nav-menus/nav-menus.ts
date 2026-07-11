import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';

// --- Schemas ---

export const NavMenusResultSchema = Type.Object({
  key: Type.String(),
  label: Type.String(),
  href: Type.Optional(Type.String()),
  icon: Type.Optional(Type.String()),
  section: Type.String(),
  parentKey: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  requiredPermissions: Type.Array(Type.String()),
  displayOrder: Type.Number(),
  isGroup: Type.Boolean(),
  status: Type.Union([Type.Literal('active'), Type.Literal('inactive')]),
  openInNewTab: Type.Optional(Type.Boolean()),
}, { additionalProperties: false });

export const NavMenusDataSchema = Type.Object({
  key: Type.String(),
  label: Type.String(),
  href: Type.Optional(Type.String()),
  icon: Type.Optional(Type.String()),
  section: Type.String(),
  parentKey: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  requiredPermissions: Type.Array(Type.String()),
  displayOrder: Type.Number(),
  isGroup: Type.Boolean(),
  status: Type.Union([Type.Literal('active'), Type.Literal('inactive')]),
  openInNewTab: Type.Optional(Type.Boolean()),
}, { additionalProperties: false });

export const NavMenusPatchSchema = Type.Object({
  key: Type.Optional(Type.String()),
  label: Type.Optional(Type.String()),
  href: Type.Optional(Type.String()),
  icon: Type.Optional(Type.String()),
  section: Type.Optional(Type.String()),
  parentKey: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  requiredPermissions: Type.Optional(Type.Array(Type.String())),
  displayOrder: Type.Optional(Type.Number()),
  isGroup: Type.Optional(Type.Boolean()),
  status: Type.Optional(Type.Union([Type.Literal('active'), Type.Literal('inactive')])),
  openInNewTab: Type.Optional(Type.Boolean()),
}, { additionalProperties: false });

export const NavMenusQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type NavMenus = Static<typeof NavMenusResultSchema>;
export type NavMenusData = Static<typeof NavMenusDataSchema>;
export type NavMenusPatch = Static<typeof NavMenusPatchSchema>;
export type NavMenusQuery = Static<typeof NavMenusQuerySchema>;

// --- Service ---

export class NavMenusService extends MongoDBService<NavMenus, NavMenusData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('navMenus')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
