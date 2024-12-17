// src/components/TableComponent.js
import React from 'react';
import dayjs from 'dayjs';
import './TableComponent.css';

const TableComponent = ({ data }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{width: "160px"}}>Date Time</th>
            <th>Right Temperature °C</th>
            <th>Right Sound dB</th>
            <th>Right Speed rpm</th>
            <th>Middle Temperature °C</th>
            <th>Middle Sound dB</th>
            <th>Left Temperature °C</th>
            <th>Left Sound dB</th>
            <th>Left Speed rpm</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{dayjs(row.datetime).format('YYYY-MM-DD HH:mm')}</td>
              <td>{row.rightTemperature}</td>
              <td>{row.rightSound}</td>
              <td>{row.rightSpeed}</td>
              <td>{row.middleTemperature}</td>
              <td>{row.middleSound}</td>
              <td>{row.leftTemperature}</td>
              <td>{row.leftSound}</td>
              <td>{row.leftSpeed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
