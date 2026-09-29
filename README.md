# Weather App

A weather application built with vanilla TypeScript, Vite, and plain CSS.
Fetches live weather data from Open-Meteo.

**🔗 Live demo:** https://stenca.github.io/weather-app/

## Features

### Search
- Search any city by name
- Live results dropdown while typing (debounced)
- Pick from multiple matches (Paris, TX vs Paris, FR)
- Geolocation button — use your current position

### Current weather
- Weather icon (Lucide SVG)
- Temperature with split number/unit styling
- Feels like, humidity, wind, cloud cover
- Day and date
- Condition label

### Details panel
- Expand the current card to open a side panel
- Wind direction, wind speed, precipitation
- Sunrise, sunset, UV index, rain chance
- Toggle open and closed with a click

### Forecast
- 7-day forecast starting tomorrow
- Weather icon, high, and low for each day
- Dividers between days

### Polish
- Unit toggle (°C / °F)
- Glass UI with CSS custom properties
- Loading state with delay (no flash for fast requests)
- Error handling with clear messages
- Remember last searched city
- Default city on first visit

## Tech Stack

- **TypeScript** — strict types
- **Vite** — dev server + production build
- **Vitest** — unit tests
- **Open-Meteo** — weather and geocoding APIs (no API key)
- **Lucide** — SVG icons
- **Plain CSS** — custom properties
- **localStorage** — persistence

## Architecture

```
src/
├── components/            Render functions (pure HTML strings)
│   ├── renderCurrent.ts
│   ├── renderDetails.ts
│   ├── renderForecast.ts
│   ├── renderSearch.ts
│   ├── renderCityResults.ts
│   ├── renderLoading.ts
│   ├── renderError.ts
│   └── renderTemp.ts
├── models/                Type definitions
│   ├── weather.ts         City, Weather, CurrentWeather, DailyForecast
│   └── settings.ts        Settings, Units
├── services/              Business logic + external APIs
│   ├── weatherService.ts  Open-Meteo API + caching
│   ├── cacheService.ts    TTL cache
│   ├── storageService.ts  Last city persistence
│   ├── settingsService.ts User preferences
│   └── geolocationService.ts
├── utils/                 Pure helpers
│   ├── dom.ts             getElement, escapeHtml
│   ├── date.ts            formatDay, formatDate, formatTime
│   ├── units.ts           celsiusToFahrenheit, kmhToMph, mmToInches
│   ├── weatherIcons.ts    WMO code → Lucide icon
│   ├── errors.ts          getErrorMessage
│   └── loading.ts         LoadingController (delayed loading state)
├── main.ts                State + event routing + render loop
└── style.css              All styles
```

**Design principles:**

- State lives in `main.ts` — a small set of `let` variables
- Rendering is pure — `render*` functions take data, return HTML
- Event delegation — listeners on `#app`, routing by `data-action`
- Services own data — no DOM code in services
- Shared types live in `models/`

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
git clone https://github.com/Stenca/weather-app.git
cd weather-app
npm install
```

### Develop

```bash
npm run dev
```

Opens at `http://localhost:5173/`.

### Test

```bash
npm test          # watch mode
npm run test:run  # single run
```

### Build

```bash
npm run build
npm run preview
```

## APIs

### Open-Meteo (no API key)

**Geocoding** — city name → coordinates:

```
https://geocoding-api.open-meteo.com/v1/search?name=Paris&count=5
```

**Forecast** — coordinates → current + daily:

```
https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current=...&daily=...
```

## Deployment

Auto-deploys to GitHub Pages on every push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).
