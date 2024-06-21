import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';
import './MST.css';

const MST = () => {
  const [mstEdges, setMstEdges] = useState([]);
  const container = useRef(null);

  useEffect(() => {
    axios.post('http://localhost:5000/nodes/mst')
      .then(response => {
        setMstEdges(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the MST!', error);
      });
  }, []);

  useEffect(() => {
    if (mstEdges.length > 0) {
      const nodesSet = new Set();
      mstEdges.forEach(edge => {
        nodesSet.add(edge.v);
        nodesSet.add(edge.w);
      });
      const nodes = Array.from(nodesSet).map(node => ({ id: node, label: node }));
      const edges = mstEdges.map(edge => ({
        from: edge.v,
        to: edge.w,
        label: `Weight: ${edge.weight}`, // Displaying only weight for now
        color: { color: 'green' }
      }));

      const data = { nodes, edges };

      const options = {
        layout: {
          improvedLayout: true,
          hierarchical: {
            enabled: false,
            direction: 'UD',
            sortMethod: 'directed'
          }
        },
        physics: {
          enabled: false
        }
      };

      const network = new Network(container.current, data, options);

      network.once('stabilized', () => {
        network.setOptions({ physics: false });
      });
    }
  }, [mstEdges]);

  return <div ref={container} style={{ height: '500px' }}></div>;
};

export default MST;
