import { Droplets } from "lucide-react";
import { getWeatherCondition } from "@/utils/weatherCode";
import { WeatherIcon } from "./WeatherIcon";
import styles from "./Forecast.module.css";

type ForecastCardProps = {
  date: string;
  index: number;
  weatherCode: number;
  maximumTemperature: number;
  minimumTemperature: number;
  precipitationProbability: number;
};

function formatDay(date: string, index: number) {
  if (index === 0) return "Hoje";

  const weekday = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    timeZone: "UTC",
  })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(".", "");

  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

export function ForecastCard({
  date,
  index,
  weatherCode,
  maximumTemperature,
  minimumTemperature,
  precipitationProbability,
}: ForecastCardProps) {
  const condition = getWeatherCondition(weatherCode);

  return (
    <article className={styles.card}>
      <p className={styles.day}>{formatDay(date, index)}</p>
      <WeatherIcon code={weatherCode} size={36} />
      <p className={styles.condition}>{condition.label}</p>
      <p className={styles.temperatures}>
        <strong>{Math.round(maximumTemperature)}°</strong>
        <span>{Math.round(minimumTemperature)}°</span>
      </p>
      <p className={styles.precipitation}>
        <Droplets aria-hidden="true" size={13} />
        {precipitationProbability}%
      </p>
    </article>
  );
}
