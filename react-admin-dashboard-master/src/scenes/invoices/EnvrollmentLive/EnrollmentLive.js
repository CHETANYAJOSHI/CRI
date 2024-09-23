import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../../components/Header';
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
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import './Envrollment.css';
import { textAlign } from '@mui/system';

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
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({});
  const [totalPremium , setTotalPremium] = useState(0);
  const [activeLive , setactiveLive] = useState(0);
  const [cdBalance , setCDBalance] = useState(0);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  

  useEffect(() => {
    const accountId = searchParams.get('accountId');
    if (accountId) {
      setSelectedAccount(accountId);
      fetchLiveDataFile(accountId);
      fetchData(accountId);
    }
  }, [searchParams]);



    // Fetch live data file when component mounts
    const fetchData = async (accountId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/account/${accountId}/live-data-specificedata`);
        
        setactiveLive(response.data.data[0]['Active live']);
        setTotalPremium(response.data.data[0]['Total Preimium']);
        setCDBalance(response.data.data[0]['CD Balance'])
        setLoading(false);
      } catch (err) {
        console.log('Failed to fetch data');
        setLoading(false);
      }
    };

 

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
      const response = await axios.get(`http://localhost:5000/api/account/${accountId}/live-data-file`);
      setHeaders(response.data.headers);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching live data file:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSelectChange = (e) => {
  //   const accountId = e.target.value;
  //   setSelectedAccount(accountId);
  //   if (accountId) {
  //     navigate(`/enrollment/SelfLive?accountId=${accountId}`);
  //     fetchLiveDataFile(accountId); 
  //   }
  // };

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
      await axios.put(`http://localhost:5000/api/account/${selectedAccount}/update-row`, {
        rowId: editRow.id,
        updatedData: editData,
      });
      fetchLiveDataFile(selectedAccount);
    } catch (error) {
      console.error('Error updating row:', error);
    } finally {
      setEditRow(null);
    }
  };

  const handleDownloadClick = async () => {
    if (!selectedAccount) {
      alert('Please select an account first.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/account/${selectedAccount}/download-file`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadClick = async () => {
    if (!file || !selectedAccount) {
      alert('Please select a file and an account first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:5000/api/account/${selectedAccount}/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      fetchLiveDataFile(selectedAccount); // Refresh data
    } catch (error) {
      console.error('Error uploading file:', error);
      console.log(file);
      console.log(formData.append('file', file))
    }
  };
  const handleAddUserClick = () => {
    setOpenAddUserDialog(true);
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddUserSave = async () => {
    try {
      await axios.post(`http://localhost:5000/api/account/${selectedAccount}/add-live-data-row`, {
        newRowData: newUserData,
      });
      fetchLiveDataFile(selectedAccount);
    } catch (error) {
      console.error('Error adding new row:', error);
    } finally {
      setOpenAddUserDialog(false);
      setNewUserData({});
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

    const selectedAccountName = accounts.find(account => account._id === selectedAccount)?.accountName || '';
    const role = sessionStorage.getItem('role');

  return (

    <Box mt="20px" style={{textAlign:'center'}}>
      <Header title={` ${selectedAccountName}`}/>



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


      <div className="Detailsm">

          <div className="totalPremium">
            <p>Total Premium</p>
            <p>Rs. {totalPremium}</p>
          </div>

          <div className="totalPremium">
            <p>Total Life</p>
            <p>{activeLive}</p>
          </div>

          <div className="totalPremium">
            <p>CD Balance</p>
            <p>{cdBalance}</p>
          </div>

     



      {/* <DropdownWrapper style={{ width: '100%', display: 'flex', margin: '0px', alignItems: 'center', gap: '5px', padding: '5px' }}>
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
      </DropdownWrapper> */}

      </div>

      <Box style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadClick}
          startIcon={<DownloadIcon />}
          style={{height:'50%'}}
        >
          Download
        </Button>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-input"
        />


{role !== 'HR' && ( 
        <Button
          variant="contained"
          color="secondary"
          onClick={() => document.getElementById('file-input').click()}
          startIcon={<UploadIcon />}
          style={{ marginLeft: '10px' , height:'50%'}}
        >
          Upload
        </Button>
)}


    {role !== 'HR' && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUploadClick}
          style={{ marginLeft: '10px' , height:'50%'}}
          startIcon={<UploadIcon />}
        >
          Submit File
        </Button>
         )}
        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleAddUserClick}
          startIcon={<AddIcon />}
          style={{ marginLeft: '10px' , background:'rgb(57, 49, 132)' , height:'50%'}}
        >
          Add User
        </Button> */}
        <TextField
          label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          style={{ marginLeft: '10px' }}
        />
      </Box>

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
              pagination
              style={{
                backgroundColor: 'white',
                color: 'black',
                height: '80vh',
                width: '80vw',
                borderRadius: '10px',
                overflowX: 'auto',
                overflowY: 'auto',
                display: 'flex',
              }}
            />
          ) : (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize:'25px'
              }}
            >
               Select Your Account
            </Box>
          )}
        </>
      )}

      <Dialog open={Boolean(editRow)} onClose={() => setEditRow(null)}>
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

      <Dialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          {headers.map((header, index) => (
            <TextField
              key={index}
              label={header}
              name={header}
              value={newUserData[header] || ''}
              onChange={handleAddUserChange}
              fullWidth
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUserDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddUserSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>

    </Box>
  );
};

export default Invoices;
