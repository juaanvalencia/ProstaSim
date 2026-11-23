import { createContext } from "react";

export const THEME_STORAGE_KEY = "prostasim:theme";
export const THEME_OPTIONS = ["light", "dark", "system"];

export const ThemeContext = createContext(null);
