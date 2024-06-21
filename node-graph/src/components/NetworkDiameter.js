import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NetworkDiameter = () => {
  const [diameter, setDiameter] = useState(null);
  const [error, setError] = useState('');
  const [unreachableNodes, setUnreachableNodes] = useState([]);

  useEffect(() => {
    axios.post('http://localhost:5000/nodes/network-diameter')
      .then(response => {
        setDiameter(response.data.diameter);
        setError('');
        setUnreachableNodes([]);
      })
      .catch(error => {
        console.error('Error fetching network diameter:', error);
        if (error.response && error.response.data && error.response.data.unreachableNodes) {
          setError('The graph is disconnected. Some nodes are not reachable from others.');
          setUnreachableNodes(error.response.data.unreachableNodes);
        } else {
          setError('Error fetching network diameter. Please try again later.');
        }
      });
  }, []);

  return (
    <div>
      <h2>Network Diameter</h2>
      {error && <p>{error}</p>}
      {unreachableNodes.length > 0 && (
        <div>
          <h3>Unreachable Nodes</h3>
          <ul>
            {unreachableNodes.map((pair, index) => (
              <li key={index}>From {pair.from} to {pair.to}</li>
            ))}
          </ul>
        </div>
      )}
      {diameter !== null && diameter !== Infinity ? (
        <p>The network diameter is: {diameter}</p>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default NetworkDiameter;
