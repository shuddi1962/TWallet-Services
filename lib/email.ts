import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: EmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: "TWallet <noreply@twallet.com>",
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) return { success: false, error: error.message };
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
