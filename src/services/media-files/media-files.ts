import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const MediaFilesResultSchema = Type.Object({
  objectKey: Type.String(),
  originalFileName: Type.String(),
  mimeType: Type.String(),
  sizeBytes: Type.Integer(),
  checksumSha256: Type.String(),
  mediaType: Type.Union([Type.Literal('image'), Type.Literal('video'), Type.Literal('audio'), Type.Literal('document')]),
  purpose: Type.Union([Type.Literal('profile'), Type.Literal('canvassing'), Type.Literal('content'), Type.Literal('rapidResponse'), Type.Literal('event'), Type.Literal('incident'), Type.Literal('resultSheet'), Type.Literal('report'), Type.Literal('other')]),
  uploadedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  accessLevel: Type.Union([Type.Literal('publicCampaign'), Type.Literal('internal'), Type.Literal('restricted'), Type.Literal('highlyRestricted')]),
  status: Type.Union([Type.Literal('uploading'), Type.Literal('ready'), Type.Literal('quarantined'), Type.Literal('deleted')]),
}, { additionalProperties: false });

export const MediaFilesDataSchema = Type.Object({
  objectKey: Type.String(),
  originalFileName: Type.String(),
  mimeType: Type.String(),
  sizeBytes: Type.Integer(),
  checksumSha256: Type.String(),
  mediaType: Type.Union([Type.Literal('image'), Type.Literal('video'), Type.Literal('audio'), Type.Literal('document')]),
  purpose: Type.Union([Type.Literal('profile'), Type.Literal('canvassing'), Type.Literal('content'), Type.Literal('rapidResponse'), Type.Literal('event'), Type.Literal('incident'), Type.Literal('resultSheet'), Type.Literal('report'), Type.Literal('other')]),
  uploadedBy: Type.String({ pattern: '^[a-fA-F0-9]{24}$' }),
  accessLevel: Type.Union([Type.Literal('publicCampaign'), Type.Literal('internal'), Type.Literal('restricted'), Type.Literal('highlyRestricted')]),
  status: Type.Union([Type.Literal('uploading'), Type.Literal('ready'), Type.Literal('quarantined'), Type.Literal('deleted')]),
}, { additionalProperties: false });

export const MediaFilesPatchSchema = Type.Object({
  objectKey: Type.Optional(Type.String()),
  originalFileName: Type.Optional(Type.String()),
  mimeType: Type.Optional(Type.String()),
  sizeBytes: Type.Optional(Type.Integer()),
  checksumSha256: Type.Optional(Type.String()),
  mediaType: Type.Optional(Type.Union([Type.Literal('image'), Type.Literal('video'), Type.Literal('audio'), Type.Literal('document')])),
  purpose: Type.Optional(Type.Union([Type.Literal('profile'), Type.Literal('canvassing'), Type.Literal('content'), Type.Literal('rapidResponse'), Type.Literal('event'), Type.Literal('incident'), Type.Literal('resultSheet'), Type.Literal('report'), Type.Literal('other')])),
  uploadedBy: Type.Optional(Type.String({ pattern: '^[a-fA-F0-9]{24}$' })),
  accessLevel: Type.Optional(Type.Union([Type.Literal('publicCampaign'), Type.Literal('internal'), Type.Literal('restricted'), Type.Literal('highlyRestricted')])),
  status: Type.Optional(Type.Union([Type.Literal('uploading'), Type.Literal('ready'), Type.Literal('quarantined'), Type.Literal('deleted')])),
}, { additionalProperties: false });

export const MediaFilesQuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type MediaFiles = Static<typeof MediaFilesResultSchema>;
export type MediaFilesData = Static<typeof MediaFilesDataSchema>;
export type MediaFilesPatch = Static<typeof MediaFilesPatchSchema>;
export type MediaFilesQuery = Static<typeof MediaFilesQuerySchema>;

// --- Service ---

export class MediaFilesService extends MongoDBService<MediaFiles, MediaFilesData> {

}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('mediaFiles')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
