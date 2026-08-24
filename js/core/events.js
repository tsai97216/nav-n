export const events = new EventTarget();

export function emit(name, detail = {}) {
  events.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on(name, handler) {
  events.addEventListener(name, handler);
  return () => events.removeEventListener(name, handler);
}
