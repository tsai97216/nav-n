import { state } from "../core/state.js";
import { escapeHtml } from "./html.js";
import { renderCards, initializeCardInteractions } from "./card.js";
import { renderFavoritesSection } from "./personalized.js";
import { renderRecentSection } from "./recent-section.js";

function filterLinks(links, query, taxonomy = "") {
  if (!Array.isArray(links)) return [];
  if (!query) return links;
  return links.filter(link => [link.title, link.url, link.description, taxonomy].join(" ").toLowerCase().includes(query));
}

function normalizeSubcategory(subcategory) {
  return {
    term: typeof subcategory?.term === "string" ? subcategory.term.trim() : "",
    links: Array.isArray(subcategory?.links) ? subcategory.links : []
  };
}

export function getVisibleSections() {
  const query = state.query.trim().toLowerCase();
  return state.data.map(section => {
    const directLinks = filterLinks(section.links, query, section.taxonomy);
    const list = Array.isArray(section.list)
      ? section.list.map(normalizeSubcategory).map(subcategory => ({
          ...subcategory,
          links: filterLinks(subcategory.links, query, `${section.taxonomy} ${subcategory.term}`)
        })).filter(subcategory => subcategory.links.length)
      : [];
    return { ...section, links: directLinks, list };
  }).filter(section => section.links.length || section.list.length);
}

export function renderSections(sections = getVisibleSections()) {
  const content = document.querySelector("#content");
  if (!content) return;

  const hasQuery = Boolean(state.query.trim());
  const personalized = hasQuery ? "" : renderFavoritesSection() + renderRecentSection();

  if (!sections.length && !personalized) {
    content.innerHTML = `<section class="empty-state" aria-live="polite"><h3>找不到符合的網站</h3><p>試試其他關鍵字。</p></section>`;
    return;
  }

  content.innerHTML = personalized + sections.map((section, index) => {
    const directLinks = section.links?.length ? `<div class="content-grid">${renderCards(section.links)}</div>` : "";
    const subcategories = (section.list || []).map(subcategory => `
      <div class="subcategory"><h4>${escapeHtml(subcategory.term)}</h4><div class="content-grid">${renderCards(subcategory.links)}</div></div>
    `).join("");
    return `<section class="section" id="section-${index}"><h3>${escapeHtml(section.taxonomy)}</h3>${directLinks}${subcategories}</section>`;
  }).join("");

  initializeCardInteractions(content);
}
