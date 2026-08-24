function normalizeLink(link) {
  return {
    title: link.title.trim(),
    url: link.url.trim(),
    description: typeof link.description === "string" ? link.description.trim() : "",
    ...(typeof link.icon === "string" && link.icon.trim()
      ? { icon: link.icon.trim() }
      : {})
  };
}

function normalizeSubcategory(subcategory) {
  return {
    term: subcategory.term.trim(),
    links: subcategory.links.map(normalizeLink)
  };
}

export function normalizeData(sections) {
  return sections.map(section => ({
    taxonomy: section.taxonomy.trim(),
    icon: typeof section.icon === "string" && section.icon.trim()
      ? section.icon.trim()
      : "fa-solid fa-folder",
    links: Array.isArray(section.links)
      ? section.links.map(normalizeLink)
      : [],
    list: Array.isArray(section.list)
      ? section.list.map(normalizeSubcategory)
      : []
  }));
}
