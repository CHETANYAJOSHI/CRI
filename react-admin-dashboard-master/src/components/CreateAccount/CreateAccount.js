// frontend/src/components/CreateAccount.js

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

const CreateAccount = () => {
  const [accountName, setAccountName] = useState('');
  const [networkHospitalLink, setNetworkHospitalLink] = useState('');
  const [networkHospitalFile, setNetworkHospitalFile] = useState(null);
  const [claimsFile, setClaimsFile] = useState(null);
  const [exclusionFile, setExclusionFile] = useState(null);
  const [checklistFile, setChecklistFile] = useState(null);
  const [message, setMessage] = useState('');

  const onFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'networkHospitalFile') {
      setNetworkHospitalFile(files[0]);
    } else if (name === 'claimsFile') {
      setClaimsFile(files[0]);
    } else if (name === 'exclusionFile') {
      setExclusionFile(files[0]);
    } else if (name === 'checklistFile') {
      setChecklistFile(files[0]);
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

    try {
      const res = await axios.post('http://localhost:5000/api/createaccount', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage('File upload failed');
    }
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
          <FormGroup>
            <Label htmlFor="networkHospitalFile">Upload Network Hospital File</Label>
            <Input
              type="file"
              id="networkHospitalFile"
              name="networkHospitalFile"
              onChange={onFileChange}
            />
          </FormGroup>
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
          <Button type="submit">Upload</Button>
        </Form>
        {message && <Message>{message}</Message>}
      </FormWrapper>
    </Container>
  );
};

export default CreateAccount;
