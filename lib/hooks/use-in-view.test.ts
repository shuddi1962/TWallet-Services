// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInView } from "./use-in-view";

describe("useInView", () => {
  it("starts with inView false", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.inView).toBe(false);
    expect(result.current.ref).toBeDefined();
  });

  it("returns a ref object", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toHaveProperty("current");
  });

  it("accepts custom options", () => {
    const { result } = renderHook(() => useInView({ threshold: 0.5, once: false }));
    expect(result.current.inView).toBe(false);
  });
});
