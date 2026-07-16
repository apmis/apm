import type { Application } from '@feathersjs/feathers';
import feathersSwagger from 'feathers-swagger';
const { createSwaggerServiceOptions } = feathersSwagger as any;
import type { TSchema } from '@sinclair/typebox';
import { AuthService } from './auth/auth.js';
import { UsersService, getOptions as UsersOptions } from './users/users.js';
import { RolesService, getOptions as RolesOptions } from './roles/roles.js';
import { PermissionsService, getOptions as PermissionsOptions } from './permissions/permissions.js';
import { RoleAssignmentsService, getOptions as RoleAssignmentsOptions } from './role-assignments/role-assignments.js';
import { GeographyAssignmentsService, getOptions as GeographyAssignmentsOptions } from './geography-assignments/geography-assignments.js';
import { UserDevicesService, getOptions as UserDevicesOptions } from './user-devices/user-devices.js';
import { UserSessionsService, getOptions as UserSessionsOptions } from './user-sessions/user-sessions.js';
import { StatesService, getOptions as StatesOptions } from './states/states.js';
import { SenatorialDistrictsService, getOptions as SenatorialDistrictsOptions } from './senatorial-districts/senatorial-districts.js';
import { LgasService, getOptions as LgasOptions } from './lgas/lgas.js';
import { WardsService, getOptions as WardsOptions } from './wards/wards.js';
import { PollingUnitsService, getOptions as PollingUnitsOptions } from './polling-units/polling-units.js';
import { PollingUnitIntelligenceService, getOptions as PollingUnitIntelligenceOptions } from './polling-unit-intelligence/polling-unit-intelligence.js';
import { PollingUnitIntelligenceHistoryService, getOptions as PollingUnitIntelligenceHistoryOptions } from './polling-unit-intelligence-history/polling-unit-intelligence-history.js';
import { WardConversionAssessmentsService, getOptions as WardConversionAssessmentsOptions } from './ward-conversion-assessments/ward-conversion-assessments.js';
import { StakeholdersService, getOptions as StakeholdersOptions } from './stakeholders/stakeholders.js';
import { StakeholderEngagementsService, getOptions as StakeholderEngagementsOptions } from './stakeholder-engagements/stakeholder-engagements.js';
import { CanvassingReportsService, getOptions as CanvassingReportsOptions } from './canvassing-reports/canvassing-reports.js';
import { VoterContactsService, getOptions as VoterContactsOptions } from './voter-contacts/voter-contacts.js';
import { VolunteersService, getOptions as VolunteersOptions } from './volunteers/volunteers.js';
import { VolunteerAssignmentsService, getOptions as VolunteerAssignmentsOptions } from './volunteer-assignments/volunteer-assignments.js';
import { VolunteerActivitiesService, getOptions as VolunteerActivitiesOptions } from './volunteer-activities/volunteer-activities.js';
import { TasksService, getOptions as TasksOptions } from './tasks/tasks.js';
import { ContentItemsService, getOptions as ContentItemsOptions } from './content-items/content-items.js';
import { ContentApprovalEventsService, getOptions as ContentApprovalEventsOptions } from './content-approval-events/content-approval-events.js';
import { ContentDistributionsService, getOptions as ContentDistributionsOptions } from './content-distributions/content-distributions.js';
import { WhatsappGroupsService, getOptions as WhatsappGroupsOptions } from './whatsapp-groups/whatsapp-groups.js';
import { RapidResponseIssuesService, getOptions as RapidResponseIssuesOptions } from './rapid-response-issues/rapid-response-issues.js';
import { RapidResponseActionsService, getOptions as RapidResponseActionsOptions } from './rapid-response-actions/rapid-response-actions.js';
import { CandidateEventsService, getOptions as CandidateEventsOptions } from './candidate-events/candidate-events.js';
import { EventParticipantsService, getOptions as EventParticipantsOptions } from './event-participants/event-participants.js';
import { EventReportsService, getOptions as EventReportsOptions } from './event-reports/event-reports.js';
import { EventCommitmentsService, getOptions as EventCommitmentsOptions } from './event-commitments/event-commitments.js';
import { PollingUnitAgentsService, getOptions as PollingUnitAgentsOptions } from './polling-unit-agents/polling-unit-agents.js';
import { AgentAssignmentsService, getOptions as AgentAssignmentsOptions } from './agent-assignments/agent-assignments.js';
import { LocalIssuesService, getOptions as LocalIssuesOptions } from './local-issues/local-issues.js';
import { InfluencersService, getOptions as InfluencersOptions } from './influencers/influencers.js';
import { CoordinatorsService, getOptions as CoordinatorsOptions } from './coordinators/coordinators.js';
import { AgentTrainingRecordsService, getOptions as AgentTrainingRecordsOptions } from './agent-training-records/agent-training-records.js';
import { AgentReadinessChecklistsService, getOptions as AgentReadinessChecklistsOptions } from './agent-readiness-checklists/agent-readiness-checklists.js';
import { ElectionDayReportsService, getOptions as ElectionDayReportsOptions } from './election-day-reports/election-day-reports.js';
import { IncidentsService, getOptions as IncidentsOptions } from './incidents/incidents.js';
import { EscalationsService, getOptions as EscalationsOptions } from './escalations/escalations.js';
import { ElectionResultsService, getOptions as ElectionResultsOptions } from './election-results/election-results.js';
import { ResultVerificationsService, getOptions as ResultVerificationsOptions } from './result-verifications/result-verifications.js';
import { ResultReconciliationsService, getOptions as ResultReconciliationsOptions } from './result-reconciliations/result-reconciliations.js';
import { MediaFilesService, getOptions as MediaFilesOptions } from './media-files/media-files.js';
import { NotificationsService, getOptions as NotificationsOptions } from './notifications/notifications.js';
import { SyncOperationsService, getOptions as SyncOperationsOptions } from './sync-operations/sync-operations.js';
import { GeneratedReportsService, getOptions as GeneratedReportsOptions } from './generated-reports/generated-reports.js';
import { DashboardSnapshotsService, getOptions as DashboardSnapshotsOptions } from './dashboard-snapshots/dashboard-snapshots.js';
import { AuditLogsService, getOptions as AuditLogsOptions } from './audit-logs/audit-logs.js';
import { DataExportsService, getOptions as DataExportsOptions } from './data-exports/data-exports.js';
import { SystemSettingsService, getOptions as SystemSettingsOptions } from './system-settings/system-settings.js';
import { NavMenusService, getOptions as NavMenusOptions } from './nav-menus/nav-menus.js';

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
import * as NavMenus from './nav-menus/nav-menus.js';
import * as States from './states/states.js';
import * as VoterContacts from './voter-contacts/voter-contacts.js';
import * as Auth from './auth/auth.js';

const STANDARD_METHODS = ['find', 'get', 'create', 'patch', 'remove'];
const CUSTOM_ELECTION_METHODS = [...STANDARD_METHODS, 'verifyResult', 'rejectResult', 'getDashboard', 'reconcile'];
const CUSTOM_INCIDENT_METHODS = [...STANDARD_METHODS, 'escalate', 'getSummary'];
const CUSTOM_CANVASSING_METHODS = [...STANDARD_METHODS, 'getSummary', 'getLgaStats'];

type SchemaGroup = { result: TSchema; data: TSchema; patch: TSchema; query: TSchema };

function generateExample(schema: any, depth = 0): any {
  if (depth > 4 || !schema) return null;
  if (schema.example !== undefined) return schema.example;
  if (schema.enum?.length) return schema.enum[0];
  if (schema.const !== undefined) return schema.const;
  if (schema.default !== undefined) return schema.default;

  if (schema.anyOf?.length) {
    for (const variant of schema.anyOf) {
      const v = generateExample(variant, depth + 1);
      if (v !== null) return v;
    }
    return null;
  }
  if (schema.oneOf?.length) {
    for (const variant of schema.oneOf) {
      const v = generateExample(variant, depth + 1);
      if (v !== null) return v;
    }
    return null;
  }
  if (schema.allOf?.length) {
    const merged: any = {};
    for (const sub of schema.allOf) {
      const v = generateExample(sub, depth + 1);
      if (typeof v === 'object' && v !== null) Object.assign(merged, v);
    }
    return Object.keys(merged).length ? merged : null;
  }
  if (schema.$ref) return null;
  if (schema.type === 'string') {
    if (schema.format === 'date-time') return '2026-03-18T10:30:00.000Z';
    if (schema.format === 'email') return 'user@example.com';
    if (schema.format === 'uri') return 'https://example.com/file.pdf';
    if (schema.format === 'uuid') return '550e8400-e29b-41d4-a716-446655440000';
    if (schema.pattern === '^[a-fA-F0-9]{24}$') return '507f1f77bcf86cd799439011';
    return schema.minLength && schema.minLength > 0 ? 'a'.repeat(schema.minLength) : 'example';
  }
  if (schema.type === 'integer') return 0;
  if (schema.type === 'number') return 0.0;
  if (schema.type === 'boolean') return false;
  if (schema.type === 'array') {
    if (!schema.items) return [];
    const item = generateExample(schema.items, depth + 1);
    return item !== null ? [item] : [];
  }
  if (schema.type === 'object' && schema.properties) {
    const result: any = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      result[key] = generateExample(prop as any, depth + 1);
    }
    return result;
  }
  return null;
}

function addExamples(schema: any): any {
  if (!schema || schema.example) return schema;
  const example = generateExample(schema);
  if (example !== null) {
    return { ...schema, example };
  }
  return schema;
}

function toTag(name: string): string {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function swaggerDocs(name: string, s: SchemaGroup, description: string) {
  const opts = createSwaggerServiceOptions({
    schemas: {
      [`${name}Schema`]: s.result,
      [`${name}DataSchema`]: s.data,
      [`${name}PatchSchema`]: s.patch,
      [`${name}QuerySchema`]: s.query,
    },
    docs: { description, tag: toTag(name), securities: ['find', 'get', 'create', 'patch', 'remove'] },
  });
  if (opts.schemas) {
    for (const key of Object.keys(opts.schemas)) {
      opts.schemas[key] = addExamples(opts.schemas[key]);
    }
  }
  return opts;
}

export function registerServices(app: Application) {
  app.use('/apm/auth', new AuthService(app));
  app.use('/apm/users', new UsersService(UsersOptions(app)), { methods: ['find', 'get', 'create', 'update', 'patch', 'remove', 'setupPermissions'] });
  app.routes.insert('/apm/users/:__id/setupPermissions', { service: app.service('apm/users'), params: {} });
  app.use('/apm/roles', new RolesService(RolesOptions(app)));
  app.use('/apm/permissions', new PermissionsService(PermissionsOptions(app)));
  app.use('/apm/role-assignments', new RoleAssignmentsService(RoleAssignmentsOptions(app)));
  app.use('/apm/geography-assignments', new GeographyAssignmentsService(GeographyAssignmentsOptions(app)));
  app.use('/apm/user-devices', new UserDevicesService(UserDevicesOptions(app)));
  app.use('/apm/user-sessions', new UserSessionsService(UserSessionsOptions(app)));
  app.use('/apm/states', new StatesService(StatesOptions(app)));
  app.use('/apm/senatorial-districts', new SenatorialDistrictsService(SenatorialDistrictsOptions(app)));
  app.use('/apm/lgas', new LgasService(LgasOptions(app)));
  app.use('/apm/wards', new WardsService(WardsOptions(app)));
  app.use('/apm/polling-units', new PollingUnitsService(PollingUnitsOptions(app)));
  app.use('/apm/polling-unit-intelligence', new PollingUnitIntelligenceService(PollingUnitIntelligenceOptions(app)));
  app.use('/apm/polling-unit-intelligence-history', new PollingUnitIntelligenceHistoryService(PollingUnitIntelligenceHistoryOptions(app)));
  app.use('/apm/ward-conversion-assessments', new WardConversionAssessmentsService(WardConversionAssessmentsOptions(app)));
  app.use('/apm/stakeholders', new StakeholdersService(StakeholdersOptions(app)));
  app.use('/apm/stakeholder-engagements', new StakeholderEngagementsService(StakeholderEngagementsOptions(app)));
  app.use('/apm/canvassing-reports', new CanvassingReportsService(CanvassingReportsOptions(app)));
  app.use('/apm/voter-contacts', new VoterContactsService(VoterContactsOptions(app)));
  app.use('/apm/volunteers', new VolunteersService(VolunteersOptions(app)));
  app.use('/apm/volunteer-assignments', new VolunteerAssignmentsService(VolunteerAssignmentsOptions(app)));
  app.use('/apm/volunteer-activities', new VolunteerActivitiesService(VolunteerActivitiesOptions(app)));
  app.use('/apm/tasks', new TasksService(TasksOptions(app)));
  app.use('/apm/content-items', new ContentItemsService(ContentItemsOptions(app)));
  app.use('/apm/content-approval-events', new ContentApprovalEventsService(ContentApprovalEventsOptions(app)));
  app.use('/apm/content-distributions', new ContentDistributionsService(ContentDistributionsOptions(app)));
  app.use('/apm/whatsapp-groups', new WhatsappGroupsService(WhatsappGroupsOptions(app)));
  app.use('/apm/rapid-response-issues', new RapidResponseIssuesService(RapidResponseIssuesOptions(app)));
  app.use('/apm/rapid-response-actions', new RapidResponseActionsService(RapidResponseActionsOptions(app)));
  app.use('/apm/candidate-events', new CandidateEventsService(CandidateEventsOptions(app)));
  app.use('/apm/event-participants', new EventParticipantsService(EventParticipantsOptions(app)));
  app.use('/apm/event-reports', new EventReportsService(EventReportsOptions(app)));
  app.use('/apm/event-commitments', new EventCommitmentsService(EventCommitmentsOptions(app)));
  app.use('/apm/polling-unit-agents', new PollingUnitAgentsService(PollingUnitAgentsOptions(app)));
  app.use('/apm/agent-assignments', new AgentAssignmentsService(AgentAssignmentsOptions(app)));
  app.use('/apm/local-issues', new LocalIssuesService(LocalIssuesOptions(app)));
  app.use('/apm/influencers', new InfluencersService(InfluencersOptions(app)));
  app.use('/apm/coordinators', new CoordinatorsService(CoordinatorsOptions(app)));
  app.use('/apm/agent-training-records', new AgentTrainingRecordsService(AgentTrainingRecordsOptions(app)));
  app.use('/apm/agent-readiness-checklists', new AgentReadinessChecklistsService(AgentReadinessChecklistsOptions(app)));
  app.use('/apm/election-day-reports', new ElectionDayReportsService(ElectionDayReportsOptions(app)));
  app.use('/apm/incidents', new IncidentsService(IncidentsOptions(app)));
  app.use('/apm/escalations', new EscalationsService(EscalationsOptions(app)));
  app.use('/apm/election-results', new ElectionResultsService(ElectionResultsOptions(app)));
  app.use('/apm/result-verifications', new ResultVerificationsService(ResultVerificationsOptions(app)));
  app.use('/apm/result-reconciliations', new ResultReconciliationsService(ResultReconciliationsOptions(app)));
  app.use('/apm/media-files', new MediaFilesService(MediaFilesOptions(app)));
  app.use('/apm/notifications', new NotificationsService(NotificationsOptions(app)));
  app.use('/apm/sync-operations', new SyncOperationsService(SyncOperationsOptions(app)));
  app.use('/apm/generated-reports', new GeneratedReportsService(GeneratedReportsOptions(app)));
  app.use('/apm/dashboard-snapshots', new DashboardSnapshotsService(DashboardSnapshotsOptions(app)));
  app.use('/apm/audit-logs', new AuditLogsService(AuditLogsOptions(app)));
  app.use('/apm/data-exports', new DataExportsService(DataExportsOptions(app)));
  app.use('/apm/system-settings', new SystemSettingsService(SystemSettingsOptions(app)));
  app.use('/apm/nav-menus', new NavMenusService(NavMenusOptions(app)));
}
