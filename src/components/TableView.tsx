import React from "react";
import type { Pepper } from "../types/pepper";
import { renderHeat } from "../utils/stars";

type TableViewProps = {
  peppers: Pepper[];
  selectedPepper: Pepper | null;
  setSelectedPepper: React.Dispatch<React.SetStateAction<Pepper | null>>;
  setShowTableView: React.Dispatch<React.SetStateAction<boolean>>;
  renderStars: (rating: number) => string;
  getMatchBadgeClass: (tier: string) => string;
};

export function TableView({
  peppers,
  selectedPepper,
  setSelectedPepper,
  setShowTableView,
  renderStars,
  getMatchBadgeClass,
}: TableViewProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-ink">All Varieties ({peppers.length})</h3>
        <button
          onClick={() => setShowTableView(false)}
          className="text-sm text-pepper-red hover:underline"
        >
          Close Table
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-ink/20">
              <th className="p-3 text-left font-medium text-ink/70">Name</th>
              <th className="p-3 text-left font-medium text-ink/70">Heat</th>
              <th className="p-3 text-left font-medium text-ink/70">Type</th>
              <th className="p-3 text-left font-medium text-ink/70">Sweet</th>
              <th className="p-3 text-left font-medium text-ink/70">Difficulty</th>
              <th className="p-3 text-left font-medium text-ink/70">Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {peppers.map((pepper) => (
              <tr
                key={pepper.id}
                onClick={() => {
                  setSelectedPepper(pepper);
                  setShowTableView(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`cursor-pointer hover:bg-pepper-green/5 transition ${
                  selectedPepper?.id === pepper.id ? "bg-pepper-green/10" : ""
                }`}
              >
                <td className="p-3 font-medium text-ink">{pepper.name}</td>
                <td className="p-3">
                  {renderHeat(pepper.heatCategory)}{" "}
                  <span className="text-ink/60 capitalize">{pepper.heatCategory.replace("_", " ")}</span>
                </td>
                <td className="p-3 capitalize text-ink/70">{pepper.type.replace("_", " ")}</td>
                <td className="p-3 text-pepper-red">{renderStars(pepper.sweetness)}</td>
                <td className="p-3 capitalize text-ink/70">{pepper.difficulty}</td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getMatchBadgeClass(
                      (pepper as Pepper & { matchTier?: string }).matchTier || ""
                    )}`}
                  >
                    {(pepper as Pepper & { matchTier?: string }).matchTier || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
