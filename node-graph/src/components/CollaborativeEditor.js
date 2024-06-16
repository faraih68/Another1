// Frontend: src/components/CollaborativeEditor.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const CollaborativeEditor = () => {
    const [topology, setTopology] = useState('');

    useEffect(() => {
        socket.on('topologyUpdated', (data) => {
            setTopology(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleUpdate = (e) => {
        const newTopology = e.target.value;
        setTopology(newTopology);
        socket.emit('updateTopology', newTopology);
    };

    return (
        <div>
            <h2>Collaborative Editor</h2>
            <textarea value={topology} onChange={handleUpdate} />
        </div>
    );
};

export default CollaborativeEditor;
