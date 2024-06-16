import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaHome, FaPlus, FaRoute, FaProjectDiagram } from 'react-icons/fa';
import NodeList from './components/NodeList';
import AddNode from './components/AddNode';
import EditNode from './components/EditNode';
import ShortestPath from './components/ShortestPath';
import Graph from './components/Graph';
import SideMenu from './components/SideMenu';
import TopologyComparison from './components/TopologyComparison';
import TopologyPrediction from './components/TopologyPrediction';
import NetworkSimulation from './components/NetworkSimulation';
import CollaborativeEditor from './components/CollaborativeEditor';
import CustomAlgorithm from './components/CustomAlgorithm';
import RealTimeOptimization from './components/RealTimeOptimization';
import ReportGenerator from './components/ReportGenerator';
import './App.css';

import axios from 'axios';

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
                        <Link to="/"><FaHome className="icon" /> Home</Link>
                        <Link to="/add"><FaPlus className="icon" /> Add Node</Link>
                        <Link to="/shortest-path"><FaRoute className="icon" /> Find Shortest Path</Link>
                        <Link to="/graph"><FaProjectDiagram className="icon" /> View Graph</Link>
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<NodeList />} />
                        <Route path="/add" element={<AddNode onNewNode={handleNewNode} />} />
                        <Route path="/edit/:nodeName" element={<EditNode />} />
                        <Route path="/shortest-path" element={<ShortestPath />} />
                        <Route path="/graph" element={<Graph graphData={graphData} />} />
                        <Route path="/compare" element={<TopologyComparison />} />
                        <Route path="/predict" element={<TopologyPrediction />} />
                        <Route path="/simulate" element={<NetworkSimulation />} />
                        <Route path="/collaborate" element={<CollaborativeEditor />} />
                        <Route path="/custom-algorithm" element={<CustomAlgorithm />} />
                        <Route path="/real-time-optimization" element={<RealTimeOptimization />} />
                        <Route path="/generate-report" element={<ReportGenerator />} />
                    </Routes>
                </main>
                <SideMenu />
            </div>
        </Router>
    );
}

export default App;
