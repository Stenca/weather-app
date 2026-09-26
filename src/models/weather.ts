export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  time: Date;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitation: number;
  cloudCover: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: Date;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: Date;
  sunset: Date;
}

export interface Weather {
  city: City;
  current: CurrentWeather;
  daily: DailyForecast[];
}
