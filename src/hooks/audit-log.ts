import type { HookContext } from '@feathersjs/feathers';

export function writeAuditLog() {
  return async (context: HookContext) => {
    const { app, method, path, id, params, error } = context;

    if (!params.provider) return context;

    try {
      const auditService = app.service('audit-logs');
      if (!auditService) return context;

      const user = params.user as { _id?: string } | undefined;
      const beforeHash = (context.params as Record<string, unknown>).beforeHash as string | undefined;

      await auditService.create({
        actorId: user?._id || null,
        actorType: user ? 'user' : 'system',
        action: `${method}.${error ? 'error' : 'success'}`,
        servicePath: path,
        method,
        recordId: id?.toString(),
        success: !error,
        errorCode: error?.code || null,
        occurredAt: new Date(),
        metadata: {
          correlationId: (params as Record<string, unknown>).correlationId || null,
        },
        beforeHash: beforeHash || null,
      });
    } catch {
      // Audit log failures should never break the request
    }

    return context;
  };
}
