import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/style.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); //navigate to home page

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const formValidation = async (event) => {
    event.preventDefault();

    try {
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        setSuccessMessage('');
        return;
      }

      const response = await axios.post('http://localhost:3001/login', formData);
      // console.log("login data"+ response.data.payload.approved);
      const { approved } = response.data.payload;
      const { role } = response.data.payload;

      if (response.status === 200) {
        if (role=== 'admin' || approved) {
          console.log('User logged in successfully');
          setSuccessMessage('Logged in successfully');
  
          const { token } = response.data;
          localStorage.setItem('token', token);
          const { payload } = response.data;
      
          // Redirect based on user role
          // payload.role === "teacher" ? navigate('/courses') : navigate('/dashboard');
          navigate('/dashboard');
        } else {
          // Display message for waiting for approval
          setError('Waiting for approval');
          setSuccessMessage('');
        }
      } else {
        setError('Invalid email or password');
        setSuccessMessage('');
      }
    }
     catch (error) {
      console.error('Error during login:', error.message);
      setError('Error during login. Please try again with valid email and password.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center ">
        <div className="col-md-10">
          <div className="card mt-5"  style={{ backgroundColor: '#e0e1fc'}}>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                  <img src="img/login1.jpeg" style={{ width: '650px',transform: 'scale(1.1)' }} alt="Login" className="img-fluid" />
                </div>
                <div className="col-md-6 text-center">
                  <h4 className="card-title mb-4 mt-5 txt-login-signup" >Login</h4>
                  <form>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        onChange={handleInputChange}
                        value={formData.email}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        onChange={handleInputChange}
                        value={formData.password}
                      />
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                    {successMessage && <div className="text-success mt-2">{successMessage}</div>}

                    <button
                    style={{ backgroundColor: '#8781fc',borderColor:'#8781fc',fontFamily: 'Luminari, fantasy'}}
                      type="submit"
                      className="btn btn-submit btn-primary"
                      onClick={formValidation}
                    >
                      Login
                    </button>
                  </form>
                  <div className="mt-3 txt-register">
                    <span>Don't have an account?</span>
                    <Link to="/register" className="ms-2 btn-register">
                      Sign Up
                    </Link>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
