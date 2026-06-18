import type { HookContext } from '@feathersjs/feathers';

export function idempotency(idField = 'clientSubmissionId') {
  return async (context: HookContext) => {
    if (context.method !== 'create') return context;

    const data = context.data as Record<string, unknown> | undefined;
    if (!data) return context;
    const submissionId = data[idField] as string | undefined;
    if (!submissionId) return context;

    const service = context.service;
    const existing = await service.find({
      query: { [idField]: submissionId, $limit: 1 },
      paginate: false,
    });

    if (existing && (Array.isArray(existing) ? existing.length > 0 : true)) {
      const record = Array.isArray(existing) ? existing[0] : existing;
      context.result = record;
      context.skipHooks = true;
    }

    return context;
  };
}
