import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaHome, FaPlus, FaRoute, FaProjectDiagram } from 'react-icons/fa';
import NodeList from './components/NodeList';
import AddNode from './components/AddNode';
import EditNode from './components/EditNode';
import ShortestPath from './components/ShortestPath';
import Graph from './components/Graph';
import './App.css';

function App() {
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
            <Route path="/add" element={<AddNode />} />
            <Route path="/edit/:id" element={<EditNode />} />
            <Route path="/shortest-path" element={<ShortestPath />} />
            <Route path="/graph" element={<Graph />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
