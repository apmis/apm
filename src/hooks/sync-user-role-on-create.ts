import type { HookContext } from '@feathersjs/feathers';
import { ObjectId } from 'mongodb';

/**
 * After a user is created with a `primaryRoleCode`, look up the role,
 * copy its `permissionCodes` onto the user document, and create a
 * corresponding role-assignment so the permission-sync machinery works
 * going forward.
 */
export async function syncUserRoleOnCreate(context: HookContext): Promise<HookContext> {
  if (!context.params.provider) return context;

  const user = context.result as Record<string, unknown> | undefined;
  if (!user) return context;

  const roleCode = user.primaryRoleCode as string | undefined;
  if (!roleCode) return context;

  const userId = user._id;
  if (!userId) return context;
  const userIdStr = userId.toString();

  const app = context.app;
  const client = await app.get('mongodbClient');
  const db = client.db();
  const rolesCol = db.collection('roles');
  const usersCol = db.collection('users');
  const assignmentsCol = db.collection('roleAssignments');

  const role = await rolesCol.findOne({ code: roleCode, status: 'active' });
  if (!role) return context;

  const permissionCodes: string[] = (role as any).permissionCodes || [];

  // Update user document with permissions
  await usersCol.updateOne(
    { _id: new ObjectId(userIdStr) },
    { $set: { permissions: permissionCodes, updatedAt: new Date().toISOString() } },
  );

  // Create role assignment if one doesn't already exist
  const existing = await assignmentsCol.findOne({
    userId: userIdStr,
    roleId: role._id.toString(),
  });
  if (!existing) {
    await assignmentsCol.insertOne({
      userId: userIdStr,
      roleId: role._id.toString(),
      roleCode,
      status: 'active',
      assignedAt: new Date().toISOString(),
      assignedBy: (context.params.user as Record<string, unknown>)?._id?.toString() || 'system',
    });
  }

  return context;
}
