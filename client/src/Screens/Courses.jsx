import '../assets/style.css';
import Navbar from './Navbar';
import VideoSection from './VideoSection';
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

const CoursePage = () => {
  const [courses, setCourses] = useState(null);
  const [userCourses,setUserCourses] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Functions to fetch course and user data
    fetchUser();
    fetchCourses();
    fetchUserCourses();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(response.data.user);
      console.log('user fetched:');
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCourses(response.data);
      console.log('courses fetched:');
    } catch (error) {
      // Handle error, e.g., token expired or invalid
      console.error('Error fetching courses:', error);
      setCourses(null);
    }
  };

  const fetchUserCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/usercourses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserCourses(response.data);
      console.log('courses fetched:');
    } catch (error) {
      // Handle error, e.g., token expired or invalid
      console.error('Error fetching courses:', error);
      setUserCourses(null);
    }
  };


  return (
    <div className="container-fluid">
      <div className="course-page">
        {/* {courses && user && */}
          <Navbar courses={userCourses} user={user}/> 
        {/* } */}


        <div className="course-header">Courses</div>
        {user &&
          (
            user.role === "admin" ? (<AdminDashboard />) :
            (user.role === "teacher" ? (<InstructorDashboard user={user}/>) : (<StudentDashboard />) )
          )
        }
        <div className="course-grid">
          {courses && courses.map((course) => (
            <div className="course-card" key={course.id}>
              <img src={`http://localhost:3001/${course.imagePath.replace(/\\/g, '/')}`} alt={course.name} />
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <button><Link to={`/coursecontent?courseId=${course._id}`} style={{ color: 'white' }}>View Course</Link></button>
            </div>
          ))}
        </div>
        <Footer />
      </div>
      
    </div>
  );
};

export default CoursePage;
