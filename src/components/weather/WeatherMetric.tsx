import type { LucideIcon } from "lucide-react";
import styles from "./WeatherDashboard.module.css";

type WeatherMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function WeatherMetric({
  icon: Icon,
  label,
  value,
}: WeatherMetricProps) {
  return (
    <div className={styles.metric}>
      <span className={styles.metricIcon}>
        <Icon aria-hidden="true" size={20} />
      </span>
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}
