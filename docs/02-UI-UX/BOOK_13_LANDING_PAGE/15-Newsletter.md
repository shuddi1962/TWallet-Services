# 15 — Newsletter

> Component ID: LP-014 | Status: Approved
> Email subscription form with validation and success/error states.

## Purpose

Collect email subscriptions from visitors who are interested but not ready to register yet. Build a mailing list for product updates and announcements.

## Section Specs

| Property | Value |
|----------|-------|
| Background | `--color-primary` (#2563EB) — gradient to `--color-primary-hover` (#1D4ED8) |
| Layout | Centered, full-width |
| Padding | `--space-16` (64px) vertical |
| Text color | White |

## Content

| Element | Spec |
|---------|------|
| Heading | "Stay Updated" (`--text-section` 40px, 700, white) |
| Subtext | "Get product updates, new features, and crypto card news." (`--text-body`, white/90%) |

## Form

### Fields
| Field | Type | Placeholder | Validation |
|-------|------|-------------|------------|
| Email Address | email | "Enter your email" | Required, valid email |
| Subscribe | submit button | — | — |

### Form Layout
- Inline: email input + subscribe button (max-width 480px, centered)
- Input: white bg, `--color-body` text, `--radius-button`, 56px height
- Button: white bg, `--color-primary` text, `--radius-button`, 56px height, "Subscribe"

### Privacy Text
- "We respect your privacy. No spam." (12px, white/70%, centered below form)

## Validation

```ts
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
});
```

### Validation Behavior
- **On blur:** Validate after user leaves the field (first attempt)
- **On submit:** Validate on submit; show errors if invalid
- **Real-time:** Re-validate as user types (after first error)

## States

### Success State
| Element | Value |
|---------|-------|
| Message | "Subscription Successful" |
| Style | Alert success (green bg/10%, green border, green text, check icon) |
| Behavior | Clear input; show message for 5s then fade; input re-enabled |
| aria-live | `polite` (announced to screen readers) |

### Error States

| Error | Message | Style |
|-------|---------|-------|
| Email already exists | "You're already subscribed!" | Alert info (blue tint) |
| Invalid email | "Enter a valid email" | Inline below input (red text) |
| Server error | "Something went wrong. Try again." | Alert error (red tint) |
| Network error | "Check your connection and try again." | Alert error |

### Loading State
| Element | Value |
|---------|-------|
| Button | Spinner + "Subscribing..." (disabled) |
| Input | Disabled (prevent changes during submit) |

## Component Tree

```
Newsletter (RSC + Client form)
├── NewsletterContent (centered)
│   ├── Heading ("Stay Updated" — white)
│   ├── Subtext ("Get product updates..." — white/90%)
│   ├── NewsletterForm (Client Component)
│   │   ├── Form (react-hook-form + Zod)
│   │   │   ├── Input (type=email, placeholder="Enter your email")
│   │   │   ├── Button ("Subscribe")
│   │   │   ├── SuccessAlert ("Subscription Successful" — conditional)
│   │   │   ├── ErrorAlert ("You're already subscribed!" — conditional)
│   │   │   ├── ErrorAlert ("Enter a valid email" — conditional inline)
│   │   │   └── ErrorAlert ("Something went wrong. Try again." — conditional)
│   └── PrivacyText ("We respect your privacy. No spam.")
```

## Animations

| Animation | Element | Duration | Trigger |
|-----------|---------|----------|---------|
| Section fade-in | Whole section | 300ms | Scroll into view |
| Success alert slide-up | Alert | 300ms easeOut | Successful submit |
| Error alert slide-up | Alert | 300ms easeOut | Failed submit |
| Button loading | Spinner | — | During submit |

### prefers-reduced-motion
- Disable: slide-up animations (instant show)
- Keep: fade-in (or disable)

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Section label | `<section aria-label="Newsletter Signup">` |
| Input label | `<label>` (visually hidden) "Email address" |
| Button | `aria-label="Subscribe to newsletter"` |
| Alerts | `aria-live="polite"` region (announces state changes) |
| Error text | `aria-describedby` on input pointing to error message |
| Keyboard | Tab to input, Tab to button, Enter to submit |
| Color contrast | White on #2563EB = 4.6:1 (AA) |

## Implementation

- Use `react-hook-form` for form state
- Use Zod for validation (client + server)
- Server Action or API endpoint to store email
- For MVP: store in Supabase `newsletter_subscribers` table (simple) or Resend audience
- No Turnstile for MVP (low spam risk; add later if needed)
