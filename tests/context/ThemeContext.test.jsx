// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider } from "../../src/context/ThemeContext.jsx";
import { THEME_STORAGE_KEY } from "../../src/context/themeContext.js";
import { useTheme } from "../../src/context/useTheme.js";

function Probe() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Elegido: {theme}</p>
      <p>Aplicado: {resolvedTheme}</p>
      <button onClick={() => setTheme("light")}>Claro</button>
      <button onClick={() => setTheme("system")}>Sistema</button>
    </div>
  );
}

// Simulates the browser's prefers-color-scheme setting.
function mockSystemTheme(prefersDark) {
  const listeners = new Set();
  const media = {
    matches: prefersDark,
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  };

  window.matchMedia = vi.fn(() => media);

  return (nextPrefersDark) => {
    media.matches = nextPrefersDark;
    listeners.forEach((listener) => listener({ matches: nextPrefersDark }));
  };
}

const renderProbe = () =>
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>
  );

beforeEach(() => {
  localStorage.clear();
  mockSystemTheme(false);
});

afterEach(() => {
  cleanup();
  delete window.matchMedia;
});

describe("ThemeProvider", () => {
  it("uses the dark theme by default", () => {
    renderProbe();

    expect(screen.getByText("Elegido: dark")).toBeTruthy();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("restores the theme saved in a previous visit", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");

    renderProbe();

    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("ignores an invalid saved value and falls back to dark", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "purple");

    renderProbe();

    expect(screen.getByText("Elegido: dark")).toBeTruthy();
  });

  it("applies and saves the theme the user picks", async () => {
    renderProbe();

    await userEvent.setup().click(screen.getByRole("button", { name: "Claro" }));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("follows the system setting, including live changes, in system mode", async () => {
    const changeSystemTheme = mockSystemTheme(true);
    renderProbe();

    await userEvent.setup().click(screen.getByRole("button", { name: "Sistema" }));
    expect(screen.getByText("Aplicado: dark")).toBeTruthy();

    act(() => changeSystemTheme(false));
    expect(screen.getByText("Aplicado: light")).toBeTruthy();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("fails clearly when used outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow("useTheme must be used inside ThemeProvider");
    console.error.mockRestore();
  });
});
