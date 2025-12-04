# Site Referral Platform - Implementation Plan (Phases 2-6)

## Project Status
- **Phase 1 Complete**: Login, App Shell, Sidebar, Header, Theme System, Basic Dashboard
- **Font Change**: Manrope → Inter
- **Tech Stack**: Next.js 16, React 19, Tailwind v4, Framer Motion, TypeScript

---

## Phase 2: Dashboard Enhancement

### 2.1 Daily Digest Modal
**File**: `components/dashboard/DailyDigestModal.tsx`

- Glass modal overlay with backdrop blur
- Time-based greeting ("Good morning, Sarah!")
- Key metrics cards:
  - New referrals since last login
  - Today's appointments (count + next one)
  - Overdue follow-ups
  - Weekly conversion rate
- Quick action buttons: "Start Working Session", "View Appointments", "See All Referrals"
- "Don't show again today" checkbox (localStorage)
- Framer Motion entrance animation

### 2.2 Stats Cards Enhancement
**File**: `components/dashboard/StatsCard.tsx`

- Add sparkline trend indicators
- Animated number counting on load
- Hover state with more details

### 2.3 Today's Appointments Timeline
**File**: `components/dashboard/AppointmentsTimeline.tsx`

- Vertical timeline view
- Patient name, study, time, appointment type
- Quick actions: call, view profile
- Empty state illustration when no appointments

### 2.4 Activity Feed
**File**: `components/dashboard/ActivityFeed.tsx`

- Chronological list of recent actions
- Filter by type (status changes, notes, SMS, appointments)
- Shows who did what and when
- Infinite scroll or "load more"

### 2.5 Additional Components Needed
- `components/ui/Modal.tsx` - Base modal component
- `components/ui/EmptyState.tsx` - Reusable empty state with illustration slot

### 2.6 Mock Data Expansion
- Expand `lib/mock-data/referrals.ts` from 8 to 75-100 referrals
- Add `lib/mock-data/appointments.ts` for scheduled appointments
- Add `lib/mock-data/activity.ts` for activity feed items

---

## Phase 3: Referral List View

### 3.1 Filter Bar
**File**: `components/referrals/FilterBar.tsx`

- Search input (name, email, phone)
- Status multi-select dropdown
- Study dropdown
- Date range picker
- Assigned to dropdown
- Sort by dropdown
- View toggle (cards/compact list)

### 3.2 Referral Card
**File**: `components/referrals/ReferralCard.tsx`

- Patient name (prominent)
- Status badge (color-coded)
- Study name, phone, submitted date, last contacted
- Assigned coordinator avatar
- Hover actions: Call, SMS, Update Status, View

### 3.3 Referral List Page
**File**: `app/(authenticated)/referrals/page.tsx`

- Filter bar at top
- Card grid or compact list view
- Bulk selection checkboxes
- Bulk actions toolbar (status update, assign, add to session)
- Pagination or infinite scroll
- Empty state for no results

### 3.4 Additional Components
- `components/ui/Dropdown.tsx` - Multi-select dropdown
- `components/ui/DateRangePicker.tsx` - Date range selector
- `components/ui/Checkbox.tsx` - Styled checkbox
- `components/ui/Avatar.tsx` - User avatar with initials fallback

---

## Phase 4: Referral Detail View

### 4.1 Detail Page Layout
**File**: `app/(authenticated)/referrals/[id]/page.tsx`

- Two-column layout (60/40 split)
- Back button navigation
- Header with name, status dropdown, study, quick actions

### 4.2 Contact Info Card
**File**: `components/referrals/ContactInfoCard.tsx`

- Phone (click to call, copy button)
- Email (click to email, copy button)
- DOB, preferred contact time, source/campaign

### 4.3 SMS Panel
**File**: `components/referrals/SMSPanel.tsx`

- iMessage-style conversation view
- Outbound: mint bubbles, right-aligned
- Inbound: gray bubbles, left-aligned
- Input field with send button
- Character count
- Template quick-insert dropdown

### 4.4 Notes Panel
**File**: `components/referrals/NotesPanel.tsx`

- List of notes with author, timestamp
- Add new note textarea
- Edit/delete options

### 4.5 Timeline/History
**File**: `components/referrals/ReferralTimeline.tsx`

- Chronological view of all interactions
- Status changes, notes, messages, appointments
- Filter by type
- Visual timeline with icons

### 4.6 Appointments Panel
**File**: `components/referrals/AppointmentsPanel.tsx`

- Upcoming and past appointments
- Schedule new button
- Reschedule/cancel options

### 4.7 Status Change Flow
- Dropdown with all status options
- Confirmation dialog
- Optional note with status change
- Success toast notification

### 4.8 Additional Components
- `components/ui/Toast.tsx` - Toast notifications
- `components/ui/Textarea.tsx` - Styled textarea
- `components/ui/Tooltip.tsx` - Hover tooltips
- `components/referrals/AppointmentScheduler.tsx` - Scheduling modal

---

## Phase 5: Working Session

### 5.1 Lead Selection
**File**: `app/(authenticated)/working-session/page.tsx`
**File**: `components/working-session/LeadSelector.tsx`

- Session setup card (name, filters, max leads)
- Study and status filters
- Auto-select button (smart prioritization)
- Manual selection with drag-to-reorder
- Lead preview list with checkboxes
- Session summary and "Start Session" button

### 5.2 Dialer Interface
**File**: `components/working-session/DialerInterface.tsx`

- Current lead card (large, centered)
- Patient name, phone, status, study
- "Start Call" button → active call state

### 5.3 Call Timer
**File**: `components/working-session/CallTimer.tsx`

- MM:SS display with pulse animation
- Mute button (mock)
- End Call button
- Logs time to session

### 5.4 Quick Status Modal
**File**: `components/working-session/QuickStatusModal.tsx`

- Post-call status buttons: No Answer, Left VM, Spoke - Follow Up, Spoke - Scheduled, Not Interested, Wrong Number
- Note input field
- "Save & Next" button

### 5.5 Session Progress
**File**: `components/working-session/SessionProgress.tsx`

- Progress bar ("Lead 3 of 15")
- Completed/skipped counts
- Time elapsed
- Collapsible lead queue preview

### 5.6 Session Report
**File**: `components/working-session/SessionReport.tsx`

- Session summary (duration, leads worked, calls made)
- Outcomes chart (donut or bar)
- Detailed log per lead
- Actions: Email Report, Start New, Return to Dashboard, Download CSV

### 5.7 Working Session Context
**File**: `lib/context/WorkingSessionContext.tsx`

- Session state management
- Lead queue, current lead, progress tracking
- Timer state

---

## Phase 6: Settings & Polish

### 6.1 Settings Page
**File**: `app/(authenticated)/settings/page.tsx`

- Profile section (name, email, avatar placeholder)
- Site settings (name, address, studies)
- Preferences (theme, default views, daily digest)
- Import/Export section

### 6.2 CSV Upload Interface
**File**: `components/settings/CSVUpload.tsx`

- Drag-and-drop zone
- File selection and analysis
- Column mapping preview (mock)
- Import preview with validation
- Success state

### 6.3 Email Digest Preview
**File**: `components/settings/EmailDigestPreview.tsx`

- Mock email template in glass card
- Header, greeting, stats, appointments, footer

### 6.4 Global Search (CMD+K)
**File**: `components/layout/GlobalSearch.tsx`

- Modal overlay with search input
- Real-time results grouped by type
- Keyboard navigation
- Recent searches

### 6.5 Notifications Panel
**File**: `components/layout/NotificationsPanel.tsx`

- Dropdown from bell icon
- Mock notifications (new referral, appointment reminder, teammate action)
- Mark all read, clear all

### 6.6 Final Polish
- Responsive tweaks for tablet/mobile
- Performance optimization (lazy loading, memoization)
- Animation polish (60fps)
- Accessibility audit (keyboard nav, ARIA labels)

---

## UI Components to Build

| Component | Phase | Priority | Description |
|-----------|-------|----------|-------------|
| Modal.tsx | 2 | P0 | Base modal with glass effect |
| EmptyState.tsx | 2 | P0 | Empty state with illustration |
| Dropdown.tsx | 3 | P0 | Single/multi-select dropdown |
| Checkbox.tsx | 3 | P0 | Styled checkbox |
| Avatar.tsx | 3 | P0 | User avatar with initials |
| DateRangePicker.tsx | 3 | P1 | Date range selector |
| Textarea.tsx | 4 | P0 | Styled textarea |
| Toast.tsx | 4 | P0 | Notification toasts |
| Tooltip.tsx | 4 | P1 | Hover tooltips |
| ProgressBar.tsx | 5 | P1 | Animated progress bar |
| Toggle.tsx | 6 | P1 | On/off switch |
| Skeleton.tsx | 6 | P2 | Loading skeletons |

---

## Mock Data Requirements

### Current State
- 8 referrals (scenarios)
- 4 studies
- 3 users
- 1 site

### Target State (Phase 2)
- **75-100 referrals** with status distribution:
  - new: 10
  - attempt_1: 8
  - attempt_2: 7
  - attempt_3: 5
  - attempt_4: 4
  - attempt_5: 5
  - sent_sms: 8
  - appointment_scheduled: 12
  - phone_screen_failed: 5
  - not_interested: 6
  - signed_icf: 15

- **Appointments**: 15-20 scheduled across next 2 weeks
- **Activity items**: 50+ recent actions for feed

---

## Implementation Order

### Session 1: Phase 2 - Dashboard
1. Build Modal base component
2. Build EmptyState component
3. Expand mock data (referrals, appointments, activity)
4. Build DailyDigestModal
5. Enhance StatsCard with animations
6. Build AppointmentsTimeline
7. Build ActivityFeed
8. Integrate all into dashboard page

### Session 2: Phase 3 - Referral List
1. Build Dropdown, Checkbox, Avatar components
2. Build FilterBar
3. Build ReferralCard
4. Update referrals page with full list view
5. Implement filtering/sorting logic
6. Add bulk selection

### Session 3: Phase 4 - Referral Detail
1. Build Textarea, Toast, Tooltip components
2. Build detail page layout
3. Build ContactInfoCard
4. Build SMSPanel
5. Build NotesPanel
6. Build ReferralTimeline
7. Build AppointmentsPanel
8. Implement status change flow

### Session 4: Phase 5 - Working Session
1. Build WorkingSessionContext
2. Build LeadSelector
3. Build DialerInterface + CallTimer
4. Build QuickStatusModal
5. Build SessionProgress
6. Build SessionReport
7. Connect full flow

### Session 5: Phase 6 - Settings & Polish
1. Build settings page sections
2. Build CSVUpload UI
3. Build GlobalSearch
4. Build NotificationsPanel
5. Final polish and testing

---

## Files Summary

### Existing Files to Modify
- `app/(authenticated)/dashboard/page.tsx`
- `app/(authenticated)/referrals/page.tsx`
- `app/(authenticated)/working-session/page.tsx`
- `app/(authenticated)/settings/page.tsx`
- `lib/mock-data/referrals.ts`
- `components/layout/Header.tsx`

### New Files by Phase
- **Phase 2**: ~8 files (components + mock data)
- **Phase 3**: ~7 files (components + page)
- **Phase 4**: ~9 files (components + page)
- **Phase 5**: ~8 files (components + context)
- **Phase 6**: ~5 files (components)

**Total: ~37 new files**

---

## Design Notes

- **Font**: Inter (changed from Manrope)
- **Theme**: Glass-morphism with mint (#53CA97) primary
- **Animations**: Framer Motion throughout
- **Dark mode**: Full support via CSS variables
- **Accessibility**: Keyboard navigation, ARIA labels, focus states

---

*Document Version: 1.0*
*Created: December 2024*
*Last Updated: December 2024*
