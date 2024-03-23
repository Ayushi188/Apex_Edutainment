import Navbar from './Navbar';
import React, { useState, useEffect,useRef } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import '../assets/CourseContentStyle.css';
import { Container, Image, Button, Card, Modal, Form } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import 'bootstrap/dist/css/bootstrap.min.css';
  
const CourseContent = () => {
    const [courses, setCourses] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [videos, setVideos] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const formRef = useRef(null);
    const [fileInfo, setFileInfo] = useState(null);
    const [file, setFile] = useState(null);

    //file starts
    const handleClose = () => setShowFileModal(false);
    const handleShow = () => setShowFileModal(true);
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    //file ends
    const handleCourseIdChange = (event) => {
        setCourseId(event.target.value);
      };
    const handleButtonClick = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddVideo = () => {
        setVideos([...videos, '']);
    };
    const handleChange = (index, event) => {
        const newVideos = [...videos];
        newVideos[index] = event.target.value;
        setVideos(newVideos);
    };
    
    
    useEffect(() => {
      
      const fetchFile = async () => {
        try {
          const courseId = '7'; 
          //const response = await axios.get('http://localhost:3001/api/courseId');
         //const courseId = response.data.courseId;
          const response = await axios.get(`http://localhost:3001/api/file/${courseId}`);
          
          setFileInfo(response.data.file);
        } catch (error) {
          console.error('Error fetching file:', error);
        }
      };
      const fetchVideos = async () => {
            try {
                //const courseId = '19'; 

                const response = await axios.get(`http://localhost:3001/api/videos/${courseId}`);
                setVideos(response.data.videos);
            } catch (error) {
               // console.error('Error fetching videos:', error);
            }
        };

      fetchVideos();
      fetchFile(); 
      fetchUserRole();
      fetchCourses();
    }, []);
    const fetchUserRole = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/user/role', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUserRole(response.data.role);
        } catch (error) {
            console.error('Error fetching user role:', error);
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
        console.error('Error fetching courses:', error);
        setCourses(null);

      }
    };
    const handleSubmit = async () => {
        try {
            for (const videoUrl of videos) {
                const response = await axios.post('http://localhost:3001/api/submitVideos', { courseId, videoUrl });
                console.log('Response:', response); // Check the response data in the console
                console.log('Videos submitted successfully');
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error submitting videos:', error);
        }
    };
    const handleSubmitFile = async () => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('courseId', courseId);

          // Send the file to the server
          const response = await axios.post('http://localhost:3001/api/file', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          console.log('File uploaded successfully:', response.data);
          
          // Reset the form fields
          formRef.current.reset();

         // setFile(null);
         // setCourseId('');
          setShowModal(false);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      // Function to toggle collapse state
        const toggleCollapse = () => {
        setIsOpen(!isOpen);
        };
  return (
    <div className="container-fluid">
        <Navbar/>
        <div className="inner-banner">
            <div className="container">
            <div className="row">
                <div className="col-lg-8">
                <div className="instructor-wrap border-bottom-0 m-0">
                    <div className="about-instructor align-items-center">
                    <div className="abt-instructor-img">
                        <a href="instructor-profile.html">
                        <img width="48" height="48" src="https://img.icons8.com/color/48/circled-user-male-skin-type-7--v1.png" alt="circled-user-male-skin-type-7--v1"/></a>
                    </div>
                    <div className="instructor-detail me-3">
                        <h5><a href="instructor-profile.html">Nicole Brown</a></h5>
                    </div>
                    <div className="rating mb-0">
                    <img width="30" height="30" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji"/>                              
                                <img width="30" height="30" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji"/>
                                <img width="30" height="30" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji"/>
                                <img width="30" height="30" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji"/>
                        <span className="d-inline-block average-rating"><span>4.5</span> (15)</span>
                    </div>
                    </div>
                    <span className="web-badge mb-3">Learn Mathematics</span>
                </div>
                <h2>The Complete Mathematics Course</h2>
                <p>Explore mathematics: concepts, problem-solving, real-world applications, in-depth understanding.</p>
                <div className="course-info d-flex align-items-center border-bottom-0 m-0 p-0">
                    <div className="cou-info">
                    <img src="/img/icon/icon-01.svg" alt="" />
                    <p>12+ Lesson</p>
                    </div>
                    <div className="cou-info">
                    <img src="/img/icon/timer-icon.svg" alt="" />
                    <p>9hr 30min</p>
                    </div>
                    <div className="cou-info">
                    <img src="/img/icon/people.svg" alt="" />
                    <p>32 students enrolled</p>
                    </div>
                </div>
                </div>
            </div></div>
        </div>
        <section className="page-content course-sec">
        <div className="container">
            <div className="row">
            <div className="col-lg-8">

            <div className="card overview-sec">
            <div className="card-body">
                <h5 className="subs-title">Overview</h5>
                <h6>Course Description</h6>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                <p> {courses && courses.map(course => (
                      <p key={course.courseId}>
                        <p>{course.description}</p>
                      </p>
                    ))}
                </p>
                <h6>Requirements</h6>
                <ul>                    
                    <li>You'll need a reliable computer or laptop to create course content, manage your course platform, and interact with students.</li>
                    <li>Create a quiet and distraction-free workspace where you can focus on course creation, and ensure you have a stable and high-speed internet connection for uploading and downloading course materials and hosting live sessions.</li>
                </ul>
            </div>
            </div>
          {userRole === 'student' && (
            <div className="card content-sec">
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-6">
                            <h5 className="subs-title">Course Content</h5>
                        </div>
                        <div className="col-sm-6 text-sm-end">
                            <h6>10 Lectures 10:56:11</h6>
                        </div>
                    </div>
                    <div className="course-card">
                        <h6 className="cou-title">
                        <a
                            className={`collapsed ${isOpen ? 'show' : ''}`}
                            onClick={toggleCollapse}
                            aria-expanded={isOpen ? 'true' : 'false'}
                        >
                            Quiz
                        </a>
                        </h6>
                        <div id="collapseOne" className={`card-collapse collapse ${isOpen ? 'show' : ''}`}>
                        <ul>
                            <li>
                            <p><img src="assets/img/icon/play.svg" alt="" className="me-2" />Quiz 1</p>
                            <div>
                                <a href="javascript:void(0);">Attempt Quiz 1</a>
                            </div>
                            </li>
                            <li>
                            <p><img src="assets/img/icon/play.svg" alt="" className="me-2" />Quiz 2</p>
                            <div>
                                <a href="javascript:void(0);">Attempt Quiz 2</a>
                            </div>
                            </li>
                        </ul>
                        </div>
                    </div>
                    <div className="course-card">
                        <h6 className="cou-title">
                        <a
                            className={`collapsed ${isOpen ? 'show' : ''}`}
                            onClick={toggleCollapse}
                            aria-expanded={isOpen ? 'true' : 'false'}
                        >
                            Video Content
                        </a>
                        </h6>
                        <div id="collapseOne" className={`card-collapse collapse ${isOpen ? 'show' : ''}`}>
                        <ul>
                            
                            {videos.map((video, index) => (
                                
                                    <li key={index}>
                                        <p><img src="assets/img/icon/play.svg" alt="" className="me-2" />Video Content</p>
                                        <div>
                                            <a href={video.videoUrl}>Watch Video {index + 1}</a>
                                        </div>
                                    </li>
                            ))}
                            {/* <li>
                            <p><img src="assets/img/icon/play.svg" alt="" className="me-2" />Lecture1.1 Introduction to the Course</p>
                            <div>
                                <a href="javascript:void(0);">Watch Video 1</a>
                            </div>
                            </li>
                            <li>
                            <p><img src="assets/img/icon/play.svg" alt="" className="me-2" />Lecture1.2 Advance Level</p>
                            <div>
                                <a href="javascript:void(0);">Watch Video 2</a>
                            </div>
                            </li> */}
                        </ul>
                        </div>
                    </div>
                    <div className="course-card">
                        <h6 className="cou-title">
                        <a
                            className={`collapsed ${isOpen ? 'show' : ''}`}
                            onClick={toggleCollapse}
                            aria-expanded={isOpen ? 'true' : 'false'}
                        >
                            Extra Material
                        </a>
                        </h6>
                        <div id="collapseOne" className={`card-collapse collapse ${isOpen ? 'show' : ''}`}>
                        <ul>
                            <li>
                            <p><img src="assets/img/icon/play.svg" alt="" className="me-2" />Extra content of this course</p>
                            <div>
                                {fileInfo ? (
                                    <a href={fileInfo.path} target="_blank" rel="noopener noreferrer">Read Here</a>
                                    // <a href={`/uploads/${fileInfo.filename}`} target="_blank" rel="noopener noreferrer">Read Here</a>

                                ) : (
                                    <p>No extra material available</p>
                                )}
                                {/* <a href="javascript:void(0);">Read Here</a> */}
                            </div>
                            </li>
                            
                        </ul>
                        </div>
                    </div>
                </div>
            </div>)}
            {userRole === 'teacher' && (
            <div className="card content-sec">
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-6">
                        <h5 className="subs-title">Course Content</h5>
                    </div>
                    <div className="col-sm-6 text-sm-end">
                        <h6>10 Lectures 10:56:11</h6>
                    </div>
                </div>
                <div className="course-card">
                    <h6 className="cou-title">
                    <a
                        className={`collapsed ${isOpen ? 'show' : ''}`}
                        onClick={toggleCollapse}
                        aria-expanded={isOpen ? 'true' : 'false'}
                    >
                        Quiz
                    </a>
                    </h6>
                    <div id="collapseOne" className={`card-collapse collapse ${isOpen ? 'show' : ''}`}>
                    <ul className="list-unstyled mb-0">
                        <li>
                            <Button variant="primary" className="custom-button">Add Quiz</Button>
                        </li>
                    </ul>
                    </div>
                </div>
                <div className="course-card">
                    <h6 className="cou-title">
                    <a
                        className={`collapsed ${isOpen ? 'show' : ''}`}
                        onClick={toggleCollapse}
                        aria-expanded={isOpen ? 'true' : 'false'}
                    >
                        Video Content
                    </a>
                    </h6>
                    <div id="collapseOne" className={`card-collapse collapse ${isOpen ? 'show' : ''}`}>
                    <Button variant="primary" onClick={handleButtonClick}>Open Video Submission</Button>
                    <Modal show={showModal} onHide={handleCloseModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Video Submission</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>     
                            <Form.Group controlId="formCourseId">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter course ID"
                                    value={courseId}
                                    onChange={handleCourseIdChange}
                                />
                            </Form.Group>                     
                                {videos.map((videoUrl, index) => (
                                    <Form.Group key={index}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter video URL"
                                            value={videoUrl}
                                            onChange={(e) => handleChange(index, e)}
                                        />
                                    </Form.Group>
                                ))}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleAddVideo}>Add Video</Button>
                            <Button variant="primary" onClick={handleSubmit}>Submit Videos</Button>
                        </Modal.Footer>`
                    </Modal>
                   
                    </div>
                </div>
                <div className="course-card">
                    <h6 className="cou-title">
                    <a
                        className={`collapsed ${isOpen ? 'show' : ''}`}
                        onClick={toggleCollapse}
                        aria-expanded={isOpen ? 'true' : 'false'}
                    >
                        Extra Material
                    </a>
                    </h6>
                    <div id="collapseOne" className={`card-collapse collapse ${isOpen ? 'show' : ''}`}>
                    <Button variant="primary" onClick={handleShow}>Add Extra Reading Material</Button>
                    <Modal show={showFileModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Upload File</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form ref={formRef}>
                            <Form.Group controlId="formCourseId" className="mb-3">
                            <Form.Label>Course ID</Form.Label>
                                <Form.Control type="text" placeholder="Enter Course ID" value={courseId} onChange={handleCourseIdChange} />
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Choose File</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmitFile}>
                            Submit
                        </Button>
                        </Modal.Footer>
                    </Modal>
                   
                    </div>
                </div>
            </div>
        </div>
        )}
            </div>
            <div className="col-lg-4">
            <div className="sidebar-sec">
                <div className="video-sec vid-bg">
                    <div className="card">
                        <div className="card-body">
                        
                        <ReactPlayer
                            url="https://www.youtube.com/embed/1trvO6dqQUI" 
                            width="100%"
                            height="300px"
                            controls={true}
                            className="video-thumbnail"
                        />
                        
                        <div className="video-details">
                            <div className="course-fee">
                            <h2>FREE</h2>
                            <p><span>$50.00</span></p>
                            </div>
                            <div className="row gx-2">
                            <div className="col-md-6">
                                <a href="#" className="btn btn-wish w-100"><i className="feather-heart"></i> Add to cart</a>
                            </div>
                            <div className="col-md-6">
                                <a href="javascript:void(0);" className="btn btn-wish w-100"><i className="feather-share-2"></i> Share</a>
                            </div>
                            </div>
                            <a href="#" className="btn btn-enroll w-100">Buy Now</a>
                        </div>
                        </div>
                    </div>
                </div>





                <div className="card include-sec">
                <div className="card-body">
                    <div className="cat-title">
                    <h4>Includes</h4>
                    </div>
                    <ul>
                    <li><img src="/img/icon/import.svg" className="me-2" alt=""/> 11 hours on-demand video</li>
                    <li><img src="/img/icon/play.svg" className="me-2" alt=""/> 69 downloadable resources</li>
                    <li><img src="/img/icon/key.svg" className="me-2" alt=""/> Full lifetime access</li>
                    <li><img src="/img/icon/mobile.svg" className="me-2" alt=""/> Access on mobile and TV</li>
                    <li><img src="/img/icon/cloud.svg" className="me-2" alt=""/> Assignments</li>
                    <li><img src="/img/icon/teacher.svg" className="me-2" alt=""/> Certificate of Completion</li>
                    </ul>
                </div>
                </div>

                <div className="card feature-sec">
                <div className="card-body">
                    <div className="cat-title">
                    <h4>Features</h4>
                    </div>
                    <ul>
                    <li><img src="/img/icon/users.svg" className="me-2" alt=""/> Enrolled: <span>32 students</span></li>
                    <li><img src="/img/icon/timer.svg" className="me-2" alt=""/> Duration: <span>20 hours</span></li>
                    <li><img src="/img/icon/chapter.svg" className="me-2" alt=""/> Chapters: <span>15</span></li>
                    <li><img src="/img/icon/video.svg" className="me-2" alt=""/> Video: <span>12 hours</span></li>
                    <li><img src="/img/icon/chart.svg" className="me-2" alt=""/> Level: <span>Beginner</span></li>
                    </ul>
                </div>
                </div>
            </div>
            </div>
            </div>
        </div>
        </section>
        <Footer/>
    </div>
  );
};

export default CourseContent;
