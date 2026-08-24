export function normalizeData(sections) {
  return sections.map(section => ({
    taxonomy: section.taxonomy.trim(),
    icon: section.icon || "fa-solid fa-folder",
    links: section.links.map(link => ({
      title: link.title.trim(),
      url: link.url.trim(),
      description: typeof link.description === "string" ? link.description.trim() : ""
    }))
  }));
}
