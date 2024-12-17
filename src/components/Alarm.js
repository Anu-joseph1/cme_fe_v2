import React, { useEffect, useState } from "react";
import axios from "axios";
import './Alarm.css';

const Alarm = ({ fileName }) => {
  const [alarmData, setAlarmData] = useState([]);

  useEffect(() => {
    const fetchAlarmData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/data_alarm", {
          params: { file_name: fileName }
        });
        console.log("Alarm Data:", response.data);
        setAlarmData(response.data); // Store the API response
      } catch (error) {
        console.error("Error fetching alarm data:", error);
      }
    };

    if (fileName) {
      fetchAlarmData();
    }
  }, [fileName]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A'; // If no timestamp, return 'N/A'
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleString(); // Format it to a readable string
  };

  if (!alarmData.length) {
    return <div className="alarm-container">No alarm data available.</div>;
  }

  return (
    <div className="alarm-container">
      <h2>Alarm Data</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Alarm</th>
              <th>Appearance Time</th>
              <th>Disappearance Time</th>
            </tr>
          </thead>
          <tbody>
          {alarmData.map((alarm, index) => {
              // Log the appeared_at and disappeared_at timestamps
              console.log(`Alarm ${alarm.alarm}: appeared_at = ${alarm.appeared_at}, disappeared_at = ${alarm.disappeared_at}`);

              return (
                <tr key={index}>
                  <td>{alarm.alarm}</td>
                  <td>{formatTimestamp(alarm.appeared_at)}</td>
                  <td>{formatTimestamp(alarm.disappeared_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alarm;
