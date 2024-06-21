import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';
import './ShortestPath.css';

const ShortestPath = () => {
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [path, setPath] = useState(null);
  const container = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nodes = { startNode, endNode };
    axios.post('http://localhost:5000/nodes/shortest-path', nodes)
      .then(response => {
        setPath(response.data.path);
      })
      .catch(error => {
        console.error('There was an error finding the shortest path!', error);
      });
  };

  useEffect(() => {
    if (path) {
      axios.get('http://localhost:5000/nodes')
        .then(response => {
          const nodes = response.data.map(node => ({
            id: node.node,  // Use node names as IDs to ensure consistency
            label: node.node
          }));

          const edges = [];
          response.data.forEach(node => {
            node.edges.forEach(edge => {
              edges.push({
                from: node.node,
                to: edge.target,
                label: edge.weight.toString()
              });
            });
          });

          const highlightedEdges = [];
          for (let i = 0; i < path.length - 1; i++) {
            const fromNode = path[i];
            const toNode = path[i + 1];
            highlightedEdges.push({
              from: fromNode,
              to: toNode,
              color: { color: 'red' }
            });
          }

          const data = { nodes, edges: [...edges, ...highlightedEdges] };

          const options = {
            layout: {
              improvedLayout: true,
              hierarchical: {
                enabled: false,
                direction: 'UD', // Up-Down direction
                sortMethod: 'directed'
              }
            },
            physics: {
              enabled: false
            }
          };

          const network = new Network(container.current, data, options);

          network.once('stabilized', () => {
            network.setOptions({ physics: false }); // Disable physics after stabilization
          });
        })
        .catch(error => {
          console.error('There was an error fetching the nodes!', error);
        });
    }
  }, [path]);

  return (
    <div className="shortest-path">
      <h2>Find Shortest Path</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Start Node:
          <input
            type="text"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            required
          />
        </label>
        <label>
          End Node:
          <input
            type="text"
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
            required
          />
        </label>
        <button type="submit">Find Path</button>
      </form>
      {path && (
        <div>
          <h3>Shortest Path</h3>
          <p>{path.join(' -> ')}</p>
          <div ref={container} style={{ height: '500px' }}></div>
        </div>
      )}
    </div>
  );
};

export default ShortestPath;
