// src/components/Cards.js
import React from 'react';
import './Cards.css'; // Import the CSS file

const Cards = ({ cards }) => {
  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <div className="params" key={index}>
          {card.name}: <p className="value">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
