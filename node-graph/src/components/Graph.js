// Graph.js

import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';
import axios from 'axios';
import './Graph.css';

const Graph = ({ darkMode }) => {
  const container = useRef(null);
  const graphNetwork = useRef(null);

  useEffect(() => {
    const fetchAndRenderGraph = async () => {
      try {
        const response = await axios.get('http://localhost:5000/nodes');
        const nodes = response.data.map(node => ({ id: node.node, label: node.node }));
        const edges = [];
        response.data.forEach(node => {
          node.edges.forEach(edge => {
            edges.push({ from: node.node, to: edge.target, label: edge.weight.toString() });
          });
        });
        const data = { nodes, edges };
        const options = {
          nodes: { color: darkMode ? '#ffffff' : '#000000' },
          edges: { color: darkMode ? '#ffffff' : '#000000' },
          physics: { enabled: true }
        };
        graphNetwork.current = new Network(container.current, data, options);
      } catch (error) {
        console.error('There was an error fetching the nodes!', error);
      }
    };
    fetchAndRenderGraph();
    return () => {
      if (graphNetwork.current) {
        graphNetwork.current.destroy();
        graphNetwork.current = null;
      }
    };
  }, [darkMode]);

  return (
    <div className="graph">
      <h2>Graph Visualization</h2>
      <div ref={container} style={{ height: '500px' }}></div>
    </div>
  );
};

export default Graph;
