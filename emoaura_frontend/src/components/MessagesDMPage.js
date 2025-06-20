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

  return (
    <div className={styles["messagesRoot"]}>
      {/* Left Nav Bar */}
      <aside className={styles["messagesNav"]}>
        <div className={styles["messagesNavLogo"]}>
          <span role="img" aria-label="logo">💬</span>
        </div>
        <nav className={styles["messagesNavList"]}>
          <button className={styles["navItemActive"]} aria-label="Messages">
            <span role="img" aria-label="">✉️</span>
          </button>
          <button className={styles["navItem"]} aria-label="Requests">
            <span role="img" aria-label="">📥</span>
          </button>
          <button className={styles["navItem"]} aria-label="Archive">
            <span role="img" aria-label="">🗂️</span>
          </button>
        </nav>
      </aside>

      {/* Chat List Sidebar */}
      <aside className={styles["messagesSidebar"]} aria-label="Chat list">
        <div className={styles["sidebarTitle"]}>Chats</div>
        <div className={styles["chatList"]}>
          {chats.map(c => (
            <button
              key={c.id}
              className={
                styles["chatListItem"] +
                (c.id === selected ? ` ${styles["selected"]}` : "") +
                (c.unread ? ` ${styles["unread"]}` : "")
              }
              onClick={() => setSelected(c.id)}
              aria-current={c.id === selected ? "page" : undefined}
              tabIndex={0}
            >
              <img
                src={c.avatar}
                alt={c.username + " avatar"}
                className={styles["chatAvatar"]}
                loading="lazy"
              />
              <div className={styles["chatMain"]}>
                <div className={styles["chatUsername"]}>{c.username}</div>
                <div className={styles["chatPreview"]}>{c.preview}</div>
              </div>
              {c.unread &&
                <div className={styles["unreadDot"]} aria-label="unread" />}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Panel */}
      <main className={styles["messagesMain"]}>
        <header className={styles["mainHeader"]}>
          <img
            src={chat.avatar}
            alt={chat.username + " avatar"}
            className={styles["mainAvatar"]}
          />
          <span className={styles["mainUsername"]}>{chat.username}</span>
        </header>
        <section className={styles["mainHistory"]} aria-label={`Chat with ${chat.username}`}>
          {chat.history.map((msg, idx) => (
            <div
              key={msg.ts + "-" + idx + (msg.fromMe ? "-me" : "")}
              className={
                styles["bubbleRow"] +
                " " + (msg.fromMe ? styles["me"] : styles["them"])
              }
            >
              <div
                className={
                  styles["bubble"] + " " + (msg.fromMe ? styles["right"] : styles["left"])
                }
              >
                <span className={styles["bubbleText"]}>{msg.text}</span>
                <span className={styles["bubbleTs"]}>{formatTime(msg.ts)}</span>
              </div>
            </div>
          ))}
          {isTyping &&
            <div className={styles["bubbleRow"] + " " + styles["them"]}>
              <div className={`${styles["bubble"]} ${styles["left"]} ${styles["typingBubble"]}`}>
                <TypingIndicator />
              </div>
            </div>}
          <div ref={chatEndRef} />
        </section>
        <form
          className={styles["inputBox"]}
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          <textarea
            value={entry}
            onChange={e => setEntry(e.target.value)}
            onKeyDown={handleInputKey}
            className={styles["input"]}
            placeholder="Type a message…"
            maxLength={400}
            rows={1}
            aria-label="Message input"
            autoFocus
          />
          <button
            type="submit"
            className={styles["sendBtn"]}
            disabled={!entry.trim()}
            aria-label="Send Message"
          >
            <span role="img" aria-label="Send">➤</span>
          </button>
        </form>
        {justSent &&
          <div className={styles["deliveredStatus"]}>Delivered</div>
        }
      </main>

      {/* Right Sidebar: Placeholder for user info/media */}
      <aside className={styles["messagesRight"]}>
        <div className={styles["rightPlaceholder"]}>
          <span role="img" aria-label="Vibes">🌸</span>
          <div className={styles["rightHint"]}>User Info/Media</div>
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
