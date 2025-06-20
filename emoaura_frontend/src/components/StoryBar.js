import React from "react";
import { NavLink } from "react-router-dom";
import "./StoryBar.css";

/**
 * Vertical menu sidebar for navigation in Sérene.
 * Order: Feed, Explore Hash, Message, Profile, Post, Journals, TuneMyMood
 */
// PUBLIC_INTERFACE
function StoryBar() {
  /**
   * Renders the main vertical nav menu for the Sérene app.
   * Uses Instagram-inspired gradients and hover effects.
   */
  const menu = [
    { label: "Feed", to: "/" },
    { label: "Explore Hash", to: "/explore" },
    { label: "Message", to: "/messaging" },
    { label: "Profile", to: "/profile" },
    { label: "Post", to: "/post" },
    { label: "Journals", to: "/journals" },
    { label: "TuneMyMood", to: "/tune" },
  ];

  return (
    <nav className="serene-storybar" aria-label="Main navigation">
      <div className="serene-storybar__title" style={{marginBottom: 9, marginLeft: 8, opacity:0.82}}>
        Menu
      </div>
      {menu.map(({ label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            "serene-nav-link" + (isActive ? " active" : "")
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default StoryBar;
