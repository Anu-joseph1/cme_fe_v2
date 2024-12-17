// src/components/MainLayout.js
import React from 'react';
import TopBar from './TopBar';
import SideNavbar from './SideNavbar'; // Assuming you have this component
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <SideNavbar />
      <div className="content-area">
        <TopBar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
