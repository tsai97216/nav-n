const initialState = {
  data: [],
  query: "",
  currentSection: null,
  version: null,
  error: null,
  status: "idle",
  preferences: {
    favorites: [],
    recent: [],
    frequent: [],
    frequentCounts: {}
  }
};

export const state = {
  ...initialState,
  preferences: {
    ...initialState.preferences,
    frequentCounts: {}
  }
};

export function setState(patch) {
  if (patch.preferences) {
    state.preferences = {
      ...state.preferences,
      ...patch.preferences,
      frequentCounts: {
        ...state.preferences.frequentCounts,
        ...(patch.preferences.frequentCounts || {})
      }
    };
  }

  Object.assign(state, {
    ...patch,
    preferences: state.preferences
  });

  return state;
}

export function resetState() {
  Object.assign(state, {
    ...initialState,
    preferences: {
      ...initialState.preferences,
      frequentCounts: {}
    }
  });
  return state;
}
