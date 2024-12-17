// src/components/CycleDropdown.js
import React, { useState } from 'react';
import './CycleDropdown.css';

const CycleDropdown = ({ options, defaultOption, onSelect, label }) => {
  const [selectedValue, setSelectedValue] = useState(defaultOption);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedValue(selectedId);
    onSelect(selectedId); // Trigger the API call with the selected ID
  };

  return (
    <div className="dropdown-container" style={{marginBottom:'10px'}}>
      <label>{label}</label>
      <select value={selectedValue} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option.cycle_id}>
            {`Cycle ${option.cycle_id} - Part No: ${option.part_no}`}
          </option>
        ))}
      </select>
      {/* <div>
        Selected Cycle ID: {selectedValue}
      </div> */}
    </div>
  );
};

export default CycleDropdown;
