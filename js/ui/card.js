import { escapeHtml } from "./html.js";

function getFaviconUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`;
  } catch {
    return "";
  }
}

export function renderCard(link) {
  if (!link || !link.url || !link.title) return "";

  const fallbackIcon = getFaviconUrl(link.url);
  const icon = fallbackIcon
    ? `<img class="card-icon" src="${escapeHtml(fallbackIcon)}" alt="" loading="lazy" decoding="async">`
    : `<span class="card-icon" aria-hidden="true">◈</span>`;

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
