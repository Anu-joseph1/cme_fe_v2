import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Page3.css";

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/all_equipments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("API Response:", data); // 🔍 Debugging log
        
        if (data && data.equipments) {
          setEquipments(data.equipments);
        } else {
          setError("No equipment data available.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      }
    };

    fetchEquipments();
  }, []);

  const handleEquipmentClick = (equip_id) => {
    navigate(`/page1?equip_id=${equip_id}`); // Navigate to Page1 with equip_id as a query parameter
  };

  return (
    <div className="equipment-list-container">
      <h2>Equipment List</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <ul>
          {equipments.length > 0 ? (
            equipments.map((equip_id) => (
              <li key={equip_id} onClick={() => handleEquipmentClick(equip_id)}>
                {equip_id}
              </li>
            ))
          ) : (
            <p>No equipment data available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default EquipmentList;