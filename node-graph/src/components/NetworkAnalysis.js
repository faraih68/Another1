import React, { useState } from 'react';
import axios from 'axios';
import './NetworkAnalysis.css';

const NetworkAnalysis = () => {
  const [diameter, setDiameter] = useState(null);
  const [centrality, setCentrality] = useState(null);

  const fetchNetworkDiameter = () => {
    axios.post('http://localhost:5000/nodes/network-diameter')
      .then(response => {
        setDiameter(response.data.diameter);
      })
      .catch(error => {
        console.error('There was an error fetching the network diameter!', error);
      });
  };

  const fetchCentralityMeasures = () => {
    axios.post('http://localhost:5000/nodes/centrality')
      .then(response => {
        setCentrality(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the centrality measures!', error);
      });
  };

  return (
    <div className="network-analysis">
      <h2>Network Analysis</h2>
      <button onClick={fetchNetworkDiameter}>Compute Network Diameter</button>
      {diameter && <p>Network Diameter: {diameter}</p>}
      
      <button onClick={fetchCentralityMeasures}>Compute Centrality Measures</button>
      {centrality && (
        <div>
          <p>Degree Centrality: {JSON.stringify(centrality.degreeCentrality)}</p>
          <p>Closeness Centrality: {JSON.stringify(centrality.closenessCentrality)}</p>
          <p>Betweenness Centrality: {JSON.stringify(centrality.betweennessCentrality)}</p>
        </div>
      )}
    </div>
  );
};

export default NetworkAnalysis;
