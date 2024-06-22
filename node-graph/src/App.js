// App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; 
import { FaHome, FaPlus, FaRoute, FaProjectDiagram, FaChartLine, FaUpload } from 'react-icons/fa';
import NodeList from './components/NodeList';
import AddNode from './components/AddNode';
import EditNode from './components/EditNode';
import ShortestPath from './components/ShortestPath';
import Graph from './components/Graph';
import NetworkAnalysis from './components/NetworkAnalysis';
import NetworkDiameter from './components/NetworkDiameter';
import SideMenu from './components/SideMenu';
import CSVUpload from './components/CSVUpload';
import OptimizeNetwork from './components/OptimizeNetwork';

import axios from 'axios';
import './App.css';

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = () => {
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
  };

  const handleNewNode = (newNodeData) => {
    setGraphData(prevGraphData => ({
      nodes: [...prevGraphData.nodes, newNodeData],
      edges: [...prevGraphData.edges, ...newNodeData.edges.map(edge => ({ source: newNodeData.nodeName, target: edge.targetNodeName, weight: edge.weight }))]
    }));
  };

  const handleCSVUpload = (csvData) => {
    axios.post('http://localhost:5000/nodes/csv-upload', { csvData })
      .then(() => {
        fetchGraphData();
      })
      .catch(error => {
        console.error('Error uploading CSV data:', error);
      });
  };

  return (
    <Router> 
      <div className="App">
        <header>
          <h1>NETWORK TOPOLOGY OPTIMIZATION TOOL</h1>
          <nav>
            <Link to="/"><FaHome className="icon" /> Home</Link>
            <Link to="/add"><FaPlus className="icon" /> Add Node</Link>
            <Link to="/csv-upload"><FaUpload className="icon" /> Upload CSV</Link>
            <Link to="/shortest-path"><FaRoute className="icon" /> Find Shortest Path</Link>
            <Link to="/graph"><FaProjectDiagram className="icon" /> View Graph</Link>
            <Link to="/network-analysis"><FaChartLine className="icon" /> Network Analysis</Link>
            <Link to="/network-diameter"><FaChartLine className="icon" /> Network Diameter</Link>
            {/* Optimize buttons with different goals */}
            <OptimizeButtons />
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<NodeList />} />
            <Route path="/add" element={<AddNode onNewNode={handleNewNode} />} />
            <Route path="/csv-upload" element={<CSVUpload onUpload={handleCSVUpload} />} />
            <Route path="/edit/:nodeName" element={<EditNode />} />
            <Route path="/shortest-path" element={<ShortestPath />} />
            <Route path="/graph" element={<Graph graphData={graphData} />} />
            <Route path="/network-analysis" element={<NetworkAnalysis />} />
            <Route path="/network-diameter" element={<NetworkDiameter />} />
            <Route path="/optimize" element={<OptimizeNetwork />} /> 
          </Routes>
        </main>
        <SideMenu />
      </div>
    </Router>
  );
}

function OptimizeButtons() {
  const navigate = useNavigate();

  const handleOptimize = (goal) => {
    navigate('/optimize', { state: { optimizationGoal: goal } }); 
  };

  return (
    <>
      <button onClick={() => handleOptimize('cost')}><FaChartLine className="icon" /> Optimize Network (Cost)</button>
      <button onClick={() => handleOptimize('latency')}><FaChartLine className="icon" /> Optimize Network (Latency)</button>
      {/* Add more buttons for other optimization goals */}
    </>
  );
}

export default App;
