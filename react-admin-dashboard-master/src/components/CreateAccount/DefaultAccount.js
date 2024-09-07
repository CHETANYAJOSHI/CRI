import React, { useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import CreateAccount from './CreateAccount';
import SelfFloaterCreate from './SelfFloaterCreate';

export default function DefaultAccount() {
  const [activeSection, setActiveSection] = useState('createAccount');

  const handleSwitchSection = (section) => {
    setActiveSection(section);
  };

  return (
    <Box sx={{ width: '100%', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Select Account Type
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <Button
          variant={activeSection === 'createAccount' ? 'contained' : 'outlined'}
          onClick={() => handleSwitchSection('createAccount')}
        >
          Floater With Parents
        </Button>
        <Button
          variant={activeSection === 'selfFloaterCreate' ? 'contained' : 'outlined'}
          onClick={() => handleSwitchSection('selfFloaterCreate')}
          sx={{ marginLeft: '10px' }}
        >
          Self with Parents
        </Button>
      </Box>
      <Divider sx={{ marginBottom: '20px' }} />
      {activeSection === 'createAccount' && <CreateAccount />}
      {activeSection === 'selfFloaterCreate' && <SelfFloaterCreate />}
    </Box>
  );
}
