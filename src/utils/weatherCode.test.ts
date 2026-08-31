import { describe, expect, it } from "vitest";
import { getWeatherCondition } from "./weatherCode";

describe("getWeatherCondition", () => {
  it.each([
    [0, "clear", "Céu limpo"],
    [1, "cloudy", "Predominantemente limpo"],
    [2, "cloudy", "Parcialmente nublado"],
    [3, "cloudy", "Nublado"],
    [45, "fog", "Neblina"],
    [51, "drizzle", "Garoa"],
    [61, "rain", "Chuva"],
    [71, "snow", "Neve"],
    [80, "rain", "Pancadas de chuva"],
    [95, "storm", "Tempestade"],
    [999, "unknown", "Condição desconhecida"],
  ])(
    "converte o código %i para %s",
    (code, expectedKind, expectedLabel) => {
      expect(getWeatherCondition(code)).toEqual({
        kind: expectedKind,
        label: expectedLabel,
      });
    },
  );
});
