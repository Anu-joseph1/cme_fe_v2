// src/pages/Page3.js
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import AlertComponent from '../components/AlertComponent';
import Button from '../components/Button';
import DateTimePickerComponent from '../components/DateTimePickerComponent';


const Page3 = () => {
  const [startDateTime, setStartDateTime] = useState(dayjs().subtract(6, 'hour'));
  const [endDateTime, setEndDateTime] = useState(dayjs());
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const fromTimestamp = Math.floor((new Date(startDateTime).getTime() + 5.5 * 60 * 60 * 1000) / 1000); // Convert to seconds in IST
      const toTimestamp = Math.floor((new Date(endDateTime).getTime() + 5.5 * 60 * 60 * 1000) / 1000); // Convert to seconds in IST

      try {
        const response = await fetch(`https://osyetsej45if3gu5e23edtuqfe0ttzoo.lambda-url.ap-south-1.on.aws/alarm_data?from_timestamp=${fromTimestamp}&to_timestamp=${toTimestamp}`);
        const data = await response.json();

        const formattedAlerts = data.map(item => ({
          datetime: item.timestamp,  // Assuming timestamp is in the response
          message: item.message,      // Assuming message is in the response
        }));

        setAlerts(formattedAlerts);
      } catch (error) {
        console.error('Error fetching alert data:', error);
      }
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 60000); // Update alert data every 60 seconds

    return () => clearInterval(interval);
  }, [startDateTime, endDateTime]);

  const handleClick = (hours) => {
    const newEndDateTime = dayjs();
    const newStartDateTime = dayjs().subtract(hours, 'hour');

    setStartDateTime(newStartDateTime);
    setEndDateTime(newEndDateTime);
  };

  return (
    <div style={{marginTop: "20px"}}>
      <div className="controls-container">
        <DateTimePickerComponent 
          label="Start DateTime:" 
          value={startDateTime} 
          onChange={setStartDateTime} 
        />
        <DateTimePickerComponent 
          label="End DateTime:" 
          value={endDateTime} 
          onChange={setEndDateTime} 
        />
        <Button text="Last 6 Hours" onClick={() => handleClick(6)} />
        <Button text="Last 1 Hour" onClick={() => handleClick(1)} />
      </div>
      <AlertComponent alerts={alerts} />
    </div>
  );
};

export default Page3;
