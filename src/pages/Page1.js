import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import LineChart from "../components/LineChart";
import Alarm from "../components/Alarm";
import "./Page1.css";

const Page1 = () => {
  const [csvFiles, setCsvFiles] = useState([]); // List of CSV files
  const [fileName, setFileName] = useState(null); // Selected file
  const [csvData, setCsvData] = useState([]); // Data for the selected file

  useEffect(() => {
    fetchCsvFiles();
  }, []);

  // Fetch the list of CSV files from the backend
  const fetchCsvFiles = async () => {
    try {
      const response = await fetch("http://localhost:8000/csv_files"); // Update with your backend URL
      if (!response.ok) {
        console.error("Failed to fetch CSV files:", response.statusText);
        return;
      }

      const { csv_files } = await response.json();
      if (csv_files && csv_files.length > 0) {
        setCsvFiles(csv_files);

        // Automatically select the latest file on initial load
        const latestFile = getLatestFile(csv_files);
        setFileName(latestFile);
        fetchFileData(latestFile);
      } else {
        console.error("No CSV files available.");
      }
    } catch (error) {
      console.error("Error fetching CSV files:", error);
    }
  };

  // Determine the latest file based on the timestamp
  const getLatestFile = (files) => {
    return files.sort((a, b) => {
      const getTimestamp = (fileName) => {
        const timestamp = fileName.match(/\d{14}/); // Match the 14-digit timestamp
        return timestamp ? dayjs(timestamp[0], "YYYYMMDDHHmmss").valueOf() : 0;
      };
      return getTimestamp(b) - getTimestamp(a); // Descending order
    })[0];
  };

  // Fetch data for the selected file
  const fetchFileData = async (selectedFile) => {
    try {
      const response = await fetch(`http://localhost:8000/data?file_name=${selectedFile}`); // Update with your backend URL
      if (!response.ok) {
        console.error("Failed to fetch file data:", response.statusText);
        return;
      }

      const data = await response.json();
      setCsvData(data);
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  };

  // Handle file selection from the dropdown
  const handleDropdownChange = (event) => {
    const selectedFile = event.target.value;
    setFileName(selectedFile);
    fetchFileData(selectedFile);
  };

  return (
    <div className="dashboard">
      {/* Dropdown and File Name container */}
      <div className="file-dropdown-container-wrapper">
        <div className="file-dropdown-container">
          <h3>Select a CSV File:</h3>
          <select
            value={fileName || ""}
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
        {/* {fileName && <p className="file-name">Selected File Name: {fileName}</p>} */}
      </div>
      <div className="content-container">
      
        <div className="chart-section">
          
          {csvData.length > 0 ? (
            <LineChart fileName={fileName} data={csvData} />
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
        <div className="alarm-section">
          {csvData.length > 0 ? (
            <Alarm fileName={fileName} alarmData={csvData} />
          ) : (
            <p>Loading alarm data...</p>
          )}
        </div>
      </div>
    </div>

  );
};

export default Page1;
