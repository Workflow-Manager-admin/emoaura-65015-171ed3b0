import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import StoryBar from './components/StoryBar';
import Sidebar from './components/Sidebar';

// React Router imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  FeedPage,
  ExplorePage,
  ProfilePage,
  AdminPage,
  MessagingPage
} from "./routes";

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <div className="emoaura-app">
        {/* Navigation Bar */}
        <NavBar />

        {/* Main Content Layout */}
        <div className="emoaura-main-container">
          {/* Story Bar */}
          <StoryBar />

          {/* Routed Feed/Main Area */}
          <main className="emoaura-feed">
            <Routes>
              <Route path="/" element={<FeedPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/messaging" element={<MessagingPage />} />
              {/* Optionally add a fallback route */}
              {/* <Route path="*" element={<FeedPage />} /> */}
            </Routes>
          </main>

          {/* Sidebar/Profile */}
          <Sidebar />
        </div>

        {/* Modal Overlays */}
        <div className="emoaura-modal-overlay" style={{ display: "none" }}>
          {/* Placeholder for overlays: will be used for popups/modal dialogs */}
          Modal Overlay Placeholder
        </div>
      </div>
    </Router>
  );
}

export default App;