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

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
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
  const [hrName, sethrName] = useState('');
  const [hrEmail, sethrEmail] = useState('');
  const [hrNumber, sethrNumber] = useState('');
  const [TPAName, setTPA] = useState('');
  const [InsuranceName, setInsuranceName] = useState('');
  const [networkHospitalLink, setNetworkHospitalLink] = useState('');
  const [cdStatementFile, setcdStatementFile] = useState(null);
  const [claimSelfAnalysisFile, setclaimSelfAnalysisFile] = useState(null);
  const [claimFloaterAnalysisFile, setclaimFloaterAnalysisFile] = useState(null);
  const [claimDumpSelfFile, setclaimDumpSelfFile] = useState(null);
  const [claimDumpFloaterFile, setclaimDumpFloaterFile] = useState(null);
  const [liveDataSelfFile, setliveDataSelfFile] = useState(null);
  const [liveDataFloaterFile, setliveDataFloaterFile] = useState(null);
  // const [endrosementAdditionFile, setendrosementAdditionFile] = useState(null);
  // const [endrosementDeletionFile, setendrosementDeletionFile] = useState(null);
  const [claimABFile, setclaimABFile] = useState(null);
  const [rackRatesFile, setrackRatesFile] = useState(null);
  const [checkListFile, setcheckListFile] = useState(null);
  const [exclusionListFile, setexclusionListFile] = useState(null);
  // const [deletionDataSelfFile, setdeletionDataSelfFile] = useState(null);
  const [additionDataFile, setadditionDataFile] = useState(null);
  // const [additionDataSelfFile, setadditionDataSelfFile] = useState(null);
  const [deletionDataFile, setdeletionDataFile] = useState(null);
  const [policyCoverageSelfFile, setpolicyCoverageSelfFile] = useState(null);
  const [policyCoverageFloaterFile, setpolicyCoverageFloaterFile] = useState(null);
  // const [hrMobile, setHrMobile] = useState('');
  // const [hrEmail, setHrEmail] = useState('');
  // const [hrName, setHrName] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [accountDetails, setAccountDetails] = useState({});
  

  const onFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      switch (name) {
        case 'cdStatementFile':
          setcdStatementFile(files[0]);
          break;
        case 'claimSelfAnalysisFile':
          setclaimSelfAnalysisFile(files[0]);
          break;
        case 'claimFloaterAnalysisFile':
          setclaimFloaterAnalysisFile(files[0]);
          break;
        case 'claimDumpSelfFile':
          setclaimDumpSelfFile(files[0]);
          break;
        case 'claimDumpFloaterFile':
          setclaimDumpFloaterFile(files[0]);
          break;
        case 'liveDataSelfFile':
          setliveDataSelfFile(files[0]);
          break;
        case 'liveDataFloaterFile':
          setliveDataFloaterFile(files[0]);
          break;
        // case 'endrosementAdditionFile':
        //   setendrosementAdditionFile(files[0]);
        //   break;
        // case 'endrosementDeletionFile':
        //   setendrosementDeletionFile(files[0]);
        //   break;
        case 'claimABFile':
          setclaimABFile(files[0]);
          break;
          case 'rackRatesFile':
          setrackRatesFile(files[0]);
          break;
        case 'checkListFile':
          setcheckListFile(files[0]);
          break;
          case 'exclusionListFile':
          setexclusionListFile(files[0]);
          break;
          // case 'deletionDataSelfFile':
          // setdeletionDataSelfFile(files[0]);
          // break;
          case 'additionDataFile':
          setadditionDataFile(files[0]);
          break;
          // case 'additionDataSelfFile':
          // setadditionDataSelfFile(files[0]);
          // break;
          case 'deletionDataFile':
          setdeletionDataFile(files[0]);
          break;
          case 'policyCoverageSelfFile':
          setpolicyCoverageSelfFile(files[0]);
          break;
          case 'policyCoverageFloaterFile':
          setpolicyCoverageFloaterFile(files[0]);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('accountName', accountName);
    formData.append('hrName', hrName);
    formData.append('hrEmail', hrEmail);
    formData.append('hrNumber', hrNumber);
    formData.append('TPAName', TPAName);
    formData.append('InsuranceName', InsuranceName);
    formData.append('networkHospitalLink', networkHospitalLink);
  if (cdStatementFile) formData.append('cdStatementFile', cdStatementFile);
  if (claimSelfAnalysisFile) formData.append('claimSelfAnalysisFile', claimSelfAnalysisFile);
  if (claimFloaterAnalysisFile) formData.append('claimFloaterAnalysisFile', claimFloaterAnalysisFile);
  if (claimDumpSelfFile) formData.append('claimDumpSelfFile', claimDumpSelfFile);
  if (claimDumpFloaterFile) formData.append('claimDumpFloaterFile', claimDumpFloaterFile);
  if (liveDataSelfFile) formData.append('liveDataSelfFile', liveDataSelfFile);
  if (liveDataFloaterFile) formData.append('liveDataFloaterFile', liveDataFloaterFile);
  if (claimABFile) formData.append('claimABFile', claimABFile);
  if (rackRatesFile) formData.append('rackRatesFile', rackRatesFile);
  if (checkListFile) formData.append('checkListFile', checkListFile);
  if (exclusionListFile) formData.append('exclusionListFile', exclusionListFile);
  if (additionDataFile) formData.append('additionDataFile', additionDataFile);
  if (deletionDataFile) formData.append('deletionDataFile', deletionDataFile);
  if (policyCoverageSelfFile) formData.append('policyCoverageSelfFile', policyCoverageSelfFile);
  if (policyCoverageFloaterFile) formData.append('policyCoverageFloaterFile', policyCoverageFloaterFile);
    // formData.append('hrMobile', hrMobile);
    // formData.append('hrEmail', hrEmail);
    // formData.append('hrName', hrName);
   

    try {
      const response = await axios.post('http://localhost:5000/api/createaccount', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setAccountDetails(response.data.user);
      console.log(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      setMessage('Error creating account. Please try again.');
    }
  };

  return (
    <Container style={{alignItems:'normal' , gap:'15px'}}>
      <FormWrapper style={{maxWidth:'500px'}}>
        <Title>Create Account</Title>

        <Form onSubmit={handleSubmit} className="d-flex">
            
          <FormGroup>
            <Label>Corporate Name:</Label>
            <Input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              
            />
          </FormGroup>

          <FormGroup>
            <Label>HR Name:</Label>
            <Input
              type="text"
              value={hrName}
              onChange={(e) => sethrName(e.target.value)}
              
            />
          </FormGroup>

          <FormGroup>
            <Label>HR Email:</Label>
            <Input
              type="text"
              value={hrEmail}
              onChange={(e) => sethrEmail(e.target.value)}
              
            />
          </FormGroup>

          <FormGroup>
            <Label>HR Number:</Label>
            <Input
              type="text"
              value={hrNumber}
              onChange={(e) => sethrNumber(e.target.value)}
              
            />
          </FormGroup>

        

        

          <FormGroup>
            <Label>TPA Name:</Label>
            <Input
              type="text"
              value={TPAName}
              onChange={(e) => setTPA(e.target.value)}
              
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Insurance Company Name:</Label>
            <Input
              type="text"
              value={InsuranceName}
              onChange={(e) => setInsuranceName(e.target.value)}
              
            />
          </FormGroup>

          <FormGroup>
            <Label>Network Hospital Link</Label>
            <Input
              type="text"
              value={networkHospitalLink}
              onChange={(e) => setNetworkHospitalLink(e.target.value)}
              
            />
          </FormGroup>
          <FormGroup>
            <Label>CD Statement File</Label>
            <Input type="file" name="cdStatementFile" onChange={onFileChange} accept=".pdf"  />
          </FormGroup>
          {/* <FormGroup>
            <Label>Self with Parents Claim Analysis File</Label>
            <Input type="file" name="claimSelfAnalysisFile" onChange={onFileChange}  accept=".pdf"  />
          </FormGroup> */}
          <FormGroup>
            <Label>Floater with Parents Claim Analysis File</Label>
            <Input type="file" name="claimFloaterAnalysisFile" onChange={onFileChange}  accept=".pdf"  />
          </FormGroup>
          {/* <FormGroup>
            <Label>Self with Parents Claim Dump File</Label>
            <Input type="file" name="claimDumpSelfFile" onChange={onFileChange}  accept=".xlsx"  />
          </FormGroup> */}
          <FormGroup>
            <Label>Floater with Parents Claim Dump File</Label>
            <Input type="file" name="claimDumpFloaterFile" onChange={onFileChange} accept=".xlsx"  />
          </FormGroup>
          {/* <FormGroup>
            <Label>Self with Parents Live Data File</Label>
            <Input type="file" name="liveDataSelfFile" onChange={onFileChange} accept=".xlsx"  />
          </FormGroup> */}
          <FormGroup>
            <Label>Floater with Parents Live Data File</Label>
            <Input type="file" name="liveDataFloaterFile" onChange={onFileChange} accept=".xlsx"  />
          </FormGroup>
          {/* <FormGroup>
            <Label>Self with Parents Endorsement</Label>
            <Input type="file" name="endrosementAdditionFile" onChange={onFileChange} accept=".xlsx"  />
          </FormGroup>
          <FormGroup>
            <Label>Floater with Parents Endorsement File</Label>
            <Input type="file" name="endrosementDeletionFile"  onChange={onFileChange} accept=".xlsx"  />
          </FormGroup> */}
          <FormGroup>
            <Label>Claim A & B Form</Label>
            <Input type="file" name="claimABFile" onChange={onFileChange} accept=".pdf"  />
          </FormGroup>
          <FormGroup>
            <Label>Rack-Rates File</Label>
            <Input type="file" name="rackRatesFile" onChange={onFileChange} accept=".pdf"  />
          </FormGroup>
          <FormGroup>
            <Label>checkListFile File</Label>
            <Input type="file" name="checkListFile" onChange={onFileChange} accept=".pdf"  />
          </FormGroup>
          <FormGroup>
            <Label>Exclusion List File</Label>
            <Input type="file" name="exclusionListFile" onChange={onFileChange} accept=".pdf"  />
          </FormGroup>
          {/* <FormGroup>
            <Label>Self with Parents Deletion File</Label>
            <Input type="file" name="deletionDataSelfFile" onChange={onFileChange} accept=".xlsx"  />
          </FormGroup> */}
          <FormGroup>
            <Label>Endorsement Addition File</Label>
            <Input type="file" name="additionDataFile" onChange={onFileChange} accept=".xlsx"  />
          </FormGroup>
          {/* <FormGroup>
            <Label>Self with Parents Addition File</Label>
            <Input type="file" name="additionDataSelfFile" onChange={onFileChange} accept=".xlsx"  />
          </FormGroup> */}
          <FormGroup>
            <Label>Endorsement Deletion File</Label>
            <Input type="file" name="deletionDataFile" onChange={onFileChange} accept=".xlsx"  />
          </FormGroup>
          {/* <FormGroup>
            <Label>Self with Parents Policy Coverage</Label>
            <Input type="file" name="policyCoverageSelfFile" onChange={onFileChange} accept=".pdf"  />
          </FormGroup> */}
          <FormGroup>
            <Label>Floater with Parents Policy Coverage</Label>
            <Input type="file" name="policyCoverageFloaterFile" onChange={onFileChange} accept=".pdf"  />
          </FormGroup>
          <Button type="submit">Create Account</Button>
         
        </Form>

        
        {message && <Message>{message}</Message>}
        {modalVisible && (
          <Modal >
            <ModalContent style={{height:'90vh' , overflow:'scroll'}}>
              <CloseButton onClick={() => setModalVisible(false)}>Close</CloseButton>
              <h3>Account Created</h3>
              <p><strong>Account Name:</strong> {accountDetails.accountName}</p>
              <p><strong>Network Hospital Link :</strong> {accountDetails.networkHospitalLink}</p>
              <p><strong>cdStatementFile :</strong> {accountDetails.cdStatementFile}</p>
              <p><strong>claimSelfAnalysisFile :</strong> {accountDetails.claimSelfAnalysisFile}</p>
              <p><strong>claimFloaterAnalysisFile :</strong> {accountDetails.claimFloaterAnalysisFile}</p>
              <p><strong>claimDumpSelfFile :</strong> {accountDetails.claimDumpSelfFile}</p>
              <p><strong>claimDumpFloaterFile :</strong> {accountDetails.claimDumpFloaterFile}</p>
              <p><strong>liveDataSelfFile :</strong> {accountDetails.liveDataSelfFile}</p>
              <p><strong>liveDataFloaterFile :</strong> {accountDetails.liveDataFloaterFile}</p>
              {/* <p><strong>endrosementAdditionFile :</strong> {accountDetails.endrosementAdditionFile}</p>
              <p><strong>endrosementDeletionFile :</strong> {accountDetails.endrosementDeletionFile}</p> */}
              <p><strong>claimABFile :</strong> {accountDetails.claimABFile}</p>
              <p><strong>Rack-RatesFile :</strong> {accountDetails.rackRatesFile}</p>
              <p><strong>checkListFile :</strong> {accountDetails.checkListFile}</p>
              <p><strong>exclusionListFile :</strong> {accountDetails.exclusionListFile}</p>
              {/* <p><strong>deletionDataSelfFile :</strong> {accountDetails.deletionDataSelfFile}</p> */}
              <p><strong>additionDataFile :</strong> {accountDetails.additionDataFile}</p>
              {/* <p><strong>additionDataSelfFile :</strong> {accountDetails.additionDataSelfFile}</p> */}
              <p><strong>deletionDataFile :</strong> {accountDetails.deletionDataFile}</p>
              <p><strong>Self Policy Coverage :</strong> {accountDetails.policyCoverageSelfFile}</p>
              <p><strong>Floater Policy Coverage:</strong> {accountDetails.policyCoverageFloaterFile}</p>
              
            </ModalContent>
          </Modal>
        )}
      </FormWrapper>

      {/* <FormWrapper style={{maxWidth:'400px' , maxHeight:'400px'}}>
        <Title>HR DETAILS</Title>
            <Form>
            <FormGroup>
            <Label htmlFor="hrName">HR Name</Label>
            <Input
              type="text"
              id="hrName"
              value={hrName}
              onChange={(e) => setHrName(e.target.value)}
              
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="hrMobile">HR Mobile Number</Label>
            <Input
              type="tel"
              id="hrMobile"
              value={hrMobile}
              onChange={(e) => setHrMobile(e.target.value)}
              
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="hrEmail">HR Email ID</Label>
            <Input
              type="email"
              id="hrEmail"
              value={hrEmail}
              onChange={(e) => setHrEmail(e.target.value)}
              
            />
          </FormGroup>
            </Form>
        </FormWrapper> */}

        
    </Container>
  );
};

export default CreateAccount;