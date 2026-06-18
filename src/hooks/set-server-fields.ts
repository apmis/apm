import type { HookContext } from '@feathersjs/feathers';
import { ObjectId } from 'mongodb';

export function setServerFields() {
  return async (context: HookContext) => {
    const { user } = context.params;
    const userId = user?._id ? new ObjectId(user._id as string) : undefined;

    if (context.method === 'create' && context.data) {
      const data = context.data as Record<string, unknown>;
      data.createdAt = new Date();
      data.updatedAt = new Date();
      if (userId) data.createdBy = userId;
      data.revision = 1;
    }

    if (context.method === 'patch') {
      const data = context.data as Record<string, unknown>;
      data.updatedAt = new Date();
      if (userId) data.updatedBy = userId;
    }

    return context;
  };
}
