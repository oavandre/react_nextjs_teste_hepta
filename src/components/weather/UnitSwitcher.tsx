import type { TemperatureUnit } from "@/types/weather";
import styles from "./UnitSwitcher.module.css";

type UnitSwitcherProps = {
  value: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
};

const units: Array<{ label: string; value: TemperatureUnit }> = [
  { label: "°C", value: "celsius" },
  { label: "°F", value: "fahrenheit" },
];

export function UnitSwitcher({ value, onChange }: UnitSwitcherProps) {
  return (
    <div className={styles.switcher} aria-label="Unidade de temperatura">
      {units.map((unit) => (
        <button
          aria-pressed={value === unit.value}
          className={value === unit.value ? styles.active : undefined}
          key={unit.value}
          onClick={() => onChange(unit.value)}
          type="button"
        >
          {unit.label}
        </button>
      ))}
    </div>
  );
}
