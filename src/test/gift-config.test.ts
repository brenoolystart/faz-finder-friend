import { describe, expect, it } from "vitest";
import { giftConfigSchema, readGiftConfig } from "../lib/gift-config";

describe("gift configuration", () => {
  it("requires an issuing store when enabled", () => {
    expect(giftConfigSchema.safeParse({ enabled: true, issuer: "", fields: [] }).success).toBe(false);
  });
  it("round trips fixed values and option lists", () => {
    const config = { enabled: true, issuer: "Loja teste", fields: [
      { id: "version", label: "Versão", type: "fixed", value: "Digital", options: [] },
      { id: "category", label: "Categoria", type: "select", value: "", options: ["Plus", "Premium"] },
    ] };
    expect(readGiftConfig(JSON.stringify(config))).toEqual(config);
  });
  it("rejects empty lists and fixed values", () => {
    for (const type of ["fixed", "select"]) expect(giftConfigSchema.safeParse({ enabled: true, issuer: "Loja", fields: [{ id: "a", label: "Campo", type, value: "", options: [] }] }).success).toBe(false);
  });
  it("handles missing or malformed configuration", () => {
    expect(readGiftConfig().enabled).toBe(false);
    expect(readGiftConfig("bad json").fields).toEqual([]);
  });
});