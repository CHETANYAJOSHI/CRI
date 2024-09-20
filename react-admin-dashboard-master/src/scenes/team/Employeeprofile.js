import React, { useState, useEffect, useCallback } from 'react';
import { Box } from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Header from "../../components/Header";
import Profile from '../../images/family.png';
import './team.css';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EmployeeProfile = () => { 
  const Navigate = useNavigate();
  const [accountId, setAccountId] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [rowData, setRowData] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Loading state

  
  // Fetch live data based on accountId and mobileNumber
  const fetchLiveData = useCallback(async (accountId, mobileNumber) => {
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
      setRowData(data); // Update the state with fetched data
    } catch (error) {
      console.error('Error fetching live data:', error);
    } finally {
      setLoading(false); // Set loading to false when fetching is complete
    }
  }, []);

  // Function to handle employee login
  const loginEmployee = useCallback(async (mobileNumber) => {
    try {
      const response = await axios.post('http://localhost:5000/api/employee/login', { mobileNumber });
      if (response.data.error) {
        console.error(response.data.error); 
      } else {
        const { accountId } = response.data;
        localStorage.setItem('selectedAccount', accountId);
        localStorage.setItem('mobileNumber', mobileNumber);
        fetchLiveData(accountId, mobileNumber);
      }
    } catch (error) {
      alert("User Not found");
      Navigate('/')
      
      
    }
  }, [fetchLiveData]);

  useEffect(() => {
    const storedAccountId = localStorage.getItem('selectedAccount');
    const storedMobileNumber = localStorage.getItem('employeeNumber');
    setAccountId(storedAccountId);
    setMobileNumber(storedMobileNumber);
    if (storedMobileNumber) {
      if (storedAccountId) {
        fetchLiveData(storedAccountId, storedMobileNumber);
      } else {
        loginEmployee(storedMobileNumber); // Fetch account ID if missing
      }
    } else {
      setLoading(false); // Set loading to false if no mobile number is found
    }
  }, [fetchLiveData, loginEmployee]);

  

  const getMobileNumber = (data) => {
    return data["Mobile No"] || data["benef_mobile no"] || 'N/A';
  };

  const getRowDataByRelation = (relation) => rowData.filter(item => item.benef_relation === relation);

const selfData = getRowDataByRelation('Self')[0] || {}; // Assuming only one self
const motherData = getRowDataByRelation('Mother')[0] || {}; // Assuming only one mother
const fatherData = getRowDataByRelation('Father')[0] || {}; // Assuming only one father
const spouseData = getRowDataByRelation('Spouse')[0] || {}; // Assuming only one spouse
const sonsData = getRowDataByRelation('Son'); // Get all sons
const daughtersData = getRowDataByRelation('Daughter'); // Get all daughters

useEffect(() => {
  if (selfData.pribenef_employee_code) {
    localStorage.setItem('employeeId', selfData.pribenef_employee_code);
  }
}, [selfData.pribenef_employee_code]);

const downloadECard = () => {
  const employeeId = localStorage.getItem('employeeId'); // Assuming employeeId is stored in localStorage

  if (!employeeId) {
    console.error('Employee ID not found in localStorage');
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
  <p><strong>Spouse:</strong> {spouseData.benef_name || 'N/A'},<strong>DOB:</strong> {spouseData.benef_dob || 'N/A'}</p>

  {daughtersData.length > 0 && (
    <p><strong>Daughters:</strong></p>
  )}
  {daughtersData.map((daughter, index) => (
    <p key={index}>{daughter.benef_name || 'N/A'}, <strong>DOB:</strong> {daughter.benef_dob || 'N/A'}</p>
  ))}

  {sonsData.length > 0 && (
    <p><strong>Sons:</strong></p>
  )}
  {sonsData.map((son, index) => (
    <p key={index}>{son.benef_name || 'N/A'}, <strong>DOB:</strong> {son.benef_dob || 'N/A'}</p>
  ))}

  <p><strong>Father:</strong> {fatherData.benef_name || 'N/A'}, <strong>DOB:</strong> {fatherData.benef_dob || 'N/A'}</p>
  <p><strong>Mother:</strong> {motherData.benef_name || 'N/A'}, <strong>DOB:</strong> {motherData.benef_dob || 'N/A'}</p>
</div>

          </div>
        )}
      </Box>
      <div className="E_Card" style={{ float: 'right', marginRight: "50px" }}>
        <button className="btn btn-danger" 
        onClick={downloadECard}
        >Download E-Card</button>
      </div>
    </>
  );
};

export default EmployeeProfile;
