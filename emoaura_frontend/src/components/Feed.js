import React from "react";
import "./Feed.css";

// Placeholder post data for sample feed
const FAKE_POSTS = [
  {
    id: 1,
    username: "NeonBlade",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=blade1",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=570&q=80",
    caption: "Midnight vibes in the city of light. #cyberpunk #nightlife",
  },
  {
    id: 2,
    username: "PixelAura",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=pixie",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=570&q=80",
    caption: "Dreaming in colors they haven't invented yet.",
  },
  {
    id: 3,
    username: "ZenZero",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=zenzero",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=570&q=80",
    caption: "Lost in the neon fog, found in the soft hum of midnight.",
  },
  {
    id: 4,
    username: "DreamSynth",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=synthix",
    image: "https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?auto=format&fit=crop&w=570&q=80",
    caption: "Synth tunes echoing through neon alleys.",
  },
  {
    id: 5,
    username: "BluePulse",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=pulseblue",
    image: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=570&q=80",
    caption: "Cyber serenity at dawn. #vaporwave",
  }
];

// PUBLIC_INTERFACE
function Feed() {
  /**
   * Renders a neon-styled scrollable feed with multiple post cards.
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
