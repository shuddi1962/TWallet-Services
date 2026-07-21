# Security Testing

## What to Test

| Area | Test | Tool |
|------|------|------|
| Authentication | Credential stuffing, brute force, session hijacking | Vitest + custom |
| Authorization | IDOR, privilege escalation, role bypass | Vitest + RLS tests |
| JWT | Token tampering, expiration, refresh | Vitest |
| CSRF | Cross-origin form submission | Playwright |
| XSS | Script injection in inputs, URL params | Playwright |
| SQL Injection | Malformed query parameters | Vitest |
| Rate limiting | Exceeding limits on auth/payment endpoints | Vitest |
| File upload | Malicious file types, oversized files | Playwright |
| Secret exposure | Env var leakage in client bundle | Build check |
| CSP | Policy blocks inline scripts, eval | Lighthouse |
| RLS bypass | Direct table access with anon key | Supabase tests |

## Security Test Pattern

```ts
describe("XSS prevention", () => {
  it("sanitizes script tags in user input", async () => {
    const result = await createTicket({
      subject: "<script>alert('xss')</script>",
      message: "Hello",
    })
    expect(result.subject).not.toContain("<script>")
  })

  it("CSP blocks inline scripts", async () => {
    const res = await fetch("/")
    const csp = res.headers.get("content-security-policy")
    expect(csp).toContain("script-src")
    expect(csp).not.toContain("'unsafe-inline'")
  })
})

describe("RLS bypass prevention", () => {
  it("anon key cannot access profiles directly", async () => {
    const supabase = createClient(url, anonKey)
    const { data, error } = await supabase.from("profiles").select("*")
    expect(data).toBeNull()
    expect(error).toBeTruthy()
  })
})
```

## Tools

| Tool | Purpose |
|------|---------|
| Vitest | Automated security test suites |
| Playwright | XSS, CSRF, form-based attacks |
| OWASP ZAP (future) | Automated security scanning |
| npm audit | Dependency vulnerability scanning |
| Supabase advisors | RLS and security policy review |
| Lighthouse | CSP, HTTPS, security headers audit |
