import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useColorPalette } from "@/contexts/ColorPaletteContext";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function ColorPaletteSwitcher() {
  const { currentPalette, setPalette, palettes } = useColorPalette();
  const { theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative color-transition">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Select color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-2">
        <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
          Choose Color Theme
        </div>
        {palettes.map((palette) => {
          const isActive = currentPalette.id === palette.id;
          
          return (
            <DropdownMenuItem
              key={palette.id}
              onClick={() => setPalette(palette.id)}
              className={`relative flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                isActive ? "bg-muted/50" : ""
              }`}
            >
              <div className="flex gap-1.5 flex-shrink-0">
                {palette.previewColors.map((color, index) => (
                  <motion.div
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-border shadow-sm"
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-medium text-sm truncate">{palette.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {palette.description}
                </span>
              </div>
              {isActive && (
                <motion.span 
                  className="text-primary font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  ✓
                </motion.span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
