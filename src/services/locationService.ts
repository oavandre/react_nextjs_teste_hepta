import type { GeocodingResponse, Location } from "@/types/weather";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCities(searchTerm: string): Promise<Location[]> {
  const normalizedSearchTerm = searchTerm.trim();

  if (normalizedSearchTerm.length < 2) return [];

  const searchParams = new URLSearchParams({
    name: normalizedSearchTerm,
    count: "5",
    language: "pt",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_API_URL}?${searchParams}`);

  if (!response.ok) {
    throw new Error("Não foi possível buscar as cidades.");
  }

  const data = (await response.json()) as GeocodingResponse;

  return (data.results ?? []).map((result) => ({
    name: result.name,
    country: result.country ?? "",
    region: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}
