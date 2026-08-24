import { state } from "../core/state.js";
import { renderCards } from "./card.js";

export function getFrequentLinks() {
  const counts = state.preferences.frequentCounts || {};
  const linksByUrl = new Map();

  for (const section of state.data) {
    for (const link of section.links || []) linksByUrl.set(link.url, link);
    for (const subcategory of section.list || []) {
      for (const link of subcategory.links || []) linksByUrl.set(link.url, link);
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([url]) => linksByUrl.get(url))
    .filter(Boolean)
    .slice(0, 20);
}

export function renderFrequentSection() {
  const links = getFrequentLinks();
  if (!links.length) return "";

  return `
    <section class="section personalized-section" id="section-frequent">
      <h3>常用</h3>
      <div class="content-grid">${renderCards(links)}</div>
    </section>
  `;
}
