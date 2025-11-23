export type ColorPalette = {
  id: string;
  name: string;
  description: string;
  previewColors: string[]; // For the switcher button
  light: {
    primary: string;
    secondary: string;
    accent: string;
    gradientHero: string;
  };
  dark: {
    primary: string;
    secondary: string;
    accent: string;
    gradientHero: string;
  };
};

export const colorPalettes: ColorPalette[] = [
  {
    id: "default",
    name: "Default",
    description: "Classic pool blue & electric lime",
    previewColors: ["hsl(203, 100%, 29%)", "hsl(160, 19%, 47%)", "hsl(85, 55%, 52%)"],
    light: {
      primary: "203 100% 29%",
      secondary: "160 19% 47%",
      accent: "160 19% 47%",
      gradientHero: "linear-gradient(60deg, hsl(203, 100%, 29%), hsl(160, 19%, 47%))",
    },
    dark: {
      primary: "85 55% 52%",
      secondary: "174 100% 33%",
      accent: "225 35% 52%",
      gradientHero: "linear-gradient(90deg, hsl(85, 55%, 52%) 0%, hsl(198, 80%, 56%) 100%)",
    },
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Deep ocean blues & turquoise",
    previewColors: ["hsl(200, 90%, 40%)", "hsl(180, 70%, 50%)", "hsl(190, 80%, 45%)"],
    light: {
      primary: "200 90% 40%",
      secondary: "180 70% 50%",
      accent: "190 80% 45%",
      gradientHero: "linear-gradient(60deg, hsl(200, 90%, 40%), hsl(180, 70%, 50%))",
    },
    dark: {
      primary: "190 80% 55%",
      secondary: "180 90% 40%",
      accent: "200 70% 50%",
      gradientHero: "linear-gradient(90deg, hsl(190, 80%, 55%) 0%, hsl(200, 85%, 60%) 100%)",
    },
  },
  {
    id: "sunset-pool",
    name: "Sunset Pool",
    description: "Warm sunset oranges & coral pinks",
    previewColors: ["hsl(25, 95%, 55%)", "hsl(340, 85%, 60%)", "hsl(10, 90%, 60%)"],
    light: {
      primary: "25 95% 55%",
      secondary: "340 85% 60%",
      accent: "10 90% 60%",
      gradientHero: "linear-gradient(60deg, hsl(25, 95%, 55%), hsl(340, 85%, 60%))",
    },
    dark: {
      primary: "25 90% 60%",
      secondary: "340 80% 65%",
      accent: "10 85% 65%",
      gradientHero: "linear-gradient(90deg, hsl(25, 90%, 60%) 0%, hsl(340, 80%, 65%) 100%)",
    },
  },
  {
    id: "forest-oasis",
    name: "Forest Oasis",
    description: "Natural greens & earthy tones",
    previewColors: ["hsl(140, 60%, 45%)", "hsl(80, 50%, 50%)", "hsl(160, 55%, 40%)"],
    light: {
      primary: "140 60% 45%",
      secondary: "80 50% 50%",
      accent: "160 55% 40%",
      gradientHero: "linear-gradient(60deg, hsl(140, 60%, 45%), hsl(80, 50%, 50%))",
    },
    dark: {
      primary: "140 55% 55%",
      secondary: "80 60% 55%",
      accent: "160 50% 50%",
      gradientHero: "linear-gradient(90deg, hsl(140, 55%, 55%) 0%, hsl(80, 60%, 55%) 100%)",
    },
  },
];

export const getDefaultPalette = () => colorPalettes[0];
