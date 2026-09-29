import "./style.css";
import { renderCurrent } from "./components/renderCurrent";
import type { City, Weather } from "./models/weather";
import { renderSearch } from "./components/renderSearch";
import { WeatherService } from "./services/weatherService";
import { SettingsService } from "./services/settingsService";
import { renderLoading } from "./components/renderLoading";
import { renderError } from "./components/renderError";
import { getErrorMessage } from "./utils/errors";
import { StorageService } from "./services/storageService";
import { LoadingController } from "./utils/loading";
import { renderForecast } from "./components/renderForecast";
import { renderDetails } from "./components/renderDetails";
import { GeolocationService } from "./services/geolocationService";
import { renderCityResults } from "./components/renderCityResults";

const app = document.getElementById("app") as HTMLDivElement;

const weatherService = new WeatherService();
const settingsService = new SettingsService();
const storageService = new StorageService();
const geolocationService = new GeolocationService();

const SEARCH_DEBOUNCE = 300;
const DEFAULT_CITY: City = {
  id: 0,
  name: "Paris",
  latitude: 48.8566,
  longitude: 2.3522,
  country: "France",
};

const initialCity = storageService.loadCity() ?? DEFAULT_CITY;

const loadingController = new LoadingController((value) => {
  loading = value;
  render();
});

let settings = settingsService.load();
let weather: Weather | null = null;
let loading = false;
let error: string | null = null;
let searchQuery = "";
let detailsOpen = false;
let detailsJustToggled = false;
let weatherJustLoaded = false;
let cityResults: City[] = [];
let searchTimeout: number | null = null;

function render(): void {
  app.classList.toggle("details-open", detailsOpen);

  const active = document.activeElement as HTMLInputElement | null;
  const wasSearchFocused = active?.classList.contains("search-input") ?? false;
  const cursorPos = wasSearchFocused ? (active?.selectionStart ?? null) : null;

  app.innerHTML = `
    ${renderSearch(searchQuery)}
    ${cityResults.length > 0 ? renderCityResults(cityResults) : ""}
    ${loading ? renderLoading() : ""}
    ${error ? renderError(error) : ""}
    ${
      weather && !loading
        ? `
          <div class="weather-row">
            ${renderCurrent(weather, settings.units, weatherJustLoaded)}
            ${detailsOpen ? renderDetails(weather, settings.units, detailsJustToggled) : ""}
          </div>
        `
        : ""
    }
    ${weather && !loading ? renderForecast(weather.daily, settings.units, weatherJustLoaded) : ""}
  `;

  if (wasSearchFocused) {
    const input = document.querySelector<HTMLInputElement>(".search-input");
    if (input) {
      input.focus();
      if (cursorPos !== null) input.setSelectionRange(cursorPos, cursorPos);
    }
  }

  detailsJustToggled = false;
  weatherJustLoaded = false;
}

async function fetchCities(query: string): Promise<City[]> {
  try {
    return await weatherService.searchCities(query);
  } catch (err) {
    error = getErrorMessage(err);
    render();
    return [];
  }
}

async function loadWeather(city: City): Promise<void> {
  loadingController.begin();
  error = null;
  render();

  try {
    weather = await weatherService.getWeather(city);
    weatherJustLoaded = true;
  } catch (err) {
    error = getErrorMessage(err);
  } finally {
    loadingController.end();
  }
}

function handleSelectCity(city: City): void {
  cityResults = [];
  searchQuery = city.name;
  storageService.saveCity(city);
  loadWeather(city);
}

function handleSearchInput(e: Event): void {
  const target = e.target as HTMLInputElement;
  if (!target.classList.contains("search-input")) return;

  const query = target.value.trim();
  searchQuery = query;

  if (searchTimeout !== null) clearTimeout(searchTimeout);

  if (query.length < 2) {
    if (cityResults.length > 0) {
      cityResults = [];
      render();
    }
    return;
  }

  searchTimeout = window.setTimeout(async () => {
    const cities = await fetchCities(query);
    if (query !== searchQuery) return;
    cityResults = cities;
    error = null;
    render();
  }, SEARCH_DEBOUNCE);
}

function handleSubmit(e: Event): void {
  const form = e.target as HTMLFormElement;
  if (!form.classList.contains("search-bar")) return;

  e.preventDefault();

  if (cityResults.length > 0) {
    handleSelectCity(cityResults[0]);
    return;
  }

  const input = form.querySelector<HTMLInputElement>(".search-input");
  const query = input?.value.trim();
  if (!query || query.length < 2) return;

  fetchCities(query).then((cities) => {
    if (cities.length > 0) {
      handleSelectCity(cities[0]);
    } else {
      error = `No city found for "${query}"`;
      render();
    }
  });
}

function handleClick(e: Event): void {
  const target = e.target as HTMLElement;
  const actionEl = target.closest<HTMLElement>("[data-action]");
  if (!actionEl) return;

  switch (actionEl.dataset.action) {
    case "toggle-units":
      handleToggleUnits();
      break;
    case "toggle-details":
      handleToggleDetails();
      break;
    case "use-location":
      handleUseLocation();
      break;
    case "select-city": {
      const cityId = actionEl.dataset.cityId;
      const city = cityResults.find((c) => String(c.id) === cityId);
      if (city) handleSelectCity(city);
      break;
    }
  }
}

function handleToggleUnits(): void {
  const next = settings.units === "metric" ? "imperial" : "metric";
  settings = settingsService.update({ units: next });
  render();
}

function handleToggleDetails(): void {
  detailsOpen = !detailsOpen;
  detailsJustToggled = true;
  render();
}

async function handleUseLocation(): Promise<void> {
  try {
    const coords = await geolocationService.getCurrentPosition();
    searchQuery = "";
    cityResults = [];

    const city: City = {
      id: 0,
      name: "Your location",
      country: "",
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    storageService.saveCity(city);
    await loadWeather(city);
  } catch (err) {
    error = getErrorMessage(err);
    render();
  }
}

function setupEventListeners(): void {
  app.addEventListener("submit", handleSubmit);
  app.addEventListener("click", handleClick);
  app.addEventListener("input", handleSearchInput);
}

setupEventListeners();
loadWeather(initialCity);
