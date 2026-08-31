"use client";

import {
  CloudSun,
  Droplets,
  MapPin,
  RefreshCw,
  Umbrella,
  Wind,
} from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { DEFAULT_LOCATION } from "@/services/weatherService";
import { WeatherMetric } from "./WeatherMetric";
import styles from "./WeatherDashboard.module.css";

export function WeatherDashboard() {
  const { data, error, isPending, refetch } = useWeather(
    DEFAULT_LOCATION,
    "celsius",
  );

  if (isPending) {
    return (
      <main className={styles.page}>
        <section className={styles.status} aria-live="polite">
          <RefreshCw className={styles.spinner} aria-hidden="true" size={32} />
          <p>Carregando previsão...</p>
        </section>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className={styles.page}>
        <section className={styles.status} role="alert">
          <CloudSun aria-hidden="true" size={40} />
          <h1>Não foi possível carregar a previsão</h1>
          <p>{error?.message ?? "Tente novamente em alguns instantes."}</p>
          <button type="button" onClick={() => refetch()}>
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  const current = data.current;

  return (
    <main className={styles.page}>
      <section className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Previsão do tempo</span>
            <h1>
              <MapPin aria-hidden="true" size={20} />
              {DEFAULT_LOCATION.name}
            </h1>
            <p>{DEFAULT_LOCATION.country}</p>
          </div>
          <CloudSun className={styles.weatherIcon} aria-hidden="true" />
        </header>

        <div className={styles.currentWeather}>
          <div>
            <p className={styles.temperature}>
              {Math.round(current.temperature_2m)}
              <span>°C</span>
            </p>
            <p className={styles.feelsLike}>
              Sensação de {Math.round(current.apparent_temperature)}°C
            </p>
          </div>

          <div className={styles.metrics}>
            <WeatherMetric
              icon={Droplets}
              label="Umidade"
              value={`${current.relative_humidity_2m}%`}
            />
            <WeatherMetric
              icon={Wind}
              label="Vento"
              value={`${Math.round(current.wind_speed_10m)} km/h`}
            />
            <WeatherMetric
              icon={Umbrella}
              label="Precipitação"
              value={`${current.precipitation} mm`}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
