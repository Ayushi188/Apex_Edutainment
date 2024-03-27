import React ,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = (props) => {
  const navigate = useNavigate();


  const NavApprovals = () => {
    navigate('/courseapproval')
  }

  return (
    <div>
        <div className="add-new-course-wrapper">
          <button
            className="add-new-course-button"
            onClick={NavApprovals}>
            Approve Courses
          </button>
        </div>
    </div>
  );
};

export default AdminDashboard;
