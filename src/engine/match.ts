// src/engine/match.ts
import type { Pepper, PepperPreferences } from "../types/pepper";

export function runMatching({ 
  items, 
  preferences, 
  scoreItem, 
  getReasons 
}: {
  items: Pepper[];
  preferences: PepperPreferences;
  scoreItem: (item: Pepper, prefs: PepperPreferences) => { score: number; maxScore: number } | null;
  getReasons: (item: Pepper, prefs: PepperPreferences) => string[];
}) {
  const scoredItems = items
    .map(item => {
      const scoreResult = scoreItem(item, preferences);
      
      if (scoreResult === null) {
        return null;
      }
      
      const { score, maxScore } = scoreResult;
      const percentage = (score / maxScore) * 100;
      
      let matchTier;
      if (percentage >= 80) matchTier = "Top match";
      else if (percentage >= 65) matchTier = "Good match";
      else matchTier = "Wildcard";
      
      return {
        ...item,
        matchScore: score,
        matchPercentage: percentage,
        matchTier,
        matchReasons: getReasons(item, preferences)
      };
    })
    .filter((item): item is (Pepper & { matchScore: number; matchPercentage: number; matchTier: string; matchReasons: string[] }) => item !== null)
    .sort((a, b) => b.matchScore - a.matchScore);
  
  return scoredItems;
}
