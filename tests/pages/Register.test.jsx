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
import Register from "../../src/pages/Register";

const VALID = {
  fullName: "  Ana Pérez  ",
  email: " ana@correo.com ",
  password: "Clave1234",
  confirmPassword: "Clave1234",
};

async function submitRegister(fields) {
  const user = userEvent.setup();
  renderPage("/register", <Register />);

  await user.type(screen.getByLabelText("Nombre completo"), fields.fullName);
  await user.type(screen.getByLabelText("Correo electrónico"), fields.email);
  await user.type(screen.getByLabelText("Contraseña"), fields.password);
  await user.type(screen.getByLabelText("Confirmar contraseña"), fields.confirmPassword);
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));
}

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("Register", () => {
  it("rejects a password shorter than 8 characters", async () => {
    await submitRegister({ ...VALID, password: "Clave12", confirmPassword: "Clave12" });

    expect(
      await screen.findByText("La contraseña debe tener al menos 8 caracteres.")
    ).toBeTruthy();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("rejects passwords that do not match", async () => {
    await submitRegister({ ...VALID, confirmPassword: "Clave9999" });

    expect(await screen.findByText("Las contraseñas no coinciden.")).toBeTruthy();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("creates the account with the trimmed name and email", async () => {
    await submitRegister(VALID);

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "ana@correo.com",
      password: "Clave1234",
      options: { data: { full_name: "Ana Pérez" } },
    });
  });

  it("asks to confirm the email when sign-up returns no session", async () => {
    await submitRegister(VALID);

    expect(
      await screen.findByText(
        "Registro exitoso. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión."
      )
    ).toBeTruthy();
    expect(screen.queryByText(HOME_TEXT)).toBeNull();
  });

  it("opens the home page when sign-up returns a session", async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { session: { user: { id: "u1" } } },
      error: null,
    });

    await submitRegister(VALID);

    expect(await screen.findByText(HOME_TEXT)).toBeTruthy();
  });

  it("shows the error returned by the server", async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { session: null },
      error: { message: "User already registered" },
    });

    await submitRegister(VALID);

    expect(await screen.findByText("User already registered")).toBeTruthy();
    expect(screen.queryByText(HOME_TEXT)).toBeNull();
  });
});
