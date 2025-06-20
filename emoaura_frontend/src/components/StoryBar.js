import React from "react";
import { NavLink } from "react-router-dom";
import "./StoryBar.css";

/**
 * Vertical menu sidebar for navigation in Sérene.
 * Order: Feed, Explore Hash, Message, Profile, Post, Journals, TuneMyMood
 */
// PUBLIC_INTERFACE
function StoryBar() {
  return (
    <nav className="serene-storybar" aria-label="Main navigation">
      <div className="serene-storybar__title" style={{marginBottom: 9, marginLeft: 8, opacity:0.82}}>
        Menu
      </div>
      <NavLink to="/" end className={({ isActive }) =>
        "serene-nav-link" + (isActive ? " active" : "")
      }>
        Feed
      </NavLink>
      <NavLink to="/explore" className={({ isActive }) =>
        "serene-nav-link" + (isActive ? " active" : "")
      }>
        Explore Hash
      </NavLink>
      <NavLink to="/messaging" className={({ isActive }) =>
        "serene-nav-link" + (isActive ? " active" : "")
      }>
        Message
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) =>
        "serene-nav-link" + (isActive ? " active" : "")
      }>
        Profile
      </NavLink>
      <NavLink to="/post" className={({ isActive }) =>
        "serene-nav-link" + (isActive ? " active" : "")
      }>
        Post
      </NavLink>
      <NavLink to="/journals" className={({ isActive }) =>
        "serene-nav-link" + (isActive ? " active" : "")
      }>
        Journals
      </NavLink>
      <NavLink to="/tune" className={({ isActive }) =>
        "serene-nav-link" + (isActive ? " active" : "")
      }>
        TuneMyMood
      </NavLink>
    </nav>
  );
}

export default StoryBar;
