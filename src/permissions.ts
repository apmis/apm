/**
 * Centralised permission constants for the APM RBACC system.
 *
 * Convention:  <module>_<action>
 *   module  = lowercase service-slug (matches apm/<service-path>)
 *   action  = read | write | admin | export
 *
 * A user's effective permissions are stored in `users.permissions[]`.
 * They are computed from the union of `roles.permissionCodes` for all
 * active role-assignments and written by the sync-role-permissions hook.
 */

// ─── Wildcard / super-admin ────────────────────────────────────────
export const SUPER_ADMIN = '*';

// ─── Module permissions ────────────────────────────────────────────
// Each module gets at least `read` and `write`; sensitive modules add `admin`.

export const USERS_READ     = 'users_read';
export const USERS_WRITE    = 'users_write';
export const USERS_ADMIN    = 'users_admin';

export const ROLES_READ     = 'roles_read';
export const ROLES_WRITE    = 'roles_write';

export const PERMISSIONS_READ  = 'permissions_read';
export const PERMISSIONS_WRITE = 'permissions_write';

export const ROLE_ASSIGNMENTS_READ  = 'role_assignments_read';
export const ROLE_ASSIGNMENTS_WRITE = 'role_assignments_write';

export const GEOGRAPHY_ASSIGNMENTS_READ  = 'geography_assignments_read';
export const GEOGRAPHY_ASSIGNMENTS_WRITE = 'geography_assignments_write';

export const USER_DEVICES_READ  = 'user_devices_read';
export const USER_DEVICES_WRITE = 'user_devices_write';

export const USER_SESSIONS_READ  = 'user_sessions_read';
export const USER_SESSIONS_WRITE = 'user_sessions_write';

export const STATES_READ  = 'states_read';
export const STATES_WRITE = 'states_write';

export const SENATORIAL_DISTRICTS_READ  = 'senatorial_districts_read';
export const SENATORIAL_DISTRICTS_WRITE = 'senatorial_districts_write';

export const LGAS_READ  = 'lgas_read';
export const LGAS_WRITE = 'lgas_write';

export const WARDS_READ  = 'wards_read';
export const WARDS_WRITE = 'wards_write';

export const POLLING_UNITS_READ  = 'polling_units_read';
export const POLLING_UNITS_WRITE = 'polling_units_write';

export const POLLING_UNIT_INTELLIGENCE_READ  = 'polling_unit_intelligence_read';
export const POLLING_UNIT_INTELLIGENCE_WRITE = 'polling_unit_intelligence_write';

export const WARD_CONVERSION_ASSESSMENTS_READ  = 'ward_conversion_assessments_read';
export const WARD_CONVERSION_ASSESSMENTS_WRITE = 'ward_conversion_assessments_write';

export const STAKEHOLDERS_READ  = 'stakeholders_read';
export const STAKEHOLDERS_WRITE = 'stakeholders_write';

export const STAKEHOLDER_ENGAGEMENTS_READ  = 'stakeholder_engagements_read';
export const STAKEHOLDER_ENGAGEMENTS_WRITE = 'stakeholder_engagements_write';

export const CANVASSING_REPORTS_READ  = 'canvassing_reports_read';
export const CANVASSING_REPORTS_WRITE = 'canvassing_reports_write';

export const VOLUNTEERS_READ  = 'volunteers_read';
export const VOLUNTEERS_WRITE = 'volunteers_write';

export const VOLUNTEER_ASSIGNMENTS_READ  = 'volunteer_assignments_read';
export const VOLUNTEER_ASSIGNMENTS_WRITE = 'volunteer_assignments_write';

export const VOLUNTEER_ACTIVITIES_READ  = 'volunteer_activities_read';
export const VOLUNTEER_ACTIVITIES_WRITE = 'volunteer_activities_write';

export const TASKS_READ  = 'tasks_read';
export const TASKS_WRITE = 'tasks_write';

export const CONTENT_ITEMS_READ  = 'content_items_read';
export const CONTENT_ITEMS_WRITE = 'content_items_write';

export const CONTENT_APPROVAL_EVENTS_READ  = 'content_approval_events_read';
export const CONTENT_APPROVAL_EVENTS_WRITE = 'content_approval_events_write';

export const CONTENT_DISTRIBUTIONS_READ  = 'content_distributions_read';
export const CONTENT_DISTRIBUTIONS_WRITE = 'content_distributions_write';

export const WHATSAPP_GROUPS_READ  = 'whatsapp_groups_read';
export const WHATSAPP_GROUPS_WRITE = 'whatsapp_groups_write';

export const RAPID_RESPONSE_ISSUES_READ  = 'rapid_response_issues_read';
export const RAPID_RESPONSE_ISSUES_WRITE = 'rapid_response_issues_write';

export const RAPID_RESPONSE_ACTIONS_READ  = 'rapid_response_actions_read';
export const RAPID_RESPONSE_ACTIONS_WRITE = 'rapid_response_actions_write';

export const CANDIDATE_EVENTS_READ  = 'candidate_events_read';
export const CANDIDATE_EVENTS_WRITE = 'candidate_events_write';

export const EVENT_PARTICIPANTS_READ  = 'event_participants_read';
export const EVENT_PARTICIPANTS_WRITE = 'event_participants_write';

export const EVENT_REPORTS_READ  = 'event_reports_read';
export const EVENT_REPORTS_WRITE = 'event_reports_write';

export const EVENT_COMMITMENTS_READ  = 'event_commitments_read';
export const EVENT_COMMITMENTS_WRITE = 'event_commitments_write';

export const POLLING_UNIT_AGENTS_READ  = 'polling_unit_agents_read';
export const POLLING_UNIT_AGENTS_WRITE = 'polling_unit_agents_write';

export const AGENT_ASSIGNMENTS_READ  = 'agent_assignments_read';
export const AGENT_ASSIGNMENTS_WRITE = 'agent_assignments_write';

export const AGENT_TRAINING_RECORDS_READ  = 'agent_training_records_read';
export const AGENT_TRAINING_RECORDS_WRITE = 'agent_training_records_write';

export const AGENT_READINESS_CHECKLISTS_READ  = 'agent_readiness_checklists_read';
export const AGENT_READINESS_CHECKLISTS_WRITE = 'agent_readiness_checklists_write';

export const ELECTION_DAY_REPORTS_READ  = 'election_day_reports_read';
export const ELECTION_DAY_REPORTS_WRITE = 'election_day_reports_write';

export const INCIDENTS_READ  = 'incidents_read';
export const INCIDENTS_WRITE = 'incidents_write';

export const ESCALATIONS_READ  = 'escalations_read';
export const ESCALATIONS_WRITE = 'escalations_write';

export const ELECTION_RESULTS_READ  = 'election_results_read';
export const ELECTION_RESULTS_WRITE = 'election_results_write';

export const RESULT_VERIFICATIONS_READ  = 'result_verifications_read';
export const RESULT_VERIFICATIONS_WRITE = 'result_verifications_write';

export const RESULT_RECONCILIATIONS_READ  = 'result_reconciliations_read';
export const RESULT_RECONCILIATIONS_WRITE = 'result_reconciliations_write';

export const MEDIA_FILES_READ  = 'media_files_read';
export const MEDIA_FILES_WRITE = 'media_files_write';

export const NOTIFICATIONS_READ  = 'notifications_read';
export const NOTIFICATIONS_WRITE = 'notifications_write';

export const SYNC_OPERATIONS_READ  = 'sync_operations_read';
export const SYNC_OPERATIONS_WRITE = 'sync_operations_write';

export const GENERATED_REPORTS_READ  = 'generated_reports_read';
export const GENERATED_REPORTS_WRITE = 'generated_reports_write';

export const DASHBOARD_SNAPSHOTS_READ  = 'dashboard_snapshots_read';
export const DASHBOARD_SNAPSHOTS_WRITE = 'dashboard_snapshots_write';

export const AUDIT_LOGS_READ  = 'audit_logs_read';
export const AUDIT_LOGS_WRITE = 'audit_logs_write';

export const DATA_EXPORTS_READ  = 'data_exports_read';
export const DATA_EXPORTS_WRITE = 'data_exports_write';

export const SYSTEM_SETTINGS_READ  = 'system_settings_read';
export const SYSTEM_SETTINGS_WRITE = 'system_settings_write';

export const VOTER_CONTACTS_READ  = 'voter_contacts_read';
export const VOTER_CONTACTS_WRITE = 'voter_contacts_write';

// ─── Role bundles (permissionCodes for each role) ──────────────────

/** National Admin – full access to every module. */
export const NATIONAL_ADMIN_PERMISSIONS = [
  SUPER_ADMIN,
];

/** State Admin – read/write access to state-scoped modules. */
export const STATE_ADMIN_PERMISSIONS = [
  USERS_READ, USERS_WRITE,
  ROLES_READ,
  ROLE_ASSIGNMENTS_READ,
  GEOGRAPHY_ASSIGNMENTS_READ,
  USER_DEVICES_READ,
  USER_SESSIONS_READ,
  STATES_READ,
  SENATORIAL_DISTRICTS_READ, SENATORIAL_DISTRICTS_WRITE,
  LGAS_READ, LGAS_WRITE,
  WARDS_READ, WARDS_WRITE,
  POLLING_UNITS_READ, POLLING_UNITS_WRITE,
  POLLING_UNIT_INTELLIGENCE_READ, POLLING_UNIT_INTELLIGENCE_WRITE,
  WARD_CONVERSION_ASSESSMENTS_READ, WARD_CONVERSION_ASSESSMENTS_WRITE,
  STAKEHOLDERS_READ, STAKEHOLDERS_WRITE,
  STAKEHOLDER_ENGAGEMENTS_READ, STAKEHOLDER_ENGAGEMENTS_WRITE,
  CANVASSING_REPORTS_READ, CANVASSING_REPORTS_WRITE,
  VOLUNTEERS_READ, VOLUNTEERS_WRITE,
  VOLUNTEER_ASSIGNMENTS_READ, VOLUNTEER_ASSIGNMENTS_WRITE,
  VOLUNTEER_ACTIVITIES_READ, VOLUNTEER_ACTIVITIES_WRITE,
  TASKS_READ, TASKS_WRITE,
  CONTENT_ITEMS_READ, CONTENT_ITEMS_WRITE,
  CONTENT_APPROVAL_EVENTS_READ, CONTENT_APPROVAL_EVENTS_WRITE,
  CONTENT_DISTRIBUTIONS_READ, CONTENT_DISTRIBUTIONS_WRITE,
  WHATSAPP_GROUPS_READ, WHATSAPP_GROUPS_WRITE,
  RAPID_RESPONSE_ISSUES_READ, RAPID_RESPONSE_ISSUES_WRITE,
  RAPID_RESPONSE_ACTIONS_READ, RAPID_RESPONSE_ACTIONS_WRITE,
  CANDIDATE_EVENTS_READ, CANDIDATE_EVENTS_WRITE,
  EVENT_PARTICIPANTS_READ, EVENT_PARTICIPANTS_WRITE,
  EVENT_REPORTS_READ, EVENT_REPORTS_WRITE,
  EVENT_COMMITMENTS_READ, EVENT_COMMITMENTS_WRITE,
  POLLING_UNIT_AGENTS_READ, POLLING_UNIT_AGENTS_WRITE,
  AGENT_ASSIGNMENTS_READ, AGENT_ASSIGNMENTS_WRITE,
  AGENT_TRAINING_RECORDS_READ, AGENT_TRAINING_RECORDS_WRITE,
  AGENT_READINESS_CHECKLISTS_READ, AGENT_READINESS_CHECKLISTS_WRITE,
  ELECTION_DAY_REPORTS_READ, ELECTION_DAY_REPORTS_WRITE,
  INCIDENTS_READ, INCIDENTS_WRITE,
  ESCALATIONS_READ, ESCALATIONS_WRITE,
  ELECTION_RESULTS_READ, ELECTION_RESULTS_WRITE,
  RESULT_VERIFICATIONS_READ, RESULT_VERIFICATIONS_WRITE,
  RESULT_RECONCILIATIONS_READ, RESULT_RECONCILIATIONS_WRITE,
  MEDIA_FILES_READ, MEDIA_FILES_WRITE,
  NOTIFICATIONS_READ, NOTIFICATIONS_WRITE,
  GENERATED_REPORTS_READ, GENERATED_REPORTS_WRITE,
  DASHBOARD_SNAPSHOTS_READ, DASHBOARD_SNAPSHOTS_WRITE,
  AUDIT_LOGS_READ, AUDIT_LOGS_WRITE,
  DATA_EXPORTS_READ, DATA_EXPORTS_WRITE,
  SYSTEM_SETTINGS_READ, SYSTEM_SETTINGS_WRITE,
  VOTER_CONTACTS_READ, VOTER_CONTACTS_WRITE,
];

/** LGA Coordinator – read/write for LGA-scoped operational modules. */
export const LGA_COORDINATOR_PERMISSIONS = [
  USERS_READ,
  LGAS_READ,
  WARDS_READ, WARDS_WRITE,
  POLLING_UNITS_READ,
  POLLING_UNIT_INTELLIGENCE_READ, POLLING_UNIT_INTELLIGENCE_WRITE,
  WARD_CONVERSION_ASSESSMENTS_READ, WARD_CONVERSION_ASSESSMENTS_WRITE,
  STAKEHOLDERS_READ, STAKEHOLDERS_WRITE,
  STAKEHOLDER_ENGAGEMENTS_READ, STAKEHOLDER_ENGAGEMENTS_WRITE,
  CANVASSING_REPORTS_READ, CANVASSING_REPORTS_WRITE,
  VOLUNTEERS_READ, VOLUNTEERS_WRITE,
  VOLUNTEER_ASSIGNMENTS_READ, VOLUNTEER_ASSIGNMENTS_WRITE,
  VOLUNTEER_ACTIVITIES_READ, VOLUNTEER_ACTIVITIES_WRITE,
  TASKS_READ, TASKS_WRITE,
  RAPID_RESPONSE_ISSUES_READ, RAPID_RESPONSE_ISSUES_WRITE,
  RAPID_RESPONSE_ACTIONS_READ, RAPID_RESPONSE_ACTIONS_WRITE,
  POLLING_UNIT_AGENTS_READ, POLLING_UNIT_AGENTS_WRITE,
  AGENT_ASSIGNMENTS_READ, AGENT_ASSIGNMENTS_WRITE,
  AGENT_TRAINING_RECORDS_READ, AGENT_TRAINING_RECORDS_WRITE,
  AGENT_READINESS_CHECKLISTS_READ, AGENT_READINESS_CHECKLISTS_WRITE,
  INCIDENTS_READ, INCIDENTS_WRITE,
  NOTIFICATIONS_READ, NOTIFICATIONS_WRITE,
  VOTER_CONTACTS_READ, VOTER_CONTACTS_WRITE,
];

/** Ward Agent – read/write for ward-level field modules. */
export const WARD_AGENT_PERMISSIONS = [
  POLLING_UNITS_READ,
  POLLING_UNIT_INTELLIGENCE_READ, POLLING_UNIT_INTELLIGENCE_WRITE,
  STAKEHOLDERS_READ, STAKEHOLDERS_WRITE,
  STAKEHOLDER_ENGAGEMENTS_READ, STAKEHOLDER_ENGAGEMENTS_WRITE,
  CANVASSING_REPORTS_READ, CANVASSING_REPORTS_WRITE,
  VOLUNTEERS_READ, VOLUNTEERS_WRITE,
  VOLUNTEER_ACTIVITIES_READ, VOLUNTEER_ACTIVITIES_WRITE,
  POLLING_UNIT_AGENTS_READ,
  AGENT_ASSIGNMENTS_READ,
  INCIDENTS_READ, INCIDENTS_WRITE,
  NOTIFICATIONS_READ,
  VOTER_CONTACTS_READ, VOTER_CONTACTS_WRITE,
];

/** Field Agent – minimal read-heavy access for data collection. */
export const FIELD_AGENT_PERMISSIONS = [
  POLLING_UNITS_READ,
  POLLING_UNIT_INTELLIGENCE_READ, POLLING_UNIT_INTELLIGENCE_WRITE,
  STAKEHOLDERS_READ, STAKEHOLDERS_WRITE,
  CANVASSING_REPORTS_READ, CANVASSING_REPORTS_WRITE,
  INCIDENTS_READ, INCIDENTS_WRITE,
  NOTIFICATIONS_READ,
  VOTER_CONTACTS_READ,
  TASKS_READ, TASKS_WRITE,
  ELECTION_DAY_REPORTS_READ, ELECTION_DAY_REPORTS_WRITE,
];

// ─── Legacy compatibility ──────────────────────────────────────────
/** @deprecated Use NATIONAL_ADMIN_PERMISSIONS or SUPER_ADMIN instead. */
export const ADMIN_PERMS = ['apm_admin'];

// ─── Permission seed data ──────────────────────────────────────────
/** Flat list of all atomic permissions for seeding the `permissions` collection. */
export const ALL_PERMISSIONS: Array<{ code: string; module: string; action: string; riskLevel: 'low' | 'medium' | 'high' | 'critical' }> = [
  { code: SUPER_ADMIN, module: '*', action: 'admin', riskLevel: 'critical' },

  { code: USERS_READ, module: 'users', action: 'read', riskLevel: 'low' },
  { code: USERS_WRITE, module: 'users', action: 'write', riskLevel: 'medium' },
  { code: USERS_ADMIN, module: 'users', action: 'admin', riskLevel: 'critical' },

  { code: ROLES_READ, module: 'roles', action: 'read', riskLevel: 'low' },
  { code: ROLES_WRITE, module: 'roles', action: 'write', riskLevel: 'high' },

  { code: PERMISSIONS_READ, module: 'permissions', action: 'read', riskLevel: 'low' },
  { code: PERMISSIONS_WRITE, module: 'permissions', action: 'write', riskLevel: 'critical' },

  { code: ROLE_ASSIGNMENTS_READ, module: 'role-assignments', action: 'read', riskLevel: 'low' },
  { code: ROLE_ASSIGNMENTS_WRITE, module: 'role-assignments', action: 'write', riskLevel: 'critical' },

  { code: GEOGRAPHY_ASSIGNMENTS_READ, module: 'geography-assignments', action: 'read', riskLevel: 'low' },
  { code: GEOGRAPHY_ASSIGNMENTS_WRITE, module: 'geography-assignments', action: 'write', riskLevel: 'high' },

  { code: USER_DEVICES_READ, module: 'user-devices', action: 'read', riskLevel: 'low' },
  { code: USER_DEVICES_WRITE, module: 'user-devices', action: 'write', riskLevel: 'medium' },

  { code: USER_SESSIONS_READ, module: 'user-sessions', action: 'read', riskLevel: 'low' },
  { code: USER_SESSIONS_WRITE, module: 'user-sessions', action: 'write', riskLevel: 'medium' },

  { code: STATES_READ, module: 'states', action: 'read', riskLevel: 'low' },
  { code: STATES_WRITE, module: 'states', action: 'write', riskLevel: 'high' },

  { code: SENATORIAL_DISTRICTS_READ, module: 'senatorial-districts', action: 'read', riskLevel: 'low' },
  { code: SENATORIAL_DISTRICTS_WRITE, module: 'senatorial-districts', action: 'write', riskLevel: 'medium' },

  { code: LGAS_READ, module: 'lgas', action: 'read', riskLevel: 'low' },
  { code: LGAS_WRITE, module: 'lgas', action: 'write', riskLevel: 'medium' },

  { code: WARDS_READ, module: 'wards', action: 'read', riskLevel: 'low' },
  { code: WARDS_WRITE, module: 'wards', action: 'write', riskLevel: 'medium' },

  { code: POLLING_UNITS_READ, module: 'polling-units', action: 'read', riskLevel: 'low' },
  { code: POLLING_UNITS_WRITE, module: 'polling-units', action: 'write', riskLevel: 'medium' },

  { code: POLLING_UNIT_INTELLIGENCE_READ, module: 'polling-unit-intelligence', action: 'read', riskLevel: 'low' },
  { code: POLLING_UNIT_INTELLIGENCE_WRITE, module: 'polling-unit-intelligence', action: 'write', riskLevel: 'medium' },

  { code: WARD_CONVERSION_ASSESSMENTS_READ, module: 'ward-conversion-assessments', action: 'read', riskLevel: 'low' },
  { code: WARD_CONVERSION_ASSESSMENTS_WRITE, module: 'ward-conversion-assessments', action: 'write', riskLevel: 'medium' },

  { code: STAKEHOLDERS_READ, module: 'stakeholders', action: 'read', riskLevel: 'low' },
  { code: STAKEHOLDERS_WRITE, module: 'stakeholders', action: 'write', riskLevel: 'medium' },

  { code: STAKEHOLDER_ENGAGEMENTS_READ, module: 'stakeholder-engagements', action: 'read', riskLevel: 'low' },
  { code: STAKEHOLDER_ENGAGEMENTS_WRITE, module: 'stakeholder-engagements', action: 'write', riskLevel: 'medium' },

  { code: CANVASSING_REPORTS_READ, module: 'canvassing-reports', action: 'read', riskLevel: 'low' },
  { code: CANVASSING_REPORTS_WRITE, module: 'canvassing-reports', action: 'write', riskLevel: 'medium' },

  { code: VOLUNTEERS_READ, module: 'volunteers', action: 'read', riskLevel: 'low' },
  { code: VOLUNTEERS_WRITE, module: 'volunteers', action: 'write', riskLevel: 'medium' },

  { code: VOLUNTEER_ASSIGNMENTS_READ, module: 'volunteer-assignments', action: 'read', riskLevel: 'low' },
  { code: VOLUNTEER_ASSIGNMENTS_WRITE, module: 'volunteer-assignments', action: 'write', riskLevel: 'medium' },

  { code: VOLUNTEER_ACTIVITIES_READ, module: 'volunteer-activities', action: 'read', riskLevel: 'low' },
  { code: VOLUNTEER_ACTIVITIES_WRITE, module: 'volunteer-activities', action: 'write', riskLevel: 'medium' },

  { code: TASKS_READ, module: 'tasks', action: 'read', riskLevel: 'low' },
  { code: TASKS_WRITE, module: 'tasks', action: 'write', riskLevel: 'medium' },

  { code: CONTENT_ITEMS_READ, module: 'content-items', action: 'read', riskLevel: 'low' },
  { code: CONTENT_ITEMS_WRITE, module: 'content-items', action: 'write', riskLevel: 'medium' },

  { code: CONTENT_APPROVAL_EVENTS_READ, module: 'content-approval-events', action: 'read', riskLevel: 'low' },
  { code: CONTENT_APPROVAL_EVENTS_WRITE, module: 'content-approval-events', action: 'write', riskLevel: 'medium' },

  { code: CONTENT_DISTRIBUTIONS_READ, module: 'content-distributions', action: 'read', riskLevel: 'low' },
  { code: CONTENT_DISTRIBUTIONS_WRITE, module: 'content-distributions', action: 'write', riskLevel: 'medium' },

  { code: WHATSAPP_GROUPS_READ, module: 'whatsapp-groups', action: 'read', riskLevel: 'low' },
  { code: WHATSAPP_GROUPS_WRITE, module: 'whatsapp-groups', action: 'write', riskLevel: 'medium' },

  { code: RAPID_RESPONSE_ISSUES_READ, module: 'rapid-response-issues', action: 'read', riskLevel: 'low' },
  { code: RAPID_RESPONSE_ISSUES_WRITE, module: 'rapid-response-issues', action: 'write', riskLevel: 'high' },

  { code: RAPID_RESPONSE_ACTIONS_READ, module: 'rapid-response-actions', action: 'read', riskLevel: 'low' },
  { code: RAPID_RESPONSE_ACTIONS_WRITE, module: 'rapid-response-actions', action: 'write', riskLevel: 'high' },

  { code: CANDIDATE_EVENTS_READ, module: 'candidate-events', action: 'read', riskLevel: 'low' },
  { code: CANDIDATE_EVENTS_WRITE, module: 'candidate-events', action: 'write', riskLevel: 'medium' },

  { code: EVENT_PARTICIPANTS_READ, module: 'event-participants', action: 'read', riskLevel: 'low' },
  { code: EVENT_PARTICIPANTS_WRITE, module: 'event-participants', action: 'write', riskLevel: 'medium' },

  { code: EVENT_REPORTS_READ, module: 'event-reports', action: 'read', riskLevel: 'low' },
  { code: EVENT_REPORTS_WRITE, module: 'event-reports', action: 'write', riskLevel: 'medium' },

  { code: EVENT_COMMITMENTS_READ, module: 'event-commitments', action: 'read', riskLevel: 'low' },
  { code: EVENT_COMMITMENTS_WRITE, module: 'event-commitments', action: 'write', riskLevel: 'medium' },

  { code: POLLING_UNIT_AGENTS_READ, module: 'polling-unit-agents', action: 'read', riskLevel: 'low' },
  { code: POLLING_UNIT_AGENTS_WRITE, module: 'polling-unit-agents', action: 'write', riskLevel: 'medium' },

  { code: AGENT_ASSIGNMENTS_READ, module: 'agent-assignments', action: 'read', riskLevel: 'low' },
  { code: AGENT_ASSIGNMENTS_WRITE, module: 'agent-assignments', action: 'write', riskLevel: 'medium' },

  { code: AGENT_TRAINING_RECORDS_READ, module: 'agent-training-records', action: 'read', riskLevel: 'low' },
  { code: AGENT_TRAINING_RECORDS_WRITE, module: 'agent-training-records', action: 'write', riskLevel: 'medium' },

  { code: AGENT_READINESS_CHECKLISTS_READ, module: 'agent-readiness-checklists', action: 'read', riskLevel: 'low' },
  { code: AGENT_READINESS_CHECKLISTS_WRITE, module: 'agent-readiness-checklists', action: 'write', riskLevel: 'medium' },

  { code: ELECTION_DAY_REPORTS_READ, module: 'election-day-reports', action: 'read', riskLevel: 'low' },
  { code: ELECTION_DAY_REPORTS_WRITE, module: 'election-day-reports', action: 'write', riskLevel: 'high' },

  { code: INCIDENTS_READ, module: 'incidents', action: 'read', riskLevel: 'low' },
  { code: INCIDENTS_WRITE, module: 'incidents', action: 'write', riskLevel: 'high' },

  { code: ESCALATIONS_READ, module: 'escalations', action: 'read', riskLevel: 'low' },
  { code: ESCALATIONS_WRITE, module: 'escalations', action: 'write', riskLevel: 'high' },

  { code: ELECTION_RESULTS_READ, module: 'election-results', action: 'read', riskLevel: 'medium' },
  { code: ELECTION_RESULTS_WRITE, module: 'election-results', action: 'write', riskLevel: 'critical' },

  { code: RESULT_VERIFICATIONS_READ, module: 'result-verifications', action: 'read', riskLevel: 'low' },
  { code: RESULT_VERIFICATIONS_WRITE, module: 'result-verifications', action: 'write', riskLevel: 'high' },

  { code: RESULT_RECONCILIATIONS_READ, module: 'result-reconciliations', action: 'read', riskLevel: 'low' },
  { code: RESULT_RECONCILIATIONS_WRITE, module: 'result-reconciliations', action: 'write', riskLevel: 'high' },

  { code: MEDIA_FILES_READ, module: 'media-files', action: 'read', riskLevel: 'low' },
  { code: MEDIA_FILES_WRITE, module: 'media-files', action: 'write', riskLevel: 'medium' },

  { code: NOTIFICATIONS_READ, module: 'notifications', action: 'read', riskLevel: 'low' },
  { code: NOTIFICATIONS_WRITE, module: 'notifications', action: 'write', riskLevel: 'medium' },

  { code: SYNC_OPERATIONS_READ, module: 'sync-operations', action: 'read', riskLevel: 'low' },
  { code: SYNC_OPERATIONS_WRITE, module: 'sync-operations', action: 'write', riskLevel: 'medium' },

  { code: GENERATED_REPORTS_READ, module: 'generated-reports', action: 'read', riskLevel: 'low' },
  { code: GENERATED_REPORTS_WRITE, module: 'generated-reports', action: 'write', riskLevel: 'medium' },

  { code: DASHBOARD_SNAPSHOTS_READ, module: 'dashboard-snapshots', action: 'read', riskLevel: 'low' },
  { code: DASHBOARD_SNAPSHOTS_WRITE, module: 'dashboard-snapshots', action: 'write', riskLevel: 'medium' },

  { code: AUDIT_LOGS_READ, module: 'audit-logs', action: 'read', riskLevel: 'low' },
  { code: AUDIT_LOGS_WRITE, module: 'audit-logs', action: 'write', riskLevel: 'critical' },

  { code: DATA_EXPORTS_READ, module: 'data-exports', action: 'read', riskLevel: 'low' },
  { code: DATA_EXPORTS_WRITE, module: 'data-exports', action: 'write', riskLevel: 'high' },

  { code: SYSTEM_SETTINGS_READ, module: 'system-settings', action: 'read', riskLevel: 'medium' },
  { code: SYSTEM_SETTINGS_WRITE, module: 'system-settings', action: 'write', riskLevel: 'critical' },

  { code: VOTER_CONTACTS_READ, module: 'voter-contacts', action: 'read', riskLevel: 'low' },
  { code: VOTER_CONTACTS_WRITE, module: 'voter-contacts', action: 'write', riskLevel: 'medium' },
];
