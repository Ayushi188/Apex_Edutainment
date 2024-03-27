import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/Navbar.css';

const Header = (props) => {
  const courses = props.courses;
  const user = props.user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  

  const handleLogout = () => {
    // Clear the token from localStorage1
    localStorage.removeItem('token');
    if (location.pathname === "/home") {
      // If the current route is "/home", refresh the page
      window.location.reload();
    }else{
      window.location.href = '/home';
    }
  };


  return (
    // <ul>
    //             <li><Link to="/home">Home</Link></li>
    //             {user && (
    //                 <li><Link to="/dashboard">Dashboard</Link></li>)
    //             }
               
    //             <li><Link to="/courses">All Courses</Link></li>
    //             <li className="dropdown">
    //               {user && user.role === "student" && (
    //                 <Link to="#">My Enrollments</Link>)
    //               }
    //               {user && user.role === "teacher" && (
    //                 <Link to="#">My Courses</Link>)
    //               }
    //               {user && user.role === "admin" && (
    //                 <Link to="/course-approval">Course Approvals</Link>)
    //               }
                 
    //               <ul className="dropdown-menu">
    //               {courses && courses.map(course => (
    //                   <li key={course.courseId} className="dropdown-item">
    //                     <Link to={`/courses/${course.courseId}`}>{course.name}</Link>
    //                   </li>
    //               ))}
    //               </ul>
    //             </li>
    //             <li><Link to="/user-approval">User Approvals</Link></li>
    //             <li><Link to="#">About us</Link></li>
    //           </ul>

    <header className="header">
      <div className="header-fixed">
        <nav className="navbar navbar-expand-lg header-nav scroll-sticky add-header-bg">
          <div className="container">
            <div className="navbar-header">
              <Link id="mobile_btn" to="/">
                <span className="bar-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </Link>
              <Link to="/" className=" logo">
                <img src="/img/logos/apex.png" className="img-fluid" alt="Logo"  width="70px"/>
                <img src="/img/logos/logo.png" className="img-fluid" alt="Logo"  width="70px"/>

              </Link>
            </div>
            <div className="main-menu-wrapper">
              <ul className="main-nav">    
                <li className="has-submenu active">
                  <Link to="/home">Home <i className="fas fa-chevron-down"></i></Link>
                </li>

                {user && (
                    <li className="has-submenu">
                    <Link to="/dashboard">Dashboard</Link>
                    </li>)
                }

               {user && user.role === "student" && (
                <li><Link to="/courses">All Courses</Link></li>
               )}
                {!user && (
                <li><Link to="/courses">All Courses</Link></li>
               )}
             

              {/* <li><Link to="/courses">All Courses</Link></li> */}
               
             
              {user && user.role === "student" && (
                  <li className="has-submenu">
                  <Link to="/student-enrollment">My Courses</Link></li>) 
              }
               {user && user.role === "teacher" && (
                  <li><Link to="/courses">All Courses</Link></li>
                )} 

                {user && user.role === "teacher" && (
                  <li className="has-submenu">
                  <Link to="#">My Courses</Link></li>)
                }

               

                {user && user.role === "admin" && (
                  <li><Link to="/courses">All Courses</Link></li>
                )}  

                {user && user.role === "admin" && (
                  <li className="has-submenu">
                  <Link to="/courseapproval">Course Approvals</Link></li>)
                }

                {user && user.role === "admin" && (
                  <li className="has-submenu">
                    <Link to="/adminapproval">User Approvals</Link></li>
                )}  

                  {/* <ul className="dropdown-menu">
                    {courses && courses.map(course => (
                        <li key={course.courseId} className="dropdown-item">
                          <Link to={`/courses/${course.courseId}`}>{course.name}</Link>
                          </li>
                    ))}
                  </ul> */}

                  {/* {user && user.role === "student" && (
                    <li><Link to="#">Query for teacher</Link></li>
                  )} */}
                {user && user.role === "student" && (
                  <li><Link to="/about">About us</Link></li>
                )}  
                 {!user  && (
                  <li><Link to="/about">About us</Link></li>
                )}  

              </ul>

            </div>
            {!user ? (  
              <ul className="nav header-navbar-rht">
                <li className="nav-item">
                <a className="nav-link header-sign" href="/login">Login</a>
                </li>
                <li className="nav-item">
                <a className="nav-link header-login" href="/register">Signup</a>
                </li>
              </ul>
             ):user && (
                <div className="dropdown">
                {user && user.role == "student" && (
                  <img width="90" height="90"  src="https://img.icons8.com/bubbles/100/student-male.png" alt="user" className='dropdown-toggle' id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                )}
                {user && user.role === "admin" && (
                  <img width="90" height="90" src="https://img.icons8.com/bubbles/100/system-administrator-female.png" alt="system-administrator-female" className='dropdown-toggle' id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" /> 
                )}
                {user && user.role === "teacher" && (
                  <img width="90" height="90" src="https://img.icons8.com/bubbles/100/girl-and-math-equation.png" alt="girl-and-math-equation" className='dropdown-toggle' id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />         
                )}
                  <div className="dropdown-menu" style={{left:'-95px'}} aria-labelledby="dropdownMenuButton">
                    <span className="dropdown-item">{user.name}({user.role})</span>
                    {user && user.role == "student" && (
                    <a className="dropdown-item"  href="/cart">Cart</a>
                    )}
                    <a className="dropdown-item"  onClick={handleLogout} href="#">Logout</a>
                  </div>
              </div>
             )}
          </div>
        </nav>
        <div className="sidebar-overlay"></div>
      </div>
    </header>
  
    //               <ul className="dropdown-menu">
    //               {courses && courses.map(course => (
    //                   <li key={course.courseId} className="dropdown-item">
    //                     <Link to={`/courses/${course.courseId}`}>{course.name}</Link>
    //                   </li>
    //               ))}
    //               </ul>
    
  );
};

export default Header;
