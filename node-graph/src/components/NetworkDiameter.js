import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NetworkDiameter = () => { 
  const [diameter, setDiameter] = useState(null); //  Start with 'null'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetworkDiameter = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post('http://localhost:5000/nodes/network-diameter'); 
        setDiameter(response.data.diameter); // Set the diameter
      } catch (err) {
        setError('Error fetching network diameter');
        console.error('Error fetching network diameter:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkDiameter();
  }, []); 

  return (
    <div>
      <h3>Network Diameter</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : diameter !== undefined ? ( 
        diameter === Infinity ? ( 
          <p>Network Diameter: Infinity (No path exists between all nodes)</p>
        ) : (
          <p>{`Network Diameter: ${diameter}`}</p> 
        )
      ) : (
        <p>No data available to calculate diameter.</p>
      )}
    </div>
  );
};

export default NetworkDiameter;