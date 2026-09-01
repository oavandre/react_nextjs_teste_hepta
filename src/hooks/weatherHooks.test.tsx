import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Location, WeatherResponse } from "@/types/weather";
import { citySearchQueryKeys, useCitySearch } from "./useCitySearch";
import { useWeather, weatherQueryKeys } from "./useWeather";

const { getWeatherForecastMock, searchCitiesMock } = vi.hoisted(() => ({
  getWeatherForecastMock: vi.fn(),
  searchCitiesMock: vi.fn(),
}));

vi.mock("@/services/weatherService", () => ({ getWeatherForecast: getWeatherForecastMock }));
vi.mock("@/services/locationService", () => ({ searchCities: searchCitiesMock }));

const location: Location = { name: "Recife", country: "Brasil", latitude: -8.05, longitude: -34.9 };

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => vi.clearAllMocks());

describe("hooks de consulta", () => {
  it("gera chaves estáveis e normalizadas", () => {
    expect(weatherQueryKeys.forecast(location, "celsius")).toEqual(["weather", "forecast", -8.05, -34.9, "celsius"]);
    expect(citySearchQueryKeys.search("  ReCiFe ")).toEqual(["city-search", "recife"]);
  });

  it("consulta a previsão para a localização e unidade", async () => {
    const weather = { timezone: "America/Recife" } as WeatherResponse;
    getWeatherForecastMock.mockResolvedValue(weather);
    const { result } = renderHook(() => useWeather(location, "fahrenheit"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(weather);
    expect(getWeatherForecastMock).toHaveBeenCalledWith(location, "fahrenheit");
  });

  it("mantém desabilitada a busca com termo curto", () => {
    const { result } = renderHook(() => useCitySearch(" a "), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe("idle");
    expect(searchCitiesMock).not.toHaveBeenCalled();
  });

  it("normaliza e executa uma busca válida", async () => {
    searchCitiesMock.mockResolvedValue([location]);
    const { result } = renderHook(() => useCitySearch(" Recife "), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([location]);
    expect(searchCitiesMock).toHaveBeenCalledWith("Recife");
  });
});
