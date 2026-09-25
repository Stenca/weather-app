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
  weatherCode: number;
  windSpeed: number;
}

export interface DailyForecast {
  date: Date;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

export interface Weather {
  city: City;
  current: CurrentWeather;
  daily: DailyForecast[];
}
