// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider } from "../../../src/context/ThemeContext.jsx";
import ProfileMenu from "../../../src/components/profile/ProfileMenu.jsx";

function renderMenu(onLogout = vi.fn()) {
  render(
    <ThemeProvider>
      <p>Fuera del menú</p>
      <ProfileMenu fullName="Ana Pérez" initials="AP" onLogout={onLogout} />
    </ThemeProvider>
  );
  return { onLogout, trigger: screen.getByRole("button", { expanded: false }) };
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("ProfileMenu", () => {
  it("shows the user's name, role and initials, closed by default", () => {
    const { trigger } = renderMenu();

    expect(trigger.textContent).toContain("Ana Pérez");
    expect(trigger.textContent).toContain("Estudiante");
    expect(trigger.textContent).toContain("AP");
    expect(screen.queryByText("Cerrar sesión")).toBeNull();
  });

  it("opens with the theme options and the sign-out button", async () => {
    const { trigger } = renderMenu();

    await userEvent.setup().click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("radiogroup", { name: "Tema de color" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeTruthy();
  });

  it("signs out from the menu", async () => {
    const user = userEvent.setup();
    const { trigger, onLogout } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("closes with Escape and with a click outside", async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();

    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Cerrar sesión")).toBeNull();

    await user.click(trigger);
    await user.click(screen.getByText("Fuera del menú"));
    expect(screen.queryByText("Cerrar sesión")).toBeNull();
  });

  it("stays open when the theme is changed inside it", async () => {
    const user = userEvent.setup();
    const { trigger } = renderMenu();

    await user.click(trigger);
    await user.click(screen.getByRole("radio", { name: "Claro" }));

    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeTruthy();
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
