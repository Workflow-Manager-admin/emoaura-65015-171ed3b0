import React from "react";
import Feed from "./components/Feed";
import Explore from "./components/Explore";
import MessagesDMPage from "./components/MessagesDMPage";
import ProfilePageComponent from "./components/ProfilePage";

/**
 * All primary route placeholders for Sérene.
 * These placeholder components show the new Sérene name and class.
 */

// PUBLIC_INTERFACE
export function FeedPage() {
  /** Scrollable Feed route for Sérene app: cyberpunk neon post cards. */
  return <Feed />;
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
