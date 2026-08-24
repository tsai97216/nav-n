import { escapeHtml } from "./html.js";
import { renderIcon } from "./icon.js";
import { isFavorite, toggleFavoriteForUrl } from "./favorites.js";
import { recordRecentForUrl } from "./recent.js";
import { recordFrequentForUrl } from "./frequent.js";

function renderFavoriteButton(url) {
  const active = isFavorite(url);
  return `
    <button class="card-favorite${active ? " is-active" : ""}" type="button" data-favorite-url="${escapeHtml(url)}" aria-label="${active ? "取消收藏" : "加入收藏"}" aria-pressed="${active ? "true" : "false"}">${active ? "★" : "☆"}</button>
  `;
}

export function renderCard(link) {
  if (!link || !link.url || !link.title) return "";

  const icon = renderIcon(link);
  const description = link.description ? `<div class="card-desc">${escapeHtml(link.description)}</div>` : "";

  return `
    <article class="card-wrapper">
      <a class="card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" data-link-url="${escapeHtml(link.url)}">
        ${icon}
        <div class="card-body"><div class="card-title">${escapeHtml(link.title)}</div>${description}</div>
      </a>
      ${renderFavoriteButton(link.url)}
    </article>
  `;
}

export function renderCards(links = []) {
  return links.map(renderCard).filter(Boolean).join("");
}

export function initializeCardInteractions(root = document) {
  root.querySelectorAll("[data-favorite-url]").forEach(button => {
    if (button.dataset.favoriteBound === "true") return;
    button.dataset.favoriteBound = "true";
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const url = button.dataset.favoriteUrl;
      if (!url) return;
      const preferences = toggleFavoriteForUrl(url);
      const active = preferences.favorites.includes(url);
      button.classList.toggle("is-active", active);
      button.textContent = active ? "★" : "☆";
      button.setAttribute("aria-label", active ? "取消收藏" : "加入收藏");
      button.setAttribute("aria-pressed", String(active));
    });
  });

  root.querySelectorAll("a[data-link-url]").forEach(link => {
    if (link.dataset.recentBound === "true") return;
    link.dataset.recentBound = "true";
    link.addEventListener("click", () => {
      const url = link.dataset.linkUrl;
      if (url) {
        recordRecentForUrl(url);
        recordFrequentForUrl(url);
      }
    });
  });
}
