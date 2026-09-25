import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { CacheService } from "./cacheService";

describe("CacheService", () => {
  let cache: CacheService<string>;

  beforeEach(() => {
    cache = new CacheService<string>(1000);
  });

  afterEach(() => {
    vi.useRealTimers(); // ← always restore
  });

  describe("get / set", () => {
    it("returns null for a missing key", () => {
      expect(cache.get("missing")).toBeNull();
    });

    it("returns the value after set", () => {
      cache.set("a", "hello");
      expect(cache.get("a")).toBe("hello");
    });

    it("overwrites an existing value", () => {
      cache.set("a", "first");
      cache.set("a", "second");
      expect(cache.get("a")).toBe("second");
    });

    it("stores multiple distinct keys", () => {
      cache.set("a", "one");
      cache.set("b", "two");
      expect(cache.get("a")).toBe("one");
      expect(cache.get("b")).toBe("two");
    });
  });

  describe("expiry", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("returns the value before TTL expires", () => {
      cache.set("a", "hello");
      vi.advanceTimersByTime(500);
      expect(cache.get("a")).toBe("hello");
    });

    it("returns null after TTL expires", () => {
      cache.set("a", "hello");
      vi.advanceTimersByTime(1001);
      expect(cache.get("a")).toBeNull();
    });

    it("deletes expired entries on access", () => {
      cache.set("a", "hello");
      vi.advanceTimersByTime(1001);
      cache.get("a"); // triggers cleanup
      expect(cache.has("a")).toBe(false);
    });
  });

  describe("has", () => {
    it("returns true for a cached key", () => {
      cache.set("a", "hello");
      expect(cache.has("a")).toBe(true);
    });

    it("returns false for a missing key", () => {
      expect(cache.has("missing")).toBe(false);
    });

    it("returns false for an expired key", () => {
      vi.useFakeTimers();
      cache.set("a", "hello");
      vi.advanceTimersByTime(1001);
      expect(cache.has("a")).toBe(false);
    });
  });

  describe("delete", () => {
    it("removes a single entry", () => {
      cache.set("a", "one");
      cache.set("b", "two");
      cache.delete("a");
      expect(cache.get("a")).toBeNull();
      expect(cache.get("b")).toBe("two");
    });

    it("does nothing for a missing key", () => {
      expect(() => cache.delete("missing")).not.toThrow();
    });
  });

  describe("clear", () => {
    it("removes all entries", () => {
      cache.set("a", "one");
      cache.set("b", "two");
      cache.clear();
      expect(cache.get("a")).toBeNull();
      expect(cache.get("b")).toBeNull();
    });
  });
});
