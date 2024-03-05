import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import VideoSection from './VideoSection';
import '../assets/style.css'; 

export default function Home() {
  return (   
    <div className="container-fluid">
      <Navbar /> 
      <VideoSection/>
      <div className="row">
        <div className="col-md-4 mb-4">
          <Link to="/image1">
            <img src="img/A1.jpg" className="img-fluid rounded border" alt="..." style={{width: "350px", height: "170px"}} />
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/image2"> 
            <img src="img/A2.jpg" className="img-fluid rounded border" alt="..." style={{width: "350px", height: "170px"}} />
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/image3"> 
            <img src="img/A3.jpg" className="img-fluid rounded border" alt="..." style={{width: "350px", height: "170px"}} />
          </Link>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4 mb-4">
          <Link to="/image4"> 
            <img src="img/A4.jpg" className="img-fluid rounded border" alt="..." style={{width: "350px", height: "170px"}} />
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/image5"> 
            <img src="img/A5.jpg" className="img-fluid rounded border" alt="..." style={{width: "350px", height: "170px"}} />
          </Link>
        </div>
        <div className="col-md-4 mb-4">
          <Link to="/image6"> 
            <img src="img/A6.jpg" className="img-fluid rounded border" alt="..." style={{width: "350px", height: "170px"}} />
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
