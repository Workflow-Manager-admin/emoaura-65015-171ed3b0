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
      <div className="serene-app">
        {/* Navigation Bar - now minimal, logo/appname only */}
        <NavBar />

        {/* Main Content Layout */}
        <div className="serene-main-container">
          {/* Vertical Side Menu */}
          <StoryBar />

          {/* Routed Feed/Main Area */}
          <main className="serene-feed">
            <Routes>
              <Route path="/" element={<FeedPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/messaging" element={<MessagingPage />} />
              {/* Optionally add: Journals, Post, TuneMyMood, if implemented */}
              {/* <Route path="/journals" element={<JournalsPage />} /> */}
              {/* <Route path="/post" element={<PostPage />} /> */}
              {/* <Route path="/tune" element={<TuneMyMoodPage />} /> */}
            </Routes>
          </main>

          {/* Sidebar/Profile */}
          <Sidebar />
        </div>

        {/* Modal Overlays */}
        <div className="serene-modal-overlay" style={{ display: "none" }}>
          {/* Placeholder for overlays: will be used for popups/modal dialogs */}
          Modal Overlay Placeholder
        </div>
      </div>
    </Router>
  );
}

export default App;
