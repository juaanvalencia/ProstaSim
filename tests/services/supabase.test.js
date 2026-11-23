import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn((url, key) => ({ url, key })),
}));

import { createClient } from "@supabase/supabase-js";

// supabase.js reads the environment when it is imported, so each test imports a fresh copy.
const importClient = () => import("../../src/services/supabase");

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

afterEach(() => vi.unstubAllEnvs());

describe("Supabase client", () => {
  it("connects with the project URL and key from the environment", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://proyecto.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "clave-publica");

    const { supabase } = await importClient();

    expect(createClient).toHaveBeenCalledWith("https://proyecto.supabase.co", "clave-publica");
    expect(supabase).toEqual({ url: "https://proyecto.supabase.co", key: "clave-publica" });
  });

  it("warns clearly when the project URL is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "clave-publica");

    await expect(importClient()).rejects.toThrow("Faltan las credenciales de Supabase.");
    expect(createClient).not.toHaveBeenCalled();
  });

  it("warns clearly when the key is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://proyecto.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");

    await expect(importClient()).rejects.toThrow("Faltan las credenciales de Supabase.");
    expect(createClient).not.toHaveBeenCalled();
  });
});
