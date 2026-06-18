import { Forbidden } from '@feathersjs/errors';
import type { HookContext } from '@feathersjs/feathers';

export function applyGeographyScope() {
  return async (context: HookContext) => {
    const { user } = context.params;
    if (!user) return context;

    const geographyAssignments = (user as Record<string, unknown>).geographyAssignments as
      | Array<{
          scopeLevel: string;
          lgaId?: string;
          wardId?: string;
          pollingUnitId?: string;
          canViewChildren?: boolean;
        }>
      | undefined;

    if (!geographyAssignments || geographyAssignments.length === 0) {
      return context;
    }

    const query = context.params.query || {};
    const geographyFilter: Record<string, unknown>[] = [];

    for (const assignment of geographyAssignments) {
      if (assignment.scopeLevel === 'state') {
        return context;
      }
      const filter: Record<string, unknown> = {};
      if (assignment.lgaId) filter['geography.lgaId'] = assignment.lgaId;
      if (assignment.wardId && !assignment.canViewChildren) {
        filter['geography.wardId'] = assignment.wardId;
      }
      if (assignment.pollingUnitId && !assignment.canViewChildren) {
        filter['geography.pollingUnitId'] = assignment.pollingUnitId;
      }
      geographyFilter.push(filter);
    }

    if (geographyFilter.length > 0) {
      query.$or = geographyFilter;
      context.params.query = query;
    }

    if (context.method !== 'find' && context.method !== 'get') {
      const data = context.data || {};
      const geography = (data as Record<string, unknown>).geography as Record<string, unknown> | undefined;
      if (geography?.lgaId) {
        const canAccess = geographyAssignments.some(
          (a) => a.lgaId === geography.lgaId || a.scopeLevel === 'state',
        );
        if (!canAccess) throw new Forbidden('Cannot write to this geographic area');
      }
    }

    return context;
  };
}
