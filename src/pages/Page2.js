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

  // useEffect(() => {
  //   const fetchCsvFiles = async () => {
  //     try {
  //       const response = await axios.get("https://v36ua2mw2spxphztmdrwb5tahi0pltwl.lambda-url.ap-south-1.on.aws/csv_files");
  //       setCsvFiles(response.data.csv_files);
  //     } catch (error) {
  //       console.error("Error fetching CSV files:", error);
  //     }
  //   };

  //   fetchCsvFiles();
  // }, []);

   const handleDropdownChange = (event) => {
     setSelectedFile(event.target.value);
   };

  return (
    <div className="page2-container">
      {/* User Info and Sign Out Button */}
      <div className="user-info">
        <h1>Welcome, {user?.username}</h1>
        <button onClick={signOut} className="sign-out-button">
          Sign Out
        </button>
      </div>

      {/* Conditionally render the dropdown */}
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

      {/* Display content when a file is selected */}
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
