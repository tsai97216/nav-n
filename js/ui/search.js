import { state } from "../core/state.js";
import { getVisibleSections, renderSections } from "./render.js";
import { renderNavigation } from "./navigation.js";

export function initializeSearch() {
  const input = document.querySelector("#search");
  input.addEventListener("input", event => {
    state.query = event.target.value;
    renderSections(getVisibleSections());
    renderNavigation();
  });
}
