// src/components/PdfViewer.js
import React, { useState, useEffect } from 'react';

const CalimAnalysis = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Upload new PDF file
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/pdf/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.text();
            setMessage(result);
            loadPdfViewer(); // Refresh the PDF viewer to show the updated file
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload file');
        }
    };

    // Load PDF viewer with the current file
    const loadPdfViewer = () => {
        document.getElementById('pdfViewer').src = 'http://localhost:5000/pdf/file';
    };

    // Load PDF viewer initially
    useEffect(() => {
        loadPdfViewer();
    }, []);

    return (
        <div>
            <h1>Upload and View PDF</h1>
            <form onSubmit={handleUpload}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button type="submit">Upload PDF</button>
            </form>
            {message && <p>{message}</p>}
            <a href="http://localhost:5000/pdf/download" download>Download PDF</a>
            <iframe
                id="pdfViewer"
                style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
                title="PDF Viewer"
            ></iframe>
        </div>
    );
};

export default CalimAnalysis;
