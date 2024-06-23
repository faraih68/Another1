import React from 'react';
import './HelpModal.css';

const HelpModal = ({ toggleHelp }) => {
  return (
    <div className="help-modal">
      <div className="help-content">
        <span className="close-button" onClick={toggleHelp}>&times;</span>
        <h2>How to Use the App</h2>
        <p>Welcome to the Network Topology Optimization Tool. Here's a quick guide to get you started:</p>
        <h3>Home</h3>
        <p>View the list of all nodes in the network.</p>
        <h3>Add Node</h3>
        <p>Add a new node to the network. Provide the node name and its connections.</p>
        <h3>Edit Node</h3>
        <p>Edit an existing node. Click on the node you want to edit and update its information.</p>
        <h3>Find Shortest Path</h3>
        <p>Calculate the shortest path between two nodes in the network.</p>
        <h3>View Graph</h3>
        <p>Visualize the entire network graph.</p>
        <h3>Network Diameter</h3>
        <p>View the calculated diameter of the network to understand its efficiency.</p>
        <h3>Centrality Measures</h3>
        <p>Calculate and view various centrality measures to identify important nodes in the network.</p>
      </div>
    </div>
  );
};

export default HelpModal;
