import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Lenis from "lenis";
import spectatorCover from "@/assets/journal/spectator-cover.png.asset.json";
import sketchPortrait from "@/assets/journal/sketch-portrait.jpg.asset.json";
import sketchRose from "@/assets/journal/sketch-rose.jpg.asset.json";
import danceMedal from "@/assets/journal/dance-medal.jpg.asset.json";
import danceStage from "@/assets/journal/dance-stage.jpg.asset.json";
import chessPhoto from "@/assets/journal/chess.jpg.asset.json";
import cameraPhoto from "@/assets/journal/camera.jpg.asset.json";

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
  return (
    <section id="life" className="px-6 py-24 sm:py-32 max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Life — Bento"
        title="Everything else I am."
        note="A mosaic of the quieter rooms — where the writing, the moves, and the wins live."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
        {/* The Spectator — large */}
        <FadeUp className="md:col-span-2 md:row-span-2">
          <article className="relative h-full rounded-3xl overflow-hidden hairline bg-gradient-to-br from-[#131322] to-[#0b0b14] p-8 sm:p-10 flex flex-col justify-between min-h-[420px]">
            <img
              src={spectatorCover.url}
              alt="The Spectator — novel cover"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#0b0b14] via-[#0b0b14]/70 to-[#0b0b14]/20"
            />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">
                Novel · unfinished
              </p>
              <h3 className="font-editorial text-4xl sm:text-6xl leading-[1.02] italic">
                The Spectator
              </h3>
              <WordReveal
                text="Some truths are not meant to be seen — only carried, quietly, through the long streets of the city."
                className="mt-6 font-editorial text-lg sm:text-xl text-muted-foreground max-w-lg"
              />
            </div>
            <div className="relative mt-8 flex items-center justify-between text-xs text-muted-foreground">
              <span>a novel by Andre Reston</span>
              <span className="hairline rounded-full px-3 py-1">ch. 07 / drafting</span>
            </div>
          </article>
        </FadeUp>

        {/* Dance winner */}
        <FadeUp delay={0.05}>
          <article className="relative h-full rounded-3xl hairline overflow-hidden bg-card/40 flex flex-col justify-between min-h-[180px]">
            <img
              src={danceMedal.url}
              alt="Holding the 1st place medal"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
              loading="lazy"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="relative p-6 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
                1st place
              </span>
              <span className="text-xl">🏆</span>
            </div>
            <div className="relative p-6 pt-0">
              <h3 className="font-display text-2xl font-semibold">Dance</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Champions — medal, ours.
              </p>
            </div>
          </article>
        </FadeUp>

        {/* Chess */}
        <FadeUp delay={0.1}>
          <article className="relative h-full rounded-3xl hairline overflow-hidden bg-card/40 min-h-[180px] flex flex-col justify-between">
            <img
              src={chessPhoto.url}
              alt="Match night — chess"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
              loading="lazy"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="relative p-6 flex-1" />
            <div className="relative p-6 pt-0">
              <h3 className="font-display text-2xl font-semibold">Chess</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Endgames &gt; openings.
              </p>
            </div>
          </article>
        </FadeUp>

        {/* Poetry */}
        <FadeUp delay={0.15}>
          <article className="h-full rounded-3xl hairline p-6 bg-card/40 min-h-[180px] flex flex-col justify-between">
            <p className="font-editorial italic text-sm text-muted-foreground leading-relaxed">
              “…you're the rainbow that ease my pain.”
            </p>
            <div>
              <h3 className="font-display text-2xl font-semibold">Poetry</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Small verses, kept close.
              </p>
            </div>
          </article>
        </FadeUp>

        {/* Photography */}
        <FadeUp delay={0.2}>
          <article className="relative h-full rounded-3xl hairline overflow-hidden bg-card/40 min-h-[180px] flex flex-col justify-between">
            <img
              src={cameraPhoto.url}
              alt="Behind the viewfinder"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
              loading="lazy"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="relative p-6 flex items-center gap-3">
              <span className="text-xs text-muted-foreground">50mm · f/1.8</span>
            </div>
            <div className="relative p-6 pt-0">
              <h3 className="font-display text-2xl font-semibold">Photography</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Learning to see slowly.
              </p>
            </div>
          </article>
        </FadeUp>

        {/* Games */}
        <FadeUp delay={0.25}>
          <article className="h-full rounded-3xl hairline p-6 bg-card/40 min-h-[180px] flex flex-col justify-between">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="h-2 w-2 rounded-full bg-primary/30" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold">Games</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Valorant, Genshin, CrossFire.
              </p>
            </div>
          </article>
        </FadeUp>

        {/* Arts */}
        <FadeUp delay={0.3}>
          <article className="relative h-full rounded-3xl hairline overflow-hidden bg-card/40 min-h-[180px] flex flex-col justify-between">
            <div className="absolute inset-0 grid grid-cols-2">
              <img src={sketchPortrait.url} alt="Pencil portrait sketch" className="h-full w-full object-cover opacity-70" loading="lazy" />
              <img src={sketchRose.url} alt="Pencil rose sketch" className="h-full w-full object-cover opacity-70" loading="lazy" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="relative p-6 flex-1" />
            <div className="relative p-6 pt-0">
              <h3 className="font-display text-2xl font-semibold">Sketches</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Pencil roses & quiet portraits.
              </p>
            </div>
          </article>
        </FadeUp>

        {/* Usherette */}
        <FadeUp delay={0.35}>
          <article className="h-full rounded-3xl hairline p-6 bg-card/40 min-h-[180px] flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Student service
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold">Usherette</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Holding the door for other people's nights.
              </p>
            </div>
          </article>
        </FadeUp>
      </div>
    </section>
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

function Footer() {
  return null as never;
}

// placeholder replaced below
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
