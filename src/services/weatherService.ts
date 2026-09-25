import type { City, Weather, DailyForecast } from "../models/weather";
import { CacheService } from "./cacheService";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export class WeatherService {
  private geocodeCache = new CacheService<City[]>(60 * 60 * 1000);
  private forecastCache = new CacheService<Weather>(10 * 60 * 1000);

  async searchCities(query: string): Promise<City[]> {
    const key = query.toLowerCase().trim();

    const cached = this.geocodeCache.get(key);
    if (cached) return cached;

    const cities = await this.fetchCities(query);
    this.geocodeCache.set(key, cities);
    return cities;
  }

  async getWeather(city: City, force = false): Promise<Weather> {
    const key = `${city.latitude}, ${city.longitude}`;

    if (!force) {
      const cached = this.forecastCache.get(key);
      if (cached) return cached;
    }

    const weather = await this.fetchWeather(city);
    this.forecastCache.set(key, weather);
    return weather;
  }

  private async fetchCities(query: string): Promise<City[]> {
    const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City search failed");

    const data = await res.json();
    return (data.results ?? []).map(
      (r: any): City => ({
        id: r.id,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
        admin1: r.admin1,
      }),
    );
  }

  clearCache(): void {
    this.geocodeCache.clear();
    this.forecastCache.clear();
  }

  private async fetchWeather(city: City): Promise<Weather> {
    const params = new URLSearchParams({
      latitude: String(city.latitude),
      longitude: String(city.longitude),
      current: "temperature_2m, weather_code, wind_speed_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      timezone: "auto",
      forecast_days: "7",
    });

    const res = await fetch(`${FORECAST_URL}?${params}`);
    if (!res.ok) throw new Error("Weather fetch failed");

    const data = await res.json();

    const daily: DailyForecast[] = data.daily.time.map(
      (date: string, i: number) => ({
        date: new Date(date),
        weatherCode: data.daily.weather_code[i],
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
      }),
    );

    return {
      city,
      current: {
        time: new Date(data.current.time),
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
      },
      daily,
    };
  }
}
