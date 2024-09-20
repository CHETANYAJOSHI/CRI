import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Divider } from '@mui/material';

export default function EmployeeNotification() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employeeRequests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        } else {
          console.error('Failed to fetch employee requests');
          setError('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching employee requests:', error);
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeRequests();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (requests.length === 0) {
    return <Typography>No employee notifications available</Typography>;
  }

  // Group requests by account
  const groupedRequests = requests.reduce((acc, request) => {
    if (!acc[request.account]) {
      acc[request.account] = [];
    }
    acc[request.account].push(request);
    return acc;
  }, {});

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
      <Typography variant="h4" align="center" gutterBottom>
        Employee Notifications
      </Typography>

      {Object.keys(groupedRequests).map((account, accountIndex) => (
        <Box key={accountIndex} sx={{ marginBottom: "20px", border: "1px solid black", borderRadius: "8px", padding: "10px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            {account}
          </Typography>
          <List>
            {groupedRequests[account].map((request, requestIndex) => (
              <div key={requestIndex}>
                {request.employees.length > 0 ? (
                  request.employees.map((employee, employeeIndex) => (
                    <ListItem
                      key={employee.id || employeeIndex}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: employeeIndex % 2 === 0 ? "#f0f8ff" : "#e6e6fa",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        padding: "10px",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: "bold", color: "#333" }}>
                            {employee.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            TPA Name: {employee.tpaName}<br />
                            ID: {employee.id}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No employees listed</Typography>
                )}
                <Divider />
              </div>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}
