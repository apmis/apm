import type { HookContext } from '@feathersjs/feathers';
import type { TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export function validateQuery(schema: TSchema) {
  return async (context: HookContext) => {
    const query = context.params.query as Record<string, unknown> | undefined;
    if (!query) return context;
    const converted = Value.Convert(schema, query);
    const result = Value.Decode(schema, converted);
    context.params.query = Object.assign({}, query, result);
    return context;
  };
}

export function validateData(schema: TSchema) {
  return async (context: HookContext) => {
    const data = context.data as Record<string, unknown> | undefined;
    if (!data) return context;
    if (context.params?.route?.__method) return context;
    const converted = Value.Convert(schema, data);
    context.data = Value.Decode(schema, converted);
    return context;
  };
}
