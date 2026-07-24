export function orderConfirmationHtml(orderNumber: string, productName: string, amount: string, orderUrl: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#111827;border-radius:16px;padding:40px 32px;border:1px solid #1e293b">
    <h1 style="color:#2563eb;font-size:24px;font-weight:700;text-align:center;margin:0 0 16px">Order Confirmed</h1>
    <p style="color:#94a3b8;font-size:16px;line-height:24px;margin:0 0 12px">Your order <strong>${orderNumber}</strong> for <strong>${productName}</strong> has been placed.</p>
    <p style="color:#94a3b8;font-size:16px;line-height:24px;margin:0 0 12px">Amount: <strong>${amount} USDC</strong></p>
    <div style="text-align:center;margin-top:24px"><a href="${orderUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600">View Order</a></div>
  </div>`;
}

export function welcomeHtml(name: string, dashboardUrl: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#111827;border-radius:16px;padding:40px 32px;border:1px solid #1e293b">
    <h1 style="color:#2563eb;font-size:24px;font-weight:700;text-align:center;margin:0 0 16px">Welcome to TWallet!</h1>
    <p style="color:#94a3b8;font-size:16px;line-height:24px;margin:0 0 12px">Hi ${name},</p>
    <p style="color:#94a3b8;font-size:16px;line-height:24px;margin:0 0 12px">Your account has been created. Connect a wallet to get started with your first card order.</p>
    <div style="text-align:center;margin-top:24px"><a href="${dashboardUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600">Go to Dashboard</a></div>
  </div>`;
}

export function passwordResetHtml(resetUrl: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#111827;border-radius:16px;padding:40px 32px;border:1px solid #1e293b">
    <h1 style="color:#2563eb;font-size:24px;font-weight:700;text-align:center;margin:0 0 16px">Reset Your Password</h1>
    <p style="color:#94a3b8;font-size:16px;line-height:24px;margin:0 0 12px">Click the link below to reset your password. This link expires in 1 hour.</p>
    <div style="text-align:center;margin-top:24px"><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600">Reset Password</a></div>
  </div>`;
}

export function paymentReceivedHtml(orderNumber: string, amount: string, dashboardUrl: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#111827;border-radius:16px;padding:40px 32px;border:1px solid #1e293b">
    <h1 style="color:#2563eb;font-size:24px;font-weight:700;text-align:center;margin:0 0 16px">Payment Received</h1>
    <p style="color:#94a3b8;font-size:16px;line-height:24px;margin:0 0 12px">Your payment of <strong>${amount} USDC</strong> for order <strong>${orderNumber}</strong> has been received and verified.</p>
    <div style="text-align:center;margin-top:24px"><a href="${dashboardUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600">View Order</a></div>
  </div>`;
}

export function orderShippedHtml(orderNumber: string, dashboardUrl: string, trackingNumber?: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#111827;border-radius:16px;padding:40px 32px;border:1px solid #1e293b">
    <h1 style="color:#2563eb;font-size:24px;font-weight:700;text-align:center;margin:0 0 16px">Order Shipped</h1>
    <p style="color:#94a3b8;font-size:16px;line-height:24px;margin:0 0 12px">Your order <strong>${orderNumber}</strong> is on its way!</p>
    ${trackingNumber ? `<p style="color:#94a3b8;font-size:16px;line-height:24px;margin:0 0 12px">Tracking: <strong>${trackingNumber}</strong></p>` : ""}
    <div style="text-align:center;margin-top:24px"><a href="${dashboardUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600">Track Delivery</a></div>
  </div>`;
}