import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaHome, FaPlus, FaRoute, FaProjectDiagram } from 'react-icons/fa';
import NodeList from './components/NodeList';
import AddNode from './components/AddNode';
import EditNode from './components/EditNode';
import ShortestPath from './components/ShortestPath';
import Graph from './components/Graph';
import axios from 'axios'; // Import axios here
import './App.css';

// ... rest of your App.js code ...

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    // Fetch initial graph data
    axios.get('http://localhost:5000/nodes')
      .then(response => {
        setGraphData(response.data);
      })
      .catch(error => {
        console.error('Error fetching graph data:', error);
      });
  }, []); 

  const handleNewNode = (newNodeData) => {
    // Update the graphData state
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
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<NodeList />} />
            <Route path="/add" element={<AddNode onNewNode={handleNewNode} />} /> {/* Pass handleNewNode prop */}
            <Route path="/edit/:nodeName" element={<EditNode />} />

            <Route path="/shortest-path" element={<ShortestPath />} />
            <Route path="/graph" element={<Graph graphData={graphData} />} /> {/* Pass graphData prop */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;