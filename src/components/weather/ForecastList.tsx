import type { DailyWeather } from "@/types/weather";
import { ForecastCard } from "./ForecastCard";
import styles from "./Forecast.module.css";

type ForecastListProps = {
  daily: DailyWeather;
};

export function ForecastList({ daily }: ForecastListProps) {
  return (
    <section className={styles.forecast} aria-labelledby="forecast-title">
      <header className={styles.header}>
        <h2 id="forecast-title">Próximos 7 dias</h2>
        <p>Visão geral da semana</p>
      </header>

      <div className={styles.list}>
        {daily.time.map((date, index) => (
          <ForecastCard
            date={date}
            index={index}
            key={date}
            maximumTemperature={daily.temperature_2m_max[index]}
            minimumTemperature={daily.temperature_2m_min[index]}
            precipitationProbability={
              daily.precipitation_probability_max[index]
            }
            weatherCode={daily.weather_code[index]}
          />
        ))}
      </div>
    </section>
  );
}
