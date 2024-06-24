import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';
// eslint-disable-next-line
import axios from 'axios';
import './Graph.css';

const Graph = ({ graphData }) => {
  const container = useRef(null);

  useEffect(() => {
    if (graphData.nodes.length > 0 && graphData.edges.length > 0) {
      const nodes = graphData.nodes.map(node => ({
        id: node.node,  // Use node names as IDs to ensure consistency
        label: node.node
      }));

      const edges = graphData.edges.map(edge => ({
        from: edge.source,
        to: edge.target,
        label: edge.weight.toString()
      }));

      const data = { nodes, edges };
      
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
    }
  }, [graphData]);

  return <div ref={container} style={{ height: '500px' }}></div>;
};

export default Graph;