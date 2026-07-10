import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const UsersResultSchema = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  permissions: Type.Optional(Type.Array(Type.String())),
  primaryRoleCode: Type.Optional(Type.String()),
  accountStatus: Type.Optional(Type.Union([Type.Literal('invited'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('disabled'), Type.Literal('locked')])),
  isPhoneVerified: Type.Optional(Type.Boolean()),
  isEmailVerified: Type.Optional(Type.Boolean()),
}, { additionalProperties: false });

export const UsersDataSchema = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  phoneNumber: Type.Optional(Type.String()),
  permissions: Type.Optional(Type.Array(Type.String())),
  primaryRoleCode: Type.Optional(Type.String()),
  accountStatus: Type.Optional(Type.Union([Type.Literal('invited'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('disabled'), Type.Literal('locked')])),
  isPhoneVerified: Type.Optional(Type.Boolean()),
  isEmailVerified: Type.Optional(Type.Boolean()),
}, { additionalProperties: false });

export const UsersPatchSchema = Type.Object({
  name: Type.Optional(Type.Optional(Type.String())),
  email: Type.Optional(Type.Optional(Type.String())),
  password: Type.Optional(Type.Optional(Type.String())),
  phoneNumber: Type.Optional(Type.Optional(Type.String())),
  permissions: Type.Optional(Type.Optional(Type.Array(Type.String()))),
  primaryRoleCode: Type.Optional(Type.Optional(Type.String())),
  accountStatus: Type.Optional(Type.Optional(Type.Union([Type.Literal('invited'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('disabled'), Type.Literal('locked')]))),
  isPhoneVerified: Type.Optional(Type.Optional(Type.Boolean())),
  isEmailVerified: Type.Optional(Type.Optional(Type.Boolean())),
}, { additionalProperties: false });

export const UsersQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type Users = Static<typeof UsersResultSchema>;
export type UsersData = Static<typeof UsersDataSchema>;
export type UsersPatch = Static<typeof UsersPatchSchema>;
export type UsersQuery = Static<typeof UsersQuerySchema>;

// --- Service ---

export class UsersService extends MongoDBService<Users, UsersData> {
  async setupPermissions(id: string, data: any, params: any, context?: any) {
    const { permissions, geographyAssignments } = data;
    const patchData: Record<string, unknown> = {};
    if (permissions) patchData.permissions = permissions;
    patchData.accountStatus = 'active';
    await (this as any).patch(id, patchData, params);
    if (geographyAssignments?.length) {
      const gaService = params.app?.service('apm/geography-assignments');
      if (gaService) {
        for (const assignment of geographyAssignments) {
          await gaService.create({ userId: id, ...assignment }, params);
        }
      }
    }
    const result = await (this as any).get(id, params);
    return result;
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('users')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
