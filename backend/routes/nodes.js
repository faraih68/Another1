const express = require('express');
const { Graph, alg } = require('graphlib');
const { Graph: JGraph, Edge, KruskalMST } = require('js-graph-algorithms');
const router = express.Router();
const Node = require('../models/node.model');

// Handler to get all nodes
router.get('/', async (req, res) => {
    try {
        const nodes = await Node.find();
        console.log("Nodes fetched:", nodes); // Debug log
        res.json(nodes);
    } catch (error) {
        console.error("Error fetching nodes:", error); // Debug log
        res.status(400).json({ error: 'Error fetching nodes: ' + error.message });
    }
});

// Handler to get a specific node by name
router.get('/:nodeName', async (req, res) => {
    try {
        const node = await Node.findOne({ node: req.params.nodeName });
        console.log("Node fetched:", node); // Debug log
        res.json(node);
    } catch (error) {
        console.error("Error fetching node:", error); // Debug log
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
        console.log("Node added:", savedNode); // Debug log
        res.json({ message: 'Node added!', node: savedNode });
    } catch (error) {
        console.error("Error adding node:", error); // Debug log
        res.status(400).json({ error: 'Error adding node: ' + error.message });
    }
});

// Handler to edit an existing node
router.post('/edit', async (req, res) => {
    const { nodeName, newNodeName, edges, reliability, latency, throughput, cost, security, qos } = req.body;

    try {
        const node = await Node.findOne({ node: nodeName });
        if (!node) {
            console.log("Node not found:", nodeName); // Debug log
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
        console.log("Node updated:", updatedNode); // Debug log
        res.json({ message: 'Node updated!', node: updatedNode });
    } catch (error) {
        console.error("Error editing node:", error); // Debug log
        res.status(500).json({ error: 'Error editing node: ' + error.message });
    }
});

// Handler to delete a node
router.delete('/:nodeName', async (req, res) => {
    try {
        const deletedNode = await Node.findOneAndDelete({ node: req.params.nodeName });
        console.log("Node deleted:", deletedNode); // Debug log
        res.json({ message: 'Node deleted' });
    } catch (error) {
        console.error("Error deleting node:", error); // Debug log
        res.status(400).json({ error: 'Error deleting node: ' + error.message });
    }
});

// Handler to find the shortest path
router.post('/shortest-path', async (req, res) => {
    const { startNode, endNode } = req.body;

    try {
        const nodes = await Node.find();

        // Construct graph for Dijkstra's algorithm (using graphlib)
        const graph = new Graph();
        nodes.forEach(node => {
            graph.setNode(node.node);
            node.edges.forEach(edge => {
                graph.setEdge(node.node, edge.target, { weight: edge.weight });
            });
        });

        if (!graph.hasNode(startNode)) {
            throw new Error(`Start node ${startNode} not found in the graph`);
        }
        if (!graph.hasNode(endNode)) {
            throw new Error(`End node ${endNode} not found in the graph`);
        }

        const pathData = alg.dijkstra(graph, startNode, (e) => graph.edge(e).weight);
        console.log("Dijkstra's Algorithm Result:", pathData);

        // Extract the shortest path 
        let shortestPath = [];
        if (pathData[endNode].distance !== Infinity) { 
            let currentNode = endNode;
            while (currentNode) {
                shortestPath.unshift(currentNode);
                currentNode = pathData[currentNode].predecessor;
            }
        }

        if (shortestPath.length > 0 && shortestPath[0] === startNode) {
            console.log("Shortest path found:", shortestPath);
            res.status(200).json({ path: shortestPath });
        } else {
            console.log("No path found from", startNode, "to", endNode);
            res.status(404).json({ error: `No path found from ${startNode} to ${endNode}` });
        }

    } catch (error) {
        console.error("Error finding shortest path:", error);
        res.status(500).json({ error: 'Error finding shortest path: ' + error.message });
    }
});

// Handler to compute Minimum Spanning Tree
router.post('/mst', async (req, res) => {
    try {
        const nodes = await Node.find();
        if (!nodes.length) {
            throw new Error('No nodes found in the database');
        }

        const graph = new JGraph(nodes.length);
        const nodeIndexMap = new Map(nodes.map((node, index) => [node.node, index]));

        console.log('Node Index Map:', nodeIndexMap);

        nodes.forEach(node => {
            const sourceIndex = nodeIndexMap.get(node.node);
            if (sourceIndex === undefined) {
                throw new Error(`Node ${node.node} not found in nodeIndexMap`);
            }
            node.edges.forEach(edge => {
                const targetIndex = nodeIndexMap.get(edge.target);
                if (targetIndex === undefined) {
                    console.error(`Edge target ${edge.target} not found in nodeIndexMap for node ${node.node}`);
                    return; // Skip this edge
                }
                console.log(`Adding edge from ${node.node} to ${edge.target} with weight ${edge.weight}`);
                try {
                    graph.addEdge(new Edge(sourceIndex, targetIndex, edge.weight));
                } catch (err) {
                    console.error(`Error adding edge from ${node.node} to ${edge.target}: ${err.message}`);
                }
            });
        });

        const mst = new KruskalMST(graph);
        const mstEdges = mst.edges();

        const formattedMST = mstEdges.map(edge => ({
            v: nodes[edge.either()].node,
            w: nodes[edge.other(edge.either())].node,
            weight: edge.weight
        }));

        console.log("MST computed:", formattedMST);
        res.json(formattedMST);

    } catch (error) {
        console.error("Error computing MST:", error);
        res.status(500).json({ error: 'Error computing MST: ' + error.message });
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

        console.log("Graph constructed for centrality:", graph);

        // Compute centrality measures
        const degreeCentrality = {};
        const closenessCentrality = {};
        const betweennessCentrality = {};
        const nodeCount = graph.nodeCount();

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

        // Betweenness centrality calculation
        graph.nodes().forEach(source => {
            const distances = alg.dijkstra(graph, source, (e) => graph.edge(e).weight);
            graph.nodes().forEach(target => {
                if (source !== target) {
                    let paths = 0;
                    let pathsThroughNode = 0;
                    graph.nodes().forEach(node => {
                        if (node !== source && node !== target && distances[target]) { // Check if distances[target] exists
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

        console.log("Centrality measures computed:", { degreeCentrality, closenessCentrality, betweennessCentrality }); // Debug log
        res.json({ degreeCentrality, closenessCentrality, betweennessCentrality });
    } catch (error) {
        console.error("Error computing centrality measures:", error);
        res.status(500).json({ error: 'Error computing centrality measures: ' + error.message });
    }
});

module.exports = router;
