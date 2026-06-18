import type { HookContext } from '@feathersjs/feathers';

const SENSITIVE_FIELDS = [
  'password',
  'loginPinHash',
  'refreshToken',
  'pushToken',
  'securityNotes',
  'ipAddress',
  'phoneNumber',
];

export function protectExternal(fields?: string[]) {
  const protectedFields = fields || SENSITIVE_FIELDS;

  return async (context: HookContext) => {
    if (!context.params.provider) return context;

    const removeSensitive = (data: Record<string, unknown>) => {
      for (const field of protectedFields) {
        delete data[field];
      }
    };

    if (context.result) {
      if (Array.isArray(context.result)) {
        context.result.forEach((item: Record<string, unknown>) => removeSensitive(item));
      } else if (context.result.data && Array.isArray(context.result.data)) {
        context.result.data.forEach((item: Record<string, unknown>) => removeSensitive(item));
      } else {
        removeSensitive(context.result as Record<string, unknown>);
      }
    }

    return context;
  };
}
