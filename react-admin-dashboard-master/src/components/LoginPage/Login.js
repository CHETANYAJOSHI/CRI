import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './Login.css'; // Create a CSS file for custom styles if needed
import logo from '../../images/CRI-logo 1.jpg'

const Login = () => {
    const Navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
  
    const handleNumberSubmit = (e) => {
      e.preventDefault();
      if (mobileNumber.length === 10) {
        setShowOtpInput(true);
      } else {
        alert('Please enter a valid 10-digit mobile number');
      }
    };
  
    const handleOtpSubmit = (e) => {
      e.preventDefault();

      if(!otp){
        alert("Enter a Valid OTP");
      }else{
        alert('OTP Submitted');
        Navigate("/dashboard")
      }
      // Add your logic to verify OTP here
     
    };
  return (
<>

    <div className="box2">
        <div className="subbox">
            
        </div>
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
              <h4 style={{fontStyle:'italic'}}>CRI-CARE</h4>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title text-center" style={{fontWeight:600}}>Login</h3>
              <form onSubmit={handleNumberSubmit}>
            
              <div className=" mobilesection mb-3 d-flex">
                    <span className="">
                        <i class="fa-solid fa-phone"></i>
                    </span>
                <input
                  type="number"
                //   className="form-control"
                  placeholder="Mobile No."
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
              {showOtpInput && (
                <div className=" mobilesection d-flex  mb-3">
                    <span className="">
                    <i class="fa-solid fa-plane-departure"></i>
                    </span>
                  <input
                    type="number"
                    // className="form-control"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}
              {showOtpInput ? (
                <button type="submit" className="btn btn-primary btn-block" onClick={handleOtpSubmit}>Login</button>
              ) : (
                <button type="submit" className="btn btn-primary btn-block" >Submit</button>
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
