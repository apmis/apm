import { Type, type TSchema } from '@sinclair/typebox';

export const ObjectId = Type.String({ pattern: '^[a-fA-F0-9]{24}$' });

export const GeographySnapshotSchema = Type.Object({
  senatorialDistrictId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  lgaId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  wardId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  pollingUnitId: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  community: Type.Optional(Type.String()),
  venue: Type.Optional(Type.String()),
  location: Type.Optional(Type.Object({
    type: Type.Literal('Point'),
    coordinates: Type.Array(Type.Number(), { minItems: 2, maxItems: 2 }),
  })),
});

export const PartyResultSchema = Type.Object({
  partyCode: Type.String(),
  partyName: Type.String(),
  votes: Type.Integer({ minimum: 0 }),
});

export const ResultValidationSchema = Type.Object({
  isMathematicallyValid: Type.Boolean(),
  warnings: Type.Array(Type.String()),
  checksum: Type.Optional(Type.String()),
  duplicateScore: Type.Optional(Type.Number()),
});

export const VerificationSummarySchema = Type.Object({
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('verified'),
    Type.Literal('rejected'),
    Type.Literal('flagged'),
  ]),
  verifiedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  verifiedAt: Type.Optional(Type.String()),
  reason: Type.Optional(Type.String()),
});

export const NotificationDeliverySchema = Type.Object({
  queuedAt: Type.Optional(Type.String()),
  sentAt: Type.Optional(Type.String()),
  failedAt: Type.Optional(Type.String()),
  attempts: Type.Integer({ minimum: 0 }),
  lastError: Type.Optional(Type.String()),
});

export const ConsentRecordSchema = Type.Object({
  accepted: Type.Boolean(),
  acceptedAt: Type.Optional(Type.String()),
  version: Type.String(),
  source: Type.Union([
    Type.Literal('mobile'),
    Type.Literal('web'),
    Type.Literal('paper-import'),
    Type.Literal('event'),
  ]),
});

export type GeographySnapshot = typeof GeographySnapshotSchema.static;
export type PartyResult = typeof PartyResultSchema.static;
export type ResultValidation = typeof ResultValidationSchema.static;
export type VerificationSummary = typeof VerificationSummarySchema.static;
export type NotificationDelivery = typeof NotificationDeliverySchema.static;
export type ConsentRecord = typeof ConsentRecordSchema.static;
