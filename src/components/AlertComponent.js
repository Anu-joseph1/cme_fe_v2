// src/components/AlertComponent.js
import React from 'react';
import './AlertComponent.css';

const AlertComponent = ({ alerts }) => {
  return (
    <div className="alert-container">
      {alerts.map((alert, index) => (
        <div key={index} className={`alert`}>
          <p className="alert-message">
            {alert.message}
            <span className="alert-datetime">{alert.datetime}</span>
          </p>
        </div>
      ))}

      {/* {alerts.map((alert, index) => (
        <div key={index} className={`alert ${alert.type}`}>
          <p><strong>{alert.title}</strong>{alert.message}</p>
        </div>
      ))} */}
    </div>
    
  );
};

export default AlertComponent;
