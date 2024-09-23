import React, { useState, useEffect } from 'react';
import { Box } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Header from "../../components/Header";
import Profile from '../../images/family.png';
import './team.css';
import axios from 'axios';

const Team = () => {
  const [accountId, setAccountId] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [rowData, setRowData] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Loading state


  // async function loginEmployee(mobileNumber) {
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/employee/login', {
  //       mobileNumber
  //     });
  
  //     if (response.data.error) {
  //       console.error(response.data.error);
        
  //     } else {
  //       console.log('Employee data found:', response.data);
        
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  // loginEmployee(sessionStorage.getItem('employeeNumber'))



  useEffect(() => {
    // Retrieve accountId and mobileNumber from sessionStorage
    const storedAccountId = sessionStorage.getItem('selectedAccount');
    const storedMobileNumber = sessionStorage.getItem('mobileNumber');

    setAccountId(storedAccountId);
    setMobileNumber(storedMobileNumber);

    if (storedAccountId && storedMobileNumber) {
      fetchLiveData(storedAccountId, storedMobileNumber);
    } else {
      setLoading(false); // Set loading to false if no ID or number found
    }
  }, [accountId,mobileNumber]); // Empty dependency array

  const fetchLiveData = async (accountId, mobileNumber) => {
    console.log('Fetching data with Account ID:', accountId);
    console.log('Fetching data with Mobile Number:', mobileNumber);
    setLoading(true); // Set loading to true when starting to fetch data
    try {
      const response = await fetch(`http://localhost:5000/api/account/${accountId}/live-data-by-mobile/${mobileNumber}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        return;
      }

      const data = await response.json();
      console.log('Live Data:', data);
      console.log(response)

      // Update the state with fetched data
      setRowData(data);

    } catch (error) {
      console.error('Error fetching live data:', error);
    } finally {
      setLoading(false); // Set loading to false when fetching is complete
    }
  };

  const downloadECard = () => {
    const employeeId = sessionStorage.getItem('employeeId'); // Assuming employeeId is stored in sessionStorage

    if (!employeeId) {
      console.error('Employee ID not found in sessionStorage');
      return;
    }

    // Fetch the PDF using the employee ID
    fetch(`http://localhost:5000/api/download-e-card/${employeeId}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to download e-card');
        }
        return response.blob(); // Convert the response to a Blob object (binary data)
      })
      .then((blob) => {
        // Create a URL for the blob object
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `e_card_${employeeId}.pdf`); // Set the file name for the download
        document.body.appendChild(link);
        link.click(); // Simulate a click to download the file
        link.parentNode.removeChild(link); // Clean up the link element
      })
      .catch((error) => {
        console.error('Error downloading e-card:', error);
      });
  };

  const getMobileNumber = (data) => {
    return data["Mobile No"] || data["benef_mobile no"] || 'N/A';
  };

  // Function to get specific row data based on relation
  const getRowDataByRelation = (relation) => {
    if (!Array.isArray(rowData)) {
      return {}; // Return an empty object if rowData is not an array
    }
    const foundRow = rowData.find(item => item.benef_relation === relation);
    return foundRow || {}; // Return an empty object if no match is found
  };

  // Get data by relation
  const selfData = getRowDataByRelation('Self');
  const motherData = getRowDataByRelation('Mother');
  const fatherData = getRowDataByRelation('Father');
  const spouseData = getRowDataByRelation('Spouse');
  const sonData = getRowDataByRelation('Son');
  const daughterData = getRowDataByRelation('Daughter');

  useEffect(() => {
    if (selfData.pribenef_employee_code) {
      sessionStorage.setItem('employeeId', selfData.pribenef_employee_code);
    }
  }, [selfData.pribenef_employee_code]);

  return (
    <>
      <Box m="20px">
        <Header title="PROFILE" />
        {loading ? (
          <div className="loading-message">Loading...</div> // Display loading message
        ) : (
          <div id="employee-profile" className="employee-profile d-flex gap-5 align-items-center justify-content-center">
            <div className="profile-header">
              <img src={Profile} alt="Profile" className="profile-image" />
              <div className="profile-info">
                <h2 className="profile-name">{selfData.pribenef_name || 'Employee Name'}</h2>
                <span className={`status ${selfData.benef_status?.toLowerCase() || 'active'}`}>{selfData.benef_status || 'Active'}</span>
              </div>
            </div>
            <div className="profile-details">
              <p><strong>Employee ID:</strong> {selfData.pribenef_employee_code || 'N/A'}</p>
              <p><strong>Mobile:</strong> {getMobileNumber(selfData)}</p>
              <p><strong>Email ID:</strong> {selfData.benef_email || 'N/A'}</p>
              <p><strong>Self:</strong> {selfData.pribenef_name || 'N/A'}, <strong>DOB:</strong> {selfData.benef_dob || 'N/A'}</p>
              <p><strong>Spouse:</strong> {spouseData.benef_name || 'N/A'}, <strong>DOB:</strong> {spouseData.benef_dob || 'N/A'}</p>
              <p><strong>Daughter:</strong> {daughterData.benef_name || 'N/A'}, <strong>DOB:</strong> {daughterData.benef_dob || 'N/A'}</p>
              <p><strong>Son:</strong> {sonData.benef_name || 'N/A'}, <strong>DOB:</strong> {sonData.benef_dob || 'N/A'}</p>
              <p><strong>Father:</strong> {fatherData.benef_name || 'N/A'}, <strong>DOB:</strong> {fatherData.benef_dob || 'N/A'}</p>
              <p><strong>Mother:</strong> {motherData.benef_name || 'N/A'}, <strong>DOB:</strong> {motherData.benef_dob || 'N/A'}</p>
            </div>
          </div>
        )}
      </Box>

      <div className="E_Card" style={{ float: 'right', marginRight: "50px" }}>
        <button className="btn btn-danger"
         onClick={downloadECard}
         >
          Download E-Card
          </button>
      </div>
    </>
  );
};

export default Team;
