import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Page3.css";
import { Hub } from "@aws-amplify/core"; // Import Hub for auth event listening

const EquipmentList = ({ authChanged  }) => {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setEquipments([]); // Clear equipment list if no token
          return;
        }

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
        console.log("API Response:", data);
        
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

        // Listen for auth events to clear/refetch data
      const authListener = ({ payload }) => {
        if (payload.event === "signOut") {
          setEquipments([]); // Clear equipment list on logout
        } else if (payload.event === "signIn") {
          fetchEquipments(); // Refetch equipment list on login
        }
      };

      const unsubscribe = Hub.listen("auth", authListener);
      return () => {
        unsubscribe(); // Cleanup listener on unmount
      };
  }, [authChanged]); // Depend on authChanged to refetch on login/logout


  // useEffect(() => {
  //   if (resetEquipmentList) {
  //     setEquipments([]); // Reset the equipment list when the user logs out
  //   }
  // }, [resetEquipmentList]);

  const handleEquipmentClick = (equip_id) => {
    navigate(`/page1?equip_id=${equip_id}`);
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