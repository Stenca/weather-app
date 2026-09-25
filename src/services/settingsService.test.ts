import { describe, it, expect, beforeEach } from "vitest";
import { SettingsService } from "./settingsService";

describe("SettingsService", () => {
  let service: SettingsService;

  beforeEach(() => {
    localStorage.clear();
    service = new SettingsService();
  });

  describe("load", () => {
    it("returns defaults when nothing is stored", () => {
      const settings = service.load();
      expect(settings).toEqual({
        units: "metric",
        theme: "dark",
      });
    });

    it("returns stored settings when present", () => {
      localStorage.setItem(
        "weather:settings",
        JSON.stringify({ units: "imperial", theme: "light" }),
      );

      const settings = service.load();
      expect(settings).toEqual({
        units: "imperial",
        theme: "light",
      });
    });

    it("merges stored settings with defaults", () => {
      // Only `units` is stored — `theme` should fall back to default
      localStorage.setItem(
        "weather:settings",
        JSON.stringify({ units: "imperial" }),
      );

      const settings = service.load();
      expect(settings).toEqual({
        units: "imperial",
        theme: "dark",
      });
    });

    it("falls back to defaults when stored JSON is invalid", () => {
      localStorage.setItem("weather:settings", "not json");

      const settings = service.load();
      expect(settings).toEqual({
        units: "metric",
        theme: "dark",
      });
    });
  });

  describe("save", () => {
    it("writes settings to localStorage", () => {
      service.save({ units: "imperial", theme: "light" });

      const raw = localStorage.getItem("weather:settings");
      expect(JSON.parse(raw!)).toEqual({
        units: "imperial",
        theme: "light",
      });
    });

    it("overwrites previous settings", () => {
      service.save({ units: "imperial", theme: "light" });
      service.save({ units: "metric", theme: "dark" });

      const raw = localStorage.getItem("weather:settings");
      expect(JSON.parse(raw!)).toEqual({
        units: "metric",
        theme: "dark",
      });
    });
  });

  describe("update", () => {
    it("updates units and preserves theme", () => {
      const next = service.update({ units: "imperial" });

      expect(next).toEqual({
        units: "imperial",
        theme: "dark", // unchanged
      });
    });

    it("updates theme and preserves units", () => {
      const next = service.update({ theme: "light" });

      expect(next).toEqual({
        units: "metric", // unchanged
        theme: "light",
      });
    });

    it("can update both fields at once", () => {
      const next = service.update({
        units: "imperial",
        theme: "light",
      });

      expect(next).toEqual({
        units: "imperial",
        theme: "light",
      });
    });

    it("persists the merged result", () => {
      service.update({ units: "imperial" });

      const raw = localStorage.getItem("weather:settings");
      expect(JSON.parse(raw!)).toEqual({
        units: "imperial",
        theme: "dark",
      });
    });

    it("works on empty storage (uses defaults as base)", () => {
      const result = service.update({ units: "imperial" });

      expect(result).toEqual({
        units: "imperial",
        theme: "dark",
      });
    });
  });
});
