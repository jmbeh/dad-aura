# Dad_Aura - Plan

> **Purpose:** Requirements, research, and planning document
> - Problem statement and user needs
> - Feature requirements and scope
> - Research findings and decisions
> - NO technical implementation details (see CLAUDE.md for that)

## Problem Statement

A playful, emoji-driven way for my son to express his happiness with me (Dad) through "aura points." The app needs to be accessible from his Apple Watch for quick, spontaneous feedback, and provide visual trends to track our relationship dynamics over time.

## Goals

- **Primary:** Create a fun, low-friction way for son to give real-time feedback on dad's performance using emoji and aura points
- **Secondary:** Build a beautiful, engaging dashboard that shows aura trends (today, 7 days, 30 days) with negative values supported
- **Tertiary:** Enable Apple Watch interaction for maximum spontaneity and convenience

## Non-Goals

- Complex analytics or AI-driven insights
- Multi-user support (just son → dad)
- Gamification beyond aura points (no levels, achievements, etc.)
- Historical data beyond 30 days

## User Stories

- As a son, I want to quickly add aura points from my Apple Watch using emoji so that I can instantly reward dad for being awesome
- As a son, I want to deduct aura points when dad disappoints me so that he knows he needs to step up his game
- As a dad, I want to see my current aura score and trends so that I understand how I'm doing over time
- As a dad, I want to see what actions earned/lost points so that I can learn and improve
- As a son, I want the interaction to be playful and emoji-based so that it feels fun, not serious

## Feature Requirements

### MVP (Must Have)

- [ ] **Aura Dashboard (Web App)**
  - Current aura score (large, prominent display)
  - Trend charts: Today, Last 7 days, Last 30 days
  - Support for negative aura values (can go below zero)
  - Recent activity feed showing emoji, points, timestamp
  - Playful, colorful UI with emoji-heavy design

- [ ] **Apple Watch Input Method**
  - Quick way to send emoji + points from Apple Watch
  - Support both positive (+) and negative (-) point adjustments
  - Minimal friction (1-2 taps/swipes max)

- [ ] **Data Storage**
  - Store aura events: timestamp, emoji, points, optional note
  - Calculate running total and trends
  - Persist data reliably

- [ ] **Emoji System**
  - Predefined emoji → point mappings (e.g., 🔥 = +10, 💩 = -5)
  - Visual emoji picker/selector
  - Display emoji in activity feed

### Implemented Features ✅

- [x] **Dad Flip Power** - Dad can reverse his aura score (e.g., -200 → +200)
  - Son controls how many flips dad gets per day (0-10, default 2)
  - Flips reset daily at midnight
  - Flip events tracked in database and shown in activity feed
  - Real-time updates when flips occur
  - Special purple gradient styling for flip events

### Future (Nice to Have)

- [ ] Push notifications to dad when aura points change
- [ ] Weekly/monthly summary reports
- [ ] Custom emoji → point mappings (let son configure)
- [ ] Photo attachments to aura events
- [ ] Voice notes from Apple Watch
- [ ] Dad's response/reaction feature
- [ ] Aura "milestones" (e.g., reach 100 points)
- [ ] Export data to CSV/JSON
- [ ] Flip history view (see all past flips)
- [ ] Flip analytics (most flipped times, patterns)

## Research & Decisions

### Apple Watch Input Method

**Options Considered:**
1. **SMS/iMessage to Dad's phone** - Son texts emoji + number, app parses it
2. **Dedicated Apple Watch app** - Native watchOS app with emoji picker
3. **Shortcuts + webhook** - Apple Shortcuts on watch triggers API call
4. **Telegram/Discord bot** - Son sends emoji commands to bot

**Decision:** Start with **SMS/iMessage parsing** for MVP, add Shortcuts + webhook as enhancement

**Rationale:**
- SMS requires zero app installation on son's watch
- Can be implemented immediately with Twilio or similar
- Natural interaction: son already texts dad
- Easy to parse emoji + numbers from text
- Can upgrade to dedicated watch app later if needed

### Tech Stack

**Options Considered:**
1. **Next.js + Supabase** - Full-stack React with hosted DB
2. **Next.js + Vercel KV** - Serverless with Redis-like storage
3. **React Native + Firebase** - Cross-platform mobile app
4. **Flask + SQLite** - Python backend with simple DB

**Decision:** **Next.js + Supabase**

**Rationale:**
- Next.js provides beautiful, responsive web UI
- Supabase offers real-time DB, auth, and APIs
- Can add PWA support for mobile-like experience
- Easy to deploy on Vercel (personal account)
- Familiar stack from workspace defaults
- Supabase real-time subscriptions for live updates

### Emoji → Points Mapping

**Options Considered:**
1. **Fixed mappings** - Hardcoded emoji values
2. **User-configurable** - Son sets his own values
3. **AI-interpreted** - LLM determines sentiment/points
4. **Freeform text parsing** - Son types "+10 🔥" or "-5 💩"

**Decision:** **Fixed mappings for MVP, freeform text parsing for flexibility**

**Rationale:**
- Fixed mappings ensure consistency
- Freeform allows son to adjust magnitude ("+20 🔥" vs "+5 🔥")
- Simple regex parsing: extract number and emoji
- Can add configurability later

### Aura Point Ranges

**Options Considered:**
1. **Unbounded** - Can go infinitely positive/negative
2. **Bounded** - Cap at -100 to +100
3. **Asymmetric** - Easier to lose than gain (e.g., -50 to +200)

**Decision:** **Unbounded with visual indicators**

**Rationale:**
- No artificial limits on relationship dynamics
- Visual cues (color changes, emoji) indicate ranges
- More authentic and playful
- Can add "danger zones" in UI (e.g., below -50)

### Data Schema

**Aura Events Table:**
- `id` (UUID, primary key)
- `timestamp` (datetime)
- `emoji` (text)
- `points` (integer, can be negative)
- `note` (text, optional)
- `source` (enum: 'sms', 'web', 'watch', 'shortcut')

**Computed Values:**
- Current total (sum of all points)
- Daily totals (group by date)
- 7-day trend (last 7 days)
- 30-day trend (last 30 days)

## Emoji Presets (MVP)

### Positive Aura (+)
- 🔥 Fire = +10 (awesome dad moment)
- ❤️ Heart = +5 (love you dad)
- 🎉 Party = +15 (epic dad win)
- 👍 Thumbs up = +3 (good job)
- 🌟 Star = +8 (you're shining)
- 💪 Flexed bicep = +7 (strong dad energy)

### Negative Aura (-)
- 💩 Poop = -5 (mild disappointment)
- 😤 Frustrated = -8 (annoyed)
- 👎 Thumbs down = -3 (not cool)
- 😡 Angry = -10 (dad fail)
- 🙄 Eye roll = -4 (seriously?)
- 💔 Broken heart = -12 (really hurt)

### Neutral/Special
- 🤷 Shrug = 0 (meh, neutral)
- 🎯 Target = +20 (bullseye, perfect dad moment)
- ⚡ Lightning = +25 (legendary dad move)

## UI/UX Design Principles

1. **Playful & Colorful** - Bright gradients, emoji-heavy, fun animations
2. **Aura Visualization** - Glowing effect around score, changes color based on value
3. **Trend Charts** - Simple line/bar charts with emoji markers
4. **Mobile-First** - Responsive design, works great on dad's phone
5. **Real-Time Updates** - Dashboard updates instantly when son sends aura
6. **Emoji-Driven** - Every interaction features emoji prominently

## Success Metrics

- Son uses the app at least 3x per week
- Dad checks dashboard daily
- Aura trends show meaningful patterns over time
- Both find it fun and engaging (not a chore)
- Strengthens dad-son communication and connection

## Open Questions

- [x] How should son input aura from Apple Watch? → SMS/iMessage for MVP
- [ ] Should there be a "reason" field for each aura event? (Optional note)
- [ ] Should dad be able to respond or comment on aura events?
- [ ] What happens if aura goes extremely negative (e.g., -100)? Special UI state?
- [ ] Should there be daily limits on aura changes? (e.g., max ±50 per day)
- [ ] Should the app send dad notifications for significant aura changes?
- [ ] Should there be a "reset" or "forgiveness" mechanism?

## Implementation Phases

### Phase 1: Core Dashboard ✅ COMPLETE
- Next.js app with Tailwind
- Supabase setup (DB, auth)
- Aura score display
- Basic trend charts (today, 7d, 30d)
- Activity feed

### Phase 2: SMS Input ✅ COMPLETE
- Vonage integration for SMS receiving
- Parse emoji + points from text
- Store events in Supabase
- Test with real messages

### Phase 3: Polish & Deploy ✅ COMPLETE
- Beautiful UI with animations
- Color-coded aura states
- Emoji presets documentation
- Deploy to Vercel
- Dad Flip Power feature
- Flip configuration panel

### Phase 4: AI Guardrails & Values Alignment (Next - Priority)
**Goal:** Teach the system when to say no and nurture healthy values

**The Challenge:** Defining what "right" looks like when parenting decisions aren't black-and-white. Goes beyond content filtering to AI alignment—teaching systems to refuse requests that undermine healthy values.

**Tasks:**
- [ ] Define value framework: what behaviors should system encourage/discourage?
- [ ] Implement guardrails for manipulative aura patterns (gaming the system)
- [ ] Build reflection prompts: "Why did you give that aura?" before negative scores
- [ ] Add cooling-off period for extreme negative scores
- [ ] Create positive reinforcement nudges (celebrate streaks, milestone acknowledgments)
- [ ] Implement "dad response" that models healthy communication
- [ ] Build dispute resolution flow (son disagrees with dad's action → structured conversation)
- [ ] Test edge cases: what if son tries to "punish" dad unfairly?

**Success Criteria:**
- System encourages reflection, not just reaction
- Manipulative patterns detected and redirected constructively
- Both dad and son feel the system supports healthy communication
- Guardrails feel supportive, not restrictive

### Phase 5: Apple Watch Integration (Week 5-6)
**Goal:** Enable quick aura input from Apple Watch

**Tasks:**
- [ ] Create Apple Shortcuts with webhook
- [ ] Add watch-optimized emoji picker
- [ ] Test one-tap aura submission from watch
- [ ] Create setup guide for son's watch
- [ ] Add watch source tracking

**Success Criteria:**
- Son can send aura in <3 seconds from watch
- No phone needed for quick feedback
- Shortcuts auto-populate with common emoji

### Phase 5: Enhanced Engagement (Week 5-6)
**Goal:** Richer communication and context

**Tasks:**
- [ ] Push notifications for significant aura changes
- [ ] Dad response/comment feature
- [ ] Photo attachments to aura events
- [ ] Voice notes from Apple Watch
- [ ] Custom emoji point mappings (son configures)
- [ ] Weekly summary reports (email/SMS)

**Success Criteria:**
- Real-time dad notifications for big swings
- Dad can acknowledge/respond to events
- Photos add context to major moments
- Weekly summaries show patterns

### Phase 6: Gamification & Insights (Week 7-8)
**Goal:** Make aura tracking more engaging

**Tasks:**
- [ ] Aura milestones and achievements
- [ ] Streak tracking (consecutive positive days)
- [ ] Best/worst day highlights
- [ ] Monthly aura report cards
- [ ] Prediction: "Will dad hit +100 this week?"
- [ ] Export data to CSV/charts

**Success Criteria:**
- Milestones celebrate progress
- Streaks encourage consistency
- Reports provide actionable insights
- Data ownership (export capability)

---

**Last Updated:** 2025-12-10
