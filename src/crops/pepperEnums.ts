// src/crops/pepperEnums.ts

export const PEPPER_USE_CASES = [
  "hot_sauce",
  "pickling",
  "salsa",
  "fermenting",
  "stuffing",
  "fresh_eating",
  "drying",
  "roasting",
  "cooking",
  "ornamental",
  "jerk",
  "challenges",
  "novelty",
  "marinade",
  "curry_paste",
  "seafood",
  "jelly",
  "gourmet",
  "finishing",
  "canning",
] as const;

export type PepperUseCase = typeof PEPPER_USE_CASES[number];

export const PEPPER_TYPES = [
  { value: "bell", label: "Bell Pepper (sweet, no heat)" },
  { value: "cayenne_type", label: "Cayenne Type (long, thin, hot)" },
  { value: "habanero_type", label: "Habanero Type (lantern-shaped, very hot)" },
  { value: "jalapeno_type", label: "Jalapeño Type (medium, versatile)" },
  { value: "thai_type", label: "Thai Type (small, very hot)" },
  { value: "ornamental", label: "Ornamental (decorative)" },
  { value: "other", label: "Other" },
];

export type PepperType = "bell" | "cayenne_type" | "habanero_type" | "jalapeno_type" | "thai_type" | "ornamental" | "other";

export const PEPPER_GROWTH_HABITS = [
  { value: "bushy", label: "Bushy (compact, good for containers)" },
  { value: "tall", label: "Tall (needs staking)" },
  { value: "compact", label: "Compact (very small)" },
];

export type PepperGrowthHabit = "bushy" | "tall" | "compact";

export const PEPPER_HEAT_CATEGORIES = [
  { value: "none", label: "No heat (0 SHU) - Bell peppers" },
  { value: "mild", label: "Mild (100-2,500 SHU) - Banana, Poblano" },
  { value: "medium", label: "Medium (2,500-30,000 SHU) - Jalapeño, Serrano" },
  { value: "hot", label: "Hot (30,000-100,000 SHU) - Cayenne, Thai" },
  { value: "very_hot", label: "Very Hot (100,000-350,000 SHU) - Habanero, Scotch Bonnet" },
  { value: "extreme", label: "Extreme (350,000+ SHU) - Ghost, Reaper" },
];

export type PepperHeatCategory = "none" | "mild" | "medium" | "hot" | "very_hot" | "extreme";

export const PEPPER_CLIMATES = [
  { value: "cool", label: "Cool climate / Short season" },
  { value: "temperate", label: "Temperate / Average season" },
  { value: "hot", label: "Hot climate / Long season" },
];

export type PepperClimate = "cool" | "temperate" | "hot";

export const PEPPER_CUISINES = [
  { value: "global", label: "Global / All-purpose" },
  { value: "mexican", label: "Mexican / Tex-Mex" },
  { value: "caribbean", label: "Caribbean / Jamaican" },
  { value: "korean", label: "Korean" },
  { value: "thai", label: "Thai / Southeast Asian" },
  { value: "indian", label: "Indian / South Asian" },
  { value: "mediterranean", label: "Mediterranean / European" },
];

export type PepperCuisine = "global" | "mexican" | "caribbean" | "korean" | "thai" | "indian" | "mediterranean";

export const PEPPER_DIFFICULTY = [
  { value: "beginner", label: "Beginner (easy, forgiving)" },
  { value: "intermediate", label: "Intermediate (some experience)" },
  { value: "advanced", label: "Advanced (challenging)" },
];

export type Difficulty = "beginner" | "intermediate" | "advanced";

export const PEPPER_CUISINE_AFFINITIES = [
  "global",
  "mexican",
  "caribbean",
  "korean",
  "thai",
  "indian",
  "mediterranean",
  "american",
  "jamaican",
  "vietnamese",
  "asian",
  "southwestern",
  "peruvian",
  "south_american",
  "cajun",
  "eastern_european",
  "italian",
  "portuguese",
  "african",
  "brazilian",
  "hungarian",
  "yucatan",
  "tropical",
  "florida",
  "mozambican",
  "andean",
  "bolivian",
  "bangladeshi",
  "middle_eastern",
  "turkish",
  "malaysian",
] as const;

export type PepperCuisineAffinity = typeof PEPPER_CUISINE_AFFINITIES[number];
