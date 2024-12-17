import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import LineChart from "../components/LineChart";
import DateTimePickerComponent from "../components/DateTimePickerComponent";
import Alarm from "../components/Alarm";
import "./Page1.css";

const Page1 = () => {
  const location = useLocation();
  const [fileName, setFileName] = useState(location.state?.fileName || null);
  const [csvData, setCsvData] = useState([]);
  const [startDateTime, setStartDateTime] = useState(dayjs().subtract(6, "hour"));


  useEffect(() => {
    fetchLatestFile();
  }, []);

  const fetchLatestFile = async () => {
    try {
      // Fetch the list of CSV files from the backend
      const response = await fetch("http://localhost:8000/csv_files"); // Update with your backend URL
      if (!response.ok) {
        console.error("Failed to fetch CSV files:", response.statusText);
        return;
      }

      const { csv_files } = await response.json();

      if (csv_files && csv_files.length > 0) {
        // Sort the files by timestamp in descending order
        const sortedFiles = csv_files.sort((a, b) => {
          const getTimestamp = (fileName) => {
            const timestamp = fileName.match(/\d{14}/); // Match the 14-digit timestamp
            return timestamp ? dayjs(timestamp[0], "YYYYMMDDHHmmss").valueOf() : 0;
          };
          return getTimestamp(b) - getTimestamp(a); // Descending order
        });

        const latestFile = sortedFiles[0]; // Get the latest file
        setFileName(latestFile);

        // Fetch the data of the latest file
        fetchFileData(latestFile);
      } else {
        console.error("No CSV files available.");
      }
    } catch (error) {
      console.error("Error fetching CSV files:", error);
    }
  };

  const fetchFileData = async (fileName) => {
    try {
      const response = await fetch(`http://localhost:8000/data?file_name=${fileName}`); // Update with your backend URL
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

  return (
    <div className="dashboard">
      <div className="controls-container">
        <DateTimePickerComponent
          label="Start DateTime:"
          value={startDateTime}
          onChange={setStartDateTime}
        />
      </div>

      <div className="content-container">
  <div className="chart-section">
    {fileName && <h3 className="file-name">File Name: {fileName}</h3>}
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
