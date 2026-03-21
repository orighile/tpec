

# Fix: Sign Up, Events, and Profile Update Issues

## Issue 1: Profile Update Error ("Cannot coerce the result to a single JSON object")

**Root cause**: `useProfile.ts` line 63 uses `.single()` after an `.update()` call. If the update returns no rows (e.g., RLS blocks it) or multiple rows, Supabase throws this error.

**Fix**: Change `.single()` to `.maybeSingle()` in the `updateProfile` function in `src/hooks/useProfile.ts`.

Also fix the same issue in `AuthContext.tsx` where `fetchProfile` already uses `.maybeSingle()` (correct), but the profile `role` field query uses `select('id, username, full_name, avatar_url, role')` -- need to verify this matches the table schema (it does, `role` exists on profiles table).

---

## Issue 2: Can't Find Created Events

**Root cause**: `CreateEventPage.tsx` does NOT save events to Supabase. It only does `console.log("Submit event data:", eventData)` and shows a success toast. The event is never inserted into the `events` table.

**Fix**: Update the `onSubmit` function to:
1. Get the authenticated user
2. Upload the image to Supabase storage (create an `event-images` bucket if needed)
3. Insert the event into the `events` table with `owner_user_id`, `title`, `description`, `starts_at`, `location`, `capacity`, `category`, `cover_image_path`, and `published: true`
4. Navigate to the events page on success

---

## Issue 3: Sign Up Issues

**Root cause**: The `checkEmailExists` function (lines 76-122) tries to sign in with a dummy password to check if email exists. This approach:
- Can trigger rate limiting on Supabase auth
- May produce security log noise
- The `fieldsDisabled` state can get stuck if the check fails unexpectedly

**Fix**: Remove the dummy-password email check entirely. Instead, let the normal Supabase `signUp` flow handle duplicate emails (Supabase returns an appropriate error). Remove `checkEmailExists`, `handleEmailBlur`, `isCheckingEmail`, `fieldsDisabled`, and `emailCheckResult` state.

---

## Files Changed

| File | Change |
|------|--------|
| `src/hooks/useProfile.ts` | `.single()` to `.maybeSingle()` in updateProfile |
| `src/pages/CreateEventPage.tsx` | Add Supabase insert for events + image upload |
| `src/pages/Auth.tsx` | Remove dummy-password email check logic |

## Storage Bucket

A new `event-images` public storage bucket may be needed for event cover images. Alternatively, use the existing `vendor-data` bucket with an `events/` prefix.

