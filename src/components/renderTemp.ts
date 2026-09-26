// components/renderTemp.ts
import type { Units } from "../models/settings";
import { celsiusToFahrenheit } from "../utils/units";

export function renderTemp(celsius: number, units: Units): string {
  const value = Math.round(
    units === "metric" ? celsius : celsiusToFahrenheit(celsius),
  );
  const unit = units === "metric" ? "°C" : "°F";

  return `
    <span class="temp">
      <span class="temp-value">${value}</span>
      <span class="temp-unit">${unit}</span>
    </span>
  `;
}
