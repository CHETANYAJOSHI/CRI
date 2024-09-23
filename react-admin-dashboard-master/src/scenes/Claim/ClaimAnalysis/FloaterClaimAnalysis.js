import React, { useState  , useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
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
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import Header from '../../../components/Header';

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

const FloaterClaimAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

 // Replace with the actual account ID


  useEffect(() => {
    const accountId = searchParams.get('accountId');
    if (accountId) {
      setSelectedAccount(accountId);
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

  const handleSelectChange = (e) => {
    const accountId = e.target.value;
    setSelectedAccount(accountId);
    if (accountId) {
      navigate(`/claim/Floaterclaimanalysis?accountId=${accountId}`);
      setSelectedAccount(accountId);
    //   fetchLiveDataFile(accountId);
    }
    
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`http://localhost:5000/api/claim-floater-analysis/upload/${selectedAccount}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  // const fetchPdf = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/claim-self-analysis/${selectedAccount}`, {
  //       responseType: 'blob',
  //     });
  //     const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  //     setPdfUrl(url);
  //   } catch (error) {
  //     console.error('Error fetching PDF:', error);
  //     setError('Failed to fetch PDF file');
  //   }
  // };

  const downloadPdf = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/claim-floater-analysis/download/${selectedAccount}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'claimFloaterAnalysis.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const loadPdfViewer = () => {
    document.getElementById('pdfViewer').src = `http://localhost:5000/api/claim-floater-analysis/${selectedAccount}`;
};

useEffect(() => {
  loadPdfViewer();
});

const selectedAccountName = accounts.find(account => account._id === selectedAccount)?.accountName || '';
const role = sessionStorage.getItem('role');

  return (
    <Box mt="20px" style={{textAlign:'center'}}>
      <Header title={` ${selectedAccountName}`}/>



        {/* <DropdownWrapper style={{ width: '10%', display: 'flex', margin: '0px', alignItems: 'center', gap: '5px', padding: '5px' }}>
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


      <Box style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadPdf}
          startIcon={<DownloadIcon />}
          style={{ marginRight: '10px' , height:'50%'}}
        >
          Download File
        </Button>
        <input
          accept=".xlsx"
          id="upload-file"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="upload-file">
        {role !== 'HR' && (
          <Button
            variant="contained"
           color="secondary"
            component="span"
            startIcon={<UploadIcon />}
            style={{ marginRight: '10px'}}
            
          >
            Upload File
          </Button>
           )}
        </label>
        {role !== 'HR' && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          startIcon={<UploadIcon />}
          style={{ height:'50%'}}
        >
          Submit Upload
        </Button>
        )}

      </Box>


            <iframe
                id="pdfViewer"
                style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
                title="PDF Viewer"
            ></iframe>
          
      
    </Box>
  );
};

export default FloaterClaimAnalysis;
