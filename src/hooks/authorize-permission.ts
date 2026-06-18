import { Forbidden } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';

export function authorizePermission(...requiredPermissions: string[]) {
  return async (context: HookContext) => {
    if (!context.params.provider) return context;

    const { user } = context.params;
    if (!user) throw new Forbidden('Not authenticated');

    const userPermissions = (user as Record<string, unknown>).permissions as string[] | undefined;
    if (!userPermissions) throw new Forbidden('No permissions assigned');

    const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));
    if (!hasPermission) throw new Forbidden('Insufficient permissions');

    return context;
  };
}
