// Frontend: src/components/ReportGenerator.js
import React, { useState } from 'react';
import axios from 'axios';

const ReportGenerator = () => {
    const [reportData, setReportData] = useState('');

    const handleGenerateReport = () => {
        axios.post('http://localhost:5000/nodes/generateReport', { reportData })
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                console.error('Error generating report:', error);
            });
    };

    return (
        <div>
            <h2>Automated Report Generation</h2>
            <textarea value={reportData} onChange={(e) => setReportData(e.target.value)} placeholder="Report Data" />
            <button onClick={handleGenerateReport}>Generate Report</button>
        </div>
    );
};

export default ReportGenerator;