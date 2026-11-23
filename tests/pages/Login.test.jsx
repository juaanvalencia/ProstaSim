// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../../src/services/supabase", async () => {
  const { createFakeSupabase } = await import("../helpers/fakeSupabase");
  return { supabase: createFakeSupabase() };
});

import { supabase } from "../../src/services/supabase";
import { HOME_TEXT, renderPage } from "../helpers/renderWithProviders";
import Login from "../../src/pages/Login";

const LOGIN_ERROR = "No fue posible iniciar sesión. Verifica tus datos.";

async function submitLogin({ email, password }) {
  const user = userEvent.setup();
  renderPage("/login", <Login />);

  if (email) await user.type(screen.getByLabelText("Correo electrónico"), email);
  if (password) await user.type(screen.getByLabelText("Contraseña"), password);
  await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("Login", () => {
  it("signs in with valid credentials and opens the home page", async () => {
    await submitLogin({ email: "estudiante@correo.com", password: "Clave1234" });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "estudiante@correo.com",
      password: "Clave1234",
    });
    expect(await screen.findByText(HOME_TEXT)).toBeTruthy();
  });

  it("shows an error and stays on the page with wrong credentials", async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {},
      error: { message: "Invalid login credentials" },
    });

    await submitLogin({ email: "estudiante@correo.com", password: "ClaveMala" });

    expect(await screen.findByText(LOGIN_ERROR)).toBeTruthy();
    expect(screen.queryByText(HOME_TEXT)).toBeNull();
  });

  it("does not send the form when the password is empty", async () => {
    await submitLogin({ email: "estudiante@correo.com" });

    expect(screen.getByLabelText("Contraseña").validity.valueMissing).toBe(true);
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("does not send the form when the email is empty", async () => {
    await submitLogin({ password: "Clave1234" });

    expect(screen.getByLabelText("Correo electrónico").validity.valueMissing).toBe(true);
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("does not send the form when the email is not valid", async () => {
    await submitLogin({ email: "estudiante", password: "Clave1234" });

    expect(screen.getByLabelText("Correo electrónico").validity.typeMismatch).toBe(true);
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });
});
