import type { Application } from '@feathersjs/feathers';
import type { TSchema } from '@sinclair/typebox';
import { hooks as authLocalHooks } from '@feathersjs/authentication-local';
import {
  authenticate, authorizePermission, applyGeographyScope,
  setServerFields, softDeleteFilter, idempotency,
  protectExternal, writeAuditLog, publishByScope,
  validateQuery, validateData, syncRolePermissions,
  populateGeography,
} from './index.js';
import { syncUserRoleOnCreate } from './sync-user-role-on-create.js';

const { hashPassword } = authLocalHooks;

import { UsersResultSchema, UsersDataSchema, UsersPatchSchema, UsersQuerySchema } from '../services/users/users.js';
import { RolesResultSchema, RolesDataSchema, RolesPatchSchema, RolesQuerySchema } from '../services/roles/roles.js';
import { PermissionsResultSchema, PermissionsDataSchema, PermissionsPatchSchema, PermissionsQuerySchema } from '../services/permissions/permissions.js';
import { RoleAssignmentsResultSchema, RoleAssignmentsDataSchema, RoleAssignmentsPatchSchema, RoleAssignmentsQuerySchema } from '../services/role-assignments/role-assignments.js';
import { GeographyAssignmentsResultSchema, GeographyAssignmentsDataSchema, GeographyAssignmentsPatchSchema, GeographyAssignmentsQuerySchema } from '../services/geography-assignments/geography-assignments.js';
import { UserDevicesResultSchema, UserDevicesDataSchema, UserDevicesPatchSchema, UserDevicesQuerySchema } from '../services/user-devices/user-devices.js';
import { UserSessionsResultSchema, UserSessionsDataSchema, UserSessionsPatchSchema, UserSessionsQuerySchema } from '../services/user-sessions/user-sessions.js';
import { SenatorialDistrictsResultSchema, SenatorialDistrictsDataSchema, SenatorialDistrictsPatchSchema, SenatorialDistrictsQuerySchema } from '../services/senatorial-districts/senatorial-districts.js';
import { LgasResultSchema, LgasDataSchema, LgasPatchSchema, LgasQuerySchema } from '../services/lgas/lgas.js';
import { WardsResultSchema, WardsDataSchema, WardsPatchSchema, WardsQuerySchema } from '../services/wards/wards.js';
import { PollingUnitsResultSchema, PollingUnitsDataSchema, PollingUnitsPatchSchema, PollingUnitsQuerySchema } from '../services/polling-units/polling-units.js';
import { PollingUnitIntelligenceResultSchema, PollingUnitIntelligenceDataSchema, PollingUnitIntelligencePatchSchema, PollingUnitIntelligenceQuerySchema } from '../services/polling-unit-intelligence/polling-unit-intelligence.js';
import { PollingUnitIntelligenceHistoryResultSchema, PollingUnitIntelligenceHistoryDataSchema, PollingUnitIntelligenceHistoryPatchSchema, PollingUnitIntelligenceHistoryQuerySchema } from '../services/polling-unit-intelligence-history/polling-unit-intelligence-history.js';
import { WardConversionAssessmentsResultSchema, WardConversionAssessmentsDataSchema, WardConversionAssessmentsPatchSchema, WardConversionAssessmentsQuerySchema } from '../services/ward-conversion-assessments/ward-conversion-assessments.js';
import { StakeholdersResultSchema, StakeholdersDataSchema, StakeholdersPatchSchema, StakeholdersQuerySchema } from '../services/stakeholders/stakeholders.js';
import { StakeholderEngagementsResultSchema, StakeholderEngagementsDataSchema, StakeholderEngagementsPatchSchema, StakeholderEngagementsQuerySchema } from '../services/stakeholder-engagements/stakeholder-engagements.js';
import { CanvassingReportsResultSchema, CanvassingReportsDataSchema, CanvassingReportsPatchSchema, CanvassingReportsQuerySchema } from '../services/canvassing-reports/canvassing-reports.js';
import { VolunteersResultSchema, VolunteersDataSchema, VolunteersPatchSchema, VolunteersQuerySchema } from '../services/volunteers/volunteers.js';
import { VolunteerAssignmentsResultSchema, VolunteerAssignmentsDataSchema, VolunteerAssignmentsPatchSchema, VolunteerAssignmentsQuerySchema } from '../services/volunteer-assignments/volunteer-assignments.js';
import { VolunteerActivitiesResultSchema, VolunteerActivitiesDataSchema, VolunteerActivitiesPatchSchema, VolunteerActivitiesQuerySchema } from '../services/volunteer-activities/volunteer-activities.js';
import { TasksResultSchema, TasksDataSchema, TasksPatchSchema, TasksQuerySchema } from '../services/tasks/tasks.js';
import { ContentItemsResultSchema, ContentItemsDataSchema, ContentItemsPatchSchema, ContentItemsQuerySchema } from '../services/content-items/content-items.js';
import { ContentApprovalEventsResultSchema, ContentApprovalEventsDataSchema, ContentApprovalEventsPatchSchema, ContentApprovalEventsQuerySchema } from '../services/content-approval-events/content-approval-events.js';
import { ContentDistributionsResultSchema, ContentDistributionsDataSchema, ContentDistributionsPatchSchema, ContentDistributionsQuerySchema } from '../services/content-distributions/content-distributions.js';
import { WhatsappGroupsResultSchema, WhatsappGroupsDataSchema, WhatsappGroupsPatchSchema, WhatsappGroupsQuerySchema } from '../services/whatsapp-groups/whatsapp-groups.js';
import { RapidResponseIssuesResultSchema, RapidResponseIssuesDataSchema, RapidResponseIssuesPatchSchema, RapidResponseIssuesQuerySchema } from '../services/rapid-response-issues/rapid-response-issues.js';
import { RapidResponseActionsResultSchema, RapidResponseActionsDataSchema, RapidResponseActionsPatchSchema, RapidResponseActionsQuerySchema } from '../services/rapid-response-actions/rapid-response-actions.js';
import { CandidateEventsResultSchema, CandidateEventsDataSchema, CandidateEventsPatchSchema, CandidateEventsQuerySchema } from '../services/candidate-events/candidate-events.js';
import { EventParticipantsResultSchema, EventParticipantsDataSchema, EventParticipantsPatchSchema, EventParticipantsQuerySchema } from '../services/event-participants/event-participants.js';
import { EventReportsResultSchema, EventReportsDataSchema, EventReportsPatchSchema, EventReportsQuerySchema } from '../services/event-reports/event-reports.js';
import { EventCommitmentsResultSchema, EventCommitmentsDataSchema, EventCommitmentsPatchSchema, EventCommitmentsQuerySchema } from '../services/event-commitments/event-commitments.js';
import { PollingUnitAgentsResultSchema, PollingUnitAgentsDataSchema, PollingUnitAgentsPatchSchema, PollingUnitAgentsQuerySchema } from '../services/polling-unit-agents/polling-unit-agents.js';
import { AgentAssignmentsResultSchema, AgentAssignmentsDataSchema, AgentAssignmentsPatchSchema, AgentAssignmentsQuerySchema } from '../services/agent-assignments/agent-assignments.js';
import { AgentTrainingRecordsResultSchema, AgentTrainingRecordsDataSchema, AgentTrainingRecordsPatchSchema, AgentTrainingRecordsQuerySchema } from '../services/agent-training-records/agent-training-records.js';
import { AgentReadinessChecklistsResultSchema, AgentReadinessChecklistsDataSchema, AgentReadinessChecklistsPatchSchema, AgentReadinessChecklistsQuerySchema } from '../services/agent-readiness-checklists/agent-readiness-checklists.js';
import { ElectionDayReportsResultSchema, ElectionDayReportsDataSchema, ElectionDayReportsPatchSchema, ElectionDayReportsQuerySchema } from '../services/election-day-reports/election-day-reports.js';
import { IncidentsResultSchema, IncidentsDataSchema, IncidentsPatchSchema, IncidentsQuerySchema } from '../services/incidents/incidents.js';
import { EscalationsResultSchema, EscalationsDataSchema, EscalationsPatchSchema, EscalationsQuerySchema } from '../services/escalations/escalations.js';
import { ElectionResultsResultSchema, ElectionResultsDataSchema, ElectionResultsPatchSchema, ElectionResultsQuerySchema } from '../services/election-results/election-results.js';
import { ResultVerificationsResultSchema, ResultVerificationsDataSchema, ResultVerificationsPatchSchema, ResultVerificationsQuerySchema } from '../services/result-verifications/result-verifications.js';
import { ResultReconciliationsResultSchema, ResultReconciliationsDataSchema, ResultReconciliationsPatchSchema, ResultReconciliationsQuerySchema } from '../services/result-reconciliations/result-reconciliations.js';
import { MediaFilesResultSchema, MediaFilesDataSchema, MediaFilesPatchSchema, MediaFilesQuerySchema } from '../services/media-files/media-files.js';
import { NotificationsResultSchema, NotificationsDataSchema, NotificationsPatchSchema, NotificationsQuerySchema } from '../services/notifications/notifications.js';
import { SyncOperationsResultSchema, SyncOperationsDataSchema, SyncOperationsPatchSchema, SyncOperationsQuerySchema } from '../services/sync-operations/sync-operations.js';
import { GeneratedReportsResultSchema, GeneratedReportsDataSchema, GeneratedReportsPatchSchema, GeneratedReportsQuerySchema } from '../services/generated-reports/generated-reports.js';
import { DashboardSnapshotsResultSchema, DashboardSnapshotsDataSchema, DashboardSnapshotsPatchSchema, DashboardSnapshotsQuerySchema } from '../services/dashboard-snapshots/dashboard-snapshots.js';
import { AuditLogsResultSchema, AuditLogsDataSchema, AuditLogsPatchSchema, AuditLogsQuerySchema } from '../services/audit-logs/audit-logs.js';
import { DataExportsResultSchema, DataExportsDataSchema, DataExportsPatchSchema, DataExportsQuerySchema } from '../services/data-exports/data-exports.js';
import { SystemSettingsResultSchema, SystemSettingsDataSchema, SystemSettingsPatchSchema, SystemSettingsQuerySchema } from '../services/system-settings/system-settings.js';
import { StatesResultSchema, StatesDataSchema, StatesPatchSchema, StatesQuerySchema } from '../services/states/states.js';
import { VoterContactsResultSchema, VoterContactsDataSchema, VoterContactsPatchSchema, VoterContactsQuerySchema } from '../services/voter-contacts/voter-contacts.js';

type ServiceConfig = {
  path: string;
  querySchema: TSchema;
  dataSchema: TSchema;
  patchSchema: TSchema;
  idempotent?: boolean;
  publicRead?: boolean;
  authenticatedRead?: boolean;
};

const ADMIN_PERMS = ['*', 'apm_admin'];

/**
 * Derive the read/write permission codes for a service path.
 * Convention: apm/<module> → <module_with_underscores>_read / _write
 */
function derivePermissions(servicePath: string): { read: string[]; write: string[] } {
  const module = servicePath.replace(/^apm\//, '').replace(/-/g, '_');
  return {
    read: [`${module}_read`, ...ADMIN_PERMS],
    write: [`${module}_write`, ...ADMIN_PERMS],
  };
}

export function registerHooks(app: Application) {
  const services: ServiceConfig[] = [
    { path: 'apm/users', querySchema: UsersQuerySchema, dataSchema: UsersDataSchema, patchSchema: UsersPatchSchema, authenticatedRead: true },
    { path: 'apm/roles', querySchema: RolesQuerySchema, dataSchema: RolesDataSchema, patchSchema: RolesPatchSchema },
    { path: 'apm/permissions', querySchema: PermissionsQuerySchema, dataSchema: PermissionsDataSchema, patchSchema: PermissionsPatchSchema },
    { path: 'apm/role-assignments', querySchema: RoleAssignmentsQuerySchema, dataSchema: RoleAssignmentsDataSchema, patchSchema: RoleAssignmentsPatchSchema },
    { path: 'apm/geography-assignments', querySchema: GeographyAssignmentsQuerySchema, dataSchema: GeographyAssignmentsDataSchema, patchSchema: GeographyAssignmentsPatchSchema },
    { path: 'apm/user-devices', querySchema: UserDevicesQuerySchema, dataSchema: UserDevicesDataSchema, patchSchema: UserDevicesPatchSchema },
    { path: 'apm/user-sessions', querySchema: UserSessionsQuerySchema, dataSchema: UserSessionsDataSchema, patchSchema: UserSessionsPatchSchema },
    { path: 'apm/senatorial-districts', querySchema: SenatorialDistrictsQuerySchema, dataSchema: SenatorialDistrictsDataSchema, patchSchema: SenatorialDistrictsPatchSchema, publicRead: true },
    { path: 'apm/lgas', querySchema: LgasQuerySchema, dataSchema: LgasDataSchema, patchSchema: LgasPatchSchema, publicRead: true },
    { path: 'apm/wards', querySchema: WardsQuerySchema, dataSchema: WardsDataSchema, patchSchema: WardsPatchSchema, publicRead: true },
    { path: 'apm/polling-units', querySchema: PollingUnitsQuerySchema, dataSchema: PollingUnitsDataSchema, patchSchema: PollingUnitsPatchSchema, publicRead: true },
    { path: 'apm/polling-unit-intelligence', querySchema: PollingUnitIntelligenceQuerySchema, dataSchema: PollingUnitIntelligenceDataSchema, patchSchema: PollingUnitIntelligencePatchSchema },
    { path: 'apm/polling-unit-intelligence-history', querySchema: PollingUnitIntelligenceHistoryQuerySchema, dataSchema: PollingUnitIntelligenceHistoryDataSchema, patchSchema: PollingUnitIntelligenceHistoryPatchSchema, authenticatedRead: true },
    { path: 'apm/ward-conversion-assessments', querySchema: WardConversionAssessmentsQuerySchema, dataSchema: WardConversionAssessmentsDataSchema, patchSchema: WardConversionAssessmentsPatchSchema },
    { path: 'apm/stakeholders', querySchema: StakeholdersQuerySchema, dataSchema: StakeholdersDataSchema, patchSchema: StakeholdersPatchSchema },
    { path: 'apm/stakeholder-engagements', querySchema: StakeholderEngagementsQuerySchema, dataSchema: StakeholderEngagementsDataSchema, patchSchema: StakeholderEngagementsPatchSchema },
    { path: 'apm/canvassing-reports', querySchema: CanvassingReportsQuerySchema, dataSchema: CanvassingReportsDataSchema, patchSchema: CanvassingReportsPatchSchema },
    { path: 'apm/volunteers', querySchema: VolunteersQuerySchema, dataSchema: VolunteersDataSchema, patchSchema: VolunteersPatchSchema },
    { path: 'apm/volunteer-assignments', querySchema: VolunteerAssignmentsQuerySchema, dataSchema: VolunteerAssignmentsDataSchema, patchSchema: VolunteerAssignmentsPatchSchema },
    { path: 'apm/volunteer-activities', querySchema: VolunteerActivitiesQuerySchema, dataSchema: VolunteerActivitiesDataSchema, patchSchema: VolunteerActivitiesPatchSchema },
    { path: 'apm/tasks', querySchema: TasksQuerySchema, dataSchema: TasksDataSchema, patchSchema: TasksPatchSchema },
    { path: 'apm/content-items', querySchema: ContentItemsQuerySchema, dataSchema: ContentItemsDataSchema, patchSchema: ContentItemsPatchSchema, publicRead: true },
    { path: 'apm/content-approval-events', querySchema: ContentApprovalEventsQuerySchema, dataSchema: ContentApprovalEventsDataSchema, patchSchema: ContentApprovalEventsPatchSchema },
    { path: 'apm/content-distributions', querySchema: ContentDistributionsQuerySchema, dataSchema: ContentDistributionsDataSchema, patchSchema: ContentDistributionsPatchSchema },
    { path: 'apm/whatsapp-groups', querySchema: WhatsappGroupsQuerySchema, dataSchema: WhatsappGroupsDataSchema, patchSchema: WhatsappGroupsPatchSchema },
    { path: 'apm/rapid-response-issues', querySchema: RapidResponseIssuesQuerySchema, dataSchema: RapidResponseIssuesDataSchema, patchSchema: RapidResponseIssuesPatchSchema },
    { path: 'apm/rapid-response-actions', querySchema: RapidResponseActionsQuerySchema, dataSchema: RapidResponseActionsDataSchema, patchSchema: RapidResponseActionsPatchSchema },
    { path: 'apm/candidate-events', querySchema: CandidateEventsQuerySchema, dataSchema: CandidateEventsDataSchema, patchSchema: CandidateEventsPatchSchema },
    { path: 'apm/event-participants', querySchema: EventParticipantsQuerySchema, dataSchema: EventParticipantsDataSchema, patchSchema: EventParticipantsPatchSchema },
    { path: 'apm/event-reports', querySchema: EventReportsQuerySchema, dataSchema: EventReportsDataSchema, patchSchema: EventReportsPatchSchema },
    { path: 'apm/event-commitments', querySchema: EventCommitmentsQuerySchema, dataSchema: EventCommitmentsDataSchema, patchSchema: EventCommitmentsPatchSchema },
    { path: 'apm/polling-unit-agents', querySchema: PollingUnitAgentsQuerySchema, dataSchema: PollingUnitAgentsDataSchema, patchSchema: PollingUnitAgentsPatchSchema },
    { path: 'apm/agent-assignments', querySchema: AgentAssignmentsQuerySchema, dataSchema: AgentAssignmentsDataSchema, patchSchema: AgentAssignmentsPatchSchema },
    { path: 'apm/agent-training-records', querySchema: AgentTrainingRecordsQuerySchema, dataSchema: AgentTrainingRecordsDataSchema, patchSchema: AgentTrainingRecordsPatchSchema },
    { path: 'apm/agent-readiness-checklists', querySchema: AgentReadinessChecklistsQuerySchema, dataSchema: AgentReadinessChecklistsDataSchema, patchSchema: AgentReadinessChecklistsPatchSchema },
    { path: 'apm/election-day-reports', querySchema: ElectionDayReportsQuerySchema, dataSchema: ElectionDayReportsDataSchema, patchSchema: ElectionDayReportsPatchSchema },
    { path: 'apm/incidents', querySchema: IncidentsQuerySchema, dataSchema: IncidentsDataSchema, patchSchema: IncidentsPatchSchema, idempotent: true },
    { path: 'apm/escalations', querySchema: EscalationsQuerySchema, dataSchema: EscalationsDataSchema, patchSchema: EscalationsPatchSchema },
    { path: 'apm/election-results', querySchema: ElectionResultsQuerySchema, dataSchema: ElectionResultsDataSchema, patchSchema: ElectionResultsPatchSchema, idempotent: true },
    { path: 'apm/result-verifications', querySchema: ResultVerificationsQuerySchema, dataSchema: ResultVerificationsDataSchema, patchSchema: ResultVerificationsPatchSchema },
    { path: 'apm/result-reconciliations', querySchema: ResultReconciliationsQuerySchema, dataSchema: ResultReconciliationsDataSchema, patchSchema: ResultReconciliationsPatchSchema },
    { path: 'apm/media-files', querySchema: MediaFilesQuerySchema, dataSchema: MediaFilesDataSchema, patchSchema: MediaFilesPatchSchema },
    { path: 'apm/notifications', querySchema: NotificationsQuerySchema, dataSchema: NotificationsDataSchema, patchSchema: NotificationsPatchSchema },
    { path: 'apm/sync-operations', querySchema: SyncOperationsQuerySchema, dataSchema: SyncOperationsDataSchema, patchSchema: SyncOperationsPatchSchema },
    { path: 'apm/generated-reports', querySchema: GeneratedReportsQuerySchema, dataSchema: GeneratedReportsDataSchema, patchSchema: GeneratedReportsPatchSchema },
    { path: 'apm/dashboard-snapshots', querySchema: DashboardSnapshotsQuerySchema, dataSchema: DashboardSnapshotsDataSchema, patchSchema: DashboardSnapshotsPatchSchema },
    { path: 'apm/audit-logs', querySchema: AuditLogsQuerySchema, dataSchema: AuditLogsDataSchema, patchSchema: AuditLogsPatchSchema },
    { path: 'apm/data-exports', querySchema: DataExportsQuerySchema, dataSchema: DataExportsDataSchema, patchSchema: DataExportsPatchSchema },
    { path: 'apm/system-settings', querySchema: SystemSettingsQuerySchema, dataSchema: SystemSettingsDataSchema, patchSchema: SystemSettingsPatchSchema },
    { path: 'apm/states', querySchema: StatesQuerySchema, dataSchema: StatesDataSchema, patchSchema: StatesPatchSchema, publicRead: true },
    { path: 'apm/voter-contacts', querySchema: VoterContactsQuerySchema, dataSchema: VoterContactsDataSchema, patchSchema: VoterContactsPatchSchema },
  ];

  const CUSTOM_METHOD_PATHS = new Set([
    'apm/canvassing-reports',
    'apm/incidents',
    'apm/election-results',
  ]);

  const setCustomMethodStatus = async (context: any) => {
    if (context.params?.__customMethod) {
      context.http = { ...context.http, status: 200 };
    }
  };

  // ─── Auth service hooks (conditional auth based on method) ───
  const AUTH_METHODS_REQUIRING_AUTH = new Set([
    'setup2fa', 'enable2fa', 'disable2fa', 'getDevices',
    'addDevice', 'confirmDevice', 'removeDevice',
  ]);
  try {
    const authSvc = app.service('apm/auth');
    const conditionalAuth = async (context: any) => {
      const method = context.data?.method;
      if (method && AUTH_METHODS_REQUIRING_AUTH.has(method)) {
        if (context.data?.challengeToken) return context;
        return authenticate('jwt')(context);
      }
      return context;
    };
    authSvc.hooks({
      before: { create: [conditionalAuth] },
      after: { create: [writeAuditLog()] },
      error: { all: [writeAuditLog()] },
    });
  } catch { /* ignore if auth service not yet available */ }

  for (const svc of services) {
    const perms = derivePermissions(svc.path);
    const readAuth = svc.publicRead ? [] : svc.authenticatedRead ? [authenticate('jwt')] : [authenticate('jwt'), authorizePermission(...perms.read)];
    const writeAuth = [authenticate('jwt'), authorizePermission(...perms.write)];

    const userHooks = svc.path === 'apm/users'
      ? [hashPassword('password', { strategy: 'local' })]
      : [];

    const userAfterCreate = svc.path === 'apm/users'
      ? [syncUserRoleOnCreate]
      : [];

    const createHooks = svc.idempotent
      ? [...writeAuth, idempotency(), validateData(svc.dataSchema), ...userHooks, setServerFields()]
      : [...writeAuth, validateData(svc.dataSchema), ...userHooks, setServerFields()];

    const afterAll = CUSTOM_METHOD_PATHS.has(svc.path)
      ? [protectExternal(), setCustomMethodStatus, publishByScope(), writeAuditLog()]
      : [protectExternal(), publishByScope(), writeAuditLog()];

    const GEO_POPULATE_PATHS = new Set([
      'apm/senatorial-districts',
      'apm/lgas',
      'apm/wards',
      'apm/polling-units',
    ]);
    const geoPopulate = GEO_POPULATE_PATHS.has(svc.path)
      ? { find: [populateGeography()], get: [populateGeography()] }
      : {};

    const geoScoped = svc.path === 'apm/canvassing-reports' ||
      svc.path === 'apm/polling-unit-intelligence' ||
      svc.path === 'apm/incidents' ||
      svc.path === 'apm/election-results' ||
      svc.path === 'apm/result-verifications' ||
      svc.path === 'apm/result-reconciliations' ||
      svc.path === 'apm/stakeholders' ||
      svc.path === 'apm/stakeholder-engagements' ||
      svc.path === 'apm/wards' ||
      svc.path === 'apm/polling-units' ||
      svc.path === 'apm/volunteers' ||
      svc.path === 'apm/volunteer-activities' ||
      svc.path === 'apm/election-day-reports' ||
      svc.path === 'apm/polling-unit-agents';

    const findHooks = geoScoped
      ? [...readAuth, applyGeographyScope(), validateQuery(svc.querySchema), softDeleteFilter()]
      : [...readAuth, validateQuery(svc.querySchema), softDeleteFilter()];

    const getHooks = geoScoped
      ? [...readAuth, applyGeographyScope(), validateQuery(svc.querySchema), softDeleteFilter()]
      : [...readAuth, validateQuery(svc.querySchema), softDeleteFilter()];

    app.service(svc.path).hooks({
      before: {
        find: findHooks,
        get: getHooks,
        create: createHooks,
        patch: [...writeAuth, validateData(svc.patchSchema), setServerFields()],
        remove: [...writeAuth, softDeleteFilter()],
      },
      after: {
        all: afterAll,
        create: userAfterCreate,
        ...geoPopulate,
      },
      error: {
        all: [writeAuditLog()],
      },
    });
  }

  // ─── Role-assignment permission sync ─────────────────────────────
  // When a role assignment is created, patched, or removed, recompute
  // the affected user's effective permissions from their active roles.
  try {
    app.service('apm/role-assignments').hooks({
      after: {
        create: [syncRolePermissions],
        patch: [syncRolePermissions],
        remove: [syncRolePermissions],
      },
    });
  } catch { /* ignore if service not yet available */ }
}
