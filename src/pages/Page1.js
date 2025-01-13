import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import LineChart from "../components/LineChart";
import Alarm from "../components/Alarm";
import "./Page1.css";

const Page1 = () => {
  const [csvFiles, setCsvFiles] = useState([]); // List of CSV files
  const [fileName, setFileName] = useState(null); // Selected file
  const [csvData, setCsvData] = useState([]); // Data for the selected file
  const [selectedFile, setSelectedFile] = useState(null); // File selected for upload
  const [uploadMessage, setUploadMessage] = useState(""); // Message after upload
  const [showPopup, setShowPopup] = useState(false); // Popup visibility

  useEffect(() => {
    fetchCsvFiles();
  }, []);

  const fetchCsvFiles = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("token csv: ", token)
      // const response = await fetch("https://v36ua2mw2spxphztmdrwb5tahi0pltwl.lambda-url.ap-south-1.on.aws/csv_files"); // Update with your backend URL
      const response = await fetch("https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/csv_files",{
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
          "Content-Type": "application/json", // Optional: Set content type if required
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch CSV files:", response.statusText);
        return;
      }

      const { csv_files } = await response.json();
      console.log("CSV Files Fetched:", csv_files);

      if (csv_files && csv_files.length > 0) {
        setCsvFiles(csv_files);

        const latestFile = getLatestFile(csv_files);
        console.log("Latest File Selected:", latestFile);
        setFileName(latestFile);
        fetchFileData(latestFile);
      } else {
        console.error("No CSV files available.");
      }
    } catch (error) {
      console.error("Error fetching CSV files:", error);
    }
  };

  const getLatestFile = (files) => {
    return files.sort((a, b) => {
      const getTimestamp = (fileName) => {
        const timestamp = fileName.match(/\d{14}/);
        return timestamp ? dayjs(timestamp[0], "YYYYMMDDHHmmss").valueOf() : 0;
      };
      return getTimestamp(b) - getTimestamp(a);
    })[0];
  };

  const fetchFileData = async (selectedFile) => {
    try {
       const token = localStorage.getItem("authToken");
       console.log("Fetching data for file:", selectedFile, "with token:", token);
       console.log("token csv: ", token)
       //const response = await fetch(`https://v36ua2mw2spxphztmdrwb5tahi0pltwl.lambda-url.ap-south-1.on.aws/data?file_name=${selectedFile}`);
       const response = await fetch(`https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/data?file_name=${selectedFile}`,{
        headers: {
         Authorization: `Bearer ${token}`, // Add token to Authorization header
         "Content-Type": "application/json", // Optional: Set content type if required
        },
       });
      
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

  const handleDropdownChange = (event) => {
    const selectedFile = event.target.value;
    setFileName(selectedFile);
    fetchFileData(selectedFile);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      setShowPopup(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userid", "12345"); // Replace with actual user ID
    formData.append("new_filename", selectedFile.name); // Optional new filename


    
    try {
      const token = localStorage.getItem("authToken");
      console.log("token upload: ", token)

      if (!token) {
        setUploadMessage("Token missing. Please log in again.");
        setShowPopup(true);
        return;
      }
  
      const response = await fetch(`https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/upload/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Token added to the headers
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUploadMessage(data.message);
        fetchCsvFiles();
      } else {
        const errorData = await response.json();
        setUploadMessage(`Upload failed: ${errorData.detail}`);
      }
    } catch (error) {
      setUploadMessage(`Upload failed: ${error.message}`);
    } finally {
      setShowPopup(true);
    }
  };

  return (
    <div className="dashboard">
      <div className="top-section">
        {/* Dropdown and File Name container */}
        <div className="file-dropdown-container-wrapper">
          <div className="file-dropdown-container">
            <h5 className="select-csv-text">Select a CSV File:</h5>
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
        </div>

        {/* File Upload Section */}
        <div className="upload-container">
          <h5 className="upload-csv-text">Upload a CSV File:</h5>
          <form onSubmit={handleFileUpload}>
            <input type="file" accept=".csv" onChange={handleFileChange} className="choose-file-button"/>
            <button type="submit" className="upload-button custom-button">Upload </button>
          </form>
        </div>
      </div>

      {/* Popup for Upload Message */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup">
            <p>{uploadMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

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
