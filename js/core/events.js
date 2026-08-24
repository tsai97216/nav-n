export const EVENTS = Object.freeze({
  VERSION_READY: "nav:version-ready",
  DATA_READY: "nav:data-ready",
  READY: "nav:ready",
  ERROR: "nav:error",
  SEARCH_CHANGED: "nav:search-changed"
});

export const events = new EventTarget();

export function emit(name, detail = {}) {
  events.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on(name, handler) {
  events.addEventListener(name, handler);
  return () => events.removeEventListener(name, handler);
}
