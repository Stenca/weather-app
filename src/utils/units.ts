import type { Units } from "../models/settings";

export function formatTemp(celsius: number, units: Units): string {
  const value = units === "metric" ? celsius : (celsius * 9) / 5 + 32;
  return `${Math.round(value)}°`;
}

export function formatWind(kmh: number, units: Units): string {
  const value = units === "metric" ? kmh : kmh * 0.621371;
  const unit = units === "metric" ? "km/h" : "mph";
  return `${Math.round(value)}${unit}`;
}

export function formatPrecip(mm: number, units: Units): string {
  const value = units === "metric" ? mm : mm / 25.4;
  const unit = units === "metric" ? "mm" : "in";
  return `${value.toFixed(1)} ${unit}`;
}
