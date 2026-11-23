// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider } from "../../../src/context/ThemeContext.jsx";
import ThemeSwitch from "../../../src/components/theme/ThemeSwitch.jsx";

const renderSwitch = () =>
  render(
    <ThemeProvider>
      <ThemeSwitch />
    </ThemeProvider>
  );

const checkedOption = () =>
  screen.getAllByRole("radio").find((radio) => radio.getAttribute("aria-checked") === "true");

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("ThemeSwitch", () => {
  it("offers light, dark and system with dark selected by default", () => {
    renderSwitch();

    expect(screen.getAllByRole("radio").map((radio) => radio.textContent)).toEqual([
      "Claro",
      "Oscuro",
      "Sistema",
    ]);
    expect(checkedOption().textContent).toBe("Oscuro");
  });

  it("applies the option the user clicks", async () => {
    renderSwitch();

    await userEvent.setup().click(screen.getByRole("radio", { name: "Claro" }));

    expect(checkedOption().textContent).toBe("Claro");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("moves between options with the arrow keys, wrapping around", async () => {
    const user = userEvent.setup();
    renderSwitch();

    screen.getByRole("radio", { name: "Oscuro" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(checkedOption().textContent).toBe("Sistema");
    expect(document.activeElement.textContent).toBe("Sistema");

    await user.keyboard("{ArrowRight}");
    expect(checkedOption().textContent).toBe("Claro");

    await user.keyboard("{ArrowLeft}");
    expect(checkedOption().textContent).toBe("Sistema");
  });

  it("keeps only the selected option in the tab order", () => {
    renderSwitch();

    const tabIndexes = screen.getAllByRole("radio").map((radio) => radio.tabIndex);

    expect(tabIndexes).toEqual([-1, 0, -1]);
  });
});
