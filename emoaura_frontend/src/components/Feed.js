import React, { useState } from "react";
import "./Feed.css";

// Util functions for random content
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
  const w = 480 + Math.floor(Math.random() * 130);
  const h = 360 + Math.floor(Math.random() * 60);
  const seed = Math.floor(Math.random() * 10000);
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

const NUM_POSTS = 8;
const FAKE_POSTS = Array.from({ length: NUM_POSTS }).map((_, i) => {
  const user = randomUser();
  return {
    id: i + 1,
    username: user.username,
    avatar: user.avatar,
    image: randomImage(),
    caption: randomCaption()
  };
});

// PUBLIC_INTERFACE
function Feed() {
  /**
   * Renders a neon-styled scrollable feed with random sample post cards.
   */
  return (
    <section className="serene-feed-list" aria-label="Sample feed">
      {FAKE_POSTS.map(post => (
        <FeedPostCard key={post.id} post={post} />
      ))}
    </section>
  );
}

// PUBLIC_INTERFACE
function FeedPostCard({ post }) {
  /**
   * One post card with interactive neon/cyberpunk styling:
   * - Like button toggles red.
   * - Comment button toggles a comment input.
   * - Save button shows 'Saved!' toast.
   * Each post manages its own state.
   */

  const [liked, setLiked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Handle like toggle
  function handleLike() {
    setLiked(l => !l);
  }

  // Handle comment UI toggle
  function handleToggleComment() {
    setShowComment(v => !v);
  }

  // Handle save action with toast message
  function handleSave() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1200);
  }

  // Handle comment submit (stub)
  function handleCommentSubmit(e) {
    e.preventDefault();
    setCommentText("");
    setShowComment(false);
    // Normally: save comment via API here
  }

  return (
    <div className="serene-post-card" tabIndex={0}>
      {/* USER/HEADER */}
      <div className="serene-post-card__user">
        <img
          src={post.avatar}
          className="serene-post-card__avatar"
          alt={`${post.username} avatar`}
          loading="lazy"
        />
        <span className="serene-post-card__username">{post.username}</span>
      </div>
      {/* IMAGE */}
      <div className="serene-post-card__image-container">
        <img
          src={post.image}
          className="serene-post-card__image"
          alt="Feed post"
          loading="lazy"
        />
      </div>
      {/* CAPTION */}
      <div className="serene-post-card__caption">
        {post.caption}
      </div>
      {/* INTERACTION BAR */}
      <div style={{
        marginTop: 14,
        display: "flex",
        alignItems: "center",
        gap: 32,
        paddingLeft: 3,
        paddingTop: 3
      }}>
        {/* Like */}
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? "Unlike post" : "Like post"}
          onClick={handleLike}
          style={{
            fontSize: 22,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: liked ? "#fa3e3e" : "#fff7fd",
            transition: "color 0.17s",
            filter: liked ? "drop-shadow(0 0 8px #fa3e3e)" : "none"
          }}
          tabIndex={0}
        >
          <span role="img" aria-label="Like">{liked ? "❤️" : "🤍"}</span>
        </button>
        {/* Comment */}
        <button
          type="button"
          aria-expanded={showComment}
          aria-label="Add comment"
          onClick={handleToggleComment}
          style={{
            fontSize: 22,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#0ffccfcc",
            transition: "color 0.17s"
          }}
          tabIndex={0}
        >
          <span role="img" aria-label="Comment">💬</span>
        </button>
        {/* Save */}
        <button
          type="button"
          aria-label="Save post"
          onClick={handleSave}
          style={{
            fontSize: 22,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#00fff7",
            transition: "color 0.17s"
          }}
          tabIndex={0}
        >
          <span role="img" aria-label="Save">🔖</span>
        </button>
      </div>
      {/* COMMENT INPUT */}
      {showComment && (
        <form
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginTop: 10,
            paddingLeft: 7
          }}
          onSubmit={handleCommentSubmit}
        >
          <input
            type="text"
            value={commentText}
            maxLength={180}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            autoFocus
            style={{
              background: "#181240",
              color: "#fff7fc",
              border: "1.5px solid #00fff7cc",
              borderRadius: 8,
              outline: "none",
              padding: "6px 15px 7px 12px",
              fontSize: 15,
              minWidth: 0,
              flex: 1,
              boxShadow: "0 0 8px #00fff744"
            }}
            aria-label="Comment input"
          />
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg,#8d00ff 24%,#00fff7 150%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "7px 18px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              boxShadow: "0 0 16px #00fff777"
            }}
            disabled={!commentText.trim()}
          >
            Post
          </button>
        </form>
      )}
      {/* SAVE TOAST */}
      {showToast && (
        <div style={{
          position: "absolute",
          top: 28,
          right: 26,
          background: "linear-gradient(90deg,#8d00ff 7%,#00fff7 100%)",
          color: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 15px #00fff799",
          padding: "8px 23px 8px 15px",
          fontWeight: 600,
          fontSize: 1.05 + "rem",
          letterSpacing: "0.7px",
          zIndex: 18,
          opacity: 0.97,
          animation: "fadeinout 1.22s"
        }}>
          Saved!
        </div>
      )}
      {/* Toast animation */}
      <style>
        {`
        @keyframes fadeinout {
          0% { opacity: 0; transform: translateY(-14px) scale(0.88);}
          9% { opacity: 1; transform: translateY(0) scale(1);}
          78% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px) scale(0.93);}
        }
        `}
      </style>
    </div>
  );
}

export default Feed;
