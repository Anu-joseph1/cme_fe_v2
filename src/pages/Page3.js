import React, { useState, useEffect } from 'react';
import AlertComponent from '../components/AlertComponent';

const Page3 = () => {
  const [alerts, setAlerts] = useState([]);
  const [equipmentId, setEquipmentId] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);

  // Fetch equipment list from FastAPI endpoint
  useEffect(() => {
    const fetchEquipmentList = async () => {
      try {
        const response = await fetch('https://your-api-url.com/all_equipments', {
          headers: {
            Authorization: `Bearer YOUR_AUTH_TOKEN` // Replace with actual token
          }
        });
        const data = await response.json();
        setEquipmentList(data.equipments);
      } catch (error) {
        console.error('Error fetching equipment list:', error);
      }
    };

    fetchEquipmentList();
  }, []);

  // Fetch alerts based on selected equipment ID
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!equipmentId) return;

      try {
        const response = await fetch(`https://aoeyj7jtyq6wt6ldchudwouajy0klmyq.lambda-url.ap-south-1.on.aws/all_equipments?equipment_id=${equipmentId}`);
        const data = await response.json();
        

        const formattedAlerts = data.map(item => ({
          datetime: item.timestamp,
          message: item.message,
        }));

        setAlerts(formattedAlerts);
      } catch (error) {
        console.error('Error fetching alert data:', error);
      }
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, [equipmentId]);

  return (
    <div style={{ marginTop: '20px', padding: '20px' }}>
      <div className="equipment-container">
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Select Equipment:</p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {/* Create individual equipment ID boxes */}
          {equipmentList.length > 0 ? (
            equipmentList.map((equip_id) => (
              <div
                key={equip_id}
                style={{
                  padding: '12px 20px',
                  backgroundColor: equip_id === equipmentId ? '#4CAF50' : '#f0f0f0',
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minWidth: '120px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease, transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: equip_id === equipmentId ? '0px 4px 6px rgba(0, 0, 0, 0.2)' : 'none',
                }}
                onClick={() => setEquipmentId(equip_id)}
              >
                {`Equipment ID ${equip_id}`}
              </div>
            ))
          ) : (
            <p>Loading equipment...</p>
          )}
        </div>
      </div>

      {/* Display the alerts */}
      <AlertComponent alerts={alerts} />
    </div>
  );
};

export default Page3;
