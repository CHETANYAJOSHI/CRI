import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from '../../images/CRI-logo 1.jpg';
import { setToken } from '../auth';

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleNumberSubmit = async (e) => {
    e.preventDefault();
    if (mobileNumber.length === 10) {
      try {
        // Send mobile number to the backend to receive an OTP
        const response = await axios.post('http://localhost:5000/api/auth/send-otp', { mobileNumber });
        if (response.data.message) {
          setShowOtpInput(true);
          alert('OTP sent to your mobile number');
        } else {
          alert('Failed to send OTP');
          console.log(response)
        }
      } catch (error) {
        console.error('Error sending OTP', error);
        alert('Error sending OTP');
      }
    } else {
      alert('Please enter a valid 10-digit mobile number');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Enter a Valid OTP");
    } else {
      try {
        // Verify OTP with the backend
        
        const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { mobileNumber, otp });
        const {message,role} = response.data;
        if (response.data.message) {
          console.log(response)
          alert('OTP Verified');

          

          sessionStorage.setItem('role' , response.data.role);
          sessionStorage.setItem('accountName' , response.data.accountName);
          sessionStorage.setItem('hrId' , response.data.hrId);
          sessionStorage.setItem('hrName' , response.data.hrName);
         localStorage.setItem('authToken' , response.data.token);

         if(sessionStorage.getItem('role') === 'HR'){
          navigate("/profile");
        }else{
          navigate("/dashboard");
        }

       

          
        } else {
          alert('Invalid OTP');
        }
      } catch (error) {
        console.error('Error verifying OTP', error);
        alert('User Not Found');
      }
    }
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
                    />
                  </div>
                  {showOtpInput && (
                    <div className="mobilesection d-flex mb-3">
                      <span>
                        <i className="fa-solid fa-plane-departure"></i>
                      </span>
                      <input
                        type="number"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                  )}
                  {showOtpInput ? (
                    <button type="submit" className="btn btn-primary btn-block" onClick={handleOtpSubmit}>Login</button>
                  ) : (
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
