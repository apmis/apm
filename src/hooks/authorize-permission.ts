import { Forbidden } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';

/**
 * Hook factory that gates access on one or more permission codes.
 *
 * A user is granted access if their `permissions[]` contains:
 * - the wildcard `"*"` (super-admin), OR
 * - any one of the `requiredPermissions`.
 */
export function authorizePermission(...requiredPermissions: string[]) {
  return async (context: HookContext) => {
    if (!context.params.provider) return context;

    const { user } = context.params;
    if (!user) throw new Forbidden('Not authenticated');

    const userPermissions = (user as Record<string, unknown>).permissions as string[] | undefined;
    if (!userPermissions) throw new Forbidden('No permissions assigned');

    // Wildcard grants unconditional access
    if (userPermissions.includes('*')) return context;

    const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));
    if (!hasPermission) throw new Forbidden('Insufficient permissions');

    return context;
  };
}
