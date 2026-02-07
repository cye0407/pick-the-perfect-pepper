import { useState, useEffect } from "react";
import type { Region, Pepper, PepperPreferences } from "../types/pepper";
import affiliateLinks from "../data/affiliateLinks";
import { pepperCrop } from "../crops/pepper";
import { scorePepper, pepperReasons, formatHeatLevel } from "../crops/pepperScoring";
import { runMatching } from "../engine/match";

import type { PepperUseCase } from "../crops/pepperEnums";
import { PEPPER_HEAT_CATEGORIES, PEPPER_CUISINES, PEPPER_DIFFICULTY } from "../crops/pepperEnums";

import { AffiliateCTA } from "./AffiliateCTA";
import { ComparisonView } from "./ComparisonView";
import { TableView } from "./TableView";
import { GrowingGuide } from "./GrowingGuide";

import { renderStars, renderHeat } from "../utils/stars";
import { getProfileBySlug } from "../data/searchProfiles";

function ArticleChips() {
  const chips = [
    { label: "Best Peppers for Hot Sauce", href: "/?profile=hot-sauce-peppers" },
    { label: "Best Peppers for Containers", href: "/?profile=container-peppers" },
    { label: "Mild Peppers for Beginners", href: "/?profile=mild-peppers-for-beginners" },
  ];

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="inline-block px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-sm text-ink no-underline border border-ink/10"
          >
            {c.label}
          </a>
        ))}
      </div>
    </div>
  );
}

const ProducePicker = () => {
  const defaultPreferences = pepperCrop.defaultPreferences;
  const allUseCases = pepperCrop.useCases;
  const pepperData = pepperCrop.items;

  // State
  const [preferences, setPreferences] = useState<PepperPreferences>(defaultPreferences as PepperPreferences);
  const [matchedPeppers, setMatchedPeppers] = useState<Pepper[]>([]);
  const [allScoredPeppers, setAllScoredPeppers] = useState<Pepper[]>([]); // ALL peppers scored without hard filters
  const [selectedPepper, setSelectedPepper] = useState<Pepper | null>(null);

  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedPeppers, setComparedPeppers] = useState<Pepper[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState<Region>("US");
  const [growVariety, setGrowVariety] = useState<Pepper | null>(null);

  // Accordion states
  const [showTopMatches, setShowTopMatches] = useState(false);
  const [showGoodMatches, setShowGoodMatches] = useState(false);

  // Table view state
  const [showTableView, setShowTableView] = useState(false);
  const [isProfileLoad, setIsProfileLoad] = useState(false);

  // Handle checkbox changes for useCase
  const handleUseCaseChange = (use: PepperUseCase, isChecked: boolean) => {
    if (isChecked) {
      setPreferences({
        ...preferences,
        useCase: [...preferences.useCase, use],
      });
    } else {
      setPreferences({
        ...preferences,
        useCase: preferences.useCase.filter((item) => item !== use),
      });
    }
  };

  // Handle all other input changes
  const numericFields = new Set(["sweetness", "fruitiness", "smokiness"]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: numericFields.has(name) ? Number(value) : value,
    }));
  };

  // Reset all preferences
  const resetPreferences = () => {
    setPreferences({ ...defaultPreferences } as PepperPreferences);
    setMatchedPeppers([]);
    setSelectedPepper(null);
    setShowTopMatches(false);
    setShowGoodMatches(false);
    setShowTableView(false);
  };

  // Toggle comparison mode
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (!comparisonMode) {
      setComparedPeppers([]);
      setShowComparison(false);
    }
  };

  // Add or remove pepper from comparison
  const togglePepperComparison = (pepper: Pepper) => {
    if (comparedPeppers.some((p) => p.id === pepper.id)) {
      setComparedPeppers(comparedPeppers.filter((p) => p.id !== pepper.id));
    } else {
      if (comparedPeppers.length < 2) {
        setComparedPeppers([...comparedPeppers, pepper]);
      } else {
        setComparedPeppers([comparedPeppers[1], pepper]);
      }
    }
  };

  const isInComparison = (pepperId: Pepper["id"]) => {
    return comparedPeppers.some((p) => p.id === pepperId);
  };

  // Soft-only scorer for Browse All (no hard filters)
  const scorePepperSoftOnly = (pepper: Pepper, prefs: PepperPreferences): { score: number; maxScore: number } | null => {
    let score = 0;
    let maxScore = 30; // baseline from flavor sliders
    
    // Flavor profile matching
    const sweetDiff = Math.abs(pepper.sweetness - prefs.sweetness);
    score += Math.max(0, 10 - sweetDiff);
    const fruitDiff = Math.abs(pepper.fruitiness - prefs.fruitiness);
    score += Math.max(0, 10 - fruitDiff);
    const smokeDiff = Math.abs(pepper.smokiness - prefs.smokiness);
    score += Math.max(0, 10 - smokeDiff);
    
    // Heat category (soft scoring)
    if (prefs.heatCategory !== "No preference") {
      const heatOrder = ["none", "mild", "medium", "hot", "very_hot", "extreme"];
      const prefIdx = heatOrder.indexOf(prefs.heatCategory);
      const pepIdx = heatOrder.indexOf(pepper.heatCategory);
      const diff = Math.abs(prefIdx - pepIdx);
      maxScore += 15;
      score += Math.max(0, 15 - diff * 5);
    }
    
    // Use case matching
    if (prefs.useCase.length > 0) {
      maxScore += 15;
      const matchingUses = prefs.useCase.filter((use) => pepper.bestUses.includes(use));
      if (matchingUses.length > 0) {
        score += Math.min(15, (matchingUses.length / prefs.useCase.length) * 15);
      }
    }
    
    // Container friendly bonus
    if (prefs.containerFriendly === "Yes" && pepper.containerFriendly) {
      maxScore += 10;
      score += 10;
    }
    
    // Difficulty bonus
    if (prefs.difficulty !== "No preference") {
      const diffOrder = ["beginner", "intermediate", "advanced"];
      const prefDiff = diffOrder.indexOf(prefs.difficulty);
      const pepDiff = diffOrder.indexOf(pepper.difficulty);
      maxScore += 10;
      if (pepDiff <= prefDiff) score += 10;
      else if (pepDiff === prefDiff + 1) score += 5;
    }
    
    // Cuisine affinity
    if (prefs.cuisineStyle !== "No preference") {
      maxScore += 10;
      if (pepper.cuisineAffinity.includes(prefs.cuisineStyle) || pepper.cuisineAffinity.includes("global")) {
        score += 10;
      }
    }
    
    // Vendor availability bonus
    maxScore += 5;
    if (pepper.availableFrom_SeedSow || pepper.availableFrom_WestCoastSeeds) {
      score += 5;
    }
    
    return { score, maxScore };
  };

  const findMatches = () => {
    // Run with hard filters for Top/Good matches
    const sortedPeppers = runMatching({
      items: pepperData as Pepper[],
      preferences,
      scoreItem: scorePepper,
      getReasons: pepperReasons,
    });

    // Run ALL peppers with soft scoring only (for Browse All table)
    const allScored = runMatching({
      items: pepperData as Pepper[],
      preferences,
      scoreItem: scorePepperSoftOnly,
      getReasons: pepperReasons,
    });

    setMatchedPeppers(sortedPeppers as Pepper[]);
    setAllScoredPeppers(allScored as Pepper[]);
    setSelectedPepper(sortedPeppers[0] ?? null);
    setShowTopMatches(false);
    setShowGoodMatches(false);
    setShowTableView(false);

    if (comparisonMode) {
      setComparedPeppers([]);
      setShowComparison(false);
    }
  };

  // Load profile from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const profileSlug = urlParams.get("profile");

    if (profileSlug) {
      const profile = getProfileBySlug(profileSlug);
      if (profile && profile.preset) {
        const newPrefs = {
          ...defaultPreferences,
          ...profile.preset,
        } as PepperPreferences;

        setIsProfileLoad(true);
        setPreferences(newPrefs);
      }
    }
  }, []);

  // Auto-search for profile loads
  useEffect(() => {
    if (isProfileLoad) {
      findMatches();
      setIsProfileLoad(false);
    }
  }, [preferences]);

  // Categorize matches by tier
  const topMatches = matchedPeppers.filter((p) => (p as Pepper & { matchTier?: string }).matchTier === "Top match");
  const goodMatches = matchedPeppers.filter((p) => (p as Pepper & { matchTier?: string }).matchTier === "Good match");

  // Match badge styling
  const getMatchBadgeClass = (tier: string) => {
    switch (tier) {
      case "Top match":
        return "bg-pepper-green text-white border border-pepper-green";
      case "Good match":
        return "bg-heat-medium text-ink border border-heat-medium";
      case "Wildcard":
        return "bg-heat-hot text-white border border-heat-hot";
      default:
        return "bg-white text-ink border border-ink/20";
    }
  };

  // Render pepper card
  const renderPepperCard = (pepper: Pepper) => {
    const pepperWithTier = pepper as Pepper & { matchTier?: string };
    return (
      <div
        key={pepper.id}
        onClick={() => {
          setSelectedPepper(pepper);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition duration-200 active:scale-98 ${
          selectedPepper?.id === pepper.id
            ? "bg-pepper-green/10 border-pepper-green/50 shadow-md"
            : "bg-white border-ink/10 hover:border-pepper-green/30 hover:shadow-md"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <h4 className="font-semibold text-ink text-base sm:text-lg">{pepper.name}</h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            {comparisonMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePepperComparison(pepper);
                }}
                className={`text-xs sm:text-sm px-3 py-1.5 rounded-full min-h-[32px] touch-manipulation ${
                  isInComparison(pepper.id)
                    ? "bg-pepper-red text-white"
                    : "bg-gray-200 text-ink hover:bg-gray-300 active:bg-gray-400"
                }`}
              >
                {isInComparison(pepper.id) ? "Remove" : "Compare"}
              </button>
            )}
            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getMatchBadgeClass(pepperWithTier.matchTier ?? "")}`}>
              {pepperWithTier.matchTier}
            </span>
          </div>
        </div>
        <p className="text-sm text-ink/70 line-clamp-2 mb-2">{pepper.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-ink/60">
          <span>{renderHeat(pepper.heatCategory)} {pepper.heatCategory.replace("_", " ")}</span>
          <span>•</span>
          <span>{pepper.daysToMaturity_min}-{pepper.daysToMaturity_max} days</span>
          <span>•</span>
          <span className="hidden sm:inline">{pepper.growthHabit}</span>
        </div>
      </div>
    );
  };

  // ─── Grow Mode ───
  if (growVariety) {
    return (
      <div className="w-full max-w-4xl mx-auto px-3 py-4 sm:p-6 bg-gray-100 min-h-screen">
        <button
          onClick={() => setGrowVariety(null)}
          className="mb-4 text-sm font-medium text-pepper-red hover:text-pepper-red/80 transition flex items-center gap-1"
        >
          &larr; Back to picker results
        </button>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-4 border-t-4 border-pepper-red">
          <h1 className="text-xl sm:text-2xl font-bold text-ink mb-4">
            How to Grow {growVariety.name}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
            <div>
              <span className="text-ink/50 block text-xs">Heat Level</span>
              <span className="font-medium text-ink capitalize">{renderHeat(growVariety.heatCategory)} {growVariety.heatCategory.replace("_", " ")}</span>
            </div>
            <div>
              <span className="text-ink/50 block text-xs">Growth Habit</span>
              <span className="font-medium text-ink capitalize">{growVariety.growthHabit}</span>
            </div>
            <div>
              <span className="text-ink/50 block text-xs">Days to Maturity</span>
              <span className="font-medium text-ink">{growVariety.daysToMaturity_min}-{growVariety.daysToMaturity_max}</span>
            </div>
            <div>
              <span className="text-ink/50 block text-xs">Difficulty</span>
              <span className="font-medium text-ink capitalize">{growVariety.difficulty}</span>
            </div>
            <div>
              <span className="text-ink/50 block text-xs">Container Friendly</span>
              <span className="font-medium text-ink">{growVariety.containerFriendly ? "Yes" : "No"}</span>
            </div>
            <div>
              <span className="text-ink/50 block text-xs">Indoor Suitable</span>
              <span className="font-medium text-ink">{growVariety.indoorSuitable ? "Yes" : "No"}</span>
            </div>
          </div>

          <AffiliateCTA
            item={growVariety}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            affiliateLinks={affiliateLinks}
            preferences={preferences}
          />
        </div>

        <GrowingGuide variety={growVariety} />

        <button
          onClick={() => { setGrowVariety(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="mt-4 text-sm font-medium text-pepper-red hover:text-pepper-red/80 transition flex items-center gap-1"
        >
          &larr; Back to picker results
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 py-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-t-4 border-pepper-red">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <span className="text-3xl mr-2">🌶️</span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-ink">Pick the Perfect Pepper</h1>
        </div>

        {/* Comparison mode toggle */}
        {matchedPeppers.length > 0 && (
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:space-x-2 bg-gray-100 p-3 rounded-md w-full sm:w-auto">
              <span className="text-sm text-ink">Enable comparison mode:</span>
              <button
                onClick={toggleComparisonMode}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all min-h-[40px] touch-manipulation w-full sm:w-auto ${
                  comparisonMode
                    ? "bg-pepper-red text-white active:bg-red-700"
                    : "bg-gray-200 text-ink/70 hover:bg-gray-300 active:bg-gray-400"
                }`}
              >
                {comparisonMode ? "Comparison On" : "Comparison Off"}
              </button>

              {comparisonMode && comparedPeppers.length > 0 && (
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-sm text-pepper-red hover:text-red-800 active:text-red-900 font-medium min-h-[40px] touch-manipulation"
                >
                  {showComparison ? "Hide comparison" : `Show comparison (${comparedPeppers.length}/2)`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Comparison view */}
        {comparisonMode && showComparison && (
          <div className="mb-4 sm:mb-6">
            <ComparisonView
              comparedPeppers={comparedPeppers}
              setComparedPeppers={setComparedPeppers}
              setShowComparison={setShowComparison}
              renderStars={renderStars}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Preferences Panel */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-pepper-red/20">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-semibold text-pepper-red border-b border-pepper-red/30 pb-2">Your Preferences</h2>
              <button
                onClick={resetPreferences}
                className="text-sm bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-ink py-2 px-4 rounded-md transition duration-200 min-h-[40px] touch-manipulation"
              >
                Reset All
              </button>
            </div>

            {/* Heat Level - Primary filter */}
            <div className="mb-4 sm:mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
              <label className="block text-sm font-medium mb-2 text-ink">
                Heat Level Preference
                <select
                  name="heatCategory"
                  value={preferences.heatCategory}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 text-sm sm:text-base border border-red-300 rounded-md focus:ring-2 focus:ring-pepper-red focus:border-pepper-red bg-white min-h-[44px] touch-manipulation"
                >
                  <option value="No preference">No preference</option>
                  {PEPPER_HEAT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </label>
              <p className="text-xs text-ink/70 mt-2">
                This is the most important filter for finding your perfect pepper
              </p>
            </div>

            {/* Use Cases */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-sm font-medium mb-2 text-ink">Primary Uses (select multiple)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-ink/20 rounded-md p-3 bg-white">
                {allUseCases.map((use: PepperUseCase) => {
                  const u = use;
                  return (
                    <div key={u} className="flex items-center min-h-[36px]">
                      <input
                        type="checkbox"
                        id={`use-${u}`}
                        checked={preferences.useCase.includes(u)}
                        onChange={(e) => handleUseCaseChange(u, e.target.checked)}
                        className="mr-3 rounded text-pepper-red w-5 h-5 flex-shrink-0 cursor-pointer"
                      />
                      <label htmlFor={`use-${u}`} className="text-sm cursor-pointer flex-1 text-ink capitalize">
                        {u.replace(/_/g, " ")}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flavor Sliders */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-sm font-medium mb-2 text-ink">
                Sweetness (1-10)
                <div className="flex items-center my-3">
                  <span className="mr-2 text-xs w-16 sm:w-20 text-right flex-shrink-0">Less sweet</span>
                  <div className="w-full px-1">
                    <input
                      type="range"
                      name="sweetness"
                      min="1"
                      max="10"
                      value={preferences.sweetness}
                      onChange={handleChange}
                      className="w-full h-2 accent-pepper-red cursor-pointer touch-manipulation"
                      style={{ minHeight: "32px" }}
                    />
                  </div>
                  <span className="ml-2 text-xs w-16 sm:w-20 flex-shrink-0">Very sweet</span>
                </div>
                <div className="text-center text-base font-medium">{preferences.sweetness}/10</div>
              </label>
            </div>

            <div className="mb-4 sm:mb-5">
              <label className="block text-sm font-medium mb-2 text-ink">
                Fruitiness (1-10)
                <div className="flex items-center my-3">
                  <span className="mr-2 text-xs w-16 sm:w-20 text-right flex-shrink-0">Earthy</span>
                  <div className="w-full px-1">
                    <input
                      type="range"
                      name="fruitiness"
                      min="1"
                      max="10"
                      value={preferences.fruitiness}
                      onChange={handleChange}
                      className="w-full h-2 accent-pepper-red cursor-pointer touch-manipulation"
                      style={{ minHeight: "32px" }}
                    />
                  </div>
                  <span className="ml-2 text-xs w-16 sm:w-20 flex-shrink-0">Very fruity</span>
                </div>
                <div className="text-center text-base font-medium">{preferences.fruitiness}/10</div>
              </label>
            </div>

            <div className="mb-4 sm:mb-5">
              <label className="block text-sm font-medium mb-2 text-ink">
                Smokiness (1-10)
                <div className="flex items-center my-3">
                  <span className="mr-2 text-xs w-16 sm:w-20 text-right flex-shrink-0">Clean</span>
                  <div className="w-full px-1">
                    <input
                      type="range"
                      name="smokiness"
                      min="1"
                      max="10"
                      value={preferences.smokiness}
                      onChange={handleChange}
                      className="w-full h-2 accent-pepper-red cursor-pointer touch-manipulation"
                      style={{ minHeight: "32px" }}
                    />
                  </div>
                  <span className="ml-2 text-xs w-16 sm:w-20 flex-shrink-0">Very smoky</span>
                </div>
                <div className="text-center text-base font-medium">{preferences.smokiness}/10</div>
              </label>
            </div>

            {/* Cuisine Style */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-sm font-medium mb-2 text-ink">
                Cuisine Style
                <select
                  name="cuisineStyle"
                  value={preferences.cuisineStyle}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 text-sm sm:text-base border border-ink/20 rounded-md focus:ring-2 focus:ring-pepper-red focus:border-pepper-red bg-white min-h-[44px] touch-manipulation"
                >
                  <option value="No preference">No preference</option>
                  {PEPPER_CUISINES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Container Friendly */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-sm font-medium mb-2 text-ink">
                Container Growing
                <select
                  name="containerFriendly"
                  value={preferences.containerFriendly}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 text-sm sm:text-base border border-ink/20 rounded-md focus:ring-2 focus:ring-pepper-red focus:border-pepper-red bg-white min-h-[44px] touch-manipulation"
                >
                  <option value="No preference">No preference</option>
                  <option value="Yes">Must be container-friendly</option>
                </select>
              </label>
            </div>

            {/* Difficulty */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium mb-2 text-ink">
                Experience Level
                <select
                  name="difficulty"
                  value={preferences.difficulty}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 text-sm sm:text-base border border-ink/20 rounded-md focus:ring-2 focus:ring-pepper-red focus:border-pepper-red bg-white min-h-[44px] touch-manipulation"
                >
                  <option value="No preference">No preference</option>
                  {PEPPER_DIFFICULTY.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </label>
              <p className="text-xs text-ink/70 mt-1">
                Beginner varieties are forgiving and great for first-time growers
              </p>
            </div>

            <button
              onClick={findMatches}
              className="w-full bg-pepper-red text-white p-4 rounded-md hover:bg-red-700 active:bg-red-800 transition duration-200 shadow-md font-medium text-base sm:text-lg min-h-[48px] touch-manipulation"
            >
              🌶️ Find My Perfect Pepper
            </button>
          </div>

          {/* Results Panel */}
          <div>
            {selectedPepper ? (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6 border border-ink/10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-ink">{selectedPepper.name}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {comparisonMode && (
                      <button
                        onClick={() => togglePepperComparison(selectedPepper)}
                        className={`text-xs sm:text-sm px-3 py-1.5 rounded-full min-h-[32px] touch-manipulation ${
                          isInComparison(selectedPepper.id)
                            ? "bg-pepper-red text-white"
                            : "bg-gray-200 text-ink hover:bg-gray-300 active:bg-gray-400"
                        }`}
                      >
                        {isInComparison(selectedPepper.id) ? "Remove" : "Compare"}
                      </button>
                    )}
                    <span className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${getMatchBadgeClass((selectedPepper as Pepper & { matchTier?: string }).matchTier ?? "")}`}>
                      {(selectedPepper as Pepper & { matchTier?: string }).matchTier}
                    </span>
                  </div>
                </div>

                <p className="text-sm italic mb-4 text-ink/70 leading-relaxed">{selectedPepper.description}</p>

                {/* Why this match */}
                {(selectedPepper as Pepper & { matchReasons?: string[] }).matchReasons &&
                  (selectedPepper as Pepper & { matchReasons?: string[] }).matchReasons!.length > 0 && (
                    <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-md">
                      <h4 className="text-sm font-semibold text-green-900 mb-2">Why this match?</h4>
                      <ul className="text-sm space-y-1.5">
                        {(selectedPepper as Pepper & { matchReasons?: string[] }).matchReasons!.map((reason, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-ink mr-2 flex-shrink-0">•</span>
                            <span className="text-ink">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Heat Level:</span>
                    <div className="text-ink">{renderHeat(selectedPepper.heatCategory)} {formatHeatLevel(selectedPepper)}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Sweetness:</span>
                    <div className="text-pepper-red">{renderStars(selectedPepper.sweetness)} <span className="text-ink/60 text-sm">({selectedPepper.sweetness}/10)</span></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Fruitiness:</span>
                    <div className="text-pepper-red">{renderStars(selectedPepper.fruitiness)} <span className="text-ink/60 text-sm">({selectedPepper.fruitiness}/10)</span></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Smokiness:</span>
                    <div className="text-pepper-red">{renderStars(selectedPepper.smokiness)} <span className="text-ink/60 text-sm">({selectedPepper.smokiness}/10)</span></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Type:</span>
                    <div className="text-ink text-sm capitalize">{selectedPepper.type.replace(/_/g, " ")}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Growth Habit:</span>
                    <div className="text-ink text-sm capitalize">{selectedPepper.growthHabit}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Days to Maturity:</span>
                    <div className="text-ink text-sm">{selectedPepper.daysToMaturity_min}-{selectedPepper.daysToMaturity_max} days</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Difficulty:</span>
                    <div className="text-ink text-sm capitalize">{selectedPepper.difficulty}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-ink block mb-1">Container Friendly:</span>
                    <div className="text-ink text-sm">{selectedPepper.containerFriendly ? "✅ Yes" : "❌ No"}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-sm font-medium text-ink block mb-1">Best Uses:</span>
                    <div className="text-ink text-sm capitalize">{selectedPepper.bestUses.join(", ").replace(/_/g, " ")}</div>
                  </div>
                </div>

                <AffiliateCTA
                  item={selectedPepper}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  affiliateLinks={affiliateLinks}
                  preferences={preferences}
                />

                <button
                  onClick={() => { setGrowVariety(selectedPepper); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="w-full mt-4 bg-pepper-red text-white p-3 sm:p-4 rounded-md font-semibold text-sm sm:text-base hover:bg-pepper-red/90 active:bg-pepper-red/80 transition min-h-[48px] touch-manipulation"
                >
                  🌶️ Grow This Pepper — Full Growing Guide
                </button>

                <div className="text-center text-xs text-ink/60 mt-4 px-2 sm:px-4">
                  Some links may be affiliate links. If you buy through them, I may earn a small commission at no extra cost to you.
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-ink/10 text-center">
                <p className="text-ink/60 text-base sm:text-lg">Click "Find My Perfect Pepper" to see your matches!</p>
              </div>
            )}

            {/* Top Matches Accordion */}
            {topMatches.length > 1 && (
              <div className="mt-3 sm:mt-4">
                <button
                  onClick={() => setShowTopMatches(!showTopMatches)}
                  className="w-full bg-pepper-green text-white p-3 sm:p-4 rounded-md font-medium flex items-center justify-between hover:bg-pepper-green/90 active:bg-pepper-green/80 transition min-h-[48px] touch-manipulation"
                >
                  <span className="text-sm sm:text-base">Top Matches ({topMatches.length - 1} more)</span>
                  <span className="text-xl sm:text-2xl">{showTopMatches ? "−" : "+"}</span>
                </button>
                {showTopMatches && (
                  <div className="mt-3 space-y-2 sm:space-y-3">
                    {topMatches.slice(1).map(renderPepperCard)}
                  </div>
                )}
              </div>
            )}

            {/* Good Matches Accordion */}
            {goodMatches.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <button
                  onClick={() => setShowGoodMatches(!showGoodMatches)}
                  className="w-full bg-heat-medium text-ink p-3 sm:p-4 rounded-md font-medium flex items-center justify-between hover:bg-heat-medium/90 active:bg-heat-medium/80 transition min-h-[48px] touch-manipulation"
                >
                  <span className="text-sm sm:text-base">Good Matches ({goodMatches.length})</span>
                  <span className="text-xl sm:text-2xl">{showGoodMatches ? "−" : "+"}</span>
                </button>
                {showGoodMatches && (
                  <div className="mt-3 space-y-2 sm:space-y-3">
                    {goodMatches.map(renderPepperCard)}
                  </div>
                )}
              </div>
            )}

            {/* Browse All Button - always visible */}
            <div className="mt-3 sm:mt-4">
              <button
                onClick={() => {
                  if (allScoredPeppers.length === 0) {
                    // If no search has been run, run it first to score all peppers
                    findMatches();
                  }
                  setShowTableView(!showTableView);
                }}
                className="w-full bg-white text-ink p-3 sm:p-4 rounded-md font-medium flex items-center justify-center gap-2 border border-ink/20 hover:bg-gray-50 active:bg-gray-100 transition min-h-[48px] touch-manipulation"
              >
                <span>📊</span>
                <span className="text-sm sm:text-base">{showTableView ? "Hide" : `Browse All ${allScoredPeppers.length > 0 ? allScoredPeppers.length : pepperData.length} Varieties (Table View)`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ArticleChips />

      {/* Table View - shows ALL varieties sorted by relevance */}
      {showTableView && allScoredPeppers.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
          <TableView
            peppers={allScoredPeppers}
            selectedPepper={selectedPepper}
            setSelectedPepper={setSelectedPepper}
            setShowTableView={setShowTableView}
            renderStars={renderStars}
            getMatchBadgeClass={getMatchBadgeClass}
          />
        </div>
      )}

      {/* Legal Footer */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mt-4 sm:mt-6 border border-ink/10">
        <p className="text-xs text-ink/60 text-center mb-3 leading-relaxed">
          <strong>Disclaimer:</strong> This tool provides general pepper recommendations for selecting the right variety for your needs.
          Actual results may vary based on your specific growing conditions, climate, and care practices.
          Variety descriptions are approximations. Always research varieties for your region before purchasing.
        </p>
        <p className="text-center text-xs text-ink/50">
          © {new Date().getFullYear()} Pick The Perfect Pepper. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ProducePicker;
