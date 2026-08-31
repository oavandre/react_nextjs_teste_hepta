export type WeatherKind =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm"
  | "unknown";

export type WeatherCondition = {
  kind: WeatherKind;
  label: string;
};

export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return { kind: "clear", label: "Céu limpo" };
  if (code === 1) return { kind: "cloudy", label: "Predominantemente limpo" };
  if (code === 2) return { kind: "cloudy", label: "Parcialmente nublado" };
  if (code === 3) return { kind: "cloudy", label: "Nublado" };
  if ([45, 48].includes(code)) return { kind: "fog", label: "Neblina" };
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { kind: "drizzle", label: "Garoa" };
  }
  if ([61, 63, 65, 66, 67].includes(code)) {
    return { kind: "rain", label: "Chuva" };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { kind: "snow", label: "Neve" };
  }
  if ([80, 81, 82].includes(code)) {
    return { kind: "rain", label: "Pancadas de chuva" };
  }
  if ([95, 96, 99].includes(code)) {
    return { kind: "storm", label: "Tempestade" };
  }

  return { kind: "unknown", label: "Condição desconhecida" };
}
