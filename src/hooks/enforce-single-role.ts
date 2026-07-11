import type { HookContext } from '@feathersjs/feathers';

/**
 * Before creating a role-assignment, revoke any existing active assignment
 * for the same user so only one role is active at a time.
 */
export async function enforceSingleRole(context: HookContext): Promise<HookContext> {
  if (!context.params.provider) return context;

  const data = context.data as Record<string, unknown>;
  const userId = data?.userId as string | undefined;
  if (!userId) return context;

  const app = context.app;
  const client = await app.get('mongodbClient');
  const db = client.db();
  const assignmentsCol = db.collection('roleAssignments');

  await assignmentsCol.updateMany(
    { userId, status: 'active' },
    { $set: { status: 'revoked', updatedAt: new Date().toISOString() } },
  );

  return context;
}
