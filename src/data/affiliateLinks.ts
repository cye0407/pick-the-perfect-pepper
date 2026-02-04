// src/data/affiliateLinks.ts
// SeedsNow = prioritized (lower prices, higher commission)
// West Coast Seeds = secondary (US/Canada only)

export type Region = "US" | "EU";

export interface AffiliateLink {
  vendor: string;
  url: string;
  region: Region;
}

export interface PepperAffiliateLinks {
  [pepperName: string]: AffiliateLink[];
}

const SEEDSNOW_REF = "?rfsn=8958863.0984050&utm_source=refersion&utm_medium=affiliate&utm_campaign=8958863.0984050";
const WCS_REF = "?rfsn=8639095.6ec160";

const affiliateLinks: PepperAffiliateLinks = {
  // HOT PEPPERS - SeedsNow
  "Anaheim": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-anaheim${SEEDSNOW_REF}`, region: "US" }],
  "Ancho Grande": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-ancho-grande${SEEDSNOW_REF}`, region: "US" }],
  "Ancho": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-ancho-grande${SEEDSNOW_REF}`, region: "US" }],
  "Banana Pepper": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-banana${SEEDSNOW_REF}`, region: "US" }],
  "Hot Banana": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-banana${SEEDSNOW_REF}`, region: "US" }],
  "Big Jim": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-big-jim${SEEDSNOW_REF}`, region: "US" }],
  "Caloro": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-caloro${SEEDSNOW_REF}`, region: "US" }],
  "Cayenne": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-cayenne-long-thin-red${SEEDSNOW_REF}`, region: "US" }],
  "Cherry Pepper": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-cherry-large-red${SEEDSNOW_REF}`, region: "US" }],
  "Fresno": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-fresno-chili${SEEDSNOW_REF}`, region: "US" }],
  "Fresno Chili": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-fresno-chili${SEEDSNOW_REF}`, region: "US" }],
  "Chocolate Habanero": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-habanero-chocolate-1${SEEDSNOW_REF}`, region: "US" }],
  "Habanero": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-habanero-orange${SEEDSNOW_REF}`, region: "US" }],
  "Hungarian Wax": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-hungarian-wax${SEEDSNOW_REF}`, region: "US" }],
  "Hungarian Hot Wax": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-hungarian-wax${SEEDSNOW_REF}`, region: "US" }],
  "Jalapeño": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-early-jalapeno${SEEDSNOW_REF}`, region: "US" }],
  "Poblano": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-poblano${SEEDSNOW_REF}`, region: "US" }],
  "Serrano": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-serrano-tampiqueno${SEEDSNOW_REF}`, region: "US" }],
  "Tepin": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-tepin${SEEDSNOW_REF}`, region: "US" }],
  "Chiltepin": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-hot-tepin${SEEDSNOW_REF}`, region: "US" }],
  
  // SWEET PEPPERS - SeedsNow
  "California Wonder": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-california-wonder${SEEDSNOW_REF}`, region: "US" }],
  "Bell Pepper": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-california-wonder${SEEDSNOW_REF}`, region: "US" }],
  "Corno di Toro": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-corno-di-toro-red${SEEDSNOW_REF}`, region: "US" }],
  "Golden Cal Wonder": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-golden-cal-wonder${SEEDSNOW_REF}`, region: "US" }],
  "Marconi Red": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-marconi-red${SEEDSNOW_REF}`, region: "US" }],
  "Pimento": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-pimento${SEEDSNOW_REF}`, region: "US" }],
  "Pimiento": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-pimento${SEEDSNOW_REF}`, region: "US" }],
  "Sweet Banana": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-yellow-banana${SEEDSNOW_REF}`, region: "US" }],
  "Yolo Wonder": [{ vendor: "SeedsNow", url: `https://www.seedsnow.com/products/pepper-sweet-yolo-wonder${SEEDSNOW_REF}`, region: "US" }],

  // WEST COAST SEEDS ONLY (not on SeedsNow)
  "Carolina Reaper": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/carolina-reaper${WCS_REF}`, region: "US" }],
  "Ghost Pepper": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/ghost${WCS_REF}`, region: "US" }],
  "Bhut Jolokia": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/ghost${WCS_REF}`, region: "US" }],
  "Scotch Bonnet": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/scotch-bonnet${WCS_REF}`, region: "US" }],
  "Trinidad Moruga Scorpion": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/trinidad-moruga-scorpion${WCS_REF}`, region: "US" }],
  "Shishito": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/shishimai-f1${WCS_REF}`, region: "US" }],
  "Jimmy Nardello": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/jimmy-nardello-organic${WCS_REF}`, region: "US" }],
  "Pepperoncini": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/pepperoncini${WCS_REF}`, region: "US" }],
  "Purple Beauty": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/purple-beauty${WCS_REF}`, region: "US" }],
  "Chocolate Beauty": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/chocolate-beauty${WCS_REF}`, region: "US" }],
  "King of the North": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/king-of-the-north-organic${WCS_REF}`, region: "US" }],
  "Carmen F1": [{ vendor: "West Coast Seeds", url: `https://www.westcoastseeds.com/products/carmen-f1-organic${WCS_REF}`, region: "US" }],
};

export default affiliateLinks;
