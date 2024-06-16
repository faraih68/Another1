const express = require('express');
const router = express.Router();
const Node = require('../models/node.model');
const dijkstra = require('dijkstrajs');
const { exec } = require('child_process');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { VM } = require('vm2');

// Handler for generating reports
router.post('/generateReport', (req, res) => {
    const { reportData } = req.body;

    try {
        const doc = new PDFDocument();
        const filePath = 'report.pdf';

        doc.pipe(fs.createWriteStream(filePath));
        doc.text('Network Report', { align: 'center' });
        doc.text(JSON.stringify(reportData, null, 2));
        doc.end();

        res.status(200).json({ message: 'Report generated successfully', filePath });
    } catch (error) {
        res.status(500).json({ error: 'Error generating report: ' + error.message });
    }
});

// Handler to run network simulation
router.post('/simulate', (req, res) => {
    const { simulator, topology } = req.body;

    exec(`simulate_with_${simulator} '${JSON.stringify(topology)}'`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'Simulation error: ' + error.message });
        }
        res.status(200).json({ result: stdout });
    });
});

// Handler to get a specific node by name
router.get('/:nodeName', async (req, res) => {
    try {
        const node = await Node.findOne({ node: req.params.nodeName });
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }
        res.json(node);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching node: ' + err.message });
    }
});

// Handler to get all nodes
router.get('/', async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching nodes: ' + err.message });
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
        res.status(400).json({ error: 'Error adding node: ' + err.message });
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
        res.status(500).json({ error: 'Error editing node: ' + error.message });
    }
});

// Handler to find the shortest path
router.post('/shortest-path', async (req, res) => {
    const { startNode, endNode } = req.body;

    try {
        const nodes = await Node.find();

        const graph = {};
        nodes.forEach(node => {
            graph[node.node] = {};
            node.edges.forEach(edge => {
                graph[node.node][edge.target] = edge.weight;
            });
        });

        const path = dijkstra.find_path(graph, startNode, endNode);
        res.status(200).json({ path });
    } catch (error) {
        res.status(500).json({ error: 'Error finding shortest path: ' + error.message });
    }
});

// Handler to delete a node
router.delete('/:nodeName', async (req, res) => {
    try {
        const node = await Node.findOneAndDelete({ node: req.params.nodeName });
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }
        res.json({ message: 'Node deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting node: ' + err.message });
    }
});

// Handler to compare topologies
router.post('/compare', (req, res) => {
    const { originalTopology, optimizedTopology } = req.body;

    if (!originalTopology || !optimizedTopology) {
        return res.status(400).json({ error: 'Both originalTopology and optimizedTopology are required.' });
    }

    try {
        const comparisonResult = {}; // Implement the actual comparison logic
        res.status(200).json(comparisonResult);
    } catch (error) {
        res.status(500).json({ error: 'Error comparing topologies: ' + error.message });
    }
});

// Handler to execute custom optimization algorithms
router.post('/optimize', (req, res) => {
    const { algorithmCode, networkData } = req.body;

    const vm = new VM({
        timeout: 1000,
        sandbox: {
            networkData,
            console
        }
    });

    try {
        const optimizedTopology = vm.run(`
            const optimize = ${algorithmCode};
            optimize(networkData);
        `);
        res.status(200).json({ optimizedTopology });
    } catch (error) {
        res.status(400).json({ error: 'Error executing algorithm: ' + error.message });
    }
});

// Handler for predicting network topology
router.post('/predict', async (req, res) => {
    const { historicalData } = req.body;

    try {
        const model = await tf.loadLayersModel('file://path/to/your/model.json');

        const inputTensor = tf.tensor(historicalData);
        const prediction = model.predict(inputTensor);

        res.status(200).json({ prediction: await prediction.array() });
    } catch (error) {
        res.status(500).json({ error: 'Error predicting network topology: ' + error.message });
    }
});

module.exports = router;
