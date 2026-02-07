import type { ProductRecommendation } from "../types/growingGuide";

type Props = {
  product: ProductRecommendation;
};

export const ProductCTA = ({ product }: Props) => {
  const hasLink = product.affiliateUrl && product.affiliateUrl !== "#";
  const isHighTicket = product.priceTier === "high";

  return (
    <div className={`rounded-md p-3 flex items-start justify-between gap-3 ${isHighTicket ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink">{product.name}</div>
        <p className="text-xs text-ink/50 mt-0.5">{product.reason}</p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {product.priceRange && (
          <span className="text-xs text-ink/40">{product.priceRange}</span>
        )}
        {hasLink && (
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-medium transition whitespace-nowrap ${isHighTicket ? "text-amber-700 hover:text-amber-900" : "text-pepper-green hover:text-pepper-green/80"}`}
          >
            Shop &rarr;
          </a>
        )}
      </div>
    </div>
  );
};
