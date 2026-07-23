import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("*/auth/v1/token*", () =>
    HttpResponse.json({
      access_token: "mock_token",
      user: { id: "user-1", email: "test@example.com" },
    }),
  ),
  http.get("*/rest/v1/profiles*", () =>
    HttpResponse.json([
      { id: "user-1", full_name: "Test User", email: "test@example.com", status: "active", country: "US", created_at: "2026-01-01T00:00:00Z" },
    ]),
  ),
  http.get("*/rest/v1/card_products*", () =>
    HttpResponse.json([
      { id: "prod-1", name: "Sapphire Card", type: "physical", price_usdc: 100, status: "active", created_at: "2026-01-01T00:00:00Z" },
    ]),
  ),
  http.post("*/rest/v1/card_orders*", () =>
    HttpResponse.json({
      id: "order-1",
      order_number: "TW-ABC123",
      amount_usdc: 100,
      status: "pending",
      created_at: "2026-01-01T00:00:00Z",
    }),
  ),
];
