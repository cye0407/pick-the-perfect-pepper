export type GuideTip = {
  text: string;
  isVarietySpecific: boolean;
};

export type ProductRecommendation = {
  id: string;
  category: string;
  name: string;
  reason: string;
  affiliateUrl: string;
  priceRange?: string;
  priceTier?: "low" | "mid" | "high";
  icon: string;
};

export type GrowingStage = {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  paragraphs: string[];
  tips: GuideTip[];
  products: ProductRecommendation[];
};

export type GrowingGuide = {
  varietyName: string;
  stages: GrowingStage[];
};
