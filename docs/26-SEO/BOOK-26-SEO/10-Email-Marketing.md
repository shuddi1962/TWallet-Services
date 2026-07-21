# Email Marketing

## Email Templates

| Email | Trigger | Delay | Priority |
|-------|---------|-------|----------|
| Welcome | Account created | Immediate | Required |
| Verify Email | Registration | Immediate | Required |
| Order Confirmation | Order created | Immediate | Required |
| Payment Confirmation | Payment confirmed | Immediate | Required |
| Payment Failed | Payment verification failed | Immediate | Required |
| Shipping Update | Card status changes | Immediate | Required |
| Password Reset | User requested reset | Immediate | Required |
| Support Reply | Agent responded to ticket | Immediate | Required |
| Newsletter | Weekly digest | Weekly | Optional |
| Product Announcement | New feature launched | As needed | Optional |
| Re-engagement | Inactive 90 days | Monthly | Optional |
| Referral Invite | User clicked share | Immediate | Optional |

## Email Service

Use **Resend** (already integrated — see Book 10A) for transactional emails. Use a dedicated marketing email service (e.g., Mailchimp, ConvertKit) for newsletters and campaigns.

## Implementation Pattern

```typescript
// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

export async function sendEmail({ to, subject, template, data }: SendEmailParams) {
  const { error } = await resend.emails.send({
    from: 'TWallet <noreply@twallet.app>',
    to,
    subject,
    react: await getEmailTemplate(template, data),
  });

  if (error) {
    log('ERROR', 'email', 'Failed to send email', { error, to, template });
    throw error;
  }
}
```

## Transactional Email Templates

```typescript
// src/emails/welcome.tsx
export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to TWallet — your card is ready</Preview>
      <Body style={main}>
        <Container>
          <Img src="https://twallet.app/email/logo.png" width={120} height={40} />
          <Heading>Welcome to TWallet, {name}!</Heading>
          <Text>Your crypto-funded virtual card is ready to use.</Text>
          <Button href="https://twallet.app/app/dashboard">
            Go to Dashboard
          </Button>
          <Text>
            Connect your wallet, fund your card, and start spending anywhere that accepts Visa.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

## Email Design Guidelines

- Responsive design (works on mobile + desktop)
- Brand colors and logo
- Clear CTA button
- Plain-text alternative
- Unsubscribe link (required for marketing emails)
- Transactional emails exempt from unsubscribe requirement

## Automation Workflows

| Workflow | Trigger | Emails | Delay |
|----------|---------|--------|-------|
| Welcome series | Signup | Welcome + Getting Started + First Deposit | 0h / 24h / 72h |
| Abandoned checkout | Order created, not paid | Reminder + Follow-up | 1h / 24h |
| Inactive user | No login 30 days | Re-engagement | 30d / 60d / 90d |
| Referral follow-up | Referral link clicked | Share prompt + Reward reminder | 0h / 7d |
