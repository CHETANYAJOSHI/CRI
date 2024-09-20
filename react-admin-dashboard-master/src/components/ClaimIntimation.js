import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';  // Correct import

function CalimIntimation() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your submit logic here
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Box sx={{ boxShadow: 3, p: 3, mt: 4, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h4" gutterBottom className="text-center">
            Claim Intimation Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Patient Name"
                  name="patientName"
                  fullWidth
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee Name"
                  name="employeeName"
                  fullWidth
                  required
                  value={formData.employeeName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Corporate Name"
                  name="corporateName"
                  fullWidth
                  required
                  value={formData.corporateName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hospital Name"
                  name="hospitalName"
                  fullWidth
                  required
                  value={formData.hospitalName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date of Admission"
                  value={formData.dateOfAdmission}
                  onChange={(newValue) => handleDateChange('dateOfAdmission', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date of Discharge"
                  value={formData.dateOfDischarge}
                  onChange={(newValue) => handleDateChange('dateOfDischarge', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expected Claim Amount"
                  name="expectedClaimAmount"
                  fullWidth
                  required
                  value={formData.expectedClaimAmount}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee Code"
                  name="employeeCode"
                  fullWidth
                  required
                  value={formData.employeeCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client ID"
                  name="clientId"
                  fullWidth
                  required
                  value={formData.clientId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Member ID"
                  name="memberId"
                  fullWidth
                  required
                  value={formData.memberId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Policy No"
                  name="policyNo"
                  fullWidth
                  required
                  value={formData.policyNo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact No"
                  name="contactNo"
                  fullWidth
                  required
                  value={formData.contactNo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email ID"
                  name="emailId"
                  fullWidth
                  required
                  value={formData.emailId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default CalimIntimation;
