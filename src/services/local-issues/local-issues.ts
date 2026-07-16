import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';

// --- Schemas ---

export const LocalIssuesResultSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  title: Type.String(),
  description: Type.String(),
  severity: Type.Union([Type.Literal('low'), Type.Literal('moderate'), Type.Literal('high')]),
  status: Type.Union([Type.Literal('noted'), Type.Literal('in_progress'), Type.Literal('resolved')]),
  reportedBy: Type.Optional(Type.String()),
  reportedAt: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const LocalIssuesDataSchema = Type.Object({
  pollingUnitId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  title: Type.String(),
  description: Type.String(),
  severity: Type.Union([Type.Literal('low'), Type.Literal('moderate'), Type.Literal('high')]),
  status: Type.Union([Type.Literal('noted'), Type.Literal('in_progress'), Type.Literal('resolved')]),
  reportedBy: Type.Optional(Type.String()),
  reportedAt: Type.Optional(Type.String({ format: 'date-time' })),
}, { additionalProperties: false });

export const LocalIssuesPatchSchema = Type.Object({
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  title: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  severity: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('moderate'), Type.Literal('high')])),
  status: Type.Optional(Type.Union([Type.Literal('noted'), Type.Literal('in_progress'), Type.Literal('resolved')])),
  reportedBy: Type.Optional(Type.Optional(Type.String())),
  reportedAt: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
}, { additionalProperties: false });

export const LocalIssuesQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
}, { additionalProperties: true });

export type LocalIssues = Static<typeof LocalIssuesResultSchema>;
export type LocalIssuesData = Static<typeof LocalIssuesDataSchema>;
export type LocalIssuesPatch = Static<typeof LocalIssuesPatchSchema>;
export type LocalIssuesQuery = Static<typeof LocalIssuesQuerySchema>;

// --- Service ---

export class LocalIssuesService extends MongoDBService<LocalIssues, LocalIssuesData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('localIssues')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
