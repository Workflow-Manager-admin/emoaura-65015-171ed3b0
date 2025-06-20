import React from "react";
import "./Feed.css";

// Util functions for random content
const AVATAR_API = "https://api.dicebear.com/7.x/pixel-art/svg?seed=";
const randomSeed = () => Math.random().toString(36).substring(2, 11);
const randomUser = () => {
  const names = [
    "NeonBlade", "PixelAura", "ZenZero", "DreamSynth", "BluePulse", "LightWisp",
    "GlowMuse", "AuraSpark", "LumeWave", "NovaGem", "SynthEcho", "DreamFlux", "PulseFrost"
  ];
  // Choose a random name and return with a random avatar seed
  const name = names[Math.floor(Math.random() * names.length)];
  return {
    username: name,
    avatar: `${AVATAR_API}${name}${randomSeed()}`
  };
};
// Some prompt sentences for random captions
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
  // Random landscape from picsum with varied seed
  const w = 480 + Math.floor(Math.random() * 130);
  const h = 360 + Math.floor(Math.random() * 60);
  const seed = Math.floor(Math.random() * 10000);
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

// Used for generating the feed posts with randomized content
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
   * One post card with neon/cyberpunk styling.
   */
  return (
    <div className="serene-post-card">
      <div className="serene-post-card__user">
        <img
          src={post.avatar}
          className="serene-post-card__avatar"
          alt={`${post.username} avatar`}
          loading="lazy"
        />
        <span className="serene-post-card__username">{post.username}</span>
      </div>
      <div className="serene-post-card__image-container">
        <img
          src={post.image}
          className="serene-post-card__image"
          alt="Feed post"
          loading="lazy"
        />
      </div>
      <div className="serene-post-card__caption">
        {post.caption}
      </div>
    </div>
  );
}

export default Feed;
