// Frontend: src/components/CustomAlgorithm.js
import React, { useState } from 'react';
import axios from 'axios';

const CustomAlgorithm = () => {
    const [algorithmCode, setAlgorithmCode] = useState('');
    const [networkData, setNetworkData] = useState('');
    const [optimizedTopology, setOptimizedTopology] = useState(null);

    const handleOptimize = () => {
        axios.post('http://localhost:5000/nodes/optimize', { algorithmCode, networkData })
            .then(response => {
                setOptimizedTopology(response.data.optimizedTopology);
            })
            .catch(error => {
                console.error('Error optimizing topology:', error);
            });
    };

    return (
        <div>
            <h2>Customizable Optimization Algorithms</h2>
            <textarea value={algorithmCode} onChange={(e) => setAlgorithmCode(e.target.value)} placeholder="Algorithm Code" />
            <textarea value={networkData} onChange={(e) => setNetworkData(e.target.value)} placeholder="Network Data" />
            <button onClick={handleOptimize}>Optimize</button>
            {optimizedTopology && <pre>{JSON.stringify(optimizedTopology, null, 2)}</pre>}
        </div>
    );
};

export default CustomAlgorithm;