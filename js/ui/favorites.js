import { state, setState } from "../core/state.js";
import { emit, EVENTS } from "../core/events.js";
import { toggleFavorite, savePreferences } from "../core/preferences.js";

export function isFavorite(url) {
  return state.preferences.favorites.includes(url);
}

export function toggleFavoriteForUrl(url) {
  const preferences = toggleFavorite(url);
  setState({ preferences });
  emit(EVENTS.PREFERENCES_CHANGED, { preferences });
  return preferences;
}

export function getFavoriteUrls() {
  return [...state.preferences.favorites];
}

export function syncPreferences() {
  const preferences = savePreferences(state.preferences);
  setState({ preferences });
  return preferences;
}
