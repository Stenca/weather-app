import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from "lucide-static";

export function weatherIcon(code: number): string {
  const svg = (iconString: string) => `
    <span class="lucide-icon">
      ${iconString}
    </span>
  `;

  if (code === 0) return svg(Sun);

  if (code === 1 || code === 2) return svg(CloudSun);

  if (code === 3) return svg(Cloud);

  if (code === 45 || code === 48) return svg(CloudFog);

  if (code >= 51 && code <= 57) return svg(CloudDrizzle);

  if (code >= 61 && code <= 67) return svg(CloudRain);

  if (code >= 71 && code <= 77) return svg(CloudSnow);

  if (code >= 80 && code <= 82) return svg(CloudRain);

  if (code === 85 || code === 86) return svg(CloudSnow);

  if (code >= 95) return svg(CloudLightning);

  return svg(Cloud);
}

const LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Light showers",
  81: "Showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
};

export function describeWeather(code: number): string {
  return LABELS[code] ?? "Unknown";
}
