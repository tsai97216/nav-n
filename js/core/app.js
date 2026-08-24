import { state, setState } from "./state.js";
import { EVENTS, emit } from "./events.js";
import { loadVersion } from "./version.js";
import { loadPreferences } from "./preferences.js";
import { loadData } from "../data/loader.js";
import { validateData } from "../data/validator.js";
import { normalizeData } from "../data/normalizer.js";
import { renderSections } from "../ui/render.js";
import { renderNavigation } from "../ui/navigation.js";
import { initializeSearch } from "../ui/search.js";

function renderVersion(version) {
  const element = document.querySelector("#nav-version");
  if (!element) return;

  if (version?.version) {
    const build = version.build != null ? ` · build ${version.build}` : "";
    element.textContent = `Version ${version.version}${build}`;
  } else {
    element.textContent = "Version unavailable";
  }
}

export async function start() {
  const content = document.querySelector("#content");

  if (!content) {
    throw new Error("NAV content container not found.");
  }

  setState({ status: "loading", error: null });
  content.setAttribute("aria-busy", "true");
  content.innerHTML = `
    <section class="loading-state" aria-live="polite">
      <p>正在載入 NAV…</p>
    </section>
  `;

  try {
    let version = null;

    try {
      version = await loadVersion();
      setState({ version });
      renderVersion(version);
      emit(EVENTS.VERSION_READY, { version });
    } catch (error) {
      console.warn("NAV 版本資訊載入失敗，繼續使用 NAV：", error);
      renderVersion(null);
    }

    setState({ preferences: loadPreferences() });

    const rawData = await loadData(version);
    const validatedData = validateData(rawData);
    const normalizedData = normalizeData(validatedData);

    setState({ data: normalizedData });
    emit(EVENTS.DATA_READY, { data: normalizedData });

    renderSections(state.data);
    renderNavigation();
    initializeSearch();

    setState({ status: "ready", error: null });
    content.setAttribute("aria-busy", "false");
    emit(EVENTS.READY, {
      version: state.version,
      data: state.data,
      preferences: state.preferences
    });
  } catch (error) {
    setState({ status: "error", error });
    content.setAttribute("aria-busy", "false");
    emit(EVENTS.ERROR, { error });

    console.error("NAV 載入失敗：", error);
    content.innerHTML = `
      <section class="error-state" role="alert">
        <h3>目前無法載入 NAV</h3>
        <p>網站資料暫時無法載入，請稍後再試。</p>
      </section>
    `;
  }
}
