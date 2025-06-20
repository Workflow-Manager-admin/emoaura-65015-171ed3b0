import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import StoryBar from './components/StoryBar';
import Sidebar from './components/Sidebar';
import StoryStrip from './components/StoryStrip';

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
        {/* Top Header */}
        <NavBar />

        {/* Layout: grid (left-fixed, center, right-fixed) */}
        <div className="serene-main-container">
          {/* Left vertical nav */}
          <StoryBar />

          {/* Central Column: stories strip + scrollable feed */}
          <div className="serene-center-col">
            <div className="serene-scrollable-content">
              {/* Horizontal stories strip under header */}
              <StoryStrip />
              {/* Main Feed Scrollable */}
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
            </div>
          </div>

          {/* Right sidebar */}
          <Sidebar />
        </div>

        {/* Modals */}
        <div className="serene-modal-overlay" style={{ display: "none" }}>
          Modal Overlay Placeholder
        </div>
      </div>
    </Router>
  );
}

export default App;
