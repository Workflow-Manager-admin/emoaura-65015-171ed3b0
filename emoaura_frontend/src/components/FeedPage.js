import React, { useState } from "react";
import "./FeedPage.css";

// ---- Utilities for random/placeholder content (avatars, images, users) ---
const AVATAR_API = "https://api.dicebear.com/7.x/pixel-art/svg?seed=";
const randomSeed = () => Math.random().toString(36).substring(2, 11);
const randomUser = () => {
  const names = [
    "Aurora", "Nova", "Vibe", "Muse", "Bliss", "Echo", "Rift",
    "Zen", "Sage", "Ray", "Opal", "Wisp", "Dream", "Kindle", "Gem"
  ];
  const name = names[Math.floor(Math.random() * names.length)];
  return {
    username: name,
    avatar: `${AVATAR_API}${name}${randomSeed()}`
  };
};
const CAPTIONS = [
  "Dancing with the neon rain.",
  "Colorful minds, vibrant nights.",
  "Emotions feel electric tonight.",
  "Beaming auras, calm hearts. 🦋",
  "Midnight souls in pastel dreams.",
  "Embrace the vibe. #emosoft",
  "Life in soft focus, colors that heal.",
  "Shades of calm. Reflections within.",
  "Let your aura glow.",
  "City’s whisper; our dreams glow."
];
const randomCaption = () => CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];
const randomImage = () => {
  // Wide images for feed feel
  const w = 420 + Math.floor(Math.random() * 100);
  const h = 370 + Math.floor(Math.random() * 50);
  const seed = Math.floor(Math.random() * 10000);
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

function generatePosts(n = 10) {
  return Array.from({ length: n }).map((_, i) => {
    const user = randomUser();
    return {
      id: i + 1,
      username: user.username,
      avatar: user.avatar,
      image: randomImage(),
      caption: randomCaption(),
      liked: false,
      saved: false
    };
  });
}

const STORY_USERS = [
  { username: "Aurora", avatar: AVATAR_API + "aurora" },
  { username: "Nova", avatar: AVATAR_API + "nova" },
  { username: "Vibe", avatar: AVATAR_API + "vibe" },
  { username: "Muse", avatar: AVATAR_API + "muse" },
  { username: "Ray", avatar: AVATAR_API + "ray" },
  { username: "Opal", avatar: AVATAR_API + "opal" },
  { username: "Zen", avatar: AVATAR_API + "zen" }
];

// PUBLIC_INTERFACE
function FeedPage() {
  /**
   * Main EmoAura Feed Page UI/UX.
   * - Layout: Fixed left nav, fixed right sidebar, scrollable feed with pinned story strip.
   * - Each post: placeholder image/text, like (toggle red), comment (input show/hide), save (toast).
   * - Modern, soft, responsive. No backend – local state only.
   */
  // Simulate a long feed (infinite scroll is demoed with a long list - could add actual infinite scroll if desired)
  const [posts, setPosts] = useState(() => generatePosts(18));

  // Allow per-post state for like, comment, save using id mapping
  const [interact, setInteract] = useState({});
  // { [postId]: { liked: boolean, saved: boolean, showComment: boolean, commentText: "" } }

  // Handler for Like
  function handleLike(postId) {
    setInteract(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        liked: !((prev[postId] && prev[postId].liked) || false)
      }
    }));
  }

  // Handler for Comment UI toggle
  function handleToggleComment(postId) {
    setInteract(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        showComment: !((prev[postId] && prev[postId].showComment) || false)
      }
    }));
  }

  // Handler for comment typing
  function handleCommentText(postId, text) {
    setInteract(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        commentText: text
      }
    }));
  }
  // Handler for comment submit (demo, no actual backend)
  function handleCommentSubmit(postId, e) {
    e.preventDefault();
    setInteract(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        commentText: "",
        showComment: false
      }
    }));
  }

  // For the toast on save, track which post has just been saved and when
  const [saveToast, setSaveToast] = useState({ postId: null, timestamp: 0 });
  function handleSave(postId) {
    setInteract(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        saved: true
      }
    }));
    setSaveToast({ postId, timestamp: Date.now() });
    setTimeout(() => {
      setInteract(prev =>
        prev && prev[postId]
          ? { ...prev, [postId]: { ...prev[postId], saved: false } }
          : prev
      );
      setSaveToast(st => (st.postId === postId ? { postId: null, timestamp: 0 } : st));
    }, 1300);
  }

  return (
    <div className="emoaura-feed-root">
      {/* Story strip: always visible/pinned */}
      <div className="emoaura-story-strip" aria-label="Stories">
        {STORY_USERS.map(({ username, avatar }) => (
          <div key={username} className="emoaura-story-item">
            <span className="emoaura-story-ring">
              <img src={avatar} alt={`${username} avatar`} className="emoaura-story-avatar" loading="lazy" />
            </span>
            <span className="emoaura-story-user">{username}</span>
          </div>
        ))}
      </div>
      {/* FEED LIST */}
      <div className="emoaura-feed-list" aria-label="Feed">
        {posts.map(post => {
          const state = interact[post.id] || {};
          return (
            <div className="emoaura-feed-card" key={post.id} tabIndex={0}>
              {/* User */}
              <div className="emoaura-feed-card__user">
                <img src={post.avatar} alt={`${post.username} avatar`} className="emoaura-feed-card__avatar" loading="lazy" />
                <span className="emoaura-feed-card__username">{post.username}</span>
              </div>
              {/* Image */}
              <div className="emoaura-feed-card__image-container">
                <img
                  src={post.image}
                  alt="Feed post"
                  className="emoaura-feed-card__image"
                  loading="lazy"
                />
              </div>
              {/* Caption */}
              <div className="emoaura-feed-card__caption">
                {post.caption}
              </div>
              {/* Interaction bar */}
              <div className="emoaura-feed-card__actions">
                {/* Like */}
                <button
                  type="button"
                  aria-pressed={!!state.liked}
                  aria-label={state.liked ? "Unlike post" : "Like post"}
                  onClick={() => handleLike(post.id)}
                  className="emoaura-feed-action-btn"
                  style={{
                    color: state.liked ? "#fa3e3e" : "#fff7fd",
                    filter: state.liked ? "drop-shadow(0 0 8px #fa3e3e)" : "none"
                  }}
                  tabIndex={0}
                >
                  <span role="img" aria-label="Like">{state.liked ? "❤️" : "🤍"}</span>
                </button>
                {/* Comment */}
                <button
                  type="button"
                  aria-expanded={!!state.showComment}
                  aria-label={state.showComment ? "Cancel comment" : "Add comment"}
                  onClick={() => handleToggleComment(post.id)}
                  className="emoaura-feed-action-btn"
                  style={{
                    color: "#0ffccfcc"
                  }}
                  tabIndex={0}
                >
                  <span role="img" aria-label="Comment">💬</span>
                </button>
                {/* Save */}
                <button
                  type="button"
                  aria-label="Save post"
                  onClick={() => handleSave(post.id)}
                  className="emoaura-feed-action-btn"
                  style={{
                    color: state.saved ? "#00fff7" : "#fff",
                  }}
                  tabIndex={0}
                >
                  <span role="img" aria-label="Save">{state.saved ? "🔖" : "📑"}</span>
                </button>
              </div>
              {/* Comment UI */}
              {state.showComment && (
                <form
                  className="emoaura-feed-card__comment-form"
                  onSubmit={e => handleCommentSubmit(post.id, e)}
                >
                  <input
                    type="text"
                    value={state.commentText || ""}
                    maxLength={200}
                    onChange={e => handleCommentText(post.id, e.target.value)}
                    placeholder="Add a comment..."
                    className="emoaura-feed-card__comment-input"
                    aria-label="Comment input"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="emoaura-feed-comment-btn"
                    disabled={!(state.commentText && state.commentText.trim())}
                  >
                    Post
                  </button>
                </form>
              )}
              {/* Save toast */}
              {saveToast.postId === post.id && (
                <div className="emoaura-feed-card__toast">
                  Saved!
                </div>
              )}
              {/* Fadeinout CSS for toast */}
              <style>
                {`
                @keyframes emo-toast-fade {
                  0% { opacity: 0; transform: translateY(-10px) scale(0.91);}
                  10% { opacity: 1; transform: translateY(0) scale(1);}
                  84% { opacity: 1; }
                  100% { opacity: 0; transform: translateY(-10px) scale(0.97);}
                }
                `}
              </style>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeedPage;
