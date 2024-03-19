import React ,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AdminDashboard = (props) => {

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState(null);
  const navigate = useNavigate();

  const NavApprovals = () => {
    navigate('/course-approvals')
  }

  return (
    <div>
        <div className="add-new-course-wrapper">
          <button
            className="add-new-course-button"
            onClick={NavApprovals}>
            Aprove Courses
          </button>
        </div>
    </div>
  );
};

export default AdminDashboard;
