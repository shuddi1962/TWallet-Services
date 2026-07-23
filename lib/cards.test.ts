import { describe, it, expect } from "vitest";
import { cardFinishes, cardOrder, sampleCards } from "./cards";

describe("cardFinishes", () => {
  it("has entries for all finishes", () => {
    const finishes = Object.keys(cardFinishes);
    expect(finishes).toEqual(["sapphire", "obsidian", "cyber", "gold", "holographic"]);
  });

  it("each finish has required fields", () => {
    for (const finish of Object.values(cardFinishes)) {
      expect(finish.label).toBeTruthy();
      expect(finish.tagline).toBeTruthy();
      expect(finish.gradient).toContain("from-");
      expect(finish.chipColor).toContain("from-");
      expect(finish.accent).toContain("from-");
      expect(finish.borderGlow).toMatch(/^rgba\(/);
      expect(finish.bgPattern).toBeTruthy();
      expect(finish.logoColor).toMatch(/^#/);
    }
  });
});

describe("cardOrder", () => {
  it("defines correct order", () => {
    expect(cardOrder).toEqual(["sapphire", "obsidian", "cyber", "gold", "holographic"]);
  });
});

describe("sampleCards", () => {
  it("has cards for every finish", () => {
    for (const finish of cardOrder) {
      const card = sampleCards[finish];
      expect(card).toBeDefined();
      expect(card.finish).toBe(finish);
      expect(card.holderName).toBeTruthy();
      expect(card.cardNumber).toMatch(/^\d{16}$/);
      expect(card.expiryDate).toMatch(/^\d{2}\/\d{2}$/);
      expect(card.cvc).toMatch(/^\d{3}$/);
    }
  });

  it("has unique card numbers", () => {
    const numbers = cardOrder.map((f) => sampleCards[f]!.cardNumber);
    expect(new Set(numbers).size).toBe(numbers.length);
  });
});
