import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const SERVICES_DIR = new URL('./services', import.meta.url).pathname;

interface ServiceField {
  name: string;
  type: string;
  required: boolean;
  tsType: string;
  description?: string;
}

interface ServiceSpec {
  servicePath: string;
  collectionName: string;
  purpose: string;
  isAppendOnly?: boolean;
  isHandWritten?: boolean;
  customMethods?: string[];
  fields: ServiceField[];
}

const SERVICES: ServiceSpec[] = [
  // 7. Identity and Access
  {
    servicePath: 'auth',
    collectionName: '',
    purpose: 'Multi-method authentication service (hand-written).',
    isHandWritten: true,
    fields: [],
  },
  {
    servicePath: 'users',
    collectionName: 'users',
    purpose: 'Stores all web and mobile identities, authentication profile, account state, and safe public profile data.',
    customMethods: ['setupPermissions'],
    fields: [
      { name: 'name', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Display name' },
      { name: 'email', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Email' },
      { name: 'password', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'bcrypt hash' },
      { name: 'phoneNumber', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Normalised phone' },
      { name: 'permissions', type: 'string[]', required: false, tsType: 'Type.Optional(Type.Array(Type.String()))', description: 'Permission codes' },
      { name: 'primaryRoleCode', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Display role' },
      { name: 'accountStatus', type: 'string', required: false, tsType: 'Type.Optional(Type.Union([Type.Literal(\'invited\'), Type.Literal(\'active\'), Type.Literal(\'suspended\'), Type.Literal(\'disabled\'), Type.Literal(\'locked\')]))', description: 'Account status' },
      { name: 'isPhoneVerified', type: 'boolean', required: false, tsType: 'Type.Optional(Type.Boolean())', description: 'Phone verified' },
      { name: 'isEmailVerified', type: 'boolean', required: false, tsType: 'Type.Optional(Type.Boolean())', description: 'Email verified' },
    ],
  },
  {
    servicePath: 'roles',
    collectionName: 'roles',
    purpose: 'Defines system and campaign roles and their permission bundles.',
    fields: [
      { name: 'code', type: 'string', required: true, tsType: 'Type.String()', description: 'Stable machine code' },
      { name: 'name', type: 'string', required: true, tsType: 'Type.String()', description: 'Human-readable name' },
      { name: 'description', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Role purpose' },
      { name: 'permissionCodes', type: 'string[]', required: true, tsType: 'Type.Array(Type.String())', description: 'Permission codes' },
      { name: 'isSystemRole', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Protected role' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'active\'), Type.Literal(\'inactive\')])', description: 'Status' },
    ],
  },
  {
    servicePath: 'permissions',
    collectionName: 'permissions',
    purpose: 'Registry of atomic application permissions.',
    fields: [
      { name: 'code', type: 'string', required: true, tsType: 'Type.String()', description: 'Permission code' },
      { name: 'module', type: 'string', required: true, tsType: 'Type.String()', description: 'Functional module' },
      { name: 'action', type: 'string', required: true, tsType: 'Type.String()', description: 'Action' },
      { name: 'description', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Description' },
      { name: 'riskLevel', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'low\'), Type.Literal(\'medium\'), Type.Literal(\'high\'), Type.Literal(\'critical\')])', description: 'Risk level' },
    ],
  },
  {
    servicePath: 'role-assignments',
    collectionName: 'roleAssignments',
    purpose: 'Assigns roles to users, optionally limited by effective dates.',
    fields: [
      { name: 'userId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'User reference' },
      { name: 'roleId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Role reference' },
      { name: 'roleCode', type: 'string', required: true, tsType: 'Type.String()', description: 'Denormalised role code' },
      { name: 'effectiveFrom', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Activation date' },
      { name: 'effectiveTo', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'Expiry' },
      { name: 'isPrimary', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Default role' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'active\'), Type.Literal(\'expired\'), Type.Literal(\'revoked\')])', description: 'Status' },
    ],
  },
  {
    servicePath: 'geography-assignments',
    collectionName: 'geographyAssignments',
    purpose: 'Scopes a user to geographic areas.',
    fields: [
      { name: 'userId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'User reference' },
      { name: 'scopeLevel', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'state\'), Type.Literal(\'senatorialDistrict\'), Type.Literal(\'lga\'), Type.Literal(\'ward\'), Type.Literal(\'pollingUnit\')])', description: 'Scope level' },
      { name: 'stateId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'State' },
      { name: 'senatorialDistrictId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'District' },
      { name: 'lgaId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'LGA' },
      { name: 'wardId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Ward' },
      { name: 'pollingUnitId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Polling unit' },
      { name: 'canViewChildren', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Include descendants' },
      { name: 'effectiveFrom', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Start' },
      { name: 'effectiveTo', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'End' },
    ],
  },
  {
    servicePath: 'user-devices',
    collectionName: 'userDevices',
    purpose: 'Registers mobile and browser devices.',
    fields: [
      { name: 'userId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'User' },
      { name: 'deviceType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'mobile\'), Type.Literal(\'browser\'), Type.Literal(\'tablet\')])', description: 'Device type' },
      { name: 'deviceName', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Device name' },
      { name: 'pushToken', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Push token' },
      { name: 'lastUsedAt', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'Last use' },
      { name: 'isRevoked', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Revoked flag' },
    ],
  },
  {
    servicePath: 'user-sessions',
    collectionName: 'userSessions',
    purpose: 'Tracks refresh-token sessions and supports forced logout.',
    isAppendOnly: true,
    fields: [
      { name: 'userId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'User' },
      { name: 'refreshTokenHash', type: 'string', required: true, tsType: 'Type.String()', description: 'Token hash' },
      { name: 'deviceId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Device' },
      { name: 'ipAddress', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'IP address' },
      { name: 'expiresAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Expiry' },
      { name: 'loggedOutAt', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'Logout time' },
    ],
  },
  // 8. Electoral Geography
  {
    servicePath: 'states',
    collectionName: 'states',
    purpose: 'Stores the 37 Nigerian states plus FCT.',
    fields: [
      { name: 'name', type: 'string', required: true, tsType: 'Type.String()', description: 'State name' },
      { name: 'code', type: 'string', required: true, tsType: 'Type.String()', description: 'State code' },
      { name: 'displayOrder', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Sort order' },
    ],
  },
  {
    servicePath: 'senatorial-districts',
    collectionName: 'senatorialDistricts',
    purpose: 'Stores the senatorial districts used by the campaign geography hierarchy.',
    fields: [
      { name: 'name', type: 'string', required: true, tsType: 'Type.String()', description: 'District name' },
      { name: 'code', type: 'string', required: true, tsType: 'Type.String()', description: 'District code' },
      { name: 'stateId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Parent state' },
      { name: 'region', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Region' },
      { name: 'displayOrder', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Sort order' },
    ],
  },
  {
    servicePath: 'lgas',
    collectionName: 'lgas',
    purpose: 'Stores Local Government Areas and their parent senatorial district.',
    fields: [
      { name: 'name', type: 'string', required: true, tsType: 'Type.String()', description: 'LGA name' },
      { name: 'code', type: 'string', required: true, tsType: 'Type.String()', description: 'LGA code' },
      { name: 'stateId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Parent state' },
      { name: 'senatorialDistrictId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Parent district' },
      { name: 'region', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Region' },
      { name: 'displayOrder', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Sort order' },
    ],
  },
  {
    servicePath: 'wards',
    collectionName: 'wards',
    purpose: 'Stores political wards and their parent LGA.',
    fields: [
      { name: 'name', type: 'string', required: true, tsType: 'Type.String()', description: 'Ward name' },
      { name: 'code', type: 'string', required: true, tsType: 'Type.String()', description: 'Ward code' },
      { name: 'lgaId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Parent LGA' },
      { name: 'displayOrder', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Sort order' },
    ],
  },
  {
    servicePath: 'polling-units',
    collectionName: 'pollingUnits',
    purpose: 'Master record for every polling unit.',
    fields: [
      { name: 'code', type: 'string', required: true, tsType: 'Type.String()', description: 'PU code' },
      { name: 'name', type: 'string', required: true, tsType: 'Type.String()', description: 'PU name' },
      { name: 'wardId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Parent ward' },
      { name: 'lgaId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Parent LGA' },
      { name: 'registeredVoters', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Registered voters' },
      { name: 'location', type: 'object', required: false, tsType: 'Type.Optional(Type.Object({ type: Type.Literal(\'Point\'), coordinates: Type.Array(Type.Number(), { minItems: 2, maxItems: 2 }) }))', description: 'GeoJSON Point' },
    ],
  },
  // 9. Political Intelligence
  {
    servicePath: 'polling-unit-intelligence',
    collectionName: 'pollingUnitIntelligence',
    purpose: 'Current campaign assessment for each polling unit.',
    fields: [
      { name: 'pollingUnitId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Polling unit' },
      { name: 'riskLevel', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'safe\'), Type.Literal(\'moderate\'), Type.Literal(\'dangerous\'), Type.Literal(\'unassessed\')])', description: 'Risk level' },
      { name: 'conversionStatus', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'untouched\'), Type.Literal(\'engaged\'), Type.Literal(\'won\'), Type.Literal(\'lost\')])', description: 'Conversion status' },
      { name: 'pastResultApm', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'APM past result' },
      { name: 'pastResultPdp', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'PDP past result' },
      { name: 'pastResultApc', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'APC past result' },
      { name: 'notes', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Assessment notes' },
    ],
  },
  {
    servicePath: 'polling-unit-intelligence-history',
    collectionName: 'pollingUnitIntelligenceHistory',
    purpose: 'Preserves immutable historical snapshots of polling-unit intelligence.',
    isAppendOnly: true,
    fields: [
      { name: 'pollingUnitId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Polling unit' },
      { name: 'snapshot', type: 'object', required: true, tsType: 'Type.Object({})', description: 'Full intelligence snapshot' },
      { name: 'assessedAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Assessment time' },
      { name: 'assessedBy', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Assessor' },
    ],
  },
  {
    servicePath: 'ward-conversion-assessments',
    collectionName: 'wardConversionAssessments',
    purpose: 'Current and historical ward conversion assessments.',
    fields: [
      { name: 'wardId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Ward' },
      { name: 'assessmentWeek', type: 'string', required: true, tsType: 'Type.String()', description: 'ISO week code' },
      { name: 'score', type: 'number', required: true, tsType: 'Type.Integer({ minimum: 0, maximum: 100 })', description: '0-100 score' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'strong\'), Type.Literal(\'moderate\'), Type.Literal(\'weak\'), Type.Literal(\'unassessed\')])', description: 'Status' },
      { name: 'notes', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Notes' },
    ],
  },
  {
    servicePath: 'stakeholders',
    collectionName: 'stakeholders',
    purpose: 'Political, traditional, religious, and community stakeholder profiles.',
    fields: [
      { name: 'fullName', type: 'string', required: true, tsType: 'Type.String()', description: 'Full name' },
      { name: 'phoneNumber', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Phone' },
      { name: 'email', type: 'string', required: false, tsType: 'Type.Optional(Type.String({ format: \'email\' }))', description: 'Email' },
      { name: 'stakeholderType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'traditional\'), Type.Literal(\'religious\'), Type.Literal(\'political\'), Type.Literal(\'community\'), Type.Literal(\'youth\'), Type.Literal(\'women\'), Type.Literal(\'professional\'), Type.Literal(\'market\')])', description: 'Type' },
      { name: 'lgaId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'LGA' },
      { name: 'wardId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Ward' },
      { name: 'affiliation', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Political affiliation' },
      { name: 'influenceLevel', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'high\'), Type.Literal(\'medium\'), Type.Literal(\'low\')])', description: 'Influence' },
      { name: 'conversionStatus', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'untouched\'), Type.Literal(\'engaged\'), Type.Literal(\'leaning\'), Type.Literal(\'won\'), Type.Literal(\'lost\'), Type.Literal(\'hostile\')])', description: 'Conversion' },
      { name: 'consent', type: 'object', required: false, tsType: 'Type.Optional(ConsentRecordSchema)', description: 'Consent' },
    ],
  },
  {
    servicePath: 'stakeholder-engagements',
    collectionName: 'stakeholderEngagements',
    purpose: 'Records each meeting, call, visit, issue, and follow-up with a stakeholder.',
    isAppendOnly: true,
    fields: [
      { name: 'stakeholderId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Stakeholder' },
      { name: 'engagementType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'meeting\'), Type.Literal(\'call\'), Type.Literal(\'visit\'), Type.Literal(\'event\'), Type.Literal(\'followUp\')])', description: 'Type' },
      { name: 'conductedAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Engagement time' },
      { name: 'conductedBy', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Who conducted' },
      { name: 'notes', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Notes' },
      { name: 'outcome', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Outcome' },
    ],
  },
  // 10. Field Operations
  {
    servicePath: 'canvassing-reports',
    collectionName: 'canvassingReports',
    purpose: 'Stores aggregated field canvassing and voter-contact reports.',
    fields: [
      { name: 'sessionTitle', type: 'string', required: true, tsType: 'Type.String()', description: 'Session title' },
      { name: 'lgaId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'LGA' },
      { name: 'wardId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Ward' },
      { name: 'teamLead', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Team lead' },
      { name: 'teamSize', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Team size' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'planned\'), Type.Literal(\'inProgress\'), Type.Literal(\'completed\'), Type.Literal(\'cancelled\')])', description: 'Status' },
      { name: 'scheduledDate', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'Scheduled' },
      { name: 'visitSummaries', type: 'array', required: false, tsType: 'Type.Optional(Type.Array(Type.Object({ name: Type.String(), phone: Type.Optional(Type.String()), supportLevel: Type.Optional(Type.String()), outcome: Type.Optional(Type.String()) })))', description: 'Visit summaries' },
    ],
  },
  {
    servicePath: 'voter-contacts',
    collectionName: 'voterContacts',
    purpose: 'Tracks individual voter contacts made during canvassing.',
    fields: [
      { name: 'pollingUnitId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Polling unit' },
      { name: 'contactDate', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Contact date' },
      { name: 'voterName', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Voter name' },
      { name: 'voterPhone', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Voter phone' },
      { name: 'supportLevel', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'STRONG_SUPPORT\'), Type.Literal(\'LEANING_SUPPORT\'), Type.Literal(\'UNDECIDED\'), Type.Literal(\'LEANING_OPPOSITION\'), Type.Literal(\'STRONG_OPPOSITION\')])', description: 'Support level' },
      { name: 'concerns', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Concerns' },
      { name: 'issues', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Issues' },
      { name: 'reportedById', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Reporter' },
      { name: 'verified', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Verified flag' },
      { name: 'verifiedById', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Verifier' },
      { name: 'notes', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Notes' },
    ],
  },
  {
    servicePath: 'volunteers',
    collectionName: 'volunteers',
    purpose: 'Registers and manages campaign volunteers.',
    fields: [
      { name: 'fullName', type: 'string', required: true, tsType: 'Type.String()', description: 'Full name' },
      { name: 'phoneNumber', type: 'string', required: true, tsType: 'Type.String()', description: 'Phone' },
      { name: 'email', type: 'string', required: false, tsType: 'Type.Optional(Type.String({ format: \'email\' }))', description: 'Email' },
      { name: 'lgaId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'LGA' },
      { name: 'wardId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Ward' },
      { name: 'skills', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Skills' },
      { name: 'availability', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Availability' },
      { name: 'onboarded', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Onboarded flag' },
      { name: 'consent', type: 'object', required: false, tsType: 'Type.Optional(ConsentRecordSchema)', description: 'Consent' },
    ],
  },
  {
    servicePath: 'volunteer-assignments',
    collectionName: 'volunteerAssignments',
    purpose: 'Assigns volunteers to campaigns, events, wards, or tasks.',
    fields: [
      { name: 'volunteerId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Volunteer' },
      { name: 'lgaId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'LGA' },
      { name: 'wardId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Ward' },
      { name: 'role', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Role' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'active\'), Type.Literal(\'completed\'), Type.Literal(\'cancelled\')])', description: 'Status' },
      { name: 'assignedAt', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'Assignment time' },
    ],
  },
  {
    servicePath: 'volunteer-activities',
    collectionName: 'volunteerActivities',
    purpose: 'Records completed volunteer activity for weekly reporting.',
    isAppendOnly: true,
    fields: [
      { name: 'volunteerId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Volunteer' },
      { name: 'activityType', type: 'string', required: true, tsType: 'Type.String()', description: 'Activity type' },
      { name: 'description', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Description' },
      { name: 'durationHours', type: 'number', required: false, tsType: 'Type.Optional(Type.Number())', description: 'Duration' },
      { name: 'completedAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Completion time' },
    ],
  },
  // 11. Shared — Tasks
  {
    servicePath: 'tasks',
    collectionName: 'tasks',
    purpose: 'Tracks assignments and follow-up actions across the platform.',
    fields: [
      { name: 'title', type: 'string', required: true, tsType: 'Type.String()', description: 'Task title' },
      { name: 'description', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Description' },
      { name: 'sourceType', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Source entity type' },
      { name: 'sourceId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Source record' },
      { name: 'assignedTo', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Assignee' },
      { name: 'dueAt', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'Due date' },
      { name: 'priority', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'low\'), Type.Literal(\'medium\'), Type.Literal(\'high\'), Type.Literal(\'critical\')])', description: 'Priority' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'open\'), Type.Literal(\'inProgress\'), Type.Literal(\'completed\'), Type.Literal(\'cancelled\')])', description: 'Status' },
      { name: 'geography', type: 'object', required: false, tsType: 'Type.Optional(GeographySnapshotSchema)', description: 'Geography scope' },
    ],
  },
  // 12. Content and Messaging
  {
    servicePath: 'content-items',
    collectionName: 'contentItems',
    purpose: 'Campaign content, targeting, lifecycle, assets, and approval state.',
    fields: [
      { name: 'title', type: 'string', required: true, tsType: 'Type.String()', description: 'Title' },
      { name: 'contentType', type: 'string', required: true, tsType: 'Type.String()', description: 'Content type' },
      { name: 'body', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Content body' },
      { name: 'assetUrl', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Asset URL' },
      { name: 'lgaId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Target LGA' },
      { name: 'targetAudience', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Target audience' },
      { name: 'language', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Language' },
      { name: 'tags', type: 'array', required: false, tsType: 'Type.Optional(Type.Array(Type.String()))', description: 'Tags' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'draft\'), Type.Literal(\'pendingApproval\'), Type.Literal(\'approved\'), Type.Literal(\'rejected\'), Type.Literal(\'published\'), Type.Literal(\'archived\')])', description: 'Status' },
    ],
  },
  {
    servicePath: 'content-approval-events',
    collectionName: 'contentApprovalEvents',
    purpose: 'Records every content submission, review, approval, and rejection.',
    isAppendOnly: true,
    fields: [
      { name: 'contentId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Content item' },
      { name: 'action', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'submitted\'), Type.Literal(\'approved\'), Type.Literal(\'rejected\'), Type.Literal(\'withdrawn\'), Type.Literal(\'expired\')])', description: 'Action' },
      { name: 'reviewedBy', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Reviewer' },
      { name: 'reason', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Reason' },
    ],
  },
  {
    servicePath: 'content-distributions',
    collectionName: 'contentDistributions',
    purpose: 'Tracks where content was delivered, downloaded, shared, or acknowledged.',
    isAppendOnly: true,
    fields: [
      { name: 'contentId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Content item' },
      { name: 'channel', type: 'string', required: true, tsType: 'Type.String()', description: 'Distribution channel' },
      { name: 'recipientCount', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Recipients' },
      { name: 'acknowledgedCount', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Acknowledged' },
      { name: 'distributedAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Distribution time' },
    ],
  },
  {
    servicePath: 'whatsapp-groups',
    collectionName: 'whatsappGroups',
    purpose: 'Registry of official campaign WhatsApp groups and administrators.',
    fields: [
      { name: 'level', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'state\'), Type.Literal(\'senatorial\'), Type.Literal(\'lga\'), Type.Literal(\'ward\')])', description: 'Group level' },
      { name: 'name', type: 'string', required: true, tsType: 'Type.String()', description: 'Group name' },
      { name: 'description', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Description' },
      { name: 'groupLink', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Invite link' },
      { name: 'adminName', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Admin name' },
      { name: 'adminPhone', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Admin phone' },
      { name: 'memberCount', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Member count' },
    ],
  },
  // 13. Rapid Response
  {
    servicePath: 'rapid-response-issues',
    collectionName: 'rapidResponseIssues',
    purpose: 'Stores rumours, misinformation, grievances, and emerging risks.',
    fields: [
      { name: 'platform', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'facebook\'), Type.Literal(\'whatsapp\'), Type.Literal(\'twitter\'), Type.Literal(\'tiktok\'), Type.Literal(\'instagram\'), Type.Literal(\'radio\'), Type.Literal(\'print\'), Type.Literal(\'other\')])', description: 'Platform' },
      { name: 'title', type: 'string', required: true, tsType: 'Type.String()', description: 'Title' },
      { name: 'content', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Content' },
      { name: 'mentionUrl', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'URL' },
      { name: 'sentiment', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Sentiment' },
      { name: 'reach', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Estimated reach' },
      { name: 'isUrgent', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Urgent flag' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'new\'), Type.Literal(\'investigating\'), Type.Literal(\'responded\'), Type.Literal(\'resolved\'), Type.Literal(\'monitoring\')])', description: 'Status' },
      { name: 'geography', type: 'object', required: false, tsType: 'Type.Optional(GeographySnapshotSchema)', description: 'Geography' },
    ],
  },
  {
    servicePath: 'rapid-response-actions',
    collectionName: 'rapidResponseActions',
    purpose: 'Records investigation, drafting, approval, and publication actions.',
    isAppendOnly: true,
    fields: [
      { name: 'issueId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Rapid response issue' },
      { name: 'actionType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'investigation\'), Type.Literal(\'drafting\'), Type.Literal(\'approval\'), Type.Literal(\'publication\'), Type.Literal(\'fieldIntervention\')])', description: 'Action type' },
      { name: 'content', type: 'string', required: true, tsType: 'Type.String()', description: 'Response content' },
      { name: 'publishedAt', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'Publication time' },
      { name: 'publishedBy', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Publisher' },
      { name: 'platform', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Platform' },
    ],
  },
  // 14. Candidate Movement
  {
    servicePath: 'candidate-events',
    collectionName: 'candidateEvents',
    purpose: 'Stores candidate tours, rallies, town halls, and campaign events.',
    fields: [
      { name: 'title', type: 'string', required: true, tsType: 'Type.String()', description: 'Event title' },
      { name: 'eventType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'rally\'), Type.Literal(\'townHall\'), Type.Literal(\'stakeholderMeeting\'), Type.Literal(\'campaignEvent\'), Type.Literal(\'other\')])', description: 'Event type' },
      { name: 'geography', type: 'object', required: true, tsType: 'GeographySnapshotSchema', description: 'Geography' },
      { name: 'description', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Description' },
      { name: 'eventDate', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Event date' },
      { name: 'expectedAttendees', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Expected attendance' },
      { name: 'actualAttendees', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Actual attendance' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'planned\'), Type.Literal(\'confirmed\'), Type.Literal(\'completed\'), Type.Literal(\'cancelled\')])', description: 'Status' },
    ],
  },
  {
    servicePath: 'event-participants',
    collectionName: 'eventParticipants',
    purpose: 'Tracks expected and actual stakeholders, users, and volunteers for each event.',
    fields: [
      { name: 'eventId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Event' },
      { name: 'participantType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'stakeholder\'), Type.Literal(\'volunteer\'), Type.Literal(\'user\'), Type.Literal(\'group\')])', description: 'Participant type' },
      { name: 'participantId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Participant record' },
      { name: 'displayName', type: 'string', required: true, tsType: 'Type.String()', description: 'Display name' },
      { name: 'attended', type: 'boolean', required: false, tsType: 'Type.Optional(Type.Boolean())', description: 'Attendance' },
      { name: 'notes', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Notes' },
    ],
  },
  {
    servicePath: 'event-reports',
    collectionName: 'eventReports',
    purpose: 'Stores post-event outcomes and political conversion assessment.',
    fields: [
      { name: 'eventId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Event' },
      { name: 'attendanceEstimate', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Estimated turnout' },
      { name: 'keyComplaints', type: 'array', required: false, tsType: 'Type.Optional(Type.Array(Type.String()))', description: 'Complaints raised' },
      { name: 'oppositionReaction', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Opposition response' },
      { name: 'volunteerSignups', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'New volunteers' },
      { name: 'conversionScore', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: '0-100 score' },
      { name: 'followUpRequired', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Actions remaining' },
      { name: 'submittedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Reporter' },
    ],
  },
  {
    servicePath: 'event-commitments',
    collectionName: 'eventCommitments',
    purpose: 'Tracks commitments made during candidate visits until resolution.',
    fields: [
      { name: 'eventId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Source event' },
      { name: 'stakeholderId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Stakeholder' },
      { name: 'commitment', type: 'string', required: true, tsType: 'Type.String()', description: 'Commitment text' },
      { name: 'ownerId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Responsible user' },
      { name: 'dueAt', type: 'Date', required: false, tsType: 'Type.Optional(Type.String({ format: \'date-time\' }))', description: 'Due date' },
      { name: 'priority', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'low\'), Type.Literal(\'medium\'), Type.Literal(\'high\'), Type.Literal(\'critical\')])', description: 'Priority' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'open\'), Type.Literal(\'inProgress\'), Type.Literal(\'completed\'), Type.Literal(\'declined\'), Type.Literal(\'cancelled\')])', description: 'Status' },
    ],
  },
  // 15. Election Protection
  {
    servicePath: 'polling-unit-agents',
    collectionName: 'pollingUnitAgents',
    purpose: 'People approved to serve as main or backup polling-unit agents.',
    fields: [
      { name: 'fullName', type: 'string', required: true, tsType: 'Type.String()', description: 'Agent name' },
      { name: 'phoneNumber', type: 'string', required: true, tsType: 'Type.String()', description: 'Phone' },
      { name: 'userId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Linked user' },
      { name: 'smartphoneAvailable', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Has smartphone' },
      { name: 'powerBankAvailable', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Has power bank' },
      { name: 'dataBundleReady', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Data available' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'prospective\'), Type.Literal(\'approved\'), Type.Literal(\'active\'), Type.Literal(\'suspended\'), Type.Literal(\'withdrawn\')])', description: 'Status' },
    ],
  },
  {
    servicePath: 'agent-assignments',
    collectionName: 'agentAssignments',
    purpose: 'Assigns main and backup agents to polling units.',
    fields: [
      { name: 'agentId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Agent' },
      { name: 'pollingUnitId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Polling unit' },
      { name: 'role', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'main\'), Type.Literal(\'backup\')])', description: 'Role' },
      { name: 'wardSupervisorId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Ward supervisor' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'assigned\'), Type.Literal(\'confirmed\'), Type.Literal(\'replaced\'), Type.Literal(\'withdrawn\'), Type.Literal(\'completed\')])', description: 'Status' },
      { name: 'effectiveFrom', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Start' },
      { name: 'assignedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Assigner' },
    ],
  },
  {
    servicePath: 'agent-training-records',
    collectionName: 'agentTrainingRecords',
    purpose: 'Records training sessions, attendance, assessment, and completion.',
    fields: [
      { name: 'agentId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Agent' },
      { name: 'trainingCode', type: 'string', required: true, tsType: 'Type.String()', description: 'Training code' },
      { name: 'sessionAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Session date' },
      { name: 'attendanceStatus', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'registered\'), Type.Literal(\'attended\'), Type.Literal(\'absent\'), Type.Literal(\'excused\')])', description: 'Attendance' },
      { name: 'assessmentScore', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer({ minimum: 0, maximum: 100 }))', description: '0-100 score' },
      { name: 'completed', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Completed' },
      { name: 'trainerId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Trainer' },
    ],
  },
  {
    servicePath: 'agent-readiness-checklists',
    collectionName: 'agentReadinessChecklists',
    purpose: 'Agent self-confirmation and supervisor verification of election readiness.',
    fields: [
      { name: 'assignmentId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Agent assignment' },
      { name: 'cycleCode', type: 'string', required: true, tsType: 'Type.String()', description: 'Readiness cycle code' },
      { name: 'items', type: 'object', required: true, tsType: 'Type.Object({ assignmentConfirmed: Type.Boolean(), trainingCompleted: Type.Boolean(), smartphone: Type.Boolean(), powerBank: Type.Boolean(), dataBundle: Type.Boolean(), supervisorKnown: Type.Boolean(), lgaContactKnown: Type.Boolean(), legalKnown: Type.Boolean(), securityKnown: Type.Boolean(), photoProtocol: Type.Boolean(), reportingUnderstood: Type.Boolean(), arrivalConfirmed: Type.Boolean() })', description: 'Checklist items' },
      { name: 'readinessPercent', type: 'number', required: true, tsType: 'Type.Integer({ minimum: 0, maximum: 100 })', description: 'Computed readiness' },
      { name: 'supervisorStatus', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'pending\'), Type.Literal(\'verified\'), Type.Literal(\'rejected\')])', description: 'Supervisor status' },
      { name: 'supervisorId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Verifier' },
    ],
  },
  // 16. Election-Day Operations
  {
    servicePath: 'election-day-reports',
    collectionName: 'electionDayReports',
    purpose: 'Structured polling-unit operational reports throughout election day.',
    fields: [
      { name: 'clientSubmissionId', type: 'string', required: true, tsType: 'Type.String()', description: 'Offline idempotency' },
      { name: 'electionCode', type: 'string', required: true, tsType: 'Type.String()', description: 'Election identifier' },
      { name: 'pollingUnitId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Polling unit' },
      { name: 'geography', type: 'object', required: true, tsType: 'GeographySnapshotSchema', description: 'Geography snapshot' },
      { name: 'reportType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'agentArrival\'), Type.Literal(\'inecArrival\'), Type.Literal(\'bvasArrival\'), Type.Literal(\'accreditationStart\'), Type.Literal(\'turnoutUpdate\'), Type.Literal(\'countingStart\'), Type.Literal(\'collationMovement\'), Type.Literal(\'operationalUpdate\')])', description: 'Report type' },
      { name: 'reportedAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Report time' },
      { name: 'reportedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Reporter' },
      { name: 'payload', type: 'object', required: true, tsType: 'Type.Object({})', description: 'Report-type-specific payload' },
      { name: 'syncState', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'received\'), Type.Literal(\'validated\'), Type.Literal(\'flagged\'), Type.Literal(\'superseded\')])', description: 'Sync state' },
    ],
  },
  {
    servicePath: 'incidents',
    collectionName: 'incidents',
    purpose: 'Field and election incidents requiring operational, legal, or security action.',
    fields: [
      { name: 'clientSubmissionId', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Offline idempotency' },
      { name: 'electionCode', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Election' },
      { name: 'incidentType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'violence\'), Type.Literal(\'intimidation\'), Type.Literal(\'voteBuyingObservation\'), Type.Literal(\'bvasIssue\'), Type.Literal(\'inecDelay\'), Type.Literal(\'resultSheetIssue\'), Type.Literal(\'agentHarassment\'), Type.Literal(\'securityConcern\'), Type.Literal(\'collationDelay\'), Type.Literal(\'other\')])', description: 'Incident type' },
      { name: 'geography', type: 'object', required: true, tsType: 'GeographySnapshotSchema', description: 'Geography' },
      { name: 'description', type: 'string', required: true, tsType: 'Type.String()', description: 'Description' },
      { name: 'severity', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'low\'), Type.Literal(\'medium\'), Type.Literal(\'high\'), Type.Literal(\'critical\')])', description: 'Severity' },
      { name: 'reportedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Reporter' },
      { name: 'immediateHelpRequired', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Urgent help needed' },
      { name: 'legalEscalationNeeded', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Legal escalation' },
      { name: 'securityEscalationNeeded', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Security escalation' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'new\'), Type.Literal(\'acknowledged\'), Type.Literal(\'assigned\'), Type.Literal(\'inProgress\'), Type.Literal(\'resolved\'), Type.Literal(\'closed\'), Type.Literal(\'dismissed\')])', description: 'Status' },
    ],
  },
  {
    servicePath: 'escalations',
    collectionName: 'escalations',
    purpose: 'Routes incidents, issues, results to authorised response teams.',
    fields: [
      { name: 'sourceType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'incident\'), Type.Literal(\'rapidResponse\'), Type.Literal(\'result\'), Type.Literal(\'agent\'), Type.Literal(\'event\'), Type.Literal(\'other\')])', description: 'Source type' },
      { name: 'sourceId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Source record' },
      { name: 'escalationType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'legal\'), Type.Literal(\'security\'), Type.Literal(\'field\'), Type.Literal(\'technical\'), Type.Literal(\'leadership\')])', description: 'Escalation type' },
      { name: 'priority', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'low\'), Type.Literal(\'medium\'), Type.Literal(\'high\'), Type.Literal(\'critical\')])', description: 'Priority' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'open\'), Type.Literal(\'acknowledged\'), Type.Literal(\'inProgress\'), Type.Literal(\'resolved\'), Type.Literal(\'closed\')])', description: 'Status' },
      { name: 'assignedTeamCode', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Team code' },
      { name: 'assignedUserIds', type: 'array', required: false, tsType: 'Type.Optional(Type.Array(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })))', description: 'Assignees' },
    ],
  },
  // 17. Result Protection and Collation
  {
    servicePath: 'election-results',
    collectionName: 'electionResults',
    purpose: 'Polling-unit result submissions with embedded party breakdown.',
    fields: [
      { name: 'clientSubmissionId', type: 'string', required: true, tsType: 'Type.String()', description: 'Offline idempotency' },
      { name: 'electionCode', type: 'string', required: true, tsType: 'Type.String()', description: 'Election identifier' },
      { name: 'pollingUnitId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Polling unit' },
      { name: 'geography', type: 'object', required: true, tsType: 'GeographySnapshotSchema', description: 'Geography snapshot' },
      { name: 'registeredVoters', type: 'number', required: false, tsType: 'Type.Optional(Type.Integer())', description: 'Registered voters' },
      { name: 'accreditedVoters', type: 'number', required: true, tsType: 'Type.Integer()', description: 'Accredited voters' },
      { name: 'partyResults', type: 'array', required: true, tsType: 'Type.Array(PartyResultSchema)', description: 'Party vote breakdown' },
      { name: 'rejectedVotes', type: 'number', required: true, tsType: 'Type.Integer()', description: 'Rejected votes' },
      { name: 'totalValidVotes', type: 'number', required: true, tsType: 'Type.Integer()', description: 'Total valid votes' },
      { name: 'totalVotesCast', type: 'number', required: true, tsType: 'Type.Integer()', description: 'Total votes cast' },
      { name: 'resultSheetMediaId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Result sheet media' },
      { name: 'resultSheetBase64', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Result sheet image (base64)' },
      { name: 'submittedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Submitter' },
      { name: 'validation', type: 'object', required: true, tsType: 'ResultValidationSchema', description: 'Validation state' },
      { name: 'verificationStatus', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'pending\'), Type.Literal(\'verified\'), Type.Literal(\'rejected\'), Type.Literal(\'disputed\'), Type.Literal(\'superseded\')])', description: 'Verification status' },
      { name: 'revision', type: 'number', required: true, tsType: 'Type.Integer()', description: 'Revision number' },
    ],
  },
  {
    servicePath: 'result-verifications',
    collectionName: 'resultVerifications',
    purpose: 'Records supervisor review, acceptance, rejection, dispute, and resolution.',
    isAppendOnly: true,
    fields: [
      { name: 'resultId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Result reviewed' },
      { name: 'action', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'verify\'), Type.Literal(\'reject\'), Type.Literal(\'dispute\'), Type.Literal(\'requestCorrection\'), Type.Literal(\'resolveDispute\'), Type.Literal(\'lock\')])', description: 'Action' },
      { name: 'decision', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'accepted\'), Type.Literal(\'rejected\'), Type.Literal(\'disputed\'), Type.Literal(\'corrected\'), Type.Literal(\'locked\')])', description: 'Decision' },
      { name: 'reviewerId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Reviewer' },
      { name: 'reviewedAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Review time' },
      { name: 'reason', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Reason' },
    ],
  },
  {
    servicePath: 'result-reconciliations',
    collectionName: 'resultReconciliations',
    purpose: 'Compares campaign submissions with announced totals and records discrepancies.',
    fields: [
      { name: 'electionCode', type: 'string', required: true, tsType: 'Type.String()', description: 'Election' },
      { name: 'scopeLevel', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'pollingUnit\'), Type.Literal(\'ward\'), Type.Literal(\'lga\'), Type.Literal(\'state\')])', description: 'Scope' },
      { name: 'scopeId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Scope ID' },
      { name: 'sourceType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'campaignAggregate\'), Type.Literal(\'officialAnnouncement\'), Type.Literal(\'legalDocument\'), Type.Literal(\'other\')])', description: 'Source type' },
      { name: 'partyTotals', type: 'array', required: true, tsType: 'Type.Array(PartyResultSchema)', description: 'Source party totals' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'pending\'), Type.Literal(\'matched\'), Type.Literal(\'discrepancy\'), Type.Literal(\'resolved\')])', description: 'Status' },
    ],
  },
  // 18. Shared Services
  {
    servicePath: 'media-files',
    collectionName: 'mediaFiles',
    purpose: 'Metadata for uploaded photos, videos, audio, and documents.',
    fields: [
      { name: 'objectKey', type: 'string', required: true, tsType: 'Type.String()', description: 'Object storage key' },
      { name: 'originalFileName', type: 'string', required: true, tsType: 'Type.String()', description: 'Original name' },
      { name: 'mimeType', type: 'string', required: true, tsType: 'Type.String()', description: 'MIME type' },
      { name: 'sizeBytes', type: 'number', required: true, tsType: 'Type.Integer()', description: 'File size' },
      { name: 'checksumSha256', type: 'string', required: true, tsType: 'Type.String()', description: 'SHA-256 checksum' },
      { name: 'mediaType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'image\'), Type.Literal(\'video\'), Type.Literal(\'audio\'), Type.Literal(\'document\')])', description: 'Media type' },
      { name: 'purpose', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'profile\'), Type.Literal(\'canvassing\'), Type.Literal(\'content\'), Type.Literal(\'rapidResponse\'), Type.Literal(\'event\'), Type.Literal(\'incident\'), Type.Literal(\'resultSheet\'), Type.Literal(\'report\'), Type.Literal(\'other\')])', description: 'Purpose' },
      { name: 'uploadedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Uploader' },
      { name: 'accessLevel', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'publicCampaign\'), Type.Literal(\'internal\'), Type.Literal(\'restricted\'), Type.Literal(\'highlyRestricted\')])', description: 'Access level' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'uploading\'), Type.Literal(\'ready\'), Type.Literal(\'quarantined\'), Type.Literal(\'deleted\')])', description: 'Status' },
    ],
  },
  {
    servicePath: 'notifications',
    collectionName: 'notifications',
    purpose: 'Stores in-app, push, and operational notifications.',
    fields: [
      { name: 'recipientUserId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Recipient' },
      { name: 'type', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'task\'), Type.Literal(\'content\'), Type.Literal(\'rapidResponse\'), Type.Literal(\'electionDay\'), Type.Literal(\'result\'), Type.Literal(\'incident\'), Type.Literal(\'sync\'), Type.Literal(\'system\')])', description: 'Notification type' },
      { name: 'title', type: 'string', required: true, tsType: 'Type.String()', description: 'Title' },
      { name: 'body', type: 'string', required: true, tsType: 'Type.String()', description: 'Body' },
      { name: 'priority', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'normal\'), Type.Literal(\'high\'), Type.Literal(\'urgent\')])', description: 'Priority' },
      { name: 'channels', type: 'array', required: true, tsType: 'Type.Array(Type.Union([Type.Literal(\'inApp\'), Type.Literal(\'push\'), Type.Literal(\'sms\'), Type.Literal(\'email\')]))', description: 'Delivery channels' },
      { name: 'delivery', type: 'object', required: true, tsType: 'NotificationDeliverySchema', description: 'Delivery state' },
    ],
  },
  // 19. Mobile Synchronisation
  {
    servicePath: 'sync-operations',
    collectionName: 'syncOperations',
    purpose: 'Tracks offline mobile operations, idempotency, retries, and conflict handling.',
    isAppendOnly: true,
    fields: [
      { name: 'operationId', type: 'string', required: true, tsType: 'Type.String()', description: 'Client-generated operation ID' },
      { name: 'deviceId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Submitting device' },
      { name: 'userId', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Submitting user' },
      { name: 'servicePath', type: 'string', required: true, tsType: 'Type.String()', description: 'Target service' },
      { name: 'method', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'create\'), Type.Literal(\'patch\'), Type.Literal(\'remove\'), Type.Literal(\'custom\')])', description: 'Method' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'received\'), Type.Literal(\'applied\'), Type.Literal(\'duplicate\'), Type.Literal(\'conflict\'), Type.Literal(\'rejected\'), Type.Literal(\'failed\')])', description: 'Status' },
      { name: 'retryCount', type: 'number', required: true, tsType: 'Type.Integer()', description: 'Retry count' },
    ],
  },
  // 20. Reporting and Analytics
  {
    servicePath: 'generated-reports',
    collectionName: 'generatedReports',
    purpose: 'Tracks requested reports, generation jobs, and download lifecycle.',
    fields: [
      { name: 'reportType', type: 'string', required: true, tsType: 'Type.String()', description: 'Report type' },
      { name: 'requestedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Requester' },
      { name: 'parameters', type: 'object', required: true, tsType: 'Type.Object({})', description: 'Report parameters' },
      { name: 'format', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'pdf\'), Type.Literal(\'xlsx\'), Type.Literal(\'csv\')])', description: 'Format' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'queued\'), Type.Literal(\'processing\'), Type.Literal(\'completed\'), Type.Literal(\'failed\'), Type.Literal(\'expired\')])', description: 'Status' },
      { name: 'fileId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'Generated file' },
    ],
  },
  {
    servicePath: 'dashboard-snapshots',
    collectionName: 'dashboardSnapshots',
    purpose: 'Pre-aggregated KPI snapshots for executive dashboards.',
    fields: [
      { name: 'snapshotType', type: 'string', required: true, tsType: 'Type.String()', description: 'Dashboard type' },
      { name: 'scopeLevel', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'state\'), Type.Literal(\'district\'), Type.Literal(\'lga\'), Type.Literal(\'ward\')])', description: 'Scope level' },
      { name: 'scopeId', type: 'string', required: true, tsType: 'Type.String()', description: 'Scope ID' },
      { name: 'periodCode', type: 'string', required: true, tsType: 'Type.String()', description: 'Period code' },
      { name: 'metrics', type: 'object', required: true, tsType: 'Type.Object({})', description: 'Metric values' },
      { name: 'generatedAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Generation time' },
      { name: 'version', type: 'number', required: true, tsType: 'Type.Integer()', description: 'Metric definition version' },
    ],
  },
  // 21. Security and Audit
  {
    servicePath: 'audit-logs',
    collectionName: 'auditLogs',
    purpose: 'Immutable record of authentication, data changes, and administrative activity.',
    isAppendOnly: true,
    fields: [
      { name: 'actorId', type: 'ObjectId', required: false, tsType: 'Type.Optional(Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' }))', description: 'User if authenticated' },
      { name: 'actorType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'user\'), Type.Literal(\'system\'), Type.Literal(\'worker\'), Type.Literal(\'integration\')])', description: 'Actor type' },
      { name: 'action', type: 'string', required: true, tsType: 'Type.String()', description: 'Action code' },
      { name: 'servicePath', type: 'string', required: true, tsType: 'Type.String()', description: 'Service' },
      { name: 'method', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'HTTP method' },
      { name: 'recordId', type: 'string', required: false, tsType: 'Type.Optional(Type.String())', description: 'Record ID' },
      { name: 'success', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Success flag' },
      { name: 'occurredAt', type: 'Date', required: true, tsType: 'Type.String({ format: \'date-time\' })', description: 'Event time' },
    ],
  },
  {
    servicePath: 'data-exports',
    collectionName: 'dataExports',
    purpose: 'Tracks authorisation, generation, download, and expiry of data exports.',
    fields: [
      { name: 'requestedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Requester' },
      { name: 'exportType', type: 'string', required: true, tsType: 'Type.String()', description: 'Export type' },
      { name: 'filters', type: 'object', required: true, tsType: 'Type.Object({})', description: 'Filters' },
      { name: 'sensitivity', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'internal\'), Type.Literal(\'restricted\'), Type.Literal(\'highlyRestricted\')])', description: 'Sensitivity' },
      { name: 'approvalStatus', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'pending\'), Type.Literal(\'approved\'), Type.Literal(\'rejected\'), Type.Literal(\'expired\')])', description: 'Approval status' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'requested\'), Type.Literal(\'generating\'), Type.Literal(\'ready\'), Type.Literal(\'failed\'), Type.Literal(\'expired\'), Type.Literal(\'revoked\')])', description: 'Status' },
    ],
  },
  // 22. Administration
  {
    servicePath: 'system-settings',
    collectionName: 'systemSettings',
    purpose: 'Versioned platform configuration, feature flags, and integration settings.',
    fields: [
      { name: 'key', type: 'string', required: true, tsType: 'Type.String()', description: 'Configuration key' },
      { name: 'environment', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'development\'), Type.Literal(\'staging\'), Type.Literal(\'production\')])', description: 'Environment' },
      { name: 'value', type: 'unknown', required: true, tsType: 'Type.Unknown()', description: 'Non-secret value' },
      { name: 'valueType', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'string\'), Type.Literal(\'number\'), Type.Literal(\'boolean\'), Type.Literal(\'object\'), Type.Literal(\'array\')])', description: 'Value type' },
      { name: 'category', type: 'string', required: true, tsType: 'Type.String()', description: 'Feature category' },
      { name: 'version', type: 'number', required: true, tsType: 'Type.Integer()', description: 'Setting version' },
      { name: 'isSensitive', type: 'boolean', required: true, tsType: 'Type.Boolean()', description: 'Should be false' },
      { name: 'status', type: 'string', required: true, tsType: 'Type.Union([Type.Literal(\'draft\'), Type.Literal(\'active\'), Type.Literal(\'retired\')])', description: 'Status' },
      { name: 'updatedBy', type: 'ObjectId', required: true, tsType: 'Type.String({ pattern: \'^[a-fA-F0-9]{24}$\' })', description: 'Administrator' },
    ],
  },
];

function capitalize(name: string): string {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
}

function collectionNameToPascal(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function generateService(service: ServiceSpec): string {
  const className = capitalize(service.servicePath) + 'Service';
  const schemaClassName = capitalize(service.servicePath);
  const servicePath = service.servicePath;

  const resultFields = service.fields
    .map((f) => `  ${f.name}: ${f.tsType},`)
    .join('\n');

  const createFields = service.fields
    .map((f) => `  ${f.name}: ${f.tsType},`)
    .join('\n');

  const patchFields = service.fields
    .filter((f) => f.name !== 'clientSubmissionId' && f.name !== 'operationId')
    .map((f) => `  ${f.name}: Type.Optional(${f.tsType}),`)
    .join('\n');

  return `import { Type, type Static } from '@sinclair/typebox';
import { MongoDBService } from '@feathersjs/mongodb';
import type { MongoDBAdapterOptions } from '@feathersjs/mongodb';
import type { Application } from '@feathersjs/feathers';
import { GeographySnapshotSchema, PartyResultSchema, ResultValidationSchema, NotificationDeliverySchema, ConsentRecordSchema } from '../../validators/shared.js';

// --- Schemas ---

export const ${schemaClassName}ResultSchema = Type.Object({
${resultFields}
}, { additionalProperties: false });

export const ${schemaClassName}DataSchema = Type.Object({
${createFields}
}, { additionalProperties: false });

export const ${schemaClassName}PatchSchema = Type.Object({
${patchFields}
}, { additionalProperties: false });

export const ${schemaClassName}QuerySchema = Type.Object({
  $skip: Type.Optional(Type.Integer()),
  $limit: Type.Optional(Type.Integer()),
  $sort: Type.Optional(Type.Object({}, { additionalProperties: true })),
  search: Type.Optional(Type.String()),
}, { additionalProperties: true });

export type ${schemaClassName} = Static<typeof ${schemaClassName}ResultSchema>;
export type ${schemaClassName}Data = Static<typeof ${schemaClassName}DataSchema>;
export type ${schemaClassName}Patch = Static<typeof ${schemaClassName}PatchSchema>;
export type ${schemaClassName}Query = Static<typeof ${schemaClassName}QuerySchema>;

// --- Service ---

export class ${className} extends MongoDBService<${schemaClassName}, ${schemaClassName}Data> {
${service.servicePath === 'users' ? `  async setupPermissions(id: string, data: any, params: any, context?: any) {
    const { permissions, geographyAssignments } = data;
    const patchData: Record<string, unknown> = {};
    if (permissions) patchData.permissions = permissions;
    patchData.accountStatus = 'active';
    await (this as any).patch(id, patchData, params);
    if (geographyAssignments?.length) {
      const gaService = params.app?.service('apm/geography-assignments');
      if (gaService) {
        for (const assignment of geographyAssignments) {
          await gaService.create({ userId: id, ...assignment }, params);
        }
      }
    }
    const result = await (this as any).get(id, params);
    return result;
  }` : ''}
}

export const getOptions = (app: Application): MongoDBAdapterOptions => ({
  paginate: app.get('paginate'),
  Model: app.get('mongodbClient').then((client: any) => client.db().collection('${service.collectionName}')),
  id: '_id',
  disableObjectify: false,
  multi: false,
});
`;
}

function generateIndexFile(): string {
  let registration = '';
  let imports = '';
  let useLines = '';

  for (const service of SERVICES) {
    const moduleName = service.servicePath.replace(/-/g, '-');
    const className = capitalize(service.servicePath) + 'Service';
    const importPath = `./${service.servicePath}/${service.servicePath}.js`;

    let additional = '';
    if (service.isHandWritten) {
      imports += `import { ${className} } from '${importPath}';\n`;
      useLines += `  app.use('/apm/${service.servicePath}', new ${className}(app));\n`;
    } else if (service.customMethods?.length) {
      const methodsList = "'" + ['find','get','create','update','patch','remove', ...service.customMethods].join("', '") + "'";
      imports += `import { ${className}, getOptions as ${capitalize(service.servicePath)}Options } from '${importPath}';\n`;
      useLines += `  app.use('/apm/${service.servicePath}', new ${className}(${capitalize(service.servicePath)}Options(app)), { methods: [${methodsList}] });\n`;
    } else {
      imports += `import { ${className}, getOptions as ${capitalize(service.servicePath)}Options } from '${importPath}';\n`;
      useLines += `  app.use('/apm/${service.servicePath}', new ${className}(${capitalize(service.servicePath)}Options(app)));\n`;
    }

    for (const cm of (service as any).customMethods || []) {
      additional += `  app.routes.insert('/apm/${service.servicePath}/:__id/${cm}', { service: app.service('apm/${service.servicePath}'), params: {} });\n`;
    }
    useLines += additional;
  }

  return `import type { Application } from '@feathersjs/feathers';
${imports}

export function registerServices(app: Application) {
${useLines}}
`;
}

// Generate all service files
for (const service of SERVICES) {
  if (service.isHandWritten) {
    console.log(`Skipped (hand-written): ${service.servicePath}/${service.servicePath}.ts`);
    continue;
  }
  const dirPath = join(SERVICES_DIR, service.servicePath);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }

  const serviceCode = generateService(service);
  writeFileSync(join(dirPath, `${service.servicePath}.ts`), serviceCode);
  console.log(`Generated: ${service.servicePath}/${service.servicePath}.ts`);
}

// Generate services/index.ts
const indexCode = generateIndexFile();
writeFileSync(join(SERVICES_DIR, 'index.ts'), indexCode);
console.log('Generated: services/index.ts');
console.log(`\nDone! Generated ${SERVICES.length} services.`);
