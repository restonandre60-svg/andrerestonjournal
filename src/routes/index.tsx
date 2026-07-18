import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Lenis from "lenis";
import SpectatorReader from "@/components/spectator-reader";
import { draftingChapter } from "@/lib/spectator-chapters";
import spectatorCover from "../assets/journal/spectator-cover.jpg";
import sketchPortrait from "../assets/journal/sketch-portrait.jpg";
import sketchRose from "../assets/journal/sketch-rose.jpg";
import sketchGlassesAsset from "../assets/journal/sketch-glasses.jpg.asset.json";
const sketchGlasses = sketchGlassesAsset.url;
import danceMedal from "../assets/journal/dance-medal.jpg";
import danceStage from "../assets/journal/dance-stage.jpg";
import chessPhoto from "../assets/journal/chess.jpg";
import cameraPhoto from "../assets/journal/camera.jpg";
import usherettePhoto from "../assets/journal/usherette.jpg";
import raszmaYoutube from "../assets/journal/raszma-youtube.jpg";
import gameValorant from "../assets/journal/valorant.jpg";
import gameGenshin from "../assets/journal/genshin.jpg";
import gameCrossfire from "../assets/journal/crossfire.jpg";
import dreflowLogo from "../assets/projects/dreflow-logo.png";
import dreflowPreview from "../assets/projects/dreflow-preview.png";
import andioLogo from "../assets/projects/andio-logo.png";
import andioPreview from "../assets/projects/andio-preview.png";
import ancrestLogo from "../assets/projects/ancrest-logo.png";
import ancrestPreview from "../assets/projects/ancrest-preview.png";
import repodreLogo from "../assets/projects/repodre-logo.jpg";
import repodrePreview from "../assets/projects/repodre-preview.png";
import stageVideo from "../assets/journal/received_1576293670097276.mp4";

export const Route = createFileRoute("/")({
  component: Index,
});

const projects = [
  {
    name: "dreflow",
    url: "https://dreflow.netlify.app",
    tag: "Flow · Focus",
    desc: "A dream-shaped workspace for uninterrupted thinking.",
    logo: dreflowLogo,
    preview: dreflowPreview,
    accent: "#F97316",
  },
  {
    name: "andio-sage",
    url: "https://andio-sage.vercel.app",
    tag: "Audio · Ambient",
    desc: "A calm sonic companion for deep, slow hours.",
    logo: andioLogo,
    preview: andioPreview,
    accent: "#34D399",
  },
  {
    name: "ancrest",
    url: "https://ancrest.vercel.app",
    tag: "Rest · Reflect",
    desc: "A quiet resting place between the noise.",
    logo: ancrestLogo,
    preview: ancrestPreview,
    accent: "#22D3EE",
  },
  {
    name: "repodre",
    url: "https://repodre.vercel.app",
    tag: "Repo · Ship",
    desc: "A developer surface for shipping the small things.",
    logo: repodreLogo,
    preview: repodrePreview,
    accent: "#2DD4BF",
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

function MagneticNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const strength = 0.25;
    setOffset({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-white/5 transition"
      style={{ display: "inline-block" }}
    >
      <motion.span
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </a>
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
              <MagneticNavLink href={`#${n.id}`}>{n.label}</MagneticNavLink>
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
  const heroRef = useRef<HTMLElement>(null);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springX = useSpring(glowX, { stiffness: 50, damping: 20 });
  const springY = useSpring(glowY, { stiffness: 50, damping: 20 });
  const glowBackground = useTransform(
    [springX, springY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(0,102,255,0.18), transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const headline = ["Developer.", "Writer.", "Creator."];

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen px-6 pt-32 pb-24 overflow-hidden"
    >
      {/* mouse-following glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{ background: glowBackground }}
      />
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl min-h-[calc(100vh-14rem)] grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-10 lg:gap-16 items-center">
        {/* 60 — headline */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-8"
          >
            Christian Andre C. Reston · Journal vol. I
          </motion.p>
          <h1 className="font-display font-semibold leading-[0.92] text-[clamp(2.75rem,9vw,6.5rem)]">
            {headline.map((line, li) => {
              const isCreator = line.startsWith("Creator");
              return (
                <motion.span
                  key={li}
                  className={
                    "block " +
                    (isCreator
                      ? "bg-gradient-to-r from-[#0066FF] to-[#A78BFA] bg-clip-text text-transparent"
                      : "")
                  }
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: li * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              );
            })}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-8 max-w-xl text-sm sm:text-base text-muted-foreground"
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
            transition={{ delay: 0.9 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="#projects"
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-blue-600 active:scale-95 transition"
            >
              See the work
            </a>
            <a
              href="#words"
              className="px-5 py-2.5 rounded-full hairline text-sm font-medium hover:bg-blue-600 hover:text-primary-foreground active:scale-95 transition"
            >
              Read the words
            </a>
          </motion.div>
        </div>

        {/* 40 — editorial card */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden"
        >
          <div aria-hidden className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-primary mb-6">
            Now
          </p>
          <p className="font-editorial italic text-2xl sm:text-3xl leading-[1.35]">
            Writing chapter 24 of{" "}
            <span className="not-italic bg-gradient-to-r from-[#0066FF] to-[#A78BFA] bg-clip-text text-transparent font-semibold">
              The Spectator
            </span>
            . Shipping small tools. Learning to hold the tempo.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            {[
              { k: "Ships", v: "04" },
              { k: "Novel", v: "ch.24" },
              { k: "Medal", v: "1st" },
            ].map((s) => (
              <div key={s.k} className="hairline rounded-2xl py-3">
                <div className="font-display text-xl font-semibold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
                  {s.k}
                </div>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>

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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // 4 cards: translate from 0% to -75% so last card lands centered.
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-78%"]);

  return (
    <section id="projects" ref={ref} className="relative h-[380vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 max-w-7xl w-full mx-auto mb-10">
          <SectionHeader
            eyebrow="Ship — 04"
            title="Deployed, in the wild."
            note="Pinned scroll — four small products, each shipped end-to-end."
          />
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-6 will-change-transform">
          {projects.map((p, i) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group relative shrink-0 w-[85vw] sm:w-[620px] h-[62vh] hairline rounded-3xl bg-card/40 hover:bg-card/70 transition-all duration-300 hover:border-primary/40 flex flex-col overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition"
                style={{ background: p.accent }}
              />
              <div className="relative flex-1 overflow-hidden bg-[#0a0a0a]">
                <img
                  src={p.preview}
                  alt={`${p.name} landing page`}
                  className="absolute inset-0 h-full w-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                  loading="lazy"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="relative flex items-center justify-between p-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground glass px-3 py-1.5 rounded-full">
                    {String(i + 1).padStart(2, "0")} · {p.tag}
                  </span>
                  <span className="text-white/80 group-hover:text-white transition text-xl">↗</span>
                </div>
              </div>
              <div className="relative p-6 sm:p-8 flex items-center gap-5 border-t border-white/5">
                <div className="shrink-0 h-16 w-16 rounded-2xl overflow-hidden hairline bg-[#0a0a0a] flex items-center justify-center">
                  <img src={p.logo} alt={`${p.name} logo`} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-3xl sm:text-4xl font-semibold leading-[0.95] truncate">
                    {p.name}
                  </h3>
                  <p className="mt-2 font-editorial text-sm sm:text-base text-muted-foreground line-clamp-2 leading-snug">
                    {p.desc}
                  </p>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 truncate">
                    {p.url.replace("https://", "")}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LifeBento() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);
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
          <FadeUp key={b.id} delay={i * 0.1} className={b.span ?? ""}>
            {b.id === "spectator" ? (
              <SpectatorBentoCard
                item={b}
                onOpenReader={() => setReaderOpen(true)}
              />
            ) : (
              <motion.button
                layoutId={`bento-${b.id}`}
                onClick={() => setOpenId(b.id)}
                className={
                  "group relative w-full h-full text-left rounded-3xl hairline overflow-hidden bg-card/60 backdrop-blur-sm flex flex-col justify-between " +
                  (b.tall ? "min-h-[420px]" : "min-h-[180px]") +
                  " transition-all duration-300 ease-out cursor-pointer " +
                  "hover:-translate-y-1 hover:scale-105 hover:border-primary/40 hover:ring-1 hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/10"
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
            )}
          </FadeUp>
        ))}
      </div>

      <BentoExpanded item={open} onClose={() => setOpenId(null)} />
      <SpectatorReader open={readerOpen} onClose={() => setReaderOpen(false)} initialChapterId="ch-1" />
    </section>
  );
}

function SpectatorBentoCard({
  item,
  onOpenReader,
}: {
  item: BentoItem;
  onOpenReader: () => void;
}) {
  return (
    <div
      className={
        "group relative w-full h-full rounded-3xl hairline overflow-hidden bg-card/60 backdrop-blur-sm flex flex-col justify-between min-h-[420px] " +
        "transition-all duration-300 ease-out " +
        "hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/40 hover:ring-1 hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/10"
      }
    >
      <BentoBackground item={item} />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"
      />

      {/* Top row: status tag + read time badge */}
      <div className="relative p-6 flex items-start justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
          {item.tag}
        </span>
        <div className="flex items-center gap-2">
          <span className="glass rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/80">
            Ch. {draftingChapter.number} · {draftingChapter.status}
          </span>
          <span className="glass rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/80">
            {draftingChapter.minutes} min read
          </span>
        </div>
      </div>

      {/* Bottom: title + CTA */}
      <div className="relative p-6 pt-0">
        <h3 className="font-display font-semibold text-4xl sm:text-5xl leading-[1.02] bg-gradient-to-r from-[#0066FF] to-[#A78BFA] bg-clip-text text-transparent">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-2 max-w-md">
          A novel by Andre Reston — an ongoing chronicle. Latest draft below.
        </p>
        <button
          onClick={onOpenReader}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-blue-600 active:scale-95 transition"
        >
          Read Chapter 1
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
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
    images: [spectatorCover],
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
    images: [danceMedal, danceStage],
    meta: [{ label: "Result", value: "🏆 1st Place" }],
  },
  {
    id: "chess",
    title: "Chess",
    tag: "Board",
    blurb: "Endgames > openings.",
    detail:
      "I lose middlegames I should win, and win endgames I should lose. There is a poem hidden inside every tempo.",
    images: [chessPhoto],
  },
  {
    id: "video",
    title: "Video Editing",
    tag: "YouTube · @rszma1",
    blurb: "RASZMA — anime MV & shorts editor.",
    detail:
      "I cut anime music videos and shorts under the handle RASZMA. It is where the timing brain from dance meets the frame-by-frame patience of writing.",
    images: [raszmaYoutube],
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
    images: [cameraPhoto],
  },
  {
    id: "games",
    title: "Games",
    tag: "Play",
    blurb: "Valorant · Genshin · CrossFire.",
    detail:
      "Tactical shooters for the reflex, Genshin for the world, CrossFire for the nostalgia. Three very different rooms of the same house.",
    images: [gameValorant, gameGenshin, gameCrossfire],
  },
  {
    id: "sketches",
    title: "Sketches",
    tag: "Pencil",
    blurb: "Pencil roses & quiet portraits.",
    detail:
      "Graphite on cheap paper. Portraits first, then roses when the hand needs to stop thinking.",
    images: [sketchGlasses, sketchPortrait, sketchRose],
  },
  {
    id: "usherette",
    title: "Usherette",
    tag: "Student service",
    blurb: "Holding the door for other people's nights.",
    detail:
      "Parade banners, umbrellas against the sun, and the small choreography of guiding people to their seats. A quiet way to belong to a night that isn't yours.",
    images: [usherettePhoto],
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
                className={
                  "font-display text-3xl sm:text-5xl font-semibold leading-[1.05]" +
                  (item.id === "spectator"
                    ? " bg-gradient-to-r from-[#0066FF] to-[#A78BFA] bg-clip-text text-transparent"
                    : "")
                }
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isPlaying || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {
      /* autoplay may be blocked; users can click to play */
    });
  }, [isPlaying]);

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <FadeUp>
        <figure className="relative rounded-3xl overflow-hidden hairline">
          {isPlaying ? (
            <video
              ref={videoRef}
              className="w-full h-[280px] sm:h-[420px] object-cover"
              src={stageVideo}
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              poster={danceStage}
              onClick={() => setIsPlaying(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="group relative block w-full h-[280px] sm:h-[420px]"
            >
              <img
                src={danceStage}
                alt="On stage, the night we won"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/35 transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex items-center justify-center rounded-full bg-white/90 text-black w-16 h-16 shadow-lg transition-transform group-hover:scale-105">
                  ▶
                </span>
              </div>
              <div className="absolute bottom-6 left-6 rounded-full bg-black/70 text-xs uppercase tracking-[0.35em] text-white px-3 py-2">
                Tap to play
              </div>
            </button>
          )}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
          <figcaption className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pointer-events-none">
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
