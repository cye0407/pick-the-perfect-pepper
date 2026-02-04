import React, { useMemo } from "react";
import type { Region } from "../types/pepper";

type AffiliateLink = {
  vendor: string;
  url: string;
  region: Region;
};

type PepperAffiliateLinks = {
  [pepperName: string]: AffiliateLink[];
};

type MinimalItem = {
  name: string;
  containerFriendly?: boolean;
};

type Preferences = {
  useCase: string[];
  containerFriendly?: string;
};

function isValidHttpUrl(url?: string) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function AffiliateCTA(props: {
  item: MinimalItem;
  selectedRegion: Region;
  setSelectedRegion: React.Dispatch<React.SetStateAction<Region>>;
  affiliateLinks: PepperAffiliateLinks;
  preferences: Preferences;
}) {
  const { item, affiliateLinks } = props;

  // Get first valid link for this pepper
  const pepperLink = useMemo(() => {
    const links = affiliateLinks[item.name] || [];
    return links.find((link) => isValidHttpUrl(link.url));
  }, [affiliateLinks, item.name]);

  if (!pepperLink) {
    return null;
  }

  return (
    <div className="mt-6 p-5 bg-gradient-to-br from-pepper-green/10 to-pepper-green/5 rounded-lg border-2 border-pepper-green/30 shadow-sm">
      <h4 className="font-bold text-lg text-ink mb-4">🌱 Grow {item.name}</h4>

      <a
        href={pepperLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-pepper-red text-white text-center py-3 px-4 rounded-lg hover:bg-pepper-red/90 transition-all font-semibold text-base shadow-md hover:shadow-lg"
      >
        🌶️ Buy Seeds
      </a>

      <p className="text-xs text-ink/50 mt-3 text-center">
        Ships to US & Canada
      </p>
    </div>
  );
}
