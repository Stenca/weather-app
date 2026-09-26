import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { WeatherService } from "./weatherService";
import type { City } from "../models/weather";

describe("WeatherService", () => {
  let service: WeatherService;
  let fetchMock: ReturnType<typeof vi.fn>;

  const paris: City = {
    id: 2988507,
    name: "Paris",
    latitude: 48.85,
    longitude: 2.35,
    country: "France",
  };

  const forecastResponse = {
    current: {
      time: "2026-09-25T14:00",
      temperature_2m: 18.3,
      apparent_temperature: 16.1,
      weather_code: 3,
      wind_speed_10m: 12.4,
      wind_direction_10m: 220,
      relative_humidity_2m: 72,
      precipitation: 0.2,
      cloud_cover: 80,
      is_day: 1,
    },
    daily: {
      time: ["2026-09-25", "2026-09-26"],
      weather_code: [3, 61],
      temperature_2m_max: [19.1, 17.4],
      temperature_2m_min: [11.2, 10.8],
      precipitation_probability_max: [10, 60],
      precipitation_sum: [0, 5.2],
      wind_speed_10m_max: [15.3, 22.1],
      uv_index_max: [4, 2],
      sunrise: ["2026-09-25T07:24", "2026-09-26T07:25"],
      sunset: ["2026-09-25T19:12", "2026-09-26T19:10"],
    },
  };

  beforeEach(() => {
    service = new WeatherService();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("searchCities", () => {
    it("returns mapped cities on success", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              id: 1,
              name: "Paris",
              latitude: 48.85,
              longitude: 2.35,
              country: "France",
              admin1: "Île-de-France",
            },
          ],
        }),
      });

      const cities = await service.searchCities("Paris");

      expect(cities).toHaveLength(1);
      expect(cities[0]).toEqual({
        id: 1,
        name: "Paris",
        latitude: 48.85,
        longitude: 2.35,
        country: "France",
        admin1: "Île-de-France",
      });
    });

    it("returns an empty array when no results", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const cities = await service.searchCities("Nowhere");
      expect(cities).toEqual([]);
    });

    it("throws on a failed response", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(service.searchCities("Paris")).rejects.toThrow();
    });

    it("uses the cache on a second identical search", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              id: 1,
              name: "Paris",
              latitude: 48.85,
              longitude: 2.35,
              country: "France",
            },
          ],
        }),
      });

      await service.searchCities("Paris");
      await service.searchCities("Paris");

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("normalizes the cache key (case + whitespace)", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      });

      await service.searchCities("Paris");
      await service.searchCities("  PARIS  ");

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("does not share cache between different queries", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      });

      await service.searchCities("Paris");
      await service.searchCities("London");

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("getWeather", () => {
    it("maps the full API response to the Weather model", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => forecastResponse,
      });

      const weather = await service.getWeather(paris);

      expect(weather.city).toEqual(paris);

      // current
      expect(weather.current.time).toBeInstanceOf(Date);
      expect(weather.current.temperature).toBe(18.3);
      expect(weather.current.apparentTemperature).toBe(16.1);
      expect(weather.current.weatherCode).toBe(3);
      expect(weather.current.windSpeed).toBe(12.4);
      expect(weather.current.windDirection).toBe(220);
      expect(weather.current.humidity).toBe(72);
      expect(weather.current.precipitation).toBe(0.2);
      expect(weather.current.cloudCover).toBe(80);
      expect(weather.current.isDay).toBe(true);

      // daily
      expect(weather.daily).toHaveLength(2);
      expect(weather.daily[0].date).toBeInstanceOf(Date);
      expect(weather.daily[0].weatherCode).toBe(3);
      expect(weather.daily[0].tempMax).toBe(19.1);
      expect(weather.daily[0].tempMin).toBe(11.2);
      expect(weather.daily[0].precipitationProbability).toBe(10);
      expect(weather.daily[0].precipitationSum).toBe(0);
      expect(weather.daily[0].windSpeedMax).toBe(15.3);
      expect(weather.daily[0].uvIndexMax).toBe(4);
      expect(weather.daily[0].sunrise).toBeInstanceOf(Date);
      expect(weather.daily[0].sunset).toBeInstanceOf(Date);

      expect(weather.daily[1].weatherCode).toBe(61);
      expect(weather.daily[1].precipitationProbability).toBe(60);
    });

    it("throws on a failed response", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(service.getWeather(paris)).rejects.toThrow();
    });

    it("uses the cache on a second call for the same city", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => forecastResponse,
      });

      await service.getWeather(paris);
      await service.getWeather(paris);

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("does not share cache between cities at different coordinates", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => forecastResponse,
      });

      const parisTX: City = {
        ...paris,
        id: 2,
        latitude: 33.66,
        longitude: -95.55,
      };

      await service.getWeather(paris);
      await service.getWeather(parisTX);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("bypasses the cache when force is true", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => forecastResponse,
      });

      await service.getWeather(paris);
      await service.getWeather(paris, true);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("does not cache a failed request", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
      await expect(service.getWeather(paris)).rejects.toThrow();

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => forecastResponse,
      });

      const weather = await service.getWeather(paris);
      expect(weather.current.temperature).toBe(18.3);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("clearCache", () => {
    it("clears both caches", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              id: 1,
              name: "Paris",
              latitude: 48.85,
              longitude: 2.35,
              country: "France",
            },
          ],
        }),
      });

      await service.searchCities("Paris");
      service.clearCache();
      await service.searchCities("Paris");

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
