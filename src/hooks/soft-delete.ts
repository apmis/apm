import { NotFound } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';

export function softDeleteFilter() {
  return async (context: HookContext) => {
    if (context.method === 'find') {
      const query = context.params.query || {};
      query.deletedAt = null;
      context.params.query = query;
    }

    if (context.method === 'get') {
      const query = context.params.query || {};
      query.deletedAt = null;
      context.params.query = query;
    }

    if (context.method === 'remove') {
      const service = context.service as any;
      const model = await service.getModel(context.params).catch(() => undefined);
      if (!model) {
        throw new Error('Model not available on service for soft-delete');
      }
      const objectId = typeof service.getObjectId === 'function'
        ? service.getObjectId(context.id)
        : context.id;
      await model.updateOne(
        { _id: objectId },
        { $set: { deletedAt: new Date() } },
      );
      const doc = await model.findOne({ _id: objectId });
      context.result = doc || { _id: context.id, deletedAt: new Date() };
      context.http = { status: 200 };
    }

    return context;
  };
}
