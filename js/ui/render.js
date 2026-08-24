import { state } from "../core/state.js";

function escapeHtml(value) {
  return String(value).replace(/[&<>\"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  }[char]));
}

export function getVisibleSections() {
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

export function renderCards(links) {
  return links.map(link => `
    <a class="card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
      <div class="card-title">${escapeHtml(link.title)}</div>
      ${link.description ? `<div class="card-desc">${escapeHtml(link.description)}</div>` : ""}
    </a>
  `).join("");
}

export function renderSections(sections) {
  const content = document.querySelector("#content");
  content.innerHTML = sections.map((section, index) => `
    <section class="section" id="section-${index}">
      <h3>${escapeHtml(section.taxonomy)}</h3>
      <div class="content-grid">${renderCards(section.links)}</div>
    </section>
  `).join("");
}
