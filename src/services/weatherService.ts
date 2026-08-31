import type {
  Location,
  TemperatureUnit,
  WeatherResponse,
} from "@/types/weather";

const FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";

export const DEFAULT_LOCATION: Location = {
  name: "São Paulo",
  country: "Brasil",
  latitude: -23.5505,
  longitude: -46.6333,
};

export async function getWeatherForecast(
  location: Location,
  temperatureUnit: TemperatureUnit = "celsius",
): Promise<WeatherResponse> {
  const searchParams = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "is_day",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
    ].join(","),
    temperature_unit: temperatureUnit,
    wind_speed_unit: "kmh",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(`${FORECAST_API_URL}?${searchParams}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar a previsão do tempo.");
  }

  return response.json() as Promise<WeatherResponse>;
}
