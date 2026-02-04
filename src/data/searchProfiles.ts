// src/data/searchProfiles.ts
// SEO landing page presets for pepper picker

export interface SearchProfile {
  slug: string;
  title: string;
  description: string;
  preset: Partial<{
    heatCategory: string;
    pepperType: string;
    useCase: string[];
    cuisineStyle: string;
    containerFriendly: string;
    difficulty: string;
    climateSuitability: string;
    sweetness: number;
    fruitiness: number;
    smokiness: number;
    growthHabit: string;
  }>;
}

export const searchProfiles: SearchProfile[] = [
  {
    slug: "mild-peppers-for-beginners",
    title: "Best Mild Peppers for Beginners",
    description: "Easy-to-grow mild peppers perfect for new gardeners",
    preset: {
      heatCategory: "mild",
      difficulty: "beginner",
    },
  },
  {
    slug: "hot-sauce-peppers",
    title: "Best Peppers for Hot Sauce",
    description: "Top pepper varieties for making homemade hot sauce",
    preset: {
      useCase: ["hot_sauce"],
      heatCategory: "hot",
    },
  },
  {
    slug: "container-peppers",
    title: "Best Peppers for Containers",
    description: "Compact pepper varieties perfect for pots and small spaces",
    preset: {
      containerFriendly: "Yes",
    },
  },
  {
    slug: "sweet-peppers",
    title: "Best Sweet Peppers",
    description: "Delicious sweet peppers with no heat",
    preset: {
      heatCategory: "none",
      sweetness: 8,
    },
  },
  {
    slug: "mexican-cuisine-peppers",
    title: "Best Peppers for Mexican Cooking",
    description: "Authentic peppers for Mexican and Tex-Mex dishes",
    preset: {
      cuisineStyle: "mexican",
    },
  },
  {
    slug: "asian-cuisine-peppers",
    title: "Best Peppers for Asian Cooking",
    description: "Peppers perfect for Thai, Korean, and Chinese dishes",
    preset: {
      cuisineStyle: "thai",
    },
  },
  {
    slug: "super-hot-peppers",
    title: "World's Hottest Peppers",
    description: "Extreme heat peppers for the brave",
    preset: {
      heatCategory: "extreme",
    },
  },
  {
    slug: "stuffing-peppers",
    title: "Best Peppers for Stuffing",
    description: "Large, thick-walled peppers perfect for stuffing",
    preset: {
      useCase: ["stuffing"],
    },
  },
  {
    slug: "pickling-peppers",
    title: "Best Peppers for Pickling",
    description: "Top varieties for pickled peppers and preserves",
    preset: {
      useCase: ["pickling"],
    },
  },
  {
    slug: "salsa-peppers",
    title: "Best Peppers for Salsa",
    description: "Perfect peppers for fresh and cooked salsas",
    preset: {
      useCase: ["salsa"],
    },
  },
];

export function getProfileBySlug(slug: string): SearchProfile | undefined {
  return searchProfiles.find((p) => p.slug === slug);
}
