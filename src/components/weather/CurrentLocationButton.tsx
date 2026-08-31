"use client";

import { LoaderCircle, LocateFixed } from "lucide-react";
import { useState } from "react";
import type { Location } from "@/types/weather";
import styles from "./CurrentLocationButton.module.css";

type CurrentLocationButtonProps = {
  onSelect: (location: Location) => void;
};

function getLocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "Permissão de localização negada.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Localização indisponível neste dispositivo.";
  }

  if (error.code === error.TIMEOUT) {
    return "A localização demorou muito para responder.";
  }

  return "Não foi possível obter sua localização.";
}

export function CurrentLocationButton({
  onSelect,
}: CurrentLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleCurrentLocation() {
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("Geolocalização não suportada pelo navegador.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onSelect({
          name: "Minha localização",
          country: "",
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(getLocationErrorMessage(error));
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 10 * 60 * 1000,
        timeout: 8_000,
      },
    );
  }

  return (
    <div className={styles.container}>
      <button
        disabled={isLoading}
        onClick={handleCurrentLocation}
        type="button"
      >
        {isLoading ? (
          <LoaderCircle
            className={styles.spinner}
            aria-hidden="true"
            size={18}
          />
        ) : (
          <LocateFixed aria-hidden="true" size={18} />
        )}
        {isLoading ? "Localizando..." : "Usar minha localização"}
      </button>
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
