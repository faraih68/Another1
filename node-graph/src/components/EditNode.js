import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditNode.css';

const EditNode = () => {
  const [nodeName, setNodeName] = useState('');
  const [newNodeName, setNewNodeName] = useState('');
  const [edges, setEdges] = useState([{ targetNodeName: '', weight: 0 }]);
  const navigate = useNavigate();
  const { nodeName: nodeNameParam } = useParams(); // Destructure the correct param

  useEffect(() => {
    axios.get(`http://localhost:5000/nodes/${nodeNameParam}`)
      .then(response => {
        const node = response.data;
        setNodeName(node.node);
        setNewNodeName(node.node);
        setEdges(node.edges.map(edge => ({
          targetNodeName: edge.target,
          weight: edge.weight
        })));
      })
      .catch(error => {
        console.error('There was an error fetching the node!', error);
      });
  }, [nodeNameParam]);

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
    const node = { nodeName, newNodeName, edges };
    axios.post('http://localhost:5000/nodes/edit', node)
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error('There was an error editing the node!', error);
      });
  };

  return (
    <div className="edit-node">
      <h2>Edit Node</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Node Name:
          <input
            type="text"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditNode;
