"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeatherForecast } from "@/services/weatherService";
import type { Location, TemperatureUnit } from "@/types/weather";

export const weatherQueryKeys = {
  all: ["weather"] as const,
  forecast: (location: Location, temperatureUnit: TemperatureUnit) =>
    [
      ...weatherQueryKeys.all,
      "forecast",
      location.latitude,
      location.longitude,
      temperatureUnit,
    ] as const,
};

export function useWeather(
  location: Location,
  temperatureUnit: TemperatureUnit,
) {
  return useQuery({
    queryKey: weatherQueryKeys.forecast(location, temperatureUnit),
    queryFn: () => getWeatherForecast(location, temperatureUnit),
  });
}
