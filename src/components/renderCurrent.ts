import type { Units } from "../models/settings";
import type { Weather } from "../models/weather";
import { formatDate, formatDay } from "../utils/date";
import { escapeHtml } from "../utils/dom";
import { kmhToMph } from "../utils/units";
import { describeWeather, weatherIcon } from "../utils/weatherIcons";
import { renderTemp } from "./renderTemp";

export function renderCurrent(weather: Weather, units: Units): string {
  const { current, city } = weather;

  return `
    <div class="current-card glass" data-action="toggle-details">
        <button
            class="unit-toggle"
            data-action="toggle-units"
        >${units === "metric" ? "°C" : "°F"}</button>
        <div class="current-icon">${weatherIcon(current.weatherCode)}</div>
        <div class="current-city">
            ${escapeHtml(city.name)}, ${escapeHtml(city.country)}
        </div>
        <div class="current-temp">${renderTemp(current.temperature, units)}</div>
        <div class="current-day">${formatDay(current.time)}</div>
        <div class="current-date">${formatDate(current.time)}</div>
        <div class="current-label">${describeWeather(current.weatherCode)}</div>
        <div class="current-details">
        <div class="detail">
          <span class="detail-label">Feels like</span>
          <span class="detail-value">${renderTemp(current.apparentTemperature, units)}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">${current.humidity}%</span>
        </div>
        <div class="detail">
          <span class="detail-label">Wind</span>
            <span class="detail-value">
                ${Math.round(units === "metric" ? current.windSpeed : kmhToMph(current.windSpeed))}
                ${units === "metric" ? "km/h" : "mph"}
            </span>
        </div>
        <div class="detail">
          <span class="detail-label">Clouds</span>
          <span class="detail-value">${current.cloudCover}%</span>
        </div>
      </div>
    </div>
  `;
}
