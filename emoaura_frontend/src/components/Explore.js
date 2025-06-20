import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import "./Explore.css";

// Utility functions (avatars, sample text, sample images)
const AVATAR_API = "https://api.dicebear.com/7.x/pixel-art/svg?seed=";
const randomSeed = () => Math.random().toString(36).substring(2, 11);
const randomUser = () => {
  const names = [
    "NeonBlade", "PixelAura", "ZenZero", "DreamSynth", "BluePulse", "LightWisp",
    "GlowMuse", "AuraSpark", "LumeWave", "NovaGem", "SynthEcho", "DreamFlux", "PulseFrost"
  ];
  const name = names[Math.floor(Math.random() * names.length)];
  return {
    username: name,
    avatar: `${AVATAR_API}${name}${randomSeed()}`
  };
};
const CAPTIONS = [
  "Midnight vibes in the city of light. #cyberpunk #nightlife",
  "Dreaming in colors they haven't invented yet.",
  "Lost in the neon fog, found in the soft hum of midnight.",
  "Synth tunes echoing through neon alleys.",
  "Cyber serenity at dawn. #vaporwave",
  "Infinite haze, infinite dreams.",
  "Wired hearts beating to electric sunsets.",
  "Urban warmth in a digital world.",
  "Soft neon, sharp edges, bright souls.",
  "No sleep in the world of neon hearts.",
  "City lights and pixelated emotions.",
  "Radiant silence: only music, only color.",
  "Scrolling through the aura of tomorrow.",
  "Between glitches, we glow even brighter."
];
const randomCaption = () => CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];
const randomImage = () => {
  const w = 320 + Math.floor(Math.random() * 140);
  const h = 240 + Math.floor(Math.random() * 135);
  const seed = Math.floor(Math.random() * 12000);
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};
// Pure text/random colored block (for mixing)
const randomColor = () =>
  `linear-gradient(120deg,#311064${Math.floor(
    Math.random() * 80 + 33
  ).toString(16)},#0ffccf${Math.floor(Math.random() * 60 + 50).toString(16)} 90%)`;

function genBlock(i) {
  // Randomly pick between image and text block (70% image, 30% text)
  const isImage = Math.random() < 0.7;
  const u = randomUser();
  if (isImage) {
    return {
      id: "img-" + i,
      type: "image",
      avatar: u.avatar,
      username: u.username,
      image: randomImage(),
      caption: randomCaption(),
      height: 240 + Math.floor(Math.random() * 120)
    };
  } else {
    // Text "quote"/thought
    const COLORS = [
      randomColor(),
      "linear-gradient(111deg,#8d00ffbb 30%,#181240 100%)",
      "linear-gradient(90deg,#ff39b5 20%, #0ffccf77 100%)",
      "linear-gradient(120deg,#311064a7,#e900be 120%)"
    ];
    return {
      id: "txt-" + i,
      type: "text",
      avatar: u.avatar,
      username: u.username,
      text: CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)],
      bg: COLORS[Math.floor(Math.random() * COLORS.length)],
      height: 82 + Math.floor(Math.random() * 75)
    };
  }
}

// Generates N "combined" image/text blocks for Explore area.
function createFakeExploreBlocks(num) {
  return Array.from({ length: num }).map((_, i) => genBlock(i));
}

// PUBLIC_INTERFACE
export default function Explore() {
  /**
   * Explore page with responsive, performant CSS grid masonry/column layout,
   * sticky filter/search bar, interactive cards, and aesthetic touch.
   * Implements infinite scroll on large screens (virtual scroll/append blocks).
   */
  // For smooth scroll: load more blocks when scrolled near bottom.
  const [blocks, setBlocks] = useState(() => createFakeExploreBlocks(28));
  const [loading, setLoading] = useState(false);
  const gridRef = useRef();

  // Filter/search simulation (non-functional for now)
  const [search, setSearch] = useState("");

  // Handles infinite/virtual loading on scroll
  const onScroll = useCallback(() => {
    if (loading) return;
    const el = gridRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    // Near "bottom", append more blocks
    if (scrollTop + clientHeight > scrollHeight - 200) {
      setLoading(true);
      setTimeout(() => {
        setBlocks(prev => [...prev, ...createFakeExploreBlocks(16)]);
        setLoading(false);
      }, 400);
    }
  }, [loading]);

  // Attach scroll handler to virtual grid area
  useEffect(() => {
    const el = gridRef.current;
    if (el) {
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    }
  }, [onScroll]);

  // Focus search input shortcut
  useEffect(() => {
    const onKey = e => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const input = document.getElementById("explore-search-input");
        input?.focus();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Filter simulation (shows all for now)
  const shownBlocks = blocks;

  return (
    <section className="explore-container" aria-label="Explore grid">
      <StickyFilterBar search={search} setSearch={setSearch} />
      <div className="explore-grid-virtual-scroll" ref={gridRef} tabIndex={0}>
        <div className="explore-masonry-grid">
          {shownBlocks.map(block =>
            block.type === "image" ? (
              <ExploreImageCard key={block.id} block={block} />
            ) : (
              <ExploreTextCard key={block.id} block={block} />
            )
          )}
        </div>
        {loading && (
          <div style={{ padding: 28, color: "#0ffccf", textAlign: "center" }}>
            <span className="explore-loader" />
            Loading more...
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Sticky filter/search bar always visible atop Explore grid.
 */
function StickyFilterBar({ search, setSearch }) {
  // For future extensibility, support for filter type and sort order (not functional yet)
  const [type, setType] = useState("");
  const [sort, setSort] = useState("trending");

  // Type filter options (for demo)
  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "images", label: "Images" },
    { value: "text", label: "Text" },
    { value: "videos", label: "Videos" }, // Extensible (non-functional now)
  ];

  // Sort options (for demo/future expansion)
  const sortOptions = [
    { value: "trending", label: "Trending" },
    { value: "new", label: "Newest" },
    { value: "top", label: "Top" },
  ];

  return (
    <form
      className="explore-filter-bar"
      role="search"
      aria-label="Search and filter Explore"
      tabIndex={-1}
      onSubmit={e => e.preventDefault()}
      style={{gap: 18}}
    >
      <label htmlFor="explore-search-input" className="sr-only">
        Search Explore
      </label>
      <input
        id="explore-search-input"
        type="search"
        className="explore-search-input"
        placeholder="Search Explore... (Press / to focus)"
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Search Explore"
        name="explore-search"
        style={{ minWidth: 0, flex: "0 1 250px" }}
      />

      <label htmlFor="explore-type-filter" className="sr-only">
        Filter by type
      </label>
      <select
        id="explore-type-filter"
        className="explore-type-select"
        name="type"
        aria-label="Filter by type"
        value={type}
        onChange={e => setType(e.target.value)}
        style={{minWidth: 90, fontSize: "1.01rem"}}
      >
        {typeOptions.map(opt =>
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>

      <label htmlFor="explore-sort" className="sr-only">
        Sort Explore
      </label>
      <select
        id="explore-sort"
        className="explore-sort-select"
        name="sort"
        aria-label="Sort Explore grid"
        value={sort}
        onChange={e => setSort(e.target.value)}
        style={{minWidth: 90, fontSize: "1.01rem"}}
      >
        {sortOptions.map(opt =>
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>

      {/* In future: filters, etc. Here as demonstration of extensibility */}
      <button
        className="explore-filter-btn"
        type="button"
        tabIndex={0}
        aria-label="More Filters"
        style={{marginLeft: 5}}
      >
        <span role="img" aria-label="Filter">
          🧲
        </span>
        More Filters
      </button>
    </form>
  );
}

// PUBLIC_INTERFACE
function ExploreImageCard({ block }) {
  /**
   * Interactive, animated card for image block with hover effect.
   */
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="explore-card explore-image-card" tabIndex={0}>
      {/* USER HEADER */}
      <div className="explore-card__header">
        <img src={block.avatar} className="explore-card__avatar" alt="" loading="lazy" />
        <span className="explore-card__username">{block.username}</span>
      </div>
      {/* IMAGE */}
      <div
        className="explore-card__media"
        style={{
          height: block.height,
          background: "linear-gradient(118deg,#0ffccf18 60%, #8d00ff22 120%)"
        }}
      >
        <img src={block.image} alt="Explore post" loading="lazy" className="explore-card__img" />
      </div>
      {/* CAPTION */}
      <div className="explore-card__caption">{block.caption}</div>
      {/* INTERACTION BAR */}
      <div className="explore-card__actions">
        {/* Like */}
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          onClick={() => setLiked(l => !l)}
          style={{
            color: liked ? "#fa3e3e" : "#fff7fd",
            filter: liked ? "drop-shadow(0 0 9px #fa3e3e)" : "none"
          }}
          tabIndex={0}
        >
          <span role="img" aria-label="Like">{liked ? "❤️" : "🤍"}</span>
        </button>
        {/* Save */}
        <button
          type="button"
          aria-label={saved ? "Unsave" : "Save"}
          onClick={() => setSaved(v => !v)}
          style={{ color: saved ? "#00fff7" : "#fff" }}
          tabIndex={0}
        >
          <span role="img" aria-label="Save">
            {saved ? "🔖" : "📑"}
          </span>
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ExploreTextCard({ block }) {
  /**
   * Interactive card for text only block (quote/thought).
   */
  const [liked, setLiked] = useState(false);
  return (
    <div
      className="explore-card explore-text-card"
      style={{ background: block.bg, minHeight: block.height }}
      tabIndex={0}
    >
      <div className="explore-card__header">
        <img src={block.avatar} className="explore-card__avatar" alt="" loading="lazy" />
        <span className="explore-card__username">{block.username}</span>
      </div>
      <div className="explore-card__caption explore-card__caption--textonly">
        “{block.text}”
      </div>
      <div className="explore-card__actions">
        {/* Like */}
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          onClick={() => setLiked(l => !l)}
          style={{
            color: liked ? "#fa3e3e" : "#fff7fd",
            filter: liked ? "drop-shadow(0 0 7px #fa3e3e)" : "none"
          }}
          tabIndex={0}
        >
          <span role="img" aria-label="Like">{liked ? "❤️" : "🤍"}</span>
        </button>
      </div>
    </div>
  );
}
