import React, { useState } from 'react';
import BulkRequest from './BulkRequest';
import EmployeeRequest from './EmployeeRequest';
export default function RequestECard() {
  // State to track the current screen
  const [activeScreen, setActiveScreen] = useState('bulk');

  // Function to render the content based on the active screen
  const renderContent = () => {
    if (activeScreen === 'bulk') {
      return <div><BulkRequest /></div>;
    } else if (activeScreen === 'employee') {
      return <div><EmployeeRequest /></div>;
    }
  };

  return (
    <div>
      <p style={{textAlign:'center' , fontSize:'25px' , marginBottom:'40px'}}>Request E-Card</p>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        {/* Divider for Bulk Request */}
        <div
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeScreen === 'bulk' ? '#ddd' : '#f0f0f0',
          }}
          onClick={() => setActiveScreen('bulk')}
        >
          Request to Bulk E-Card
        </div>

        {/* Divider for Employee Request */}
        <div
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeScreen === 'employee' ? '#ddd' : '#f0f0f0',
          }}
          onClick={() => setActiveScreen('employee')}
        >
          Employee E-Card Request
        </div>
      </div>

      {/* Render the content based on the active screen */}
      <div>{renderContent()}</div>
    </div>
  );
}
