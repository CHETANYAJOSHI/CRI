import React from 'react';
import './Downloads.css';
// import windowsLogo from './windows.png'; // Ensure the path is correct
import ClaimAnalysis from '../../../src/files/Claim Analysis.pdf';
import Claimform from '../../../src/files/Claim form.pdf';
import CheckList from '../../../src/files/Check List.doc';
import Claimdump from '../../../src/files/Claim dump.xlsx';
const Downloads = () => {

  const handleDownload = async () => {
    try {
        const response = await fetch('http://localhost:5000/download-file', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.xlsx'); // Set the file name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error('Error downloading the file', error);
    }
};

  return (
    <div className="downloads">
        <div className="card">
      {/* <img src={windowsLogo} alt="Windows Logo" /> */}
      <h3>Live Data</h3>
      <a href="#" className="download-button" onClick={handleDownload}>Download</a>
      
    </div>

    <div className="card">
      {/* <img src={windowsLogo} alt="Windows Logo" /> */}
      <h3>Network Hospital</h3>
      <a href="https://www.mediassist.in/network-hospital-search/" className="download-button" target="_blank">Download</a>
      
    </div>


    <div className="card">
      {/* <img src={windowsLogo} alt="Windows Logo" /> */}
      <h3>CD Statement</h3>
      <a href="#" className="download-button">Download</a>
      
    </div>

    <div className="card">
      {/* <img src={windowsLogo} alt="Windows Logo" /> */}
      <h3>Claim Form A & B</h3>
      <a href={Claimform} className="download-button" target="_blank">Download</a>
      
    </div>

    <div className="card">
      {/* <img src={windowsLogo} alt="Windows Logo" /> */}
      <h3>Claim Analysis</h3>
      <a href={ClaimAnalysis} className="download-button" target="_blank">Download</a>
      
    </div>

    <div className="card">
      {/* <img src={windowsLogo} alt="Windows Logo" /> */}
      <h3>Check List</h3>
      <a href={CheckList} className="download-button" target="_blank">Download</a>
      
    </div>

    <div className="card">
      {/* <img src={windowsLogo} alt="Windows Logo" /> */}
      <h3>Claim Dump</h3>
      <a href={Claimdump} className="download-button" target="_blank">Download</a>
      
    </div>

    <div className="card">
      {/* <img src={windowsLogo} alt="Windows Logo" /> */}
      <h3>Exclusion List</h3>
      <a href="#" className="download-button">Download</a>
      
    </div>

    </div>
  );
};

export default Downloads;
