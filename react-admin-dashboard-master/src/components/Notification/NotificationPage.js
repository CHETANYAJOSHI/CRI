import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, FormControl, Select, MenuItem, Button } from "@mui/material";
import Notifications from "@mui/icons-material/Notifications";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [notification1,setNotifications1] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    FilefetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications");
      const data = await response.json();

      if (response.ok) {
        setNotifications(data);
        console.log(data)
      } else {
        console.error("Failed to fetch notifications", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const FilefetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fileNotification');
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setNotifications1(data)
      console.log(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].status = newStatus;
    setNotifications(updatedNotifications);
  };

  const handleSubmitStatus = async (account, updatedStatus) => {
    try {
      const response = await fetch("http://localhost:5000/api/updatenotifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account , status: updatedStatus }),
      });

      if (response.ok) {
        console.log("Status updated successfully");
        // Refresh notifications after the update
        fetchNotifications();
      } else {
        const errorData = await response.json();
        console.error("Failed to update status:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (notifications.length === 0) {
    return <Typography>No notifications available</Typography>;
  }

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
        Notifications
      </Typography>
      <List>
        {notifications.map((notification, index) => (
          <ListItem
            key={notification._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: index % 2 === 0 ? "#f0f8ff" : "#e6e6fa",
              borderRadius: "8px",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: "bold", color: "#333" }}>
                  {notification.AccountName}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {`HR Name: ${notification.hrName} | TPA Name: ${notification.tpaName} | Email: ${notification.emailId} | Description: ${notification.description} | Status: ${notification.status} | Created At: ${new Date(notification.createdAt).toLocaleString()}`}
                </Typography>
              }
              sx={{ marginRight: "10px" }}
            />

            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <Select
                value={notification.status}
                onChange={(e) => handleStatusChange(index, e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmitStatus(notification.account, notification.status)}
              sx={{ marginLeft: "10px" }}
            >
              Submit
            </Button>
          </ListItem>
        ))}

{notification1.map((notification, index) => (
          <ListItem
            key={notification._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: index % 2 === 0 ? "#f0f8ff" : "#e6e6fa",
              borderRadius: "8px",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <ListItemText
              // primary={
              //   <Typography sx={{ fontWeight: "bold", color: "#333" }}>
              //     {notification.AccountName}
              //   </Typography>
              // }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {`${notification.message}`}
                </Typography>
              }
              sx={{ marginRight: "10px" }}
            />
{/* 
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <Select
                value={notification.status}
                onChange={(e) => handleStatusChange(index, e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmitStatus(notification.account, notification.status)}
              sx={{ marginLeft: "10px" }}
            >
              Submit
            </Button> */}
          </ListItem>
        ))}
        
      </List>
    </Box>
  );
};

export default NotificationPage;
