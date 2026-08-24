import { escapeHtml } from "./html.js";

export function renderCard(link) {
  if (!link || !link.url || !link.title) return "";

  const icon = link.icon
    ? `<i class="card-icon ${escapeHtml(link.icon)}" aria-hidden="true"></i>`
    : "";

  const description = link.description
    ? `<div class="card-desc">${escapeHtml(link.description)}</div>`
    : "";

  return `
    <a class="card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
      ${icon}
      <div class="card-body">
        <div class="card-title">${escapeHtml(link.title)}</div>
        ${description}
      </div>
    </a>
  `;
}

export function renderCards(links = []) {
  return links.map(renderCard).filter(Boolean).join("");
}
