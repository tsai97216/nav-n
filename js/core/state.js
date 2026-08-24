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
    frequent: []
  }
};

export const state = {
  ...initialState,
  preferences: { ...initialState.preferences }
};

export function setState(patch) {
  if (patch.preferences) {
    state.preferences = {
      ...state.preferences,
      ...patch.preferences
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
    preferences: { ...initialState.preferences }
  });
  return state;
}
