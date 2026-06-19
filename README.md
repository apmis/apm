# APM Campaign Backend — FeathersJS v5

## Overview

Backend for the APM Campaign Digital Command System. Built with FeathersJS v5, KoaJS, MongoDB, TypeBox, and Socket.io. Exposes 49 CRUD services and custom methods at the `/apm/*` path prefix.

## Prerequisites

- Node.js 20+
- MongoDB 6.0+ (replica set required for transactions)
- npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts the server with hot reload at `http://localhost:3030`.

## Build & Production

```bash
npm run build
npm start
```

## Test

```bash
npm test
```

Uses `MongoMemoryReplSet` — no external MongoDB required. 189 integration tests covering all 49 services.

## Seed Data

```bash
npm run seed
```

## API Documentation (Swagger)

Once the server is running, the OpenAPI spec is available at:

- **Swagger UI**: [`http://localhost:3030/docs`](http://localhost:3030/docs)
- **OpenAPI JSON**: [`http://localhost:3030/swagger.json`](http://localhost:3030/swagger.json)

The Swagger UI provides interactive API documentation for all 49 services, including request/response schemas and authentication requirements.

---

## Frontend Integration Guide

### Base URL

```
http://localhost:3030
```

### Authentication

The API uses **JWT-based authentication**. All write operations and most reads require a valid JWT in the `Authorization` header.

#### 1. Login

```
POST /authentication
Content-Type: application/json

{
  "strategy": "local",
  "email": "admin@apm.test",
  "password": "password123"
}
```

Response: `201`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 2. Authenticated Requests

Include the token in every request:

```
Authorization: Bearer <accessToken>
```

### Transport Protocols

#### REST (HTTP)

All services are available via REST at `http://localhost:3030/apm/{service-path}`.

| Method   | Action       | Example                          |
|----------|--------------|----------------------------------|
| `GET`    | `find`       | `GET /apm/users`                 |
| `GET`    | `get`        | `GET /apm/users/:id`             |
| `POST`   | `create`     | `POST /apm/users`                |
| `PATCH`  | `patch`      | `PATCH /apm/users/:id`           |
| `DELETE` | `remove`     | `DELETE /apm/users/:id`          |

#### Socket.io (Real-time)

Connect to the server with Socket.io client:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3030', {
  transportOptions: {
    polling: { extraHeaders: { Authorization: 'Bearer <token>' } },
  },
});

// Standard service calls
socket.emit('create', 'apm/incidents', { ... }, callback);
socket.emit('find', 'apm/roles', { query: {} }, callback);

// Listen for real-time events
socket.on('created', (data) => console.log('created', data));
socket.on('patched', (data) => console.log('patched', data));
socket.on('removed', (data) => console.log('removed', data));
```

### Authorization Levels

| Level | Description | Applied To |
|-------|-------------|------------|
| **Public** | No auth required | `senatorial-districts`, `lgas`, `wards`, `polling-units`, `content-items` (read only) |
| **Authenticated** | Any valid JWT | `users` (self + find) |
| **Admin** | JWT + `apm_admin` permission | All other services (read + write) |

### Service Access Table

| Service Path            | Read Access | Write Access | Public Read |
|-------------------------|-------------|--------------|-------------|
| `apm/users`             | Auth        | Admin        | |
| `apm/roles`             | Admin       | Admin        | |
| `apm/permissions`       | Admin       | Admin        | |
| `apm/role-assignments`  | Admin       | Admin        | |
| `apm/geography-assignments` | Admin   | Admin        | |
| `apm/user-devices`      | Admin       | Admin        | |
| `apm/user-sessions`     | Admin       | Admin        | |
| `apm/senatorial-districts` | Public   | Admin        | yes |
| `apm/lgas`              | Public      | Admin        | yes |
| `apm/wards`             | Public      | Admin        | yes |
| `apm/polling-units`     | Public      | Admin        | yes |
| `apm/polling-unit-intelligence` | Admin | Admin | |
| `apm/polling-unit-intelligence-history` | Admin | Admin | |
| `apm/ward-conversion-assessments` | Admin | Admin | |
| `apm/stakeholders`      | Admin       | Admin        | |
| `apm/stakeholder-engagements` | Admin | Admin | |
| `apm/canvassing-reports`| Admin       | Admin        | |
| `apm/volunteers`        | Admin       | Admin        | |
| `apm/volunteer-assignments` | Admin   | Admin        | |
| `apm/volunteer-activities` | Admin    | Admin        | |
| `apm/tasks`             | Admin       | Admin        | |
| `apm/content-items`     | Public      | Admin        | yes |
| `apm/content-approval-events` | Admin  | Admin        | |
| `apm/content-distributions` | Admin   | Admin        | |
| `apm/whatsapp-groups`   | Admin       | Admin        | |
| `apm/rapid-response-issues` | Admin    | Admin        | |
| `apm/rapid-response-actions` | Admin   | Admin        | |
| `apm/candidate-events`  | Admin       | Admin        | |
| `apm/event-participants`| Admin       | Admin        | |
| `apm/event-reports`     | Admin       | Admin        | |
| `apm/event-commitments` | Admin       | Admin        | |
| `apm/polling-unit-agents` | Admin     | Admin        | |
| `apm/agent-assignments` | Admin       | Admin        | |
| `apm/agent-training-records` | Admin   | Admin        | |
| `apm/agent-readiness-checklists` | Admin | Admin | |
| `apm/election-day-reports` | Admin     | Admin        | |
| `apm/incidents`         | Admin       | Admin        | |
| `apm/escalations`       | Admin       | Admin        | |
| `apm/election-results`  | Admin       | Admin        | |
| `apm/result-verifications` | Admin     | Admin        | |
| `apm/result-reconciliations` | Admin   | Admin        | |
| `apm/media-files`       | Admin       | Admin        | |
| `apm/notifications`     | Admin       | Admin        | |
| `apm/sync-operations`   | Admin       | Admin        | |
| `apm/generated-reports` | Admin       | Admin        | |
| `apm/dashboard-snapshots`| Admin      | Admin        | |
| `apm/audit-logs`        | Admin       | Admin        | |
| `apm/data-exports`      | Admin       | Admin        | |
| `apm/system-settings`   | Admin       | Admin        | |

### Soft Delete

All services support **soft delete**. When a document is removed via `DELETE`, it is not actually deleted from the database but marked with a `deletedAt` timestamp. Subsequent `GET` requests for that document return `404`. The document remains accessible in the database for auditing.

### Pagination

List endpoints (`find`) support pagination via query parameters:

- `$skip` — Number of records to skip (default: 0)
- `$limit` — Maximum records to return (default: 20, max: 200)
- `$sort` — Sort criteria (e.g., `{ "name": 1 }`)

When pagination is active, the response is:

```json
{
  "total": 100,
  "limit": 20,
  "skip": 0,
  "data": [ ... ]
}
```

When pagination is disabled (e.g., in tests), the response is an array.

### Error Handling

Errors follow FeathersJS conventions:

| Status | Meaning         |
|--------|-----------------|
| 200    | Success         |
| 201    | Created         |
| 400    | Bad Request     |
| 401    | Not Authenticated |
| 403    | Forbidden       |
| 404    | Not Found       |
| 405    | Method Not Allowed |
| 409    | Conflict        |
| 422    | Validation Error |
| 500    | Internal Server Error |

Error response body:

```json
{
  "name": "BadRequest",
  "message": "Result is not mathematically valid",
  "code": 400,
  "className": "bad-request",
  "errors": {}
}
```

### Real-time Events

Socket.io clients receive events when data changes:

- `created` — A new document was created
- `patched` — A document was updated
- `removed` — A document was soft-deleted

Event payloads contain the full document.

### Idempotency

Services marked as `idempotent` (incidents, election-results) check for duplicate submissions via the `clientSubmissionId` field. If a record with the same `clientSubmissionId` already exists, the existing record is returned instead of creating a duplicate.
