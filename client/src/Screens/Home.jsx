import React ,{ useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import VideoSection from './VideoSection';
import '../assets/style.css';
import FeaturedCourses from './FeaturedCourses';

export default function Home() {

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState(null);

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
      console.log(response.data.user)
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
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(null);
    }
  };

  return (   
    <div className="container-fluid">
      <Navbar courses={courses} user={user}/> 
      <section className="home-slide">
      <div className="container">
        <div className="row ">
        <div className="mt-5">
          <div className="home-slide-face">
            <div className="mt-5 text-center">
              <h3>The Leader in Online Learning</h3>
              <h1>Engaging & Accessible Online Courses For All</h1>
              <p>Own your future learning new skills online</p>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="girl-slide-img mb-5">
            <img src="/img/kids.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    </section>
    <section className="section student-course">
      <div className="container">
        <div className="course-widget">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="course-full-width">
                <div className="blur-border course-radius align-items-center" data-aos="fade-up">
                  <div className="online-course d-flex align-items-center">
                    <div className="course-img">
                      <img src="/img/pencil-icon.svg" alt="" />
                    </div>
                    <div className="course-inner-content">
                      <h4><span>10</span>K</h4>
                      <p>Online Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="course-full-width">
                <div className="blur-border course-radius" data-aos="fade-up">
                  <div className="online-course d-flex align-items-center">
                    <div className="course-img">
                      <img src="/img/cources-icon.svg" alt="" />
                    </div>
                    <div className="course-inner-content">
                      <h4><span>200</span>+</h4>
                      <p>Expert Tutors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="course-full-width">
                <div className="blur-border course-radius" data-aos="fade-up">
                  <div className="online-course d-flex align-items-center">
                    <div className="course-img">
                      <img src="/img/certificate-icon.svg" alt="" />
                    </div>
                    <div className="course-inner-content">
                      <h4><span>6</span>K+</h4>
                      <p>Certified Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="course-full-width">
                <div className="blur-border course-radius" data-aos="fade-up">
                  <div className="online-course d-flex align-items-center">
                    <div className="course-img">
                      <img src="/img/gratuate-icon.svg" alt="" />
                    </div>
                    <div className="course-inner-content">
                      <h4><span>60</span>K +</h4>
                      <p>Online Students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <FeaturedCourses/>

    <section className="section master-skill">
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="" data-aos="fade-up">
              <div className="section-sub-head">
                <span>What’s New</span>
                <h2>Master the skills to drive your career</h2>
              </div>
            </div>
            <div className="" data-aos="fade-up">
              <p>Get certified, master modern tech skills, and level up your career — whether you’re starting out or a seasoned pro. <br></br>95% of eLearning learners report our hands-on content directly helped their careers.</p>
            </div>
            <div className="career-group" data-aos="fade-up">
              <div className="row">
                <div className="col-lg-6 col-md-6 d-flex">
                  <div className="certified-group blur-border d-flex">
                    <div className="get-certified d-flex align-items-center">
                      <div className="blur-box">
                        <div className="certified-img">
                          <img src="/img/icon-1.svg" alt="" className="img-fluid" />
                        </div>
                      </div>
                      <p>Stay motivated with engaging instructors</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 d-flex">
                  <div className="certified-group blur-border d-flex">
                    <div className="get-certified d-flex align-items-center">
                      <div className="blur-box">
                        <div className="certified-img">
                          <img src="/img/icon-2.svg" alt="" className="img-fluid" />
                        </div>
                      </div>
                      <p>Keep up with in the latest in cloud</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 d-flex">
                  <div className="certified-group blur-border d-flex">
                    <div className="get-certified d-flex align-items-center">
                      <div className="blur-box">
                        <div className="certified-img">
                          <img src="/img/icon-3.svg" alt="" className="img-fluid" />
                        </div>
                      </div>
                      <p>Get certified with 100+ certification courses</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 d-flex">
                  <div className="certified-group blur-border d-flex">
                    <div className="get-certified d-flex align-items-center">
                      <div className="blur-box">
                        <div className="certified-img">
                          <img src="/img/icon-4.svg" alt="" className="img-fluid" />
                        </div>
                      </div>
                      <p>Build skills your way, from labs to courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-lg-5 col-md-12 d-flex align-items-end">
            <div className="career-img" data-aos="fade-up">
              <img src="/img/join.png" alt="" className="img-fluid" />
            </div>
          </div> */}
        </div>
      </div>
    </section>
    <VideoSection/>

      {/* <div className="row">
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
      </div> */}
      <Footer/>
    </div>
  );
}
