import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditNode.css';

const EditNode = () => {
  const [nodeName, setNodeName] = useState('');
  const [edges, setEdges] = useState([{ targetNodeId: '', weight: 0 }]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/nodes/${id}`)
      .then(response => {
        const node = response.data;
        setNodeName(node.node);
        setEdges(node.edges.map(edge => ({
          targetNodeId: edge.target._id,
          weight: edge.weight
        })));
      })
      .catch(error => {
        console.error('There was an error fetching the node!', error);
      });
  }, [id]);

  const handleAddEdge = () => {
    setEdges([...edges, { targetNodeId: '', weight: 0 }]);
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
    const node = { nodeId: id, nodeName, edges };
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
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            required
          />
        </label>
        <h3>Edges</h3>
        {edges.map((edge, index) => (
          <div key={index} className="edge-input">
            <label>
              Target Node ID:
              <input
                type="text"
                value={edge.targetNodeId}
                onChange={(e) => handleEdgeChange(index, 'targetNodeId', e.target.value)}
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
        <button type="submit">Edit Node</button>
      </form>
    </div>
  );
};

export default EditNode;
