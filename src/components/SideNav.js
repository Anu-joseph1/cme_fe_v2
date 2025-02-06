import React from 'react';
import './SideNav.css';
import { Link, useLocation  } from 'react-router-dom';

const SideNav = ({ isOpen, toggleNav }) => {
  
  const location = useLocation();

  return (
    <div className={`sidenav ${isOpen ? 'open' : ''}`}>
      <span className="closebtn" onClick={toggleNav}>&times;</span>
    
      
      
      <Link to="/page3" className={location.pathname === '/page3' ? 'active' : ''}>Equipment</Link>
      <Link to="/page1" className={location.pathname === '/page1' ? 'active' : ''}>Files</Link>
      <Link to="/page2" className={location.pathname === '/page2' ? 'active' : ''}>Login</Link> 
       
      

    </div>
  );
};

export default SideNav;

//eduwhyg
