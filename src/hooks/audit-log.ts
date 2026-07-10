import type { HookContext } from '@feathersjs/feathers';

const MUTATION_METHODS = new Set(['create', 'patch', 'remove']);

export function writeAuditLog() {
  return async (context: HookContext) => {
    const { app, method, path, id, params, error } = context;

    if (!params.provider) return context;
    if (!error && !MUTATION_METHODS.has(method)) return context;

    try {
      const auditService = app.service('audit-logs');
      if (!auditService) return context;

      const user = params.user as { _id?: string } | undefined;
      const beforeHash = (context.params as Record<string, unknown>).beforeHash as string | undefined;

      await auditService.create({
        actorId: user?._id || undefined,
        actorType: user ? 'user' : 'system',
        action: `${method}.${error ? 'error' : 'success'}`,
        servicePath: path,
        method,
        recordId: id?.toString(),
        success: !error,
        errorCode: error?.code ? String(error.code) : undefined,
        occurredAt: new Date().toISOString(),
        metadata: (params as Record<string, unknown>).correlationId
          ? { correlationId: (params as Record<string, unknown>).correlationId }
          : undefined,
        beforeHash: beforeHash || undefined,
      });
    } catch {
      // Audit log failures should never break the request
    }

    return context;
  };
}
