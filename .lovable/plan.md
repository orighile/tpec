

# Plan: Apply Password Reset Improvements

## Overview
Apply the improvements from your uploaded `send-password-reset-improved.ts` to fix SMTP reliability issues and enhance security in the password reset flow.

---

## Changes to Implement

### 1. Update Edge Function: `supabase/functions/send-password-reset/index.ts`

**Key improvements to apply:**

**A. Use APP_URL Environment Variable**
- Replace hardcoded URL manipulation with configurable `APP_URL` env variable
- Provides cleaner redirect URL: `${appUrl}/auth?type=recovery`

**B. Enhanced Email Validation**
- Check for both empty email and valid format (`!email || !email.includes('@')`)

**C. Change Default SMTP Port**
- Switch from port 465 (SSL) to 587 (STARTTLS)
- STARTTLS is more reliable with IONOS SMTP

**D. Add Connection Timeouts**
- `connectionTimeout: 30000` (30 seconds)
- `greetingTimeout: 30000` (30 seconds)  
- `socketTimeout: 45000` (45 seconds)

**E. Add SMTP Connection Verification**
- Call `transporter.verify()` before sending to catch connection issues early

**F. Add Send Timeout Protection**
- Use `Promise.race()` with 40-second timeout to prevent hanging requests

**G. Improve Error Response Security**
- Return HTTP 200 with generic success message on errors
- Prevents email enumeration attacks

---

## Technical Details

### File Changes

```text
supabase/functions/send-password-reset/index.ts
```

**Key code additions:**

1. APP_URL configuration:
```typescript
const appUrl = Deno.env.get("APP_URL") || "https://tpec-64110.lovable.app";
const redirectTo = `${appUrl}/auth?type=recovery`;
```

2. SMTP Transport with timeouts:
```typescript
const transportConfig = {
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: { user: smtpUser, pass: smtpPassword },
  tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 45000,
};
```

3. Connection verification:
```typescript
try {
  await transporter.verify();
  console.log('SMTP connection verified');
} catch (verifyError) {
  console.error('SMTP verification failed:', verifyError);
}
```

4. Timeout-protected send:
```typescript
const emailPromise = transporter.sendMail(mailOptions);
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Email send timeout')), 40000)
);
const info = await Promise.race([emailPromise, timeoutPromise]);
```

5. Secure error handling:
```typescript
// In catch block - return 200 for security
return new Response(
  JSON.stringify({ 
    success: true, 
    message: "If an account exists with this email, a password reset link has been sent." 
  }),
  { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
);
```

---

## Optional: Add APP_URL Secret

If you want the redirect URL to be configurable without code changes, you can add an `APP_URL` secret with value `https://tpec-64110.lovable.app`. Otherwise, the fallback will work automatically.

---

## Summary

| Issue | Solution |
|-------|----------|
| SMTP timeouts/hanging | Connection and socket timeouts |
| Unreliable email delivery | STARTTLS (port 587) + verification |
| Email enumeration vulnerability | Always return success response |
| Hardcoded redirect URL | Configurable via APP_URL env var |

---

## Files to Modify
- `supabase/functions/send-password-reset/index.ts` - Apply all improvements

