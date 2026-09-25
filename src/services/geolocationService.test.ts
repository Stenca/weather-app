import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GeolocationService } from "./geolocationService";

describe("GeolocationService", () => {
  let service: GeolocationService;
  let getCurrentPositionMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    service = new GeolocationService();
    getCurrentPositionMock = vi.fn();

    vi.stubGlobal("navigator", {
      ...navigator,
      geolocation: {
        getCurrentPosition: getCurrentPositionMock,
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("isSupported", () => {
    it("returns true when geolocation exists", () => {
      expect(service.isSupported()).toBe(true);
    });

    it("returns false when geolocation is missing", () => {
      const { geolocation: _geolocation, ...navWithoutGeo } = navigator;
      vi.stubGlobal("navigator", navWithoutGeo);

      expect(service.isSupported()).toBe(false);
    });
  });

  describe("getCurrentPosition", () => {
    it("resolves with coordinates on success", async () => {
      getCurrentPositionMock.mockImplementation((success: PositionCallback) => {
        success({
          coords: { latitude: 48.85, longitude: 2.35 },
        } as GeolocationPosition);
      });

      const coords = await service.getCurrentPosition();

      expect(coords).toEqual({ latitude: 48.85, longitude: 2.35 });
    });

    it("rejects when permission is denied", async () => {
      getCurrentPositionMock.mockImplementation(
        (_: PositionCallback, error: PositionErrorCallback) => {
          error({
            code: 1,
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
            message: "",
          } as GeolocationPositionError);
        },
      );

      await expect(service.getCurrentPosition()).rejects.toThrow(
        "Location permission denied",
      );
    });

    it("rejects when position is unavailable", async () => {
      getCurrentPositionMock.mockImplementation(
        (_: PositionCallback, error: PositionErrorCallback) => {
          error({
            code: 2,
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
            message: "",
          } as GeolocationPositionError);
        },
      );

      await expect(service.getCurrentPosition()).rejects.toThrow(
        "Location information unavailable",
      );
    });

    it("rejects when the request times out", async () => {
      getCurrentPositionMock.mockImplementation(
        (_: PositionCallback, error: PositionErrorCallback) => {
          error({
            code: 3,
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
            message: "",
          } as GeolocationPositionError);
        },
      );

      await expect(service.getCurrentPosition()).rejects.toThrow(
        "Location request timed out",
      );
    });

    it("rejects when geolocation is unsupported", async () => {
      const { geolocation: _geolocation, ...navWithoutGeo } = navigator;
      vi.stubGlobal("navigator", navWithoutGeo);

      await expect(service.getCurrentPosition()).rejects.toThrow(
        "Geolocation is not supported by this browser",
      );
    });

    it("passes the correct options to the browser API", async () => {
      getCurrentPositionMock.mockImplementation((success: PositionCallback) => {
        success({
          coords: { latitude: 0, longitude: 0 },
        } as GeolocationPosition);
      });

      await service.getCurrentPosition();

      expect(getCurrentPositionMock).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 5 * 60 * 1000,
        },
      );
    });
  });
});
