import type { Units } from "../models/settings";
import type { DailyForecast } from "../models/weather";
import { formatDayShort } from "../utils/date";
import { describeWeather } from "../utils/weatherCodes";
import { renderTemp } from "./renderTemp";

export function renderForecast(daily: DailyForecast[], units: Units): string {
  if (daily.length === 0) return "";

  const days = daily.slice(0, 7);

  return `
    <div class="forecast glass">
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
                    ${info.icon}
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
