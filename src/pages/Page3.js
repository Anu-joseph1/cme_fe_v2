import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "@aws-amplify/auth";
import "./Page3.css";

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEquipments = useCallback(async () => {
    setEquipments([]);
    setError(null);
    setLoading(true);

    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        setError("No valid token found.");
        setLoading(false);
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

      if (response.status === 401 || response.status === 403) {
        setError("Invalid or expired token.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data?.equipments) {
        setEquipments(data.equipments);
        setError(null);
      } else {
        setEquipments([]);
        setError("No equipment data available.");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch equipment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  const handleClick = (equip_id) => {
    navigate(`/page1?equip_id=${equip_id}`);
  };

  return (
    <div className="equipment-list-container">
      <h2>Equipment List</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading equipment data...</p>
      ) : (
        <ul>
          {equipments.map((id) => (
            <li key={id} onClick={() => handleClick(id)}>
              {id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EquipmentList;
