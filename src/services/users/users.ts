import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
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

export type Users = Static<typeof UsersResultSchema>;
export type UsersData = Static<typeof UsersDataSchema>;
export type UsersPatch = Static<typeof UsersPatchSchema>;
export type UsersQuery = Static<typeof UsersQuerySchema>;

// --- Service ---

export class UsersService extends MongoDBService<Users, UsersData> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: getCollection(app, 'users'),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
