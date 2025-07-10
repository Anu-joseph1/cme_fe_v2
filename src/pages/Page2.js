import React, { useState, useEffect } from "react";
import axios from "axios";
import LineChart from "../components/LineChart";
import Alarm from "../components/Alarm";
import dayjs from "dayjs";
import "./Page2.css";

const Page2 = ({ showDropdown, user, signOut }) => {
  const [startDateTime, setStartDateTime] = useState(dayjs().subtract(6, "hour"));
  const [endDateTime, setEndDateTime] = useState(dayjs());
  const [csvFiles, setCsvFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    //  FIX for Login — auto reload if user is null but likely logged in
    if (!user) {
      console.log("⏳ User not available on Page2, reloading...");
      setTimeout(() => {
        window.location.reload();
      }, 300); // wait a bit before reload
    } else {
      console.log(" Detected logged-in user:", user.username);
    }
  }, [user]);

  const handleDropdownChange = (event) => {
    setSelectedFile(event.target.value);
  };

  return (
    <div className="page2-container">
      <div className="user-info">
        <h1>Welcome, {user?.username || "Loading user..."}</h1>
        <button
          onClick={async () => {
            try {
              await signOut();
              localStorage.clear();
              sessionStorage.clear();
              console.log(" User signed out, local/session storage cleared");
              window.location.reload(); // Force hard refresh
            } catch (err) {
              console.error(" Sign-out error:", err);
            }
          }}
          className="sign-out-button"
        >
          Sign Out
        </button>
      </div>

      {showDropdown && (
        <div className="file-dropdown-container">
          <h2>Select a CSV File:</h2>
          <select
            value={selectedFile || ""}
            onChange={handleDropdownChange}
            className="file-dropdown"
          >
            <option value="" disabled>
              -- Choose a file --
            </option>
            {csvFiles.map((file, index) => (
              <option key={index} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedFile && (
        <div className="main-content">
          <h3 className="selected-file-name">Data for: {selectedFile}</h3>
          <div className="chart-and-alarm">
            <div className="alarm-section">
              <Alarm fileName={selectedFile} alarmDate={dayjs().format("DD/MM/YYYY")} />
            </div>
            <div className="chart-section">
              <LineChart fileName={selectedFile} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page2;
