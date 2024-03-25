import React ,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import VideoSection from './VideoSection';
import  Footer from './Footer';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';


export default function Dashboard() {

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Functions to fetch course and user data
    fetchUser();
    fetchCourses();
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
      navigate('/login');
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
      console.log(response.data);
    } catch (error) {
      // Handle error, e.g., token expired or invalid
      console.error('Error fetching courses:', error);
      setCourses(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="course-page">
        {courses && user &&
          <Navbar courses={courses} user={user}/> 
        }
        
        <div className="course-welcome">Hi, Welcome</div>
        <VideoSection/>
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
              <button>View Course</button>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};
