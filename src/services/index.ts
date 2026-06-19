import type { Application } from '@feathersjs/feathers';
import type { TSchema } from '@sinclair/typebox';
import swagger from 'feathers-swagger';
const { createSwaggerServiceOptions } = swagger;

import * as Users from './users/users.js';
import * as Roles from './roles/roles.js';
import * as Permissions from './permissions/permissions.js';
import * as RoleAssignments from './role-assignments/role-assignments.js';
import * as GeographyAssignments from './geography-assignments/geography-assignments.js';
import * as UserDevices from './user-devices/user-devices.js';
import * as UserSessions from './user-sessions/user-sessions.js';
import * as SenatorialDistricts from './senatorial-districts/senatorial-districts.js';
import * as Lgas from './lgas/lgas.js';
import * as Wards from './wards/wards.js';
import * as PollingUnits from './polling-units/polling-units.js';
import * as PollingUnitIntelligence from './polling-unit-intelligence/polling-unit-intelligence.js';
import * as PollingUnitIntelligenceHistory from './polling-unit-intelligence-history/polling-unit-intelligence-history.js';
import * as WardConversionAssessments from './ward-conversion-assessments/ward-conversion-assessments.js';
import * as Stakeholders from './stakeholders/stakeholders.js';
import * as StakeholderEngagements from './stakeholder-engagements/stakeholder-engagements.js';
import * as CanvassingReports from './canvassing-reports/canvassing-reports.js';
import * as Volunteers from './volunteers/volunteers.js';
import * as VolunteerAssignments from './volunteer-assignments/volunteer-assignments.js';
import * as VolunteerActivities from './volunteer-activities/volunteer-activities.js';
import * as Tasks from './tasks/tasks.js';
import * as ContentItems from './content-items/content-items.js';
import * as ContentApprovalEvents from './content-approval-events/content-approval-events.js';
import * as ContentDistributions from './content-distributions/content-distributions.js';
import * as WhatsappGroups from './whatsapp-groups/whatsapp-groups.js';
import * as RapidResponseIssues from './rapid-response-issues/rapid-response-issues.js';
import * as RapidResponseActions from './rapid-response-actions/rapid-response-actions.js';
import * as CandidateEvents from './candidate-events/candidate-events.js';
import * as EventParticipants from './event-participants/event-participants.js';
import * as EventReports from './event-reports/event-reports.js';
import * as EventCommitments from './event-commitments/event-commitments.js';
import * as PollingUnitAgents from './polling-unit-agents/polling-unit-agents.js';
import * as AgentAssignments from './agent-assignments/agent-assignments.js';
import * as AgentTrainingRecords from './agent-training-records/agent-training-records.js';
import * as AgentReadinessChecklists from './agent-readiness-checklists/agent-readiness-checklists.js';
import * as ElectionDayReports from './election-day-reports/election-day-reports.js';
import * as Incidents from './incidents/incidents.js';
import * as Escalations from './escalations/escalations.js';
import * as ElectionResults from './election-results/election-results.js';
import * as ResultVerifications from './result-verifications/result-verifications.js';
import * as ResultReconciliations from './result-reconciliations/result-reconciliations.js';
import * as MediaFiles from './media-files/media-files.js';
import * as Notifications from './notifications/notifications.js';
import * as SyncOperations from './sync-operations/sync-operations.js';
import * as GeneratedReports from './generated-reports/generated-reports.js';
import * as DashboardSnapshots from './dashboard-snapshots/dashboard-snapshots.js';
import * as AuditLogs from './audit-logs/audit-logs.js';
import * as DataExports from './data-exports/data-exports.js';
import * as SystemSettings from './system-settings/system-settings.js';

const STANDARD_METHODS = ['find', 'get', 'create', 'patch', 'remove'];
const CUSTOM_ELECTION_METHODS = [...STANDARD_METHODS, 'verifyResult', 'rejectResult', 'getDashboard', 'reconcile'];
const CUSTOM_INCIDENT_METHODS = [...STANDARD_METHODS, 'escalate', 'getSummary'];
const CUSTOM_CANVASSING_METHODS = [...STANDARD_METHODS, 'getSummary', 'getLgaStats'];

type SchemaGroup = { result: TSchema; data: TSchema; patch: TSchema; query: TSchema };

function swaggerDocs(name: string, s: SchemaGroup, description: string) {
  return createSwaggerServiceOptions({
    schemas: {
      [`${name}ResultSchema`]: s.result,
      [`${name}DataSchema`]: s.data,
      [`${name}PatchSchema`]: s.patch,
      [`${name}QuerySchema`]: s.query,
    },
    docs: { description, securities: ['find', 'get', 'create', 'patch', 'remove'] },
  });
}

export function registerServices(app: Application) {
  app.use('/apm/users', new Users.UsersService(Users.getOptions(app)), {
    docs: swaggerDocs('users', { result: Users.UsersResultSchema, data: Users.UsersDataSchema, patch: Users.UsersPatchSchema, query: Users.UsersQuerySchema }, 'User management'),
  });
  app.use('/apm/roles', new Roles.RolesService(Roles.getOptions(app)), {
    docs: swaggerDocs('roles', { result: Roles.RolesResultSchema, data: Roles.RolesDataSchema, patch: Roles.RolesPatchSchema, query: Roles.RolesQuerySchema }, 'Role management'),
  });
  app.use('/apm/permissions', new Permissions.PermissionsService(Permissions.getOptions(app)), {
    docs: swaggerDocs('permissions', { result: Permissions.PermissionsResultSchema, data: Permissions.PermissionsDataSchema, patch: Permissions.PermissionsPatchSchema, query: Permissions.PermissionsQuerySchema }, 'Permission definitions'),
  });
  app.use('/apm/role-assignments', new RoleAssignments.RoleAssignmentsService(RoleAssignments.getOptions(app)), {
    docs: swaggerDocs('role-assignments', { result: RoleAssignments.RoleAssignmentsResultSchema, data: RoleAssignments.RoleAssignmentsDataSchema, patch: RoleAssignments.RoleAssignmentsPatchSchema, query: RoleAssignments.RoleAssignmentsQuerySchema }, 'User-to-role assignments'),
  });
  app.use('/apm/geography-assignments', new GeographyAssignments.GeographyAssignmentsService(GeographyAssignments.getOptions(app)), {
    docs: swaggerDocs('geography-assignments', { result: GeographyAssignments.GeographyAssignmentsResultSchema, data: GeographyAssignments.GeographyAssignmentsDataSchema, patch: GeographyAssignments.GeographyAssignmentsPatchSchema, query: GeographyAssignments.GeographyAssignmentsQuerySchema }, 'Geography-to-user assignments'),
  });
  app.use('/apm/user-devices', new UserDevices.UserDevicesService(UserDevices.getOptions(app)), {
    docs: swaggerDocs('user-devices', { result: UserDevices.UserDevicesResultSchema, data: UserDevices.UserDevicesDataSchema, patch: UserDevices.UserDevicesPatchSchema, query: UserDevices.UserDevicesQuerySchema }, 'Registered user devices'),
  });
  app.use('/apm/user-sessions', new UserSessions.UserSessionsService(UserSessions.getOptions(app)), {
    docs: swaggerDocs('user-sessions', { result: UserSessions.UserSessionsResultSchema, data: UserSessions.UserSessionsDataSchema, patch: UserSessions.UserSessionsPatchSchema, query: UserSessions.UserSessionsQuerySchema }, 'User authentication sessions'),
  });
  app.use('/apm/senatorial-districts', new SenatorialDistricts.SenatorialDistrictsService(SenatorialDistricts.getOptions(app)), {
    docs: swaggerDocs('senatorial-districts', { result: SenatorialDistricts.SenatorialDistrictsResultSchema, data: SenatorialDistricts.SenatorialDistrictsDataSchema, patch: SenatorialDistricts.SenatorialDistrictsPatchSchema, query: SenatorialDistricts.SenatorialDistrictsQuerySchema }, 'Senatorial district boundaries'),
  });
  app.use('/apm/lgas', new Lgas.LgasService(Lgas.getOptions(app)), {
    docs: swaggerDocs('lgas', { result: Lgas.LgasResultSchema, data: Lgas.LgasDataSchema, patch: Lgas.LgasPatchSchema, query: Lgas.LgasQuerySchema }, 'Local government areas'),
  });
  app.use('/apm/wards', new Wards.WardsService(Wards.getOptions(app)), {
    docs: swaggerDocs('wards', { result: Wards.WardsResultSchema, data: Wards.WardsDataSchema, patch: Wards.WardsPatchSchema, query: Wards.WardsQuerySchema }, 'Ward boundaries'),
  });
  app.use('/apm/polling-units', new PollingUnits.PollingUnitsService(PollingUnits.getOptions(app)), {
    docs: swaggerDocs('polling-units', { result: PollingUnits.PollingUnitsResultSchema, data: PollingUnits.PollingUnitsDataSchema, patch: PollingUnits.PollingUnitsPatchSchema, query: PollingUnits.PollingUnitsQuerySchema }, 'Polling unit locations'),
  });
  app.use('/apm/polling-unit-intelligence', new PollingUnitIntelligence.PollingUnitIntelligenceService(PollingUnitIntelligence.getOptions(app)), {
    docs: swaggerDocs('polling-unit-intelligence', { result: PollingUnitIntelligence.PollingUnitIntelligenceResultSchema, data: PollingUnitIntelligence.PollingUnitIntelligenceDataSchema, patch: PollingUnitIntelligence.PollingUnitIntelligencePatchSchema, query: PollingUnitIntelligence.PollingUnitIntelligenceQuerySchema }, 'Field intelligence reports per polling unit'),
  });
  app.use('/apm/polling-unit-intelligence-history', new PollingUnitIntelligenceHistory.PollingUnitIntelligenceHistoryService(PollingUnitIntelligenceHistory.getOptions(app)), {
    docs: swaggerDocs('polling-unit-intelligence-history', { result: PollingUnitIntelligenceHistory.PollingUnitIntelligenceHistoryResultSchema, data: PollingUnitIntelligenceHistory.PollingUnitIntelligenceHistoryDataSchema, patch: PollingUnitIntelligenceHistory.PollingUnitIntelligenceHistoryPatchSchema, query: PollingUnitIntelligenceHistory.PollingUnitIntelligenceHistoryQuerySchema }, 'Historical intelligence records'),
  });
  app.use('/apm/ward-conversion-assessments', new WardConversionAssessments.WardConversionAssessmentsService(WardConversionAssessments.getOptions(app)), {
    docs: swaggerDocs('ward-conversion-assessments', { result: WardConversionAssessments.WardConversionAssessmentsResultSchema, data: WardConversionAssessments.WardConversionAssessmentsDataSchema, patch: WardConversionAssessments.WardConversionAssessmentsPatchSchema, query: WardConversionAssessments.WardConversionAssessmentsQuerySchema }, 'Ward-level voter conversion assessments'),
  });
  app.use('/apm/stakeholders', new Stakeholders.StakeholdersService(Stakeholders.getOptions(app)), {
    docs: swaggerDocs('stakeholders', { result: Stakeholders.StakeholdersResultSchema, data: Stakeholders.StakeholdersDataSchema, patch: Stakeholders.StakeholdersPatchSchema, query: Stakeholders.StakeholdersQuerySchema }, 'Community stakeholder profiles'),
  });
  app.use('/apm/stakeholder-engagements', new StakeholderEngagements.StakeholderEngagementsService(StakeholderEngagements.getOptions(app)), {
    docs: swaggerDocs('stakeholder-engagements', { result: StakeholderEngagements.StakeholderEngagementsResultSchema, data: StakeholderEngagements.StakeholderEngagementsDataSchema, patch: StakeholderEngagements.StakeholderEngagementsPatchSchema, query: StakeholderEngagements.StakeholderEngagementsQuerySchema }, 'Stakeholder engagement records'),
  });
  app.use('/apm/canvassing-reports', new CanvassingReports.CanvassingReportsService(CanvassingReports.getOptions(app)), {
    methods: CUSTOM_CANVASSING_METHODS,
    docs: swaggerDocs('canvassing-reports', { result: CanvassingReports.CanvassingReportsResultSchema, data: CanvassingReports.CanvassingReportsDataSchema, patch: CanvassingReports.CanvassingReportsPatchSchema, query: CanvassingReports.CanvassingReportsQuerySchema }, 'Door-to-door canvassing reports'),
  });
  const canvassingReportsSvc = app.service('apm/canvassing-reports');
  app.routes.insert('/apm/canvassing-reports/getSummary', { service: canvassingReportsSvc, params: { __method: 'getSummary' } });
  app.routes.insert('/apm/canvassing-reports/getLgaStats', { service: canvassingReportsSvc, params: { __method: 'getLgaStats' } });
  app.use('/apm/volunteers', new Volunteers.VolunteersService(Volunteers.getOptions(app)), {
    docs: swaggerDocs('volunteers', { result: Volunteers.VolunteersResultSchema, data: Volunteers.VolunteersDataSchema, patch: Volunteers.VolunteersPatchSchema, query: Volunteers.VolunteersQuerySchema }, 'Volunteer profiles'),
  });
  app.use('/apm/volunteer-assignments', new VolunteerAssignments.VolunteerAssignmentsService(VolunteerAssignments.getOptions(app)), {
    docs: swaggerDocs('volunteer-assignments', { result: VolunteerAssignments.VolunteerAssignmentsResultSchema, data: VolunteerAssignments.VolunteerAssignmentsDataSchema, patch: VolunteerAssignments.VolunteerAssignmentsPatchSchema, query: VolunteerAssignments.VolunteerAssignmentsQuerySchema }, 'Volunteer task assignments'),
  });
  app.use('/apm/volunteer-activities', new VolunteerActivities.VolunteerActivitiesService(VolunteerActivities.getOptions(app)), {
    docs: swaggerDocs('volunteer-activities', { result: VolunteerActivities.VolunteerActivitiesResultSchema, data: VolunteerActivities.VolunteerActivitiesDataSchema, patch: VolunteerActivities.VolunteerActivitiesPatchSchema, query: VolunteerActivities.VolunteerActivitiesQuerySchema }, 'Volunteer activity logs'),
  });
  app.use('/apm/tasks', new Tasks.TasksService(Tasks.getOptions(app)), {
    docs: swaggerDocs('tasks', { result: Tasks.TasksResultSchema, data: Tasks.TasksDataSchema, patch: Tasks.TasksPatchSchema, query: Tasks.TasksQuerySchema }, 'Campaign tasks'),
  });
  app.use('/apm/content-items', new ContentItems.ContentItemsService(ContentItems.getOptions(app)), {
    docs: swaggerDocs('content-items', { result: ContentItems.ContentItemsResultSchema, data: ContentItems.ContentItemsDataSchema, patch: ContentItems.ContentItemsPatchSchema, query: ContentItems.ContentItemsQuerySchema }, 'Campaign content items'),
  });
  app.use('/apm/content-approval-events', new ContentApprovalEvents.ContentApprovalEventsService(ContentApprovalEvents.getOptions(app)), {
    docs: swaggerDocs('content-approval-events', { result: ContentApprovalEvents.ContentApprovalEventsResultSchema, data: ContentApprovalEvents.ContentApprovalEventsDataSchema, patch: ContentApprovalEvents.ContentApprovalEventsPatchSchema, query: ContentApprovalEvents.ContentApprovalEventsQuerySchema }, 'Content approval workflow events'),
  });
  app.use('/apm/content-distributions', new ContentDistributions.ContentDistributionsService(ContentDistributions.getOptions(app)), {
    docs: swaggerDocs('content-distributions', { result: ContentDistributions.ContentDistributionsResultSchema, data: ContentDistributions.ContentDistributionsDataSchema, patch: ContentDistributions.ContentDistributionsPatchSchema, query: ContentDistributions.ContentDistributionsQuerySchema }, 'Content distribution records'),
  });
  app.use('/apm/whatsapp-groups', new WhatsappGroups.WhatsappGroupsService(WhatsappGroups.getOptions(app)), {
    docs: swaggerDocs('whatsapp-groups', { result: WhatsappGroups.WhatsappGroupsResultSchema, data: WhatsappGroups.WhatsappGroupsDataSchema, patch: WhatsappGroups.WhatsappGroupsPatchSchema, query: WhatsappGroups.WhatsappGroupsQuerySchema }, 'WhatsApp group management'),
  });
  app.use('/apm/rapid-response-issues', new RapidResponseIssues.RapidResponseIssuesService(RapidResponseIssues.getOptions(app)), {
    docs: swaggerDocs('rapid-response-issues', { result: RapidResponseIssues.RapidResponseIssuesResultSchema, data: RapidResponseIssues.RapidResponseIssuesDataSchema, patch: RapidResponseIssues.RapidResponseIssuesPatchSchema, query: RapidResponseIssues.RapidResponseIssuesQuerySchema }, 'Rapid response issues'),
  });
  app.use('/apm/rapid-response-actions', new RapidResponseActions.RapidResponseActionsService(RapidResponseActions.getOptions(app)), {
    docs: swaggerDocs('rapid-response-actions', { result: RapidResponseActions.RapidResponseActionsResultSchema, data: RapidResponseActions.RapidResponseActionsDataSchema, patch: RapidResponseActions.RapidResponseActionsPatchSchema, query: RapidResponseActions.RapidResponseActionsQuerySchema }, 'Rapid response actions'),
  });
  app.use('/apm/candidate-events', new CandidateEvents.CandidateEventsService(CandidateEvents.getOptions(app)), {
    docs: swaggerDocs('candidate-events', { result: CandidateEvents.CandidateEventsResultSchema, data: CandidateEvents.CandidateEventsDataSchema, patch: CandidateEvents.CandidateEventsPatchSchema, query: CandidateEvents.CandidateEventsQuerySchema }, 'Candidate campaign events'),
  });
  app.use('/apm/event-participants', new EventParticipants.EventParticipantsService(EventParticipants.getOptions(app)), {
    docs: swaggerDocs('event-participants', { result: EventParticipants.EventParticipantsResultSchema, data: EventParticipants.EventParticipantsDataSchema, patch: EventParticipants.EventParticipantsPatchSchema, query: EventParticipants.EventParticipantsQuerySchema }, 'Event participant registrations'),
  });
  app.use('/apm/event-reports', new EventReports.EventReportsService(EventReports.getOptions(app)), {
    docs: swaggerDocs('event-reports', { result: EventReports.EventReportsResultSchema, data: EventReports.EventReportsDataSchema, patch: EventReports.EventReportsPatchSchema, query: EventReports.EventReportsQuerySchema }, 'Post-event reports'),
  });
  app.use('/apm/event-commitments', new EventCommitments.EventCommitmentsService(EventCommitments.getOptions(app)), {
    docs: swaggerDocs('event-commitments', { result: EventCommitments.EventCommitmentsResultSchema, data: EventCommitments.EventCommitmentsDataSchema, patch: EventCommitments.EventCommitmentsPatchSchema, query: EventCommitments.EventCommitmentsQuerySchema }, 'Commitments made at events'),
  });
  app.use('/apm/polling-unit-agents', new PollingUnitAgents.PollingUnitAgentsService(PollingUnitAgents.getOptions(app)), {
    docs: swaggerDocs('polling-unit-agents', { result: PollingUnitAgents.PollingUnitAgentsResultSchema, data: PollingUnitAgents.PollingUnitAgentsDataSchema, patch: PollingUnitAgents.PollingUnitAgentsPatchSchema, query: PollingUnitAgents.PollingUnitAgentsQuerySchema }, 'Polling unit agent profiles'),
  });
  app.use('/apm/agent-assignments', new AgentAssignments.AgentAssignmentsService(AgentAssignments.getOptions(app)), {
    docs: swaggerDocs('agent-assignments', { result: AgentAssignments.AgentAssignmentsResultSchema, data: AgentAssignments.AgentAssignmentsDataSchema, patch: AgentAssignments.AgentAssignmentsPatchSchema, query: AgentAssignments.AgentAssignmentsQuerySchema }, 'Agent-to-polling-unit assignments'),
  });
  app.use('/apm/agent-training-records', new AgentTrainingRecords.AgentTrainingRecordsService(AgentTrainingRecords.getOptions(app)), {
    docs: swaggerDocs('agent-training-records', { result: AgentTrainingRecords.AgentTrainingRecordsResultSchema, data: AgentTrainingRecords.AgentTrainingRecordsDataSchema, patch: AgentTrainingRecords.AgentTrainingRecordsPatchSchema, query: AgentTrainingRecords.AgentTrainingRecordsQuerySchema }, 'Agent training records'),
  });
  app.use('/apm/agent-readiness-checklists', new AgentReadinessChecklists.AgentReadinessChecklistsService(AgentReadinessChecklists.getOptions(app)), {
    docs: swaggerDocs('agent-readiness-checklists', { result: AgentReadinessChecklists.AgentReadinessChecklistsResultSchema, data: AgentReadinessChecklists.AgentReadinessChecklistsDataSchema, patch: AgentReadinessChecklists.AgentReadinessChecklistsPatchSchema, query: AgentReadinessChecklists.AgentReadinessChecklistsQuerySchema }, 'Agent election readiness checklists'),
  });
  app.use('/apm/election-day-reports', new ElectionDayReports.ElectionDayReportsService(ElectionDayReports.getOptions(app)), {
    docs: swaggerDocs('election-day-reports', { result: ElectionDayReports.ElectionDayReportsResultSchema, data: ElectionDayReports.ElectionDayReportsDataSchema, patch: ElectionDayReports.ElectionDayReportsPatchSchema, query: ElectionDayReports.ElectionDayReportsQuerySchema }, 'Election day reports from polling units'),
  });
  app.use('/apm/incidents', new Incidents.IncidentsService(Incidents.getOptions(app)), {
    methods: CUSTOM_INCIDENT_METHODS,
    docs: swaggerDocs('incidents', { result: Incidents.IncidentsResultSchema, data: Incidents.IncidentsDataSchema, patch: Incidents.IncidentsPatchSchema, query: Incidents.IncidentsQuerySchema }, 'Election incident reports'),
  });
  const incidentsSvc = app.service('apm/incidents');
  app.routes.insert('/apm/incidents/:id/escalate', { service: incidentsSvc, params: { __method: 'escalate' } });
  app.routes.insert('/apm/incidents/getSummary', { service: incidentsSvc, params: { __method: 'getSummary' } });
  app.use('/apm/escalations', new Escalations.EscalationsService(Escalations.getOptions(app)), {
    docs: swaggerDocs('escalations', { result: Escalations.EscalationsResultSchema, data: Escalations.EscalationsDataSchema, patch: Escalations.EscalationsPatchSchema, query: Escalations.EscalationsQuerySchema }, 'Incident escalation records'),
  });
  app.use('/apm/election-results', new ElectionResults.ElectionResultsService(ElectionResults.getOptions(app)), {
    methods: CUSTOM_ELECTION_METHODS,
    docs: swaggerDocs('election-results', { result: ElectionResults.ElectionResultsResultSchema, data: ElectionResults.ElectionResultsDataSchema, patch: ElectionResults.ElectionResultsPatchSchema, query: ElectionResults.ElectionResultsQuerySchema }, 'Election result submissions'),
  });
  const electionResultsSvc = app.service('apm/election-results');
  app.routes.insert('/apm/election-results/:id/verifyResult', { service: electionResultsSvc, params: { __method: 'verifyResult' } });
  app.routes.insert('/apm/election-results/:id/rejectResult', { service: electionResultsSvc, params: { __method: 'rejectResult' } });
  app.routes.insert('/apm/election-results/getDashboard', { service: electionResultsSvc, params: { __method: 'getDashboard' } });
  app.routes.insert('/apm/election-results/:id/reconcile', { service: electionResultsSvc, params: { __method: 'reconcile' } });
  app.routes.insert('/apm/election-results/reconcile', { service: electionResultsSvc, params: { __method: 'reconcile' } });
  app.use('/apm/result-verifications', new ResultVerifications.ResultVerificationsService(ResultVerifications.getOptions(app)), {
    docs: swaggerDocs('result-verifications', { result: ResultVerifications.ResultVerificationsResultSchema, data: ResultVerifications.ResultVerificationsDataSchema, patch: ResultVerifications.ResultVerificationsPatchSchema, query: ResultVerifications.ResultVerificationsQuerySchema }, 'Result verification records'),
  });
  app.use('/apm/result-reconciliations', new ResultReconciliations.ResultReconciliationsService(ResultReconciliations.getOptions(app)), {
    docs: swaggerDocs('result-reconciliations', { result: ResultReconciliations.ResultReconciliationsResultSchema, data: ResultReconciliations.ResultReconciliationsDataSchema, patch: ResultReconciliations.ResultReconciliationsPatchSchema, query: ResultReconciliations.ResultReconciliationsQuerySchema }, 'Result reconciliation records'),
  });
  app.use('/apm/media-files', new MediaFiles.MediaFilesService(MediaFiles.getOptions(app)), {
    docs: swaggerDocs('media-files', { result: MediaFiles.MediaFilesResultSchema, data: MediaFiles.MediaFilesDataSchema, patch: MediaFiles.MediaFilesPatchSchema, query: MediaFiles.MediaFilesQuerySchema }, 'Media file metadata'),
  });
  app.use('/apm/notifications', new Notifications.NotificationsService(Notifications.getOptions(app)), {
    docs: swaggerDocs('notifications', { result: Notifications.NotificationsResultSchema, data: Notifications.NotificationsDataSchema, patch: Notifications.NotificationsPatchSchema, query: Notifications.NotificationsQuerySchema }, 'Notification records'),
  });
  app.use('/apm/sync-operations', new SyncOperations.SyncOperationsService(SyncOperations.getOptions(app)), {
    docs: swaggerDocs('sync-operations', { result: SyncOperations.SyncOperationsResultSchema, data: SyncOperations.SyncOperationsDataSchema, patch: SyncOperations.SyncOperationsPatchSchema, query: SyncOperations.SyncOperationsQuerySchema }, 'Offline sync operations'),
  });
  app.use('/apm/generated-reports', new GeneratedReports.GeneratedReportsService(GeneratedReports.getOptions(app)), {
    docs: swaggerDocs('generated-reports', { result: GeneratedReports.GeneratedReportsResultSchema, data: GeneratedReports.GeneratedReportsDataSchema, patch: GeneratedReports.GeneratedReportsPatchSchema, query: GeneratedReports.GeneratedReportsQuerySchema }, 'Generated campaign reports'),
  });
  app.use('/apm/dashboard-snapshots', new DashboardSnapshots.DashboardSnapshotsService(DashboardSnapshots.getOptions(app)), {
    docs: swaggerDocs('dashboard-snapshots', { result: DashboardSnapshots.DashboardSnapshotsResultSchema, data: DashboardSnapshots.DashboardSnapshotsDataSchema, patch: DashboardSnapshots.DashboardSnapshotsPatchSchema, query: DashboardSnapshots.DashboardSnapshotsQuerySchema }, 'Dashboard metric snapshots'),
  });
  app.use('/apm/audit-logs', new AuditLogs.AuditLogsService(AuditLogs.getOptions(app)), {
    docs: swaggerDocs('audit-logs', { result: AuditLogs.AuditLogsResultSchema, data: AuditLogs.AuditLogsDataSchema, patch: AuditLogs.AuditLogsPatchSchema, query: AuditLogs.AuditLogsQuerySchema }, 'Audit log entries'),
  });
  app.use('/apm/data-exports', new DataExports.DataExportsService(DataExports.getOptions(app)), {
    docs: swaggerDocs('data-exports', { result: DataExports.DataExportsResultSchema, data: DataExports.DataExportsDataSchema, patch: DataExports.DataExportsPatchSchema, query: DataExports.DataExportsQuerySchema }, 'Data export records'),
  });
  app.use('/apm/system-settings', new SystemSettings.SystemSettingsService(SystemSettings.getOptions(app)), {
    docs: swaggerDocs('system-settings', { result: SystemSettings.SystemSettingsResultSchema, data: SystemSettings.SystemSettingsDataSchema, patch: SystemSettings.SystemSettingsPatchSchema, query: SystemSettings.SystemSettingsQuerySchema }, 'System configuration settings'),
  });
}
