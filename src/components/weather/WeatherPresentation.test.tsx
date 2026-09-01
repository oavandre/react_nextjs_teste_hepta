import { Droplets } from "lucide-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ForecastCard } from "./ForecastCard";
import { ForecastList } from "./ForecastList";
import { UnitSwitcher } from "./UnitSwitcher";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherMetric } from "./WeatherMetric";

describe("componentes de apresentação do clima", () => {
  it("troca a unidade de temperatura", async () => {
    const onChange = vi.fn();
    render(<UnitSwitcher value="celsius" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "°C" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "°F" }));
    expect(onChange).toHaveBeenCalledWith("fahrenheit");
  });

  it.each([
    [0, true, "Céu limpo"], [0, false, "Céu limpo"], [2, true, "Parcialmente nublado"],
    [2, false, "Parcialmente nublado"], [45, true, "Neblina"], [51, true, "Garoa"],
    [71, true, "Neve"], [95, true, "Tempestade"], [999, true, "Condição desconhecida"],
  ] as const)("renderiza o ícone para o código %i", (code, isDay, label) => {
    render(<WeatherIcon code={code} isDay={isDay} />);
    expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
  });

  it("exibe uma métrica", () => {
    render(<WeatherMetric icon={Droplets} label="Umidade" value="80%" />);
    expect(screen.getByText("Umidade")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("formata o cartão de hoje e arredonda temperaturas", () => {
    render(<ForecastCard date="2026-08-31" index={0} weatherCode={61} maximumTemperature={25.6} minimumTemperature={17.4} precipitationProbability={72} />);
    expect(screen.getByText("Hoje")).toBeInTheDocument();
    expect(screen.getByText("26°")).toBeInTheDocument();
    expect(screen.getByText("17°")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("formata o dia da semana", () => {
    render(<ForecastCard date="2026-09-01" index={1} weatherCode={0} maximumTemperature={20} minimumTemperature={10} precipitationProbability={0} />);
    expect(screen.getByText("Ter")).toBeInTheDocument();
  });

  it("renderiza a lista de previsão", () => {
    render(<ForecastList daily={{
      time: ["2026-08-31"], weather_code: [0], temperature_2m_max: [25],
      temperature_2m_min: [15], precipitation_probability_max: [10],
      sunrise: ["06:00"], sunset: ["18:00"],
    }} />);
    expect(screen.getByRole("region", { name: "Próximos 7 dias" })).toBeInTheDocument();
    expect(screen.getByText("Visão geral da semana")).toBeInTheDocument();
  });
});
