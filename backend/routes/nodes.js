// nodes.js

const express = require('express');
const router = express.Router();
const Node = require('../models/node.model');
const dijkstra = require('dijkstrajs');

// Handler to get a specific node by name
router.get('/:nodeName', async (req, res) => {
    try {
        const node = await Node.findOne({ node: req.params.nodeName });
        res.json(node);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching node: ' + err });
    }
});



// Handler to get all nodes
router.get('/', async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching nodes: ' + err });
    }
});

// Handler to add a new node
router.post('/add', async (req, res) => {
    const { nodeName, edges } = req.body;

    const node = new Node({
        node: nodeName,
        edges: edges ? edges.map(edge => ({
            target: edge.targetNodeName,
            weight: edge.weight
        })) : []
    });

    try {
        await node.save();
        res.json({ message: 'Node added!' });
    } catch (err) {
        res.status(400).json({ error: 'Error adding node: ' + err });
    }
});

// Handler to edit an existing node
router.post('/edit', async (req, res) => {
    const { nodeName, newNodeName, edges } = req.body;

    try {
        const node = await Node.findOne({ node: nodeName });
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }

        node.node = newNodeName;
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
router.delete('/:nodeName', async (req, res) => {
    try {
        await Node.findOneAndDelete({ node: req.params.nodeName });
        res.json({ message: 'Node deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting node: ' + err });
    }
});

module.exports = router;
