import React, { useState,useEffect } from 'react';
import axios from 'axios'
import { Box, Button, Typography, Paper, Grid } from '@mui/material';
import Header from '../../components/Header';
import ClaimForm from '../../../src/files/Claim form.pdf';
import CheckList from '../../../src/files/Check List.doc';
import { useLocation } from 'react-router-dom';
import './contacts.css';

const Contacts = () => {
  const [insurance, setInsurance] = useState("XYZ Ltd");
  const [TPA, setTPA] = useState("XZY Ltd");
  const [SI, setSI] = useState("500000");
  const [period, setPeriod] = useState("1st Apr 2024 To 31st March 2025");


  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Define custom colors
  const primaryColor = '#1E88E5';
  const secondaryColor = '#FFC107';
  const darkColor = '#333';
  const lightColor = '#FFF';
  const borderColor = '#E0E0E0';

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
  }, [location.search]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  
  return (
    <Box m="20px">
      <Header title={`Policy Coverage : ${accountData.accountName}`} />
      
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          mb: 3,
          p: 2,
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          backgroundColor: lightColor,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600 , fontSize:'16px' }}>Insurance:</Typography>
        <Typography variant="body1" sx={{ fontSize:'16px'}}>{insurance}</Typography>

        <Typography variant="body1" sx={{ fontWeight: 600 , fontSize:'16px'}}>TPA:</Typography>
        <Typography variant="body1" sx={{ fontSize:'16px'}}>{TPA}</Typography>

        <Typography variant="body1" sx={{ fontWeight: 600 , fontSize:'16px'}}>SI:</Typography>
        <Typography variant="body1" sx={{ fontSize:'16px'}}>{SI}</Typography>

        <Typography variant="body1" sx={{ fontWeight: 600 , fontSize:'16px'}}>Period:</Typography>
        <Typography variant="body1" sx={{ fontSize:'16px'}}>{period}</Typography>
      </Box>

      <Box className="userbutton" mb={3}>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: primaryColor  , fontSize:'15px'}}
              href={accountData.networkHospitalLink}
              target="_blank"
              onClick={() => window.open(`http://localhost:5000/api/files/download/${accountId}/networkHospitalFile`, '_blank')}
            >
              Network Hospital
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: secondaryColor , fontSize:'15px'}}
              href={ClaimForm}
              target="_blank"
            >
              Claim Form A & B
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: '#343a40', color: '#FFF' , fontSize:'15px'}}
            >
              Exclusion List
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ backgroundColor: '#28a745', color: '#FFF' , fontSize:'15px'}}
              href={CheckList}
              target="_blank"
            >
              Check List
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: primaryColor, color: 'white' }}>
              <th colSpan={2} style={{ padding: '10px', textAlign: 'center' }}>Coverage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Sum Assured</th>
              <td style={{ padding: '10px' }}>3 Lacs INR</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Policy Type</th>
              <td style={{ padding: '10px' }}>Group Mediclaim Policy</td>
            </tr>
            <tr style={{ backgroundColor: primaryColor, color: 'white' }}>
              <th colSpan={2} style={{ padding: '10px', textAlign: 'center' }}>Family Definition</th>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Family Definition</th>
              <td style={{ padding: '10px' }}>Self + Spouse + 5 dependent Kids + 2 Dep. Parents/ Parents In Laws</td>
            </tr>
            <tr style={{ backgroundColor: primaryColor, color: 'white' }}>
              <th colSpan={2} style={{ padding: '10px', textAlign: 'center' }}>Room Rent Limits</th>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Normal room rent capping</th>
              <td style={{ padding: '10px' }}>2% for Normal</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>ICU room rent capping</th>
              <td style={{ padding: '10px' }}>4% for ICU</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Pre-existing diseases</th>
              <td style={{ padding: '10px' }}>Covered from Day 1</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>30 days waiting period</th>
              <td style={{ padding: '10px' }}>Waived off</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>1st / 2nd / 3rd / 4th Year Waiting Period</th>
              <td style={{ padding: '10px' }}>Waived off</td>
            </tr>
            <tr style={{ backgroundColor: primaryColor, color: 'white' }}>
              <th colSpan={2} style={{ padding: '10px', textAlign: 'center' }}>Maternity</th>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>9 months Waiting Period</th>
              <td style={{ padding: '10px' }}>Waived off</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Maternity Limit</th>
              <td style={{ padding: '10px' }}>Rs 60,000 for Both Normal & Caesarean</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>New Born Cover</th>
              <td style={{ padding: '10px' }}>Covered from Day 1</td>
            </tr>
            <tr style={{ backgroundColor: primaryColor, color: 'white' }}>
              <th colSpan={2} style={{ padding: '10px', textAlign: 'center' }}>Pre & Post Hospitalization</th>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Pre-hospitalization costs</th>
              <td style={{ padding: '10px' }}>30 days</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Post Hospitalization costs</th>
              <td style={{ padding: '10px' }}>60 days</td>
            </tr>
            <tr style={{ backgroundColor: primaryColor, color: 'white' }}>
              <th colSpan={2} style={{ padding: '10px', textAlign: 'center' }}>Other Conditions</th>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Oral Chemotherapy</th>
              <td style={{ padding: '10px' }}>Covered upto Family SI</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Ambulance Charges</th>
              <td style={{ padding: '10px' }}>Rs 2,000 per Incident</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Organ Donor</th>
              <td style={{ padding: '10px' }}>Covered upto Family SI</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Disease-wise capping</th>
              <td style={{ padding: '10px' }}>No Capping on Diseases</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Addition / Deletion of Lives</th>
              <td style={{ padding: '10px' }}>Pro-rata</td>
            </tr>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>Policy Cancellation</th>
              <td style={{ padding: '10px' }}>Refund of Pro-rata Premium</td>
            </tr>
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};

export default Contacts;
