// src/components/DeletedData.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import './DeletedData.css';

const DeletedData = () => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
    const [fileSelected, setFileSelected] = useState(false); // Track if a file is selected
    const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/deleted-data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setHeaders(jsonData.headers);
        setData(jsonData.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileSelected(true); // Set fileSelected to true when a file is selected
};

const handleFileUpload = async () => {
    if (!file) {
        alert('Please select a file.');
        return;
    }

    try {
        setUploading(true); // Set uploading to true when upload begins

        const formData = new FormData();
        formData.append('file', file);

        // Replace with your backend API endpoint
        const response = await fetch('http://localhost:5000/api/selfupload-file', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('File upload response:', responseData);
        alert('File uploaded successfully!');
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
    } finally {
        setFile(null); // Reset file state
        setFileSelected(false); // Reset fileSelected state
        setUploading(false); // Reset uploading state
    }
};

  const handleUpdateClick = (row) => {
    setSelectedRow(row);
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[`column_${index}`] = row[`column_${index}`];
    });
    setFormData(rowData);
    setDialogOpen(true);
  };

  const handleFileDownload = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/selfdownload-file');
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'deleted_data.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            throw new Error('Failed to download file');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};

  const handleDeleteClick = async (rowIndex) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete-row/${rowIndex}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete row');
        }
        setData((prevData) => prevData.filter((_, index) => index !== rowIndex));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const handleDialogSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/update-row/${selectedRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update row');
      }
      setData((prevData) =>
        prevData.map((row, index) =>
          index === selectedRow.id ? { ...row, ...formData } : row
        )
      );
      setDialogOpen(false);
      setSelectedRow(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateClick(params.row)}
          >
            Update
          </Button>
          
        </Box>
      ),
      width: 150,
    },
    ...headers.map((header, index) => ({
      field: `column_${index}`,
      headerName: header,
      width: 150,
    })),
  ];

  const rows = data.map((row, index) => {
    const rowData = { id: index };
    headers.forEach((header, cellIndex) => {
      rowData[`column_${cellIndex}`] = row[cellIndex];
    });
    return rowData;
  });

  return (
    <Box
      style={{
        width: '80vw',
        height: '100vh',
        overflowX: 'auto',
        overflowY: 'auto',
        padding: '20px',
      }}
    >
       <Box style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                        <input type="file" onChange={handleFileChange} />
                        <Button
                            onClick={handleFileUpload}
                            variant="contained"
                            color="primary"
                            disabled={!fileSelected || uploading}
                            style={{ marginLeft: '10px' }}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button
                            onClick={handleFileDownload}
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: '10px' }}
                        >
                            Download
                        </Button>
                    </Box>
      {rows.length > 0 ? (
        <DataGrid rows={rows} columns={columns} pageSize={10} />
        
      ) : (
        <Box
          style={{
            marginTop: '20px',
            textAlign: 'center',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          No data available
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Update Row</DialogTitle>
        <DialogContent>
          {headers.map((header, index) => (
            <TextField
              key={index}
              label={header}
              value={formData[`column_${index}`] || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [`column_${index}`]: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Save
          </Button>
          
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeletedData;
