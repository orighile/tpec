

# Fix IONOS SMTP Email Delivery & Add Custom Password Reset

## Overview

This plan addresses two issues:
1. **Fix the SMTP connection** - The current `denomailer` library has TLS compatibility issues with IONOS servers
2. **Add custom password reset emails** - Route authentication emails through your IONOS SMTP instead of the default system

---

## Part 1: Fix SMTP Email Function

### Problem Identified

The `denomailer` library used in the current edge function has known STARTTLS compatibility issues. Based on your IONOS settings:
- **Port 465** requires direct SSL/TLS connection
- **Port 587** requires STARTTLS upgrade

The current implementation may not be handling either correctly.

### Solution

Replace `denomailer` with a more reliable approach using the native `smtp` module or switch to using Node.js-style SMTP via `nodemailer` (available in Deno via npm specifier).

### Changes to `supabase/functions/send-notification-email/index.ts`

- Replace `denomailer` with `npm:nodemailer` for better IONOS compatibility
- Configure proper TLS settings for port 465 (SSL/TLS) or 587 (STARTTLS)
- Add better error logging for debugging
- Add a `password_reset` email template

---

## Part 2: Add Custom Password Reset Function

### New Edge Function: `send-password-reset`

Create a dedicated function for password reset emails that:
- Accepts email address and reset token/link
- Sends branded password reset emails through IONOS SMTP
- Uses the same reliable SMTP connection as notifications

### Integration

The frontend password reset flow will call this function directly after requesting a reset from the authentication system.

---

## Part 3: Verify SMTP Secrets

Confirm these secrets are set correctly:
- `SMTP_HOST` = `smtp.ionos.com`
- `SMTP_PORT` = `465` (recommended for SSL/TLS)
- `SMTP_USER` = your IONOS email (e.g., `info@tpecflowers.com`)
- `SMTP_PASSWORD` = your email password

---

## Technical Implementation

### Updated SMTP Connection (using nodemailer)

```text
+------------------+     +-------------------+     +------------------+
|   Edge Function  | --> |   IONOS SMTP      | --> |   User Inbox     |
|   (nodemailer)   |     |   smtp.ionos.com  |     |                  |
|   Port 465/TLS   |     |   :465 (SSL)      |     |                  |
+------------------+     +-------------------+     +------------------+
```

### Files to Modify

| File | Change |
|------|--------|
| `supabase/functions/send-notification-email/index.ts` | Replace denomailer with nodemailer, add password_reset template |
| `supabase/config.toml` | Already configured correctly |

### New Email Template: Password Reset

A branded password reset email template matching your existing booking confirmation style with:
- TPEC Events branding
- Clear reset link/button
- Expiry notice
- Contact information

---

## Testing Plan

After implementation:
1. Deploy the updated edge function
2. Test with a simple notification email
3. Test password reset flow
4. Verify emails arrive in inbox (not spam)

