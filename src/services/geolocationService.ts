export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class GeolocationService {
  isSupported(): boolean {
    return "geolocation" in navigator;
  }

  async getCurrentPosition(): Promise<Coordinates> {
    if (!this.isSupported()) {
      throw new Error("Geolocation is not supported by this browser");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(this.describeError(error)));
        },
        {
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 5 * 60 * 1000,
        },
      );
    });
  }

  private describeError(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location permission denied";
      case error.POSITION_UNAVAILABLE:
        return "Location information unavailable";
      case error.TIMEOUT:
        return "Location request timed out";
      default:
        return "Unknow location error";
    }
  }
}
