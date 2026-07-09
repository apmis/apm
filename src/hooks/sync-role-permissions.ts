import type { HookContext } from '@feathersjs/feathers';
import { ObjectId } from 'mongodb';

/**
 * After a role-assignment is created, patched, or removed, recompute the
 * affected user's effective permissions from all their active assignments
 * and write the result to `users.permissions[]`.
 *
 * The JWT is issued from the user document at login time, so once the
 * user record is updated the next token refresh picks up the new perms.
 */
export async function syncRolePermissions(context: HookContext): Promise<HookContext> {
  // Skip internal calls
  if (!context.params.provider) return context;

  const app = context.app;

  const rolesCol = await app.get('mongoClient').db().collection('roles');
  const assignmentsCol = await app.get('mongoClient').db().collection('roleAssignments');
  const usersCol = await app.get('mongoClient').db().collection('users');

  // Determine which userId was affected
  const userId = getUserId(context);
  if (!userId) return context;

  // Find all active, non-expired assignments for this user
  const now = new Date();
  const activeAssignments = await assignmentsCol
    .find({
      userId: userId,
      status: 'active',
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: null },
        { effectiveTo: '' },
        { effectiveTo: { $gt: now.toISOString() } },
      ],
    })
    .toArray();

  if (activeAssignments.length === 0) {
    // No active roles → clear permissions
    await usersCol.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { permissions: [], updatedAt: now.toISOString() } },
    );
    return context;
  }

  // Collect all roleIds, fetch their permissionCodes
  const roleIds = activeAssignments
    .map((a: any) => {
      try { return new ObjectId(a.roleId); } catch { return null; }
    })
    .filter(Boolean);

  const roles = roleIds.length > 0
    ? await rolesCol.find({ _id: { $in: roleIds }, status: 'active' }).toArray()
    : [];

  // Build the union of all permission codes
  const permSet = new Set<string>();
  for (const role of roles) {
    const codes: string[] = (role as any).permissionCodes || [];
    for (const code of codes) permSet.add(code);
  }

  const permissions = Array.from(permSet);

  // Persist to user document
  await usersCol.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { permissions, updatedAt: now.toISOString() } },
  );

  return context;
}

function getUserId(context: HookContext): string | null {
  // For role-assignment CRUD the userId is in context.data or context.result
  const data = context.data as Record<string, unknown> | undefined;
  const result = context.result as Record<string, unknown> | undefined;

  const id = (data?.userId || result?.userId) as string | undefined;
  if (id && ObjectId.isValid(id)) return id;

  // Fallback: single-doc result
  if (result?._id) return result._id.toString();

  return null;
}
