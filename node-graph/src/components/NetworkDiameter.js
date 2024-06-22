// NetworkDiameter.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NetworkDiameter = ({ nodes, edges }) => {
  const [diameter, setDiameter] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:5000/nodes/network-diameter', { nodes, edges })
      .then(response => {
        setDiameter(response.data.diameter);
      })
      .catch(error => {
        console.error('Error fetching network diameter:', error);
      });
  }, [nodes, edges]);

  return (
    <div>
      <h3>Network Diameter</h3>
      {diameter !== null ? <p>{`Network Diameter: ${diameter}`}</p> : <p>Loading...</p>}
    </div>
  );
};

export default NetworkDiameter;
