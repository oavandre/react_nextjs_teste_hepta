import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WeatherResponse } from "@/types/weather";
import { WeatherDashboard } from "./WeatherDashboard";

const { useWeatherMock } = vi.hoisted(() => ({ useWeatherMock: vi.fn() }));
vi.mock("@/hooks/useWeather", () => ({ useWeather: useWeatherMock }));
vi.mock("@/hooks/useCitySearch", () => ({ useCitySearch: () => ({ data: [], error: null, isFetching: false }) }));

const baseWeather: WeatherResponse = {
  latitude: -23.55,
  longitude: -46.63,
  timezone: "America/Sao_Paulo",
  current: {
    time: "2026-08-31T12:00",
    temperature_2m: 22.4,
    apparent_temperature: 23.2,
    relative_humidity_2m: 84,
    precipitation: 0,
    weather_code: 0,
    wind_speed_10m: 12.1,
    is_day: 1,
  },
  daily: {
    time: ["2026-08-31"],
    weather_code: [0],
    temperature_2m_max: [26],
    temperature_2m_min: [18],
    precipitation_probability_max: [10],
    sunrise: ["06:00"],
    sunset: ["18:00"],
  },
};

function renderDashboard() {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}><WeatherDashboard /></QueryClientProvider>,
  );
}

afterEach(() => cleanup());

describe("WeatherDashboard", () => {
  it("exibe o carregamento", () => {
    useWeatherMock.mockReturnValue({ data: undefined, error: null, isPending: true, refetch: vi.fn() });
    renderDashboard();
    expect(screen.getByText("Carregando previsão...")).toBeInTheDocument();
  });

  it("exibe erro e permite tentar novamente", async () => {
    const refetch = vi.fn();
    useWeatherMock.mockReturnValue({ data: undefined, error: new Error("API indisponível"), isPending: false, refetch });
    renderDashboard();
    expect(screen.getByRole("alert")).toHaveTextContent("API indisponível");
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(refetch).toHaveBeenCalled();
  });

  it.each([
    [0, "sunny"],
    [2, "cloudy"],
    [45, "cloudy"],
    [61, "rainy"],
    [71, "cloudy"],
    [95, "rainy"],
  ])("seleciona a paisagem para o código %i", (weatherCode, expectedClass) => {
    useWeatherMock.mockReturnValue({
      data: { ...baseWeather, current: { ...baseWeather.current, weather_code: weatherCode } },
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    const { container } = renderDashboard();
    expect(container.querySelector("main")?.className).toContain(expectedClass);
    expect(screen.getByRole("heading", { name: "São Paulo" })).toBeInTheDocument();
    cleanup();
  });
});
