import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
// import { useAccount } from '../AccountContext/AccountContext';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const DropdownWrapper = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
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

const SelectAccount = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    // const { selectedAccount, setSelectedAccount } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch accounts for dropdown
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
          // Redirect to the /policycoverage route
          navigate(`/policycoverage?accountId=${accountId}`);
        }
      };

  const handleChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  return (
    <Container>
      <DropdownWrapper>
        <Label htmlFor="account-select">Select an Account</Label>
        <Select id="account-select" value={selectedAccount} onChange={handleSelectChange}>
          <Option value="">--Select an Account--</Option>
          {accounts.map((account) => (
            <Option key={account._id} value={account._id}>
              {account.accountName}
            </Option>
          ))}
        </Select>
      </DropdownWrapper>
    </Container>
  );
};

export default SelectAccount;
