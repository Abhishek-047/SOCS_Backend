# SOCS Backend

Enterprise-grade backend foundation for the SOCS cybersecurity platform, built with Node.js, Express.js, Prisma ORM, and MariaDB.

## Architecture

This backend follows a layered structure so responsibilities stay clean as the product grows:

- `routes/`: endpoint wiring only
- `controllers/`: request and response mapping
- `services/`: business workflows and authorization-sensitive logic
- `repositories/`: Prisma-based database access
- `middleware/`: cross-cutting concerns like auth, validation, sanitization, and error handling
- `validators/`: Zod schemas for every public input surface
- `config/`: environment, Prisma, and rate-limiting setup
- `utils/` and `constants/`: shared primitives

The current folder layout is a strong single-service base, while keeping boundaries clean enough to evolve into a larger monorepo later, for example:

```text
apps/
  backend/
packages/
  shared-config/
  shared-types/
  shared-clients/
```

## Folder Structure

```text
SOCS_backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── app.js
├── .env.example
├── package.json
├── README.md
└── server.js
```

## Features

- JWT authentication with `7d` expiry
- `bcryptjs` password hashing
- Role-based access control with `USER` and `ADMIN`
- Prisma ORM on MariaDB
- Fully dynamic REST operations for all Core entities (Projects, Events, Team, Resources, Visuals)
- Pagination, filtering, and deep search capabilities
- Audit logging for login attempts, registration, contact submissions, and admin actions (e.g., entity mutations)
- Rate limiting on auth endpoints
- Helmet, CORS, compression, and request sanitization
- Centralized error handling and structured console logging

## Data Model

- `User`: Standard user and admin accounts
- `Project`: Open-source intelligence and projects
- `Event`: Upcoming and past society workflows/events
- `TeamMember`: Core nodes/operators of the society (Supports fetching by UUID or friendly slug)
- `Resource`: Actionable intelligence links, tools, and writeups
- `Visual`: Dynamic visual asset storage records for the Gallery
- `Contact`: Inquiries and communication mapping
- `AuditLog`: Action tracking for network admins

`ADMIN` accounts should be provisioned through a seed script, database operation, or controlled internal admin workflow. Public registration creates `USER` accounts only.

## Setup

1. Create the database in MariaDB.
2. Copy `.env.example` to `.env` and fill in your values.
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run migrations to initialize the schema:

```bash
npx prisma migrate dev --name init
```

6. Start the server (Dev Mode runs on port 5001):

```bash
npm run dev
```

## Environment Variables

```env
PORT=5001
DATABASE_URL="mysql://root:password@localhost:3306/socs_db"
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Core Entity Modules
All entities support robust querying, filtering, and secure mutation layers. Note: `POST`, `PUT`, and `DELETE` exclusively require an `<admin_token>` Bearer flag.

**Projects**
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

**Events**
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

**Team (Nodes)**
- `GET /api/team`
- `GET /api/team/:id` *(accepts UUID or unique operator slug!)*
- `POST /api/team`
- `PUT /api/team/:id`
- `DELETE /api/team/:id`

**Resources**
- `GET /api/resources`
- `GET /api/resources/:id`
- `POST /api/resources`
- `PUT /api/resources/:id`
- `DELETE /api/resources/:id`

**Visuals (Gallery)**
- `GET /api/visuals`
- `GET /api/visuals/:id`
- `POST /api/visuals`
- `PUT /api/visuals/:id`
- `DELETE /api/visuals/:id`

**Contacts**
- `POST /api/contacts`

## Example Requests

### Register

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Abhishek",
    "email": "abhishek@socs.network",
    "password": "StrongPass123"
  }'
```

### Create Project as Admin

```bash
curl -X POST http://localhost:5001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "title": "Threat Intel Portal",
    "description": "Internal SOC dashboard for threat intelligence workflows.",
    "techStack": ["Node.js", "Express", "MariaDB", "Prisma"],
    "githubLink": "https://github.com/example/threat-intel-portal"
  }'
```

### Initializing a Core Team Node

```bash
curl -X POST http://localhost:5001/api/team \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "slug": "abhishek",
    "name": "Abhishek",
    "role": "Frontend Architect",
    "tier": "Admin",
    "skills": ["React/Next.js", "Node.js", "Cyber Security", "UI/UX Design"]
  }'
```

### List Resources with Filtering

```bash
curl "http://localhost:5001/api/resources?page=1&limit=10&category=roadmap"
```

## Recommended Next Steps

1. Add seed scripts for initial admin creation and demo data.
2. Add integration tests with a dedicated test database (e.g. Jest with SQLite).
3. Introduce refresh tokens and token revocation for multi-device session control protocols.
4. Add OpenAPI/Swagger documentation for frontend and partner integration.
