import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
    <div>
      <h1>Payment Failed!</h1>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default PaymentFailed;
