"use client";

import { LoaderCircle, MapPin, Search, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCitySearch } from "@/hooks/useCitySearch";
import type { Location } from "@/types/weather";
import styles from "./CitySearch.module.css";

type CitySearchProps = {
  onSelect: (location: Location) => void;
};

export function CitySearch({ onSelect }: CitySearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: locations = [], error, isFetching } =
    useCitySearch(searchTerm);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchTerm(inputValue.trim());
  }

  function handleSelect(location: Location) {
    onSelect(location);
    setInputValue("");
    setSearchTerm("");
  }

  function handleClear() {
    setInputValue("");
    setSearchTerm("");
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} role="search">
        <Search aria-hidden="true" size={19} />
        <input
          aria-label="Buscar cidade"
          onChange={(event) => {
            setInputValue(event.target.value);
            setSearchTerm("");
          }}
          placeholder="Buscar outra cidade..."
          type="search"
          value={inputValue}
        />
        {inputValue && (
          <button
            aria-label="Limpar busca"
            className={styles.clearButton}
            onClick={handleClear}
            type="button"
          >
            <X aria-hidden="true" size={17} />
          </button>
        )}
        <button
          className={styles.submitButton}
          disabled={inputValue.trim().length < 2}
          type="submit"
        >
          Buscar
        </button>
      </form>

      {searchTerm && (
        <div className={styles.results} role="listbox">
          {isFetching && (
            <p className={styles.message}>
              <LoaderCircle
                className={styles.spinner}
                aria-hidden="true"
                size={18}
              />
              Buscando cidades...
            </p>
          )}

          {error && <p className={styles.error}>{error.message}</p>}

          {!isFetching && !error && locations.length === 0 && (
            <p className={styles.message}>Nenhuma cidade encontrada.</p>
          )}

          {!isFetching &&
            locations.map((location) => (
              <button
                aria-selected="false"
                key={`${location.latitude}-${location.longitude}`}
                onClick={() => handleSelect(location)}
                role="option"
                type="button"
              >
                <MapPin aria-hidden="true" size={18} />
                <span>
                  <strong>{location.name}</strong>
                  <small>
                    {[location.region, location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </small>
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
