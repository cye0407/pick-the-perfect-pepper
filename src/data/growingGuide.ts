import type { Pepper } from "../types/pepper";
import type { GrowingGuide, GrowingStage } from "../types/growingGuide";
import { getProduct } from "./growingProducts";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const isCompact = (p: Pepper) => p.growthHabit === "compact";

const isTall = (p: Pepper) => p.growthHabit === "tall";

const isSuperhot = (p: Pepper) =>
  p.heatCategory === "extreme" || p.heatCategory === "very_hot";

const containerSize = (p: Pepper): string => {
  if (p.minPotLiters === null) return "5 gallon (19 L)";
  if (p.minPotLiters <= 10) return `${p.minPotLiters} L (${Math.ceil(p.minPotLiters / 3.8)} gallon)`;
  return `${p.minPotLiters} L (${Math.ceil(p.minPotLiters / 3.8)} gallon)`;
};

const spacing = (p: Pepper): string => {
  if (isCompact(p)) return "12-18 inches (30-45 cm)";
  if (isTall(p)) return "24-30 inches (60-75 cm)";
  return "18-24 inches (45-60 cm)"; // bushy
};

const avgMaturity = (p: Pepper): number =>
  Math.round((p.daysToMaturity_min + p.daysToMaturity_max) / 2);

const hasBestUse = (p: Pepper, use: string) =>
  p.bestUses.some((u) => u.toLowerCase().includes(use.toLowerCase()));

// ──────────────────────────────────────────────
// Stage 1: Seed Starting
// ──────────────────────────────────────────────

function generateSeedStarting(p: Pepper): GrowingStage {
  const weeksIndoor = avgMaturity(p) > 90 ? "10-12" : "8-10";
  const paragraphs: string[] = [];
  const tips = [];

  paragraphs.push(
    `Peppers need a long, warm start indoors. Plan to start ${p.name} seeds ${weeksIndoor} weeks before your last expected frost date. In most climates, that means starting between late January and mid-March depending on your region.`
  );

  paragraphs.push(
    `Plant seeds 1/4 inch (6 mm) deep in a quality seed starting mix. Unlike many vegetables, peppers demand warm soil for germination — 80-85°F (27-29°C) is ideal. A seedling heat mat is essential, not optional, for peppers. At proper temperatures, expect germination in 7-14 days.`
  );

  if (isSuperhot(p)) {
    paragraphs.push(
      `Superhot varieties like ${p.name} are notoriously slow germinators. Don't be discouraged if nothing happens for 2-4 weeks — some superhot seeds can take up to 6 weeks to sprout. Keep the heat mat running and the soil consistently moist. Patience is key with these varieties.`
    );
  }

  paragraphs.push(
    `Once seedlings emerge, they need 14-16 hours of strong light per day. A sunny south-facing window rarely provides enough — seedlings will get tall and leggy. A grow light placed 2-4 inches above the seedlings produces stronger, stockier transplants that perform much better in the garden.`
  );

  tips.push({ text: "Plant seeds 1/4 inch deep in moist seed-starting mix.", isVarietySpecific: false });
  tips.push({ text: "Use a heat mat — peppers need 80-85°F soil for germination.", isVarietySpecific: false });
  tips.push({ text: "Provide 14-16 hours of light per day once seedlings emerge.", isVarietySpecific: false });

  if (p.difficulty === "beginner") {
    tips.push({ text: `${p.name} is beginner-friendly and germinates more reliably than many peppers.`, isVarietySpecific: true });
  }

  if (isSuperhot(p)) {
    tips.push({ text: `${p.name} can take 2-6 weeks to germinate — this is normal for superhots.`, isVarietySpecific: true });
  }

  if (avgMaturity(p) > 100) {
    tips.push({ text: `Start early — ${p.name} needs ${p.daysToMaturity_min}-${p.daysToMaturity_max} days to mature.`, isVarietySpecific: true });
  }

  const products = [
    getProduct("seedStartingTray", `Start ${p.name} seeds in individual cells for easy transplanting.`),
    getProduct("seedStartingMix", "Lightweight, sterile mix designed for seed germination."),
    getProduct("heatMat", "Essential for peppers — maintains the 80-85°F soil temperature they need."),
    getProduct("growLight", "Stronger seedlings and less legginess than windowsill growing."),
  ];

  if (p.indoorSuitable || isSuperhot(p)) {
    products.push(getProduct("growLightPremium", "Upgrade to a full-size panel for growing peppers indoors or starting many varieties at once."));
  }

  return {
    id: "seed-starting",
    stageNumber: 1,
    title: "Seed Starting",
    subtitle: `Start indoors ${weeksIndoor} weeks before last frost`,
    icon: "",
    paragraphs,
    tips,
    products,
  };
}

// ──────────────────────────────────────────────
// Stage 2: Growing Environment
// ──────────────────────────────────────────────

function generateGrowingEnvironment(p: Pepper): GrowingStage {
  const paragraphs: string[] = [];
  const tips = [];

  if (p.containerFriendly) {
    paragraphs.push(
      `${p.name} is well-suited for container growing. Use a container that's at least ${containerSize(p)} — smaller pots dry out quickly and restrict root growth, directly reducing your harvest. Fabric grow bags work well because they allow air pruning of roots.`
    );
    paragraphs.push(
      `Fill your container with a high-quality potting mix (not garden soil, which compacts in containers and drains poorly). Self-watering containers work especially well for peppers since they prefer consistently moist but not waterlogged soil.`
    );
    paragraphs.push(
      `Place your container where it will get at least 6-8 hours of direct sunlight daily. Peppers are sun lovers and heat lovers — the warmest, sunniest spot you have is the best spot. Containers can be moved to follow the sun or brought indoors if frost threatens.`
    );
  } else {
    paragraphs.push(
      `${p.name} does best in the ground or in raised beds where its roots can spread freely. Plan for spacing of ${spacing(p)} between plants to allow good air circulation, which helps prevent fungal diseases.`
    );
    paragraphs.push(
      `Prepare your soil by mixing in 2-3 inches of compost before planting. Peppers thrive in well-draining soil with a pH between 6.0 and 6.8. If you're unsure about your soil, a simple test kit can save you a lot of trouble — peppers are sensitive to nutrient imbalances.`
    );
    paragraphs.push(
      `Choose a spot with at least 6-8 hours of direct sunlight and good air drainage. Avoid low-lying areas where cold air settles. Raised beds warm up faster in spring, giving peppers the heat they crave.`
    );
  }

  if (p.greenhouseRecommended) {
    paragraphs.push(
      `${p.name} benefits significantly from greenhouse or protected growing. A greenhouse extends your season, maintains higher temperatures, and protects from wind and heavy rain. Even a simple walk-in greenhouse or cold frame makes a big difference for peppers in cooler climates.`
    );
  }

  if (p.indoorSuitable) {
    paragraphs.push(
      `${p.name} can also be grown indoors year-round with adequate lighting. Indoor growing requires a strong full-spectrum grow light (at least 14 hours per day) and good air circulation. Many pepper growers keep indoor plants producing through winter.`
    );
  }

  tips.push({ text: "Peppers need at least 6-8 hours of direct sunlight daily.", isVarietySpecific: false });

  if (p.containerFriendly) {
    tips.push({ text: `${p.name} needs at least a ${containerSize(p)} container.`, isVarietySpecific: true });
    tips.push({ text: "Use potting mix, not garden soil, in containers.", isVarietySpecific: false });
  } else {
    tips.push({ text: "Amend soil with compost before planting for best results.", isVarietySpecific: false });
    tips.push({ text: `Space ${p.name} plants ${spacing(p)} apart.`, isVarietySpecific: true });
  }

  if (p.heatTolerance >= 8) {
    tips.push({ text: `${p.name} handles extreme heat well — great for hot, sunny spots.`, isVarietySpecific: true });
  }

  const products = [];
  if (p.containerFriendly) {
    products.push(getProduct("container5Gal", `${p.name}'s size is well-suited for container growing.`));
    products.push(getProduct("selfWateringPot", `Self-watering planters keep ${p.name} consistently moist — reduces watering chores significantly.`));
    products.push(getProduct("pottingMix", "High-quality potting mix with good drainage for containers."));
  } else {
    products.push(getProduct("raisedBedKit", `Give ${p.name}'s roots room to spread in a deep raised bed.`));
    products.push(getProduct("gardenSoil", "Rich soil mix for raised beds and garden planting."));
    products.push(getProduct("soilTestKit", "Test pH and nutrients before planting — peppers need pH 6.0-6.8 for best results."));
  }

  if (p.greenhouseRecommended) {
    products.push(getProduct("greenHouseKit", `Extend ${p.name}'s season and maintain the warm temperatures it craves.`));
  }

  if (p.indoorSuitable && !p.greenhouseRecommended) {
    products.push(getProduct("growLightPremium", `Grow ${p.name} indoors year-round with a full-spectrum light panel.`));
  }

  products.push(getProduct("mulch", "2-3 inches of mulch retains moisture and keeps roots warm."));

  return {
    id: "growing-environment",
    stageNumber: 2,
    title: "Growing Environment",
    subtitle: p.containerFriendly
      ? `Container growing in ${containerSize(p)}+ pots`
      : p.greenhouseRecommended
        ? "Greenhouse or raised bed growing"
        : "Raised beds or in-ground planting",
    icon: "",
    paragraphs,
    tips,
    products,
  };
}

// ──────────────────────────────────────────────
// Stage 3: Transplanting
// ──────────────────────────────────────────────

function generateTransplanting(p: Pepper): GrowingStage {
  const paragraphs: string[] = [];
  const tips = [];

  paragraphs.push(
    `Transplant ${p.name} outdoors after all danger of frost has passed and nighttime temperatures consistently stay above 55°F (13°C). Peppers are more cold-sensitive than tomatoes — cold soil and cool nights stall growth and can permanently stunt plants. In most regions, this is 2-4 weeks after the last frost date.`
  );

  paragraphs.push(
    `Before transplanting, harden off your seedlings over 7-10 days. Start by placing them outdoors in a sheltered, shady spot for 1-2 hours on day one, then gradually increase sun exposure and time outdoors. This prevents transplant shock, which can set peppers back by weeks.`
  );

  if (p.climateSuitability === "hot") {
    paragraphs.push(
      `${p.name} is adapted to hot climates and really wants warm soil — at least 65°F (18°C), ideally 70°F+. Black plastic mulch or landscape fabric can pre-warm the soil before transplanting. Don't rush these plants out — a week of patience waiting for warm soil pays off in faster growth.`
    );
  }

  paragraphs.push(
    `Unlike tomatoes, do NOT bury pepper stems deep. Plant at the same depth they were growing in their pots. Dig a hole just big enough for the root ball, firm the soil gently around the base, and water deeply. Adding a handful of compost or transplant fertilizer in the planting hole gives roots a nutrient boost.`
  );

  tips.push({ text: "Harden off seedlings for 7-10 days before transplanting.", isVarietySpecific: false });
  tips.push({ text: "Wait until nights are consistently above 55°F — peppers hate cold.", isVarietySpecific: false });
  tips.push({ text: "Plant at the same depth as the pot — do NOT bury stems like tomatoes.", isVarietySpecific: false });
  tips.push({ text: `Space ${p.name} plants ${spacing(p)} apart.`, isVarietySpecific: true });

  if (p.coldTolerance <= 3) {
    tips.push({ text: `${p.name} has very low cold tolerance — protect from any temperatures below 50°F.`, isVarietySpecific: true });
  }

  if (p.coldTolerance >= 7) {
    tips.push({ text: `${p.name} tolerates cooler conditions better than most peppers.`, isVarietySpecific: true });
  }

  const products = [
    getProduct("gardenGloves", "Protect your hands while transplanting."),
    getProduct("transplantFertilizer", "High-phosphorus fertilizer encourages strong root establishment."),
  ];

  if (p.coldTolerance <= 4) {
    products.push(getProduct("rowCovers", `Keep ${p.name} protected during cool nights in the first weeks after transplanting.`));
  }

  return {
    id: "transplanting",
    stageNumber: 3,
    title: "Transplanting",
    subtitle: "Harden off, plant at soil level, and protect from cold",
    icon: "",
    paragraphs,
    tips,
    products,
  };
}

// ──────────────────────────────────────────────
// Stage 4: Support & Training
// ──────────────────────────────────────────────

function generateSupportTraining(p: Pepper): GrowingStage {
  const paragraphs: string[] = [];
  const tips = [];

  if (isTall(p)) {
    paragraphs.push(
      `${p.name} has a tall growth habit, reaching ${p.plantHeightCm_min}-${p.plantHeightCm_max} cm (${Math.round(p.plantHeightCm_min / 2.54)}-${Math.round(p.plantHeightCm_max / 2.54)} inches). As fruit develops, heavy branches will bend and potentially snap without support. Install stakes at transplanting time — not after the plant is loaded with peppers.`
    );
    paragraphs.push(
      `Use 3-4 foot bamboo stakes or tomato cages to support tall pepper plants. Tie the main stem loosely to the stake with soft ties as the plant grows. Focus on supporting the main branching points where heavy fruit clusters develop.`
    );
  } else if (isCompact(p)) {
    paragraphs.push(
      `${p.name} has a compact growth habit (${p.plantHeightCm_min}-${p.plantHeightCm_max} cm), so heavy staking isn't usually necessary. However, even compact plants can get top-heavy when loaded with fruit. A single short stake or small cage provides insurance against tipping.`
    );
  } else {
    // bushy
    paragraphs.push(
      `${p.name} grows in a bushy habit, reaching ${p.plantHeightCm_min}-${p.plantHeightCm_max} cm (${Math.round(p.plantHeightCm_min / 2.54)}-${Math.round(p.plantHeightCm_max / 2.54)} inches). Bushy peppers generally support themselves well, but benefit from light staking once fruit starts weighing branches down. A ring of twine around the plant, tied to a central stake, keeps everything tidy and upright.`
    );
  }

  paragraphs.push(
    `Most pepper plants benefit from pinching off the first few flower buds that appear before transplanting or within the first 2 weeks after. This redirects energy into building a stronger root system and more branches, which means more fruit later. Once the plant is established and growing vigorously, let it flower and fruit freely.`
  );

  if (p.yieldLevel === "high") {
    paragraphs.push(
      `${p.name} is a heavy producer — expect lots of fruit. The weight of a full crop can bend or break unsupported branches. Proactive staking and tying pays off when every branch is loaded with peppers.`
    );
  }

  tips.push({ text: "Pinch early flower buds to encourage stronger plants and higher yields.", isVarietySpecific: false });

  if (isTall(p)) {
    tips.push({ text: `${p.name}'s tall habit needs 3-4 ft stakes set at transplanting time.`, isVarietySpecific: true });
    tips.push({ text: "Tie stems loosely — tight ties cut into growing stems.", isVarietySpecific: false });
  } else if (isCompact(p)) {
    tips.push({ text: `${p.name}'s compact size rarely needs more than a short stake for insurance.`, isVarietySpecific: true });
  } else {
    tips.push({ text: "Use soft ties or twine loops to support laden branches.", isVarietySpecific: false });
  }

  const products = [];
  if (isTall(p)) {
    products.push(getProduct("plantStakes", `Support ${p.name}'s tall growth with sturdy bamboo stakes.`));
    products.push(getProduct("pruningShears", "Clean cuts when removing suckers or damaged branches."));
    products.push(getProduct("gardenTwine", "Tie branches gently to stakes as the plant grows."));
  } else {
    products.push(getProduct("gardenTwine", "Loop around bushy plants to keep branches upright under fruit weight."));
  }

  return {
    id: "support-training",
    stageNumber: 4,
    title: "Support & Training",
    subtitle: isTall(p)
      ? "Tall plants need staking at transplanting time"
      : isCompact(p)
        ? "Compact plants need minimal support"
        : "Bushy plants benefit from light staking",
    icon: "",
    paragraphs,
    tips,
    products,
  };
}

// ──────────────────────────────────────────────
// Stage 5: Feeding & Care
// ──────────────────────────────────────────────

function generateFeedingCare(p: Pepper): GrowingStage {
  const paragraphs: string[] = [];
  const tips = [];

  paragraphs.push(
    `Peppers are moderate feeders that respond well to balanced nutrition. Start with a transplant fertilizer at planting time, then switch to a formula higher in phosphorus and potassium (like a 5-10-10) once ${p.name} begins flowering. Too much nitrogen during fruiting produces lots of leaves but fewer peppers.`
  );

  paragraphs.push(
    `Water deeply and consistently — peppers need about 1-2 inches of water per week. Water at the base of the plant in the morning, not overhead, to keep foliage dry and reduce disease risk. Inconsistent watering (drought followed by heavy watering) causes blossom drop and can lead to blossom end rot, especially on larger-fruited varieties.`
  );

  if (p.wallThickness === "thick") {
    paragraphs.push(
      `Thick-walled varieties like ${p.name} are especially prone to blossom end rot if watering is inconsistent. This shows as a dark, sunken patch on the bottom of the fruit. Keep moisture levels even and consider a calcium foliar spray during peak fruiting if you see symptoms.`
    );
  }

  if (isSuperhot(p)) {
    paragraphs.push(
      `Superhot peppers like ${p.name} have a long growing season and benefit from regular feeding every 2-3 weeks throughout summer. They also produce capsaicin more intensely when slightly stressed — some growers intentionally reduce watering slightly (but not drastically) once fruit is setting to boost heat levels.`
    );
  }

  if (p.containerFriendly) {
    paragraphs.push(
      `Container-grown peppers need more frequent feeding than garden plants since nutrients wash out with each watering. Feed every 1-2 weeks with a diluted liquid fertilizer, or use a slow-release granular at planting time. Water containers until water drains from the bottom.`
    );
  }

  tips.push({ text: "Water 1-2 inches per week at the base, not overhead.", isVarietySpecific: false });
  tips.push({ text: "Switch to low-nitrogen, high-potassium fertilizer once flowering begins.", isVarietySpecific: false });
  tips.push({ text: "Mulch 2-3 inches deep to retain moisture and keep roots warm.", isVarietySpecific: false });

  if (p.heatTolerance >= 8) {
    tips.push({ text: `${p.name} handles heat well, but still needs consistent watering during heat waves.`, isVarietySpecific: true });
  }

  if (p.wallThickness === "thick") {
    tips.push({ text: `${p.name}'s thick walls make it susceptible to blossom end rot — keep watering consistent.`, isVarietySpecific: true });
  }

  const products = [
    getProduct("pepperFertilizer", `Balanced organic formula tailored for ${p.name}'s feeding needs.`),
  ];

  if (!p.containerFriendly) {
    products.push(getProduct("dripIrrigationKit", `Automated drip irrigation keeps ${p.name} consistently watered — the #1 factor for preventing blossom drop and end rot.`));
  } else {
    products.push(getProduct("soakerHose", "Delivers water directly to roots in containers — reduces disease and saves time."));
  }

  if (p.wallThickness === "thick") {
    products.push(getProduct("calciumSupplement", `Prevents blossom end rot on ${p.name}'s thick-walled fruit.`));
  }

  return {
    id: "feeding-care",
    stageNumber: 5,
    title: "Feeding & Care",
    subtitle: "Watering, fertilizing, and ongoing maintenance",
    icon: "",
    paragraphs,
    tips,
    products,
  };
}

// ──────────────────────────────────────────────
// Stage 6: Pest & Disease Watch
// ──────────────────────────────────────────────

function generatePestDisease(p: Pepper): GrowingStage {
  const paragraphs: string[] = [];
  const tips = [];

  paragraphs.push(
    `The most common pepper pests are aphids (clusters on new growth), whiteflies (tiny white insects on undersides of leaves), and pepper hornworms. Check your plants every few days — catching problems early makes them much easier to manage. Aphids can be blasted off with a strong spray of water, and insecticidal soap handles most soft-bodied pests.`
  );

  paragraphs.push(
    `For diseases, watch for bacterial leaf spot (dark, water-soaked spots on leaves), powdery mildew (white coating), and phytophthora (wilting despite wet soil). Remove affected leaves immediately and avoid overhead watering, which creates conditions these diseases love.`
  );

  if (p.diseaseNotes && p.diseaseNotes.length > 0) {
    paragraphs.push(
      `Growing note for ${p.name}: ${p.diseaseNotes}`
    );
  }

  paragraphs.push(
    `Prevention is always easier than treatment. Water at the base, keep foliage dry, ensure good air circulation through proper spacing, rotate your pepper patch each year (avoid planting peppers, tomatoes, or eggplants in the same spot two years in a row), and remove plant debris at season's end.`
  );

  tips.push({ text: "Inspect plants every few days — early detection is key.", isVarietySpecific: false });
  tips.push({ text: "Rotate pepper planting location each year — don't follow tomatoes or eggplant.", isVarietySpecific: false });
  tips.push({ text: "Remove lower leaves touching soil to prevent splash-borne disease.", isVarietySpecific: false });

  if (p.difficulty === "advanced") {
    tips.push({ text: `${p.name} requires more attentive disease monitoring than beginner varieties.`, isVarietySpecific: true });
  }

  if (isSuperhot(p)) {
    tips.push({ text: "Wear gloves when handling superhot peppers — capsaicin causes skin and eye burns.", isVarietySpecific: false });
  }

  const products = [
    getProduct("neemOil", "All-purpose organic spray for aphids, whiteflies, and fungal issues."),
    getProduct("insecticidalSoap", "Safe, effective spray for soft-bodied insects on pepper plants."),
  ];

  if (p.coldTolerance <= 3) {
    products.push(getProduct("rowCovers", "Physical barrier against pests and cold — extends the season too."));
  }

  return {
    id: "pest-disease",
    stageNumber: 6,
    title: "Pest & Disease Watch",
    subtitle: "Prevention through good cultural practices",
    icon: "",
    paragraphs,
    tips,
    products,
  };
}

// ──────────────────────────────────────────────
// Stage 7: Harvesting & Preserving
// ──────────────────────────────────────────────

function generateHarvesting(p: Pepper): GrowingStage {
  const paragraphs: string[] = [];
  const tips = [];

  paragraphs.push(
    `Expect your first ripe ${p.name} peppers approximately ${p.daysToMaturity_min}-${p.daysToMaturity_max} days after transplanting. Most peppers can be harvested at any color stage — green peppers are simply unripe, but many varieties are perfectly usable (and less hot) when picked green.`
  );

  const finalColor = p.colorStages.length > 0 ? p.colorStages[p.colorStages.length - 1] : "red";
  paragraphs.push(
    `For maximum flavor and heat, wait until ${p.name} turns fully ${finalColor}. The color progression for this variety is ${p.colorStages.join(" → ")}. Fully ripe peppers have higher sugar content and more developed flavor. Use clean shears or a knife to cut peppers from the plant — pulling can damage branches.`
  );

  if (isSuperhot(p)) {
    paragraphs.push(
      `Handling warning: ${p.name} ranges from ${p.heatSHU_min.toLocaleString()} to ${p.heatSHU_max.toLocaleString()} SHU. Always wear gloves when harvesting and processing superhot peppers. Avoid touching your face, and wash your hands thoroughly even after removing gloves. Consider processing outdoors to avoid capsaicin fumes.`
    );
  }

  if (hasBestUse(p, "drying")) {
    paragraphs.push(
      `${p.name} is excellent for drying. ${p.wallThickness === "thin" ? "Its thin walls dry quickly — you can air-dry them by stringing on a thread in a warm, dry spot." : "A food dehydrator produces more consistent results than air-drying, especially for thicker-walled peppers."} Dried peppers can be ground into powder, flakes, or stored whole for months.`
    );
  }

  if (hasBestUse(p, "hot_sauce") || hasBestUse(p, "fermenting")) {
    paragraphs.push(
      `${p.name} is a great choice for hot sauce and fermented pepper products. For fermentation, chop peppers, mix with 3-5% salt by weight, and pack into a jar. Ferment at room temperature for 1-4 weeks, then blend and strain for a naturally tangy, complex hot sauce.`
    );
  }

  tips.push({ text: "Use clean shears to harvest — pulling can damage the plant.", isVarietySpecific: false });
  tips.push({ text: `Wait for full ${finalColor} color for maximum flavor and heat.`, isVarietySpecific: true });
  tips.push({ text: "Regular picking encourages the plant to produce more peppers.", isVarietySpecific: false });

  if (p.yieldLevel === "high") {
    tips.push({ text: `${p.name} is a heavy producer — plan for preserving, sharing, or selling the surplus.`, isVarietySpecific: true });
  }

  if (isSuperhot(p)) {
    tips.push({ text: "Always wear gloves and avoid touching your face when handling superhot peppers.", isVarietySpecific: false });
  }

  const products = [
    getProduct("harvestBasket", "Gentle on fruit — better than bags for preventing bruising."),
  ];

  if (hasBestUse(p, "drying") || hasBestUse(p, "powdered")) {
    products.push(getProduct("dehydrator", `Dry ${p.name} into flakes or powder — a dehydrator handles any wall thickness consistently.`));
  }

  products.push(getProduct("compostBin", "Turn spent pepper plants and kitchen scraps into next season's soil amendment."));

  return {
    id: "harvesting",
    stageNumber: 7,
    title: "Harvesting & Preserving",
    subtitle: `First fruit at ~${avgMaturity(p)} days — color stages: ${p.colorStages.join(" → ")}`,
    icon: "",
    paragraphs,
    tips,
    products,
  };
}

// ──────────────────────────────────────────────
// Main Generator
// ──────────────────────────────────────────────

export function generatePepperGuide(pepper: Pepper): GrowingGuide {
  return {
    varietyName: pepper.name,
    stages: [
      generateSeedStarting(pepper),
      generateGrowingEnvironment(pepper),
      generateTransplanting(pepper),
      generateSupportTraining(pepper),
      generateFeedingCare(pepper),
      generatePestDisease(pepper),
      generateHarvesting(pepper),
    ],
  };
}
