import { state, setState } from "../core/state.js";
import { emit, EVENTS } from "../core/events.js";
import { recordFrequent, savePreferences } from "../core/preferences.js";

export function getFrequentUrls(limit = 12) {
  return Object.entries(state.preferences.frequentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([url]) => url);
}

export function recordFrequentForUrl(url) {
  if (!url) return state.preferences;

  const preferences = recordFrequent(url);
  setState({ preferences });
  emit(EVENTS.PREFERENCES_CHANGED, {
    preferences,
    type: "frequent",
    url
  });
  return preferences;
}

export function clearFrequent() {
  const preferences = savePreferences({
    ...state.preferences,
    frequent: [],
    frequentCounts: {}
  });

  setState({ preferences });
  emit(EVENTS.PREFERENCES_CHANGED, { preferences, type: "frequent-clear" });
  return preferences;
}
