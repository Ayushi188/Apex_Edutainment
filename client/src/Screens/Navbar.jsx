import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/Navbar.css';

const Header = (props) => {
  const courses = props.courses;
  const user = props.user;
  

  const handleLogout = () => {
    // Clear the token from localStorage1
    localStorage.removeItem('token');
    if (location.pathname === "/home") {
      // If the current route is "/home", refresh the page
      window.location.reload();
    }
  };


  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-3 col-lg-2">
            <div className="header__logo">
              <Link to="/home">
                <img width="200px" height="70px" src="img/logos/logo.png" alt="" />
              </Link>
            </div>
          </div>
          <div className="col-xl-6 col-lg-7">
            <nav className="header__menu">
              <ul>
                <li><Link to="/home">Home</Link></li>
                {user && (
                    <li><Link to="/dashboard">Dashboard</Link></li>)
                }
                
                <li><Link to="/courses">Courses</Link></li>
                <li className="dropdown">
                  {user && user.role === "student" && (
                    <Link to="#">My Enrollments</Link>)
                  }
                  {user && user.role === "teacher" && (
                    <Link to="#">My Courses</Link>)
                  }
                  {user && user.role === "admin" && (
                    <Link to="#">My Approvals</Link>)
                  }
                  
                  <ul className="dropdown-menu">
                  {courses && courses.map(course => (
                      <li key={course.courseId} className="dropdown-item">
                        <Link to={`/courses/${course.courseId}`}>{course.name}</Link>
                      </li>
                  ))}
                  </ul>
                </li>
                <li><Link to="#">subscription</Link></li>
                <li><Link to="/about">About us</Link></li>
              </ul>
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="header__right">
            {!user ? (  
              <div id="LoginUser" className="header__right__auth">
                <button className="login_register_button"><Link to="/login" style={{ color: 'white' }}>Login</Link></button> 
                <button className="login_register_button"><Link to="/register" style={{ color: 'white' }}>Register</Link></button>
              </div>
              ):user && (
              <div id="LoginUser" className="header__right__auth">
                <button className="login_register_button"><Link to="#" style={{ color: 'white' }}>{user.name}</Link></button> 
                <button className="login_register_button" onClick={handleLogout}><Link to="/home" style={{ color: 'white' }}>Logout</Link></button>
              </div>
              )}
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
