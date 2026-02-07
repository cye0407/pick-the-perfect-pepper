import { useState, useMemo } from "react";
import type { Pepper } from "../types/pepper";
import { generatePepperGuide } from "../data/growingGuide";
import { GrowingStage } from "./GrowingStage";

type Props = {
  variety: Pepper;
};

export const GrowingGuide = ({ variety }: Props) => {
  const guide = useMemo(() => generatePepperGuide(variety), [variety]);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set([guide.stages[0]?.id])
  );

  const toggleStage = (id: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allExpanded = expandedStages.size === guide.stages.length;
  const toggleAll = () => {
    if (allExpanded) {
      setExpandedStages(new Set());
    } else {
      setExpandedStages(new Set(guide.stages.map((s) => s.id)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-ink">
          Seed to Harvest
        </h2>
        <button
          onClick={toggleAll}
          className="text-xs text-ink/50 hover:text-ink/70 transition px-2 py-1"
        >
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <div className="space-y-2">
        {guide.stages.map((stage) => (
          <GrowingStage
            key={stage.id}
            stage={stage}
            isExpanded={expandedStages.has(stage.id)}
            onToggle={() => toggleStage(stage.id)}
            varietyName={guide.varietyName}
          />
        ))}
      </div>
    </div>
  );
};
