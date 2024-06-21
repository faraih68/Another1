import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaHome, FaPlus, FaRoute, FaProjectDiagram, FaNetworkWired, FaChartLine } from 'react-icons/fa';
import NodeList from './components/NodeList';
import AddNode from './components/AddNode';
import EditNode from './components/EditNode';
import ShortestPath from './components/ShortestPath';
import Graph from './components/Graph';
import MST from './components/MST';
import NetworkAnalysis from './components/NetworkAnalysis';
import NetworkDiameter from './components/NetworkDiameter';  // Import the new component
import SideMenu from './components/SideMenu';

import axios from 'axios';
import './App.css';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/nodes')
      .then(response => {
        const nodes = response.data;
        const edges = [];
        nodes.forEach(node => {
          node.edges.forEach(edge => {
            edges.push({ source: node.node, target: edge.target, weight: edge.weight });
          });
        });
        setGraphData({ nodes, edges });
      })
      .catch(error => {
        console.error('Error fetching graph data:', error);
      });
  }, []);

  const handleNewNode = (newNodeData) => {
    setGraphData(prevGraphData => ({
      nodes: [...prevGraphData.nodes, newNodeData],
      edges: [...prevGraphData.edges, ...newNodeData.edges.map(edge => ({ source: newNodeData.nodeName, target: edge.targetNodeName, weight: edge.weight }))]
    }));
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>NETWORK TOPOLOGY OPTIMIZATION TOOL</h1>
          <nav>
            <a href="/"><FaHome className="icon" /> Home</a>
            <a href="/add"><FaPlus className="icon" /> Add Node</a>
            <a href="/shortest-path"><FaRoute className="icon" /> Find Shortest Path</a>
            <a href="/graph"><FaProjectDiagram className="icon" /> View Graph</a>
            <a href="/mst"><FaNetworkWired className="icon" /> View MST</a>
            <a href="/network-analysis"><FaChartLine className="icon" /> Network Analysis</a>
            <a href="/network-diameter"><FaChartLine className="icon" /> Network Diameter</a>  {/* Add the new route */}
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<NodeList />} />
            <Route path="/add" element={<AddNode onNewNode={handleNewNode} />} />
            <Route path="/edit/:nodeName" element={<EditNode />} />
            <Route path="/shortest-path" element={<ShortestPath />} />
            <Route path="/graph" element={<Graph graphData={graphData} />} />
            <Route path="/mst" element={<MST />} />
            <Route path="/network-analysis" element={<NetworkAnalysis />} />
            <Route path="/network-diameter" element={<NetworkDiameter />} />  {/* Add the new route */}
          </Routes>
        </main>
        <SideMenu />
      </div>
    </Router>
  );
}

export default App;
