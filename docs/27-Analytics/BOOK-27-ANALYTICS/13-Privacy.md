# Privacy & Compliance

## Requirements

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Cookie consent | MVP: Not needed (no tracking cookies) | Analytics uses cookieless tracking (PostHog) |
| Privacy policy | Required | `/privacy` page with full disclosure |
| Analytics disclosure | Required | Privacy policy must list analytics tools used |
| Data export | Required | User can download their data from Settings |
| Account deletion | Required | User can delete account from Settings |
| Opt-out of marketing | Required | Unsubscribe link in all marketing emails |
| Data retention | Required | See retention schedule below |
| GDPR compliance | Required | See Book 21 for full GDPR compliance |

## Data Retention

| Data Type | Retention | Deletion Policy |
|-----------|-----------|-----------------|
| Analytics events (PostHog) | 24 months | Auto-deleted after 24 months |
| User profiles (Supabase) | Account lifetime + 90 days | Deleted 90 days after account deletion |
| Payment records (Supabase) | 7 years (legal requirement) | Anonymized after 7 years |
| Audit logs (Supabase) | 1 year | Archived after 1 year |
| Support tickets (Supabase) | 3 years | Deleted after 3 years |
| Email logs | 1 year | Deleted after 1 year |

## Privacy by Design

### Anonymization

PII is anonymized in analytics events:

```typescript
// ✅ Hashed email for analytics
trackEvent('user_registered', {
  email_hash: await sha256(email), // One-way hash, not reversible
  domain: email.split('@')[1],      // Only domain, not full email
});

// ❌ Never send raw PII to analytics
trackEvent('user_registered', {
  email: 'user@example.com', // NEVER DO THIS
});
```

### IP Handling

PostHog is configured to:

- Not store IP addresses (enable `$ip` capture disable)
- Use anonymized IP for geolocation only (country-level)
- Respect "Do Not Track" browser settings

### Consent Management

```typescript
// src/lib/analytics/consent.ts
export function getAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('analytics_consent') === 'granted';
}

export function setAnalyticsConsent(granted: boolean): void {
  localStorage.setItem('analytics_consent', granted ? 'granted' : 'denied');
  if (granted) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
}
```

## Compliance Checklist

- [ ] Privacy policy published at `/privacy`
- [ ] Cookie consent mechanism (if needed)
- [ ] Analytics disclosure in privacy policy
- [ ] Data export feature in user settings
- [ ] Account deletion feature in user settings
- [ ] Unsubscribe link in all marketing emails
- [ ] Data retention schedule documented
- [ ] PII never sent to analytics tools
- [ ] PostHog configured to not store IPs
- [ ] GDPR data processing agreement with PostHog
