// Frontend: src/components/NetworkSimulation.js
import React, { useState } from 'react';
import axios from 'axios';

const NetworkSimulation = () => {
    const [simulator, setSimulator] = useState('NS3');
    const [topology, setTopology] = useState('');
    const [simulationResult, setSimulationResult] = useState(null);

    const handleSimulate = () => {
        axios.post('http://localhost:5000/nodes/simulate', { simulator, topology })
            .then(response => {
                setSimulationResult(response.data.result);
            })
            .catch(error => {
                console.error('Error running simulation:', error);
            });
    };

    return (
        <div>
            <h2>Network Simulation</h2>
            <select value={simulator} onChange={(e) => setSimulator(e.target.value)}>
                <option value="NS3">NS3</option>
                <option value="OMNeT++">OMNeT++</option>
            </select>
            <textarea value={topology} onChange={(e) => setTopology(e.target.value)} placeholder="Topology Data" />
            <button onClick={handleSimulate}>Simulate</button>
            {simulationResult && <pre>{simulationResult}</pre>}
        </div>
    );
};

export default NetworkSimulation;
