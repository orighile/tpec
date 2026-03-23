# Fix: Account Creation & User Dashboard Issues

## Problems Identified

1. **Sign-up issue**: The signup flow code itself looks correct (calls `signUp` with email/password/fullName). The most likely cause is that after sign-up, the `signupSchema` requires `userType` field but the `signUp` call doesn't pass `userType` to Supabase metadata — this isn't blocking, but the real issue is likely that the image on login redirect doesn't exist (`/src/assets/avatar-1.jpg` in Navbar). Need to check if there's a deeper auth issue. Also, the `profiles` table has **no INSERT policy** for users — the profile is created via a trigger (`handle_new_user`), which runs as `SECURITY DEFINER`, so that's fine. The sign-up itself should work unless Supabase email confirmation is blocking it. The fix: ensure sign-up works by testing, and redirect new users to `/profile` after login so they land on their dashboard.
2. **No user dashboard**: After login, users are redirected to `/` (homepage). There's no dedicated dashboard. The Profile page at `/profile` has "My Events" section and account stats, but users don't know about it. The Navbar dropdown has "Profile" but it's not prominent.
3. **Old users can't find events**: The `MyEventsSection` component queries events by `owner_user_id`, which is correct. Events created before the Supabase insert fix would not exist in the DB. The Profile page shows hardcoded "0" for Events Created / Vendors Saved / Reviews Written stats instead of real counts.

## Plan

### 1. Redirect logged-in users to `/profile` after login

- `**src/pages/Auth.tsx**` line 204: Change `navigate("/")` to `navigate("/profile")` so users land on their dashboard after login.

### 2. Add "My Dashboard" link to Navbar dropdown (prominent position)

- `**src/components/Navbar.tsx**`: Add a "Dashboard" menu item at the top of the user dropdown (before Profile) that links to `/profile`. Also add it to the mobile menu.

### 3. Make Profile page stats dynamic

- `**src/pages/ProfilePage.tsx**`: Replace hardcoded "0" values with real counts fetched from Supabase:
  - Events Created: `SELECT count(*) FROM events WHERE owner_user_id = user.id`
  - Vendors Saved: `SELECT count(*) FROM saved_vendors WHERE user_id = user.id`
  - Reviews Written: `SELECT count(*) FROM reviews WHERE user_id = user.id`

### 4. Users cannot find the events that they created in their account 

- &nbsp;

### 5. Wrap `/profile` route with ProtectedRoute

- `**src/App.tsx**` line 110: Wrap ProfilePage with `<ProtectedRoute>` so unauthenticated users are redirected to `/auth`.

## Files Changed


| File                            | Change                                              |
| ------------------------------- | --------------------------------------------------- |
| `src/pages/Auth.tsx`            | Redirect to `/profile` after login                  |
| `src/components/Navbar.tsx`     | Add "Dashboard" link to user dropdown + mobile menu |
| `src/pages/ProfilePage.tsx`     | Fetch real stats from Supabase                      |
| `src/pages/CreateEventPage.tsx` | Make image upload optional                          |
| `src/App.tsx`                   | Wrap `/profile` with ProtectedRoute                 |
