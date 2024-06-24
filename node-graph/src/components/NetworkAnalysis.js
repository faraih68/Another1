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

          {/* Interpretations and Recommendations */}
          <h3>Interpretations and Recommendations</h3>
          <p>Degree Centrality:  A higher degree centrality indicates a node has more connections. This can suggest a node is important for data flow. Consider optimizing these nodes for performance or security.</p>
          <p>Closeness Centrality: A higher closeness centrality means a node is closer to other nodes in the network. This can imply efficiency in data transmission. Focus on maintaining the connectivity and low latency of these nodes.</p>
          <p>Betweenness Centrality: A higher betweenness centrality indicates that a node lies on many shortest paths between other nodes. These nodes are critical for network communication.  Ensure these nodes are reliable and secure to avoid disrupting network traffic.</p>
        </div>
      )}
    </div>
  );
};

export default NetworkAnalysis;