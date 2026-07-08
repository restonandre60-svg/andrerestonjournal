import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { chapters, type Chapter, type MarginNote } from "@/lib/spectator-chapters";

type Props = {
  open: boolean;
  onClose: () => void;
  initialChapterId?: string;
};

/** Renders markdown-ish text: *italic*, and preserves smart quotes. */
function renderInline(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="italic text-foreground/85">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/** Soft, layered ambient drone built in the browser — no network required. */
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

    // Two detuned sines + one soft triangle for warmth
    const freqs = [110, 164.81, 220]; // A2, E3, A3
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

    // Slow LFO on filter cutoff for movement
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

export function SpectatorReader({ open, onClose, initialChapterId }: Props) {
  const [chapterId, setChapterId] = useState(
    initialChapterId ?? chapters[chapters.length - 1].id,
  );
  const [showNotes, setShowNotes] = useState(true);
  const [soundtrack, setSoundtrack] = useState(false);
  const [openNoteIdx, setOpenNoteIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const chapter: Chapter =
    chapters.find((c) => c.id === chapterId) ?? chapters[0];
  const notesByParagraph = useMemo(() => {
    const m = new Map<number, MarginNote[]>();
    (chapter.notes ?? []).forEach((n) => {
      const arr = m.get(n.paragraph) ?? [];
      arr.push(n);
      m.set(n.paragraph, arr);
    });
    return m;
  }, [chapter]);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  // Lock body scroll while open; reset scroll when changing chapters.
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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setOpenNoteIdx(null);
  }, [chapterId]);

  useAmbientDrone(open && soundtrack);

  useEffect(() => {
    if (!open) setSoundtrack(false);
  }, [open]);

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
        >
          {/* Background wash */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[#08080f]/95"
            onClick={onClose}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(1200px 700px at 50% -10%, rgba(0,102,255,0.14), transparent 60%), radial-gradient(900px 600px at 50% 110%, rgba(120,0,255,0.10), transparent 60%)",
            }}
          />

          {/* Slim scroll progress bar (2px) */}
          <motion.div
            className="fixed left-0 right-0 top-0 h-[2px] origin-left bg-gradient-to-r from-[#0066FF] via-[#7A5CFF] to-[#A78BFA] z-[90]"
            style={{ scaleX: progress }}
          />

          {/* Sticky header */}
          <div className="absolute inset-x-0 top-0 z-[85]">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-8 pt-5 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] uppercase tracking-[0.35em] text-primary shrink-0">
                  Andre's Chronicle
                </span>
                <span className="hidden sm:block h-4 w-px bg-white/15" />
                <span className="hidden sm:block font-editorial italic text-sm text-foreground/75 truncate">
                  The Spectator
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="appearance-none bg-white/5 hover:bg-white/10 transition text-xs sm:text-sm rounded-full border border-white/10 pl-4 pr-9 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60 cursor-pointer"
                    aria-label="Select chapter"
                  >
                    {chapters.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0f0f18]">
                        Ch. {c.number} · {c.title}
                        {c.status ? ` — ${c.status}` : ""}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/60">
                    ▾
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close reader"
                  className="h-9 w-9 rounded-full glass flex items-center justify-center text-sm hover:bg-white/10 transition active:scale-95"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Corner controls: notes + soundtrack */}
          <div className="absolute right-4 sm:right-8 bottom-6 z-[86] flex flex-col items-end gap-2">
            <button
              onClick={() => setShowNotes((v) => !v)}
              className={
                "glass rounded-full px-4 py-2 text-xs flex items-center gap-2 transition active:scale-95 " +
                (showNotes ? "text-primary" : "text-foreground/70")
              }
              aria-pressed={showNotes}
            >
              <span
                className={
                  "inline-block h-1.5 w-1.5 rounded-full " +
                  (showNotes ? "bg-primary" : "bg-white/30")
                }
              />
              Margin notes {showNotes ? "on" : "off"}
            </button>
            <button
              onClick={() => setSoundtrack((v) => !v)}
              className={
                "glass rounded-full px-4 py-2 text-xs flex items-center gap-2 transition active:scale-95 " +
                (soundtrack ? "text-primary" : "text-foreground/70")
              }
              aria-pressed={soundtrack}
            >
              <span
                className={
                  "inline-block h-1.5 w-1.5 rounded-full " +
                  (soundtrack ? "bg-primary animate-pulse" : "bg-white/30")
                }
              />
              Reading soundtrack {soundtrack ? "on" : "off"}
            </button>
          </div>

          {/* Scroll surface */}
          <motion.div
            ref={scrollRef}
            className="relative h-full w-full overflow-y-auto"
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            exit={{ y: 24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <article className="mx-auto max-w-[980px] px-5 sm:px-10 pt-28 sm:pt-32 pb-40">
              {/* Chapter title block */}
              <header className="mb-14 sm:mb-20 text-center">
                <p className="text-[10px] uppercase tracking-[0.35em] text-primary mb-4">
                  Chapter {chapter.number}
                  {chapter.status ? ` · ${chapter.status}` : ""} · {chapter.minutes} min
                </p>
                <h1 className="font-editorial text-4xl sm:text-6xl leading-[1.05] text-foreground">
                  {chapter.title}
                </h1>
                <div className="mt-8 flex items-center justify-center gap-3 text-foreground/40">
                  <span className="h-px w-10 bg-white/15" />
                  <span className="text-xs">✦</span>
                  <span className="h-px w-10 bg-white/15" />
                </div>
              </header>

              {/* Reading column with side gutter for notes */}
              <div className="relative mx-auto max-w-[650px]">
                {chapter.paragraphs.map((p, i) => {
                  const notes = notesByParagraph.get(i);
                  const isDivider = p.trim() === "* * *";
                  if (isDivider) {
                    return (
                      <div
                        key={i}
                        className="my-10 flex items-center justify-center gap-3 text-foreground/40"
                      >
                        <span className="h-px w-6 bg-white/15" />
                        <span className="text-xs">✦ ✦ ✦</span>
                        <span className="h-px w-6 bg-white/15" />
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
                        className={
                          "font-editorial text-[19px] sm:text-[20px] leading-[1.85] tracking-[0.005em] text-foreground/90 mb-6 " +
                          (isFullItalic ? "italic text-foreground/75" : "")
                        }
                      >
                        {isFullItalic
                          ? p.slice(1, -1)
                          : renderInline(p)}
                        {showNotes && notes && notes.length > 0 && (
                          <span className="inline-flex align-super ml-1 gap-0.5">
                            {notes.map((_, ni) => {
                              const idx = i * 100 + ni;
                              return (
                                <button
                                  key={ni}
                                  onClick={() =>
                                    setOpenNoteIdx((v) => (v === idx ? null : idx))
                                  }
                                  className="text-[10px] font-sans text-primary/90 hover:text-primary underline decoration-dotted underline-offset-2"
                                  aria-label={`Margin note: ${notes[ni].label}`}
                                >
                                  [{ni + 1}]
                                </button>
                              );
                            })}
                          </span>
                        )}
                      </p>

                      {/* Gutter tooltip / margin note */}
                      {showNotes && notes && notes.length > 0 && (
                        <div className="pointer-events-none absolute top-0 left-full ml-6 hidden xl:block w-[240px]">
                          {notes.map((n, ni) => {
                            const idx = i * 100 + ni;
                            const isOpen = openNoteIdx === idx;
                            return (
                              <button
                                key={ni}
                                onClick={() =>
                                  setOpenNoteIdx((v) =>
                                    v === idx ? null : idx,
                                  )
                                }
                                className={
                                  "pointer-events-auto block text-left w-full mb-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm p-3 transition-all " +
                                  (isOpen
                                    ? "border-primary/40 bg-white/[0.06]"
                                    : "")
                                }
                              >
                                <p className="text-[10px] uppercase tracking-[0.25em] text-primary/90">
                                  {n.kind ?? "note"} · {n.label}
                                </p>
                                <p
                                  className={
                                    "font-editorial text-xs leading-[1.55] text-foreground/75 mt-1 " +
                                    (isOpen ? "" : "line-clamp-2")
                                  }
                                >
                                  {n.body}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Small-screen expanded note */}
                      {showNotes &&
                        notes &&
                        notes.map((n, ni) => {
                          const idx = i * 100 + ni;
                          if (openNoteIdx !== idx) return null;
                          return (
                            <div
                              key={"m" + ni}
                              className="xl:hidden mb-6 -mt-2 rounded-2xl border border-primary/30 bg-white/[0.04] backdrop-blur-sm p-4"
                            >
                              <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
                                {n.kind ?? "note"} · {n.label}
                              </p>
                              <p className="font-editorial text-sm leading-[1.6] text-foreground/85 mt-2">
                                {n.body}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}

                {/* End-of-chapter cap */}
                <div className="mt-16 mb-4 flex items-center justify-center gap-3 text-foreground/40">
                  <span className="h-px w-10 bg-white/15" />
                  <span className="text-xs">
                    end · ch. {chapter.number}
                  </span>
                  <span className="h-px w-10 bg-white/15" />
                </div>
                <p className="text-center text-xs text-foreground/50">
                  {chapter.status === "Drafting"
                    ? "This chapter is still being written. Come back — it will change."
                    : "Thanks for reading. — Andre"}
                </p>
              </div>
            </article>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SpectatorReader;