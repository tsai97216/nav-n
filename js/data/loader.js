import { CONFIG } from "../core/config.js";

export async function loadData(version = null) {
  const cacheVersion = version?.dataVersion ?? version?.version ?? CONFIG.version;
  const response = await fetch(`${CONFIG.dataUrl}?v=${encodeURIComponent(cacheVersion)}`, {
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`資料載入失敗：HTTP ${response.status}`);

  try {
    return await response.json();
  } catch {
    throw new Error("data.json 不是有效的 JSON");
  }
}
