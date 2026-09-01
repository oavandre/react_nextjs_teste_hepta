import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Location } from "@/types/weather";
import { CitySearch } from "./CitySearch";
import { CurrentLocationButton } from "./CurrentLocationButton";
import { ThemeToggle } from "./ThemeToggle";

const { citySearchMock } = vi.hoisted(() => ({ citySearchMock: vi.fn() }));

vi.mock("@/hooks/useCitySearch", () => ({
  useCitySearch: (term: string) => citySearchMock(term),
}));

const city: Location = {
  name: "Recife",
  country: "Brasil",
  region: "Pernambuco",
  latitude: -8.05,
  longitude: -34.9,
};

beforeEach(() => {
  citySearchMock.mockReturnValue({ data: [], error: null, isFetching: false });
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue({ matches: false }),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("ThemeToggle", () => {
  it("carrega o tema salvo e alterna para o tema claro", async () => {
    localStorage.setItem("weather-dashboard-theme", "dark");
    render(<ThemeToggle />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Ativar tema claro" })).toBeVisible());
    await userEvent.click(screen.getByRole("button", { name: "Ativar tema claro" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("weather-dashboard-theme")).toBe("light");
  });

  it("usa a preferência do sistema quando não existe tema salvo", async () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    render(<ThemeToggle />);
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"));
  });
});

describe("CitySearch", () => {
  it("busca, seleciona e limpa uma cidade", async () => {
    citySearchMock.mockImplementation((term: string) => ({ data: term ? [city] : [], error: null, isFetching: false }));
    const onSelect = vi.fn();
    render(<CitySearch onSelect={onSelect} />);
    const input = screen.getByRole("searchbox", { name: "Buscar cidade" });
    await userEvent.type(input, "Recife");
    await userEvent.click(screen.getByRole("button", { name: "Buscar" }));
    await userEvent.click(screen.getByRole("option", { name: /Recife/ }));
    expect(onSelect).toHaveBeenCalledWith(city);
    expect(input).toHaveValue("");
  });

  it.each([
    [{ data: [], error: null, isFetching: true }, "Buscando cidades..."],
    [{ data: [], error: new Error("Falha na busca"), isFetching: false }, "Falha na busca"],
    [{ data: [], error: null, isFetching: false }, "Nenhuma cidade encontrada."],
  ])("exibe os estados da busca", async (queryState, message) => {
    citySearchMock.mockImplementation((term: string) => term ? queryState : { data: [], error: null, isFetching: false });
    render(<CitySearch onSelect={vi.fn()} />);
    await userEvent.type(screen.getByRole("searchbox"), "Rio");
    await userEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("limpa o texto digitado", async () => {
    render(<CitySearch onSelect={vi.fn()} />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "Rio");
    await userEvent.click(screen.getByRole("button", { name: "Limpar busca" }));
    expect(input).toHaveValue("");
  });
});

describe("CurrentLocationButton", () => {
  it("seleciona a localização retornada pelo navegador", async () => {
    const onSelect = vi.fn();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: (success: PositionCallback) => success({ coords: { latitude: -8.05, longitude: -34.9 } } as GeolocationPosition) },
    });
    render(<CurrentLocationButton onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Usar minha localização" }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ name: "Minha localização", latitude: -8.05, longitude: -34.9 }));
  });

  it("informa quando geolocalização não é suportada", async () => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
    render(<CurrentLocationButton onSelect={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Usar minha localização" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Geolocalização não suportada");
  });

  it.each([
    [1, "Permissão de localização negada."],
    [2, "Localização indisponível neste dispositivo."],
    [3, "A localização demorou muito para responder."],
    [99, "Não foi possível obter sua localização."],
  ])("traduz o erro de geolocalização %i", async (code, message) => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => error({ code, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError) },
    });
    render(<CurrentLocationButton onSelect={vi.fn()} />);
    await act(async () => userEvent.click(screen.getByRole("button", { name: "Usar minha localização" })));
    expect(screen.getByRole("alert")).toHaveTextContent(message);
  });
});
