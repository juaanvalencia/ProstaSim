// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// WebGL is not available in the test browser: the canvas and the 3D scene are
// replaced by stand-ins that expose what the panel sends to the scene.
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, onPointerMissed }) => (
    <div>
      <button onClick={onPointerMissed}>Clic en el fondo del visor</button>
      {children}
    </div>
  ),
}));
vi.mock("../../../src/components/anatomy/AnatomyScene", () => ({
  default: (props) => (
    <pre data-testid="scene">
      {JSON.stringify({
        visibility: props.visibility,
        opacity: props.opacity,
        selected: props.selected,
        view: props.view,
        viewRequest: props.viewRequest,
      })}
    </pre>
  ),
}));

import Anatomy3D from "../../../src/components/anatomy/Anatomy3D";
import { ORGANOS } from "../../../src/components/anatomy/anatomyData";

const scene = () => JSON.parse(screen.getByTestId("scene").textContent);
const button = (name) => screen.getByRole("button", { name });

function renderAnatomy() {
  render(<Anatomy3D />);
  return userEvent.setup();
}

afterEach(cleanup);

describe("Anatomy3D", () => {
  it("opens with the prostate selected and its information shown", () => {
    renderAnatomy();

    expect(screen.getByText("ESTRUCTURA SELECCIONADA")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Próstata" })).toBeTruthy();
    expect(scene().selected).toBe("Prostate");
    expect(screen.getByText(`${ORGANOS.length}/${ORGANOS.length}`)).toBeTruthy();
  });

  it("shows the information of the structure selected in the list", async () => {
    const user = renderAnatomy();

    await user.click(button("Nódulo patológico"));

    expect(screen.getByText(/representación educativa de una alteración/)).toBeTruthy();
    expect(scene().selected).toBe("Pathological_Nodule");
  });

  it("hides and shows a structure, updating the visible count", async () => {
    const user = renderAnatomy();

    await user.click(button("Ocultar Nódulo patológico"));
    expect(scene().visibility.Pathological_Nodule).toBe(false);
    expect(screen.getByText(`${ORGANOS.length - 1}/${ORGANOS.length}`)).toBeTruthy();

    await user.click(button("Mostrar Nódulo patológico"));
    expect(scene().visibility.Pathological_Nodule).toBe(true);
  });

  it("isolates the prostate and then shows every structure again", async () => {
    const user = renderAnatomy();

    await user.click(button("Vejiga"));
    await user.click(button(/Solo próstata/));

    ORGANOS.forEach((organ) =>
      expect(scene().visibility[organ.meshName]).toBe(organ.meshName === "Prostate")
    );
    expect(scene().selected).toBe("Prostate");

    await user.click(button(/Mostrar todo/));
    ORGANOS.forEach((organ) => expect(scene().visibility[organ.meshName]).toBe(true));
  });

  it("moves the camera to each view and allows resetting it repeatedly", async () => {
    const user = renderAnatomy();

    for (const view of ["Frontal", "Sagital", "Posterior"]) {
      await user.click(button(new RegExp(view)));
      expect(scene().view).toBe(view.toLowerCase());
    }

    await user.click(button(/Reset/));
    const firstReset = scene().viewRequest;
    await user.click(button(/Reset/));

    expect(scene().view).toBe("reset");
    expect(scene().viewRequest).toBe(firstReset + 1);
  });

  it("resets the camera with a double click on the viewer", async () => {
    const user = renderAnatomy();

    await user.click(button(/Sagital/));
    await user.dblClick(screen.getByTestId("scene"));

    expect(scene().view).toBe("reset");
  });

  it("changes the opacity of the model and shows the percentage", () => {
    renderAnatomy();

    fireEvent.change(screen.getByLabelText("Opacidad contextual"), { target: { value: "0.5" } });

    expect(scene().opacity).toBe(0.5);
    expect(screen.getByText("50%")).toBeTruthy();
  });

  it("clears the selection when clicking an empty part of the viewer", async () => {
    const user = renderAnatomy();

    await user.click(button("Clic en el fondo del visor"));

    expect(scene().selected).toBeNull();
    expect(screen.getByRole("heading", { level: 3, name: "Selecciona una estructura" })).toBeTruthy();
  });
});
