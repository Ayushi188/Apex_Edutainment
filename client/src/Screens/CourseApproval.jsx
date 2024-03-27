
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import Navbar from './Navbar';
import '../assets/CourseApproval.css'


const CourseApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [courses, setCourses] = useState(null);
  const [user, setUser] = useState(null);
  const [pendingCourses, setPendingCourses] = useState([]);

  useEffect(() => {

     fetchCourses();
     fetchUser();
 
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
      const response = await axios.get('http://localhost:3001/api/usercourses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCourses(response.data);
      console.log('courses fetched:');
      
      const pendingCourses = response.data.filter(course => course.status === 'pending');
      setPendingCourses(pendingCourses);

      console.log("abc"+ response.data[0].courseId);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(null);
    }
  };

  const approveCourse = async (courseId) => {
    try {
      await axios.put(`http://localhost:3001/api/approvecourse/${courseId}`, { status: 'approved' });
      setPendingCourses(pendingCourses.filter(course => course.courseId !== courseId));
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };
  
  const rejectCourse = async (courseId) => {
    try {
      await axios.put(`http://localhost:3001/api/rejectcourse/${courseId}`, { status: 'rejected' });
      const updatedPendingCourses = pendingCourses.filter(course => course.courseId !== courseId);
      setPendingCourses(updatedPendingCourses);
      // window.location.reload();
    } catch (error) {
      console.error("Error rejecting course:", error);
    }
  };
  return (
    <div> 
      <Navbar courses={courses} user={user}/>
      <div className="pending-user">
        <h1 className="user-title">Pending Course Approvals</h1>
        <div className="user-list">
        {pendingCourses.map(course => (
  <div key={course._id} className="user-item">
    <div>
      <div className="user-info">
        <div className="user-icon"><FaUser /></div>
        <div className="user-text">
          <div><strong>Course ID:</strong> {course.courseId}</div>
          <div><strong>Name:</strong> {course.name}</div>
          <div><strong>Description:</strong> {course.description}</div>
          <div><strong>Status:</strong> {course.status}</div>
        </div>
      </div>
    </div>
    <div className="user-actions">
      <button className="approve-btn" onClick={() => approveCourse(course.courseId)}>Approve</button>
      <button className="reject-btn" onClick={() => rejectCourse(course.courseId)}>Reject</button>
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
};

export default CourseApproval;
