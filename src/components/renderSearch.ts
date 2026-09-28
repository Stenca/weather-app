import { MapPin } from "lucide-static";
import { escapeHtml } from "../utils/dom";

export function renderSearch(query = ""): string {
  return `
        <form class="search-bar glass">
            <input
                type="search"
                class="search-input"
                name="query"
                placeholder="Search a city..."
                value="${escapeHtml(query)}"
                autocomplete="off"
                required
            />
            <button 
            type"button" 
            class="location-btn" 
            data-action="use-location">
                  ${MapPin}
            </button>
            <button
                type="submit"
                class="search-btn"
                data-action="search"
            >
                🔍
            </button>
        </form>
    `;
}
