function validLink(link) {
  return link && typeof link === "object" &&
    typeof link.title === "string" && link.title.trim() !== "" &&
    typeof link.url === "string" && /^https?:\/\//i.test(link.url);
}

export function validateData(data) {
  if (!Array.isArray(data)) throw new Error("資料格式錯誤：頂層必須是陣列");

  const sections = [];
  const errors = [];

  data.forEach((section, sectionIndex) => {
    if (!section || typeof section !== "object" || typeof section.taxonomy !== "string") {
      errors.push(`第 ${sectionIndex + 1} 個分類格式錯誤`);
      return;
    }

    const links = Array.isArray(section.links)
      ? section.links
      : Array.isArray(section.list)
        ? section.list.flatMap(item => Array.isArray(item?.links) ? item.links : [])
        : [];

    const validLinks = links.filter((link, linkIndex) => {
      if (!validLink(link)) {
        errors.push(`${section.taxonomy}：第 ${linkIndex + 1} 個網站資料格式錯誤`);
        return false;
      }
      return true;
    });

    sections.push({ ...section, links: validLinks });
  });

  if (!sections.length) throw new Error("沒有可用的網站分類");
  if (errors.length) console.warn("NAV 資料驗證警告：", errors);

  return sections;
}
