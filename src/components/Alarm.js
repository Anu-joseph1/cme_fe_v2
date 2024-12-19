import React, { useEffect, useState } from "react";
import axios from "axios";
import './Alarm.css';

const Alarm = ({ fileName }) => {
  const [alarmData, setAlarmData] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null); // To track the alarm for the popup

  useEffect(() => {
    const fetchAlarmData = async () => {
      try {
        const response = await axios.get("https://v36ua2mw2spxphztmdrwb5tahi0pltwl.lambda-url.ap-south-1.on.aws/data_alarm", {
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

  const handleRowClick = (alarm) => {
    setSelectedAlarm(alarm); // Set the selected alarm for the popup
  };

  const closePopup = () => {
    setSelectedAlarm(null); // Clear the selected alarm to close the popup
  };

  if (!alarmData.length) {
    return <div className="alarm-container">No alarm data available.</div>;
  }

  return (
    <div className="alarm-container" style={{ position: 'relative' }}>
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
            {alarmData.map((alarm, index) => (
              <tr key={index} onClick={() => handleRowClick(alarm)} style={{ cursor: 'pointer' }}>
                <td className="alarm-name-container">{alarm.alarm}</td>
                <td>{formatTimestamp(alarm.appeared_at)}</td>
                <td>{formatTimestamp(alarm.disappeared_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAlarm && (
        <>
          <div className="dimmed-background" onClick={closePopup}></div>
          <div className="popup">
            <div className="popup-content">
              <h3>{selectedAlarm.alarm}</h3>
              <p>{selectedAlarm.troubleshoot}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Alarm;
