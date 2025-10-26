# Pro-League Coding Guidelines

## General Principles

### Code Philosophy
1. **Clarity over Cleverness**: Write code that is easy to understand
2. **Consistency**: Follow established patterns in the codebase
3. **Simplicity**: Prefer simple solutions over complex ones
4. **Type Safety**: Leverage TypeScript's type system fully
5. **Testing**: Write tests that give confidence, not just coverage
6. **Documentation**: Code should be self-documenting; add comments only when necessary

### Project-Specific Rules
- **NO Tailwind CSS**: We use Mantine for all styling
- **Shared Types**: Use @pro-league/shared for types used by both frontend and backend
- **Monorepo**: Respect workspace boundaries
- **Docker First**: All services must work in Docker containers

## TypeScript Standards

### Type Safety
```typescript
// ✅ Good: Explicit types
interface UserData {
  name: string
  email: string
  role: 'admin' | 'organizer' | 'player'
}

function createUser(data: UserData): User {
  return new User(data)
}

// ❌ Bad: Using any
function createUser(data: any): any {
  return new User(data)
}
```

### Avoid Any Type
```typescript
// ✅ Good: Proper typing
function handleEvent(event: MouseEvent<HTMLButtonElement>) {
  console.log(event.currentTarget.value)
}

// ❌ Bad: Using any
function handleEvent(event: any) {
  console.log(event.currentTarget.value)
}

// ✅ Acceptable: When truly unknown (rare)
function parseJson(str: string): unknown {
  return JSON.parse(str)
}
```

### Import Aliases by Workspace

Each workspace has its own import alias system:

**Backend (AdonisJS style with `#` prefix):**
```typescript
// ✅ Good: Using backend aliases
import Tournament from '#models/tournament'
import TournamentService from '#services/tournament_service'
import { createTournamentValidator } from '#validators/tournament'
import type { HttpContext } from '@adonisjs/core/http'

// Shared types
import type { ITournament } from '@pro-league/shared'
```

**Frontend (using `@frontend/*`):**
```typescript
// ✅ Good: Using frontend alias
import { TournamentCard } from '@frontend/components/tournaments/TournamentCard'
import { useTournaments } from '@frontend/hooks/useTournaments'

// Shared types
import type { ITournament } from '@pro-league/shared'
```

**Shared Package (using `@shared/*` internally):**
```typescript
// ✅ Good: Internal shared aliases
import type { ITournament } from '@shared/interfaces/ITournament'
import { TournamentStatus } from '@shared/enums/TournamentStatus'

// But external packages import directly from the package
import { ITournament, TournamentStatus } from '@pro-league/shared'
```

### Always Use Shared Types for Cross-Workspace Data
```typescript
// ✅ Good: Using shared types
import { ITournament, TournamentFormat, MatchStatus } from '@pro-league/shared'

// ❌ Bad: Duplicating types in backend or frontend
interface Tournament {
  id: number
  name: string
}
```

### Proper Null Handling
```typescript
// ✅ Good: Explicit null checking
const tournament = await Tournament.find(id)
if (!tournament) {
  throw new Error('Tournament not found')
}

// ❌ Bad: Assuming it exists
const tournament = await Tournament.find(id)
tournament.name // Could be undefined
```

## Naming Conventions

### Variables and Functions
```typescript
// ✅ Good: Descriptive names
const activeTournaments = tournaments.filter(t => t.status === 'active')
function calculateTournamentStandings(matches: Match[]) { }

// ❌ Bad: Unclear names
const arr = tournaments.filter(t => t.status === 'active')
function calc(m: Match[]) { }
```

### Components and Classes
```typescript
// ✅ Good: PascalCase for components/classes
export class TournamentService { }
export function TournamentCard() { }

// ❌ Bad: Incorrect casing
export class tournamentService { }
export function tournamentCard() { }
```

### Files
```typescript
// ✅ Good: kebab-case for files
tournament-service.ts
tournament-card.tsx
use-tournaments.ts

// ❌ Bad: Mixed casing
TournamentService.ts
tournament_card.tsx
UseTournaments.ts
```

### Constants and Enums
```typescript
// ✅ Good: UPPER_SNAKE_CASE for constants
const MAX_TOURNAMENT_SIZE = 64
const API_BASE_URL = process.env.API_URL

// ✅ Good: PascalCase for enums
enum TournamentStatus {
  Draft = 'draft',
  Active = 'active',
  Completed = 'completed',
}
```

## Backend (AdonisJS) Guidelines

### Controller Structure
```typescript
// ✅ Good: Thin controllers
export default class TournamentsController {
  async index({ response }: HttpContext) {
    const tournaments = await TournamentService.getAll()
    return response.ok(tournaments)
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createTournamentValidator)
    const tournament = await TournamentService.create(data)
    return response.created(tournament)
  }
}

// ❌ Bad: Fat controllers with business logic
export default class TournamentsController {
  async store({ request, response }: HttpContext) {
    const data = request.body()
    
    // Don't put complex logic here
    if (!data.name || data.name.length < 3) {
      return response.badRequest({ error: 'Invalid name' })
    }
    
    const tournament = new Tournament()
    tournament.name = data.name
    // ... 50 more lines of logic
  }
}
```

### Service Layer
```typescript
// ✅ Good: Business logic in services
export default class TournamentService {
  static async create(data: CreateTournamentData): Promise<Tournament> {
    const tournament = await Tournament.create(data)
    await this.generateInitialBracket(tournament)
    await this.notifyParticipants(tournament)
    return tournament
  }

  private static async generateInitialBracket(tournament: Tournament) {
    // Complex bracket logic here
  }
}
```

### Database Queries
```typescript
// ✅ Good: Efficient queries with eager loading
const tournaments = await Tournament
  .query()
  .preload('matches', (query) => {
    query.preload('teams')
    query.orderBy('scheduled_at', 'asc')
  })
  .where('status', 'active')
  .paginate(page, perPage)

// ❌ Bad: N+1 queries
const tournaments = await Tournament.all()
for (const tournament of tournaments) {
  await tournament.load('matches') // N+1!
  for (const match of tournament.matches) {
    await match.load('teams') // N+1!
  }
}
```

### Validation
```typescript
// ✅ Good: VineJS validators
export const createTournamentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().optional(),
    startDate: vine.date().afterOrEqual(new Date()),
    format: vine.enum(['single-elimination', 'double-elimination', 'round-robin']),
    maxParticipants: vine.number().min(4).max(256),
  })
)

// ❌ Bad: Manual validation in controllers
if (!request.body().name) {
  return response.badRequest({ error: 'Name required' })
}
if (request.body().name.length < 3) {
  return response.badRequest({ error: 'Name too short' })
}
```

### Error Handling
```typescript
// ✅ Good: Proper HTTP status codes and messages
async show({ params, response }: HttpContext) {
  const tournament = await Tournament.find(params.id)
  
  if (!tournament) {
    return response.notFound({ message: 'Tournament not found' })
  }
  
  return response.ok(tournament)
}

// ✅ Good: Custom exceptions
export class TournamentFullException extends Exception {
  static status = 422
  static code = 'TOURNAMENT_FULL'
  
  constructor() {
    super('Tournament has reached maximum capacity')
  }
}

// ❌ Bad: Generic errors
async show({ params, response }: HttpContext) {
  const tournament = await Tournament.find(params.id)
  return response.ok(tournament) // Could be undefined!
}
```

### Migrations
```typescript
// ✅ Good: Proper up and down methods
export default class extends BaseSchema {
  protected tableName = 'tournaments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.enum('format', ['single-elimination', 'double-elimination', 'round-robin'])
      table.integer('max_participants').unsigned().notNullable()
      table.timestamp('start_date').notNullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

// ❌ Bad: Empty down method
async down() {
  // TODO: implement rollback
}
```

## Frontend (Next.js) Guidelines

### Component Structure
```typescript
// ✅ Good: Well-structured component
'use client'

import { Stack, Title, Text, Button } from '@mantine/core'
import { IconTrophy } from '@tabler/icons-react'
import type { Tournament } from '@pro-league/shared'

interface TournamentCardProps {
  tournament: Tournament
  onJoin?: (id: number) => void
}

export function TournamentCard({ tournament, onJoin }: TournamentCardProps) {
  const handleJoin = () => {
    onJoin?.(tournament.id)
  }

  return (
    <Stack gap="sm" p="md">
      <Title order={3}>{tournament.name}</Title>
      <Text c="dimmed">{tournament.description}</Text>
      <Button
        leftSection={<IconTrophy size={16} />}
        onClick={handleJoin}
      >
        Join Tournament
      </Button>
    </Stack>
  )
}

// ❌ Bad: Large component with multiple responsibilities
export function TournamentPage() {
  // 500 lines of mixed concerns...
}
```

### Server vs Client Components
```typescript
// ✅ Good: Server Component for data fetching
// app/tournaments/page.tsx
import { TournamentList } from '@/components/TournamentList'

async function getTournaments() {
  const res = await fetch('http://backend:3333/api/tournaments')
  return res.json()
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments()
  return <TournamentList tournaments={tournaments} />
}

// ✅ Good: Client Component for interactivity
// components/TournamentList.tsx
'use client'

import { useState } from 'react'
import { TournamentCard } from './TournamentCard'

export function TournamentList({ tournaments }) {
  const [filter, setFilter] = useState('')
  // Interactive logic here
  return (/* ... */)
}
```

### Mantine Styling (NO Tailwind!)
```typescript
// ✅ Good: Using Mantine's sx prop
<Box
  sx={(theme) => ({
    backgroundColor: theme.colors.blue[6],
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    '&:hover': {
      backgroundColor: theme.colors.blue[7],
    },
    [theme.fn.smallerThan('md')]: {
      padding: theme.spacing.sm,
    },
  })}
>
  Content
</Box>

// ✅ Good: Using Mantine props
<Stack gap="md" p="xl" bg="blue.6" />

// ❌ Bad: Tailwind classes (we don't use Tailwind!)
<div className="bg-blue-600 p-4 rounded-md hover:bg-blue-700">
  Content
</div>
```

### Form Handling
```typescript
// ✅ Good: Using @mantine/form
import { useForm } from '@mantine/form'

export function TournamentForm() {
  const form = useForm({
    initialValues: {
      name: '',
      maxParticipants: 16,
    },
    validate: {
      name: (value) => 
        value.length < 3 ? 'Name must be at least 3 characters' : null,
      maxParticipants: (value) =>
        value < 4 ? 'Minimum 4 participants' : null,
    },
  })

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Name"
        {...form.getInputProps('name')}
      />
      <NumberInput
        label="Max Participants"
        {...form.getInputProps('maxParticipants')}
      />
      <Button type="submit">Create</Button>
    </form>
  )
}

// ❌ Bad: Manual state management
export function TournamentForm() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = () => {
    if (name.length < 3) {
      setError('Name too short')
      return
    }
    // ...
  }
  // Complex form logic...
}
```

### Custom Hooks
```typescript
// ✅ Good: Reusable hooks
export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(setTournaments)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  const refresh = useCallback(() => {
    setLoading(true)
    // refetch logic
  }, [])

  return { tournaments, loading, error, refresh }
}

// Use it:
function TournamentList() {
  const { tournaments, loading, error } = useTournaments()
  // ...
}
```

### Loading States
```typescript
// ✅ Good: Proper loading state handling
import { Loader, Center, Alert } from '@mantine/core'

export function TournamentList() {
  const { tournaments, loading, error } = useTournaments()

  if (loading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    )
  }

  if (error) {
    return (
      <Alert color="red" title="Error">
        Failed to load tournaments. Please try again.
      </Alert>
    )
  }

  return (
    <Stack>
      {tournaments.map(t => (
        <TournamentCard key={t.id} tournament={t} />
      ))}
    </Stack>
  )
}

// ❌ Bad: No loading states
export function TournamentList() {
  const { tournaments } = useTournaments()
  return (
    <div>
      {tournaments.map(t => (
        <TournamentCard key={t.id} tournament={t} />
      ))}
    </div>
  )
}
```

## Testing Guidelines

### Backend Tests
```typescript
// ✅ Good: Clear, comprehensive tests
import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'

test.group('Tournaments API', (group) => {
  let user: User
  
  group.each.setup(async () => {
    user = await UserFactory.create()
  })

  test('should list all tournaments', async ({ client, assert }) => {
    await TournamentFactory.createMany(3)
    
    const response = await client.get('/api/tournaments')
    
    response.assertStatus(200)
    assert.lengthOf(response.body().data, 3)
  })

  test('should create tournament with valid data', async ({ client, assert }) => {
    const response = await client
      .post('/api/tournaments')
      .loginAs(user)
      .json({
        name: 'Summer Cup',
        format: 'single-elimination',
        maxParticipants: 16,
      })
    
    response.assertStatus(201)
    assert.properties(response.body(), ['id', 'name', 'format'])
  })

  test('should return 422 for invalid data', async ({ client }) => {
    const response = await client
      .post('/api/tournaments')
      .loginAs(user)
      .json({ name: 'ab' }) // Too short
    
    response.assertStatus(422)
  })
})
```

### Frontend Tests
```typescript
// ✅ Good: Testing user interactions
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TournamentForm } from './TournamentForm'

test('submits form with valid data', async () => {
  const handleSubmit = vi.fn()
  render(<TournamentForm onSubmit={handleSubmit} />)
  
  await userEvent.type(screen.getByLabelText(/name/i), 'Summer Cup')
  await userEvent.selectOptions(screen.getByLabelText(/format/i), 'single-elimination')
  await userEvent.click(screen.getByRole('button', { name: /create/i }))
  
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Summer Cup',
      format: 'single-elimination',
    })
  })
})

test('shows validation error for short name', async () => {
  render(<TournamentForm />)
  
  await userEvent.type(screen.getByLabelText(/name/i), 'ab')
  await userEvent.click(screen.getByRole('button', { name: /create/i }))
  
  expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument()
})
```

## Code Organization

### File Structure
```
# Keep related files together
src/
├── components/
│   ├── tournaments/
│   │   ├── TournamentCard.tsx
│   │   ├── TournamentCard.test.tsx
│   │   ├── TournamentCard.stories.tsx
│   │   ├── TournamentForm.tsx
│   │   ├── TournamentList.tsx
│   │   └── index.ts (barrel export)
│   └── matches/
│       └── ...
```

### Barrel Exports
```typescript
// ✅ Good: Use barrel exports for clean imports
// components/tournaments/index.ts
export { TournamentCard } from './TournamentCard'
export { TournamentForm } from './TournamentForm'
export { TournamentList } from './TournamentList'

// Now you can import:
import { TournamentCard, TournamentList } from '@frontend/components/tournaments'

// ❌ Bad: Long import paths
import { TournamentCard } from '@frontend/components/tournaments/TournamentCard'
import { TournamentList } from '@frontend/components/tournaments/TournamentList'
```

## Performance Guidelines

### Backend Performance
```typescript
// ✅ Good: Pagination for large datasets
async index({ request, response }: HttpContext) {
  const page = request.input('page', 1)
  const perPage = request.input('perPage', 20)
  
  const tournaments = await Tournament
    .query()
    .paginate(page, perPage)
  
  return response.ok(tournaments)
}

// ✅ Good: Indexes for frequently queried fields
// In migration:
table.string('slug').unique()
table.index('status')
table.index(['start_date', 'end_date'])
```

### Frontend Performance
```typescript
// ✅ Good: Memoization when needed
import { memo } from 'react'

export const TournamentCard = memo(function TournamentCard({ tournament }) {
  return (/* ... */)
})

// ✅ Good: Code splitting
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loader />,
})

// ✅ Good: Image optimization
import Image from 'next/image'

<Image
  src="/tournament.jpg"
  alt="Tournament"
  width={800}
  height={600}
  priority
/>
```

## Security Guidelines

### Input Validation
```typescript
// ✅ Good: Always validate input
export const updateTournamentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    status: vine.enum(['draft', 'active', 'completed']).optional(),
  })
)

// ❌ Bad: Trusting user input
async update({ params, request }: HttpContext) {
  const tournament = await Tournament.findOrFail(params.id)
  await tournament.merge(request.all()).save() // Dangerous!
}
```

### Authentication
```typescript
// ✅ Good: Protect routes
router.group(() => {
  router.post('/tournaments', [TournamentsController, 'store'])
  router.patch('/tournaments/:id', [TournamentsController, 'update'])
  router.delete('/tournaments/:id', [TournamentsController, 'destroy'])
}).middleware('auth')

// ✅ Good: Check ownership
async update({ params, auth, request, response }: HttpContext) {
  const tournament = await Tournament.findOrFail(params.id)
  
  if (tournament.ownerId !== auth.user!.id) {
    return response.forbidden({ message: 'Not authorized' })
  }
  
  // ...
}
```

### Environment Variables
```typescript
// ✅ Good: Use env variables for sensitive data
const apiKey = process.env.API_KEY

// ❌ Bad: Hardcoded secrets
const apiKey = 'sk_live_abc123' // Never!
```

## Documentation

### When to Comment
```typescript
// ✅ Good: Comment complex logic
/**
 * Generates tournament brackets using a balanced tree algorithm.
 * Ensures fair distribution of byes for odd number of participants.
 */
function generateBracket(participants: Participant[]): Bracket {
  // Pad to next power of 2 for balanced tree
  const size = Math.pow(2, Math.ceil(Math.log2(participants.length)))
  // ...
}

// ❌ Bad: Obvious comments
// Set the name
tournament.name = 'Summer Cup'

// ❌ Bad: Outdated comments
// TODO: Fix this later (from 2 years ago)
```

### JSDoc for Public APIs
```typescript
// ✅ Good: Document public interfaces
/**
 * Creates a new tournament with the provided data.
 * 
 * @param data - Tournament creation data
 * @returns The created tournament
 * @throws {ValidationException} If data is invalid
 * @throws {TournamentFullException} If max capacity reached
 */
export async function createTournament(data: CreateTournamentData): Promise<Tournament> {
  // ...
}
```

## Git Commit Messages

### Format
```
type(scope): brief description

Longer explanation if needed.

Fixes #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding tests
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### Examples
```
feat(tournaments): add bracket generation

Implements single and double elimination bracket generation
using balanced tree algorithm.

Closes #45

---

fix(auth): prevent token refresh loop

The refresh token was being called recursively.
Added flag to prevent multiple simultaneous refreshes.

Fixes #67

---

refactor(frontend): extract tournament hooks

Moved data fetching logic from components to custom hooks
for better reusability and testing.
```

## Anti-Patterns to Avoid

### General
- ❌ God objects (classes that do too much)
- ❌ Tight coupling between modules
- ❌ Magic numbers and strings
- ❌ Deep nesting (>3 levels)
- ❌ Long functions (>50 lines)
- ❌ Commented-out code

### TypeScript
- ❌ Liberal use of `any`
- ❌ Type assertions everywhere (`as Type`)
- ❌ Ignoring TypeScript errors with `@ts-ignore`

### React
- ❌ Using indexes as keys
- ❌ Mutating state directly
- ❌ Forgetting dependency arrays
- ❌ Too many `useEffect` hooks

### AdonisJS
- ❌ Business logic in controllers
- ❌ Direct database queries in controllers
- ❌ Missing validation
- ❌ Not using transactions

## Remember

1. **NO TAILWIND CSS** - Always use Mantine
2. **Use shared types** from @pro-league/shared
3. **Write tests** for new features
4. **Run linters** before committing
5. **Keep it simple** - Don't over-engineer
6. **Type everything** - No `any` types
7. **Document complex logic** - Keep it clear
8. **Review your code** - Before submitting

---

For specific agent guidelines, see:
- [Backend Developer](.ai/agents/backend-developer.md)
- [Frontend Developer](.ai/agents/frontend-developer.md)
- [Reviewer](.ai/agents/reviewer.md)
