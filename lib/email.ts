export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: EmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not configured");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TWallet <noreply@twallet.com>",
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message ?? "Failed to send email" };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to send email" };
  }
}

export function buildOrderConfirmationEmail(params: {
  orderNumber: string;
  productName: string;
  amount: string;
  orderUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Order Confirmed</h1>
      <p>Your order <strong>${params.orderNumber}</strong> for <strong>${params.productName}</strong> has been placed.</p>
      <p>Amount: <strong>${params.amount} USDC</strong></p>
      <p>Track your order: <a href="${params.orderUrl}">${params.orderUrl}</a></p>
    </div>
  `;
}

export function buildPaymentReceivedEmail(params: {
  orderNumber: string;
  amount: string;
  dashboardUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Payment Received</h1>
      <p>Your payment of <strong>${params.amount} USDC</strong> for order <strong>${params.orderNumber}</strong> has been received and verified.</p>
      <p>View your order: <a href="${params.dashboardUrl}">${params.dashboardUrl}</a></p>
    </div>
  `;
}

export function buildOrderShippedEmail(params: {
  orderNumber: string;
  trackingNumber?: string;
  dashboardUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Order Shipped</h1>
      <p>Your order <strong>${params.orderNumber}</strong> is on its way!</p>
      ${params.trackingNumber ? `<p>Tracking: <strong>${params.trackingNumber}</strong></p>` : ""}
      <p>Track delivery: <a href="${params.dashboardUrl}">${params.dashboardUrl}</a></p>
    </div>
  `;
}

export function buildPasswordResetEmail(params: {
  resetUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Reset Your Password</h1>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${params.resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
    </div>
  `;
}

export function buildWelcomeEmail(params: {
  name: string;
  dashboardUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Welcome to TWallet!</h1>
      <p>Hi ${params.name},</p>
      <p>Your account has been created. Connect a wallet to get started with your first card order.</p>
      <a href="${params.dashboardUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">Go to Dashboard</a>
    </div>
  `;
}

export function buildEmailVerificationEmail(params: {
  verifyUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Verify Your Email</h1>
      <p>Click the link below to verify your email address.</p>
      <a href="${params.verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">Verify Email</a>
    </div>
  `;
}

export function buildPasswordChangedEmail(): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Password Changed</h1>
      <p>Your password has been changed successfully. If you did not make this change, please contact support immediately.</p>
    </div>
  `;
}

export function buildTwoFactorEnabledEmail(): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Two-Factor Authentication Enabled</h1>
      <p>Two-factor authentication has been enabled on your account. Your account is now more secure.</p>
      <p>If you did not enable this, please contact support immediately.</p>
    </div>
  `;
}

export function buildShippingUpdateEmail(params: {
  orderNumber: string;
  status: string;
  dashboardUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Shipping Update</h1>
      <p>Your order <strong>${params.orderNumber}</strong> status has changed to <strong>${params.status}</strong>.</p>
      <p>View your order: <a href="${params.dashboardUrl}">${params.dashboardUrl}</a></p>
    </div>
  `;
}

export function buildAccountSuspendedEmail(params: {
  reason?: string;
  supportUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #DC2626;">Account Suspended</h1>
      <p>Your account has been suspended.</p>
      ${params.reason ? `<p>Reason: ${params.reason}</p>` : ""}
      <p>If you believe this is an error, please contact support: <a href="${params.supportUrl}">${params.supportUrl}</a></p>
    </div>
  `;
}

export function buildAccountReactivatedEmail(params: {
  dashboardUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #16A34A;">Account Reactivated</h1>
      <p>Your account has been reactivated. You can now use all TWallet services normally.</p>
      <a href="${params.dashboardUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">Go to Dashboard</a>
    </div>
  `;
}

export function buildTicketReceivedEmail(params: {
  ticketId: string;
  subject: string;
  dashboardUrl: string;
}): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Support Ticket Received</h1>
      <p>Your ticket <strong>${params.ticketId}</strong> regarding &ldquo;${params.subject}&rdquo; has been received.</p>
      <p>We will respond within 24 hours.</p>
      <p>View your ticket: <a href="${params.dashboardUrl}">${params.dashboardUrl}</a></p>
    </div>
  `;
}
