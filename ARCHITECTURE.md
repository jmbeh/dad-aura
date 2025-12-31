# Dad Aura - Architecture

> **Purpose:** System architecture and design decisions
> - Component structure and data flow
> - Integration points and patterns
> - Technical structure and conventions

## Overview

Dad Aura is a Next.js 14+ web application that enables real-time aura tracking through SMS input and a web dashboard. The system uses Supabase for data storage and real-time updates, and Vonage for SMS webhook handling.

## Components

### Frontend (Next.js App Router)

**Main Page (`app/page.tsx`)**
- Dashboard container component
- Manages real-time subscriptions to Supabase
- Coordinates data fetching and state management
- Renders all child components

**Core Components (`components/`)**
- `AuraScore.tsx` - Large current score display with animations
- `AuraTrends.tsx` - Chart components for 7-day and 30-day trends
- `ActivityFeed.tsx` - Recent aura events list with real-time updates
- `DadFlipButton.tsx` - Flip functionality UI
- `FlipConfigPanel.tsx` - Son's control panel for flip limits
- `DadTribunal.tsx` - AI-powered verdict system
- `EmojiGuide.tsx` - Expandable emoji reference
- `ErrorBoundary.tsx` - React error boundary for graceful error handling
- `SkeletonLoader.tsx` - Loading state components
- `LogoutButton.tsx` - Authentication logout

### Backend (API Routes)

**`app/api/aura/route.ts`**
- GET: Fetch aura events with optional date filtering
- POST: Create new aura event
- DELETE: Remove aura event by ID

**`app/api/sms-webhook/route.ts`**
- POST: Handle incoming SMS from Vonage
- Parses emoji and points from message text
- Creates aura event in database
- Returns acknowledgment response

**`app/api/flip/route.ts`**
- GET: Get flip status (can dad flip today?)
- POST: Perform a flip operation
- Validates current total before flipping

**`app/api/flip-config/route.ts`**
- GET: Get flip configuration (max flips per day)
- PUT: Update flip configuration (son only)

**`app/api/dad-tribunal/route.ts`**
- POST: Generate AI verdict using OpenAI GPT-4o
- Safety check using Anthropic Claude
- Returns formatted verdict with points and explanation
- PUT: Save verdict to database

**`app/api/login/route.ts`** & **`app/api/logout/route.ts`**
- Simple password-based authentication
- Cookie-based session management

### Libraries (`lib/`)

**`supabase.ts`**
- Supabase client initialization
- Lazy initialization to prevent build-time crashes
- Proxy pattern for edge runtime compatibility

**`aura-calculator.ts`**
- Calculate current total from all events
- Compute daily trends (7-day, 30-day)
- Calculate cumulative trends for line charts
- Get aura status labels based on total

**`emoji-parser.ts`**
- Parse SMS messages to extract emoji and points
- Handle multiple input formats (emoji+number, number+emoji, emoji-only)
- Emoji preset mappings
- Input validation and sanitization

**`flip-manager.ts`**
- Manage flip configuration
- Track daily flip usage
- Perform flip operations
- Create flip events in database

**`rate-limiter.ts`**
- In-memory rate limiting for API routes
- Configurable windows and limits
- IP-based tracking with endpoint scoping

## Data Flow

### SMS Input Flow

1. Son sends SMS from Apple Watch → Vonage receives SMS
2. Vonage webhook → `POST /api/sms-webhook`
3. Parse SMS text → Extract emoji and points
4. Create `aura_events` record in Supabase
5. Supabase real-time → Broadcasts INSERT event
6. Frontend subscription → Receives update
7. Dashboard → Refetches data and updates UI

### Flip Flow

1. Dad clicks "Flip Now" → `POST /api/flip`
2. Validate flip eligibility (check daily limit)
3. Calculate flipped total (multiply by -1)
4. Create `dad_flips` record
5. Create `aura_events` record with flip emoji (🔄)
6. Supabase real-time → Broadcasts INSERT event
7. Dashboard → Updates instantly

### Real-Time Updates

- Supabase real-time subscriptions listen to `postgres_changes` on `aura_events` table
- Any INSERT/UPDATE/DELETE triggers a refresh
- Frontend refetches all data to ensure consistency
- Optimistic updates could be added in future

## Database Schema

### `aura_events` Table

```sql
CREATE TABLE aura_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emoji TEXT NOT NULL,
  points INTEGER NOT NULL,
  note TEXT,
  source TEXT NOT NULL CHECK (source IN ('sms', 'web', 'watch', 'shortcut')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_aura_events_timestamp ON aura_events(timestamp DESC);
```

### `dad_flips` Table

```sql
CREATE TABLE dad_flips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  previous_total INTEGER NOT NULL,
  flipped_total INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dad_flips_timestamp ON dad_flips(timestamp DESC);
```

### `flip_config` Table

```sql
CREATE TABLE flip_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  max_flips_per_day INTEGER NOT NULL DEFAULT 2 CHECK (max_flips_per_day >= 0 AND max_flips_per_day <= 10),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Integration Points

### Supabase Integration
- **Real-time:** WebSocket subscriptions for live updates
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Authentication:** Cookie-based (could be enhanced with Supabase Auth)

### Vonage Integration
- **SMS Webhook:** HTTP POST endpoint receives JSON payloads
- **Edge Runtime:** Uses Next.js Edge runtime for faster cold starts
- **Rate Limiting:** 50 requests per 15 minutes

### AI Integration (Dad Tribunal)
- **OpenAI GPT-4o:** Generates verdicts and explanations
- **Anthropic Claude:** Safety checking for age-appropriate content
- **Rate Limiting:** 20 requests per 15 minutes (more restrictive)

## Key Patterns & Conventions

### Error Handling
- React Error Boundaries catch component errors
- API routes return proper HTTP status codes
- User-friendly error messages in UI
- Console logging for debugging

### Rate Limiting
- In-memory rate limiter (consider Redis for production scale)
- Different limits per endpoint based on usage patterns
- Proper HTTP headers (`X-RateLimit-*`, `Retry-After`)

### Input Validation
- SMS parsing validates emoji existence
- Points bounds checking (-100 to +100)
- Note length limits (max 500 chars)
- Type checking in API routes

### Type Safety
- TypeScript strict mode enabled
- API response types defined in `types/api.ts`
- Component prop types defined inline
- Database types inferred from Supabase schema

### Accessibility
- ARIA labels on interactive elements
- Semantic HTML structure
- Focus indicators on all interactive elements
- `prefers-reduced-motion` support for animations
- Screen reader text for emoji-only content

## Technical Constraints

### Edge Runtime Compatibility
- SMS webhook uses Edge runtime for faster cold starts
- Supabase client must be compatible with Edge runtime
- No Node.js-specific APIs in Edge routes

### Real-Time Performance
- Supabase real-time subscriptions require WebSocket support
- Browser compatibility considerations
- Connection retry logic handled by Supabase client

### Rate Limiting
- In-memory rate limiter resets on server restart
- Not distributed (single instance only)
- Consider Redis for production multi-instance deployments

## Security Considerations

### Authentication
- Simple password-based auth (could be enhanced)
- Cookie-based sessions (httpOnly, secure in production)
- Middleware protects routes

### Input Sanitization
- SMS parsing validates and sanitizes input
- Emoji normalization handles encoding variations
- SQL injection prevented by Supabase parameterized queries

### Rate Limiting
- Prevents API abuse
- Protects against DoS attacks
- Different limits for different endpoints

### Content Safety
- AI-generated content checked for age-appropriateness
- Anthropic Claude reviews all tribunal verdicts
- Sanitized responses when content flagged

---

**Last Updated:** 2025-01-XX

<!-- Merged from FLIP_FEATURE.md technical details on 2025-01-XX -->

