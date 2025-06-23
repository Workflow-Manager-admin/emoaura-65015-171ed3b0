import React, { useState, useRef, useEffect } from "react";
import styles from "./MessagesDMPage.module.css";

/**
 * Avatar helper (pixel-art placeholders)
 */
const AVATAR_API = "https://api.dicebear.com/7.x/pixel-art/svg?seed=";
const randomSeed = () => Math.random().toString(36).substring(2, 11);
const demoNames = [
  "Aurora", "Nova", "Moonlit", "Echo", "Vibe", "Opal", "Muse", "Rift", "Mellow", "Bliss", "Ray", "Opal", "Sage"
];

/**
 * Generate fake chat list data for demo
 */
function genChats() {
  const previews = [
    "See you at 7!", "Let's catch up soon", "LOL 😂", "On my way!", "Did you check?", "Of course!", "🌸 Good vibes!", "That's so sweet!", "Haha, same here!", "What a mood!", "Alright, ttyl!", "Dream big!", "Absolutely!"
  ];
  return demoNames.map((name, i) => ({
    id: `c${i}`,
    username: name,
    avatar: `${AVATAR_API}${name}${randomSeed()}`,
    preview: previews[i % previews.length],
    unread: i === 0 || i === 2,
    history: [
      {
        text: "Hey! How are you?",
        fromMe: false,
        ts: Date.now() - 3600_000 * (Math.random() * 10 + 2),
      },
      {
        text: "I’m good, you?",
        fromMe: true,
        ts: Date.now() - 3600_000 * (Math.random() * 5 + 1),
      },
      {
        text: previews[i % previews.length],
        fromMe: false,
        ts: Date.now() - 900_000 * (Math.random() * 9 + 1),
      },
    ].sort((a, b) => a.ts - b.ts),
  }));
}

function formatTime(ts) {
  // Returns formatted time string (e.g., 8:30 PM or 4/3/24)
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
export default function MessagesDMPage() {
  /**
   * Messages/DM main page with left nav, chat list, main chat area, and right info sidebar.
   * Demo only: all data simulated via useState.
   */
  const [chats, setChats] = useState(genChats);
  const [selected, setSelected] = useState(chats[0]?.id ?? "");
  const [entry, setEntry] = useState("");
  const chatEndRef = useRef(null);

  // Mark unread=false on open
  useEffect(() => {
    setChats(chs =>
      chs.map(c =>
        c.id === selected ? { ...c, unread: false } : c
      )
    );
  }, [selected]);

  // Auto-scroll to latest
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected, chats]);

  // Find selected chat
  const chat = chats.find(c => c.id === selected) || chats[0];

  // Message sending, "typing" indicator, and delivery simulation
  const [isTyping, setIsTyping] = useState(false); // "other user typing..."
  const [justSent, setJustSent] = useState(false);

  // Simulate delayed "delivered/read" after sending a message
  useEffect(() => {
    if (justSent) {
      const t = setTimeout(() => setJustSent(false), 800);
      return () => clearTimeout(t);
    }
  }, [justSent]);

  // Simulate somebody else typing when you select chat
  useEffect(() => {
    setIsTyping(false);
    const typingTimeout = setTimeout(() => {
      // Randomly, sometimes simulate typing indicator for others
      if (Math.random() < 0.4) setIsTyping(true);
      const doneTimeout = setTimeout(() => setIsTyping(false), 1500 + Math.random() * 1100);
      return () => clearTimeout(doneTimeout);
    }, 430 + Math.random() * 800);
    return () => clearTimeout(typingTimeout);
  }, [selected]);

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
            preview: entry.trim(),
            unread: false,
          }
          : c
      )
    );
    setEntry("");
    setJustSent(true);
  }

  function handleInputKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Safely handle possible undefined import or object error for styles/messagesRoot
  const containerClass =
    styles && styles["messagesRoot"]
      ? styles["messagesRoot"]
      : "messages-root"; // fallback className

  return (
    <div className={containerClass}>
      {/* Left Nav Bar */}
      <aside className={styles && styles["messagesNav"] ? styles["messagesNav"] : "messages-nav"}>
        <div className={styles && styles["messagesNavLogo"] ? styles["messagesNavLogo"] : "messages-nav-logo"}>
          <span role="img" aria-label="logo">💬</span>
        </div>
        <nav className={styles && styles["messagesNavList"] ? styles["messagesNavList"] : "messages-nav-list"}>
          <button className={styles && styles["navItemActive"] ? styles["navItemActive"] : "messages-nav-item active"} aria-label="Messages">
            <span role="img" aria-label="">✉️</span>
          </button>
          <button className={styles && styles["navItem"] ? styles["navItem"] : "messages-nav-item"} aria-label="Requests">
            <span role="img" aria-label="">📥</span>
          </button>
          <button className={styles && styles["navItem"] ? styles["navItem"] : "messages-nav-item"} aria-label="Archive">
            <span role="img" aria-label="">🗂️</span>
          </button>
        </nav>
      </aside>

      {/* Chat List Sidebar */}
      <aside className={styles && styles["messagesSidebar"] ? styles["messagesSidebar"] : "messages-sidebar"} aria-label="Chat list">
        <div className={styles && styles["sidebarTitle"] ? styles["sidebarTitle"] : "messages-sidebar-title"}>Chats</div>
        <div className={styles && styles["chatList"] ? styles["chatList"] : "messages-chat-list"}>
          {chats.map(c => (
            <button
              key={c.id}
              className={
                (styles && styles["chatListItem"] ? styles["chatListItem"] : "messages-chat-list-item") +
                (c.id === selected ? (styles && styles["selected"] ? ` ${styles["selected"]}` : " selected") : "") +
                (c.unread ? (styles && styles["unread"] ? ` ${styles["unread"]}` : " unread") : "")
              }
              onClick={() => setSelected(c.id)}
              aria-current={c.id === selected ? "page" : undefined}
              tabIndex={0}
            >
              <img
                src={c.avatar}
                alt={c.username + " avatar"}
                className={styles && styles["chatAvatar"] ? styles["chatAvatar"] : "messages-chat-avatar"}
                loading="lazy"
              />
              <div className={styles && styles["chatMain"] ? styles["chatMain"] : "messages-chat-main"}>
                <div className={styles && styles["chatUsername"] ? styles["chatUsername"] : "messages-chat-username"}>{c.username}</div>
                <div className={styles && styles["chatPreview"] ? styles["chatPreview"] : "messages-chat-preview"}>{c.preview}</div>
              </div>
              {c.unread &&
                <div className={styles && styles["unreadDot"] ? styles["unreadDot"] : "messages-unread-dot"} aria-label="unread" />}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Panel */}
      <main className={styles && styles["messagesMain"] ? styles["messagesMain"] : "messages-main"}>
        <header className={styles && styles["mainHeader"] ? styles["mainHeader"] : "messages-main-header"}>
          <img
            src={chat.avatar}
            alt={chat.username + " avatar"}
            className={styles && styles["mainAvatar"] ? styles["mainAvatar"] : "messages-main-avatar"}
          />
          <span className={styles && styles["mainUsername"] ? styles["mainUsername"] : "messages-main-username"}>{chat.username}</span>
        </header>
        <section className={styles && styles["mainHistory"] ? styles["mainHistory"] : "messages-main-history"} aria-label={`Chat with ${chat.username}`}>
          {chat.history.map((msg, idx) => (
            <div
              key={msg.ts + "-" + idx + (msg.fromMe ? "-me" : "")}
              className={
                (styles && styles["bubbleRow"] ? styles["bubbleRow"] : "messages-bubble-row") +
                " " + (msg.fromMe
                  ? (styles && styles["me"] ? styles["me"] : "me")
                  : (styles && styles["them"] ? styles["them"] : "them"))
              }
            >
              <div
                className={
                  (styles && styles["bubble"] ? styles["bubble"] : "messages-bubble") +
                  " " + (msg.fromMe
                    ? (styles && styles["right"] ? styles["right"] : "right")
                    : (styles && styles["left"] ? styles["left"] : "left"))
                }
              >
                <span className={styles && styles["bubbleText"] ? styles["bubbleText"] : "messages-bubble-text"}>{msg.text}</span>
                <span className={styles && styles["bubbleTs"] ? styles["bubbleTs"] : "messages-bubble-ts"}>{formatTime(msg.ts)}</span>
              </div>
            </div>
          ))}
          {isTyping &&
            <div className={
              (styles && styles["bubbleRow"] ? styles["bubbleRow"] : "messages-bubble-row") +
              " " + (styles && styles["them"] ? styles["them"] : "them")
            }>
              <div className={`${styles && styles["bubble"] ? styles["bubble"] : "messages-bubble"} ${styles && styles["left"] ? styles["left"] : "left"} ${styles && styles["typingBubble"] ? styles["typingBubble"] : ""}`}>
                <TypingIndicator />
              </div>
            </div>}
          <div ref={chatEndRef} />
        </section>
        <form
          className={styles && styles["inputBox"] ? styles["inputBox"] : "messages-main-inputbox"}
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          <textarea
            value={entry}
            onChange={e => setEntry(e.target.value)}
            onKeyDown={handleInputKey}
            className={styles && styles["input"] ? styles["input"] : "messages-input"}
            placeholder="Type a message…"
            maxLength={400}
            rows={1}
            aria-label="Message input"
            autoFocus
          />
          <button
            type="submit"
            className={styles && styles["sendBtn"] ? styles["sendBtn"] : "messages-send-btn"}
            disabled={!entry.trim()}
            aria-label="Send Message"
          >
            <span role="img" aria-label="Send">➤</span>
          </button>
        </form>
        {justSent &&
          <div className={styles && styles["deliveredStatus"] ? styles["deliveredStatus"] : "delivered-status"}>Delivered</div>
        }
      </main>

      {/* Right Sidebar: Placeholder for user info/media */}
      <aside className={styles && styles["messagesRight"] ? styles["messagesRight"] : "messages-right"}>
        <div className={styles && styles["rightPlaceholder"] ? styles["rightPlaceholder"] : "messages-right-placeholder"}>
          <span role="img" aria-label="Vibes">🌸</span>
          <div className={styles && styles["rightHint"] ? styles["rightHint"] : "messages-right-hint"}>User Info/Media</div>
        </div>
      </aside>
    </div>
  );
}

// PUBLIC_INTERFACE
function TypingIndicator() {
  // Simple three dot animated typing effect
  return (
    <span style={{ display: "inline-block", verticalAlign: "middle" }}>
      <span style={{
        display: "inline-block",
        width: 8, height: 8, borderRadius: "50%",
        background: "#e0c7ef", marginRight: 3, animation: "typingAni 1.05s infinite alternate"
      }} />
      <span style={{
        display: "inline-block",
        width: 8, height: 8, borderRadius: "50%",
        background: "#d6b7fd", marginRight: 3, animation: "typingAni 1.05s 0.18s infinite alternate"
      }} />
      <span style={{
        display: "inline-block",
        width: 8, height: 8, borderRadius: "50%",
        background: "#dcb1e0", animation: "typingAni 1.05s 0.32s infinite alternate"
      }} />
      <style>
        {`
          @keyframes typingAni {
            0% { opacity: .65; transform: scale(0.7);}
            49%{ opacity: .9; }
            100% { opacity: 1; transform: scale(1.05);}
          }
        `}
      </style>
    </span>
  );
}
