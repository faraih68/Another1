import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Network } from 'vis-network/standalone';
import { Graph} from 'graphlib'; // Import graphlib
import './ShortestPath.css';

const ShortestPath = () => {
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [path, setPath] = useState(null);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]); 
  const container = useRef(null);
  const [graph, setGraph] = useState(null); // State to hold the graph

  const handleSubmit = (e) => {
    e.preventDefault();
    const nodes = { startNode, endNode };
    axios.post('http://localhost:5000/nodes/shortest-path', nodes)
      .then(response => {
        setPath(response.data.path);
        setError(null); 
        setSuggestions([]); 
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          setError(error.response.data.error); 
          setSuggestions(generateSuggestions(startNode, endNode, graph)); // Pass the graph
        } else {
          setError('Error finding the shortest path!');
          console.error('Error fetching shortest path:', error);
        }
      });
  };

  // Function to generate suggestions 
  const generateSuggestions = (startNode, endNode, graph) => { 
    if (!graph) return []; // Return empty array if graph is not yet available

    const connectedToStart = graph.neighbors(startNode);
    const connectedToEnd = graph.neighbors(endNode);
    const potentialConnections = connectedToStart.filter(node => connectedToEnd.includes(node));
    return potentialConnections.map(node => `You could try connecting ${startNode} to ${node} or ${node} to ${endNode}`);
  };

  useEffect(() => {
    if (path) {
      axios.get('http://localhost:5000/nodes')
        .then(response => {
          const nodes = response.data.map(node => ({
            id: node.node,  // Use node names as IDs to ensure consistency
            label: node.node
          }));

          const edges = [];
          response.data.forEach(node => {
            node.edges.forEach(edge => {
              edges.push({
                from: node.node,
                to: edge.target,
                label: edge.weight.toString()
              });
            });
          });

          const highlightedEdges = [];
          for (let i = 0; i < path.length - 1; i++) {
            const fromNode = path[i];
            const toNode = path[i + 1];
            highlightedEdges.push({
              from: fromNode,
              to: toNode,
              color: { color: 'red' }
            });
          }

          const data = { nodes, edges: [...edges, ...highlightedEdges] };

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

          // Create the network only if there is a path and no error
          if (container.current && path && !error) { 
            const network = new Network(container.current, data, options);

            network.once('stabilized', () => {
              network.setOptions({ physics: false }); // Disable physics after stabilization
            });
          }

        })
        .catch(error => {
          console.error('There was an error fetching the nodes!', error);
        });
      }
    }, [path, error]); 

    useEffect(() => {
      // Fetch the graph data from your server
      axios.get('http://localhost:5000/nodes')
        .then(response => {
          const graphData = new Graph(); // Create a new graph instance
          response.data.forEach(node => {
            graphData.setNode(node.node);
            node.edges.forEach(edge => {
              graphData.setEdge(node.node, edge.target, { weight: edge.weight });
            });
          });
          setGraph(graphData); // Update the graph state
        })
        .catch(error => {
          console.error('Error fetching graph data:', error);
        });
    }, []); // Fetch the graph data only once on component mount
  
    return (
      <div className="shortest-path">
        <h2>Find Shortest Path</h2>
        {error && (
          <p className="error-message">
            {error}
            {error.includes('No path') && (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            )}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Start Node:
            <input
              type="text"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              required
            />
          </label>
          <label>
            End Node:
            <input
              type="text"
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
              required
            />
          </label>
          <button type="submit">Find Path</button>
        </form>
        {path && (
          <div>
            <h3>Shortest Path</h3>
            <p>{path.join(' -> ')}</p>
            <div ref={container} style={{ height: '500px' }}></div>
          </div>
        )}
      </div>
    );
  };
  
  export default ShortestPath;