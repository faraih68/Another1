import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <a href="#home">
        <FontAwesomeIcon icon="fa-house" /> 
        <span>Home</span> 
      </a>
      <a href="#shortestPath">
        <FontAwesomeIcon icon="fa-route" /> 
        <span>Shortest Path</span>
      </a>
      <a href="#viewGraph">
        <FontAwesomeIcon icon="fa-network-wired" /> 
        <span>View Graph</span>
      </a>
      <a href="#addNode">
        <FontAwesomeIcon icon="fa-plus" /> 
        <span>Add Node</span>
      </a>
      <a href="#editNode">
        <FontAwesomeIcon icon="fa-pen-to-square" /> 
        <span>Edit Node</span>
      </a>
    </div>
  );
};

export default Sidebar;