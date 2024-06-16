// Frontend: src/components/RealTimeOptimization.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const RealTimeOptimization = () => {
    const [networkData, setNetworkData] = useState('');
    const [optimizedTopology, setOptimizedTopology] = useState(null);

    useEffect(() => {
        socket.on('optimizedTopology', (data) => {
            setOptimizedTopology(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleOptimize = () => {
        socket.emit('optimize', networkData);
    };

    return (
        <div>
            <h2>Real-time Optimization</h2>
            <textarea value={networkData} onChange={(e) => setNetworkData(e.target.value)} placeholder="Network Data" />
            <button onClick={handleOptimize}>Optimize</button>
            {optimizedTopology && <pre>{JSON.stringify(optimizedTopology, null, 2)}</pre>}
        </div>
    );
};

export default RealTimeOptimization;