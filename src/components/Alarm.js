import React, { useEffect, useState } from "react";
import axios from "axios";
import './Alarm.css';

const Alarm = ({ fileName }) => {
  const [alarmData, setAlarmData] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  useEffect(() => {
    const fetchAlarmData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log("Token for Alarm Data:", token);

        const response = await axios.get(
          `https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/data_alarm?file_name=${encodeURIComponent(fileName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        console.log("Alarm Data:", data);
        setAlarmData(data);
      } catch (error) {
        console.error("Error fetching alarm data:", error.message);
      }
    };

    if (fileName) {
      fetchAlarmData();
    }
  }, [fileName]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const handleRowClick = (alarm) => {
    setSelectedAlarm(alarm);
  };

  const closePopup = () => {
    setSelectedAlarm(null);
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
                <td>{alarm.alarm}</td>
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
