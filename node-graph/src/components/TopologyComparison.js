// Frontend: src/components/TopologyComparison.js
import React, { useState } from 'react';
import axios from 'axios';

const TopologyComparison = () => {
    const [originalTopology, setOriginalTopology] = useState('');
    const [optimizedTopology, setOptimizedTopology] = useState('');
    const [comparisonResult, setComparisonResult] = useState(null);

    const handleCompare = () => {
      axios.post('http://localhost:5000/nodes/compare', { originalTopology, optimizedTopology })
          .then(response => {
              setComparisonResult(response.data.comparisonResult);
          })
          .catch(error => {
              console.error('Error comparing topologies:', error);
          });
  };

  return (
      <div>
          <h2>Topology Comparison Tool</h2>
          <textarea value={originalTopology} onChange={(e) => setOriginalTopology(e.target.value)} placeholder="Original Topology" />
          <textarea value={optimizedTopology} onChange={(e) => setOptimizedTopology(e.target.value)} placeholder="Optimized Topology" />
          <button onClick={handleCompare}>Compare</button>
          {comparisonResult && <pre>{JSON.stringify(comparisonResult, null, 2)}</pre>}
      </div>
  );
};

export default TopologyComparison;