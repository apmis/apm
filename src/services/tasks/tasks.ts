import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const TasksResultSchema = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
  sourceType: Type.Optional(Type.String()),
  sourceId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  assignedTo: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  dueAt: Type.Optional(Type.String({ format: 'date-time' })),
  priority: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
  status: Type.Union([Type.Literal('open'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('cancelled')]),
  geography: Type.Optional(GeographySnapshotSchema),
}, { additionalProperties: false });

export const TasksDataSchema = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
  sourceType: Type.Optional(Type.String()),
  sourceId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  assignedTo: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  dueAt: Type.Optional(Type.String({ format: 'date-time' })),
  priority: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
  status: Type.Union([Type.Literal('open'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('cancelled')]),
  geography: Type.Optional(GeographySnapshotSchema),
}, { additionalProperties: false });

export const TasksPatchSchema = Type.Object({
  title: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  sourceType: Type.Optional(Type.Optional(Type.String())),
  sourceId: Type.Optional(Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
  assignedTo: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  dueAt: Type.Optional(Type.Optional(Type.String({ format: 'date-time' }))),
  priority: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')])),
  status: Type.Optional(Type.Union([Type.Literal('open'), Type.Literal('inProgress'), Type.Literal('completed'), Type.Literal('cancelled')])),
  geography: Type.Optional(Type.Optional(GeographySnapshotSchema)),
}, { additionalProperties: false });

export const TasksQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Tasks = Static<typeof TasksResultSchema>;
export type TasksData = Static<typeof TasksDataSchema>;
export type TasksPatch = Static<typeof TasksPatchSchema>;
export type TasksQuery = Static<typeof TasksQuerySchema>;

// --- Service ---

export class TasksService extends MongoDBService<Tasks, TasksData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('tasks')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
