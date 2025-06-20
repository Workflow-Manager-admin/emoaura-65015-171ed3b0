import React from "react";

/** Placeholder components for top-level routes. */

/*
  All primary route placeholders for Sérene.
  These placeholder components show the new Sérene name and class.
*/

import Feed from "./components/Feed";

// PUBLIC_INTERFACE
export function FeedPage() {
  /** Scrollable Feed route for Sérene app: cyberpunk neon post cards. */
  return <Feed />;
}

// PUBLIC_INTERFACE
export function ExplorePage() {
  /** Placeholder for Explore route. */
  return <div className="serene-feed__placeholder">Sérene Explore Area</div>;
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
