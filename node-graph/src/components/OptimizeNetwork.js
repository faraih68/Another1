import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';
import { DataSet } from 'vis-data';
import './OptimizeNetwork.css';

const OptimizeNetwork = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [layoutType, setLayoutType] = useState('hierarchical');
  const [optimizationGoal, setOptimizationGoal] = useState('cost');
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  const layoutOptions = useMemo(() => ({
    hierarchical: {
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'UD',
          sortMethod: 'directed',
          levelSeparation: 150,
          nodeSpacing: 100
        }
      },
      physics: {
        enabled: false
      }
    },
    physics: {
      layout: {},
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04
        },
        stabilization: {
          enabled: true,
          iterations: 1000
        }
      }
    }
  }), []);

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = () => {
    axios.get('http://localhost:5000/nodes')
      .then(response => {
        const nodes = response.data.map((node, index) => ({
          id: node.node,
          label: node.node,
          level: Math.floor(index / 5)
        }));
        const edges = [];
        response.data.forEach(node => {
          node.edges.forEach(edge => {
            edges.push({ from: node.node, to: edge.target, label: edge.weight.toString() });
          });
        });
        setGraphData({ nodes, edges });
      })
      .catch(error => {
        console.error('Error fetching graph data:', error);
      });
  };

  const handleGoalChange = (event) => {
    setOptimizationGoal(event.target.value);
  };

  const handleLayoutTypeChange = (event) => {
    setLayoutType(event.target.value);
  };

  useEffect(() => {
    if (containerRef.current && graphData.nodes.length > 0) {
      const nodes = new DataSet(graphData.nodes);
      const edges = new DataSet(graphData.edges);
      const data = { nodes, edges };
      const options = layoutOptions[layoutType];

      if (networkRef.current) {
        networkRef.current.destroy();
      }

      networkRef.current = new Network(containerRef.current, data, options);

      networkRef.current.on("click", function (params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = graphData.nodes.find(n => n.id === nodeId);
          console.log("Clicked node:", node);
          networkRef.current.setSelection({ nodes: [nodeId] });
        } else if (params.edges.length > 0) {
          const edgeId = params.edges[0];
          const edge = graphData.edges.find(e => e.id === edgeId);
          console.log("Clicked edge:", edge);
          networkRef.current.setSelection({ edges: [edgeId] });
        }
      });

      networkRef.current.once('stabilized', () => {
        networkRef.current.setOptions({ physics: false });
      });
    }
  }, [graphData, layoutType, layoutOptions, optimizationGoal]);

  return (
    <div className="optimize-network">
      <h2>Network Optimization</h2>
      <div>
        <h3>Original Network</h3>
        <div ref={containerRef} style={{ height: '500px', width: '800px' }} />
        <button onClick={fetchGraphData}>Refresh</button>
      </div>
      <div>
        <p>Layout Options:</p>
        <label htmlFor="layoutType">Layout Type:</label>
        <select value={layoutType} onChange={handleLayoutTypeChange}>
          <option value="hierarchical">Hierarchical</option>
          <option value="physics">Force-Directed</option>
        </select>
      </div>
      <div>
        <p>Optimization Goal:</p>
        <select value={optimizationGoal} onChange={handleGoalChange}>
          <option value="cost">Cost</option>
          <option value="latency">Latency</option>
          {/* Add options for other goals (reliability, security, etc.) */}
        </select>
      </div>
    </div>
  );
};

export default OptimizeNetwork;
