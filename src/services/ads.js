// AdMob ads - will be configured after client provides ad unit IDs
let articleCount = 0;

export const initInterstitialAds = () => {
  // No-op until AdMob is configured
};

export const showInterstitialAd = () => {
  articleCount++;
  // Will show interstitial every 4 articles once AdMob is configured
};
