import { state, setState } from "../core/state.js";
import { emit, EVENTS } from "../core/events.js";
import { recordRecent, savePreferences } from "../core/preferences.js";

export function getRecentUrls() {
  return [...state.preferences.recent];
}

export function recordRecentForUrl(url) {
  if (!url) return state.preferences;

  const preferences = recordRecent(url);
  setState({ preferences });
  emit(EVENTS.PREFERENCES_CHANGED, { preferences, type: "recent" });
  return preferences;
}

export function clearRecent() {
  const preferences = savePreferences({
    ...state.preferences,
    recent: []
  });

  setState({ preferences });
  emit(EVENTS.PREFERENCES_CHANGED, { preferences, type: "recent-clear" });
  return preferences;
}
