// Frontend: src/components/TopologyPrediction.js
import React, { useState } from 'react';
import axios from 'axios';

const TopologyPrediction = () => {
    const [historicalData, setHistoricalData] = useState('');
    const [prediction, setPrediction] = useState(null);

    const handlePredict = () => {
        axios.post('http://localhost:5000/nodes/predict', { historicalData })
            .then(response => {
                setPrediction(response.data.prediction);
            })
            .catch(error => {
                console.error('Error predicting topology:', error);
            });
    };

    return (
        <div>
            <h2>Network Topology Prediction</h2>
            <textarea value={historicalData} onChange={(e) => setHistoricalData(e.target.value)} placeholder="Historical Data" />
            <button onClick={handlePredict}>Predict</button>
            {prediction && <pre>{JSON.stringify(prediction, null, 2)}</pre>}
        </div>
    );
};

export default TopologyPrediction;