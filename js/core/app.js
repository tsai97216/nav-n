import { state } from "./state.js";
import { loadVersion } from "./version.js";
import { loadData } from "../data/loader.js";
import { validateData } from "../data/validator.js";
import { normalizeData } from "../data/normalizer.js";
import { renderSections } from "../ui/render.js";
import { renderNavigation } from "../ui/navigation.js";
import { initializeSearch } from "../ui/search.js";

export async function start() {
  const content = document.querySelector("#content");

  try {
    let version = null;

    try {
      version = await loadVersion();
      state.version = version;
    } catch (error) {
      console.warn("NAV 版本資訊載入失敗，繼續使用 NAV：", error);
    }

    const rawData = await loadData(version);
    state.data = normalizeData(validateData(rawData));
    renderSections(state.data);
    renderNavigation();
    initializeSearch();
  } catch (error) {
    console.error("NAV 載入失敗：", error);
    content.innerHTML = `
      <section class="error-state">
        <h3>目前無法載入 NAV</h3>
        <p>網站資料暫時無法載入，請稍後再試。</p>
        <small>${error.message}</small>
      </section>
    `;
  }
}
