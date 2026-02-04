// src/crops/pepperScoring.ts
import type { Pepper, PepperPreferences } from "../types/pepper";

// Heat category order for comparison
const HEAT_ORDER = ["none", "mild", "medium", "hot", "very_hot", "extreme"];

export function scorePepper(
  pepper: Pepper,
  prefs: PepperPreferences
): { score: number; maxScore: number } | null {
  let score = 0;
  let maxScore = 0;

  // ============ CRITICAL FILTERS ============
  // These eliminate peppers that fundamentally don't match

  // Heat category filter (critical if specified)
  if (prefs.heatCategory !== "No preference") {
    const prefIndex = HEAT_ORDER.indexOf(prefs.heatCategory);
    const pepperIndex = HEAT_ORDER.indexOf(pepper.heatCategory);
    const diff = Math.abs(prefIndex - pepperIndex);
    
    if (diff > 1) {
      return null; // Too far from preferred heat - eliminate
    }
    maxScore += 15;
    if (diff === 0) {
      score += 15;
    } else {
      score += 8; // Adjacent heat level - partial credit
    }
  }

  // Pepper type filter (critical if specified)
  if (prefs.pepperType !== "No preference") {
    if (pepper.type !== prefs.pepperType) {
      return null;
    }
    maxScore += 10;
    score += 10;
  }

  // Container friendly filter (critical for container growers)
  if (prefs.containerFriendly === "Yes") {
    if (!pepper.containerFriendly) {
      return null;
    }
    maxScore += 10;
    score += 10;
  }

  // Difficulty filter
  if (prefs.difficulty !== "No preference") {
    const difficultyOrder = ["beginner", "intermediate", "advanced"];
    const prefDiff = difficultyOrder.indexOf(prefs.difficulty);
    const pepperDiff = difficultyOrder.indexOf(pepper.difficulty);
    
    if (pepperDiff > prefDiff + 1) {
      return null; // Pepper is much harder than preference - eliminate
    }
    maxScore += 10;
    if (pepperDiff <= prefDiff) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // ============ WEIGHTED SCORING ============

  // Flavor profile matching - ALWAYS score these (sliders always have values)
  maxScore += 30; // 10 each for sweetness, fruitiness, smokiness
  
  // Sweetness scoring
  const sweetDiff = Math.abs(pepper.sweetness - prefs.sweetness);
  score += Math.max(0, 10 - sweetDiff);

  // Fruitiness scoring  
  const fruitDiff = Math.abs(pepper.fruitiness - prefs.fruitiness);
  score += Math.max(0, 10 - fruitDiff);

  // Smokiness scoring
  const smokeDiff = Math.abs(pepper.smokiness - prefs.smokiness);
  score += Math.max(0, 10 - smokeDiff);

  // Use case matching
  if (prefs.useCase.length > 0) {
    maxScore += 15;
    const matchingUses = prefs.useCase.filter((use) =>
      pepper.bestUses.includes(use)
    );
    if (matchingUses.length > 0) {
      // Partial credit based on how many uses match
      score += Math.min(15, (matchingUses.length / prefs.useCase.length) * 15);
    }
  }

  // Cuisine affinity
  if (prefs.cuisineStyle !== "No preference") {
    maxScore += 10;
    if (pepper.cuisineAffinity.includes(prefs.cuisineStyle) || 
        pepper.cuisineAffinity.includes("global")) {
      score += 10;
    }
  }

  // Growth habit match
  if (prefs.growthHabit !== "No preference") {
    maxScore += 10;
    if (pepper.growthHabit === prefs.growthHabit) {
      score += 10;
    }
  }

  // Climate suitability
  if (prefs.climateSuitability !== "No preference") {
    maxScore += 15;
    if (pepper.climateSuitability === prefs.climateSuitability) {
      score += 15;
    } else if (pepper.climateSuitability === "temperate") {
      score += 8; // Temperate is adaptable
    }
  }

  // Bonus for vendor availability (always applies)
  maxScore += 5;
  if (pepper.availableFrom_SeedSow || pepper.availableFrom_WestCoastSeeds) {
    score += 5;
  }

  // Ensure we have a reasonable maxScore even with minimal preferences
  if (maxScore < 35) {
    maxScore = 35; // Minimum baseline from flavor sliders + availability
  }

  return { score, maxScore };
}

// Generate human-readable match reasons
export function pepperReasons(pepper: Pepper, prefs: PepperPreferences): string[] {
  const reasons: string[] = [];

  // Heat level match
  if (prefs.heatCategory !== "No preference") {
    const prefIndex = HEAT_ORDER.indexOf(prefs.heatCategory);
    const pepperIndex = HEAT_ORDER.indexOf(pepper.heatCategory);
    if (prefIndex === pepperIndex) {
      const heatLabels: Record<string, string> = {
        none: "No heat (perfect for heat-sensitive eaters)",
        mild: "Mild heat level",
        medium: "Medium heat - nice kick",
        hot: "Hot and spicy",
        very_hot: "Very hot - serious heat",
        extreme: "Extreme heat - for the brave"
      };
      reasons.push(heatLabels[pepper.heatCategory] || `${pepper.heatCategory} heat level`);
    }
  }

  // Flavor matches
  if (Math.abs(pepper.sweetness - prefs.sweetness) <= 2) {
    if (pepper.sweetness >= 7) reasons.push("Sweet flavor profile");
    else if (pepper.sweetness <= 3) reasons.push("Savory, not sweet");
  }
  if (Math.abs(pepper.fruitiness - prefs.fruitiness) <= 2 && pepper.fruitiness >= 7) {
    reasons.push("Fruity notes");
  }
  if (Math.abs(pepper.smokiness - prefs.smokiness) <= 2 && pepper.smokiness >= 7) {
    reasons.push("Smoky flavor");
  }

  // Use case match
  if (prefs.useCase.length > 0) {
    const matchingUses = prefs.useCase.filter((use) => pepper.bestUses.includes(use));
    if (matchingUses.length > 0) {
      const useLabels: Record<string, string> = {
        fresh_eating: "Great for fresh eating",
        hot_sauce: "Perfect for hot sauce",
        salsa: "Ideal for salsa",
        pickling: "Great for pickling",
        drying: "Excellent for drying",
        stuffing: "Perfect for stuffing",
        fermenting: "Great for fermenting",
        roasting: "Wonderful roasted",
        cooking: "Versatile for cooking"
      };
      reasons.push(useLabels[matchingUses[0]] || `Good for ${matchingUses[0].replace("_", " ")}`);
    }
  }

  // Growing characteristics
  if (pepper.difficulty === "beginner") reasons.push("Easy to grow");
  if (pepper.containerFriendly && prefs.containerFriendly === "Yes") {
    reasons.push("Container friendly");
  }

  // Cuisine affinity
  if (prefs.cuisineStyle !== "No preference" && 
      pepper.cuisineAffinity.includes(prefs.cuisineStyle)) {
    reasons.push(`Perfect for ${prefs.cuisineStyle} cuisine`);
  }

  // Climate
  if (prefs.climateSuitability !== "No preference" && 
      pepper.climateSuitability === prefs.climateSuitability) {
    reasons.push(`Well-suited for ${pepper.climateSuitability} climates`);
  }

  // Availability
  if (pepper.availableFrom_SeedSow || pepper.availableFrom_WestCoastSeeds) {
    reasons.push("Seeds readily available");
  }

  return reasons.slice(0, 4);
}

// Format heat level for display
export function formatHeatLevel(pepper: Pepper): string {
  if (pepper.heatSHU_max === 0) return "No heat";
  if (pepper.heatSHU_max < 1000) return `${pepper.heatSHU_min}-${pepper.heatSHU_max} SHU (Mild)`;
  if (pepper.heatSHU_max < 10000) return `${(pepper.heatSHU_min/1000).toFixed(0)}K-${(pepper.heatSHU_max/1000).toFixed(0)}K SHU (Medium)`;
  if (pepper.heatSHU_max < 100000) return `${(pepper.heatSHU_min/1000).toFixed(0)}K-${(pepper.heatSHU_max/1000).toFixed(0)}K SHU (Hot)`;
  if (pepper.heatSHU_max < 500000) return `${(pepper.heatSHU_min/1000).toFixed(0)}K-${(pepper.heatSHU_max/1000).toFixed(0)}K SHU (Very Hot)`;
  return `${(pepper.heatSHU_min/1000000).toFixed(1)}M-${(pepper.heatSHU_max/1000000).toFixed(1)}M SHU (Extreme)`;
}
