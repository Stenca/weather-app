import { describe, it, expect, beforeEach } from "vitest";
import { StorageService } from "./storageService";
import type { City } from "../models/weather";

describe("StorageService", () => {
  let service: StorageService;

  const paris: City = {
    id: 2988507,
    name: "Paris",
    latitude: 48.85,
    longitude: 2.35,
    country: "France",
    admin1: "Île-de-France",
  };

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  describe("saveCity / loadCity", () => {
    it("returns null when nothing is stored", () => {
      expect(service.loadCity()).toBeNull();
    });

    it("round-trips a city", () => {
      service.saveCity(paris);
      expect(service.loadCity()).toEqual(paris);
    });

    it("preserves all fields including admin1", () => {
      service.saveCity(paris);
      const loaded = service.loadCity();

      expect(loaded?.id).toBe(2988507);
      expect(loaded?.name).toBe("Paris");
      expect(loaded?.latitude).toBe(48.85);
      expect(loaded?.longitude).toBe(2.35);
      expect(loaded?.country).toBe("France");
      expect(loaded?.admin1).toBe("Île-de-France");
    });

    it("works without the optional admin1 field", () => {
      const { admin1, ...cityWithoutAdmin1 } = paris;
      service.saveCity(cityWithoutAdmin1);

      const loaded = service.loadCity();
      expect(loaded).toEqual(cityWithoutAdmin1);
      expect(loaded?.admin1).toBeUndefined();
    });

    it("overwrites the previous city", () => {
      const london: City = {
        id: 2643743,
        name: "London",
        latitude: 51.5,
        longitude: -0.13,
        country: "United Kingdom",
      };

      service.saveCity(paris);
      service.saveCity(london);

      expect(service.loadCity()).toEqual(london);
    });
  });

  describe("clear", () => {
    it("removes the stored city", () => {
      service.saveCity(paris);
      service.clear();
      expect(service.loadCity()).toBeNull();
    });

    it("does nothing when storage is empty", () => {
      expect(() => service.clear()).not.toThrow();
    });
  });

  describe("error handling", () => {
    it("returns null when stored JSON is invalid", () => {
      localStorage.setItem("weather:lastCity", "not json");
      expect(service.loadCity()).toBeNull();
    });

    it("returns null when stored value is not an object", () => {
      localStorage.setItem("weather:lastCity", JSON.stringify("just a string"));
      expect(service.loadCity()).toBeNull();
    });
  });
});
