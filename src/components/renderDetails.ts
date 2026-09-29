import {
  Compass,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Sun,
  Umbrella,
} from "lucide-static";
import { formatTime } from "../utils/date";
import { kmhToMph, mmToInches } from "../utils/units";
import type { Weather } from "../models/weather";
import type { Units } from "../models/settings";

export function renderDetails(
  weather: Weather,
  units: Units,
  animateIn = false,
): string {
  const { current, daily } = weather;
  const today = daily[0];

  const windValue = Math.round(
    units === "metric" ? current.windSpeed : kmhToMph(current.windSpeed),
  );
  const windUnit = units === "metric" ? "km/h" : "mph";

  const precipValue =
    units === "metric"
      ? current.precipitation.toFixed(1)
      : mmToInches(current.precipitation).toFixed(2);
  const precipUnit = units === "metric" ? "mm" : "in";

  return `
    <div class="details-card glass${animateIn ? " entering" : ""}">
      <div class="current-details">
        <div class="detail">
          <span class="detail-icon">${Compass}</span>
          <span class="detail-label">Wind dir.</span>
          <span class="detail-value">${current.windDirection}°</span>
        </div>
        <div class="detail">
          <span class="detail-icon">${Wind}</span>
          <span class="detail-label">Wind speed</span>
          <span class="detail-value">${windValue} ${windUnit}</span>
        </div>
        <div class="detail">
          <span class="detail-icon">${Droplets}</span>
          <span class="detail-label">Precip.</span>
          <span class="detail-value">${precipValue} ${precipUnit}</span>
        </div>
        ${
          today
            ? `
              <div class="detail">
                <span class="detail-icon">${Sun}</span>
                <span class="detail-label">UV index</span>
                <span class="detail-value">${today.uvIndexMax}</span>
              </div>
              <div class="detail">
                <span class="detail-icon">${Umbrella}</span>
                <span class="detail-label">Rain</span>
                <span class="detail-value">${today.precipitationProbability}%</span>
              </div>
              <div class="detail">
                <span class="detail-icon">${Sunrise}</span>
                <span class="detail-label">Sunrise</span>
                <span class="detail-value">${formatTime(today.sunrise)}</span>
              </div>
              <div class="detail">
                <span class="detail-icon">${Sunset}</span>
                <span class="detail-label">Sunset</span>
                <span class="detail-value">${formatTime(today.sunset)}</span>
              </div>
            `
            : ""
        }
      </div>
    </div>
  `;
}
