

# Plan: Fix All Remaining QA Report Issues (Phases 3–11)

Phases 1–2 (Security + Core Auth/Profile fixes) are complete. This plan covers the remaining 84+ test cases across 9 phases.

---

## Phase 3: Search & Filtering (QA 3.19–3.30)

**Files**: `src/pages/VendorsPage.tsx`, `src/pages/VendorMarketplacePage.tsx`, `src/pages/SearchPage.tsx`, `src/utils/SearchUtils.ts`

- Add a text search input to VendorsPage and VendorMarketplacePage above the category buttons
- Add price range filter dropdown (Budget / Mid-Range / Premium)
- Add minimum rating filter (3+, 4+, 5 stars)
- Add sort dropdown: "Relevance", "Price Low→High", "Price High→Low", "Rating"
- Wire combined filters together so all work simultaneously
- Show empty-state message when no results match
- Make each vendor card link to `/vendors/{id}` on click
- Add basic fuzzy matching (lowercase + includes) to search
- Handle empty search query gracefully (show all vendors)

---

## Phase 4: Vendor Listings (QA 4.31–4.40)

**Files**: `src/components/VendorDetails.tsx`, `src/pages/VendorDetailPage.tsx`, `src/pages/VendorBookingPage.tsx`

- Fetch vendor data from Supabase in VendorDetailPage instead of using hardcoded defaults, falling back to local `vendorsList` data
- Display vendor portfolio images from the `images` array with fallback placeholder
- Show computed average rating from `reviews` table
- Wire "Book Now" button to navigate to `/vendors/{id}/book`
- Display vendor services list and pricing from vendor data
- Add a simple availability display (weekdays/weekends badges)

---

## Phase 5: Booking System (QA 5.41–5.55)

**Files**: `src/components/vendors/VendorBookingFlow.tsx`, `src/hooks/useVendorBookings.tsx`, new `src/pages/MyBookingsPage.tsx`

- Connect VendorBookingFlow to actually insert into `vendor_bookings` table via Supabase
- Require authentication before booking (redirect to /auth if not logged in)
- Add booking form validation (date required, guest count > 0, contact info required)
- Create `/my-bookings` page showing user's bookings from `vendor_bookings` table
- Add booking status display (pending, confirmed, cancelled)
- Add cancel booking functionality (update status to 'cancelled')
- Add route and nav link for My Bookings

**Migration**: Add `booking_details jsonb` column to `vendor_bookings` if not present, and add `user_id` column if missing.

---

## Phase 6: Payments (QA 6.56–6.67)

**Files**: `src/components/payments/PaymentIntegration.tsx`, `src/lib/payments/paystack.ts`

- Wire PaymentIntegration to call Paystack edge function (`create-paystack-payment`)
- Handle payment success callback: update `orders` table status to 'paid'
- Handle payment failure with clear error message and retry button
- Add payment confirmation screen after successful payment
- Prevent double-charge by disabling button during processing and checking order status
- Display payment receipt/summary after completion

---

## Phase 7: Event Planning Tools (QA 7.70–7.77)

**Files**: `src/pages/BudgetPage.tsx`, `src/pages/GuestManagementPage.tsx`, `src/components/guest-management/`

- Enable full edit on expense items (not just mark as paid)
- Wire guest management to Supabase `guests` table (create, read, update, delete)
- Add CSV import for guest list (parse CSV, insert rows)
- Add CSV export for guest list (download current list)
- Add basic timeline view for event (ordered checklist items by due date)

---

## Phase 8: AI Recommendations (QA 8.78–8.85)

**Files**: `src/pages/AIRecommendationsPage.tsx`, `src/hooks/useAIRecommendations.tsx`

- Connect recommendation panel to query vendors from Supabase based on event type/category
- Return vendors filtered by category, location, and price range as "recommendations"
- Add loading state while fetching
- Show "No recommendations" empty state
- Display recommended vendors as clickable cards linking to vendor detail pages

*Note: True AI integration requires an LLM API key. This phase implements rule-based recommendations from the vendor database as a functional substitute.*

---

## Phase 9: Messaging (QA 9.86–9.91)

**Files**: `src/components/messaging/RealTimeMessaging.tsx`, new migration for `messages` table

- Create `messages` table in Supabase (id, sender_id, recipient_id, content, created_at, read)
- Wire RealTimeMessaging to insert/fetch from `messages` table
- Enable real-time subscription via Supabase realtime for incoming messages
- Store file attachment references (path in storage bucket) instead of just showing toast
- Add message history loading on conversation open

**Migration**: Create `messages` table with RLS policies (users can read/write their own messages).

---

## Phase 10: Reviews (QA 10.94–10.100)

**Files**: `src/components/reviews/ReviewRatingSystem.tsx`, `src/components/VendorDetails.tsx`

- Wire review submission form to insert into `reviews` table
- Require authentication to submit a review
- Allow users to edit/delete their own reviews
- Compute and display average rating from real review data
- Show reviews on vendor detail page from database
- Basic spam prevention: one review per user per vendor

---

## Phase 11: Notifications (QA 11.101–11.106)

**Files**: new `src/components/notifications/NotificationBell.tsx`, new migration for `notifications` table, `src/components/Navbar.tsx`

- Create `notifications` table (id, user_id, type, title, message, read, created_at)
- Add notification bell icon to Navbar with unread count badge
- Dropdown showing recent notifications
- Mark as read on click
- Insert notifications on key events: booking created, payment received, review posted
- Notification preferences already exist in Settings page (wire them to filter displayed notifications)

**Migration**: Create `notifications` table with RLS.

---

## Summary

| Phase | QA IDs | Key Deliverable | New Migrations |
|-------|--------|-----------------|----------------|
| 3 | 3.19–3.30 | Working vendor search + filters | None |
| 4 | 4.31–4.40 | Real vendor detail pages | None |
| 5 | 5.41–5.55 | End-to-end booking flow | 1 (booking_details) |
| 6 | 6.56–6.67 | Paystack payment integration | None |
| 7 | 7.70–7.77 | Guest list CRUD + timeline | None |
| 8 | 8.78–8.85 | Rule-based vendor recommendations | None |
| 9 | 9.86–9.91 | Real-time messaging | 1 (messages table) |
| 10 | 10.94–10.100 | Review submission + display | None |
| 11 | 11.101–11.106 | Notification system | 1 (notifications table) |

**~35 files modified/created, 3 migrations, implemented sequentially Phase 3 → 11.**

