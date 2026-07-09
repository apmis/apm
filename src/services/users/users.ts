import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application, Params } from '@feathersjs/feathers';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../mongodb.js';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const UsersResultSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  permissions: Type.Optional(Type.Array(Type.String())),
  phoneNumber: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  primaryRoleCode: Type.Optional(Type.String()),
  accountStatus: Type.Union([Type.Literal('invited'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('disabled'), Type.Literal('locked')]),
  isPhoneVerified: Type.Boolean(),
  isEmailVerified: Type.Boolean(),
  totpSecret: Type.Optional(Type.String()),
  totpEnabled: Type.Optional(Type.Boolean()),
  twoFactorMethod: Type.Optional(Type.Union([Type.Literal('totp'), Type.Literal('email'), Type.Literal('phone'), Type.Literal('none')])),
  emailOtpCode: Type.Optional(Type.String()),
  emailOtpExpiry: Type.Optional(Type.String()),
  phoneOtpCode: Type.Optional(Type.String()),
  phoneOtpExpiry: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const UsersDataSchema = Type.Object({
  name: Type.String(),
  email: Type.String(),
  password: Type.String(),
  permissions: Type.Optional(Type.Array(Type.String())),
  phoneNumber: Type.Optional(Type.String()),
  primaryRoleCode: Type.Optional(Type.String()),
  accountStatus: Type.Optional(Type.Union([Type.Literal('invited'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('disabled'), Type.Literal('locked')])),
  isPhoneVerified: Type.Optional(Type.Boolean()),
  isEmailVerified: Type.Optional(Type.Boolean()),
  totpSecret: Type.Optional(Type.String()),
  totpEnabled: Type.Optional(Type.Boolean()),
  twoFactorMethod: Type.Optional(Type.Union([Type.Literal('totp'), Type.Literal('email'), Type.Literal('phone'), Type.Literal('none')])),
  emailOtpCode: Type.Optional(Type.String()),
  emailOtpExpiry: Type.Optional(Type.String()),
  phoneOtpCode: Type.Optional(Type.String()),
  phoneOtpExpiry: Type.Optional(Type.String()),
});

export const UsersPatchSchema = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  permissions: Type.Optional(Type.Array(Type.String())),
  phoneNumber: Type.Optional(Type.String()),
  primaryRoleCode: Type.Optional(Type.String()),
  accountStatus: Type.Optional(Type.Union([Type.Literal('invited'), Type.Literal('active'), Type.Literal('suspended'), Type.Literal('disabled'), Type.Literal('locked')])),
  isPhoneVerified: Type.Optional(Type.Boolean()),
  isEmailVerified: Type.Optional(Type.Boolean()),
  totpSecret: Type.Optional(Type.String()),
  totpEnabled: Type.Optional(Type.Boolean()),
  twoFactorMethod: Type.Optional(Type.Union([Type.Literal('totp'), Type.Literal('email'), Type.Literal('phone'), Type.Literal('none')])),
  emailOtpCode: Type.Optional(Type.String()),
  emailOtpExpiry: Type.Optional(Type.String()),
  phoneOtpCode: Type.Optional(Type.String()),
  phoneOtpExpiry: Type.Optional(Type.String()),
});

export const UsersQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export const UserSetupPermissionsSchema = Type.Object({
  permissions: Type.Array(Type.String()),
  geographyAssignments: Type.Optional(Type.Array(Type.Object({
    scopeLevel: Type.Union([Type.Literal('state'), Type.Literal('senatorialDistrict'), Type.Literal('lga'), Type.Literal('ward'), Type.Literal('pollingUnit')]),
    senatorialDistrictId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
    lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
    wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
    pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
    canViewChildren: Type.Boolean(),
    effectiveFrom: Type.String(),
    effectiveTo: Type.Optional(Type.String()),
  }))),
});

export type Users = Static<typeof UsersResultSchema>;
export type UsersData = Static<typeof UsersDataSchema>;
export type UsersPatch = Static<typeof UsersPatchSchema>;
export type UsersQuery = Static<typeof UsersQuerySchema>;
export type UserSetupPermissions = Static<typeof UserSetupPermissionsSchema>;

// --- Service ---

export class UsersService extends MongoDBService<Users, UsersData> {
  app: Application;

  constructor(options: MongoDBAdapterOptions, app: Application) {
    super(options);
    this.app = app;
  }

  async create(data: any, params?: Params) {
    const method = params?.route?.__method;
    if (method) (params as any).__customMethod = true;
    if (method === 'setupPermissions') return this.setupPermissions(data, params);
    return super.create(data, params);
  }

  async setupPermissions(data: UserSetupPermissions, params?: Params) {
    const { id } = params?.route || {};
    if (!id) throw new Error('User ID is required');

    const collection = await (this as any).options.Model;
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) throw new Error('User not found');

    const now = new Date().toISOString();

    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          permissions: data.permissions,
          accountStatus: 'active',
          updatedAt: now,
        },
      },
    );

    if (data.geographyAssignments && data.geographyAssignments.length > 0) {
      const geoCol = await getCollection(this.app, 'geographyAssignments');
      for (const assignment of data.geographyAssignments) {
        await geoCol.insertOne({
          userId: id,
          scopeLevel: assignment.scopeLevel,
          senatorialDistrictId: assignment.senatorialDistrictId || null,
          lgaId: assignment.lgaId || null,
          wardId: assignment.wardId || null,
          pollingUnitId: assignment.pollingUnitId || null,
          canViewChildren: assignment.canViewChildren,
          effectiveFrom: assignment.effectiveFrom,
          effectiveTo: assignment.effectiveTo || null,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    return collection.findOne({ _id: user._id });
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions & { app: Application } => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'users'),
  id: '_id',
  disableObjectify: false,
  multi: false,
  app,
});
