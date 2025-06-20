/*
 * EmoAura Navigation Bar
 * Now includes navigation links for main routes using react-router-dom's NavLink.
 */
import React from "react";
import './NavBar.css';
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
function NavBar() {
  /**
   * Navigation bar for EmoAura app with links to
   * Feed, Explore, Profile, Admin, and Messaging pages.
   */
  return (
    <nav className="emoaura-navbar">
      <div className="emoaura-navbar__logo">
        <span className="emoaura-navbar__logo-symbol" aria-label="emoji" role="img">🌈</span>
        <span className="emoaura-navbar__brand">EmoAura</span>
      </div>
      <div className="emoaura-navbar__actions">
        <NavLink
          to="/"
          end
          className={({ isActive }) => "emoaura-navbar__action-btn" + (isActive ? " active" : "")}
        >
          Feed
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) => "emoaura-navbar__action-btn" + (isActive ? " active" : "")}
        >
          Explore
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => "emoaura-navbar__action-btn" + (isActive ? " active" : "")}
        >
          Profile
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => "emoaura-navbar__action-btn" + (isActive ? " active" : "")}
        >
          Admin
        </NavLink>
        <NavLink
          to="/messaging"
          className={({ isActive }) => "emoaura-navbar__action-btn" + (isActive ? " active" : "")}
        >
          Messaging
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
