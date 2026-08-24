function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isValidUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateLink(link, path, errors) {
  if (!link || typeof link !== "object") {
    errors.push(`${path} 必須是物件`);
    return false;
  }

  let valid = true;

  if (!isNonEmptyString(link.title)) {
    errors.push(`${path}.title 必須是非空字串`);
    valid = false;
  }

  if (!isValidUrl(link.url)) {
    errors.push(`${path}.url 必須是有效的 HTTP/HTTPS URL`);
    valid = false;
  }

  if (typeof link.description !== "string") {
    errors.push(`${path}.description 必須是字串`);
    valid = false;
  }

  if (link.icon !== undefined && typeof link.icon !== "string") {
    errors.push(`${path}.icon 必須是字串`);
    valid = false;
  }

  return valid;
}

function validateLinks(links, path, errors) {
  if (!Array.isArray(links)) {
    errors.push(`${path} 必須是陣列`);
    return [];
  }

  return links.filter((link, index) =>
    validateLink(link, `${path}[${index}]`, errors)
  );
}

export function validateData(data) {
  if (!Array.isArray(data)) {
    throw new Error("資料格式錯誤：頂層必須是陣列");
  }

  const errors = [];
  const seenUrls = new Set();
  const sections = [];

  data.forEach((section, sectionIndex) => {
    const path = `分類[${sectionIndex}]`;

    if (!section || typeof section !== "object") {
      errors.push(`${path} 必須是物件`);
      return;
    }

    if (!isNonEmptyString(section.taxonomy)) {
      errors.push(`${path}.taxonomy 必須是非空字串`);
      return;
    }

    const sectionLinks = [];

    if (section.links !== undefined) {
      sectionLinks.push(...validateLinks(section.links, `${path}.links`, errors));
    }

    if (section.list !== undefined) {
      if (!Array.isArray(section.list)) {
        errors.push(`${path}.list 必須是陣列`);
      } else {
        section.list.forEach((subcategory, subIndex) => {
          const subPath = `${path}.list[${subIndex}]`;

          if (!subcategory || typeof subcategory !== "object") {
            errors.push(`${subPath} 必須是物件`);
            return;
          }

          if (!isNonEmptyString(subcategory.term)) {
            errors.push(`${subPath}.term 必須是非空字串`);
          }

          if (subcategory.links !== undefined) {
            sectionLinks.push(
              ...validateLinks(subcategory.links, `${subPath}.links`, errors)
            );
          } else {
            errors.push(`${subPath}.links 必須存在`);
          }
        });
      }
    }

    sectionLinks.forEach((link) => {
      const normalizedUrl = link.url.trim().replace(/\/$/, "").toLowerCase();
      if (seenUrls.has(normalizedUrl)) {
        errors.push(`重複網站 URL：${link.url}`);
      } else {
        seenUrls.add(normalizedUrl);
      }
    });

    if (sectionLinks.length === 0) {
      errors.push(`${path} 沒有任何有效網站`);
    }

    sections.push({ ...section, links: sectionLinks });
  });

  if (errors.length > 0) {
    const error = new Error(`NAV 資料驗證失敗：${errors.join("；")}`);
    error.validationErrors = errors;
    throw error;
  }

  return sections;
}
