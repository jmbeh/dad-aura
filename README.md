# 🔥 Dad Aura

> A playful, emoji-driven app where my son rates my dad performance in real-time via Apple Watch, updating a live dashboard with aura scores and trends.

![Type](https://img.shields.io/badge/Type-App-blue)
![Status](https://img.shields.io/badge/Status-Active%20Dev-green)
![Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20Supabase%20%7C%20Vonage-blue)

![Activity Feed](e2e-results/02-activity-feed.png)

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp env.example .env.local
# Edit .env.local with Supabase and Vonage keys

# 3. Run
npm run dev
```

**→ Open http://localhost:3000**

---

<details>
<summary><strong>✨ Features</strong></summary>

- **Real-time aura tracking:** Current score with glowing visualizations (supports negative values!).
- **Dad Flip power:** Reverse your aura score (e.g., -200 → +200), limited by son's settings.
- **Son's control panel:** Son sets the flip limit (0-10 per day) and can change it anytime.
- **Trend analytics:** Performance views for today, 7 days, and 30 days.
- **Apple Watch input:** Son sends emoji + points via SMS for instant feedback.
- **Dynamic UI:** Color and glow changes based on score value.

</details>

<details>
<summary><strong>🎯 How It Works</strong></summary>

**For Son (Aura Giver):**
1. Text dad's phone number from Apple Watch.
2. Send emoji + points (e.g., "🔥 +10" or "💩 -5").
3. Dashboard updates in real-time.

**For Dad (Aura Receiver):**
1. Open dashboard to see current score.
2. Use flip power to reverse negative aura (limited by son!).
3. View trends and activity feed.

</details>

<details>
<summary><strong>⚙️ Environment Variables</strong></summary>

Create `.env.local` from `env.example`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VONAGE_API_KEY` | Vonage (for SMS receiving) |
| `VONAGE_API_SECRET` | Vonage authentication |
| `VONAGE_PHONE_NUMBER` | Your Vonage phone number |

</details>

<details>
<summary><strong>🚢 Deployment</strong></summary>

Recommended: Deploy to Vercel

1. Run `supabase/schema.sql` in Supabase SQL Editor.
2. Build locally: `npm run build`
3. Deploy: `vercel --prod`
4. Configure Vonage webhook to point to `https://your-domain.vercel.app/api/sms-webhook`.

</details>

<details>
<summary><strong>💭 What I Learned</strong></summary>

The tech came together quickly—SMS webhook → Supabase real-time → instant dashboard. But what surprised me: my son controlling how many times I can "flip" negative scores became the most engaging feature. That power asymmetry created negotiation moments that strengthened our relationship more than the scoring itself.

</details>

<details>
<summary><strong>🔮 What's Next</strong></summary>

Working on **AI guardrails that go beyond content filtering**—teaching the system when to say no, when to disagree with dad or child, and how to nurture healthy values in both. Sometimes refusing to change aura points *is* the ethical choice.

</details>

<details>
<summary><strong>📚 Development Notes</strong></summary>

- See `CLAUDE.md` for detailed technical setup and development commands.
- See `PLAN.md` for detailed product requirements and architecture decisions.
- See `BUILD_LOG.md` for chronological progress.

</details>

---

**Status:** Active Development | **Purpose:** Personal learning and portfolio project

---

## 📱 Emoji Guide for Your Son

<!-- Merged from EMOJI_GUIDE.md on 2025-01-XX -->

Quick reference for your son to know which emoji to use!

### 🔥 Positive Vibes (Earn Dad Points!)

| Emoji | Points | When to Use |
|-------|--------|-------------|
| 🔥 | +10 | Awesome dad moment |
| 🎉 | +15 | Epic dad win! |
| ❤️ | +5 | Love you dad |
| 🌟 | +8 | You're shining today |
| 💪 | +7 | Strong dad energy |
| 👍 | +3 | Good job, dad |
| ⚡ | +25 | LEGENDARY move! |
| 🎯 | +20 | Bullseye, perfect! |

### 💩 Negative Vibes (Dad Needs to Step Up)

| Emoji | Points | When to Use |
|-------|--------|-------------|
| 💩 | -5 | Mild disappointment |
| 😤 | -8 | I'm annoyed |
| 👎 | -3 | Not cool, dad |
| 😡 | -10 | Dad fail |
| 🙄 | -4 | Seriously? |
| 💔 | -12 | Really hurt my feelings |

### 🤷 Neutral

| Emoji | Points | When to Use |
|-------|--------|-------------|
| 🤷 | 0 | Meh, whatever |

### How to Send from Apple Watch

**Method 1: Text Message (Easiest!)**
1. Open Messages on your watch
2. Select Dad's contact
3. Dictate or scribble your message:
   - "🔥 +10" or just "🔥"
   - "💩 -5" or just "💩"
   - Add a note: "🔥 +10 Great pancakes!"

**Method 2: Custom Points**
Want to give MORE or LESS points? Just add the number:
- "🔥 +20" (double awesome!)
- "💩 -10" (extra disappointed)
- "⚡ +50" (ULTRA legendary)

### Examples

**Good Examples ✅**
- "🔥" → +10 points (uses preset)
- "🔥 +10" → +10 points
- "+15 🎉" → +15 points
- "🔥 +10 Made amazing pancakes!" → +10 points with note
- "💩 -5 Forgot to pick me up" → -5 points with note

**Won't Work ❌**
- "fire" (use emoji, not words)
- "ten points" (use numbers)
- Random text without emoji

### Aura Levels

- **200+** 🏆 Legendary Dad
- **100-199** ⭐ Epic Dad
- **50-99** 🔥 Great Dad
- **1-49** 👍 Good Dad
- **0** 🤷 Neutral
- **-1 to -49** 😬 Dad Needs Work
- **-50 to -99** 😤 Dad in Trouble
- **-100 or less** 💔 Dad Emergency!

---

## 🔄 Dad Flip Feature

<!-- Merged from FLIP_FEATURE.md on 2025-01-XX -->

The **Dad Flip** is a fun power dynamic feature that lets dad reverse his aura score, but with limits controlled by his son!

### How It Works

**The Power:**
- Dad can **flip** his aura total from negative to positive (or vice versa)
- Example: If aura is `-200`, dad can flip it to `+200`
- Example: If aura is `+150`, dad can flip it to `-150`

**The Catch:**
- **Son controls the limits!** 
- Default: Dad gets **2 flips per day**
- Son can increase or decrease this limit (0-10 flips)
- Flips reset daily at midnight

**For Dad:**
1. Open the dashboard
2. Look for the **🔄 Dad Flip Power** section
3. See your current total and what it would flip to
4. Click **"🔄 Flip Now"** if you have flips remaining
5. Watch your aura reverse instantly!

**For Son:**
1. Open the dashboard
2. Find **⚙️ Son's Control Panel** (click to expand)
3. Use the slider to set max flips per day (0-10)
4. Click **"Save Changes"**
5. Dad's flip limit updates immediately!

**Power Levels:**
- **0 flips:** 😈 Dad has NO flip power!
- **1 flip:** 😏 Dad gets 1 flip per day
- **2 flips:** 😊 Dad gets 2 flips per day (default)
- **3-5 flips:** 😇 Dad gets some extra flips
- **6-10 flips:** 🤯 Dad has UNLIMITED power!

Flip events show up in the activity feed with special purple gradient styling and "DAD FLIP!" label.

---

## 🚀 Next Steps

<!-- Merged from NEXT_STEPS.md on 2025-01-XX -->

### Immediate Setup

1. **Set Up Supabase** (5 minutes)
   - Create account at https://supabase.com
   - Create new project
   - Run `supabase/schema.sql` in SQL Editor
   - Copy URL and anon key to `.env.local`

2. **Test Locally** (2 minutes)
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

3. **Add Test Data** (1 minute)
   ```bash
   curl -X POST http://localhost:3000/api/aura \
     -H "Content-Type: application/json" \
     -d '{"emoji":"🔥","points":10,"source":"web","note":"Test event"}'
   ```

4. **Deploy to Vercel** (5 minutes)
   - Push to GitHub
   - Import repository in Vercel
   - Add environment variables
   - Deploy!

### Customization Ideas

**Easy Wins:**
- Change color scheme in `tailwind.config.js`
- Add more emoji presets in `lib/emoji-parser.ts`
- Customize aura level labels

**Medium Effort:**
- Create Apple Shortcuts for watch input
- Add push notifications when aura changes
- Create weekly summary emails

**Advanced:**
- Multiple kids tracking same dad
- Photo attachments to aura events
- Voice notes from Apple Watch
- Aura milestones and achievements
