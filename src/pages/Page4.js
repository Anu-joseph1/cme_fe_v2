// src/pages/Page4.js
import React, { useState, useEffect } from 'react';
import CycleDropdown from '../components/CycleDropdown';
import ReportTable from '../components/ReportTable';

// import logo from '../assets/beml-logo.png';

const Page4 = () => {
  const [cycleOptions, setCycleOptions] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState(null);
  const [cycleData, setCycleData] = useState(null);

  useEffect(() => {
    // Fetch the list of cycle IDs and part numbers when the component mounts
    fetch('https://osyetsej45if3gu5e23edtuqfe0ttzoo.lambda-url.ap-south-1.on.aws/get_report_cycleid') // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => {
        setCycleOptions(data);
        if (data.length > 0) {
          setSelectedCycleId(data[0].cycle_id); // Set the first item as default
        }
      })
      .catch(error => console.error('Error fetching cycle data:', error));
  }, []);

  const handleCycleSelect = (cycleId) => {
    setSelectedCycleId(cycleId);
    // Fetch the complete cycle data for the selected ID
    fetch(`https://osyetsej45if3gu5e23edtuqfe0ttzoo.lambda-url.ap-south-1.on.aws/report_data?cycle_id=${cycleId}`) // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => {
        console.log('Fetched cycle data:', data);
        setCycleData(data);
      })
      .catch(error => console.error('Error fetching cycle data:', error));
  };

  useEffect(() => {
    if (selectedCycleId) {
      handleCycleSelect(selectedCycleId);
    }
  }, [selectedCycleId]);

  return (
    <div style={{ marginTop: '10px' }}>
      <CycleDropdown
        options={cycleOptions}
        defaultOption={selectedCycleId}
        onSelect={handleCycleSelect}
        label="Selected Cycle:"
      />
      {/* cycleData will Pass the fetched cycle data to ReportTable */}
      {cycleData && <ReportTable testData={cycleData} />}
    </div>
  );
};

export default Page4;
