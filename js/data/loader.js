import { CONFIG } from "../core/config.js";

export async function loadData(version = null) {
  const cacheVersion = version?.dataVersion ?? version?.version ?? null;
  const dataUrl = cacheVersion
    ? `${CONFIG.dataUrl}?v=${encodeURIComponent(cacheVersion)}`
    : CONFIG.dataUrl;

  const response = await fetch(dataUrl, {
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`資料載入失敗：HTTP ${response.status}`);

  try {
    const payload = await response.json();

    // GitHub connector/API generated wrappers may expose file text as `content`.
    // Accept that representation defensively, while keeping the normal array format.
    if (Array.isArray(payload)) return payload;

    if (payload && typeof payload.content === "string") {
      const data = JSON.parse(payload.content);
      if (Array.isArray(data)) return data;
    }

    throw new Error("data.json 必須包含 NAV 資料陣列");
  } catch (error) {
    if (error instanceof Error && error.message !== "Unexpected end of JSON input") {
      throw error;
    }
    throw new Error("data.json 不是有效的 JSON");
  }
}
