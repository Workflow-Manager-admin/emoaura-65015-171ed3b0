import React from "react";
import './NavBar.css';
import Logo from '../assets/logo.svg';

// PUBLIC_INTERFACE
function NavBar() {
  /**
   * Header bar for Sérene. Renders logo and app name only.
   */
  return (
    <nav className="serene-navbar">
      <div className="serene-navbar__logo">
        <img
          src={Logo}
          className="serene-navbar__logo-symbol"
          alt="Sérene logo"
          aria-label="Sérene logo"
          height="34"
        />
        <span className="serene-navbar__brand">Sérene</span>
      </div>
    </nav>
  );
}

export default NavBar;
