import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  color: ${(props) => (props.success ? 'green' : 'red')};
  text-align: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff0000;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #cc0000;
  }
`;

const CreateAccount = () => {
  const [accountName, setAccountName] = useState('');
  const [networkHospitalLink, setNetworkHospitalLink] = useState('');
  const [networkHospitalFile, setNetworkHospitalFile] = useState(null);
  const [claimsFile, setClaimsFile] = useState(null);
  const [exclusionFile, setExclusionFile] = useState(null);
  const [checklistFile, setChecklistFile] = useState(null);
  const [liveDataFile, setLiveDataFile] = useState(null);
  const [cdStatementFile, setCdStatementFile] = useState(null);
  const [claimFormFile, setClaimFormFile] = useState(null);
  const [claimAnalysisFile, setClaimAnalysisFile] = useState(null);
  const [claimDumpFile, setClaimDumpFile] = useState(null);
  const [EndorsementFile, setEndorsementFile] = useState(null);
  const [selfParentFile, setselfParentFile] = useState(null);
  const [floaterParentFile, setfloaterParentFile] = useState(null);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [accountDetails, setAccountDetails] = useState({});

  const onFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      switch (name) {
        case 'networkHospitalFile':
          setNetworkHospitalFile(files[0]);
          break;
        case 'claimsFile':
          setClaimsFile(files[0]);
          break;
        case 'exclusionFile':
          setExclusionFile(files[0]);
          break;
        case 'checklistFile':
          setChecklistFile(files[0]);
          break;
        case 'liveDataFile':
          setLiveDataFile(files[0]);
          break;
          case 'cdStatementFile':
            setCdStatementFile(files[0]);
          break;
          case 'claimFormFile':
            setClaimFormFile(files[0]);
          break;
          case 'claimAnalysisFile':
            setClaimAnalysisFile(files[0]);
          break;
          case 'claimDumpFile':
            setClaimDumpFile(files[0]);
          break;
          case 'EndorsementFile':
            setEndorsementFile(files[0]);
          break;
          case 'selfParentFile':
            setselfParentFile(files[0]);
          break;
          case 'floaterParentFile':
            setfloaterParentFile(files[0]);
          break;
        default:
          break;
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('accountName', accountName);
    formData.append('networkHospitalLink', networkHospitalLink);
    formData.append('networkHospitalFile', networkHospitalFile);
    formData.append('claimsFile', claimsFile);
    formData.append('exclusionFile', exclusionFile);
    formData.append('checklistFile', checklistFile);
    formData.append('liveDataFile', liveDataFile);
    formData.append('cdStatementFile', cdStatementFile);
    formData.append('claimFormFile', claimFormFile);
    formData.append('claimAnalysisFile', claimAnalysisFile);
    formData.append('claimDumpFile', claimDumpFile);
    formData.append('EndorsementFile', EndorsementFile);
    formData.append('selfParentFile', selfParentFile);
    formData.append('floaterParentFile', floaterParentFile);

    try {
      const res = await axios.post('http://localhost:5000/api/createaccount', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAccountDetails(res.data.user);
      setMessage(res.data.message);
      setModalVisible(true); // Show modal on success
    } catch (err) {
      setMessage('File upload failed');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Create New Account</Title>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              type="text"
              id="accountName"
              name="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="networkHospitalLink">Network Hospital Link</Label>
            <Input
              type="text"
              id="networkHospitalLink"
              name="networkHospitalLink"
              value={networkHospitalLink}
              onChange={(e) => setNetworkHospitalLink(e.target.value)}
            />
          </FormGroup>
          {/* <FormGroup>
            <Label htmlFor="networkHospitalFile">Upload Network Hospital File</Label>
            <Input
              type="file"
              id="networkHospitalFile"
              name="networkHospitalFile"
              onChange={onFileChange}
            />
          </FormGroup> */}
          <FormGroup>
            <Label htmlFor="claimsFile">Upload Claims File</Label>
            <Input type="file" id="claimsFile" name="claimsFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="exclusionFile">Upload Exclusion File</Label>
            <Input type="file" id="exclusionFile" name="exclusionFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="checklistFile">Upload Checklist File</Label>
            <Input type="file" id="checklistFile" name="checklistFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="liveDataFile">Upload Live Data File</Label>
            <Input type="file" id="liveDataFile" name="liveDataFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="cdStatementFile">Upload cdStatementFile File</Label>
            <Input type="file" id="cdStatementFile" name="cdStatementFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="claimFormFile">Upload claimFormFile File</Label>
            <Input type="file" id="claimFormFile" name="claimFormFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="claimAnalysisFile">Upload claimAnalysisFile File</Label>
            <Input type="file" id="claimAnalysisFile" name="claimAnalysisFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="claimDumpFile">Upload claimDumpFile File</Label>
            <Input type="file" id="claimDumpFile" name="claimDumpFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="EndorsementFile">Upload EndorsementFile File</Label>
            <Input type="file" id="EndorsementFile" name="EndorsementFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="selfParentFile">Upload selfParentFile File</Label>
            <Input type="file" id="selfParentFile" name="selfParentFile" onChange={onFileChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="floaterParentFile">Upload floaterParentFile File</Label>
            <Input type="file" id="floaterParentFile" name="floaterParentFile" onChange={onFileChange} />
          </FormGroup>
          <Button type="submit">Upload</Button>
        </Form>
        {message && <Message>{message}</Message>}
      </FormWrapper>

      {/* Modal for displaying account details */}
      {modalVisible && (
        <Modal style={{height:'100vh' , overflow:'auto'}}>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>Close</CloseButton>
            <Title>Account Created Successfully</Title>
            <p><strong>Account Name:</strong> {accountDetails.accountName}</p>
            <p><strong>Network Hospital Link:</strong> {accountDetails.networkHospitalLink}</p>
            <p><strong>Network Hospital File:</strong> {accountDetails.networkHospitalFile}</p>
            <p><strong>Claims File:</strong> {accountDetails.claimsFile}</p>
            <p><strong>Exclusion File:</strong> {accountDetails.exclusionFile}</p>
            <p><strong>Checklist File:</strong> {accountDetails.checklistFile}</p>
            <p><strong>LiveData File:</strong> {accountDetails.liveDataFile}</p>
            <p><strong>cdStatementFile File:</strong> {accountDetails.cdStatementFile}</p>
            <p><strong>claimFormFile File:</strong> {accountDetails.claimFormFile}</p>
            <p><strong>claimAnalysisFile File:</strong> {accountDetails.claimAnalysisFile}</p>
            <p><strong>claimDumpFile File:</strong> {accountDetails.claimDumpFile}</p>
            <p><strong>EndorsementFile File:</strong> {accountDetails.EndorsementFile}</p>
            <p><strong>selfParentFile File:</strong> {accountDetails.selfParentFile}</p>
            <p><strong>floaterParentFile File:</strong> {accountDetails.floaterParentFile}</p>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CreateAccount;
