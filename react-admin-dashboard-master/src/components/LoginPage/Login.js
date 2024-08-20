import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Spinner, Button } from 'react-bootstrap';
import './Login.css';
import logo from '../../images/CRI-logo 1.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [otpExpired, setOtpExpired] = useState(false);

  useEffect(() => {
    let timer;
    if (showOtpInput && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setOtpExpired(true);
    }
    return () => clearTimeout(timer);
  }, [showOtpInput, timeLeft]);

  const handleNumberSubmit = async (e) => {
    e.preventDefault();
    if (mobileNumber.length === 10) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/auth/send-otp', { mobileNumber });
        setLoading(false);
        if (response.data.message) {
          setShowOtpInput(true);
          setOtpExpired(false);
          setTimeLeft(120); // Reset the timer
          setModalMessage('OTP sent to your mobile number');
        } else {
          setModalMessage('Failed to send OTP');
        }
        setShowModal(true);
      } catch (error) {
        setLoading(false);
        console.error('Error sending OTP', error);
        setModalMessage('Error sending OTP');
        setShowModal(true);
      }
    } else {
      setModalMessage('Please enter a valid 10-digit mobile number');
      setShowModal(true);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setModalMessage("Enter a Valid OTP");
      setShowModal(true);
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { mobileNumber, otp });
        if (response.data.message) {
          setModalMessage('OTP Verified Successfully');
          setShowModal(true);

          localStorage.setItem('role', response.data.role);
          localStorage.setItem('accountName', response.data.accountName);
          localStorage.setItem('hrId', response.data.hrId);
          localStorage.setItem('hrName', response.data.hrName);
          localStorage.setItem('authToken', response.data.token);

          if (localStorage.getItem('role') === 'HR') {
            navigate("/profile");
          } else {
            navigate("/dashboard");
          }
        } else {
          setModalMessage('Invalid OTP');
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error verifying OTP', error);
        setModalMessage('Error verifying OTP');
        setShowModal(true);
      }
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleResetNumber = () => {
    setMobileNumber('');
    setOtp('');
    setShowOtpInput(false);
    setOtpExpired(false);
    setTimeLeft(120);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <div className="box2">
        <div className="subbox"></div>
      </div>

      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg" style={{ maxWidth: '700px', width: '100%' }}>
          <div className="row no-gutters">
            <div className="box1 col-md-4 d-flex justify-content-center align-items-center bg-teal text-white">
              <div className="text-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="img-fluid mt-3"
                  height={120}
                  width={120}
                />
                <h4 style={{ fontStyle: 'italic' }}>CRI-CARE</h4>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h3 className="card-title text-center" style={{ fontWeight: 600 }}>Login</h3>
                <form onSubmit={handleNumberSubmit}>
                  <div className="mobilesection mb-3 d-flex">
                    <span>
                      <i className="fa-solid fa-phone"></i>
                    </span>
                    <input
                      type="number"
                      placeholder="Mobile No."
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      disabled={showOtpInput}
                    />
                  </div>
                  {showOtpInput && (
                    <>
                      <div className="mobilesection d-flex mb-3">
                        <span>
                          <i className="fa-solid fa-plane-departure"></i>
                        </span>
                        <input
                          type="number"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          disabled={otpExpired}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3 flex-column">
                      <div className="timer mb-3">
                          <p className="mb-0" style={{fontSize:'20px' , color:"rgb(57 49 132)" , fontWeight:'bold'}}>{otpExpired ? 'OTP expired' : `Time left: ${formatTime(timeLeft)}`}</p>
                        </div>

                        <button
                          type="button"
                          className="btn btn-secondary btn-block"
                          onClick={handleResetNumber}
                          disabled={loading}
                        >
                          Change Number
                        </button>
                        
                      </div>
                    </>
                  )}
                  {showOtpInput ? (
                    <button type="submit" className="btn btn-primary btn-block" onClick={handleOtpSubmit} disabled={otpExpired || loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary btn-block">
                      {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i className="fa-solid fa-check-circle text-success" style={{ fontSize: '2rem' }}></i>
          <p className="mt-3">{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Login;
