

## Fix: `NodeJS.Timeout` Build Error

### Problem
`src/utils/apiIntegration.ts` line 399 uses `NodeJS.Timeout` type, which is not available in a browser/Vite project (no `@types/node` in the TypeScript config).

### Fix
Change `let timeoutId: NodeJS.Timeout;` to `let timeoutId: ReturnType<typeof setTimeout>;`

This is the standard browser-compatible way to type `setTimeout` return values.

### File Changed
- `src/utils/apiIntegration.ts` — line 399 only

### Site-Wide Issues Audit
After fixing this build error, I can proceed with a broader audit. However, the site cannot build until this error is resolved, so fixing it first is essential.

