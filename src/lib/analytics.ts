// Lightweight in-browser analytics: stores events in localStorage.
// Inspect anytime in DevTools: JSON.parse(localStorage.getItem("analytics.events"))
// Or on window: window.__analytics.summary()

type AnalyticsEvent = {
  type: string;
  props?: Record<string, string | number | boolean | undefined>;
  ts: number;
  path: string;
};

const KEY = "analytics.events";
const MAX = 500;

function read(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as AnalyticsEvent[];
  } catch {
    return [];
  }
}

function write(events: AnalyticsEvent[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(events.slice(-MAX)));
  } catch {
    /* ignore quota */
  }
}

export function track(type: string, props?: AnalyticsEvent["props"]) {
  if (typeof window === "undefined") return;
  const events = read();
  events.push({
    type,
    props,
    ts: Date.now(),
    path: window.location.pathname + window.location.hash,
  });
  write(events);
  // Also emit to console for quick inspection during dev.
  // eslint-disable-next-line no-console
  console.debug("[analytics]", type, props ?? {});
}

export function summary() {
  const events = read();
  const byType: Record<string, number> = {};
  for (const e of events) byType[e.type] = (byType[e.type] ?? 0) + 1;
  return { total: events.length, byType, events };
}

export function initAnalytics() {
  if (typeof window === "undefined") return;
  // Expose for manual inspection.
  (window as unknown as { __analytics: unknown }).__analytics = { track, summary, clear: () => write([]) };
  track("pageview");

  const onHash = () => track("pageview");
  window.addEventListener("hashchange", onHash);

  // Track section visibility once per section.
  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id;
        if (entry.isIntersecting && id && !seen.has(id)) {
          seen.add(id);
          track("section_view", { section: id });
        }
      }
    },
    { threshold: 0.35 },
  );
  requestAnimationFrame(() => {
    document.querySelectorAll("section[id]").forEach((el) => io.observe(el));
  });

  return () => {
    window.removeEventListener("hashchange", onHash);
    io.disconnect();
  };
}
