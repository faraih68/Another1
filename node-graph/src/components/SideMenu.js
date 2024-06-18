import React, { useState } from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope, FaBars, FaQuestionCircle } from 'react-icons/fa';
import './SideMenu.css';

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  return (
    <div>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>
        <div className="menu-content">
          <h2>Help & Contacts</h2>
          <ul>
            <li>
              <FaPhone /> <a href="tel:+263771420909">+263771420909</a>
            </li>
            <li>
              <FaWhatsapp /> <a href="https://wa.me/263771420909" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </li>
            <li>
              <FaEnvelope /> <a href="mailto:faraih68@gmail.com">faraih68@gmail.com</a>
            </li>
            <li>
            <FaQuestionCircle /> <button onClick={toggleHelp}>Help</button> 
            </li>
          </ul>
        </div>
      </div>

      {isHelpOpen && (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default SideMenu;
