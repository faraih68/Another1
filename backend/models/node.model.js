const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const edgeSchema = new Schema({
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node',
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
});

const nodeSchema = new Schema({
    node: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    edges: [edgeSchema]
}, {
    timestamps: true,
});

const Node = mongoose.model('Node', nodeSchema);
module.exports = Node;
