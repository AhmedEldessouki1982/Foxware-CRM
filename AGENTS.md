# opencod3 — CRM Project

A full-stack CRM system with AI-powered features.

## Project Structure

```
my-landing/                  ← project root
├── .opencode/agents/        ← OpenCode agent definitions
├── .tasks/                  ← task specs per feature (gitignored)
├── backend/                 ← NestJS API
├── frontend/                ← React SPA
├── dev.sh                   ← starts both frontend and backend
└── run-agents.sh            ← runs agent pipeline for a task
```

---

## Backend

**Runtime:** Node.js + NestJS 11 + TypeScript 5.7

**Key packages:**

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` — framework
- `@nestjs/swagger` + `swagger-ui-express` — API docs at `/api`
- `@nestjs/config` — environment variables
- `class-validator` + `class-transformer` — DTO validation
- `jest` + `supertest` — testing

**Still needs installing (add when scaffolding):**

- `prisma` + `@prisma/client` — ORM (run `npx prisma init` first time)
- `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt` — auth
- `bcrypt` — password hashing

### Backend Architecture (strict — never deviate)

```
Controller → Service → Repository → Prisma
```

- **Controller** — HTTP only. No business logic. Calls service methods only.
- **Service** — All business logic. Never imports PrismaService directly.
- **Repository** — Only layer that touches Prisma. One repository per module.
- **DTO** — Every input validated with class-validator. Every field has `@ApiProperty()`.

### File Structure Per Module

```
backend/src/<module>/
├── <module>.module.ts
├── <module>.controller.ts
├── <module>.service.ts
├── <module>.repository.ts
├── <module>.types.ts          ← enums, interfaces
└── dto/
    ├── create-<module>.dto.ts
    └── update-<module>.dto.ts
```

### Naming Conventions

- Files: `kebab-case.type.ts` (e.g. `contacts.service.ts`)
- Classes: `PascalCase` (e.g. `ContactsService`)
- Methods: `camelCase`
- DB fields: `camelCase` in Prisma schema

### Controller Rules

```typescript
@Controller("contacts")
@ApiTags("Contacts")
@ApiBearerAuth()
export class ContactsController {
  // Every endpoint MUST have:
  // @ApiOperation({ summary: '...' })
  // @ApiResponse({ status: X })
  // ID params MUST use ParseUUIDPipe
}
```

### Service Rules

```typescript
// findOne MUST throw NotFoundException if not found
async findOne(id: string) {
  const record = await this.contactsRepository.findById(id);
  if (!record) throw new NotFoundException(`Contact ${id} not found`);
  return record;
}
```

### DTO Rules

```typescript
// UpdateDTO always extends PartialType — never manually redefined
export class UpdateContactDto extends PartialType(CreateContactDto) {}
```

### Prisma Rules

- Every model has: `id String @id @default(uuid())`
- Every model has: `createdAt DateTime @default(now())`
- Every model has: `updatedAt DateTime @updatedAt`
- Every model has: `deletedAt DateTime?` — soft delete, never hard delete
- `findAll` always filters `where: { deletedAt: null }`

### Testing

- Unit tests: `<module>.service.spec.ts` alongside the service
- E2E tests: `backend/test/<module>.e2e-spec.ts`
- Run unit: `cd backend && npm test`
- Run e2e: `cd backend && npm run test:e2e`
- Mock PrismaService via jest — never hit real DB in unit tests

---

## Frontend

**Runtime:** React 19 + Vite 8 + TypeScript 6

**Key packages installed:**

- `framer-motion` 12 — animations (required on every page)
- `@tanstack/react-query` 5 — all data fetching
- `lucide-react` — icons
- `sonner` — toast notifications
- `@radix-ui/*` — headless primitives (accordion, dialog, label, tabs)
- `clsx` + `tailwind-merge` — class utilities
- `class-variance-authority` — component variants

**Still needs installing (add when scaffolding):**

- `@tanstack/react-router` — routing (file-based, fully typed)
- `react-hook-form` — forms
- `zod` — schema validation
- `@hookform/resolvers` — connects zod to react-hook-form
- `@tanstack/react-router` — routing (file-based, fully typed)

**NOT installed — do not use:**

- Redux, MobX, Zustand — no global state library yet
- Axios — use native fetch
- React Query v4 — already on v5, use v5 API
- react-router-dom — project uses TanStack Router instead

### Frontend Architecture

```
pages/          ← route-level components
components/
  shared/       ← reusable across features (DataTable, StatusBadge, etc.)
  <module>/     ← feature-specific components
hooks/          ← TanStack Query hooks, one file per module
types/          ← Zod schemas + inferred TypeScript types
lib/
  utils.ts      ← cn() helper and shared utilities
  api.ts        ← base fetch wrapper with auth headers
```

### Styling Rules

- **Tailwind CSS** — utility classes only, no inline styles
- Dark mode default — `bg-zinc-950` base, `text-zinc-100` primary text
- Every page has at least one Framer Motion animation:
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
  ```
- All interactive elements: `transition-all duration-300`
- Use `cn()` from `lib/utils.ts` for conditional classes

### Data Fetching Rules

- **Always** use TanStack Query — never raw `useEffect + fetch`
- API calls live in `hooks/use-<module>.ts` — never inside components
- All API responses validated with Zod before use
- Query keys are always arrays: `['contacts']`, `['contacts', id]`
- Mutations invalidate relevant queries on success

### Component Rules

- Forms: `react-hook-form` + Zod resolver — never manual `useState` for forms
- Loading states: always show skeleton or spinner
- Error states: always show error message to user
- Empty states: always show empty state with CTA
- Toast notifications: use `sonner` — `toast.success()`, `toast.error()`

### Shared Components (create if missing, reuse if exists)

- `<DataTable />` — sortable, filterable, paginated table
- `<StatusBadge />` — colored badge for enum status fields
- `<ConfirmDialog />` — confirmation before destructive actions
- `<PageHeader />` — page title + primary action button
- `<EmptyState />` — empty list with icon + message + CTA
- `<LoadingSkeleton />` — skeleton placeholder during fetch

---

## Environment Variables

Backend `.env` (never commit):

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=3000
```

Frontend `.env` (never commit):

```
VITE_API_URL=http://localhost:3000
```

---

## CRM Domain Context

This is a CRM (Customer Relationship Management) system. Core entities:

- **Contacts** — people (leads, prospects, customers)
- **Companies** — organizations contacts belong to
- **Deals** — sales opportunities with pipeline stages
- **Activities** — calls, emails, meetings, notes
- **Users** — CRM users (sales reps, managers)
- **Pipeline** — deal stages configuration

Status enums follow this pattern:

- Contact status: `lead → prospect → customer → churned`
- Deal status: `open → won → lost`
- Activity type: `call | email | meeting | note | task`

---

## Commands

```bash
# Development
./dev.sh                          # start both frontend and backend

# Backend only
cd backend && npm run start:dev   # NestJS with hot reload
cd backend && npm test            # unit tests
cd backend && npm run test:e2e    # e2e tests

# Frontend only
cd frontend && npm run dev        # Vite dev server

# Agent pipeline
./run-agents.sh .tasks/<file>.md           # run all 4 phases
./run-agents.sh .tasks/<file>.md --skip-tests  # skip test phase
```

---

## Important Notes for Agents

1. **Check before installing** — verify a package isn't already installed before adding it
2. **Prisma first** — if a module needs DB access, update `prisma/schema.prisma` first, then run `npx prisma generate`
3. **Never hard delete** — always soft delete via `deletedAt`
4. **No `any` types** — TypeScript strict mode, all types must be explicit
5. **Import paths** — backend uses `tsconfig-paths`, use `@/` alias if configured
6. **Auth** — all API endpoints require JWT auth except `/auth/login` and `/auth/register`
