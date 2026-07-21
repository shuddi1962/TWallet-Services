# Test Cases — TWallet Services

## Authentication

| TC-ID | Title | Steps | Expected |
|-------|-------|-------|----------|
| AUTH-01 | Register new user | Fill form, submit | Email verification sent |
| AUTH-02 | Login with valid credentials | Enter email + password | Redirected to dashboard |
| AUTH-03 | Login with invalid password | Enter wrong password | Error message shown |
| AUTH-04 | Login with unverified email | Submit without verifying | Redirect to verify page |
| AUTH-05 | Forgot password | Enter email | Reset link sent |
| AUTH-06 | Reset password | Click link, enter new password | Password updated, logged in |
| AUTH-07 | Logout | Click logout | Session cleared, redirect to / |

## Wallet

| TC-ID | Title | Steps | Expected |
|-------|-------|-------|----------|
| WAL-01 | Connect wallet | Click Connect, approve in wallet | Wallet shown in dashboard |
| WAL-02 | Disconnect wallet | Click Disconnect | Wallet removed from dashboard |
| WAL-03 | Switch network | Change network in wallet | Network badge updates |
| WAL-04 | Connect duplicate wallet | Connect same address again | Error: wallet already connected |

## Orders

| TC-ID | Title | Steps | Expected |
|-------|-------|-------|----------|
| ORD-01 | Browse card products | Visit /cards | All active products displayed |
| ORD-02 | Create order | Select card, enter shipping, submit | Order created, pending status |
| ORD-03 | View order history | Visit /app/orders | Paginated list of orders |
| ORD-04 | Cancel pending order | Click cancel on pending order | Order status = cancelled |
| ORD-05 | Track shipped order | Visit order detail | Tracking number + carrier shown |

## Payments

| TC-ID | Title | Steps | Expected |
|-------|-------|-------|----------|
| PAY-01 | Submit payment | Copy address, send crypto, verify | Payment confirmed, order = paid |
| PAY-02 | Payment timeout | Wait > 48 hours without paying | Order expired, cancelled |
| PAY-03 | Insufficient payment | Send less than required | Payment pending, balance shown |
| PAY-04 | Wrong network | Send on unsupported chain | Error: unsupported network |

## Admin

| TC-ID | Title | Steps | Expected |
|-------|-------|-------|----------|
| ADM-01 | Login as admin | Enter admin credentials | Admin dashboard |
| ADM-02 | View all orders | Navigate to Orders | Table with all customer orders |
| ADM-03 | Update order status | Change status, add note | Status updated, audit logged |
| ADM-04 | View user list | Navigate to Users | Paginated user table |
| ADM-05 | Suspend user | Click suspend | User status = suspended |
