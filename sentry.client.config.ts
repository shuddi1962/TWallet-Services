import * as Sentry from "@sentry/nextjs";

function isThirdPartyExtensionError(event: Sentry.ErrorEvent): boolean {
  const message = event?.exception?.values?.[0]?.value ?? "";
  const stack = event?.exception?.values?.[0]?.stacktrace?.frames?.map((f) => f.filename).join(" ") ?? "";
  return (
    message.includes("cca-lite.coinbase.com") ||
    stack.includes("frame_ant") ||
    stack.includes("app:///")
  );
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV ?? "development",
  enabled: process.env.NODE_ENV === "production",
  beforeSend(event) {
    if (isThirdPartyExtensionError(event)) {
      return null;
    }
    return event;
  },
});
