// src/types/pepper.ts
export type Region = "US" | "EU";

export type Difficulty = "No preference" | "beginner" | "intermediate" | "advanced";

export type HeatCategory = "No preference" | "none" | "mild" | "medium" | "hot" | "very_hot" | "extreme";

export type PepperType = "No preference" | "bell" | "cayenne_type" | "habanero_type" | "jalapeno_type" | "thai_type" | "ornamental" | "other";

export type GrowthHabit = "No preference" | "bushy" | "tall" | "compact";

export type ClimateSuitability = "No preference" | "cool" | "temperate" | "hot";

export type Pepper = {
  id: number;
  name: string;
  alternateNames: string;
  species: string;
  type: string;
  description: string;
  heatSHU_min: number;
  heatSHU_max: number;
  heatCategory: string;
  sweetness: number;
  fruitiness: number;
  smokiness: number;
  bitterness: number;
  earthiness: number;
  bestUses: string[];
  cuisineAffinity: string[];
  prepBest: string[];
  daysToMaturity_min: number;
  daysToMaturity_max: number;
  plantHeightCm_min: number;
  plantHeightCm_max: number;
  growthHabit: string;
  yieldLevel: string;
  difficulty: string;
  climateSuitability: string;
  heatTolerance: number;
  coldTolerance: number;
  containerFriendly: boolean;
  minPotLiters: number | null;
  indoorSuitable: boolean;
  greenhouseRecommended: boolean;
  lengthCm_min: number;
  lengthCm_max: number;
  wallThickness: string;
  colorStages: string[];
  diseaseNotes: string;
  sources: string;
  confidence: string;
  availableFrom_SeedSow: boolean;
  availableFrom_WestCoastSeeds: boolean;
  vendorSeedList: string;
  vendorVarietyNames: string;
  affiliateOverride?: {
    US?: { seeds?: string };
    EU?: { seeds?: string };
  };
  matchTier?: string;
  matchReasons?: string[];
};

export type PepperPreferences = {
  heatCategory: HeatCategory;
  sweetness: number;
  fruitiness: number;
  smokiness: number;
  pepperType: PepperType;
  useCase: string[];
  cuisineStyle: string;
  growthHabit: GrowthHabit;
  climateSuitability: ClimateSuitability;
  containerFriendly: string;
  difficulty: Difficulty;
};
