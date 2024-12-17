import React, { useState, useEffect } from "react";
import axios from "axios";
import LineChart from "../components/LineChart";
import Alarm from "../components/Alarm";
import dayjs from "dayjs";
import './Page2.css';

const Page2 = () => {
  const [startDateTime, setStartDateTime] = useState(dayjs().subtract(6, "hour"));
  const [endDateTime, setEndDateTime] = useState(dayjs());
  const [csvFiles, setCsvFiles] = useState([]); // List of CSV files
  const [selectedFile, setSelectedFile] = useState(null); // Selected file

  useEffect(() => {
    // Fetch the list of CSV files from the backend
    const fetchCsvFiles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/csv_files");
        setCsvFiles(response.data.csv_files); // Assumes API returns { csv_files: [] }
      } catch (error) {
        console.error("Error fetching CSV files:", error);
      }
    };

    fetchCsvFiles();
  }, []);

  const handleDropdownChange = (event) => {
    // Set the selected file from the dropdown list
    const selectedFileName = event.target.value;
    setSelectedFile(selectedFileName);
  };

  return (
    <div className="page2-container">
      {/* Dropdown for CSV Files */}
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
