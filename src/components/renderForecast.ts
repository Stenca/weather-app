import type { Units } from "../models/settings";
import type { DailyForecast } from "../models/weather";
import { formatDayShort } from "../utils/date";
import { describeWeather, weatherIcon } from "../utils/weatherIcons";
import { renderTemp } from "./renderTemp";

export function renderForecast(
  daily: DailyForecast[],
  units: Units,
  animateIn = false,
): string {
  if (daily.length === 0) return "";

  const days = daily.slice(1, 8);

  return `
    <div class="forecast glass${animateIn ? " entering" : ""}">
      ${days
        .map((day) => {
          const info = describeWeather(day.weatherCode);
          return `
            <div class="forecast-day">
                <div class="forecast-day-inner">
                <span class="forecast-label">
                    ${formatDayShort(day.date)}
                </span>
                <span class="forecast-icon">
                    ${weatherIcon(day.weatherCode)}
                </span>
                <span class="forecast-high">
                    ${renderTemp(day.tempMax, units)}
                </span>
                <span class="forecast-low">
                    ${renderTemp(day.tempMin, units)}
                </span>
                </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}
