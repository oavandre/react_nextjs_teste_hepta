"use client";

import {
  CloudSun,
  Droplets,
  MapPin,
  RefreshCw,
  Umbrella,
  Wind,
} from "lucide-react";
import { useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { DEFAULT_LOCATION } from "@/services/weatherService";
import type { Location, TemperatureUnit } from "@/types/weather";
import { getWeatherCondition } from "@/utils/weatherCode";
import { CitySearch } from "./CitySearch";
import { CurrentLocationButton } from "./CurrentLocationButton";
import { ForecastList } from "./ForecastList";
import { ThemeToggle } from "./ThemeToggle";
import { UnitSwitcher } from "./UnitSwitcher";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherMetric } from "./WeatherMetric";
import styles from "./WeatherDashboard.module.css";

type WeatherScene = "sunny" | "cloudy" | "rainy";

function getWeatherScene(code: number): WeatherScene {
  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  ) {
    return "rainy";
  }

  if ((code >= 1 && code <= 3) || code === 45 || code === 48 || code >= 71) {
    return "cloudy";
  }

  return "sunny";
}

export function WeatherDashboard() {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [temperatureUnit, setTemperatureUnit] =
    useState<TemperatureUnit>("celsius");
  const { data, error, isPending, refetch } = useWeather(
    location,
    temperatureUnit,
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
  const condition = getWeatherCondition(current.weather_code);
  const weatherScene = getWeatherScene(current.weather_code);
  const unitSymbol = temperatureUnit === "celsius" ? "C" : "F";
  const locationDetails = [location.region, location.country]
    .filter(Boolean)
    .join(", ");

  return (
    <main className={`${styles.page} ${styles[weatherScene]}`}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span />
        <span />
      </div>
      <div className={styles.toolbar}>
        <CitySearch onSelect={setLocation} />
        <CurrentLocationButton onSelect={setLocation} />
      </div>
      <section className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Previsão do tempo</span>
            <h1>
              <MapPin aria-hidden="true" size={20} />
              {location.name}
            </h1>
            {locationDetails && <p>{locationDetails}</p>}
          </div>
          <div className={styles.headerActions}>
            <div className={styles.preferences}>
              <UnitSwitcher
                onChange={setTemperatureUnit}
                value={temperatureUnit}
              />
              <ThemeToggle />
            </div>
            <WeatherIcon
              className={styles.weatherIcon}
              code={current.weather_code}
              isDay={current.is_day === 1}
            />
          </div>
        </header>

        <div className={styles.currentWeather}>
          <div>
            <p className={styles.temperature}>
              {Math.round(current.temperature_2m)}
              <span>°{unitSymbol}</span>
            </p>
            <p className={styles.feelsLike}>
              Sensação de {Math.round(current.apparent_temperature)}°
              {unitSymbol}
            </p>
            <p className={styles.condition}>{condition.label}</p>
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

        <ForecastList daily={data.daily} />
      </section>
    </main>
  );
}
