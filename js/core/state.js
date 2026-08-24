const initialState = {
  data: [],
  query: "",
  currentSection: null,
  version: null,
  error: null,
  status: "idle"
};

export const state = { ...initialState };

export function setState(patch) {
  Object.assign(state, patch);
  return state;
}

export function resetState() {
  Object.assign(state, initialState);
  return state;
}
