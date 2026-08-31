import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { getWeatherCondition } from "@/utils/weatherCode";

type WeatherIconProps = {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
};

export function WeatherIcon({
  code,
  isDay = true,
  className,
  size = 40,
}: WeatherIconProps) {
  const { kind, label } = getWeatherCondition(code);
  let Icon: LucideIcon;

  switch (kind) {
    case "clear":
      Icon = isDay ? Sun : Moon;
      break;
    case "cloudy":
      Icon = isDay ? CloudSun : CloudMoon;
      break;
    case "fog":
      Icon = CloudFog;
      break;
    case "drizzle":
    case "rain":
      Icon = CloudRain;
      break;
    case "snow":
      Icon = CloudSnow;
      break;
    case "storm":
      Icon = CloudLightning;
      break;
    default:
      Icon = Cloud;
  }

  return (
    <Icon
      aria-label={label}
      className={className}
      role="img"
      size={size}
    />
  );
}
