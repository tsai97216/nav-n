import { state } from "../core/state.js";
import { renderSections } from "./render.js";
import { renderNavigation } from "./navigation.js";

export function initializeSearch() {
  const input = document.querySelector("#search");
  input.addEventListener("input", event => {
    state.query = event.target.value;
    renderSections(requireSections());
    renderNavigation();
  });
}

function requireSections() {
  const query = state.query.trim().toLowerCase();
  if (!query) return state.data;
  return state.data.map(section => ({
    ...section,
    links: section.links.filter(link =>
      [link.title, link.url, link.description, section.taxonomy]
        .join(" ").toLowerCase().includes(query)
    )
  })).filter(section => section.links.length);
}
