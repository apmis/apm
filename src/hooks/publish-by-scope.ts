import type { HookContext } from '@feathersjs/feathers';
import type { Application } from '@feathersjs/feathers';

export function publishByScope() {
  return async (context: HookContext) => {
    return context;
  };
}
