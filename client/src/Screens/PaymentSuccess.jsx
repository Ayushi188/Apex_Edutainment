import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div>
      <h1>Payment Successful!</h1>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default PaymentSuccess;
