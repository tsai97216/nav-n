const STORAGE_KEY = "chi-nav:preferences";

const DEFAULTS = Object.freeze({
  favorites: [],
  recent: [],
  frequent: []
});

function normalizeList(value) {
  return Array.isArray(value)
    ? [...new Set(value.filter(item => typeof item === "string" && item.trim()))]
    : [];
}

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };

    const parsed = JSON.parse(raw);
    return {
      favorites: normalizeList(parsed?.favorites),
      recent: normalizeList(parsed?.recent),
      frequent: normalizeList(parsed?.frequent)
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function savePreferences(preferences) {
  const normalized = {
    favorites: normalizeList(preferences?.favorites),
    recent: normalizeList(preferences?.recent),
    frequent: normalizeList(preferences?.frequent)
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

export function recordFrequent(url, limit = 50) {
  const preferences = loadPreferences();
  const frequent = [url, ...preferences.frequent.filter(item => item !== url)].slice(0, limit);
  return savePreferences({ ...preferences, frequent });
}
