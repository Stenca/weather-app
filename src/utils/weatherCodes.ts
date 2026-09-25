interface WeatherInfo {
  label: string;
  icon: string;
}

const CODES: Record<number, WeatherInfo> = {
  0: { label: "Clear sky", icon: "☀" },
  1: { label: "Mainly clear", icon: "🌤" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁" },
  45: { label: "Fog", icon: "🌫" },
  48: { label: "Rime fog", icon: "🌫" },
  51: { label: "Light drizzle", icon: "🌦" },
  61: { label: "Light rain", icon: "🌧" },
  63: { label: "Rain", icon: "🌧" },
  65: { label: "Heavy rain", icon: "🌧" },
  71: { label: "Light snow", icon: "🌨" },
  73: { label: "Snow", icon: "🌨" },
  75: { label: "Heavy snow", icon: "❄" },
  95: { label: "Thunderstorm", icon: "⛈" },
};

export function describeWeather(code: number): WeatherInfo {
  return CODES[code] ?? { label: "Unknown", icon: "?" };
}
