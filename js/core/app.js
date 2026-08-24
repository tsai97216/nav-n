import { state } from "./state.js";
import { EVENTS, emit } from "./events.js";
import { loadVersion } from "./version.js";
import { loadData } from "../data/loader.js";
import { validateData } from "../data/validator.js";
import { normalizeData } from "../data/normalizer.js";
import { renderSections } from "../ui/render.js";
import { renderNavigation } from "../ui/navigation.js";
import { initializeSearch } from "../ui/search.js";

export async function start() {
  const content = document.querySelector("#content");

  if (!content) {
    throw new Error("NAV content container not found.");
  }

  try {
    let version = null;

    try {
      version = await loadVersion();
      state.version = version;
      emit(EVENTS.VERSION_READY, { version });
    } catch (error) {
      console.warn("NAV 版本資訊載入失敗，繼續使用 NAV：", error);
    }

    const rawData = await loadData(version);
    const validatedData = validateData(rawData);
    const normalizedData = normalizeData(validatedData);

    state.data = normalizedData;
    emit(EVENTS.DATA_READY, { data: normalizedData });

    renderSections(state.data);
    renderNavigation();
    initializeSearch();

    emit(EVENTS.READY, {
      version: state.version,
      data: state.data
    });
  } catch (error) {
    state.error = error;
    emit(EVENTS.ERROR, { error });

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
