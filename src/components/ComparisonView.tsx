import React from "react";
import type { Pepper } from "../types/pepper";
import { renderHeat } from "../utils/stars";

type ComparisonViewProps = {
  comparedPeppers: Pepper[];
  setComparedPeppers: React.Dispatch<React.SetStateAction<Pepper[]>>;
  setShowComparison: React.Dispatch<React.SetStateAction<boolean>>;
  renderStars: (rating: number) => string;
};

export function ComparisonView({
  comparedPeppers,
  setComparedPeppers,
  setShowComparison,
  renderStars,
}: ComparisonViewProps) {
  if (comparedPeppers.length < 2) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-ink">Select 2 peppers to compare</p>
        <p className="text-sm text-ink/60 mt-1">
          {comparedPeppers.length}/2 selected
        </p>
      </div>
    );
  }

  const [pepper1, pepper2] = comparedPeppers;

  return (
    <div className="bg-white rounded-lg shadow-md border border-ink/10 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-pepper-green/10 border-b border-ink/10">
        <h3 className="font-bold text-lg text-ink">Side-by-Side Comparison</h3>
        <button
          onClick={() => {
            setComparedPeppers([]);
            setShowComparison(false);
          }}
          className="text-sm text-pepper-red hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left font-medium text-ink/70">Attribute</th>
              <th className="p-3 text-left font-semibold text-ink">{pepper1.name}</th>
              <th className="p-3 text-left font-semibold text-ink">{pepper2.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            <tr>
              <td className="p-3 font-medium text-ink/70">Heat Level</td>
              <td className="p-3">{renderHeat(pepper1.heatCategory)} {pepper1.heatCategory}</td>
              <td className="p-3">{renderHeat(pepper2.heatCategory)} {pepper2.heatCategory}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">SHU Range</td>
              <td className="p-3">{pepper1.heatSHU_min.toLocaleString()} - {pepper1.heatSHU_max.toLocaleString()}</td>
              <td className="p-3">{pepper2.heatSHU_min.toLocaleString()} - {pepper2.heatSHU_max.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Sweetness</td>
              <td className="p-3 text-pepper-red">{renderStars(pepper1.sweetness)} ({pepper1.sweetness}/10)</td>
              <td className="p-3 text-pepper-red">{renderStars(pepper2.sweetness)} ({pepper2.sweetness}/10)</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Fruitiness</td>
              <td className="p-3 text-pepper-red">{renderStars(pepper1.fruitiness)} ({pepper1.fruitiness}/10)</td>
              <td className="p-3 text-pepper-red">{renderStars(pepper2.fruitiness)} ({pepper2.fruitiness}/10)</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Smokiness</td>
              <td className="p-3 text-pepper-red">{renderStars(pepper1.smokiness)} ({pepper1.smokiness}/10)</td>
              <td className="p-3 text-pepper-red">{renderStars(pepper2.smokiness)} ({pepper2.smokiness}/10)</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Type</td>
              <td className="p-3">{pepper1.type.replace("_", " ")}</td>
              <td className="p-3">{pepper2.type.replace("_", " ")}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Growth Habit</td>
              <td className="p-3">{pepper1.growthHabit}</td>
              <td className="p-3">{pepper2.growthHabit}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Days to Maturity</td>
              <td className="p-3">{pepper1.daysToMaturity_min}-{pepper1.daysToMaturity_max}</td>
              <td className="p-3">{pepper2.daysToMaturity_min}-{pepper2.daysToMaturity_max}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Difficulty</td>
              <td className="p-3 capitalize">{pepper1.difficulty}</td>
              <td className="p-3 capitalize">{pepper2.difficulty}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Container Friendly</td>
              <td className="p-3">{pepper1.containerFriendly ? "✅ Yes" : "❌ No"}</td>
              <td className="p-3">{pepper2.containerFriendly ? "✅ Yes" : "❌ No"}</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-ink/70">Best Uses</td>
              <td className="p-3">{pepper1.bestUses.join(", ").replace(/_/g, " ")}</td>
              <td className="p-3">{pepper2.bestUses.join(", ").replace(/_/g, " ")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
