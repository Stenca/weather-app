import type { City } from "../models/weather";
import { escapeHtml } from "../utils/dom";

export function renderCityResults(cities: City[]): string {
  if (cities.length === 0) return "";

  return `
    <ul class="city-results glass">
        ${cities
          .map(
            (city) => `
                    <li>
                        <button
                        type="button"
                        class="city-result"
                        data-action="select-city"
                        data-city-id="${city.id}"
                        >
                            <span class="city-result-name">
                            ${escapeHtml(city.name)}
                            </span>
                            <span class="city-result-region">
                                ${escapeHtml(city.admin1 ? `${city.admin1}, ` : "")}${escapeHtml(city.country)}
                            </span>       
                        </button>
                    </li>
                `,
          )
          .join("")}
    </ul>
  `;
}
