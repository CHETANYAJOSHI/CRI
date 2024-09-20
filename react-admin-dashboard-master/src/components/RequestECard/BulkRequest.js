import React, { useState } from "react";
import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const BulkRequest = () => {
  const [requestDetails, setRequestDetails] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(localStorage.getItem("selectedAccount") || "");
  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (event) => {
    setRequestDetails(event.target.value);
  };

  

  const handleSendRequest = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bulkRequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestDetails,
          selectedAccount,
        }),
      });

      if (response.ok) {
        setOpenDialog(true);
        setRequestDetails(""); // Clear the input after sending the request
      } else {
        console.error("Failed to send bulk request" , response);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
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
        Bulk E-Card Request to Admin
      </Typography>
      <TextField
        label="Enter Request Details"
        placeholder="Describe your bulk request here..."
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={requestDetails}
        onChange={handleInputChange}
        sx={{
          marginBottom: "20px",
        }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        endIcon={<SendIcon />}
        onClick={handleSendRequest}
        disabled={!requestDetails.trim()} // Disable button if input is empty
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
        Send Request to Admin
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{"Request Sent"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your bulk request has been sent to the admin successfully!
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

export default BulkRequest;
