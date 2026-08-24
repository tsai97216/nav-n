const STORAGE_KEY = "chi-nav:preferences";

const DEFAULTS = Object.freeze({
  favorites: [],
  recent: [],
  frequent: [],
  frequentCounts: {}
});

function normalizeList(value) {
  return Array.isArray(value)
    ? [...new Set(value.filter(item => typeof item === "string" && item.trim()))]
    : [];
}

function normalizeCounts(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(([url, count]) =>
      typeof url === "string" && url.trim() && Number.isFinite(count) && count > 0
    ).map(([url, count]) => [url, Math.floor(count)])
  );
}

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };

    const parsed = JSON.parse(raw);
    const frequentCounts = normalizeCounts(parsed?.frequentCounts);
    const legacyFrequent = normalizeList(parsed?.frequent);

    for (const url of legacyFrequent) {
      if (!frequentCounts[url]) frequentCounts[url] = 1;
    }

    const frequent = Object.entries(frequentCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([url]) => url)
      .slice(0, 50);

    return {
      favorites: normalizeList(parsed?.favorites),
      recent: normalizeList(parsed?.recent),
      frequent,
      frequentCounts
    };
  } catch {
    return { ...DEFAULTS, frequentCounts: {} };
  }
}

export function savePreferences(preferences) {
  const frequentCounts = normalizeCounts(preferences?.frequentCounts);
  const frequent = Object.entries(frequentCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([url]) => url)
    .slice(0, 50);

  const normalized = {
    favorites: normalizeList(preferences?.favorites),
    recent: normalizeList(preferences?.recent),
    frequent,
    frequentCounts
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.warn("NAV 偏好設定無法儲存：", error);
  }

  return normalized;
}

export function toggleFavorite(url) {
  const preferences = loadPreferences();
  const favorites = new Set(preferences.favorites);

  if (favorites.has(url)) favorites.delete(url);
  else favorites.add(url);

  return savePreferences({ ...preferences, favorites: [...favorites] });
}

export function recordRecent(url, limit = 20) {
  const preferences = loadPreferences();
  const recent = [url, ...preferences.recent.filter(item => item !== url)].slice(0, limit);
  return savePreferences({ ...preferences, recent });
}

export function recordFrequent(url) {
  const preferences = loadPreferences();
  const frequentCounts = {
    ...preferences.frequentCounts,
    [url]: (preferences.frequentCounts[url] || 0) + 1
  };

  return savePreferences({ ...preferences, frequentCounts });
}
