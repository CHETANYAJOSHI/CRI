import React, { useState } from 'react';
import NotificationPage from './NotificationPage';
import EmployeeNotification from './EmployeeNotification';

export default function Request() {
  const [currentPage, setCurrentPage] = useState('notification');

  return (
    <div style={styles.container}>
      {/* Header */}
      <h1 style={styles.title}>Notification Center</h1>

      {/* Buttons to switch between Notification and EmployeeNotification pages */}
      <div style={styles.buttonContainer}>
        <button 
          style={currentPage === 'notification' ? styles.activeButton : styles.button}
          onClick={() => setCurrentPage('notification')}
        >
          Notification
        </button>
        <button 
          style={currentPage === 'employeeNotification' ? styles.activeButton : styles.button}
          onClick={() => setCurrentPage('employeeNotification')}
        >
          Employee Notification
        </button>
      </div>

      {/* Conditional Rendering of Pages */}
      <div style={styles.pageContainer}>
        {currentPage === 'notification' && <NotificationPage />}
        {currentPage === 'employeeNotification' && <EmployeeNotification />}
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px',
  },
  buttonContainer: {
    marginBottom: '30px',
  },
  button: {
    padding: '15px 30px',
    margin: '0 10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activeButton: {
    padding: '15px 30px',
    margin: '0 10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#0056b3',
    color: '#fff',
    cursor: 'pointer',
    // boxShadow: '0px 4px 15px rgba(0, 123, 255, 0.5)',//
    transform: 'scale(1.05)',
    transition: 'all 0.3s ease',
  },
  pageContainer: {
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    maxWidth: '900px',
    margin: '0 auto',
  },
};
