// AddNode.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddNode.css';

const AddNode = () => {
  const [nodeName, setNodeName] = useState('');
  const [edges, setEdges] = useState([{ targetNodeName: '', weight: 0 }]);
  const navigate = useNavigate();

  const handleAddEdge = () => {
    setEdges([...edges, { targetNodeName: '', weight: 0 }]);
  };

  const handleRemoveEdge = (index) => {
    const newEdges = edges.filter((_, i) => i !== index);
    setEdges(newEdges);
  };

  const handleEdgeChange = (index, field, value) => {
    const newEdges = edges.map((edge, i) => 
      i === index ? { ...edge, [field]: value } : edge
    );
    setEdges(newEdges);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const node = { nodeName, edges };
    axios.post('http://localhost:5000/nodes/add', node)
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error('There was an error adding the node!', error);
      });
  };

  return (
    <div className="add-node">
      <h2>Add Node</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Node Name:
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            required
          />
        </label>
        <h3>Edges</h3>
        {edges.map((edge, index) => (
          <div key={index} className="edge-input">
            <label>
              Target Node Name:
              <input
                type="text"
                value={edge.targetNodeName}
                onChange={(e) => handleEdgeChange(index, 'targetNodeName', e.target.value)}
                required
              />
            </label>
            <label>
              Weight:
              <input
                type="number"
                value={edge.weight}
                onChange={(e) => handleEdgeChange(index, 'weight', e.target.value)}
                required
              />
            </label>
            <button type="button" onClick={() => handleRemoveEdge(index)}>Remove Edge</button>
          </div>
        ))}
        <button type="button" onClick={handleAddEdge}>Add Edge</button>
        <button type="submit">Add Node</button>
      </form>
    </div>
  );
};

export default AddNode;
