import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import '../assets/checkoutStyle.css';
import { loadStripe } from '@stripe/stripe-js';

const checkout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState([]);

    const getFormData = () => {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const addressLine1 = document.getElementById('addressLine1').value;
        const addressLine2 = document.getElementById('addressLine2').value;
        const province = document.getElementById('province').value;
        const country = document.getElementById('country').value;
        const postalCode = document.getElementById('postalCode').value;
    
        return { firstName, lastName, phoneNumber, addressLine1, addressLine2, province, country, postalCode };
      };

      const validateFormData = (formData) => {
        const { firstName, lastName, phoneNumber, addressLine1, province, country, postalCode } = formData;
        
        if (!firstName) {
          showErrorAlert('First Name is required.');
          return false;
        }
      
        if (!addressLine1) {
          showErrorAlert('Address Line 1 is required.');
          return false;
        }
      
        if (!province) {
          showErrorAlert('Province is required.');
          return false;
        }
      
        if (!country) {
          showErrorAlert('Country is required.');
          return false;
        }
      
        if (!postalCode) {
          showErrorAlert('Postal Code is required.');
          return false;
        }
      
        return true;
      };
      
    

      
    useEffect(() => {
        fetchUser();
        fetchTotalPayableAmount(user?.userId); // Pass userId if available
    }, []); // user as dependency


    function showErrorAlert(message) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: message,
        });
        return ;
    }

    const handleCheckout = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        console.log('handle checkout')
        const formData = getFormData(); // Assuming getFormData function is defined elsewhere
        validateAndInitiateCheckout(formData, total, user.userId);
    };

    const validateAndInitiateCheckout = async (formData, total, userId) => {
        console.log('validateAndInitiateCheckout')

        try {
            const isValid = validateFormData(formData);
            if (isValid) {
                const response = await axios.post('http://localhost:3001/api/create-order', {
                    formData: formData, 
                    total: total ,
                    userId: userId
                });
                const orderId = response.data.orderId;
                console.log(orderId)
                initiateStripeCheckout(orderId);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const initiateStripeCheckout = async (orderId) => {
        console.log('initiateStripeCheckout')

        try {
            const response = await axios.post('http://localhost:3001/api/create-session', {
                    total: total ,
                    userId : user.userId,
                    orderId:orderId
                });
                const sessionId = response.data.sessionId;    
            
                const stripe = await loadStripe('pk_test_51OwHCkP1ms7owmBeGsyrjnuhwyYjLxxbBn4WCsqDIRBWyHxi3itdVSHQ40J08u6b3TC9wInAKBeg7ic6VLJB3BrI006YZkfD9K');
                await stripe.redirectToCheckout({ sessionId });
           
        } catch (error) {
            console.error('Error initiating Stripe checkout:', error);
            // Handle error as needed
        }
    };

    // const handleCheckout = async () => {

    //     try {
    //         const formData = getFormData();
    //         const isValid = validateFormData(formData);
    //         if (isValid) {
    //             setLoading(true);
    //             const response = await axios.post('http://localhost:3001/api/create-order-checkout-session', {
    //                 formData: formData, 
    //                 total: total ,
    //                 userId : user.userId
    //             });
    //             const sessionId = response.data.sessionId;    
            
    //             const stripe = await loadStripe('pk_test_51OwHCkP1ms7owmBeGsyrjnuhwyYjLxxbBn4WCsqDIRBWyHxi3itdVSHQ40J08u6b3TC9wInAKBeg7ic6VLJB3BrI006YZkfD9K');
    //             await stripe.redirectToCheckout({ sessionId });
    //         }
    //     } catch (err) {
    //       setError(err.message);
    //     } finally {
    //       setLoading(false);
    //     }
    // };

    

    const fetchTotalPayableAmount = async (userId) => {
    try {
        const response = await axios.post(`http://localhost:3001/api/total-payable`, { userId });
        console.log('fetchTotalPayableAmount fetched',response.data);
        setTotal(response.data.totalAmount);
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
    };

    const fetchUser = async () => {
        try {
        const response = await axios.get('http://localhost:3001/api/user', {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setUser(response.data.user);
        console.log(response.data.user);
        if(response.data.user == null || response.data.user == [])
        {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You do not have permission to access this page.',
                showConfirmButton: false,
                timer: 2000
            });
            window.location.href = '/home';
          }
    
        } catch (error) {
            console.error('Error fetching user:', error);
        setUser(null);
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You do not have permission to access this page.',
                showConfirmButton: false,
                timer: 2000
            });
            window.location.href = '/home';
            // Handle error, e.g., token expired or invalid
        
        }
    };

  return (
    <div>
        <Navbar user={user}/> 
        <section className="course-content checkout-widget" style={{ transform: 'none' }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-7">
                        <div className="student-widget">
                            <div className="student-widget-group add-course-info">
                                <div className="cart-head">
                                    <h4>Billing Address</h4>
                                </div>
                                <div className="checkout-form">
                                <form>
                                    <div className="row">
                                    <div className="col-lg-6">
                                        <div className="input-block">
                                            <label className="form-control-label" htmlFor="firstName">First Name</label>
                                            <input type="text" id="firstName" className="form-control" placeholder="Enter your first Name" required/>
                                        </div>
                                        </div>
                                        <div className="col-lg-6">
                                        <div className="input-block">
                                            <label className="form-control-label" htmlFor="lastName">Last Name (Optional)</label>
                                            <input type="text" id="lastName" className="form-control" placeholder="Enter your last Name" />
                                        </div>
                                        </div>
                                        <div className="col-lg-12">
                                        <div className="input-block">
                                            <label className="form-control-label" htmlFor="phoneNumber">Phone Number (Optional)</label>
                                            <input type="text" id="phoneNumber" className="form-control" placeholder="Phone Number" required/>
                                        </div>
                                        </div>
                                        <div className="col-lg-12">
                                        <div className="input-block">
                                            <label className="form-control-label" htmlFor="addressLine1">Address Line 1</label>
                                            <input type="text" id="addressLine1" className="form-control" placeholder="Address" required/>
                                        </div>
                                        </div>
                                        <div className="col-lg-12">
                                        <div className="input-block">
                                            <label className="form-control-label" htmlFor="addressLine2">Address Line 2 (Optional)</label>
                                            <input type="text" id="addressLine2" className="form-control" placeholder="Address" />
                                        </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="input-block">
                                                <label className="form-label">Province</label>
                                                <select className="form-select select select2-hidden-accessible" id="province" required>
                                                    <option value=" ">Select Province</option>
                                                    <option value="Alberta">Alberta</option>
                                                    <option value="British Columbia">British Columbia</option>
                                                    <option value="Manitoba">Manitoba</option>
                                                    <option value="New Brunswick">New Brunswick</option>
                                                    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                                                    <option value="Nova Scotia">Nova Scotia</option>
                                                    <option value="Ontario">Ontario</option>
                                                    <option value="Prince Edward Island">Prince Edward Island</option>
                                                    <option value="Quebec">Quebec</option>
                                                    <option value="Saskatchewan">Saskatchewan</option>
                                                    <option value="Northwest Territories">Northwest Territories</option>
                                                    <option value="Nunavut">Nunavut</option>
                                                    <option value="Yukon">Yukon</option>


                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="input-block">
                                                <label className="form-label">Country</label>
                                                <select className="form-select select select2-hidden-accessible" id="country" required>
                                                    <option>Select country</option>
                                                    <option>Canada</option>
                                                    
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="input-block">
                                                <label className="form-control-label">Zip/Postal Code</label>
                                                <input type="text" id="postalCode" className="form-control" required/>
                                            </div>
                                        </div>
                                        
                                        <div className=" col-md-12 payment-btn">
                                        {/* {error && <div>{error}</div>} */}
                                        <button  className="btn btn-primary" onClick={(event) => handleCheckout(event)} disabled={loading}>
                                            {loading ? 'Processing...' : 'Make a Payment with Stripe'}
                                        </button>
                                        </div>
                                    </div>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 theiaStickySidebar">
                        {/* Selected Plan section */}
                        <div className="student-widget select-plan-group">
                            <div className="student-widget-group">
                                <div className="plan-header">
                                </div>
                                <div className="basic-plan">
                                    <p>Course(s) you Selected will be valid for lifetime once you subscribed to it</p>
                                    <h2><span>$</span>{total}</h2>
                                </div>
                                <div className="benifits-feature">
                                    <h3>Benefits</h3>
                                    <ul>
                                        {/* List of benefits */}
                                        <li><img width="14" height="14" src="https://img.icons8.com/nolan/64/circled.png" alt="circled"/> Interactive Quizzes</li>
                                        <li><img width="14" height="14" src="https://img.icons8.com/nolan/64/circled.png" alt="circled"/> Safe Online Environment</li>
                                        <li><img width="14" height="14" src="https://img.icons8.com/nolan/64/circled.png" alt="circled"/> Track Progress Easily</li>
                                    </ul>
                                </div>
                                <div className="benifits-feature">
                                    <h3>Features</h3>
                                    <ul>
                                        {/* List of features */}
                                        <li><img width="14" height="14" src="https://img.icons8.com/nolan/64/circled.png" alt="circled"/> Colorful Visuals</li>
                                        <li><img width="14" height="14" src="https://img.icons8.com/nolan/64/circled.png" alt="circled"/> Fun Learning Activities</li>
                                        <li><img width="14" height="14" src="https://img.icons8.com/nolan/64/circled.png" alt="circled"/> Personalized Feedback System</li>
                                    </ul>
                                </div>
                                <div className="plan-change">
                                    <a href="/courses" className="btn btn-primary">Buy Another Course</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
        <Footer/>
    </div>
  );
};

export default checkout;
