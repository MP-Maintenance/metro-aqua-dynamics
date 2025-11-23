import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useColorPalette } from "@/contexts/ColorPaletteContext";

export function ColorPaletteSwitcher() {
  const { currentPalette, setPalette, palettes } = useColorPalette();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Select color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {palettes.map((palette) => (
          <DropdownMenuItem
            key={palette.id}
            onClick={() => setPalette(palette.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex gap-1">
              {palette.previewColors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{palette.name}</span>
              <span className="text-xs text-muted-foreground">{palette.description}</span>
            </div>
            {currentPalette.id === palette.id && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
