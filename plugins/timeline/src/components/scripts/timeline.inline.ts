// @ts-nocheck - Required for inline scripts that run in browser context

const BASE_PX_PER_DAY = 9.5;
const PAD = 3.6;
const TOP = 12;
const MIN_ZOOM = 2;
const MAX_ZOOM = 6;
const MIN_RADIUS = 3;
const MAX_RADIUS = 11;
const RADIUS_RANGE = MAX_RADIUS - MIN_RADIUS;
const ZOOM_KEY = "timelineZoom";
const SCROLL_KEY = "timelineScrollTop";

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

const DEFAULT_ZOOM = clamp(1, MIN_ZOOM, MAX_ZOOM);

function loadZoom() {
  try {
    const raw = sessionStorage.getItem(ZOOM_KEY);
    const z = raw ? parseFloat(raw) : DEFAULT_ZOOM;
    return Number.isFinite(z) ? clamp(z, MIN_ZOOM, MAX_ZOOM) : DEFAULT_ZOOM;
  } catch {
    return DEFAULT_ZOOM;
  }
}

function saveZoom(z) {
  try {
    sessionStorage.setItem(ZOOM_KEY, String(z));
  } catch {
    // ignore -- private browsing etc.
  }
}

// Lays out every .timeline-node inside `container` given the current zoom
// level, sets each dot's radius from its word count, places month labels,
// and sizes the container to fit all of it.
function layout(container, zoom) {
  const nodes = Array.from(container.querySelectorAll(".timeline-node"));
  container.querySelectorAll(".timeline-month").forEach((el) => el.remove());
  if (nodes.length === 0) {
    container.style.height = `${TOP}px`;
    return;
  }

  const pxPerDay = BASE_PX_PER_DAY * zoom;

  let maxDays = 0;
  let maxWords = 0;
  const parsed = nodes.map((node) => {
    const days = parseInt(node.dataset.days, 10) || 0;
    const words = parseInt(node.dataset.words, 10) || 0;
    if (days > maxDays) maxDays = days;
    if (words > maxWords) maxWords = words;
    return { node, days, words };
  });

  const radiusOf = (words) => {
    if (maxWords <= 0) return MIN_RADIUS;
    const ratio = clamp(Math.sqrt(words) / Math.sqrt(maxWords), 0, 1);
    return MIN_RADIUS + RADIUS_RANGE * ratio;
  };

  // Walk newest -> oldest (largest `days` first) so each dot only has to
  // avoid the one already placed above it.
  const ordered = parsed.slice().sort((a, b) => b.days - a.days);

  const positions = [];
  let prevY;
  let prevR;
  ordered.forEach(({ node, days, words }, i) => {
    const r = radiusOf(words);
    const idealY = TOP + (maxDays - days) * pxPerDay;
    const y = i === 0 ? Math.max(idealY, TOP + r) : Math.max(idealY, prevY + prevR + r + PAD);
    positions.push({ node, y, r });
    prevY = y;
    prevR = r;
  });

  for (const { node, y, r } of positions) {
    node.style.top = `${y}px`;
    const dot = node.querySelector(".timeline-dot");
    if (dot) {
      dot.style.width = `${r * 2}px`;
      dot.style.height = `${r * 2}px`;
    }
  }

  for (const { node, y } of positions) {
    if (node.dataset.firstOfMonth !== "true") continue;
    const label = document.createElement("div");
    label.className = "timeline-month";
    label.textContent = node.dataset.month || "";
    label.style.top = `${y}px`;
    container.appendChild(label);
  }

  const last = positions[positions.length - 1];
  container.style.height = `${last.y + last.r + PAD}px`;
}

function initTimeline(container) {
  if (container.dataset.initialized === "true") return;
  container.dataset.initialized = "true";

  let zoom = loadZoom();
  layout(container, zoom);

  try {
    const savedScroll = sessionStorage.getItem(SCROLL_KEY);
    if (savedScroll != null) {
      container.scrollTop = parseInt(savedScroll, 10) || 0;
    } else {
      const current = container.querySelector('.timeline-node[data-current="true"]');
      if (current) {
        const y = parseFloat(current.style.top) || 0;
        container.scrollTop = Math.max(0, y - container.clientHeight / 2);
      }
    }
  } catch {
    // ignore
  }

  const onWheel = (e) => {
    // Plain two-finger scroll is left completely alone; only ctrl/cmd+wheel
    // (and macOS trackpad pinch, which arrives as wheel with ctrlKey=true)
    // zooms.
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();

    const rect = container.getBoundingClientRect();
    const cursorViewportY = e.clientY - rect.top;
    const cursorContentY = container.scrollTop + cursorViewportY;

    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM);
    if (newZoom === zoom) return;

    const ratio = newZoom / zoom;
    zoom = newZoom;
    saveZoom(zoom);
    layout(container, zoom);
    container.scrollTop = cursorContentY * ratio - cursorViewportY;
  };

  container.addEventListener("wheel", onWheel, { passive: false });

  if (typeof window !== "undefined" && window.addCleanup) {
    window.addCleanup(() => container.removeEventListener("wheel", onWheel));
  }
}

function handleNavOrRender() {
  document.querySelectorAll(".timeline[data-timeline]").forEach((container) => {
    initTimeline(container);
  });
}

document.addEventListener("nav", handleNavOrRender);
document.addEventListener("render", handleNavOrRender);

document.addEventListener("prenav", () => {
  const container = document.querySelector(".timeline[data-timeline]");
  if (!container) return;
  try {
    sessionStorage.setItem(SCROLL_KEY, String(container.scrollTop));
  } catch {
    // ignore
  }
});
