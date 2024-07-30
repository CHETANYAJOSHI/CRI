import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

const DropdownWrapper = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: auto;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Option = styled.option``;

const Invoices = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accountId = searchParams.get('accountId');
    if (accountId) {
      setSelectedAccount(accountId);
      fetchLiveDataFile(accountId);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/accounts');
        setAccounts(res.data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };

    fetchAccounts();
  }, []);

  const fetchLiveDataFile = async (accountId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/account/${accountId}/live-data-file`);
      if (!response.ok) {
        throw new Error('Failed to fetch live data file');
      }
      const jsonData = await response.json();
      setHeaders(jsonData.headers);
      setData(jsonData.data);
      // console.log(data);
    } catch (error) {
      console.error('Error fetching live data file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const accountId = e.target.value;
    setSelectedAccount(accountId);
    if (accountId) {
      navigate(`/enrollment/live?accountId=${accountId}`);
      fetchLiveDataFile(accountId);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (row) => {
    setEditRow(row);
    setEditData(headers.reduce((obj, header, index) => {
      obj[header] = row[`column_${index}`];
      return obj;
    }, {}));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      // Perform PUT request to update the row
      await axios.put(`http://localhost:5000/api/account/${selectedAccount}/update-row`, {
        rowId: editRow.id, // Send the row ID to the server
        updatedData: editData,
      });
      
  
      // Refresh the data after saving
      fetchLiveDataFile(selectedAccount);
    } catch (error) {
      console.error('Error updating row:', error);
      console.log(editData)
    } finally {
      setEditRow(null);
    }
  };

  const filteredData = data.filter((row) =>
    headers.some((header) =>
      row[header]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon color="info" />
          </IconButton>
        </Box>
      ),
      width: 100,
    },
    ...headers.map((header, index) => ({
      field: `column_${index}`,
      headerName: header,
      width: 150,
    })),
  ];

  const rows = filteredData.map((row, index) => {
    const rowData = { id: index };
    headers.forEach((header, cellIndex) => {
      rowData[`column_${cellIndex}`] = row[header];
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
        margin: 'auto',
        flexDirection: 'row',
      }}
    >
      <DropdownWrapper style={{ width: '10%', display: 'flex', margin: '0px', alignItems: 'center', gap: '5px', padding: '5px' }}>
        <Label htmlFor="account-select">Account</Label>
        <Select
          id="account-select"
          value={selectedAccount}
          onChange={handleSelectChange}
        >
          <Option value="">--Select an Account--</Option>
          {accounts.map((account) => (
            <Option key={account._id} value={account._id}>
              {account.accountName}
            </Option>
          ))}
        </Select>
      </DropdownWrapper>

      {loading ? (
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
      ) : (
        <>
          {rows.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              pagination
              autoHeight
            />
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
        </>
      )}

      <Dialog open={editRow !== null} onClose={() => setEditRow(null)}>
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          {headers.map((header, index) => (
            <TextField
              key={index}
              margin="dense"
              label={header}
              type="text"
              fullWidth
              name={header}
              value={editData[header] || ''}
              onChange={handleEditChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRow(null)}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;
