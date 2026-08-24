import { escapeHtml } from "./html.js";

function isIconClass(value) {
  return typeof value === "string" && /^(fa|fas|far|fab|fal|fad|fat|fa-)/.test(value.trim());
}

function getFaviconUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`;
  } catch {
    return "";
  }
}

export function renderIcon({ icon, url } = {}) {
  const value = typeof icon === "string" ? icon.trim() : "";

  if (isIconClass(value)) {
    return `<i class="card-icon ${escapeHtml(value)}" aria-hidden="true"></i>`;
  }

  if (value && /^(https?:)?\/\//i.test(value)) {
    return `<img class="card-icon" src="${escapeHtml(value)}" alt="" loading="lazy" decoding="async">`;
  }

  const favicon = getFaviconUrl(url);
  if (favicon) {
    return `<img class="card-icon" src="${escapeHtml(favicon)}" alt="" loading="lazy" decoding="async">`;
  }

  return `<span class="card-icon" aria-hidden="true">◈</span>`;
}
