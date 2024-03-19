import React ,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const StudentDashboard = (props) => {

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState(null);
  const navigate = useNavigate();

  const NavStudentEnrollment = () => {
    navigate('/student-enrollment')
  }

  return (
    <div>
        <div className="add-new-course-wrapper">
          <button
            className="add-new-course-button"
            onClick={NavStudentEnrollment}>
            Enroll Courses
          </button>
        </div>
    </div>
  );
};

export default StudentDashboard;
