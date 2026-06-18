import { authenticate as feathersAuthenticate } from '@feathersjs/authentication';
import type { HookContext } from '@feathersjs/feathers';

export function authenticate(strategies: string | string[]) {
  const s = typeof strategies === 'string' ? [strategies] : strategies;
  const hook = feathersAuthenticate(s[0], ...s.slice(1));
  return async (context: HookContext) => {
    if (context.params.provider) {
      return hook(context);
    }
    return context;
  };
}
