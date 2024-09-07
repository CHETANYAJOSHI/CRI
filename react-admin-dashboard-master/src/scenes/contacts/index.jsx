import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Paper, Grid } from '@mui/material';
import Header from '../../components/Header';
import ClaimForm from '../../../src/files/Claim form.pdf';
import CheckList from '../../../src/files/Check List.doc';
import { useLocation } from 'react-router-dom';
import SelfPolicy from './SelfPolicy';
import FolaterPolicy from './FolaterPolicy';

import './contacts.css';

const Contacts = () => {
  const [insurance, setInsurance] = useState("XYZ Ltd");
  const [TPA, setTPA] = useState("");
  const [SI, setSI] = useState("500000");
  const [period, setPeriod] = useState("1st Apr 2024 To 31st March 2025");
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [account, setAccountId] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [nullFields, setNullFields] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(localStorage.getItem('selectedAccount'));
  const location = useLocation();

  const primaryColor = '#0a88ef';
  const secondaryColor = '#FFC107';
  const darkColor = '#333';
  const lightColor = '#FFF';
  const borderColor = '#E0E0E0';

  useEffect(() => {
    const fetchNullFields = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/check-null-fields/${selectedAccount}`);
        const data = await response.json();

        if (response.ok) {
          setNullFields(data.nullFields);
        } else {
          console.error('Error fetching null fields:', data.error);
        }
      } catch (error) {
        console.error('Error fetching null fields:', error);
      }
    };
    fetchNullFields();
  }, [selectedAccount]);

  


 

  useEffect(() => {
    const storedAccountId = localStorage.getItem('selectedAccount');
    const storedMobileNumber = localStorage.getItem('mobileNumber');

    setAccountId(storedAccountId);
    setMobileNumber(storedMobileNumber);

    if (storedAccountId && storedMobileNumber) {
      fetchLiveData(storedAccountId, storedMobileNumber);
    }
  }, [account, mobileNumber, selectedAccount]);

  const fetchLiveData = async (accountId, mobileNumber) => {
    console.log('Fetching data with Account ID:', accountId);
    console.log('Fetching data with Mobile Number:', mobileNumber);
    try {
      const response = await fetch(`http://localhost:5000/api/account/${accountId}/live-data-by-mobile/${mobileNumber}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        return;
      }

      const data = await response.json();
      console.log('Live Data:', data);

      setRowData(data);
    } catch (error) {
      console.error('Error fetching live data:', error);
    }
  };
  const query = new URLSearchParams(location.search);
      const accountId = query.get('accountId');

  useEffect(() => {
    const fetchAccountData = async () => {
      const query = new URLSearchParams(location.search);
      const accountId = query.get('accountId');

      if (accountId) {
        try {
          const res = await axios.get(`http://localhost:5000/api/accounts/${accountId}`);
          setAccountData(res.data);
          localStorage.setItem('mobileNumber', res.data.hrNumber);
          console.log(res.data);
        } catch (err) {
          setError('Failed to fetch account data');
          console.error('Error fetching account data:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setError('No account ID provided');
        setLoading(false);
      }
    };

    fetchAccountData();
    
  }, [location.search, selectedAccount]);

  const getRowDataByRelation = (relation) => {
    const foundRow = rowData.find(item => item.benef_relation === relation);
    return foundRow || {}; // Return an empty object if no match is found
  };

  const selfData = getRowDataByRelation('Self');

  // Automatically select and render available policy
  useEffect(() => {
    if (!nullFields.includes('policyCoverageSelfFile')) {
      setSelectedPolicy('self');
    } else if (!nullFields.includes('policyCoverageFloaterFile')) {
      setSelectedPolicy('floater');
    }
  }, [nullFields]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box m="20px" style={{ textAlign: 'center' }}>
      <Header title={`Policy Coverage : ${accountData?.accountName || ''}`} />

      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          mb: 3,
          p: 2,
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          backgroundColor: '#EBEBE3',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '18px' }}>Insurance:</Typography>
        <Typography variant="body1" sx={{ fontSize: '18px' }}>{selfData.ro_name}</Typography>

        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '18px' }}>TPA:</Typography>
        <Typography variant="body1" sx={{ fontSize: '18px' }}>{selfData.TPA}</Typography>

        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '18px' }}>SI:</Typography>
        <Typography variant="body1" sx={{ fontSize: '18px' }}>{selfData.benef_sum_insured}</Typography>
        
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '18px' }}>Period:</Typography>
        <Typography variant="body1" sx={{ fontSize: '18px' }}>{selfData.polstartdate} / {selfData.polenddate}</Typography>
      
      </Box>

      <Box className="userbutton" mb={3}>
        <Grid container spacing={2} style={{ justifyContent: 'center' }}>
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: primaryColor, fontSize: '15px' }}
              href={accountData?.networkHospitalLink}
              target="_blank"
            >
              Network Hospital
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: secondaryColor, fontSize: '15px' }}
              href={ClaimForm}
              target="_blank"
              onClick={() => window.open(`http://localhost:5000/api/files/download/${accountId}/claimABFile`, '_blank')}
            >
              Claim Form A & B
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: '#343a40', color: '#FFF', fontSize: '15px' }}
              onClick={() => window.open(`http://localhost:5000/api/files/download/${accountId}/exclusionListFile`, '_blank')}
            >
              Exclusion List
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: '#28a745', color: '#FFF', fontSize: '15px' }}
              target="_blank"
              onClick={() => window.open(`http://localhost:5000/api/files/download/${accountId}/checkListFile`, '_blank')}
            >
              Check List
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Render selected policy based on available files */}
      {selectedPolicy === 'self' && <SelfPolicy />}
      {selectedPolicy === 'floater' && <FolaterPolicy />}
    </Box>
  );
};

export default Contacts;
