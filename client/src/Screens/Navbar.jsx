import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/Navbar.css';

const Header = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-3 col-lg-2">
            <div className="header__logo">
              <Link to="/home">
                <img width="200px" height="70px" src="img/logos/apex.png" alt="" />
              </Link>
            </div>
          </div>
          <div className="col-xl-6 col-lg-7">
            <nav className="header__menu">
              <ul>
                <li><Link to="/home">Home</Link></li>
                <li className="dropdown">
                  <Link to="#">Courses</Link>
                  <ul className="dropdown-menu">
                    {courses.map(course => (
                      <li key={course.courseId} className="dropdown-item">
                        <Link to={`/courses/${course.courseId}`}>{course.name}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li><Link to="#">subscription</Link></li>
                <li><Link to="#">About us</Link></li>
              </ul>
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="header__right">
              <div id="LoginUser" className="header__right__auth">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="canvas__open">
          <i className="fa fa-bars"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
