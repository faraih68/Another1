const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const edgeSchema = new Schema({
    target: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    reliability: {
        type: Number,
        required: true,
        default: 1 // probability of edge failure
    },
    latency: {
        type: Number,
        required: true,
        default: 0 // transmission delay
    },
    throughput: {
        type: Number,
        required: true,
        default: 0 // bandwidth
    },
    cost: {
        type: Number,
        required: true,
        default: 0 // maintenance cost
    },
    security: {
        type: Number,
        required: true,
        default: 1 // probability of data breach
    },
    qos: {
        type: Number,
        required: true,
        default: 0 // priority level
    }
});

const nodeSchema = new Schema({
    node: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    edges: [edgeSchema],
    reliability: {
        type: Number,
        required: true,
        default: 1 // probability of node failure
    },
    latency: {
        type: Number,
        required: true,
        default: 0 // processing delay
    },
    throughput: {
        type: Number,
        required: true,
        default: 0 // processing capacity
    },
    cost: {
        type: Number,
        required: true,
        default: 0 // hardware cost
    },
    security: {
        type: Number,
        required: true,
        default: 1 // probability of node compromise
    },
    qos: {
        type: Number,
        required: true,
        default: 0 // service level agreement
    }
}, {
    timestamps: true,
});

const Node = mongoose.model('Node', nodeSchema);
module.exports = Node;