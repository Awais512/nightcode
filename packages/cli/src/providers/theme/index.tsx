import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type ThemeColors, type Theme, THEMES } from "../../theme";
import { DEFAULT_THEME } from "../../theme";
import { readPreferences, writePreferences } from "../../lib/preferences";

function getInitialTheme(): Theme {
  const preferences = readPreferences();
  const savedTheme = THEMES.find(
    (theme) => theme.name === preferences.themeName,
  );

  return savedTheme ?? DEFAULT_THEME;
}

function persistTheme(theme: Theme) {
  writePreferences({ themeName: theme.name });
}

type ThemeContextValue = {
  colors: ThemeColors;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return value;
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    persistTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ colors: currentTheme.colors, currentTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
