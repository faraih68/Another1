import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';
import axios from 'axios';
import './Graph.css';

const Graph = () => {
  const container = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/nodes')
      .then(response => {
        const nodes = response.data.map(node => ({
          id: node._id,
          label: node.node
        }));

        const edges = [];
        response.data.forEach(node => {
          node.edges.forEach(edge => {
            edges.push({
              from: node._id,
              to: edge.target,
              label: edge.weight.toString()
            });
          });
        });

        const data = { nodes, edges };
        const options = {};

        new Network(container.current, data, options);
      })
      .catch(error => {
        console.error('There was an error fetching the nodes!', error);
      });
  }, []);

  return (
    <div className="graph">
      <h2>Graph Visualization</h2>
      <div ref={container} style={{ height: '500px' }}></div>
    </div>
  );
};

export default Graph;
