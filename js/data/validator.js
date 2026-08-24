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

function normalizeUrl(value) {
  return value.trim().replace(/\/$/, "").toLowerCase();
}

export function validateData(data) {
  if (!Array.isArray(data)) {
    throw new Error("資料格式錯誤：頂層必須是陣列");
  }

  const errors = [];
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
    const directLinks = [];

    if (section.links !== undefined) {
      const validatedDirectLinks = validateLinks(section.links, `${path}.links`, errors);
      sectionLinks.push(...validatedDirectLinks);
      directLinks.push(...validatedDirectLinks);
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

    // 同一個分類內不能重複；不同分類可以刻意收錄同一網站。
    const sectionUrls = new Set();
    sectionLinks.forEach(link => {
      const normalizedUrl = normalizeUrl(link.url);
      if (sectionUrls.has(normalizedUrl)) {
        errors.push(`同一分類內重複網站 URL：${link.url}`);
      } else {
        sectionUrls.add(normalizedUrl);
      }
    });

    if (sectionLinks.length === 0) {
      errors.push(`${path} 沒有任何有效網站`);
    }

    // 保留原本的階層結構：taxonomy → list/subcategory → links。
    // 不要把子分類的 links 彙整到 section.links，否則 render.js
    // 會同時在大分類與子分類各渲染一次，造成網站重複顯示。
    sections.push({ ...section, links: directLinks });
  });

  if (errors.length > 0) {
    const error = new Error(`NAV 資料驗證失敗：${errors.join("；")}`);
    error.validationErrors = errors;
    throw error;
  }

  return sections;
}
