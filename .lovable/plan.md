

# Plan: Fix All QA Report Issues — Phased Implementation

The QA report identifies 106 test cases: 12 pass, 10 broken, 84 not implemented. This plan addresses everything in priority order across multiple implementation rounds.

---

## Phase 1: P0 Security Fixes (Immediate)

### 1A. Password strength validation (QA 1.3)
- Update `signupSchema` in `Auth.tsx` to require min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
- Add a visual password strength indicator below the password field

### 1B. Password reset session logic (QA 1.7)
- In `Auth.tsx` `checkForResetToken`, call `supabase.auth.signOut()` before `setSession()` with recovery tokens to invalidate any existing session
- After password update, force sign-out and redirect to login

### 1C. Token expiry validation (QA 1.8)
- Already partially handled — the code checks for active session before showing update form. Add explicit error handling when `setSession` fails with expired tokens, showing a clear "link expired" message

### 1D. Session expiry (QA 1.10)
- Configure Supabase JWT expiry is handled server-side. Add client-side inactivity detection: after 30 min of no interaction, call `signOut()` and redirect to `/auth`
- Create a `useSessionTimeout` hook used in `AuthProvider`

---

## Phase 2: P1 Core Fixes

### 2A. Profile update fix (QA 2.11) — ALREADY FIXED
- `.maybeSingle()` already applied in `useProfile.ts`

### 2B. Change password from settings (QA 2.14)
- In `SettingsPage.tsx`, wire the change password section to call `supabase.auth.updateUser({ password })` with proper validation

### 2C. Profile picture upload (QA 2.12, 2.13) — ALREADY FIXED
- `AvatarUpload` component exists with file validation

### 2D. Phone number field (QA 2.15)
- Add `phone` column to profiles table (migration)
- Add phone field to `ProfilePage.tsx` edit form and `useProfile.ts`

### 2E. Event preferences (QA 2.16)
- Add `preferences` JSONB column to profiles table
- Add preference checkboxes (wedding, corporate, etc.) to profile page

### 2F. Account deletion (QA 2.17, 2.18)
- Wire the existing delete button in `SettingsPage.tsx` to an edge function that calls `supabase.auth.admin.deleteUser()`
- Create `delete-account` edge function

---

## Phase 3: Search & Filtering (QA 3.19-3.30)

### 3A. Fix vendor category filter (QA 3.19)
- Debug and fix `MarketplaceContent` / `VendorFilter` to correctly filter by category from Supabase `vendors` table

### 3B. Add full-text search (QA 3.20, 3.29, 3.30)
- Add search input to marketplace header
- Implement Supabase `ilike` or `textSearch` on vendor name/description/category

### 3C. Empty state (QA 3.21)
- Add "No vendors found" message with reset filters button

### 3D. Price range filter (QA 3.22)
- Add price range slider/select using `price_min`/`price_max` columns

### 3E. Rating filter (QA 3.23)
- Query average rating from `reviews` table, filter vendors by minimum rating

### 3F. Combined filters (QA 3.24)
- Wire all filters to compose Supabase query with AND logic

### 3G. Sort options (QA 3.25, 3.26)
- Add sort dropdown: Price low-high, Price high-low, Rating, Newest

### 3H. Vendor cards (QA 3.27, 3.28)
- Ensure cards show name, category, location, price range, rating
- Link cards to `/vendors/:id` detail page

---

## Phase 4: Vendor Listings (QA 4.31-4.40)

### 4A. Vendor profile page (QA 4.31)
- Build out `VendorDetailPage.tsx` to fetch from Supabase `vendors` table by ID/slug
- Display full vendor info: about, images, contact, packages

### 4B. Portfolio images (QA 4.32, 4.33)
- Display `images[]` array from vendors table
- Add fallback placeholder for missing images

### 4C. Rating average (QA 4.35)
- Query `reviews` table, compute and display average rating on vendor profile

### 4D. Book Now button (QA 4.37)
- Wire to vendor booking flow (Phase 5)

### 4E. Availability calendar (QA 4.38)
- Add availability display using `vendor_bookings` table to show booked dates

### 4F. Service list & pricing (QA 4.39, 4.40)
- Display `vendor_packages` on vendor detail page with prices

---

## Phase 5: Booking System (QA 5.41-5.55)

### 5A. Core booking flow
- Create booking form: select package, pick date, add notes
- Insert into `vendor_bookings` table with status `pending`
- Show confirmation page

### 5B. Booking management
- Add "My Bookings" section to dashboard (profile page)
- Allow cancel/reschedule (update status in `vendor_bookings`)
- Show booking status transitions: pending → confirmed → completed

### 5C. Vendor approval
- Vendors see incoming bookings on their dashboard
- Can approve/reject (update status)

---

## Phase 6: Payments (QA 6.56-6.67)

### 6A. Paystack integration
- Secrets already exist (`PAYSTACK_SECRET_KEY`)
- Wire `CheckoutButton` to create payment via edge function
- Handle webhook for payment confirmation
- Update `orders` table status

### 6B. Payment safeguards
- Idempotency keys to prevent double charges
- Failure handling with retry UI

---

## Phase 7: Event Planning Tools Completion (QA 7.70-7.77)

### 7A. Expense editing (QA 7.70)
- Add edit functionality to budget items (currently only mark-as-paid)

### 7B. Guest list CRUD (QA 7.74)
- The `guests` table and `GuestManagementPage` exist — verify they work end-to-end

### 7C. Guest import/export (QA 7.75, 7.76)
- Add CSV import (parse and insert into `guests`)
- Add CSV export (download guest list)

### 7D. Timeline view (QA 7.77)
- Create timeline component showing event milestones chronologically

---

## Phase 8: AI Recommendations (QA 8.78-8.85)

- Wire `AIRecommendationEngine` to query vendors from Supabase based on event type/preferences
- Use the existing `chief-chat` edge function or create a recommendation endpoint
- Display matching vendors with relevance scoring

---

## Phase 9: Messaging (QA 9.86-9.91)

- Build real-time messaging using Supabase Realtime
- Create `messages` table with sender/receiver/content
- Wire file attachments to Supabase Storage
- Add messaging UI between event owners and vendors

---

## Phase 10: Reviews (QA 10.94-10.100)

- Build review submission form on vendor detail page (post-booking gate)
- CRUD operations on `reviews` table (already has RLS)
- Compute and display average ratings
- Add edit/delete for own reviews

---

## Phase 11: Notifications (QA 11.101-11.106)

- Create `notifications` table
- Insert notifications on key events (booking created, payment received, etc.)
- Build notification bell dropdown with unread count
- Add email notification triggers via edge functions

---

## Implementation Order

Each phase will be implemented sequentially. Phase 1 (security) first, then Phases 2-4 together (core product), then Phases 5-6 (commerce), then Phases 7-11 (completeness).

**Files touched across all phases**: ~30+ files modified/created, ~5 migrations, ~3 new edge functions.

