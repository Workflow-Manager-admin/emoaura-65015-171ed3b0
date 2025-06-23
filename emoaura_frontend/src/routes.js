import React from "react";
import FeedPageComponent from "./components/FeedPage";
import Feed from "./components/Feed";
import Explore from "./components/Explore";
import MessagesDMPage from "./components/MessagesDMPage";
import ProfilePageComponent from "./components/ProfilePage";

/**
 * All primary route placeholders for Sérene.
 * These placeholder components show the new Sérene name and class.
 */

/**
 * PUBLIC_INTERFACE
 * FeedPage: Render new FeedPage only (overrides old demo Feed).
 */
export function FeedPage() {
  /** Main Feed route for EmoAura app (modern, pinned stories, posts, interactions). */
  return <FeedPageComponent />;
}

// PUBLIC_INTERFACE
export function ExplorePage() {
  /**
   * Explore route: renders the performant, responsive, and visually appealing masonry/grid layout.
   */
  return <Explore />;
}

// PUBLIC_INTERFACE
export function ProfilePage() {
  /** Profile route: Profile setup and info, Instagram-inspired card design. */
  return <ProfilePageComponent />;
}

// PUBLIC_INTERFACE
export function AdminPage() {
  /** Placeholder for Admin route. */
  return <div className="serene-feed__placeholder">Sérene Admin Dashboard</div>;
}

 
// PUBLIC_INTERFACE
export function MessagingPage() {
  /** Messages/DM page with interactive cozy 3-panel chat layout. */
  return <MessagesDMPage />;
}
