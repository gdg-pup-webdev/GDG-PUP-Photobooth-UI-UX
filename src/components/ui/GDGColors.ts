import { LucideIcon, Sparkles, CircleOff, Sun, Palette, Snowflake, Camera } from "lucide-react";

// Christmas Theme Colors
export const colors = {
  green: "#165B33",      // Deep Holly Green
  red: "#BB2528",        // Warm Christmas Red
  white: "#F8F8F8",      // Snow White
  gold: "#D4AF37",       // Festive Gold
};

export const colorArray = Object.values(colors);

export interface Filter {
  name: string;
  value: string;
  color: string;
  icon: LucideIcon;
}

export const FILTERS: Filter[] = [
  { name: "Normal", value: "", color: colors.green, icon: Sparkles },
  { name: "B&W", value: "grayscale(100%)", color: colors.white, icon: CircleOff },
  { name: "Warm", value: "sepia(100%)", color: colors.gold, icon: Sun },
  { name: "Vivid", value: "contrast(1.2) saturate(1.4)", color: colors.red, icon: Palette },
  { name: "Cool", value: "hue-rotate(180deg) saturate(0.8)", color: colors.red, icon: Snowflake },
  { name: "Vintage", value: "sepia(50%) contrast(1.1) brightness(0.9)", color: colors.green, icon: Camera },
];
