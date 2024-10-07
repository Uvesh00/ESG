import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ESGChart from './ESGChart';

function App() {
    const [company, setCompany] = useState('');
    const [file, setFile] = useState(null);
    const [esgData, setEsgData] = useState(null);
    const [error, setError] = useState('');
    const [uploadedData, setUploadedData] = useState(null);
    const [query, setQuery] = useState(''); // State for natural language query
    const [llmResponse, setLlmResponse] = useState(''); // State for LLM response

    const handleSearch = async () => {
        setError(''); // Clear previous errors
        try {
            const response = await axios.get(`http://localhost:5000/api/company/${company}`);
            setEsgData(response.data); // Use response.data directly
            setUploadedData(null); // Clear uploaded data when fetching new data
        } catch (err) {
            setError('Error fetching data');
            setEsgData(null);
        }
    };

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileSubmit = async (fileType) => {
        if (!file) return alert('Please upload a file first!');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const endpoint = fileType === 'csv' ? 'import/csv' : 'import/pdf';
            const response = await axios.post(`http://localhost:5000/api/${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadedData(response.data.data);
            setEsgData(null); // Clear existing data when uploading new data
        } catch (err) {
            setError('Error importing file');
            setUploadedData(null);
        }
    };

    const handleNaturalLanguageQuery = async () => {
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/query', { query });
            setLlmResponse(response.data.answer);
        } catch (err) {
            setError('Error querying the LLM');
        }
    };

    const handleExportCSV = async () => {
        if (!esgData) return alert('No ESG data available for export!');

        const response = await axios.post('http://localhost:5000/api/export/csv', { data: esgData }, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'esg-data.csv');
        document.body.appendChild(link);
        link.click();
    };

    const handleExportPDF = async () => {
        if (!esgData) return alert('No ESG data available for export!');

        const response = await axios.post('http://localhost:5000/api/export/pdf', { data: esgData }, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'esg-report.pdf');
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="App">
            <h1>ESG Data Dashboard</h1>
            <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />
            <button onClick={handleSearch}>Search ESG Data</button>

            <h2>Upload ESG Data</h2>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <button onClick={() => handleFileSubmit('csv')}>Upload CSV</button>
            <input type="file" accept=".pdf" onChange={handleFileUpload} />
            <button onClick={() => handleFileSubmit('pdf')}>Upload PDF</button>

            <h2>Natural Language Query</h2>
            <input
                type="text"
                placeholder="Ask something..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleNaturalLanguageQuery}>Ask</button>

            {error && <div className="error">{error}</div>}
            {llmResponse && <div className="response">{llmResponse}</div>}
            
            {(esgData || uploadedData) && (
                <>
                    <ESGChart data={esgData || uploadedData} />
                    <button onClick={handleExportCSV}>Download CSV</button>
                    <button onClick={handleExportPDF}>Download PDF</button>
                </>
            )}
        </div>
    );
}

export default App;
