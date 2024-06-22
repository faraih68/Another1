// Frontend: CSVUpload.js

import React, { useState } from 'react';
import './CSVUpload.css';

const CSVUpload = ({ onUpload }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message

    if (!csvFile) {
      setErrorMessage('Please select a CSV file.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target.result;
        onUpload(csvData);
      };
      reader.readAsText(csvFile);
    } catch (error) {
      console.error('Error reading CSV file:', error);
      setErrorMessage('An error occurred while reading the file. Please try again.');
    }
  };

  return (
    <div className="csv-upload">
      <h2>Upload CSV</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default CSVUpload;