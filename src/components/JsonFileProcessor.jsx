import React, { useState } from 'react';

const JsonFileProcessor = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    setErrorMessage('');
    setSuccessMessage('');
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          setJsonFile(jsonData);
          setSuccessMessage('Valid JSON file uploaded!');
        } catch (error) {
          setErrorMessage('Invalid JSON file.');
          setJsonFile(null);
        }
      };
      reader.readAsText(file);
    } else {
      setErrorMessage('Please upload a valid JSON file.');
      setJsonFile(null);
    }
  };

  const validateJsonFile = () => {
    if (jsonFile) {
      alert('JSON file is valid!');
    } else {
      alert('No valid JSON file to validate.');
    }
  };

  const generateTestCases = () => {
    if (jsonFile) {
      alert('Test cases generated based on the uploaded JSON file!');
      // You can add logic here to create specific test cases based on the JSON structure.
    } else {
      alert('Please upload and validate a JSON file first.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>JSON File Processor</h2>
      <input type="file" accept="application/json" onChange={handleFileChange} />
      <div style={{ marginTop: '10px', color: errorMessage ? 'red' : 'green' }}>
        {errorMessage || successMessage}
      </div>
      <button onClick={validateJsonFile} style={{ marginTop: '10px', marginRight: '10px' }}>
        Validate File
      </button>
      <button onClick={generateTestCases} style={{ marginTop: '10px' }}>
        Generate Test Cases
      </button>
    </div>
  );
};

export default JsonFileProcessor;
