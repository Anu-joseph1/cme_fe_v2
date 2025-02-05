import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import dayjs from "dayjs";
import LineChart from "../components/LineChart";
import Alarm from "../components/Alarm";
import "./Page1.css";

const Page1 = () => {
  const [csvFiles, setCsvFiles] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingAlarm, setLoadingAlarm] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [equipmentId, setEquipmentId] = useState("");

  const location = useLocation(); // Initialize useLocation
  const queryParams = new URLSearchParams(location.search);
  const equip_id = queryParams.get("equip_id"); // Get equip_id from query parameters

  useEffect(() => {
    fetchCsvFiles();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (equip_id) {
      setEquipmentId(equip_id);
      fetchCsvFilesByEquipmentId(equip_id);
    }
  }, [equip_id]);

  const fetchCsvFilesByEquipmentId = async (equip_id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/csv_files?equip_id=${equip_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch CSV files:", response.statusText);
        return;
      }

      const { csv_files } = await response.json();
      if (csv_files && csv_files.length > 0) {
        setCsvFiles(csv_files);
        const latestFile = getLatestFile(csv_files);
        setFileName(latestFile.filename);
        fetchFileData(latestFile.filename);
      } else {
        console.error("No CSV files available.");
      }
    } catch (error) {
      console.error("Error fetching CSV files:", error);
    }
  };

  const fetchCsvFiles = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/csv_files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch CSV files:", response.statusText);
        return;
      }

      const { csv_files } = await response.json();
      if (csv_files && csv_files.length > 0) {
        setCsvFiles(csv_files);
        const latestFile = getLatestFile(csv_files);
        setFileName(latestFile.filename);
        fetchFileData(latestFile.filename);
      } else {
        console.error("No CSV files available.");
      }

      const isAdmin = csv_files.some((file) => file.username === "admin");
      setIsAdmin(isAdmin);
    } catch (error) {
      console.error("Error fetching CSV files:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/secure-data",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch users:", response.statusText);
        return;
      }
      const { username, groups } = await response.json();
      setUsers([{ id: username, name: username }]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getLatestFile = (files) => {
    return files.sort((a, b) => {
      const getTimestamp = (fileName) => {
        const timestamp = fileName.match(/\d{14}/);
        return timestamp ? dayjs(timestamp[0], "YYYYMMDDHHmmss").valueOf() : 0;
      };
      return getTimestamp(b.filename) - getTimestamp(a.filename);
    })[0];
  };

  const fetchFileData = async (selectedFile) => {
    try {
      setLoadingChart(true);
      setLoadingAlarm(true);

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/data?file_name=${selectedFile}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch file data:", response.statusText);
        return;
      }

      const data = await response.json();
      setCsvData(data);
    } catch (error) {
      console.error("Error fetching file data:", error);
    } finally {
      setLoadingChart(false);
      setLoadingAlarm(false);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedFile = event.target.value;
    setFileName(selectedFile);
    fetchFileData(selectedFile);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleEquipmentIdChange = (event) => {
    setEquipmentId(event.target.value);
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
    formData.append("userid", selectedUser);
    formData.append("new_filename", selectedFile.name);
    formData.append("equip_id", equipmentId);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUploadMessage("Token missing. Please log in again.");
        setShowPopup(true);
        return;
      }

      const response = await fetch(
        `https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/upload/`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
                <option key={index} value={file.filename}>
                  {file.filename}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isAdmin && (
          <div className="user-dropdown-container">
            <h5 className="select-user-text">Choose a User:</h5>
            <select
              value={selectedUser || ""}
              onChange={handleUserChange}
              className="user-dropdown"
            >
              <option value="" disabled>
                -- Choose a user --
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="upload-container">
          <h5 className="upload-csv-text">Upload a CSV File:</h5>
          <form onSubmit={handleFileUpload}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="choose-file-button"
            />
            <div className="equipment-id-container">
              <h5 className="equipment-id-text"></h5>
              <input
                type="text"
                value={equipmentId}
                onChange={handleEquipmentIdChange}
                className="equipment-id-input"
                placeholder="Enter Equipment ID"
              />
            </div>
            <button type="submit" className="upload-button custom-button">
              Upload
            </button>
          </form>
        </div>
      </div>

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
          {loadingChart ? (
            <p>Loading chart data...</p>
          ) : csvData.length > 0 ? (
            <LineChart fileName={fileName} data={csvData} />
          ) : (
            <p>No chart data available.</p>
          )}
        </div>
        <div className="alarm-section">
          {loadingAlarm ? (
            <p>Loading alarm data...</p>
          ) : csvData.length > 0 ? (
            <Alarm fileName={fileName} alarmData={csvData} />
          ) : (
            <p>No alarm data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page1;