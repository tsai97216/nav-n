import { state } from "../core/state.js";
import { renderCards } from "./card.js";
import { escapeHtml } from "./html.js";

function findLinksByUrls(urls) {
  const wanted = new Set(urls);
  const result = [];

  for (const section of state.data) {
    for (const link of section.links || []) {
      if (wanted.has(link.url)) result.push(link);
    }

    for (const subcategory of section.list || []) {
      for (const link of subcategory.links || []) {
        if (wanted.has(link.url)) result.push(link);
      }
    }
  }

  return result;
}

export function renderFavoritesSection() {
  const links = findLinksByUrls(state.preferences.favorites);
  if (!links.length) return "";

  return `
    <section class="section personalized-section" id="section-favorites">
      <h3>${escapeHtml("收藏")}</h3>
      <div class="content-grid">${renderCards(links)}</div>
    </section>
  `;
}
