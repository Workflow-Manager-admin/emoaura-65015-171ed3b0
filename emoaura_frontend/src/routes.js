import React from "react";
import Feed from "./components/Feed";
import Explore from "./components/Explore";

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
  /** Placeholder for Profile route. */
  return <div className="serene-feed__placeholder">Sérene Profile Area</div>;
}

// PUBLIC_INTERFACE
export function AdminPage() {
  /** Placeholder for Admin route. */
  return <div className="serene-feed__placeholder">Sérene Admin Dashboard</div>;
}

// PUBLIC_INTERFACE
export function MessagingPage() {
  /** Placeholder for Messaging route. */
  return <div className="serene-feed__placeholder">Sérene Messaging Area</div>;
}
