import { escapeHtml } from "../utils/dom";

export function renderSearch(query = ""): string {
  return `
        <form class="search-bar glass" data-action="search">
            <input
                type="search"
                class="search-input"
                name="query"
                placeholder="Search a city"
                value="${escapeHtml(query)}"
                autocomplete="off"
                required
            />
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
