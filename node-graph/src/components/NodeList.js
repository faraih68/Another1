// Frontend: NodeList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './NodeList.css';

const NodeList = () => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    fetchNodes(); // Fetch nodes initially
  }, []);

  const fetchNodes = () => {
    axios.get('http://localhost:5000/nodes')
      .then(response => {
        setNodes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the nodes!', error);
      });
  };

  const deleteNode = (nodeName) => {
    axios.delete(`http://localhost:5000/nodes/${nodeName}`)
      .then(() => {
        setNodes(nodes.filter(node => node.node !== nodeName));
      })
      .catch(error => {
        console.error('There was an error deleting the node!', error);
      });
  };

  const deleteAllNodes = () => {
    // Confirmation Dialog
    if (window.confirm("Are you absolutely sure you want to delete ALL nodes? This action cannot be undone.")) {
      axios.delete('http://localhost:5000/nodes/delete-all')
        .then(() => {
          setNodes([]); // Clear nodes in the state
        })
        .catch(error => {
          console.error('There was an error deleting all nodes!', error);
        });
    }
  };

  return (
    <div className="node-list">
      <h2>Nodes</h2>
      <button onClick={deleteAllNodes}>Delete All Nodes</button> 
      <ul>
        {nodes.map(node => (
          <li key={node._id}>
            {node.node}
            <Link to={`/edit/${node.node}`} className="edit-btn">
              <FaEdit />
            </Link>
            <button onClick={() => deleteNode(node.node)} className="delete-btn">
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NodeList;