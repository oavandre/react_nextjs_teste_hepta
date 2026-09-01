import { afterEach, describe, expect, it, vi } from "vitest";
import { searchCities } from "./locationService";

afterEach(() => vi.restoreAllMocks());

describe("searchCities", () => {
  it("não consulta termos com menos de dois caracteres", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await expect(searchCities(" a ")).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normaliza e converte os resultados da API", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        results: [{ id: 1, name: "Recife", country: "Brasil", admin1: "Pernambuco", latitude: -8.05, longitude: -34.9 }],
      }),
    } as unknown as Response);

    await expect(searchCities(" Recife ")).resolves.toEqual([
      { name: "Recife", country: "Brasil", region: "Pernambuco", latitude: -8.05, longitude: -34.9 },
    ]);
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get("name")).toBe("Recife");
    expect(url.searchParams.get("language")).toBe("pt");
  });

  it("aceita resposta sem resultados e país", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ results: [{ id: 1, name: "X", latitude: 1, longitude: 2 }] }),
    } as unknown as Response);
    await expect(searchCities("xx")).resolves.toEqual([
      { name: "X", country: "", region: undefined, latitude: 1, longitude: 2 },
    ]);
  });

  it("retorna lista vazia quando results não existe", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue({}) } as unknown as Response);
    await expect(searchCities("xx")).resolves.toEqual([]);
  });

  it("informa erro quando a API falha", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);
    await expect(searchCities("Recife")).rejects.toThrow("Não foi possível buscar as cidades.");
  });
});
