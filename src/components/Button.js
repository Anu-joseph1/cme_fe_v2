// src/components/Button.js
import React from 'react';
import './Button.css'; // Create and import this CSS file for styling

const Button = ({ text, onClick, className }) => {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
