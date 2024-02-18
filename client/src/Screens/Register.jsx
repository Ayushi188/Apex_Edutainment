import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/style.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    reEmail: '',
    password: '',
    age: '',
    parentEmail: '',
    school: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

      const response = await axios.post('http://localhost:4000/auth/register', formData);
      if (response.status === 201) {
        console.log('User registered successfully');
        if (response.data.userId) {
          sessionStorage.setItem('userId', response.data.userId);
        }
        setError('');
        setSuccessMessage('User registered successfully');
        // Clear form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          reEmail: '',
          password: '',
          age: '',
          parentEmail: '',
          school: '',
        });
      } else if (response.status === 409) {
        setError('User already exists');
        setSuccessMessage('');
      } else {
        setError('User registration failed');
        setSuccessMessage('');
      }
    } catch (error) {
      if (error.response.status === 409) {
        setError('User already exists');
      } else {
        console.error('Error during registration:', error.message);
        setError(error.message);
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center ">
        <div className="col-md-10">
          <div className="card mt-5">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                  <img src="img/logos/7.jpeg" style={{ width: '480px' }} alt="Registration" className="img-fluid" />
                </div>
                <div className="col-md-6 text-center">
                  <h4 className="card-title mb-4 mt-5 txt-login-signup">Sign Up</h4>
                  <form>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder="Enter First Name"
                        onChange={handleInputChange}
                        value={formData.firstName}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        placeholder="Enter Last name"
                        onChange={handleInputChange}
                        value={formData.lastName}
                      />
                    </div>
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
                        type="email"
                        className="form-control"
                        id="reEmail"
                        placeholder="Re-Enter email"
                        onChange={handleInputChange}
                        value={formData.reEmail}
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
                    <div className="mb-3">
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        placeholder="Enter Age"
                        onChange={handleInputChange}
                        value={formData.age}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="parentEmail"
                        placeholder="Enter Parent/Guardian Email"
                        onChange={handleInputChange}
                        value={formData.parentEmail}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="school"
                        placeholder="Enter Class"
                        onChange={handleInputChange}
                        value={formData.school}
                      />
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                    {successMessage && <div className="text-success mt-2">{successMessage}</div>}

                    <button
                      type="submit"
                      className="btn btn-submit btn-primary"
                      onClick={formValidation}
                    >
                      Sign Up
                    </button>
                  </form>
                  <div className="mt-3 txt-register">
                    <span>Already have an account?</span>
                    <Link to="/login" className="ms-2 btn-register">
                      Login
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

export default SignUp;
