import { state } from "../core/state.js";
import { renderCards } from "./card.js";

export function getRecentLinks() {
  const recentUrls = new Set(state.preferences.recent);
  if (!recentUrls.size) return [];

  const links = [];
  for (const section of state.data) {
    for (const link of section.links || []) {
      if (recentUrls.has(link.url)) links.push(link);
    }
    for (const subcategory of section.list || []) {
      for (const link of subcategory.links || []) {
        if (recentUrls.has(link.url)) links.push(link);
      }
    }
  }

  const byUrl = new Map(links.map(link => [link.url, link]));
  return state.preferences.recent
    .map(url => byUrl.get(url))
    .filter(Boolean);
}

export function renderRecentSection() {
  const links = getRecentLinks();
  if (!links.length) return "";

  return `
    <section class="section personalized-section" id="section-recent">
      <h3>最近使用</h3>
      <div class="content-grid">${renderCards(links)}</div>
    </section>
  `;
}
