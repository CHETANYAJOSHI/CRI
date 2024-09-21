import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Container, Typography, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function ClaimIntimation() {
  const [formData, setFormData] = useState({
    patientName: '',
    employeeName: '',
    corporateName: '',
    hospitalName: '',
    dateOfAdmission: null,
    dateOfDischarge: null,
    expectedClaimAmount: '',
    employeeCode: '',
    clientId: '',
    memberId: '',
    policyNo: '',
    contactNo: '',
    emailId: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem('claimIntimationData'));
    if (cachedData) {
      setFormData(cachedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('claimIntimationData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (name, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const data = [
      ["Field", "Value"],
      ["Patient Name", formData.patientName],
      ["Employee Name", formData.employeeName],
      ["Corporate Name", formData.corporateName],
      ["Hospital Name", formData.hospitalName],
      ["Date of Admission", formData.dateOfAdmission?.format('DD/MM/YYYY')],
      ["Date of Discharge", formData.dateOfDischarge?.format('DD/MM/YYYY')],
      ["Expected Claim Amount", formData.expectedClaimAmount],
      ["Employee Code", formData.employeeCode],
      ["Client ID", formData.clientId],
      ["Member ID", formData.memberId],
      ["Policy No", formData.policyNo],
      ["Contact No", formData.contactNo],
      ["Email ID", formData.emailId],
    ];

    const response = await fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    setLoading(false); // Stop loading

    if (response.ok) {
      setOpenSnackbar(true);
      setFormData({
        patientName: '',
        employeeName: '',
        corporateName: '',
        hospitalName: '',
        dateOfAdmission: null,
        dateOfDischarge: null,
        expectedClaimAmount: '',
        employeeCode: '',
        clientId: '',
        memberId: '',
        policyNo: '',
        contactNo: '',
        emailId: '',
      });
      localStorage.removeItem('claimIntimationData');
    } else {
      console.error("Error sending email");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm">
        <Box
          sx={{
            boxShadow: 4,
            p: 4,
            mt: 4,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            transition: '0.3s',
            '&:hover': { boxShadow: 6 },
            borderRadius: 3,
            // backgroundImage: 'linear-gradient(to right, #ece9e6, #ffffff)',
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
            Claim Intimation Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {Object.keys(formData).map((key, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  {key.includes('date') ? (
                    <DatePicker
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      value={formData[key]}
                      onChange={(newValue) => handleDateChange(key, newValue)}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          required 
                          sx={{
                            backgroundColor: '#fff',
                            borderRadius: 1,
                            border: '1px solid #1976d2',
                          }}
                        />
                      )}
                      InputLabelProps={{ sx: { fontWeight: 'bold', color: '#393184' }}}
                    />
                  ) : (
                    <TextField
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      name={key}
                      fullWidth
                      required
                      value={formData[key]}
                      onChange={handleChange}
                      sx={{
                        backgroundColor: '#fff',
                        borderRadius: 1,
                        border: '1px solid #1976d2',
                      }}
                      InputLabelProps={{ sx: { fontWeight: 'bold', color: '#393184' }}}
                    />
                  )}
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  disabled={loading} // Disable button while loading
                  sx={{
                    backgroundColor: '#0d47a1',
                    '&:hover': { backgroundColor: '#0b3c8c' },
                    padding: '12px',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
                    position: 'relative', // For loader positioning
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ position: 'absolute', left: '50%', top: '50%', marginLeft: '-12px', marginTop: '-12px' }} />
                      <span style={{ visibility: 'hidden' }}>Submitting...</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Submitted successfully!
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
}

export default ClaimIntimation;
