"use client";

import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/services/locationService";

export const citySearchQueryKeys = {
  all: ["city-search"] as const,
  search: (searchTerm: string) =>
    [...citySearchQueryKeys.all, searchTerm.trim().toLowerCase()] as const,
};

export function useCitySearch(searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim();

  return useQuery({
    queryKey: citySearchQueryKeys.search(normalizedSearchTerm),
    queryFn: () => searchCities(normalizedSearchTerm),
    enabled: normalizedSearchTerm.length >= 2,
    staleTime: 30 * 60 * 1000,
  });
}
