import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const exporter = new OTLPLogExporter({
      url: "https://us.i.posthog.com/otlp/v1/logs",
      headers: {
        Authorization:
          "Bearer phc_DdRdKqCwcZMGcYMTMx5fcYtBR7SiDQtDw3DzKC8rhtJT",
      },
    });

    const loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "twallet-services",
      }),
      processors: [new SimpleLogRecordProcessor({ exporter })],
    });

    (globalThis as any).__posthogLogger = loggerProvider.getLogger("twallet-services");
  }
}