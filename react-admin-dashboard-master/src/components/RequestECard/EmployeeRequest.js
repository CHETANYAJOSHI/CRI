import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

const EmployeeRequest = () => {
  const [employees, setEmployees] = useState([
    { id: "", name: "", tpaName: "" },
    { id: "", name: "", tpaName: "" },
  ]);
const [selectedAccount , setSelectedAccount] = useState(sessionStorage.getItem('selectedAccount'));
  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (index, field, value) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = value;
    setEmployees(newEmployees);
  };

  const handleAddEmployee = () => {
    setEmployees([...employees, { id: "", name: "", tpaName: "" }]);
  };

  const handleRemoveEmployee = (index) => {
    const newEmployees = employees.filter((_, i) => i !== index);
    setEmployees(newEmployees);
  };

  const handleSubmitRequest = async () => {
    console.log("Employees:", employees);  // Debugging employee data
    console.log("Selected Account:", selectedAccount);  // Debugging selected account
  
    try {
      const response = await fetch("http://localhost:5000/api/employeeRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employees, selectedAccount }),
      });
  
      if (response.ok) {
        console.log("Request Sent:", employees, selectedAccount);
        setOpenDialog(true);
      } else {
        console.error("Failed to send request. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const isFormValid = employees.every(
    (employee) => employee.id && employee.name && employee.tpaName
  );

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        Employee E-Card Request
      </Typography>

      {employees.map((employee, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            position: "relative",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Employee {index + 1}
          </Typography>

          <TextField
            label="Employee ID"
            fullWidth
            variant="outlined"
            value={employee.id}
            onChange={(e) => handleInputChange(index, "id", e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            label="Employee Name"
            fullWidth
            variant="outlined"
            value={employee.name}
            onChange={(e) => handleInputChange(index, "name", e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            label="TPA Name"
            fullWidth
            variant="outlined"
            value={employee.tpaName}
            onChange={(e) => handleInputChange(index, "tpaName", e.target.value)}
            sx={{ marginBottom: "10px" }}
          />

          {employees.length > 2 && (
            <IconButton
              onClick={() => handleRemoveEmployee(index)}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddEmployee}
        sx={{
          marginBottom: "20px",
          fontWeight: "bold",
          fontSize: "16px",
          textTransform: "none",
        }}
      >
        Add More Employee
      </Button>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        endIcon={<SendIcon />}
        onClick={handleSubmitRequest}
        disabled={!isFormValid}
        sx={{
          padding: "10px 0",
          fontWeight: "bold",
          fontSize: "16px",
          textTransform: "none",
          backgroundColor: "#007bff",
          "&:hover": {
            backgroundColor: "#0056b3",
          },
        }}
      >
        Send Request for E-Cards
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{"Request Sent"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your request for employee e-cards has been sent successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeRequest;
