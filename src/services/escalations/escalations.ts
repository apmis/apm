import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const EscalationsResultSchema = Type.Object({
  sourceType: Type.Union([Type.Literal('incident'), Type.Literal('rapidResponse'), Type.Literal('result'), Type.Literal('agent'), Type.Literal('event'), Type.Literal('other')]),
  sourceId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  escalationType: Type.Union([Type.Literal('legal'), Type.Literal('security'), Type.Literal('field'), Type.Literal('technical'), Type.Literal('leadership')]),
  priority: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
  status: Type.Union([Type.Literal('open'), Type.Literal('acknowledged'), Type.Literal('inProgress'), Type.Literal('resolved'), Type.Literal('closed')]),
  assignedTeamCode: Type.Optional(Type.String()),
  assignedUserIds: Type.Optional(Type.Array(Type.String({ pattern: '^[a-fA-F0-9]{24}$' }))),
}, { additionalProperties: false });

export const EscalationsDataSchema = Type.Object({
  sourceType: Type.Union([Type.Literal('incident'), Type.Literal('rapidResponse'), Type.Literal('result'), Type.Literal('agent'), Type.Literal('event'), Type.Literal('other')]),
  sourceId: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  escalationType: Type.Union([Type.Literal('legal'), Type.Literal('security'), Type.Literal('field'), Type.Literal('technical'), Type.Literal('leadership')]),
  priority: Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')]),
  status: Type.Union([Type.Literal('open'), Type.Literal('acknowledged'), Type.Literal('inProgress'), Type.Literal('resolved'), Type.Literal('closed')]),
});

export const EscalationsPatchSchema = Type.Object({
  sourceType: Type.Optional(Type.Union([Type.Literal('incident'), Type.Literal('rapidResponse'), Type.Literal('result'), Type.Literal('agent'), Type.Literal('event'), Type.Literal('other')])),
  sourceId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  escalationType: Type.Optional(Type.Union([Type.Literal('legal'), Type.Literal('security'), Type.Literal('field'), Type.Literal('technical'), Type.Literal('leadership')])),
  priority: Type.Optional(Type.Union([Type.Literal('low'), Type.Literal('medium'), Type.Literal('high'), Type.Literal('critical')])),
  status: Type.Optional(Type.Union([Type.Literal('open'), Type.Literal('acknowledged'), Type.Literal('inProgress'), Type.Literal('resolved'), Type.Literal('closed')])),
  assignedTeamCode: Type.Optional(Type.Optional(Type.String())),
  assignedUserIds: Type.Optional(Type.Optional(Type.Array(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })))),
});

export const EscalationsQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Escalations = Static<typeof EscalationsResultSchema>;
export type EscalationsData = Static<typeof EscalationsDataSchema>;
export type EscalationsPatch = Static<typeof EscalationsPatchSchema>;
export type EscalationsQuery = Static<typeof EscalationsQuerySchema>;

// --- Service ---

export class EscalationsService extends MongoDBService<Escalations, EscalationsData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'escalations'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
