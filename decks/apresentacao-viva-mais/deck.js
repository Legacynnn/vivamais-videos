(() => {
  const params = new URLSearchParams(location.search);

  const CROSS =
    "M80.4 125.28C70.72 125.28 62.85 117.41 62.85 107.73V99.86C62.85 99.07 62.2 98.42 61.41 98.42H53.54C43.86 98.42 35.99 90.55 35.99 80.87C35.99 71.19 43.86 63.32 53.54 63.32H61.41C62.2 63.32 62.85 62.67 62.85 61.88V54.01C62.85 44.33 70.72 36.46 80.4 36.46C90.08 36.46 97.95 44.33 97.95 54.01V61.88C97.95 62.67 98.6 63.32 99.39 63.32H107.26C116.94 63.32 124.81 71.19 124.81 80.87C124.81 90.55 116.94 98.42 107.26 98.42H99.39C98.6 98.42 97.95 99.07 97.95 99.86V107.73C97.95 117.41 90.08 125.28 80.4 125.28ZM53.55 71.57C48.42 71.57 44.24 75.75 44.24 80.88C44.24 86.01 48.42 90.19 53.55 90.19H61.42C66.76 90.19 71.1 94.53 71.1 99.87V107.74C71.1 112.87 75.28 117.05 80.41 117.05C85.54 117.05 89.72 112.87 89.72 107.74V99.87C89.72 94.53 94.06 90.19 99.4 90.19H107.27C112.4 90.19 116.58 86.01 116.58 80.88C116.58 75.75 112.4 71.57 107.27 71.57H99.4C94.06 71.57 89.72 67.23 89.72 61.89V54.02C89.72 48.89 85.54 44.71 80.41 44.71C75.28 44.71 71.1 48.89 71.1 54.02V61.89C71.1 67.23 66.76 71.57 61.42 71.57H53.55Z";
  const SOLID = CROSS.slice(0, CROSS.indexOf("Z") + 1);
  const SPARK =
    "M125.76 47.15C125.76 47.46 125.51 47.71 125.2 47.71H122.46C119.12 47.71 116.4 50.43 116.4 53.77V56.51C116.4 56.82 116.15 57.07 115.84 57.07C115.53 57.07 115.28 56.82 115.28 56.51V53.77C115.28 50.43 112.56 47.71 109.22 47.71H106.48C106.17 47.71 105.92 47.46 105.92 47.15C105.92 46.84 106.17 46.59 106.48 46.59H109.22C112.56 46.59 115.28 43.87 115.28 40.53V37.79C115.28 37.48 115.53 37.23 115.84 37.23C116.15 37.23 116.4 37.48 116.4 37.79V40.53C116.4 43.87 119.12 46.59 122.46 46.59H125.2C125.51 46.59 125.76 46.84 125.76 47.15Z";
  const BOX = "35.5 36 89.8 89.8";
  const SHAPES = {
    cross: `<svg viewBox="${BOX}"><path d="${CROSS}"/></svg>`,
    solid: `<svg viewBox="${BOX}"><path d="${SOLID}"/></svg>`,
    spark: `<svg viewBox="105.4 36.7 20.9 20.9"><path d="${SPARK}"/></svg>`,
  };

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  defs.setAttribute("width", "0");
  defs.setAttribute("height", "0");
  defs.style.position = "absolute";
  defs.innerHTML = `<defs>
    <linearGradient id="vm-mark" x1="48" y1="49" x2="110" y2="110" gradientUnits="userSpaceOnUse"><stop stop-color="#4EEB8C"/><stop offset="0.5" stop-color="#62B8FF"/><stop offset="1" stop-color="#9531FF"/></linearGradient>
    <linearGradient id="vm-ring" x1="48" y1="49" x2="110" y2="110" gradientUnits="userSpaceOnUse"><stop stop-color="#4EEB8C" stop-opacity="0.95"/><stop offset="1" stop-color="#62B8FF" stop-opacity="0.45"/></linearGradient>
    <clipPath id="vm-clip"><path d="${SOLID}"/></clipPath>
  </defs>`;
  document.body.prepend(defs);

  document.querySelectorAll("[data-shape]").forEach((el) => {
    el.outerHTML = SHAPES[el.dataset.shape].replace("<svg", `<svg class="${el.className}"`);
  });

  document.querySelectorAll("[data-photo]").forEach((el) => {
    el.outerHTML = `<svg class="${el.className}" viewBox="${BOX}"><image href="${el.dataset.photo}" x="35.5" y="36" width="89.8" height="89.8" preserveAspectRatio="xMidYMid slice" clip-path="url(#vm-clip)"/></svg>`;
  });

  document.querySelectorAll("[data-deco]").forEach((el) => {
    el.outerHTML = `<svg class="deco ${el.dataset.deco}" viewBox="32 32 98 98"><path d="${CROSS}"/></svg>`;
  });

  document.querySelectorAll("[data-icon]").forEach((el) => {
    const body = window.VM_ICONS[el.dataset.icon];
    el.classList.add("icon");
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${el.dataset.sw || 2}" stroke-linecap="round" stroke-linejoin="round">${body || ""}</svg>`;
  });

  const slides = [...document.querySelectorAll(".slide")];
  const pad = (n) => String(n).padStart(2, "0");
  slides.forEach((s, i) => {
    s.dataset.n = i + 1;
    s.querySelectorAll("[data-page]").forEach((el) => {
      el.textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
    });
  });

  const deck = document.querySelector(".deck");

  if (params.has("print")) {
    document.body.classList.add("single", "print");
    slides.forEach((s) => s.classList.add("is-current"));
    return;
  }

  if (params.has("slide")) {
    document.body.classList.add("single");
    slides[Number(params.get("slide")) - 1]?.classList.add("is-current");
    deck.style.marginTop = `${Number(params.get("offset")) || 0}px`;
    return;
  }

  const fit = () => {
    const z = Math.min(1, (window.innerWidth - 48) / 1920);
    deck.style.transform = `scale(${z})`;
    deck.style.marginLeft = `${(window.innerWidth - 1920 * z) / 2}px`;
    document.body.style.height = `${deck.offsetHeight * z}px`;
  };
  fit();
  window.addEventListener("resize", fit);

  window.addEventListener("keydown", (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, PageDown: 1, ArrowLeft: -1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const mid = window.scrollY + window.innerHeight / 2;
    const tops = slides.map((s) => s.getBoundingClientRect().top + window.scrollY);
    let cur = tops.findLastIndex((t) => t <= mid);
    cur = Math.max(0, Math.min(slides.length - 1, cur + dir));
    const h = slides[cur].getBoundingClientRect().height;
    window.scrollTo({ top: tops[cur] - (window.innerHeight - h) / 2, behavior: "smooth" });
  });
})();
