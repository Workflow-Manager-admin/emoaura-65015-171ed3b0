import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import StoryBar from './components/StoryBar';
import Sidebar from './components/Sidebar';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="emoaura-app">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content Layout */}
      <div className="emoaura-main-container">
        {/* Story Bar */}
        <StoryBar />

        {/* Feed */}
        <main className="emoaura-feed">
          <div className="emoaura-feed__placeholder">
            Feed Area
          </div>
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
  );
}

export default App;