// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../../src/services/supabase", async () => {
  const { createFakeSupabase } = await import("../helpers/fakeSupabase");
  return { supabase: createFakeSupabase() };
});

import { supabase } from "../../src/services/supabase";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";

const SESSION = { user: { id: "user-1", email: "ana@correo.com" } };

function Probe() {
  const { user, profile, loading, logout } = useAuth();

  if (loading) return <p>Cargando</p>;

  return (
    <div>
      <p>Usuario: {user ? user.email : "ninguno"}</p>
      <p>Perfil: {profile ? profile.full_name : "ninguno"}</p>
      <button onClick={logout}>Salir</button>
    </div>
  );
}

const renderProbe = () =>
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("AuthProvider", () => {
  it("starts without a user when there is no saved session", async () => {
    renderProbe();

    expect(await screen.findByText("Usuario: ninguno")).toBeTruthy();
    expect(screen.getByText("Perfil: ninguno")).toBeTruthy();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("restores the saved session and loads the user's profile", async () => {
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: SESSION }, error: null });
    supabase.query.maybeSingle.mockResolvedValueOnce({
      data: { id: "user-1", full_name: "Ana Pérez" },
      error: null,
    });

    renderProbe();

    expect(await screen.findByText("Usuario: ana@correo.com")).toBeTruthy();
    expect(await screen.findByText("Perfil: Ana Pérez")).toBeTruthy();
    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(supabase.query.eq).toHaveBeenCalledWith("id", "user-1");
  });

  it("keeps the user without a profile when the profile query fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: SESSION }, error: null });
    supabase.query.maybeSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "permission denied" },
    });

    renderProbe();

    expect(await screen.findByText("Usuario: ana@correo.com")).toBeTruthy();
    expect(screen.getByText("Perfil: ninguno")).toBeTruthy();
    console.error.mockRestore();
  });

  it("signs out through Supabase", async () => {
    renderProbe();

    await userEvent.setup().click(await screen.findByRole("button", { name: "Salir" }));

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
