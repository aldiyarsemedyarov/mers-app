# Mers App UI Port Plan — YC Demo → Production

## Goal
Port the complete YC demo UI to the Next.js production app while maintaining:
- 100% visual fidelity
- Backend/DB/auth integration
- Real Shopify + Meta Ads data
- All interactive features

## Architecture Overview

### Demo Structure (Static)
- Single HTML file with inline navigation
- CSS variables for theming
- Vanilla JS for interactivity
- Mock data

### Target Structure (Next.js)
- `/app/app/(dash)/` layout with shared sidebar/topbar
- Individual page components
- React hooks for state management
- API routes for real data
- Tailwind + CSS modules for styling

## Step-by-Step Port Plan

### Phase 1: Foundation (Steps 1-3)
**Extract and organize styling**

1. **Create global CSS with demo variables and base styles**
   - File: `src/app/globals.css`
   - Port CSS variables, animations, base styles from demo
   - Keep existing Tailwind, add custom CSS after

2. **Create shared components directory**
   - `src/components/ui/Button.tsx` (primary, ghost, danger variants)
   - `src/components/ui/Card.tsx` (dash-card, playbook-card, etc.)
   - `src/components/ui/Modal.tsx` (modal overlay + content)
   - `src/components/ui/Badge.tsx` (tags, status pills)

3. **Update dashboard layout with demo styling**
   - File: `src/app/app/(dash)/layout.tsx`
   - Replace current Sidebar with demo version (icons, styling)
   - Add Topbar component (tabs, search, notifs, avatar, account dropdown)
   - Add LiveTicker component (bottom ticker)
   - Add ChatPanel component (floating bottom-right)
   - Add CommandPalette component (⌘K)

### Phase 2: Page Components (Steps 4-13)
**Port each page with real data integration**

4. **Home/Dashboard page (`/app/app/page.tsx`)**
   - Today's Performance card (4 KPIs from DB)
   - AI Insights section (5 insight cards)
   - Monthly Goals progress bars
   - Recent Agent Actions feed
   - Product P&L mini card
   - Quick Actions buttons
   - Connect to `/api/analytics/revenue` for real data

5. **Tasks page (`/app/app/(dash)/tasks/page.tsx`)**
   - Kanban board (4 columns: Suggested, Backlog, In Progress, Done)
   - Drag-and-drop functionality
   - Filter by owner (All, Mers, Aldiyar)
   - Activity sidebar
   - Task detail modal
   - Store tasks in DB (new `Task` table in schema)

6. **Knowledge Base page (`/app/app/(dash)/knowledge/page.tsx`)**
   - Searchable table with tactics
   - Category filters (ads, creative, store, sourcing, fulfillment, email, conflicts)
   - Confidence scores
   - Source badges
   - Add tactic modal
   - Store in `knowledge_tactic` table

7. **Playbooks page (`/app/app/(dash)/playbooks/page.tsx`)**
   - Grid of playbook cards
   - Interactive decision tree modal
   - Yes/No navigation through tree
   - Kill rules highlighting
   - Store playbooks in `playbook` table

8. **Cash Flow page (`/app/app/(dash)/cashflow/page.tsx`)**
   - Sankey diagram (SVG)
   - Summary cards (revenue, ad spend, COGS, net profit)
   - Detailed cash flow table
   - Period toggle (7d, 30d, 90d)
   - Before/After toggle for projections
   - Connect to Shopify orders + Meta insights

9. **Analytics page (`/app/app/(dash)/analytics/page.tsx`)**
   - KPI grid (8 metrics)
   - Revenue by Day chart
   - Ad Spend vs Revenue chart
   - Traffic Sources bars
   - Top Products bars
   - Conversion Funnel
   - Use existing `/api/analytics/revenue` + new endpoints

10. **Integrations page (already exists, restyle)**
    - Current: basic list
    - Target: demo cards with icons, status, last sync
    - OAuth flow for Meta/Shopify
    - Webhook status indicators

11. **P&L page (`/app/app/(dash)/pnl/page.tsx`)**
    - Grid of product P&L cards
    - Per-product breakdown (price, COGS, shipping, CPA, fees, margin)
    - Calculate from orders + ad spend + products DB
    - Highlight top/bottom performers

12. **Competitors page (`/app/app/(dash)/competitors/page.tsx`)**
    - Competitor cards (store name, price, rating, last checked)
    - Ad creatives grid (Meta Ad Library scraping)
    - Add competitor modal
    - Store in `competitor` + `competitor_ad` tables

13. **Research page (`/app/app/(dash)/research/page.tsx`)**
    - Product research input + analyze button
    - Results panel (demand, competition, margins)
    - Trending products grid
    - Integration with external APIs (Google Trends, Meta Ad Library)

### Phase 3: Interactive Features (Steps 14-17)

14. **Chat Panel component**
    - Floating button (bottom-right)
    - Slide-up panel
    - Message history
    - Send message to agent
    - Typing indicator
    - Badge for unread count

15. **Command Palette (⌘K)**
    - Keyboard shortcut listener
    - Fuzzy search through pages + actions
    - Navigate to pages
    - Quick actions (audit store, research product, check competitors)

16. **Notifications Panel**
    - Bell icon in topbar
    - Badge count
    - Dropdown panel
    - Mark as read
    - Notification types (agent action, system alert, milestone)
    - Store in `notification` table

17. **Account Dropdown + Settings/Account pages**
    - Avatar click → dropdown
    - Account Settings page (profile, API keys, team)
    - Settings page (theme toggle, notifications, preferences)

### Phase 4: Real Data Integration (Steps 18-20)

18. **API Routes for frontend data**
    - `/api/dashboard/summary` — Today's Performance + AI Insights
    - `/api/tasks` — CRUD for tasks
    - `/api/knowledge` — CRUD for tactics
    - `/api/playbooks` — List + detail
    - `/api/notifications` — List + mark read
    - `/api/competitors` — CRUD
    - Enhance existing `/api/analytics/*` endpoints

19. **Database schema updates**
    ```prisma
    model Task {
      id          String   @id @default(cuid())
      userId      String
      title       String
      description String?
      priority    String   // high, med, low
      owner       String   // mers, user
      column      String   // suggested, backlog, progress, done
      impact      String?
      createdAt   DateTime @default(now())
      updatedAt   DateTime @updatedAt
    }
    
    model KnowledgeTactic {
      id          String   @id @default(cuid())
      tactic      String
      detail      String
      category    String
      rule        String
      sources     String[] // JSON array
      confidence  Int
      status      String   // verified, conflict, suggested
      isConflict  Boolean  @default(false)
      createdAt   DateTime @default(now())
    }
    
    model Playbook {
      id          String   @id @default(cuid())
      title       String
      description String
      icon        String
      tree        Json     // Decision tree structure
      sources     Int
      decisions   Int
      kills       Int
      conflicts   Int
      active      Int
      nodes       String[] // Node labels
      createdAt   DateTime @default(now())
    }
    
    model Competitor {
      id          String   @id @default(cuid())
      name        String
      url         String
      category    String
      lastChecked DateTime?
      createdAt   DateTime @default(now())
      ads         CompetitorAd[]
    }
    
    model CompetitorAd {
      id            String     @id @default(cuid())
      competitorId  String
      competitor    Competitor @relation(fields: [competitorId], references: [id], onDelete: Cascade)
      imageUrl      String
      hook          String?
      cta           String?
      platform      String
      scrapedAt     DateTime   @default(now())
    }
    
    model Notification {
      id        String   @id @default(cuid())
      userId    String
      type      String   // agent, system, milestone
      title     String
      message   String
      read      Boolean  @default(false)
      createdAt DateTime @default(now())
    }
    ```

20. **Real-time features**
    - Activity feed: poll `/api/tasks?recent=true` every 30s
    - Live ticker: scroll through recent events
    - Chat: consider WebSockets or polling

### Phase 5: Polish & Deploy (Steps 21-23)

21. **Animations & Transitions**
    - Stagger fade-in on page load
    - Drag-and-drop visual feedback
    - Modal animations (modalIn)
    - Notification slide-in
    - Page transitions

22. **Responsive & Mobile**
    - Sidebar collapse on mobile
    - Tab bar hidden on desktop (shown on mobile)
    - Touch-friendly buttons
    - Optimized layouts for small screens

23. **Final QA & Deploy**
    - Test all pages with real Shopify + Meta data
    - Verify drag-and-drop, modals, chat, notifications
    - Check animations and loading states
    - Deploy to Vercel
    - Update demo link in docs

---

## Execution Order (One Task at a Time)

1. ✅ **Step 1**: Extract CSS → `globals.css`
2. ✅ **Step 2**: Create UI components (Button, Card, Modal, Badge)
3. ✅ **Step 3**: Update layout (Sidebar, Topbar, LiveTicker, ChatPanel, CommandPalette)
4. → **Step 4**: Home/Dashboard page
5. → **Step 5**: Tasks page + DB schema
6. → **Step 6**: Knowledge Base page + DB schema
7. → **Step 7**: Playbooks page + DB schema
8. → **Step 8**: Cash Flow page
9. → **Step 9**: Analytics page (enhance existing)
10. → **Step 10**: Integrations page (restyle)
11. → **Step 11**: P&L page
12. → **Step 12**: Competitors page + DB schema
13. → **Step 13**: Research page
14. → **Step 14**: Chat Panel
15. → **Step 15**: Command Palette
16. → **Step 16**: Notifications Panel + DB schema
17. → **Step 17**: Account Dropdown + Settings/Account pages
18. → **Step 18**: API Routes for frontend
19. → **Step 19**: Database schema migration
20. → **Step 20**: Real-time features
21. → **Step 21**: Animations
22. → **Step 22**: Responsive
23. → **Step 23**: QA + Deploy

---

## Key Constraints

- **No breaking changes to existing backend**: Keep current API routes working
- **Maintain auth**: Use existing session-based auth
- **Database-first**: All new data goes to Postgres, not in-memory
- **Visual fidelity**: Match demo pixel-perfect
- **Progressive enhancement**: Each step should be testable/deployable

---

## Success Criteria

✅ Production app looks identical to YC demo
✅ All pages functional with real data
✅ Drag-and-drop, modals, chat, notifications working
✅ Shopify + Meta Ads data flowing correctly
✅ Responsive on mobile
✅ Deployed to Vercel and accessible

---

## Time Estimate

- Phase 1 (Foundation): ~2 hours
- Phase 2 (Pages): ~6 hours
- Phase 3 (Features): ~3 hours
- Phase 4 (Integration): ~2 hours
- Phase 5 (Polish): ~1 hour

**Total: ~14 hours** (aggressive, assumes no blockers)

Split into sessions:
- Session 1 (now): Steps 1-3 (Foundation)
- Session 2: Steps 4-7 (Core pages)
- Session 3: Steps 8-13 (Remaining pages)
- Session 4: Steps 14-20 (Features + APIs)
- Session 5: Steps 21-23 (Polish + deploy)
