import type { GrowingStage as GrowingStageType } from "../types/growingGuide";
import { ProductCTA } from "./ProductCTA";

type Props = {
  stage: GrowingStageType;
  isExpanded: boolean;
  onToggle: () => void;
  varietyName: string;
};

export const GrowingStage = ({ stage, isExpanded, onToggle, varietyName }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-ink/10 overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 p-4 sm:p-5 text-left transition min-h-[48px] touch-manipulation ${
          isExpanded ? "bg-pepper-soft" : "hover:bg-gray-50"
        }`}
      >
        <span className="shrink-0 w-7 h-7 rounded-full bg-pepper text-white text-xs font-bold flex items-center justify-center">
          {stage.stageNumber}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm sm:text-base text-ink">{stage.title}</div>
          <div className="text-xs text-ink/50 mt-0.5">{stage.subtitle}</div>
        </div>
        <span className="text-lg text-ink/30 shrink-0">{isExpanded ? "−" : "+"}</span>
      </button>

      {isExpanded && (
        <div className="px-4 sm:px-5 pb-5 pt-4 border-t border-ink/5">
          {/* Content */}
          <div className="space-y-3 mb-5">
            {stage.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-ink/75 leading-relaxed">{p}</p>
            ))}
          </div>

          {/* Tips */}
          {stage.tips.length > 0 && (
            <div className="mb-5 border-l-2 border-pepper-green pl-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">Tips</h4>
              <ul className="space-y-1.5">
                {stage.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-ink/70 flex gap-2">
                    <span className="shrink-0 text-ink/30">·</span>
                    <span>
                      {tip.text}
                      {tip.isVarietySpecific && (
                        <span className="ml-1.5 text-xs text-pepper/70 italic">
                          — specific to {varietyName}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Products */}
          {stage.products.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-3">What you'll need</h4>
              <div className="space-y-2">
                {stage.products.map((product) => (
                  <ProductCTA key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
