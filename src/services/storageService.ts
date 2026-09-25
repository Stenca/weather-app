import type { City } from "../models/weather";

export class StorageService {
  private key = "weather:lastCity";

  saveCity(city: City): void {
    localStorage.setItem(this.key, JSON.stringify(city));
  }

  loadCity(): City | null {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return null;
      return parsed as City;
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
