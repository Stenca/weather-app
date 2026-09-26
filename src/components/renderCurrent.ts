import type { Units } from "../models/settings";
import type { Weather } from "../models/weather";
import { formatDate, formatDay } from "../utils/date";
import { escapeHtml } from "../utils/dom";
import { formatTemp, formatWind } from "../utils/units";
import { describeWeather } from "../utils/weatherCodes";

export function renderCurrent(weather: Weather, units: Units): string {
  const { current, daily, city } = weather;
  const info = describeWeather(current.weatherCode);
  const today = daily[0];

  return `
    <div class="current-card glass">
        <div class="current-icon">${info.icon}</div>
        <div class="current-city">
            ${escapeHtml(city.name)}, ${escapeHtml(city.country)}
        </div>
        <div class="current-temp">${formatTemp(current.temperature, units)}</div>
        <div class="current-day">${formatDay(current.time)}</div>
        <div class="current-date">${formatDate(current.time)}</div>
        <div class="current-label">${info.label}</div>
        <div class="current-details">
        <div class="detail">
          <span class="detail-label">Feels like</span>
          <span class="detail-value">${formatTemp(current.apparentTemperature, units)}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">${current.humidity}%</span>
        </div>
        <div class="detail">
          <span class="detail-label">Wind</span>
          <span class="detail-value">${formatWind(current.windSpeed, units)}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Clouds</span>
          <span class="detail-value">${current.cloudCover}%</span>
        </div>
      </div>
    </div>
  `;
}
