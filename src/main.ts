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

const app = document.getElementById("app") as HTMLDivElement;

const weatherService = new WeatherService();
const settingsService = new SettingsService();
const storageService = new StorageService();

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
let detailsJustOpened = false;

function render(): void {
  app.classList.toggle("details-open", detailsOpen);
  app.innerHTML = `
    ${renderSearch(searchQuery)}
    ${loading ? renderLoading() : ""}
    ${error ? renderError(error) : ""}
    ${
      weather && !loading
        ? `
          <div class="weather-row ${detailsOpen ? "details-open" : ""}">
            ${renderCurrent(weather, settings.units)}
            ${detailsOpen ? renderDetails(weather, settings.units, detailsJustOpened) : ""}
          </div>
        `
        : ""
    }
    ${weather && !loading ? renderForecast(weather.daily, settings.units) : ""}
  `;
  detailsJustOpened = false;
}

async function loadWeather(city: City): Promise<void> {
  loadingController.begin();
  error = null;
  render();
  try {
    weather = await weatherService.getWeather(city);
  } catch (err) {
    error = getErrorMessage(err);
  } finally {
    loadingController.end();
  }
}

async function handleSearch(query: string): Promise<void> {
  searchQuery = query;
  detailsOpen = false;
  loadingController.begin();
  error = null;
  weather = null;
  render();

  let cities: City[];
  try {
    cities = await weatherService.searchCities(query);
  } catch (err) {
    error = getErrorMessage(err);
    loadingController.end();
    render();
    return;
  }

  if (cities.length === 0) {
    error = `No city found for "${query}"`;
    loadingController.end();
    render();
    return;
  }
  storageService.saveCity(cities[0]);
  await loadWeather(cities[0]);
}

function handleSubmit(e: Event): void {
  const form = e.target as HTMLFormElement;
  if (!form.classList.contains("search-bar")) return;

  e.preventDefault();
  const input = form.querySelector<HTMLInputElement>(".search-input");
  const query = input?.value.trim();
  if (query) handleSearch(query);
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
  }
}

function handleToggleUnits(): void {
  const next = settings.units === "metric" ? "imperial" : "metric";
  settings = settingsService.update({ units: next });
  render();
}

function handleToggleDetails(): void {
  detailsOpen = !detailsOpen;
  if (detailsOpen) detailsJustOpened = true;
  render();
}

function setupEventListeners() {
  app.addEventListener("submit", handleSubmit);
  app.addEventListener("click", handleClick);
}

setupEventListeners();
loadWeather(initialCity);
