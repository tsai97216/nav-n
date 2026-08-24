import { getVisibleSections } from "./render.js";

export function renderNavigation() {
  const menu = document.querySelector("#nav-menu");
  const sections = getVisibleSections();

  menu.innerHTML = sections.map((section, index) => `
    <button type="button" data-section="section-${index}">${section.taxonomy}</button>
  `).join("");

  menu.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.section)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}
