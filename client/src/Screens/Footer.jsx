import React from 'react'
import { Link } from 'react-router-dom';
import '../assets/Footer.css'; 
export default function Footer() {
  return (
    <div>
      <hr></hr>
      <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 col-md-6 col-sm-7">
            <div className="footer__about">
              <div className="footer__logo">
                <Link to="/home">
                  <img width="100px" src="img/logos/apex.png" alt="" />
                </Link>
              </div>
              <p>
              Making educational experiences better for everyone.The Leader in Educational Games for Kids!
              </p>
              
            </div>
          </div>
          <div className="col-lg-2 col-md-3 col-sm-5">
            <div className="footer__widget">
              <h6>Quick links</h6>
              <ul>
                <li>
                  <Link to="#">Games</Link>
                </li>
                <li>
                  <Link to="#">Courses</Link>
                </li>
                <li>
                  <Link to="#">Videos</Link>
                </li>
                <li>
                  <Link to="#">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-5 col-md-8 col-sm-8">
                <div className="footer__newslatter">
                    <h6>Address</h6>
                
                   <ul className="list-unstyled">
	                   <li className="icon-font-mail text-decoration-none">
	                   Email :
	                   		<a href="mailto:info@lambtoncollege.ca"> info@quantum.ca</a>
	                   </li>
	                   <li className="icon-font-grad-cap">Program Info: 1-844-LAMBTON</li>
	                   <li className="icon-font-school">Main: 519-542-7751</li>
	                   <li className="icon-font-location">1457 London Road, Sarnia, ON, N7S 6K4</li>
                   </ul>
              
            </div>
                
          </div>
        
        </div>
        <div className="row">
          <div className="footer__social mt-4">
            <Link
              target="_blank"
              to="#"
            >
            <img width="40"  src="https://img.icons8.com/fluency/48/facebook-new.png" alt="facebook-new"/>               
            </Link>
            <Link
              target="_blank"
              to="#"
            >
              <img width="40"  src="https://img.icons8.com/fluency/48/twitterx--v1.png" alt="twitterx--v1"/>
            </Link>
            <Link
              target="_blank"
              to="#"
            >
              <img width="40"  src="https://img.icons8.com/fluency/48/youtube-play.png" alt="youtube-play"/>
            </Link>
            <Link
              target="_blank"
              to="#"
            >
              <img width="40"  src="https://img.icons8.com/fluency/48/instagram-new.png" alt="instagram-new"/>
            </Link>
            <Link
              target="_blank"
              to="#"
            >
            <img width="40"  src="https://img.icons8.com/fluency/48/pinterest.png" alt="pinterest"/>                </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="footer__copyright__text">
              <p>
                Copyright &copy; All rights reserved to <b>Apex Edutainment </b>|
                This website is made by Apex Team with lots of{' '}
                <i className="fa fa-heart" aria-hidden="true"></i> from{' '}
                <Link to="/" target="_blank">
                  Apex Development
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  )
}
