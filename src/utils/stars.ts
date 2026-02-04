// src/utils/stars.ts
export function renderStars(rating: number): string {
  const filled = Math.round(rating / 2);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

// Render heat level as fire emojis
export function renderHeat(heatCategory: string): string {
  switch (heatCategory) {
    case "none": return "🌱";
    case "mild": return "🌶️";
    case "medium": return "🌶️🌶️";
    case "hot": return "🌶️🌶️🌶️";
    case "very_hot": return "🌶️🌶️🌶️🌶️";
    case "extreme": return "🌶️🌶️🌶️🌶️🌶️";
    default: return "";
  }
}
