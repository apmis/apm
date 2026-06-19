# APM Campaign API Documentation

Base URL: `http://localhost:3030/apm`

All endpoints require `Authorization: Bearer <token>` unless marked as public read.

---

## Authentication

### Login
```
POST /authentication
```

```json
{ "strategy": "local", "email": "admin@apm.test", "password": "password123" }
```

Response: `201` — returns `{ "accessToken": "eyJ..." }`

---

## User Management

### Users
- `GET /apm/users` — List users (auth required, admin permission for full list, users see themselves)
- `GET /apm/users/:id` — Get user (auth required, users see themselves)
- `POST /apm/users` — Create user (admin)
- `PATCH /apm/users/:id` — Update user (admin)
- `DELETE /apm/users/:id` — Remove user (admin)

### Roles
- `GET /apm/roles` — List roles (admin)
- `GET /apm/roles/:id` — Get role (admin)
- `POST /apm/roles` — Create role (admin)
- `PATCH /apm/roles/:id` — Update role (admin)
- `DELETE /apm/roles/:id` — Remove role (admin)

### Permissions
- `GET /apm/permissions` — List permissions (admin)
- `GET /apm/permissions/:id` — Get permission (admin)
- `POST /apm/permissions` — Create permission (admin)
- `PATCH /apm/permissions/:id` — Update permission (admin)
- `DELETE /apm/permissions/:id` — Remove permission (admin)

### Role Assignments
- `GET /apm/role-assignments` — List (admin)
- `GET /apm/role-assignments/:id` — Get (admin)
- `POST /apm/role-assignments` — Create (admin)
- `PATCH /apm/role-assignments/:id` — Update (admin)
- `DELETE /apm/role-assignments/:id` — Remove (admin)

### Geography Assignments
- `GET /apm/geography-assignments` — List (admin)
- `GET /apm/geography-assignments/:id` — Get (admin)
- `POST /apm/geography-assignments` — Create (admin)
- `PATCH /apm/geography-assignments/:id` — Update (admin)
- `DELETE /apm/geography-assignments/:id` — Remove (admin)

### User Devices
- `GET /apm/user-devices` — List (admin)
- `GET /apm/user-devices/:id` — Get (admin)
- `POST /apm/user-devices` — Create (admin)
- `PATCH /apm/user-devices/:id` — Update (admin)
- `DELETE /apm/user-devices/:id` — Remove (admin)

### User Sessions
- `GET /apm/user-sessions` — List (admin)
- `GET /apm/user-sessions/:id` — Get (admin)
- `POST /apm/user-sessions` — Create (admin)
- `PATCH /apm/user-sessions/:id` — Update (admin)
- `DELETE /apm/user-sessions/:id` — Remove (admin)

---

## Geography

### Senatorial Districts *(public read)*
- `GET /apm/senatorial-districts` — List all (no auth)
- `GET /apm/senatorial-districts/:id` — Get one (no auth)
- `POST /apm/senatorial-districts` — Create (admin)
- `PATCH /apm/senatorial-districts/:id` — Update (admin)
- `DELETE /apm/senatorial-districts/:id` — Remove (admin)

### LGAs *(public read)*
- `GET /apm/lgas` — List all (no auth)
- `GET /apm/lgas/:id` — Get one (no auth)
- `POST /apm/lgas` — Create (admin)
- `PATCH /apm/lgas/:id` — Update (admin)
- `DELETE /apm/lgas/:id` — Remove (admin)

### Wards *(public read)*
- `GET /apm/wards` — List all (no auth)
- `GET /apm/wards/:id` — Get one (no auth)
- `POST /apm/wards` — Create (admin)
- `PATCH /apm/wards/:id` — Update (admin)
- `DELETE /apm/wards/:id` — Remove (admin)

### Polling Units *(public read)*
- `GET /apm/polling-units` — List all (no auth)
- `GET /apm/polling-units/:id` — Get one (no auth)
- `POST /apm/polling-units` — Create (admin)
- `PATCH /apm/polling-units/:id` — Update (admin)
- `DELETE /apm/polling-units/:id` — Remove (admin)

### Polling Unit Intelligence
- `GET /apm/polling-unit-intelligence` — List (admin)
- `GET /apm/polling-unit-intelligence/:id` — Get (admin)
- `POST /apm/polling-unit-intelligence` — Create (admin)
- `PATCH /apm/polling-unit-intelligence/:id` — Update (admin)
- `DELETE /apm/polling-unit-intelligence/:id` — Remove (admin)

### Polling Unit Intelligence History
- `GET /apm/polling-unit-intelligence-history` — List (admin)
- `GET /apm/polling-unit-intelligence-history/:id` — Get (admin)
- `POST /apm/polling-unit-intelligence-history` — Create (admin)
- `PATCH /apm/polling-unit-intelligence-history/:id` — Update (admin)
- `DELETE /apm/polling-unit-intelligence-history/:id` — Remove (admin)

### Ward Conversion Assessments
- `GET /apm/ward-conversion-assessments` — List (admin)
- `GET /apm/ward-conversion-assessments/:id` — Get (admin)
- `POST /apm/ward-conversion-assessments` — Create (admin)
- `PATCH /apm/ward-conversion-assessments/:id` — Update (admin)
- `DELETE /apm/ward-conversion-assessments/:id` — Remove (admin)

---

## Stakeholder Management

### Stakeholders
- `GET /apm/stakeholders` — List (admin)
- `GET /apm/stakeholders/:id` — Get (admin)
- `POST /apm/stakeholders` — Create (admin)
- `PATCH /apm/stakeholders/:id` — Update (admin)
- `DELETE /apm/stakeholders/:id` — Remove (admin)

### Stakeholder Engagements
- `GET /apm/stakeholder-engagements` — List (admin)
- `GET /apm/stakeholder-engagements/:id` — Get (admin)
- `POST /apm/stakeholder-engagements` — Create (admin)
- `PATCH /apm/stakeholder-engagements/:id` — Update (admin)
- `DELETE /apm/stakeholder-engagements/:id` — Remove (admin)

---

## Canvassing

### Canvassing Reports
- `GET /apm/canvassing-reports` — List (admin)
- `GET /apm/canvassing-reports/:id` — Get (admin)
- `POST /apm/canvassing-reports` — Create (admin)
- `PATCH /apm/canvassing-reports/:id` — Update (admin)
- `DELETE /apm/canvassing-reports/:id` — Remove (admin)

#### Custom Methods
- `POST /apm/canvassing-reports/summary` — Get summary statistics *(returns 200)*
- `POST /apm/canvassing-reports/:id/lga-stats` — Get LGA-level stats *(returns 200)*

---

## Volunteer Management

### Volunteers
- `GET /apm/volunteers` — List (admin)
- `GET /apm/volunteers/:id` — Get (admin)
- `POST /apm/volunteers` — Create (admin)
- `PATCH /apm/volunteers/:id` — Update (admin)
- `DELETE /apm/volunteers/:id` — Remove (admin)

### Volunteer Assignments
- `GET /apm/volunteer-assignments` — List (admin)
- `GET /apm/volunteer-assignments/:id` — Get (admin)
- `POST /apm/volunteer-assignments` — Create (admin)
- `PATCH /apm/volunteer-assignments/:id` — Update (admin)
- `DELETE /apm/volunteer-assignments/:id` — Remove (admin)

### Volunteer Activities
- `GET /apm/volunteer-activities` — List (admin)
- `GET /apm/volunteer-activities/:id` — Get (admin)
- `POST /apm/volunteer-activities` — Create (admin)
- `PATCH /apm/volunteer-activities/:id` — Update (admin)
- `DELETE /apm/volunteer-activities/:id` — Remove (admin)

---

## Tasks
- `GET /apm/tasks` — List (admin)
- `GET /apm/tasks/:id` — Get (admin)
- `POST /apm/tasks` — Create (admin)
- `PATCH /apm/tasks/:id` — Update (admin)
- `DELETE /apm/tasks/:id` — Remove (admin)

---

## Campaign Content

### Content Items *(public read)*
- `GET /apm/content-items` — List all published (no auth)
- `GET /apm/content-items/:id` — Get one (no auth)
- `POST /apm/content-items` — Create (admin)
- `PATCH /apm/content-items/:id` — Update (admin)
- `DELETE /apm/content-items/:id` — Remove (admin)

### Content Approval Events
- `GET /apm/content-approval-events` — List (admin)
- `GET /apm/content-approval-events/:id` — Get (admin)
- `POST /apm/content-approval-events` — Create (admin)
- `PATCH /apm/content-approval-events/:id` — Update (admin)
- `DELETE /apm/content-approval-events/:id` — Remove (admin)

### Content Distributions
- `GET /apm/content-distributions` — List (admin)
- `GET /apm/content-distributions/:id` — Get (admin)
- `POST /apm/content-distributions` — Create (admin)
- `PATCH /apm/content-distributions/:id` — Update (admin)
- `DELETE /apm/content-distributions/:id` — Remove (admin)

### WhatsApp Groups
- `GET /apm/whatsapp-groups` — List (admin)
- `GET /apm/whatsapp-groups/:id` — Get (admin)
- `POST /apm/whatsapp-groups` — Create (admin)
- `PATCH /apm/whatsapp-groups/:id` — Update (admin)
- `DELETE /apm/whatsapp-groups/:id` — Remove (admin)

---

## Rapid Response

### Rapid Response Issues
- `GET /apm/rapid-response-issues` — List (admin)
- `GET /apm/rapid-response-issues/:id` — Get (admin)
- `POST /apm/rapid-response-issues` — Create (admin)
- `PATCH /apm/rapid-response-issues/:id` — Update (admin)
- `DELETE /apm/rapid-response-issues/:id` — Remove (admin)

### Rapid Response Actions
- `GET /apm/rapid-response-actions` — List (admin)
- `GET /apm/rapid-response-actions/:id` — Get (admin)
- `POST /apm/rapid-response-actions` — Create (admin)
- `PATCH /apm/rapid-response-actions/:id` — Update (admin)
- `DELETE /apm/rapid-response-actions/:id` — Remove (admin)

---

## Candidate Events

### Candidate Events
- `GET /apm/candidate-events` — List (admin)
- `GET /apm/candidate-events/:id` — Get (admin)
- `POST /apm/candidate-events` — Create (admin)
- `PATCH /apm/candidate-events/:id` — Update (admin)
- `DELETE /apm/candidate-events/:id` — Remove (admin)

### Event Participants
- `GET /apm/event-participants` — List (admin)
- `GET /apm/event-participants/:id` — Get (admin)
- `POST /apm/event-participants` — Create (admin)
- `PATCH /apm/event-participants/:id` — Update (admin)
- `DELETE /apm/event-participants/:id` — Remove (admin)

### Event Reports
- `GET /apm/event-reports` — List (admin)
- `GET /apm/event-reports/:id` — Get (admin)
- `POST /apm/event-reports` — Create (admin)
- `PATCH /apm/event-reports/:id` — Update (admin)
- `DELETE /apm/event-reports/:id` — Remove (admin)

### Event Commitments
- `GET /apm/event-commitments` — List (admin)
- `GET /apm/event-commitments/:id` — Get (admin)
- `POST /apm/event-commitments` — Create (admin)
- `PATCH /apm/event-commitments/:id` — Update (admin)
- `DELETE /apm/event-commitments/:id` — Remove (admin)

---

## Polling Unit Agents

### Polling Unit Agents
- `GET /apm/polling-unit-agents` — List (admin)
- `GET /apm/polling-unit-agents/:id` — Get (admin)
- `POST /apm/polling-unit-agents` — Create (admin)
- `PATCH /apm/polling-unit-agents/:id` — Update (admin)
- `DELETE /apm/polling-unit-agents/:id` — Remove (admin)

### Agent Assignments
- `GET /apm/agent-assignments` — List (admin)
- `GET /apm/agent-assignments/:id` — Get (admin)
- `POST /apm/agent-assignments` — Create (admin)
- `PATCH /apm/agent-assignments/:id` — Update (admin)
- `DELETE /apm/agent-assignments/:id` — Remove (admin)

### Agent Training Records
- `GET /apm/agent-training-records` — List (admin)
- `GET /apm/agent-training-records/:id` — Get (admin)
- `POST /apm/agent-training-records` — Create (admin)
- `PATCH /apm/agent-training-records/:id` — Update (admin)
- `DELETE /apm/agent-training-records/:id` — Remove (admin)

### Agent Readiness Checklists
- `GET /apm/agent-readiness-checklists` — List (admin)
- `GET /apm/agent-readiness-checklists/:id` — Get (admin)
- `POST /apm/agent-readiness-checklists` — Create (admin)
- `PATCH /apm/agent-readiness-checklists/:id` — Update (admin)
- `DELETE /apm/agent-readiness-checklists/:id` — Remove (admin)

---

## Election Day Reports

### Election Day Reports
- `GET /apm/election-day-reports` — List (admin)
- `GET /apm/election-day-reports/:id` — Get (admin)
- `POST /apm/election-day-reports` — Create (admin)
- `PATCH /apm/election-day-reports/:id` — Update (admin)
- `DELETE /apm/election-day-reports/:id` — Remove (admin)

---

## Incident Management

### Incidents
- `GET /apm/incidents` — List (admin)
- `GET /apm/incidents/:id` — Get (admin)
- `POST /apm/incidents` — Create (admin, idempotent)
- `PATCH /apm/incidents/:id` — Update (admin)
- `DELETE /apm/incidents/:id` — Remove (admin)

#### Custom Methods
- `POST /apm/incidents/summary` — Get incident summary by ward *(returns 200)*
- `POST /apm/incidents/:id/escalate` — Escalate incident *(returns 200)*

### Escalations
- `GET /apm/escalations` — List (admin)
- `GET /apm/escalations/:id` — Get (admin)
- `POST /apm/escalations` — Create (admin)
- `PATCH /apm/escalations/:id` — Update (admin)
- `DELETE /apm/escalations/:id` — Remove (admin)

---

## Results Management

### Election Results
- `GET /apm/election-results` — List (admin)
- `GET /apm/election-results/:id` — Get (admin)
- `POST /apm/election-results` — Create (admin, idempotent)
- `PATCH /apm/election-results/:id` — Update (admin)
- `DELETE /apm/election-results/:id` — Remove (admin)

#### Custom Methods
- `POST /apm/election-results/:id/verify` — Mark result as verified *(returns 200)*
- `POST /apm/election-results/:id/reject` — Mark result as rejected *(returns 200)*
- `POST /apm/election-results/dashboard` — Get dashboard statistics *(returns 200)*
- `POST /apm/election-results/reconcile` — Reconcile results with verified data *(returns 200)*

### Result Verifications
- `GET /apm/result-verifications` — List (admin)
- `GET /apm/result-verifications/:id` — Get (admin)
- `POST /apm/result-verifications` — Create (admin)
- `PATCH /apm/result-verifications/:id` — Update (admin)
- `DELETE /apm/result-verifications/:id` — Remove (admin)

### Result Reconciliations
- `GET /apm/result-reconciliations` — List (admin)
- `GET /apm/result-reconciliations/:id` — Get (admin)
- `POST /apm/result-reconciliations` — Create (admin)
- `PATCH /apm/result-reconciliations/:id` — Update (admin)
- `DELETE /apm/result-reconciliations/:id` — Remove (admin)

---

## Media Files
- `GET /apm/media-files` — List (admin)
- `GET /apm/media-files/:id` — Get (admin)
- `POST /apm/media-files` — Create (admin)
- `PATCH /apm/media-files/:id` — Update (admin)
- `DELETE /apm/media-files/:id` — Remove (admin)

---

## Notifications
- `GET /apm/notifications` — List (admin)
- `GET /apm/notifications/:id` — Get (admin)
- `POST /apm/notifications` — Create (admin)
- `PATCH /apm/notifications/:id` — Update (admin)
- `DELETE /apm/notifications/:id` — Remove (admin)

---

## Sync Operations
- `GET /apm/sync-operations` — List (admin)
- `GET /apm/sync-operations/:id` — Get (admin)
- `POST /apm/sync-operations` — Create (admin)
- `PATCH /apm/sync-operations/:id` — Update (admin)
- `DELETE /apm/sync-operations/:id` — Remove (admin)

---

## Reports & Dashboards

### Generated Reports
- `GET /apm/generated-reports` — List (admin)
- `GET /apm/generated-reports/:id` — Get (admin)
- `POST /apm/generated-reports` — Create (admin)
- `PATCH /apm/generated-reports/:id` — Update (admin)
- `DELETE /apm/generated-reports/:id` — Remove (admin)

### Dashboard Snapshots
- `GET /apm/dashboard-snapshots` — List (admin)
- `GET /apm/dashboard-snapshots/:id` — Get (admin)
- `POST /apm/dashboard-snapshots` — Create (admin)
- `PATCH /apm/dashboard-snapshots/:id` — Update (admin)
- `DELETE /apm/dashboard-snapshots/:id` — Remove (admin)

---

## System

### Audit Logs
- `GET /apm/audit-logs` — List (admin)
- `GET /apm/audit-logs/:id` — Get (admin)
- `POST /apm/audit-logs` — Create (admin)
- `PATCH /apm/audit-logs/:id` — Update (admin)
- `DELETE /apm/audit-logs/:id` — Remove (admin)

### Data Exports
- `GET /apm/data-exports` — List (admin)
- `GET /apm/data-exports/:id` — Get (admin)
- `POST /apm/data-exports` — Create (admin)
- `PATCH /apm/data-exports/:id` — Update (admin)
- `DELETE /apm/data-exports/:id` — Remove (admin)

### System Settings
- `GET /apm/system-settings` — List (admin)
- `GET /apm/system-settings/:id` — Get (admin)
- `POST /apm/system-settings` — Create (admin)
- `PATCH /apm/system-settings/:id` — Update (admin)
- `DELETE /apm/system-settings/:id` — Remove (admin)

---

## Query Parameters

All `find` endpoints support:

| Parameter | Type     | Description |
|-----------|----------|-------------|
| `$skip`   | integer  | Records to skip (default: 0) |
| `$limit`  | integer  | Records per page (default: 20, max: 200) |
| `$sort`   | object   | Sort criteria e.g. `{ "createdAt": -1 }` |
| `$select` | string[] | Fields to include |
| `$search` | string   | Text search query |
| `field`   | any      | Filter by exact field match |

### Example: Filter by field
```
GET /apm/incidents?severity=high&wardId=abc123
```

### Example: Pagination with sort
```
GET /apm/incidents?$skip=0&$limit=10&$sort[createdAt]=-1
```
