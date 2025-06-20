import React, { useState, useRef, useEffect } from "react";
import "./Messages.css";

const AVATAR_API = "https://api.dicebear.com/7.x/pixel-art/svg?seed=";
const randomSeed = () => Math.random().toString(36).substring(2, 11);
const randomName = (() => {
  const names = [
    "Aurora", "Nova", "Moonlit", "Bliss", "Vireo", "Glint", "Muse", "Kindle",
    "Echo", "Rift", "Vibe", "Wisp", "Mellow", "Ray", "Opal", "Sage", "Lumina"
  ];
  let i = 0;
  return () => {
    if (i >= names.length) i = 0;
    return names[i++];
  }
})();

function genChats() {
  const previews = [
    "See you at 8pm! 😊", "Let’s catch up soon.", "That’s so inspiring!", "Haha, love it!",
    "Are you free this weekend?", "Did you see the new update?", "Sending hugs 🤗",
    "Check your inbox 📥", "On my way!", "That's a vibe", "Absolutely!", "Dream big 🌙"
  ];
  const chats = [];
  for (let i = 0; i < 10; i++) {
    const username = randomName();
    chats.push({
      id: `c${i}`,
      username,
      avatar: `${AVATAR_API}${username}${randomSeed()}`,
      preview: previews[Math.floor(Math.random() * previews.length)],
      unread: i === 0 || i === 3,
      history: [
        {
          text: "Hey! How are you?",
          fromMe: false,
          ts: Date.now() - 3600_000 * (Math.random() * 18 + 1),
        },
        {
          text: "I’m great! How about you?",
          fromMe: true,
          ts: Date.now() - 3600_000 * (Math.random() * 7 + 1),
        },
        {
          text: previews[i % previews.length],
          fromMe: false,
          ts: Date.now() - 900_000 * (Math.random() * 9 + 1),
        },
      ].sort((a, b) => a.ts - b.ts)
    });
  }
  return chats;
}

function formatTime(ts) {
  // Returns '8:30 PM' for local time, else date for older
  const dt = new Date(ts);
  const now = new Date();
  if (
    dt.getDate() === now.getDate() &&
    dt.getMonth() === now.getMonth() &&
    dt.getFullYear() === now.getFullYear()
  ) {
    let h = dt.getHours(), m = dt.getMinutes();
    const pm = h >= 12;
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m.toString().padStart(2, "0")} ${pm ? "PM" : "AM"}`;
  }
  return dt.toLocaleDateString();
}

// PUBLIC_INTERFACE
export default function Messages() {
  /** 
   * Main Messages/DM page layout: three-panel flex
   * - Left: fixed nav
   * - Mid: chat list sidebar
   * - Center: chat area
   * - Right: placeholder (optional)
   * Implements chat switching, unread tracking, bubble scroll, input/send, auto-scroll.
   */
  // Static nav/full layout placeholder (left)
  // Chats state (unread indicators etc)
  const [chats, setChats] = useState(genChats);
  // Select first chat initially
  const [selected, setSelected] = useState(chats[0].id);
  // Input box state
  const [entry, setEntry] = useState("");
  // Ref to bottom of chat for auto-scroll
  const chatEndRef = useRef(null);

  // Mark unread=false when open chat
  useEffect(() => {
    setChats(chs =>
      chs.map((c) =>
        c.id === selected ? { ...c, unread: false } : c
      )
    );
  }, [selected]);

  // Auto-scroll to latest message when new message or chat switched
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected, chats]);

  // Find current chat
  const chat = chats.find((c) => c.id === selected);

  function handleSend() {
    if (!entry.trim()) return;
    const now = Date.now();
    setChats(chs =>
      chs.map(c =>
        c.id === selected
          ? {
              ...c,
              history: [
                ...c.history,
                { text: entry.trim(), fromMe: true, ts: now },
              ],
            }
          : c
      )
    );
    setEntry("");
    // Auto-scroll will occur via useEffect.
  }

  function handleInputKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="messages-root">
      {/* Left nav bar */}
      <aside className="messages-nav">
        <div className="messages-nav-logo">
          <span role="img" aria-label="logo">💬</span>
        </div>
        <nav className="messages-nav-list">
          <button className="messages-nav-item active" aria-label="Messages">
            <span role="img" aria-label="">✉️</span>
          </button>
          <button className="messages-nav-item" aria-label="Requests">
            <span role="img" aria-label="">📥</span>
          </button>
          <button className="messages-nav-item" aria-label="Archive">
            <span role="img" aria-label="">🗂️</span>
          </button>
        </nav>
      </aside>

      {/* Sidebar list of chats */}
      <aside className="messages-sidebar" aria-label="Chat list">
        <div className="messages-sidebar-title">Chats</div>
        <div className="messages-chat-list">
          {chats.map(c => (
            <button
              key={c.id}
              className={
                "messages-chat-list-item" +
                (c.id === selected ? " selected" : "") +
                (c.unread ? " unread" : "")
              }
              onClick={() => setSelected(c.id)}
              aria-current={c.id === selected ? "page" : undefined}
            >
              <img
                src={c.avatar}
                alt={c.username + " avatar"}
                className="messages-chat-avatar"
                loading="lazy"
              />
              <div className="messages-chat-main">
                <div className="messages-chat-username">{c.username}</div>
                <div className="messages-chat-preview">{c.preview}</div>
              </div>
              {c.unread && (
                <div className="messages-unread-dot" aria-label="unread" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <main className="messages-main">
        <header className="messages-main-header">
          <img
            src={chat.avatar}
            alt={chat.username + " avatar"}
            className="messages-main-avatar"
          />
          <span className="messages-main-username">{chat.username}</span>
        </header>
        <section className="messages-main-history" aria-label={`Chat with ${chat.username}`}>
          {chat.history.map((msg, idx) => (
            <div
              key={msg.ts + "-" + idx + (msg.fromMe ? "-me" : "")}
              className={
                "messages-bubble-row" +
                (msg.fromMe ? " me" : " them")
              }
            >
              <div
                className={
                  "messages-bubble" +
                  (msg.fromMe ? " right" : " left")
                }
              >
                <span className="messages-bubble-text">{msg.text}</span>
                <span className="messages-bubble-ts">{formatTime(msg.ts)}</span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </section>
        <form
          className="messages-main-inputbox"
          onSubmit={e => {
            e.preventDefault(); handleSend();
          }}
        >
          <textarea
            value={entry}
            onChange={e => setEntry(e.target.value)}
            onKeyDown={handleInputKey}
            className="messages-input"
            placeholder="Type a message..."
            maxLength={400}
            rows={1}
            aria-label="Message input"
            autoFocus
          />
          <button
            type="submit"
            className="messages-send-btn"
            disabled={!entry.trim()}
            aria-label="Send Message"
          >
            <span role="img" aria-label="Send">➤</span>
          </button>
        </form>
      </main>

      {/* Right panel placeholder */}
      <aside className="messages-right">
        <div className="messages-right-placeholder">
          <span role="img" aria-label="Vibes">🌸</span>
        </div>
      </aside>
    </div>
  );
}
