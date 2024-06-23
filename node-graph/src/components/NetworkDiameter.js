import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NetworkDiameter = ({ nodes = [], edges = [] }) => {
  const [diameter, setDiameter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetworkDiameter = async () => {
      if (nodes.length > 0 && edges.length > 0) {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.post('http://localhost:5000/nodes/network-diameter', { nodes, edges });
          setDiameter(response.data.diameter);
        } catch (err) {
          setError('Error fetching network diameter');
          console.error('Error fetching network diameter:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setDiameter(null);
        setLoading(false);
      }
    };

    fetchNetworkDiameter();
  }, [nodes, edges]);

  return (
    <div>
      <h3>Network Diameter</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : diameter !== null ? (
        <p>{`Network Diameter: ${diameter}`}</p>
      ) : (
        <p>No data available to calculate diameter.</p>
      )}
    </div>
  );
};

export default NetworkDiameter;
