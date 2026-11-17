/* data-local.test.ts — a data dos relatórios segue o horário de Brasília, não a UTC (issue #30). */
import { describe, it, expect } from "vitest";
// @ts-expect-error módulo .mjs sem tipos
import { hojeLocal } from "../scripts/lib/data-local.mjs";

describe("hojeLocal", () => {
  it("à noite em Brasília, mantém o dia local, embora a UTC já esteja no dia seguinte", () => {
    expect(hojeLocal(new Date("2026-11-16T02:29:00Z"))).toBe("2026-11-15");
  });
  it("vira o dia à meia-noite de Brasília (03h UTC)", () => {
    expect(hojeLocal(new Date("2026-11-16T02:59:59Z"))).toBe("2026-11-15");
    expect(hojeLocal(new Date("2026-11-16T03:00:00Z"))).toBe("2026-11-16");
  });
  it("devolve AAAA-MM-DD com zeros à esquerda", () => {
    expect(hojeLocal(new Date("2026-01-05T15:00:00Z"))).toBe("2026-01-05");
  });
});
