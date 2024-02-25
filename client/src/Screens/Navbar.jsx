import React from 'react';
import { Link } from 'react-router-dom'; 
import '../assets/Navbar.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-3 col-lg-2">
            <div className="header__logo">
              <Link to="/"><img width="200px" height="70px" src="img/logos/ApexLogo.png" alt="" /></Link>
            </div>
          </div>
          <div className="col-xl-6 col-lg-7">
            <nav className="header__menu">
              <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="#">Games</Link></li>
                <li><Link to="#">Videos</Link></li>
                <li><Link to="#">Courses</Link></li>
                <li><Link to="#">Contact</Link></li>
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
}

export default Header;
