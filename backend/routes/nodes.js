const express = require('express');
const { Graph, alg } = require('graphlib');
const router = express.Router();
const Node = require('../models/node.model');
const Papa = require('papaparse');

// Handler to get all nodes
router.get('/', async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching nodes: ' + error.message });
    }
});

// Handler to get a specific node by name
router.get('/:nodeName', async (req, res) => {
    try {
        const node = await Node.findOne({ node: req.params.nodeName });
        res.json(node);
    } catch (error) {
        res.status(400).json({ error: 'Error fetching node: ' + error.message });
    }
});

// Handler to add a new node
router.post('/add', async (req, res) => {
    const { nodeName, edges, reliability, latency, throughput, cost, security, qos } = req.body;
    const node = new Node({
        node: nodeName,
        edges: edges ? edges.map(edge => ({
            target: edge.targetNodeName,
            weight: edge.weight,
            reliability: edge.reliability || 1,
            latency: edge.latency || 0,
            throughput: edge.throughput || 0,
            cost: edge.cost || 0,
            security: edge.security || 1,
            qos: edge.qos || 0
        })) : [],
        reliability: reliability || 1,
        latency: latency || 0,
        throughput: throughput || 0,
        cost: cost || 0,
        security: security || 1,
        qos: qos || 0
    });

    try {
        const savedNode = await node.save();
        res.json({ message: 'Node added!', node: savedNode });
    } catch (error) {
        res.status(400).json({ error: 'Error adding node: ' + error.message });
    }
});

// Handler to edit an existing node
router.post('/edit', async (req, res) => {
    const { nodeName, newNodeName, edges, reliability, latency, throughput, cost, security, qos } = req.body;

    try {
        const node = await Node.findOne({ node: nodeName });
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }

        node.node = newNodeName || node.node;
        node.edges = edges ? edges.map(edge => ({
            target: edge.targetNodeName,
            weight: edge.weight,
            reliability: edge.reliability || 1,
            latency: edge.latency || 0,
            throughput: edge.throughput || 0,
            cost: edge.cost || 0,
            security: edge.security || 1,
            qos: edge.qos || 0
        })) : node.edges;
        node.reliability = reliability || node.reliability;
        node.latency = latency || node.latency;
        node.throughput = throughput || node.throughput;
        node.cost = cost || node.cost;
        node.security = security || node.security;
        node.qos = qos || node.qos;

        const updatedNode = await node.save();
        res.json({ message: 'Node updated!', node: updatedNode });
    } catch (error) {
        res.status(500).json({ error: 'Error editing node: ' + error.message });
    }
});

// Handler to delete a node
router.delete('/:nodeName', async (req, res) => {
    try {
        const deletedNode = await Node.findOneAndDelete({ node: req.params.nodeName });
        res.json({ message: 'Node deleted' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting node: ' + error.message });
    }
});

// Handler to find the shortest path - using Dijkstra's algorithm
router.post('/shortest-path', async (req, res) => {
    const { startNode, endNode } = req.body;
    console.log('Received shortest path request:', req.body);

    try {
        const nodes = await Node.find();

        const graph = new Graph();
        nodes.forEach(node => {
            graph.setNode(node.node);
            node.edges.forEach(edge => {
                graph.setEdge(node.node, edge.target, { weight: edge.weight });
            });
        });

        if (!graph.hasNode(startNode)) {
            return res.status(404).json({ error: `Start node ${startNode} not found in the graph` });
        }
        if (!graph.hasNode(endNode)) {
            return res.status(404).json({ error: `End node ${endNode} not found in the graph` });
        }

        const pathData = alg.dijkstra(graph, startNode, (e) => graph.edge(e).weight);

        let shortestPath = [];
        if (pathData[endNode].distance !== Infinity) {
            let currentNode = endNode;
            while (currentNode) {
                shortestPath.unshift(currentNode);
                currentNode = pathData[currentNode].predecessor;
            }

            if (shortestPath.length > 0 && shortestPath[0] === startNode) {
                res.status(200).json({ path: shortestPath });
            } else {
                res.status(404).json({ error: `No path found from ${startNode} to ${endNode}` });
            }
        } else {
            res.status(404).json({
                error: `No path found from ${startNode} to ${endNode}`,
                suggestion: `Please add an edge or intermediate nodes to connect ${startNode} and ${endNode}.`
            });
        }
    } catch (error) {
        console.error('Error finding shortest path:', error);
        res.status(500).json({ error: 'Error finding shortest path: ' + error.message });
    }
});

// Handler to compute centrality measures
router.post('/centrality', async (req, res) => {
    try {
        const nodes = await Node.find();

        const graph = new Graph();
        nodes.forEach(node => {
            graph.setNode(node.node);
            node.edges.forEach(edge => {
                graph.setEdge(node.node, edge.target, { weight: edge.weight });
            });
        });

        const degreeCentrality = {};
        const closenessCentrality = {};
        const betweennessCentrality = {};

        graph.nodes().forEach(node => {
            degreeCentrality[node] = graph.outEdges(node).length;

            const distances = alg.dijkstra(graph, node, (e) => graph.edge(e).weight);
            let totalDistance = 0;
            let reachableNodes = 0;

            Object.values(distances).forEach(({ distance }) => {
                if (distance < Infinity) {
                    totalDistance += distance;
                    reachableNodes += 1;
                }
            });

            if (reachableNodes > 1) {
                closenessCentrality[node] = (reachableNodes - 1) / totalDistance;
            } else {
                closenessCentrality[node] = 0;
            }

            betweennessCentrality[node] = 0;
        });

        graph.nodes().forEach(source => {
            const distances = alg.dijkstra(graph, source, (e) => graph.edge(e).weight);
            graph.nodes().forEach(target => {
                if (source !== target) {
                    let paths = 0;
                    let pathsThroughNode = 0;
                    graph.nodes().forEach(node => {
                        if (node !== source && node !== target && distances[target]) {
                            paths += (distances[target].predecessors || []).filter(predecessor => predecessor === node).length;
                            pathsThroughNode += (distances[target].predecessors || []).filter(predecessor => predecessor === node && distances[node].distance !== Infinity).length;
                        }
                    });
                    if (paths > 0) {
                        betweennessCentrality[target] += pathsThroughNode / paths;
                    }
                }
            });
        });

        res.json({ degreeCentrality, closenessCentrality, betweennessCentrality });
    } catch (error) {
        res.status(500).json({ error: 'Error computing centrality measures: ' + error.message });
    }
});

// Handler to upload CSV data and add nodes
router.post('/csv-upload', async (req, res) => {
    try {
        const csvData = req.body.csvData;
        const parsedNodes = parseCSV(csvData);

        const insertResult = await Node.insertMany(parsedNodes);
        res.json({ message: 'Nodes added from CSV!' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding nodes from CSV: ' + error.message });
    }
});

function parseCSV(csvData) {
    const parsed = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true
    });
    return parsed.data.map(row => {
        return {
            node: row.nodeName,
            edges: row.edges ? row.edges.split(',').map(edge => {
                const [targetNodeName, weight] = edge.split(':');
                return {
                    target: targetNodeName,
                    weight: parseFloat(weight)
                };
            }) : [],
            reliability: parseFloat(row.reliability) || 1,
            latency: parseFloat(row.latency) || 0,
            throughput: parseFloat(row.throughput) || 0,
            cost: parseFloat(row.cost) || 0,
            security: parseFloat(row.security) || 1,
            qos: parseFloat(row.qos) || 0
        };
    });
}

// Handler to optimize the network
router.post('/optimize', async (req, res) => {
    try {
        const nodes = await Node.find();
        const optimizationGoal = req.body.optimizationGoal;

        const optimizedNodes = optimizeNetwork(nodes, optimizationGoal);

        const bulkOps = optimizedNodes.map(node => ({
            updateOne: {
                filter: { node: node.node },
                update: { $set: { edges: node.edges } }
            }
        }));
        await Node.bulkWrite(bulkOps);

        res.json({ optimizedNodes });
    } catch (error) {
        res.status(500).json({ error: 'Error optimizing network: ' + error.message });
    }
});

function optimizeNetwork(nodes, optimizationGoal) {
    const graph = new Graph();

    nodes.forEach(node => {
        graph.setNode(node.node);
        node.edges.forEach(edge => {
            let weight;
            if (optimizationGoal === 'cost') {
                weight = 1 / (edge.cost + 1);
            } else if (optimizationGoal === 'latency') {
                weight = Math.pow(edge.latency, 2) * 10;
            } else if (optimizationGoal === 'reliability') {
                weight = 1 - edge.reliability;
            } else if (optimizationGoal === 'security') {
                weight = 1 - edge.security;
            } else if (optimizationGoal === 'qos') {
                weight = edge.qos;
            } else {
                weight = edge.cost;
            }
            graph.setEdge(node.node, edge.target, { weight });
        });
    });

    const shortestPaths = {};
    graph.nodes().forEach(sourceNode => {
        shortestPaths[sourceNode] = {};
        graph.nodes().forEach(targetNode => {
            if (sourceNode !== targetNode) {
                const pathData = alg.dijkstra(graph, sourceNode, (e) => graph.edge(e).weight);
                shortestPaths[sourceNode][targetNode] = pathData[targetNode].distance;
            }
        });
    });

    const optimizedNodes = nodes.map(node => {
        return {
            ...node,
            edges: node.edges.map(edge => {
                const shortestPathDistance = shortestPaths[node.node][edge.target];
                let newWeight = edge.weight;
                if (shortestPathDistance < Infinity && shortestPathDistance === edge.weight) {
                    newWeight = edge.weight * 0.8;
                } else {
                    newWeight = edge.weight * 1.2;
                }
                return { ...edge, weight: newWeight };
            })
        };
    });

    return optimizedNodes;
}

// Handler to calculate network diameter - using Dijkstra's algorithm
router.post('/network-diameter', async (req, res) => {
    try {
        const nodes = await Node.find();

        const graph = new Graph();
        nodes.forEach(node => {
            graph.setNode(node.node);
            node.edges.forEach(edge => {
                graph.setEdge(node.node, edge.target, { weight: edge.weight });
            });
        });

        let diameter = 0;
        graph.nodes().forEach(sourceNode => {
            const distances = alg.dijkstra(graph, sourceNode, (e) => graph.edge(e).weight);
            graph.nodes().forEach(targetNode => {
                if (sourceNode !== targetNode && distances[targetNode].distance > diameter) {
                    diameter = distances[targetNode].distance;
                }
            });
        });
        console.log('Network Diameter:', diameter);
        res.json({ diameter });
    } catch (error) {
        res.status(500).json({ error: 'Error calculating network diameter: ' + error.message });
    }
});


module.exports = router; 