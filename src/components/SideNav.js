import React from 'react';
import './SideNav.css';
import { Link, useLocation  } from 'react-router-dom';

const SideNav = ({ isOpen, toggleNav }) => {
  
  const location = useLocation();

  return (
    <div className={`sidenav ${isOpen ? 'open' : ''}`}>
      <span className="closebtn" onClick={toggleNav}>&times;</span>
      <Link to="/page1" className={location.pathname === '/page1' ? 'active' : ''}>Dashboard</Link>
      {/* <Link to="/page2" className={location.pathname === '/page2' ? 'active' : ''}>Profile</Link> */}

    </div>
  );
};

export default SideNav;

//eduwhyg
