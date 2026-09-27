import type { Units } from "../models/settings";
import type { Weather } from "../models/weather";
import { formatTime } from "../utils/date";
import { kmhToMph, mmToInches } from "../utils/units";

export function renderDetails(weather: Weather, units: Units): string {
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
    <div class="details-card glass">
      <h2 class="details-title">Details</h2>

      <dl class="details-list">
        <div class="details-row">
          <dt>Wind direction</dt>
          <dd>${current.windDirection}°</dd>
        </div>
        <div class="details-row">
          <dt>Wind speed</dt>
          <dd>${windValue} ${windUnit}</dd>
        </div>
        <div class="details-row">
          <dt>Precipitation</dt>
          <dd>${precipValue} ${precipUnit}</dd>
        </div>
        <div class="details-row">
          <dt>Cloud cover</dt>
          <dd>${current.cloudCover}%</dd>
        </div>
        ${
          today
            ? `
              <div class="details-row">
                <dt>Sunrise</dt>
                <dd>${formatTime(today.sunrise)}</dd>
              </div>
              <div class="details-row">
                <dt>Sunset</dt>
                <dd>${formatTime(today.sunset)}</dd>
              </div>
              <div class="details-row">
                <dt>UV index</dt>
                <dd>${today.uvIndexMax}</dd>
              </div>
              <div class="details-row">
                <dt>Rain chance</dt>
                <dd>${today.precipitationProbability}%</dd>
              </div>
            `
            : ""
        }
      </dl>
    </div>
  `;
}
