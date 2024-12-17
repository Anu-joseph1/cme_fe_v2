// src/components/TopBar.js
import React from 'react';
import { FaBell, FaBars } from 'react-icons/fa';
import './TopBar.css';

const TopBar = ({ toggleNav, logoSrc }) => {
  return (
    <div className="top-bar">
      <FaBars className="hamburger-menu" onClick={toggleNav} />
      <div className="logo-container">
        <img src={logoSrc} alt="Logo" className="logo" />
        <span className="company-name">CME DASHBOARD</span>
      </div>
      <div className="icons-container">
        <FaBell className="icon" />
        {/* <FaCog className="icon" /> */}
      </div>
    </div>
  );
};

export default TopBar;
