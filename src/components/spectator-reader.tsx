import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { chapters, type Chapter, type MarginNote } from "@/lib/spectator-chapters";

type Props = {
  open: boolean;
  onClose: () => void;
  initialChapterId?: string;
};

// ─────────────────────────────────────────────────────────────
// Persistence
// ─────────────────────────────────────────────────────────────
type ReaderSettings = {
  fontSize: number; // 16..24
  lineHeight: number; // 1.5..2.1
  theme: "night" | "sepia" | "contrast";
};
type LastRead = { chapterId: string; scrollTop: number };
type UserNote = MarginNote & { id: string; createdAt: number; author?: "you" };

const LS_SETTINGS = "spectator:settings";
const LS_LAST = "spectator:lastRead";
const LS_NOTES = (chapterId: string) => `spectator:notes:${chapterId}`;

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

const defaultSettings: ReaderSettings = {
  fontSize: 20,
  lineHeight: 1.85,
  theme: "night",
};

// ─────────────────────────────────────────────────────────────
// Inline formatting
// ─────────────────────────────────────────────────────────────
function renderInline(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="italic opacity-90">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─────────────────────────────────────────────────────────────
// Ambient soundtrack (Web Audio)
// ─────────────────────────────────────────────────────────────
function useAmbientDrone(playing: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!playing) {
      nodesRef.current?.stop();
      nodesRef.current = null;
      return;
    }
    const AC =
      typeof window !== "undefined"
        ? (window.AudioContext || (window as any).webkitAudioContext)
        : null;
    if (!AC) return;
    const ctx: AudioContext = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2.5);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;
    filter.Q.value = 0.7;
    filter.connect(master);

    const freqs = [110, 164.81, 220];
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? "triangle" : "sine";
      o.frequency.value = f;
      o.detune.value = (i - 1) * 6;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.15 : 0.4;
      o.connect(g).connect(filter);
      o.start();
      return { o, g };
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    nodesRef.current = {
      stop: () => {
        try {
          master.gain.cancelScheduledValues(ctx.currentTime);
          master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
          setTimeout(() => {
            oscs.forEach(({ o }) => o.stop());
            lfo.stop();
            master.disconnect();
            filter.disconnect();
          }, 900);
        } catch {
          /* noop */
        }
      },
    };

    return () => {
      nodesRef.current?.stop();
      nodesRef.current = null;
    };
  }, [playing]);

  useEffect(() => {
    return () => {
      nodesRef.current?.stop();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);
}

// ─────────────────────────────────────────────────────────────
// Theme palettes
// ─────────────────────────────────────────────────────────────
const themePalette = {
  night: {
    bg: "#08080f",
    text: "rgba(240,240,255,0.92)",
    muted: "rgba(240,240,255,0.55)",
    accent: "rgb(122,140,255)",
    surface: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.10)",
    glow:
      "radial-gradient(1200px 700px at 50% -10%, rgba(0,102,255,0.14), transparent 60%), radial-gradient(900px 600px at 50% 110%, rgba(120,0,255,0.10), transparent 60%)",
  },
  sepia: {
    bg: "#1c1610",
    text: "rgba(245,232,208,0.94)",
    muted: "rgba(245,232,208,0.60)",
    accent: "rgb(217,168,110)",
    surface: "rgba(245,232,208,0.06)",
    border: "rgba(245,232,208,0.12)",
    glow:
      "radial-gradient(1200px 700px at 50% -10%, rgba(217,168,110,0.14), transparent 60%)",
  },
  contrast: {
    bg: "#000000",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.75)",
    accent: "#ffe86b",
    surface: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.25)",
    glow: "none",
  },
} as const;

export function SpectatorReader({ open, onClose, initialChapterId }: Props) {
  // Settings (persisted)
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  useEffect(() => {
    setSettings(readLS<ReaderSettings>(LS_SETTINGS, defaultSettings));
  }, []);
  useEffect(() => {
    writeLS(LS_SETTINGS, settings);
  }, [settings]);

  // Chapter — restore last read on open unless caller pinned one
  const [chapterId, setChapterId] = useState<string>(
    initialChapterId ?? chapters[chapters.length - 1].id,
  );
  useEffect(() => {
    if (!open) return;
    if (initialChapterId) {
      setChapterId(initialChapterId);
      return;
    }
    const last = readLS<LastRead | null>(LS_LAST, null);
    if (last?.chapterId && chapters.find((c) => c.id === last.chapterId)) {
      setChapterId(last.chapterId);
    }
  }, [open, initialChapterId]);

  const chapter: Chapter =
    chapters.find((c) => c.id === chapterId) ?? chapters[0];
  const chapterIndex = chapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex >= 0 && chapterIndex < chapters.length - 1
      ? chapters[chapterIndex + 1]
      : null;
  const goToChapter = useCallback(
    (id: string) => {
      setChapterId(id);
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: 0, behavior: "auto" });
    },
    [],
  );

  // User-authored margin notes per chapter
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  useEffect(() => {
    setUserNotes(readLS<UserNote[]>(LS_NOTES(chapterId), []));
  }, [chapterId]);
  useEffect(() => {
    writeLS(LS_NOTES(chapterId), userNotes);
  }, [chapterId, userNotes]);

  const notesByParagraph = useMemo(() => {
    const m = new Map<number, { note: MarginNote; user: boolean; id?: string }[]>();
    (chapter.notes ?? []).forEach((n) => {
      const arr = m.get(n.paragraph) ?? [];
      arr.push({ note: n, user: false });
      m.set(n.paragraph, arr);
    });
    userNotes.forEach((n) => {
      const arr = m.get(n.paragraph) ?? [];
      arr.push({ note: n, user: true, id: n.id });
      m.set(n.paragraph, arr);
    });
    return m;
  }, [chapter, userNotes]);

  const [showNotes, setShowNotes] = useState(true);
  const [soundtrack, setSoundtrack] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [openNoteKey, setOpenNoteKey] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [composeFor, setComposeFor] = useState<number | null>(null);
  const [draft, setDraft] = useState({ label: "", body: "", kind: "creative" as MarginNote["kind"] });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const setScrollRef = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node;
    setScrollEl(node);
  }, []);
  const containerRef = useMemo(
    () => ({ current: scrollEl }) as { current: HTMLDivElement | null },
    [scrollEl],
  );
  const { scrollYProgress } = useScroll(
    scrollEl ? { container: containerRef } : {},
  );
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  // Body scroll lock + esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Restore/save scroll position per chapter
  const suppressScrollSave = useRef(false);
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    const last = readLS<LastRead | null>(LS_LAST, null);
    suppressScrollSave.current = true;
    requestAnimationFrame(() => {
      if (last && last.chapterId === chapterId && last.scrollTop > 0) {
        el.scrollTo({ top: last.scrollTop, behavior: "auto" });
      } else {
        el.scrollTo({ top: 0, behavior: "auto" });
      }
      setTimeout(() => (suppressScrollSave.current = false), 60);
    });
    setOpenNoteKey(null);
    setComposeFor(null);
    setEditingId(null);
  }, [chapterId, open]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (suppressScrollSave.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        writeLS(LS_LAST, { chapterId, scrollTop: el.scrollTop } satisfies LastRead);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [chapterId, open]);

  useAmbientDrone(open && soundtrack);
  useEffect(() => {
    if (!open) {
      setSoundtrack(false);
      setShowSettings(false);
    }
  }, [open]);

  const palette = themePalette[settings.theme];

  // Note editing helpers
  const startCompose = useCallback((paragraph: number) => {
    setComposeFor(paragraph);
    setEditingId(null);
    setDraft({ label: "", body: "", kind: "creative" });
  }, []);
  const startEdit = useCallback((n: UserNote) => {
    setEditingId(n.id);
    setComposeFor(n.paragraph);
    setDraft({ label: n.label, body: n.body, kind: n.kind ?? "creative" });
  }, []);
  const saveDraft = useCallback(() => {
    if (composeFor == null) return;
    const body = draft.body.trim();
    if (!body) {
      setComposeFor(null);
      setEditingId(null);
      return;
    }
    const label = draft.label.trim() || "Note";
    if (editingId) {
      setUserNotes((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? { ...n, label, body, kind: draft.kind }
            : n,
        ),
      );
    } else {
      const id =
        (typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now())) + "";
      setUserNotes((prev) => [
        ...prev,
        {
          id,
          paragraph: composeFor,
          label,
          body,
          kind: draft.kind,
          createdAt: Date.now(),
          author: "you",
        },
      ]);
    }
    setComposeFor(null);
    setEditingId(null);
    setDraft({ label: "", body: "", kind: "creative" });
  }, [composeFor, draft, editingId]);
  const deleteNote = useCallback((id: string) => {
    setUserNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(18px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`The Spectator — Chapter ${chapter.number}: ${chapter.title}`}
          style={{ color: palette.text }}
        >
          {/* Background wash */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: palette.bg, opacity: 0.97 }}
            onClick={onClose}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: palette.glow }}
          />

          {/* Slim scroll progress bar */}
          <motion.div
            className="fixed left-0 right-0 top-0 h-[2px] origin-left z-[90]"
            style={{
              scaleX: progress,
              background:
                settings.theme === "sepia"
                  ? "linear-gradient(90deg,#d9a86e,#f5e8d0)"
                  : settings.theme === "contrast"
                    ? "linear-gradient(90deg,#ffe86b,#ffffff)"
                    : "linear-gradient(90deg,#0066FF,#7A5CFF,#A78BFA)",
            }}
          />

          {/* Sticky header */}
          <div className="absolute inset-x-0 top-0 z-[85]">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-8 pt-5 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="text-[10px] uppercase tracking-[0.35em] shrink-0"
                  style={{ color: palette.accent }}
                >
                  Andre's Chronicle
                </span>
                <span
                  className="hidden sm:block h-4 w-px"
                  style={{ background: palette.border }}
                />
                <span
                  className="hidden sm:block font-editorial italic text-sm truncate"
                  style={{ color: palette.muted }}
                >
                  The Spectator
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="appearance-none text-xs sm:text-sm rounded-full pl-4 pr-9 py-2 cursor-pointer focus:outline-none focus:ring-1 transition"
                    style={{
                      background: palette.surface,
                      color: palette.text,
                      border: `1px solid ${palette.border}`,
                    }}
                    aria-label="Select chapter"
                  >
                    {chapters.map((c) => (
                      <option key={c.id} value={c.id} style={{ background: palette.bg, color: palette.text }}>
                        Ch. {c.number} · {c.title}
                        {c.status ? ` — ${c.status}` : ""}
                      </option>
                    ))}
                  </select>
                  <span
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                    style={{ color: palette.muted }}
                  >
                    ▾
                  </span>
                </div>
                <button
                  onClick={() => setShowSettings((v) => !v)}
                  aria-label="Reader settings"
                  aria-pressed={showSettings}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-sm transition active:scale-95"
                  style={{
                    background: palette.surface,
                    border: `1px solid ${palette.border}`,
                    color: showSettings ? palette.accent : palette.text,
                  }}
                >
                  ⚙
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close reader"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-sm transition active:scale-95"
                  style={{
                    background: palette.surface,
                    border: `1px solid ${palette.border}`,
                    color: palette.text,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Settings drawer */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mx-auto max-w-6xl px-4 sm:px-8"
                >
                  <div
                    className="rounded-2xl px-5 py-4 backdrop-blur-md"
                    style={{
                      background: palette.surface,
                      border: `1px solid ${palette.border}`,
                    }}
                  >
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.25em]" style={{ color: palette.muted }}>
                          Font size · {settings.fontSize}px
                        </label>
                        <input
                          type="range"
                          min={16}
                          max={24}
                          step={1}
                          value={settings.fontSize}
                          onChange={(e) =>
                            setSettings((s) => ({ ...s, fontSize: Number(e.target.value) }))
                          }
                          className="w-full mt-2 accent-[--acc]"
                          style={{ ["--acc" as any]: palette.accent }}
                        />
                        <div className="flex gap-1 mt-1 text-[10px]" style={{ color: palette.muted }}>
                          {[16, 18, 20, 22, 24].map((s) => (
                            <button
                              key={s}
                              onClick={() => setSettings((cur) => ({ ...cur, fontSize: s }))}
                              className="px-1.5 py-0.5 rounded hover:underline"
                              style={{ color: settings.fontSize === s ? palette.accent : palette.muted }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.25em]" style={{ color: palette.muted }}>
                          Line height · {settings.lineHeight.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min={1.5}
                          max={2.1}
                          step={0.05}
                          value={settings.lineHeight}
                          onChange={(e) =>
                            setSettings((s) => ({ ...s, lineHeight: Number(e.target.value) }))
                          }
                          className="w-full mt-2"
                          style={{ accentColor: palette.accent }}
                        />
                        <div className="flex gap-1 mt-1 text-[10px]">
                          {[
                            { l: "Cozy", v: 1.6 },
                            { l: "Reader", v: 1.85 },
                            { l: "Airy", v: 2.05 },
                          ].map((p) => (
                            <button
                              key={p.l}
                              onClick={() => setSettings((cur) => ({ ...cur, lineHeight: p.v }))}
                              className="px-1.5 py-0.5 rounded"
                              style={{
                                color:
                                  Math.abs(settings.lineHeight - p.v) < 0.03
                                    ? palette.accent
                                    : palette.muted,
                              }}
                            >
                              {p.l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.25em]" style={{ color: palette.muted }}>
                          Theme
                        </label>
                        <div className="mt-2 flex gap-2">
                          {(["night", "sepia", "contrast"] as const).map((t) => {
                            const active = settings.theme === t;
                            const swatch =
                              t === "night"
                                ? "#08080f"
                                : t === "sepia"
                                  ? "#1c1610"
                                  : "#000000";
                            return (
                              <button
                                key={t}
                                onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                                className="flex-1 rounded-xl px-3 py-2 text-xs capitalize transition"
                                style={{
                                  background: swatch,
                                  border: `1px solid ${active ? palette.accent : palette.border}`,
                                  color: t === "sepia" ? "#f5e8d0" : "#ffffff",
                                  boxShadow: active ? `0 0 0 1px ${palette.accent} inset` : "none",
                                }}
                              >
                                {t === "night" ? "Night" : t === "sepia" ? "Sepia" : "High-contrast"}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px]" style={{ color: palette.muted }}>
                      <span>Preferences save automatically to this device.</span>
                      <button
                        onClick={() => setSettings(defaultSettings)}
                        className="underline underline-offset-2 hover:opacity-80"
                      >
                        Reset defaults
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corner controls */}
          <div className="absolute right-4 sm:right-8 bottom-6 z-[86] flex flex-col items-end gap-2">
            <button
              onClick={() => setShowNotes((v) => !v)}
              className="rounded-full px-4 py-2 text-xs flex items-center gap-2 transition active:scale-95 backdrop-blur-md"
              style={{
                background: palette.surface,
                border: `1px solid ${palette.border}`,
                color: showNotes ? palette.accent : palette.muted,
              }}
              aria-pressed={showNotes}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: showNotes ? palette.accent : palette.muted }}
              />
              Margin notes {showNotes ? "on" : "off"}
            </button>
            <button
              onClick={() => setSoundtrack((v) => !v)}
              className="rounded-full px-4 py-2 text-xs flex items-center gap-2 transition active:scale-95 backdrop-blur-md"
              style={{
                background: palette.surface,
                border: `1px solid ${palette.border}`,
                color: soundtrack ? palette.accent : palette.muted,
              }}
              aria-pressed={soundtrack}
            >
              <span
                className={
                  "inline-block h-1.5 w-1.5 rounded-full " + (soundtrack ? "animate-pulse" : "")
                }
                style={{ background: soundtrack ? palette.accent : palette.muted }}
              />
              Reading soundtrack {soundtrack ? "on" : "off"}
            </button>
          </div>

          {/* Scroll surface */}
          <motion.div
            ref={setScrollRef}
            className="relative h-full w-full overflow-y-auto"
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            exit={{ y: 24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <article className="mx-auto max-w-[980px] px-5 sm:px-10 pt-28 sm:pt-32 pb-40">
              {/* Chapter title block */}
              <header className="mb-14 sm:mb-20 text-center">
                <p
                  className="text-[10px] uppercase tracking-[0.35em] mb-4"
                  style={{ color: palette.accent }}
                >
                  Chapter {chapter.number}
                  {chapter.status ? ` · ${chapter.status}` : ""} · {chapter.minutes} min
                </p>
                <h1
                  className="font-editorial leading-[1.05]"
                  style={{
                    fontSize: `${Math.max(36, settings.fontSize * 2.4)}px`,
                    color: palette.text,
                  }}
                >
                  {chapter.title}
                </h1>
                <div
                  className="mt-8 flex items-center justify-center gap-3"
                  style={{ color: palette.muted }}
                >
                  <span className="h-px w-10" style={{ background: palette.border }} />
                  <span className="text-xs">✦</span>
                  <span className="h-px w-10" style={{ background: palette.border }} />
                </div>
              </header>

              {/* Reading column */}
              <div className="relative mx-auto max-w-[650px]">
                {chapter.paragraphs.map((p, i) => {
                  const entries = notesByParagraph.get(i);
                  const isDivider = p.trim() === "* * *";
                  if (isDivider) {
                    return (
                      <div
                        key={i}
                        className="my-10 flex items-center justify-center gap-3"
                        style={{ color: palette.muted }}
                      >
                        <span className="h-px w-6" style={{ background: palette.border }} />
                        <span className="text-xs">✦ ✦ ✦</span>
                        <span className="h-px w-6" style={{ background: palette.border }} />
                      </div>
                    );
                  }
                  const isFullItalic =
                    p.startsWith("*") &&
                    p.endsWith("*") &&
                    !p.slice(1, -1).includes("*");
                  return (
                    <div key={i} className="relative group">
                      <p
                        className="font-editorial mb-6"
                        style={{
                          fontSize: `${settings.fontSize}px`,
                          lineHeight: settings.lineHeight,
                          letterSpacing: "0.005em",
                          color: palette.text,
                          fontStyle: isFullItalic ? "italic" : "normal",
                          opacity: isFullItalic ? 0.85 : 1,
                        }}
                      >
                        {isFullItalic ? p.slice(1, -1) : renderInline(p)}
                        {showNotes && entries && entries.length > 0 && (
                          <span className="inline-flex align-super ml-1 gap-0.5">
                            {entries.map((e, ni) => {
                              const key = `${i}:${ni}`;
                              return (
                                <button
                                  key={ni}
                                  onClick={() =>
                                    setOpenNoteKey((v) => (v === key ? null : key))
                                  }
                                  className="text-[10px] font-sans underline decoration-dotted underline-offset-2 hover:opacity-80"
                                  style={{ color: e.user ? palette.accent : palette.muted }}
                                  aria-label={`Margin note: ${e.note.label}`}
                                >
                                  [{ni + 1}]
                                </button>
                              );
                            })}
                          </span>
                        )}
                      </p>

                      {/* Gutter panel (xl+) */}
                      {showNotes && (entries || composeFor === i) && (
                        <div className="pointer-events-none absolute top-0 left-full ml-6 hidden xl:block w-[260px]">
                          {entries?.map((e, ni) => {
                            const key = `${i}:${ni}`;
                            const isOpen = openNoteKey === key;
                            return (
                              <div
                                key={ni}
                                onClick={() =>
                                  setOpenNoteKey((v) => (v === key ? null : key))
                                }
                                className="pointer-events-auto mb-3 rounded-2xl p-3 cursor-pointer transition-all"
                                style={{
                                  background: palette.surface,
                                  border: `1px solid ${isOpen ? palette.accent : palette.border}`,
                                }}
                              >
                                <p
                                  className="text-[10px] uppercase tracking-[0.25em] flex items-center justify-between"
                                  style={{ color: palette.accent }}
                                >
                                  <span>
                                    {e.note.kind ?? "note"} · {e.note.label}
                                  </span>
                                  <span className="text-[9px]" style={{ color: palette.muted }}>
                                    {e.user ? "you" : "author"}
                                  </span>
                                </p>
                                <p
                                  className="font-editorial text-xs leading-[1.55] mt-1"
                                  style={{
                                    color: palette.text,
                                    opacity: 0.85,
                                    display: isOpen ? "block" : "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {e.note.body}
                                </p>
                                {isOpen && e.user && e.id && (
                                  <div className="mt-2 flex gap-2 text-[10px]">
                                    <button
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        startEdit(e.note as UserNote);
                                      }}
                                      className="underline underline-offset-2"
                                      style={{ color: palette.accent }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        deleteNote(e.id!);
                                      }}
                                      className="underline underline-offset-2"
                                      style={{ color: palette.muted }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {composeFor !== i && (
                            <button
                              onClick={() => startCompose(i)}
                              className="pointer-events-auto text-[10px] uppercase tracking-[0.2em] rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 transition"
                              style={{
                                background: palette.surface,
                                border: `1px dashed ${palette.border}`,
                                color: palette.muted,
                              }}
                            >
                              + Add note
                            </button>
                          )}
                        </div>
                      )}

                      {/* Inline add-note button for < xl */}
                      {showNotes && composeFor !== i && (
                        <button
                          onClick={() => startCompose(i)}
                          className="xl:hidden -mt-4 mb-4 text-[10px] uppercase tracking-[0.2em] rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                          style={{
                            background: palette.surface,
                            border: `1px dashed ${palette.border}`,
                            color: palette.muted,
                          }}
                        >
                          + Add note here
                        </button>
                      )}

                      {/* Small-screen expanded notes */}
                      {showNotes &&
                        entries?.map((e, ni) => {
                          const key = `${i}:${ni}`;
                          if (openNoteKey !== key) return null;
                          return (
                            <div
                              key={"m" + ni}
                              className="xl:hidden mb-6 -mt-2 rounded-2xl backdrop-blur-sm p-4"
                              style={{
                                background: palette.surface,
                                border: `1px solid ${palette.accent}`,
                              }}
                            >
                              <p
                                className="text-[10px] uppercase tracking-[0.25em] flex items-center justify-between"
                                style={{ color: palette.accent }}
                              >
                                <span>
                                  {e.note.kind ?? "note"} · {e.note.label}
                                </span>
                                <span className="text-[9px]" style={{ color: palette.muted }}>
                                  {e.user ? "you" : "author"}
                                </span>
                              </p>
                              <p
                                className="font-editorial text-sm leading-[1.6] mt-2"
                                style={{ color: palette.text }}
                              >
                                {e.note.body}
                              </p>
                              {e.user && e.id && (
                                <div className="mt-3 flex gap-3 text-[11px]">
                                  <button
                                    onClick={() => startEdit(e.note as UserNote)}
                                    className="underline underline-offset-2"
                                    style={{ color: palette.accent }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteNote(e.id!)}
                                    className="underline underline-offset-2"
                                    style={{ color: palette.muted }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}

                      {/* Compose / edit editor */}
                      {showNotes && composeFor === i && (
                        <div
                          className="mb-6 rounded-2xl p-4 backdrop-blur-md"
                          style={{
                            background: palette.surface,
                            border: `1px solid ${palette.accent}`,
                          }}
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <input
                              value={draft.label}
                              onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                              placeholder="Label (e.g. Foreshadow)"
                              className="flex-1 min-w-[160px] bg-transparent text-sm rounded-lg px-3 py-1.5 focus:outline-none"
                              style={{ border: `1px solid ${palette.border}`, color: palette.text }}
                            />
                            <select
                              value={draft.kind}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  kind: e.target.value as MarginNote["kind"],
                                }))
                              }
                              className="text-xs rounded-lg px-2 py-1.5 bg-transparent focus:outline-none"
                              style={{ border: `1px solid ${palette.border}`, color: palette.text }}
                            >
                              <option value="creative" style={{ background: palette.bg }}>
                                creative
                              </option>
                              <option value="technical" style={{ background: palette.bg }}>
                                technical
                              </option>
                              <option value="edit" style={{ background: palette.bg }}>
                                edit
                              </option>
                            </select>
                          </div>
                          <textarea
                            value={draft.body}
                            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                            placeholder="Write your annotation…"
                            rows={3}
                            className="w-full bg-transparent text-sm rounded-lg px-3 py-2 focus:outline-none font-editorial"
                            style={{ border: `1px solid ${palette.border}`, color: palette.text }}
                          />
                          <div className="mt-3 flex items-center justify-end gap-2 text-xs">
                            <button
                              onClick={() => {
                                setComposeFor(null);
                                setEditingId(null);
                              }}
                              className="px-3 py-1.5 rounded-full"
                              style={{ color: palette.muted }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveDraft}
                              className="px-3 py-1.5 rounded-full active:scale-95 transition"
                              style={{
                                background: palette.accent,
                                color: settings.theme === "sepia" ? "#1c1610" : "#08080f",
                              }}
                            >
                              {editingId ? "Save changes" : "Save note"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* End-of-chapter cap */}
                <div
                  className="mt-16 mb-4 flex items-center justify-center gap-3"
                  style={{ color: palette.muted }}
                >
                  <span className="h-px w-10" style={{ background: palette.border }} />
                  <span className="text-xs">end · ch. {chapter.number}</span>
                  <span className="h-px w-10" style={{ background: palette.border }} />
                </div>
                <p className="text-center text-xs" style={{ color: palette.muted }}>
                  {chapter.status === "Drafting"
                    ? "This chapter is still being written. Come back — it will change."
                    : "Thanks for reading. — Andre"}
                </p>

                {/* Prev / Next chapter navigation */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prevChapter ? (
                    <button
                      onClick={() => goToChapter(prevChapter.id)}
                      className="group text-left rounded-2xl p-4 transition active:scale-[0.98] hover:-translate-y-0.5"
                      style={{
                        background: palette.surface,
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <span
                        className="block text-[10px] uppercase tracking-[0.3em]"
                        style={{ color: palette.muted }}
                      >
                        ← Previous
                      </span>
                      <span
                        className="block font-editorial italic text-base mt-1"
                        style={{ color: palette.text }}
                      >
                        Ch. {prevChapter.number} · {prevChapter.title}
                      </span>
                    </button>
                  ) : (
                    <div />
                  )}
                  {nextChapter ? (
                    <button
                      onClick={() => goToChapter(nextChapter.id)}
                      className="group text-right rounded-2xl p-4 transition active:scale-[0.98] hover:-translate-y-0.5 sm:col-start-2"
                      style={{
                        background: palette.surface,
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <span
                        className="block text-[10px] uppercase tracking-[0.3em]"
                        style={{ color: palette.accent }}
                      >
                        Next →
                      </span>
                      <span
                        className="block font-editorial italic text-base mt-1"
                        style={{ color: palette.text }}
                      >
                        Ch. {nextChapter.number} · {nextChapter.title}
                      </span>
                    </button>
                  ) : (
                    <div className="sm:col-start-2 text-right text-xs" style={{ color: palette.muted }}>
                      You're at the latest chapter.
                    </div>
                  )}
                </div>
              </div>
            </article>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SpectatorReader;
