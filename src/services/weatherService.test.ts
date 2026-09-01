import { afterEach, describe, expect, it, vi } from "vitest";
import type { Location, WeatherResponse } from "@/types/weather";
import { getWeatherForecast } from "./weatherService";

const location: Location = {
  name: "Recife",
  country: "Brasil",
  latitude: -8.05,
  longitude: -34.9,
};

const responseData = { timezone: "America/Recife" } as WeatherResponse;

afterEach(() => vi.restoreAllMocks());

describe("getWeatherForecast", () => {
  it.each(["celsius", "fahrenheit"] as const)(
    "envia os parâmetros da API em %s",
    async (unit) => {
      const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      } as unknown as Response);

      await expect(getWeatherForecast(location, unit)).resolves.toBe(responseData);

      const requestedUrl = new URL(String(fetchMock.mock.calls[0][0]));
      expect(requestedUrl.hostname).toBe("api.open-meteo.com");
      expect(requestedUrl.searchParams.get("latitude")).toBe("-8.05");
      expect(requestedUrl.searchParams.get("longitude")).toBe("-34.9");
      expect(requestedUrl.searchParams.get("temperature_unit")).toBe(unit);
      expect(requestedUrl.searchParams.get("forecast_days")).toBe("7");
    },
  );

  it("usa Celsius como unidade padrão", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(responseData),
    } as unknown as Response);
    await getWeatherForecast(location);
    expect(new URL(String(fetchMock.mock.calls[0][0])).searchParams.get("temperature_unit")).toBe("celsius");
  });

  it("informa erro quando a API falha", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);
    await expect(getWeatherForecast(location)).rejects.toThrow(
      "Não foi possível carregar a previsão do tempo.",
    );
  });
});
