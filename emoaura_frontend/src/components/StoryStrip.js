import React from "react";
import "./StoryStrip.css";

/**
 * Horizontal stories strip (like Instagram) appearing below NavBar and above the feed.
 * Uses grid or flex for horizontal scroll with avatars and highlight rings.
 */
// PUBLIC_INTERFACE
function StoryStrip() {
  // Sample stories
  const STORIES = [
    { id: 1, username: "Aurora", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=aurora" },
    { id: 2, username: "Nova", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=nova" },
    { id: 3, username: "Vibe", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=vibe" },
    { id: 4, username: "Bliss", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=bliss" },
    { id: 5, username: "Moodie", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=moodie" },
    { id: 6, username: "Echo", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=echo" },
    { id: 7, username: "Rift", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=rift" },
  ];
  return (
    <div className="serene-story-strip" aria-label="Stories">
      {STORIES.map(s => (
        <div className="serene-story-strip__item" key={s.id}>
          <span className="serene-story-strip__ring">
            <img
              src={s.avatar}
              alt={`${s.username} story avatar`}
              className="serene-story-strip__avatar"
              loading="lazy"
            style={{
                color: '#f1fafb'
            }} />
          </span>
          <div className="serene-story-strip__user">{s.username}</div>
        </div>
      ))}
    </div>
  );
}
export default StoryStrip;
