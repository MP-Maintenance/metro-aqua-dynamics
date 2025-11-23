import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { colorPalettes, getDefaultPalette, type ColorPalette } from "@/lib/colorPalettes";
import { useTheme } from "next-themes";

type ColorPaletteContextType = {
  currentPalette: ColorPalette;
  setPalette: (paletteId: string) => void;
  palettes: ColorPalette[];
};

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined);

export function ColorPaletteProvider({ children }: { children: ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(getDefaultPalette());
  const { theme } = useTheme();

  const setPalette = (paletteId: string) => {
    const palette = colorPalettes.find((p) => p.id === paletteId);
    if (palette) {
      setCurrentPalette(palette);
    }
  };

  // Apply CSS variables when palette or theme changes
  useEffect(() => {
    const isDark = theme === "dark";
    const colors = isDark ? currentPalette.dark : currentPalette.light;

    // Apply the color palette as CSS variables
    document.documentElement.style.setProperty("--primary", colors.primary);
    document.documentElement.style.setProperty("--secondary", colors.secondary);
    document.documentElement.style.setProperty("--accent", colors.accent);
    document.documentElement.style.setProperty("--gradient-hero", colors.gradientHero);
    
    // Update ring color to match primary
    document.documentElement.style.setProperty("--ring", colors.primary);

    // Cleanup function resets to default on unmount
    return () => {
      const defaultColors = isDark ? getDefaultPalette().dark : getDefaultPalette().light;
      document.documentElement.style.setProperty("--primary", defaultColors.primary);
      document.documentElement.style.setProperty("--secondary", defaultColors.secondary);
      document.documentElement.style.setProperty("--accent", defaultColors.accent);
      document.documentElement.style.setProperty("--gradient-hero", defaultColors.gradientHero);
      document.documentElement.style.setProperty("--ring", defaultColors.primary);
    };
  }, [currentPalette, theme]);

  return (
    <ColorPaletteContext.Provider value={{ currentPalette, setPalette, palettes: colorPalettes }}>
      {children}
    </ColorPaletteContext.Provider>
  );
}

export function useColorPalette() {
  const context = useContext(ColorPaletteContext);
  if (context === undefined) {
    throw new Error("useColorPalette must be used within a ColorPaletteProvider");
  }
  return context;
}
