# Task: Contacts Module

## Module Name

`contacts`

## Prisma Model Fields

| Field      | Type     | Notes                                |
| ---------- | -------- | ------------------------------------ |
| id         | String   | UUID, auto-generated                 |
| firstName  | String   | required                             |
| lastName   | String   | required                             |
| email      | String   | unique, required                     |
| phone      | String?  | optional                             |
| company    | String?  | optional                             |
| status     | Enum     | lead / prospect / customer / churned |
| assignedTo | Relation | → User (optional)                    |
| notes      | String?  | optional, long text                  |
| createdAt  | DateTime | auto                                 |
| updatedAt  | DateTime | auto                                 |
| deletedAt  | DateTime | soft delete                          |

## Backend Endpoints Needed

- `POST /contacts` — create contact
- `GET /contacts` — list all (paginated, filterable by status)
- `GET /contacts/:id` — get single contact
- `PATCH /contacts/:id` — update contact
- `DELETE /contacts/:id` — soft delete

## Frontend Pages Needed

- `/contacts` — data table with columns: name, email, company, status, assignedTo, createdAt
  - Filter bar: by status, by assignedTo
  - Search: by name or email
  - "Add Contact" button → opens dialog form
  - Row actions: view, edit, delete

- `/contacts/:id` — contact detail page
  - All fields displayed
  - Edit button → inline edit or modal
  - Activity timeline (placeholder for now)

## Shared Components to Create (if not existing)

- `<StatusBadge status={...} />` — colored badge: lead=blue, prospect=yellow, customer=green, churned=red
- `<DataTable />` — reusable sortable + filterable table with TanStack Table

## Business Rules

- Email must be unique across all contacts
- `assignedTo` defaults to the currently authenticated user if not specified
- Soft delete only — never hard delete contacts
- Status transitions: lead → prospect → customer (churned from any)

## Special Notes

- Use optimistic updates for status changes (feels instant in the UI)
- The contacts list is the main landing page of the CRM after login
