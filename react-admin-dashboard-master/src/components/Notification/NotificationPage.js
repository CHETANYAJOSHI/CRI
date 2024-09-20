import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, FormControl, Select, MenuItem, Button } from "@mui/material";
import './Notification.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [employeeRequests, setEmployeeRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        let accountData = [];
        let fileData = [];
        

        // Fetch account notifications
        try {
          const accountResponse = await fetch("http://localhost:5000/api/notifications");
          if (accountResponse.ok) {
            accountData = await accountResponse.json();
          } else {
            console.error("Failed to fetch account notifications");
          }
        } catch (error) {
          console.error("Error fetching account notifications:", error);
        }
  
        // Fetch file notifications
        try {
          const fileResponse = await fetch("http://localhost:5000/api/fileNotification");
          if (fileResponse.ok) {
            fileData = await fileResponse.json();
          } else {
            console.error("Failed to fetch file notifications");
          }
        } catch (error) {
          console.error("Error fetching file notifications:", error);
        }

        // Fetch employee requests
        
  
        // Merge account and file notifications
        const mergedNotifications = [
          ...accountData.map((notification) => ({
            ...notification,
            type: "Account Notification",
            createdAt: notification.createdAt || notification.createAt,
          })),
          ...fileData.map((notification) => ({
            ...notification,
            type: "File Notification",
            createdAt: notification.createdAt || notification.createAt,
          })),
          
        ];
  
        // Sort the merged array by `createdAt` in descending order (most recent first)
        mergedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setNotifications(mergedNotifications);
        
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllNotifications();
  }, []);

  const handleStatusChange = (index, newStatus) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].status = newStatus;
    setNotifications(updatedNotifications);
  };

  const handleSubmitStatus = async (_id, updatedStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/updatenotifications/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (response.ok) {
        console.log("Status updated successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to update status:", errorData);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const markAsRead = async (id, type) => {
    try {
      const apiUrl = type === "Account Notification"
        ? `http://localhost:5000/api/notifications/markAsRead/${id}`
        : `http://localhost:5000/api/fileNotification/markAsRead/${id}`; // Fixed URL

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedNotifications = notifications.map(notification =>
          notification._id === id ? { ...notification, isRead: true } : notification
        );
        setNotifications(updatedNotifications);
        console.log("Notification marked as read");
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (notifications.length === 0 && employeeRequests.length === 0) {
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
            key={notification._id || index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: index % 2 === 0 ? "#f0f8ff" : "#e6e6fa",
              borderRadius: "8px",
              marginBottom: "10px",
              padding: "10px",
              position: "relative",
            }}
            onClick={() => markAsRead(notification._id, notification.type)}
          >
            {!notification.isRead && (
              <div
                className="notification-dot"
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  top: "10px",
                  right: "10px",
                }}
              />
            )}

            <ListItemText
              primary={
                <Typography sx={{ fontWeight: "bold", color: "#333" }}>
                  {notification.AccountName || notification.type}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  {notification.description || notification.message || "No description available"}<br /><br />
                  <div style={{ color: 'green', fontWeight: 'bold' }}>
                    {notification.createdAt || notification.createAt}
                  </div>
                </Typography>
              }
              sx={{ marginRight: "10px" }}
            />

            {notification.status && (
              <>
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
                  onClick={() => handleSubmitStatus(notification._id, notification.status)}
                  sx={{ marginLeft: "10px" }}
                >
                  Submit
                </Button>
              </>
            )}
          </ListItem>
        ))}
        
      </List>
    </Box>
  );
};

export default NotificationPage;
