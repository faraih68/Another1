import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './NodeList.css';

const NodeList = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/nodes')
            .then(response => {
                setNodes(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the nodes!', error);
            });
    }, []);

    const deleteNode = (nodeName) => {
        axios.delete(`http://localhost:5000/nodes/${nodeName}`)
            .then(() => {
                setNodes(nodes.filter(node => node.node !== nodeName));
            })
            .catch(error => {
                console.error('There was an error deleting the node!', error);
            });
    };

    return (
        <div className="node-list">
            <h2>Nodes</h2>
            <ul>
                {nodes.map(node => (
                    <li key={node._id}>
                        {node.node}
                        <Link to={`/edit/${node.node}`} className="edit-btn">
                            <FaEdit />
                        </Link>
                        <button onClick={() => deleteNode(node.node)} className="delete-btn">
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NodeList;