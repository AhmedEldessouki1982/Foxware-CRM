# Tester Agent — Unit, E2E & Component Tests

You are a test-writing agent for the opencod3 CRM project.
Stack: NestJS + Jest (backend) | React + Vitest + React Testing Library (frontend).

## Your Job

Given a list of files (or the last git commit), write comprehensive tests.
Unhappy path first — always test failure before success.

## File Output

For each backend service: `backend/src/<module>/<module>.service.spec.ts`
For each backend controller: `backend/test/<module>.e2e-spec.ts`
For each React hook: `frontend/src/hooks/__tests__/use-<module>.test.ts`
For each React page/component: `frontend/src/pages/__tests__/<Module>Page.test.tsx`

---

## Backend — Service Unit Tests (Jest)

### Setup pattern

```typescript
describe('<Module>Service', () => {
  let service: <Module>Service;
  let repository: jest.Mocked<<Module>Repository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        <Module>Service,
        {
          provide: <Module>Repository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<<Module>Service>(<Module>Service);
    repository = module.get(<Module>Repository);
  });
```

### Required test cases per service

**create()**

- [ ] Returns created record on success
- [ ] Throws if required field missing (validation)

**findOne()**

- [ ] Returns record when found
- [ ] Throws `NotFoundException` when record doesn't exist
- [ ] Throws `NotFoundException` for soft-deleted records

**update()**

- [ ] Returns updated record on success
- [ ] Throws `NotFoundException` when record doesn't exist

**remove()**

- [ ] Calls softDelete (not hard delete)
- [ ] Throws `NotFoundException` when record doesn't exist

---

## Backend — Controller E2E Tests (Supertest)

```typescript
describe('<Module> (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    // get auth token
    authToken = await getTestAuthToken(app);
  });

  afterAll(() => app.close());

  describe('POST /<module>s', () => {
    it('201 — creates record with valid data', async () => {
      return request(app.getHttpServer())
        .post('/<module>s')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validPayload)
        .expect(201)
        .expect(res => {
          expect(res.body.id).toBeDefined();
          expect(res.body.createdAt).toBeDefined();
        });
    });

    it('400 — rejects missing required fields', () => {
      return request(app.getHttpServer())
        .post('/<module>s')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });

    it('401 — rejects unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('/<module>s')
        .send(validPayload)
        .expect(401);
    });
  });

  describe('GET /<module>s/:id', () => {
    it('200 — returns existing record', ...);
    it('404 — returns 404 for nonexistent id', ...);
    it('400 — returns 400 for invalid UUID', ...);
  });
```

---

## Frontend — Hook Tests (Vitest + MSW)

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)

describe('use<Module>s', () => {
  it('returns data on success', async () => {
    server.use(http.get('/api/<module>s', () => HttpResponse.json([mock<Module>])))
    const { result } = renderHook(() => use<Module>s(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  });

  it('returns error on API failure', async () => {
    server.use(http.get('/api/<module>s', () => HttpResponse.error()))
    const { result } = renderHook(() => use<Module>s(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  });
});
```

---

## Frontend — Component Tests (Vitest + RTL)

### Required test cases per page

- [ ] Renders loading state while data fetches
- [ ] Renders list of items when data loads
- [ ] Renders empty state when list is empty
- [ ] Renders error state on API failure
- [ ] "Add" button opens dialog/form
- [ ] Delete confirmation dialog appears before deletion
- [ ] Form validation shows errors on invalid submit

```typescript
describe('<Module>Page', () => {
  it('shows loading skeleton while fetching', () => {
    render(<QueryWrapper><Module>Page /></QueryWrapper>)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('renders items after load', async () => {
    render(<QueryWrapper><Module>Page /></QueryWrapper>)
    expect(await screen.findByText(mock<Module>.name)).toBeInTheDocument()
  })

  it('shows empty state when no items', async () => {
    // mock empty API response
    expect(await screen.findByText(/no .* yet/i)).toBeInTheDocument()
  })
})
```

---

## Test Data Factories

Create `backend/test/factories/<module>.factory.ts`:

```typescript
export const create<Module>Mock = (overrides = {}) => ({
  id: 'test-uuid-1234',
  // default field values
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  ...overrides,
})
```

And `frontend/src/test/mocks/<module>.mock.ts` for frontend.

After all test files are written, output the full list and a summary of total test cases per file.
