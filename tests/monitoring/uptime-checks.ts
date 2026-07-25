/** Uptime monitoring configuration for Better Uptime / UptimeRobot
 *
 * Run: npx tsx tests/monitoring/uptime-checks.ts
 * Output: JSON config that can be imported into Better Uptime API
 */

interface MonitorConfig {
  url: string;
  name: string;
  checkInterval: number;
  timeout: number;
  expectedStatus: number;
  alertIntegrations: string[];
}

const monitors: MonitorConfig[] = [
  {
    url: "https://twalletservices.com/api/health",
    name: "Production Liveness",
    checkInterval: 300,
    timeout: 10,
    expectedStatus: 200,
    alertIntegrations: ["slack", "email"],
  },
  {
    url: "https://twalletservices.com/api/ready",
    name: "Production Readiness",
    checkInterval: 60,
    timeout: 15,
    expectedStatus: 200,
    alertIntegrations: ["slack", "email"],
  },
  {
    url: "https://twalletservices.com/api/version",
    name: "Production Version",
    checkInterval: 3600,
    timeout: 10,
    expectedStatus: 200,
    alertIntegrations: ["slack"],
  },
  {
    url: "https://twalletservices.com",
    name: "Production Homepage",
    checkInterval: 300,
    timeout: 10,
    expectedStatus: 200,
    alertIntegrations: ["slack"],
  },
  {
    url: "https://twalletservices.com/auth/login",
    name: "Login Page",
    checkInterval: 300,
    timeout: 10,
    expectedStatus: 200,
    alertIntegrations: ["slack"],
  },
];

function generateBetterUptimeConfig() {
  // Better Uptime API: POST https://betteruptime.com/api/v2/monitors
  // See: https://docs.betteruptime.com/api/monitors
  console.log(JSON.stringify(monitors, null, 2));
  console.log("\n---");
  console.log("Import into Better Uptime:");
  console.log("1. Go to Better Uptime → Monitors → Add Monitor");
  console.log("2. For each entry above, create a monitor with these fields:");
  console.log("   - Monitor Type: HTTP");
  console.log("   - URL: <url>");
  console.log("   - Check Interval: <checkInterval> seconds");
  console.log("   - Timeout: <timeout> seconds");
  console.log("   - Expected Status Code: <expectedStatus>");
  console.log("   - Alert Integrations: <alertIntegrations>");
}

function generateUptimeRobotConfig() {
  // UptimeRobot API: POST https://api.uptimerobot.com/v2/newMonitor
  console.log("\n--- UptimeRobot Config ---");
  for (const m of monitors) {
    console.log(`Monitor: ${m.name}`);
    console.log(`  URL: ${m.url}`);
    console.log(`  Interval: ${m.checkInterval}`);
    console.log(`  Timeout: ${m.timeout}`);
    console.log();
  }
}

generateBetterUptimeConfig();
generateUptimeRobotConfig();
