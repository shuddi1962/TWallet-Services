# Go-Live Sequence

## Pre-Launch (T-24 hours)

| Time | Task | Owner |
|------|------|-------|
| T-24h | Final pre-launch checklist review | CTO |
| T-24h | Stakeholder go/no-go decision | CTO + Product |
| T-12h | Production database migration applied | Engineering |
| T-12h | Edge Functions deployed to production | Engineering |
| T-6h | All environment variables verified | Engineering |
| T-6h | Sentry verified as active | Engineering |
| T-6h | Uptime Robot configured and active | Engineering |
| T-4h | Backup verified | Engineering |
| T-4h | Rollback plan documented | Engineering |
| T-2h | Support team briefed | Support Lead |
| T-1h | Team on standby in Slack #launch | All |

## Launch Sequence (T-0)

### Step 1: Deploy to Production

```bash
# Trigger Vercel production deploy from main branch
# Or via CLI:
vercel deploy --prod
```

### Step 2: Verify Core Functionality

```text
□ Homepage loads (200 OK, < 2s)
□ /api/health returns 200
□ /api/ready returns 200
□ Login page loads
□ Registration works
□ Email verification received
```

### Step 3: Verify Wallet & Payments

```text
□ WalletConnect modal opens
□ MetaMask connection works
□ Card catalog loads
□ Card order placed successfully
□ Crypto payment submitted
□ Payment confirmed on-chain
□ Order status updated to "confirmed"
□ Email notification received
```

### Step 4: Verify Admin

```text
□ Admin login works
□ User list loads
□ Orders list loads
□ Payments list loads
□ Order status change works
```

### Step 5: Enable Monitoring

```text
□ Sentry capturing errors (force a test error)
□ Uptime Robot green
□ Vercel Analytics showing traffic
□ Alerts configured correctly
□ Slack #incidents receiving notifications
```

### Step 6: Public Launch

```text
□ Remove maintenance page (if any)
□ Update DNS if needed
□ Verify site accessible publicly
□ Announce on social media
□ Notify team in Slack #launch
□ Start post-launch monitoring timer
```

## Launch Day Support

| Role | Name | Responsibility |
|------|------|----------------|
| Incident lead | [CTO] | Overall launch coordination |
| Engineering lead | [Tech Lead] | Technical issue resolution |
| Support lead | [Support Lead] | Customer inquiries |
| Communications | [Product Manager] | Status updates |
