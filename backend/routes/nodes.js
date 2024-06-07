const express = require('express');
const router = express.Router();
const Node = require('../models/node.model');
const dijkstra = require('dijkstrajs');

// Handler to get all nodes
router.get('/', async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching nodes: ' + err });
    }
});

// Handler to edit an existing node
router.post('/edit', async (req, res) => {
    const { nodeId, nodeName, edges } = req.body;

    try {
        const node = await Node.findById(nodeId);
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }

        node.node = nodeName;
        node.edges = edges ? edges.map(edge => ({
            target: edge.targetNodeName,
            weight: edge.weight
        })) : [];

        await node.save();
        res.json({ message: 'Node updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Error editing node: ' + error });
    }
});

// Handler to find the shortest path
router.post('/shortest-path', async (req, res) => {
    const { startNode, endNode } = req.body;

    try {
        const nodes = await Node.find();

        // Construct graph for the Dijkstra library
        const graph = {};
        nodes.forEach(node => {
            graph[node.node] = {};
            node.edges.forEach(edge => {
                graph[node.node][edge.target] = edge.weight;
            });
        });

        // Apply Dijkstra's algorithm
        const path = dijkstra.find_path(graph, startNode, endNode);
        res.status(200).json({ path });
    } catch (error) {
        res.status(500).json({ error: 'Error finding shortest path: ' + error.message });
    }
});

// Handler to delete a node
router.delete('/:id', async (req, res) => {
    try {
        await Node.findByIdAndDelete(req.params.id);
        res.json({ message: 'Node deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting node: ' + err });
    }
});

// Handler to add a new node and update existing nodes' edges
router.post('/add-with-edge-update', async (req, res) => {
    const { nodeName, edges } = req.body; // Get 'edges' from the request

    try {
        // Create the new node
        const newNode = new Node({ node: nodeName, edges: [] });
        await newNode.save();

        // Update edges based on the received 'edges' data
        edges.forEach(edge => {
            const targetNodeName = edge.targetNodeName;
            const weight = edge.weight;

            // Find the existing node to update its edges
            Node.findOne({ node: targetNodeName })
                .then(targetNode => {
                    if (targetNode) {
                        targetNode.edges.push({ target: nodeName, weight: weight });
                        targetNode.save();
                    } else {
                        console.error(`Target node not found: ${targetNodeName}`);
                    }
                })
                .catch(err => {
                    console.error('Error finding target node:', err);
                });
        });

        res.json({ message: 'Node added and edge updates completed!' });
    } catch (err) {
        res.status(400).json({ error: 'Error adding node: ' + err });
    }
});

module.exports = router;