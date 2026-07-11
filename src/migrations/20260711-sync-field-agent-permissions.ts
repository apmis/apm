import { config } from "dotenv";
config();
import { MongoClient } from "mongodb";
import {
  FIELD_AGENT_PERMISSIONS,
  STATE_ADMIN_PERMISSIONS,
  LGA_COORDINATOR_PERMISSIONS,
  WARD_AGENT_PERMISSIONS,
} from "../permissions.js";

const URI =
  process.env.mongodb ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/apm-campaign";

/**
 * Syncs role permissionCodes from code-level constants to the database.
 *
 * The seed script only inserts roles when the collection is empty, so any
 * permissions added to code after the initial seed are never written to
 * existing role documents.  This migration patches all system roles with
 * their current code-defined permission sets, then recomputes every
 * affected user's permissions from their active role-assignments.
 *
 * Safe to run multiple times (idempotent).
 */
async function migrate() {
  const ROLE_PERMISSIONS: Record<string, string[]> = {
    FIELD_AGENT: FIELD_AGENT_PERMISSIONS,
    STATE_ADMIN: STATE_ADMIN_PERMISSIONS,
    LGA_COORDINATOR: LGA_COORDINATOR_PERMISSIONS,
    WARD_AGENT: WARD_AGENT_PERMISSIONS,
    // NATIONAL_ADMIN uses '*' wildcard — no sync needed
  };

  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db();
  const now = new Date().toISOString();

  console.log("─── Role permission sync migration ───");

  // 1. Update each system role's permissionCodes to match code
  for (const [code, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const result = await db.collection("roles").updateOne(
      { code, isSystemRole: true },
      { $set: { permissionCodes: perms, updatedAt: now } },
    );
    console.log(
      `  role ${code}: matched=${result.matchedCount} modified=${result.modifiedCount}`,
    );
  }

  // 2. For every user with a system role, recompute permissions from
  //    their active role-assignments (mirrors sync-role-permissions logic).
  const rolesCol = db.collection("roles");
  const assignmentsCol = db.collection("roleAssignments");
  const usersCol = db.collection("users");

  const allRoles = await rolesCol
    .find({ isSystemRole: true, status: "active" })
    .toArray();
  const roleMap = new Map(allRoles.map((r: any) => [r._id.toString(), r]));

  const users = await usersCol
    .find({ primaryRoleCode: { $exists: true, $ne: "" } })
    .toArray();

  let updated = 0;
  for (const user of users) {
    const assignments = await assignmentsCol
      .find({
        userId: user._id.toString(),
        status: "active",
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: null },
          { effectiveTo: "" },
          { effectiveTo: { $gt: now } },
        ],
      })
      .toArray();

    const permSet = new Set<string>();
    for (const a of assignments) {
      const role = roleMap.get(a.roleId);
      if (role) {
        for (const code of role.permissionCodes || []) permSet.add(code);
      }
    }

    const newPerms = Array.from(permSet);
    const oldPerms = (user.permissions || []).sort().join(",");
    const sorted = newPerms.sort().join(",");

    if (oldPerms !== sorted) {
      await usersCol.updateOne(
        { _id: user._id },
        { $set: { permissions: newPerms, updatedAt: now } },
      );
      updated++;
      console.log(
        `  user ${user.email || user._id}: permissions updated (${newPerms.length} perms)`,
      );
    }
  }

  console.log(
    `\nMigration complete. ${updated}/${users.length} users updated.`,
  );
  await client.close();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
