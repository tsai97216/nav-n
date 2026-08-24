import { state } from "../core/state.js";

function escapeHtml(value) {
  return String(value).replace(/[&<>\"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  }[char]));
}

function filterLinks(links, query, taxonomy = "") {
  if (!Array.isArray(links)) return [];
  if (!query) return links;

  return links.filter(link =>
    [link.title, link.url, link.description, taxonomy]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );
}

function normalizeSubcategory(subcategory) {
  return {
    term: typeof subcategory?.term === "string" ? subcategory.term.trim() : "",
    links: Array.isArray(subcategory?.links) ? subcategory.links : []
  };
}

export function getVisibleSections() {
  const query = state.query.trim().toLowerCase();

  return state.data
    .map(section => {
      const directLinks = filterLinks(section.links, query, section.taxonomy);
      const list = Array.isArray(section.list)
        ? section.list
            .map(normalizeSubcategory)
            .map(subcategory => ({
              ...subcategory,
              links: filterLinks(subcategory.links, query, `${section.taxonomy} ${subcategory.term}`)
            }))
            .filter(subcategory => subcategory.links.length)
        : [];

      return {
        ...section,
        links: directLinks,
        list
      };
    })
    .filter(section => section.links.length || section.list.length);
}

export function renderCards(links) {
  return links.map(link => `
    <a class="card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
      ${link.icon ? `<i class="card-icon ${escapeHtml(link.icon)}" aria-hidden="true"></i>` : ""}
      <div class="card-body">
        <div class="card-title">${escapeHtml(link.title)}</div>
        ${link.description ? `<div class="card-desc">${escapeHtml(link.description)}</div>` : ""}
      </div>
    </a>
  `).join("");
}

export function renderSections(sections = getVisibleSections()) {
  const content = document.querySelector("#content");
  if (!content) return;

  content.innerHTML = sections.map((section, index) => {
    const directLinks = section.links?.length
      ? `<div class="content-grid">${renderCards(section.links)}</div>`
      : "";

    const subcategories = (section.list || []).map(subcategory => `
      <div class="subcategory">
        <h4>${escapeHtml(subcategory.term)}</h4>
        <div class="content-grid">${renderCards(subcategory.links)}</div>
      </div>
    `).join("");

    return `
      <section class="section" id="section-${index}">
        <h3>${escapeHtml(section.taxonomy)}</h3>
        ${directLinks}
        ${subcategories}
      </section>
    `;
  }).join("");
}
