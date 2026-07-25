// k6 smoke test — TWallet Services
// Run: k6 run tests/load/smoke-test.js

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "https://twalletservices.com";

const errorRate = new Rate("errors");

export const options = {
  vus: 1,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<2000"],
    errors: ["rate<0.05"],
  },
};

export default function () {
  const responses = http.batch([
    ["GET", `${BASE_URL}/`, null, { tags: { name: "homepage" } }],
    ["GET", `${BASE_URL}/pricing`, null, { tags: { name: "pricing" } }],
    ["GET", `${BASE_URL}/cards`, null, { tags: { name: "cards" } }],
    ["GET", `${BASE_URL}/how-it-works`, null, { tags: { name: "how-it-works" } }],
    ["GET", `${BASE_URL}/faq`, null, { tags: { name: "faq" } }],
    ["GET", `${BASE_URL}/api/health`, null, { tags: { name: "health" } }],
  ]);

  responses.forEach((res) => {
    errorRate.add(res.status !== 200);
    check(res, {
      "status is 200": (r) => r.status === 200,
    });
  });

  sleep(1);
}
