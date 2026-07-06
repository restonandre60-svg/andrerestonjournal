import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import spectatorCover from "@/assets/journal/spectator-cover.png.asset.json";
import sketchPortrait from "@/assets/journal/sketch-portrait.jpg.asset.json";
import sketchRose from "@/assets/journal/sketch-rose.jpg.asset.json";
import danceMedal from "@/assets/journal/dance-medal.jpg.asset.json";
import danceStage from "@/assets/journal/dance-stage.jpg.asset.json";
import chessPhoto from "@/assets/journal/chess.jpg.asset.json";
import cameraPhoto from "@/assets/journal/camera.jpg.asset.json";
import usherettePhoto from "@/assets/journal/usherette.jpg.asset.json";
import raszmaYoutube from "@/assets/journal/raszma-youtube.jpg.asset.json";
import gameValorant from "@/assets/journal/valorant-real.jpg.asset.json";
import gameGenshin from "@/assets/journal/genshin-real.jpg.asset.json";
import gameCrossfire from "@/assets/journal/crossfire-real.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
});

const projects = [
  {
    name: "dreflow",
    url: "https://dreflow.netlify.app",
    tag: "Flow · Focus",
    desc: "A dream-shaped workspace for uninterrupted thinking.",
  },
  {
    name: "andio-sage",
    url: "https://andio-sage.vercel.app",
    tag: "Audio · Ambient",
    desc: "A calm sonic companion for deep, slow hours.",
  },
  {
    name: "ancrest",
    url: "https://ancrest.vercel.app",
    tag: "Rest · Reflect",
    desc: "A quiet resting place between the noise.",
  },
  {
    name: "repodre",
    url: "https://repodre.vercel.app",
    tag: "Repo · Ship",
    desc: "A developer surface for shipping the small things.",
  },
];

const navItems = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Ship" },
  { id: "life", label: "Life" },
  { id: "words", label: "Words" },
  { id: "journal", label: "Journal" },
];

const journalEntries = [
  {
    date: "2026 · 07",
    title: "The night we won the dance floor",
    body: "Neon smoke, the stage lights breaking against our jackets. We hit the last count together and the crowd fell silent for a second — then everything erupted.",
  },
  {
    date: "2026 · 06",
    title: "Shipped repodre",
    body: "Fourth deploy. Small tool, but it does exactly one thing well. That is the whole discipline.",
  },
  {
    date: "2026 · 05",
    title: "Chess, again",
    body: "Lost the middlegame, won the endgame. There is a poem hidden inside every tempo.",
  },
  {
    date: "2026 · 04",
    title: "A page of The Spectator",
    body: "He watched the lamp gutter. Some truths, he had decided long ago, are not meant to be seen — only carried.",
  },
];

function Index() {
  const [mode, setMode] = useState<"code" | "creative">("code");
  const [activeEntry, setActiveEntry] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.09 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/40">
      <Navbar />
      <Hero mode={mode} />
      <Projects />
      <LifeBento />
      <StageBand />
      <Words />
      <Journal
        activeEntry={activeEntry}
        setActiveEntry={setActiveEntry}
        mode={mode}
      />
      <TactileDeck mode={mode} setMode={setMode} />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(94%,900px)]">
      <nav className="glass rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <a href="#hero" className="font-display text-sm sm:text-base font-semibold tracking-tight">
          CAR<span className="text-primary">.</span>
        </a>
        <ul className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          {navItems.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-white/5 transition"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#journal"
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:brightness-110 transition"
        >
          Read
        </a>
      </nav>
    </header>
  );
}

function Hero({ mode }: { mode: "code" | "creative" }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden"
    >
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-8"
      >
        Christian Andre C. Reston · Journal vol. I
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-center font-semibold leading-[0.95] text-[clamp(2.5rem,10vw,6rem)]"
      >
        Developer.
        <br />
        Writer.
        <br />
        <span className="text-primary">Creator.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="mt-8 max-w-xl text-center text-sm sm:text-base text-muted-foreground"
      >
        A living journal of shipped code, unfinished novels, quiet chess nights,
        stage lights, and pencil roses. Currently reading the world in{" "}
        <span className="text-foreground font-medium">
          {mode === "code" ? "code" : "creative"}
        </span>{" "}
        mode.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 flex flex-wrap justify-center gap-3"
      >
        <a
          href="#projects"
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition"
        >
          See the work
        </a>
        <a
          href="#words"
          className="px-5 py-2.5 rounded-full hairline text-sm font-medium hover:bg-white/5 transition"
        >
          Read the words
        </a>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
        scroll ↓
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-primary mb-3">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-[1.05]">
          {title}
        </h2>
      </div>
      {note && (
        <p className="text-sm text-muted-foreground max-w-xs">{note}</p>
      )}
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="px-6 py-24 sm:py-32 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Ship — 04"
        title="Deployed, in the wild."
        note="Four small products, each shipped end-to-end. Fewer things, more finish."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((p, i) => (
          <FadeUp key={p.name} delay={i * 0.08}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group block h-full hairline rounded-2xl p-5 bg-card/40 hover:bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {p.tag}
                </span>
                <span className="text-muted-foreground group-hover:text-primary transition">
                  ↗
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                {p.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
              <div className="mt-6 text-[11px] text-muted-foreground/70 truncate">
                {p.url.replace("https://", "")}
              </div>
            </a>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function LifeBento() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId ? bentoItems.find((b) => b.id === openId) ?? null : null;

  return (
    <section id="life" className="px-6 py-24 sm:py-32 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Life — Bento"
        title="Everything else I am."
        note="Tap any tile to open it — a mosaic of the quieter rooms where the writing, the moves, and the wins live."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
        {bentoItems.map((b, i) => (
          <FadeUp key={b.id} delay={i * 0.04} className={b.span ?? ""}>
            <motion.button
              layoutId={`bento-${b.id}`}
              onClick={() => setOpenId(b.id)}
              className={
                "group relative w-full h-full text-left rounded-3xl hairline overflow-hidden bg-card/40 flex flex-col justify-between " +
                (b.tall ? "min-h-[420px]" : "min-h-[180px]") +
                " hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-300 cursor-pointer"
              }
            >
              <BentoBackground item={b} />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative p-6 flex items-start justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
                  {b.tag}
                </span>
                <span className="text-muted-foreground/80 text-xs opacity-0 group-hover:opacity-100 transition">
                  expand ↗
                </span>
              </div>
              <div className="relative p-6 pt-0">
                <motion.h3
                  layoutId={`bento-title-${b.id}`}
                  className={
                    "font-display font-semibold " +
                    (b.tall
                      ? "text-4xl sm:text-5xl leading-[1.02]"
                      : "text-2xl")
                  }
                >
                  {b.title}
                </motion.h3>
                <p className="text-xs text-muted-foreground mt-1">{b.blurb}</p>
              </div>
            </motion.button>
          </FadeUp>
        ))}
      </div>

      <BentoExpanded item={open} onClose={() => setOpenId(null)} />
    </section>
  );
}

type BentoItem = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  detail: string;
  images: string[];
  span?: string;
  tall?: boolean;
  meta?: { label: string; value: string }[];
  link?: { label: string; href: string };
};

const bentoItems: BentoItem[] = [
  {
    id: "spectator",
    title: "The Spectator",
    tag: "Novel · unfinished",
    blurb: "a novel by Andre Reston — ch. 07 / drafting",
    detail:
      "Some truths are not meant to be seen — only carried, quietly, through the long streets of the city. He watched the lamp gutter. Some nights the sentence writes itself; most nights it does not.",
    images: [spectatorCover.url],
    span: "md:col-span-2 md:row-span-2",
    tall: true,
  },
  {
    id: "dance",
    title: "Dance",
    tag: "1st place",
    blurb: "Champions — medal, ours.",
    detail:
      "Neon smoke, the stage lights breaking against our jackets. We hit the last count together and the crowd fell silent for a second — then everything erupted.",
    images: [danceMedal.url, danceStage.url],
    meta: [{ label: "Result", value: "🏆 1st Place" }],
  },
  {
    id: "chess",
    title: "Chess",
    tag: "Board",
    blurb: "Endgames > openings.",
    detail:
      "I lose middlegames I should win, and win endgames I should lose. There is a poem hidden inside every tempo.",
    images: [chessPhoto.url],
  },
  {
    id: "video",
    title: "Video Editing",
    tag: "YouTube · @rszma1",
    blurb: "RASZMA — anime MV & shorts editor.",
    detail:
      "I cut anime music videos and shorts under the handle RASZMA. It is where the timing brain from dance meets the frame-by-frame patience of writing.",
    images: [raszmaYoutube.url],
    meta: [
      { label: "Channel", value: "@rszma1" },
      { label: "Subs", value: "449+" },
      { label: "Focus", value: "AMV · Shorts · Anime edits" },
    ],
    link: { label: "Open channel", href: "https://www.youtube.com/@rszma1" },
  },
  {
    id: "poetry",
    title: "Poetry",
    tag: "Verses",
    blurb: "Small verses, kept close.",
    detail:
      "In my catastrophic stormy rain, you're the rainbow that ease my pain. Deep down you're my greatest gain — that I won't let you in vain.",
    images: [],
  },
  {
    id: "photography",
    title: "Photography",
    tag: "50mm · f/1.8",
    blurb: "Learning to see slowly.",
    detail:
      "Mostly quiet frames — light through a window, someone mid-thought. Approach photography, then subtract until only the moment is left.",
    images: [cameraPhoto.url],
  },
  {
    id: "games",
    title: "Games",
    tag: "Play",
    blurb: "Valorant · Genshin · CrossFire.",
    detail:
      "Tactical shooters for the reflex, Genshin for the world, CrossFire for the nostalgia. Three very different rooms of the same house.",
    images: [gameValorant.url, gameGenshin.url, gameCrossfire.url],
  },
  {
    id: "sketches",
    title: "Sketches",
    tag: "Pencil",
    blurb: "Pencil roses & quiet portraits.",
    detail:
      "Graphite on cheap paper. Portraits first, then roses when the hand needs to stop thinking.",
    images: [sketchPortrait.url, sketchRose.url],
  },
  {
    id: "usherette",
    title: "Usherette",
    tag: "Student service",
    blurb: "Holding the door for other people's nights.",
    detail:
      "Parade banners, umbrellas against the sun, and the small choreography of guiding people to their seats. A quiet way to belong to a night that isn't yours.",
    images: [usherettePhoto.url],
  },
];

function BentoBackground({ item }: { item: BentoItem }) {
  if (item.images.length === 0) {
    return (
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
    );
  }
  if (item.images.length === 1) {
    return (
      <img
        src={item.images[0]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55"
        loading="lazy"
      />
    );
  }
  return (
    <div aria-hidden className={"absolute inset-0 grid " + (item.images.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
      {item.images.map((src, i) => (
        <img key={i} src={src} alt="" className="h-full w-full object-cover opacity-60" loading="lazy" />
      ))}
    </div>
  );
}

function BentoExpanded({ item, onClose }: { item: BentoItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            layoutId={`bento-${item.id}`}
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl hairline bg-card/95 shadow-2xl"
          >
            <div className="relative">
              <div className="relative h-56 sm:h-80 overflow-hidden rounded-t-3xl">
                <BentoBackground item={item} />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 h-9 w-9 rounded-full glass flex items-center justify-center text-sm hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 sm:p-10 -mt-16 relative">
              <p className="text-[10px] uppercase tracking-[0.35em] text-primary mb-3">
                {item.tag}
              </p>
              <motion.h3
                layoutId={`bento-title-${item.id}`}
                className="font-display text-3xl sm:text-5xl font-semibold leading-[1.05]"
              >
                {item.title}
              </motion.h3>
              <p className="mt-6 font-editorial text-lg sm:text-xl leading-[1.7] text-muted-foreground">
                {item.detail}
              </p>
              {item.meta && item.meta.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {item.meta.map((m) => (
                    <div key={m.label} className="hairline rounded-2xl p-4">
                      <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        {m.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {item.images.length > 1 && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {item.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-32 w-full object-cover rounded-2xl hairline"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
              {item.link && (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition"
                >
                  {item.link.label} ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Words() {
  return (
    <section id="words" className="px-6 py-24 sm:py-32 max-w-5xl mx-auto">
      <SectionHeader eyebrow="Words — 02" title="From the notebook." />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <FadeUp className="md:col-span-3">
          <div className="hairline rounded-3xl p-8 sm:p-10 bg-card/40 h-full">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
              Poem
            </p>
            <div className="font-editorial italic text-xl sm:text-2xl leading-[1.6] space-y-1">
              <p>In my catastrophic stormy rain,</p>
              <p>you're the rainbow that ease my pain.</p>
              <p>Deep down you're my greatest gain —</p>
              <p>that I won't let you in vain.</p>
            </div>
          </div>
        </FadeUp>
        <FadeUp className="md:col-span-2" delay={0.1}>
          <div className="hairline rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-primary/15 to-transparent h-full flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
              Prose
            </p>
            <blockquote className="font-editorial text-2xl sm:text-3xl leading-snug">
              “To find solace,{" "}
              <span className="italic">know where your soul is.</span>”
            </blockquote>
            <p className="mt-8 text-xs text-muted-foreground">— C.A.R.</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function Journal({
  activeEntry,
  setActiveEntry,
  mode,
}: {
  activeEntry: number;
  setActiveEntry: (n: number) => void;
  mode: "code" | "creative";
}) {
  const filtered =
    mode === "code"
      ? journalEntries.filter((_, i) => i % 2 === 1 || i === 1)
      : journalEntries;
  const entries = filtered.length ? filtered : journalEntries;
  const safeIndex = Math.min(activeEntry, entries.length - 1);
  const entry = entries[safeIndex];

  return (
    <section id="journal" className="px-6 py-24 sm:py-32 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Journal — live"
        title="Entries, in no particular order."
        note="Left: the index. Right: the page. Toggle Code / Creative below to filter the feed."
      />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <aside className="glass rounded-3xl p-3 h-fit lg:sticky lg:top-24">
          <ul className="space-y-1">
            {entries.map((e, i) => (
              <li key={e.title}>
                <button
                  onClick={() => setActiveEntry(i)}
                  className={
                    "w-full text-left px-4 py-3 rounded-2xl transition " +
                    (i === safeIndex
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-white/5")
                  }
                >
                  <div className="text-[10px] uppercase tracking-[0.25em] mb-1">
                    {e.date}
                  </div>
                  <div className="text-sm font-medium leading-snug">
                    {e.title}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <motion.article
          key={entry.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hairline rounded-3xl p-8 sm:p-12 bg-card/40 min-h-[420px]"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>{entry.date}</span>
            <span className="h-px w-8 bg-white/10" />
            <span className="text-primary">
              {mode === "code" ? "code view" : "creative view"}
            </span>
          </div>
          <h3 className="font-display text-3xl sm:text-5xl font-semibold mt-6 leading-[1.05]">
            {entry.title}
          </h3>
          <p className="mt-8 font-editorial text-lg sm:text-xl leading-[1.7] text-muted-foreground max-w-2xl">
            {entry.body}
          </p>
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="hairline rounded-full px-3 py-1">#life</span>
            <span className="hairline rounded-full px-3 py-1">
              #{mode === "code" ? "shipping" : "writing"}
            </span>
            <span className="hairline rounded-full px-3 py-1">#andre</span>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function TactileDeck({
  mode,
  setMode,
}: {
  mode: "code" | "creative";
  setMode: (m: "code" | "creative") => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div className="neu rounded-full p-1.5 flex items-center gap-1">
        {(["code", "creative"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={
              "px-4 sm:px-5 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition " +
              (mode === m
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,102,255,0.45)]"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

function StageBand() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <FadeUp>
        <figure className="relative rounded-3xl overflow-hidden hairline">
          <img
            src={danceStage.url}
            alt="On stage, the night we won"
            className="w-full h-[280px] sm:h-[420px] object-cover"
            loading="lazy"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <figcaption className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-primary mb-2">
                Stage · 2026
              </p>
              <h3 className="font-display text-2xl sm:text-4xl font-semibold max-w-xl">
                The night the count hit and the crowd held its breath.
              </h3>
            </div>
            <span className="hairline rounded-full px-3 py-1 text-xs text-muted-foreground w-fit">
              live · first place
            </span>
          </figcaption>
        </figure>
      </FadeUp>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 pt-16 pb-32 max-w-7xl mx-auto">
      <div className="hairline rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-card/60 to-transparent">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary mb-3">
              End of volume
            </p>
            <h3 className="font-display text-3xl sm:text-4xl font-semibold max-w-lg leading-tight">
              Thanks for reading a little of my life.
            </h3>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Christian Andre C. Reston</p>
            <p>Developer · Writer · Creator</p>
            <p className="pt-3 text-muted-foreground/60">
              © {new Date().getFullYear()} — journal vol. I
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="inline-block mr-[0.28em]"
        >
          {w}
        </motion.span>
      ))}
    </p>
  );
}
