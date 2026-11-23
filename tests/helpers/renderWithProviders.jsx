import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../../src/context/AuthContext";

// The theme provider only exists since the visual redesign; earlier versions
// of the app render without it, so the same tests run on both.
const themeModules = import.meta.glob("../../src/context/ThemeContext.jsx", { eager: true });
export const ThemeProvider =
  Object.values(themeModules)[0]?.ThemeProvider ?? (({ children }) => children);

export const HOME_TEXT = "Página principal";

// Renders a page at `path` inside the app providers, with a stub home page at "/".
export function renderPage(path, element) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider>
          <Routes>
            <Route path={path} element={element} />
            <Route path="/" element={<p>{HOME_TEXT}</p>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
}
