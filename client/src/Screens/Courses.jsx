import '../assets/style.css';
import Navbar from './Navbar';
import VideoSection from './VideoSection';
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import Footer from './Footer';

const CoursePage = () => {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    // Function to fetch course data when the component mounts
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
        // Handle error, e.g., token expired or invalid
        console.error('Error fetching courses:', error);
        setCourses(null);
      }
    };

    fetchCourses();
  }, []);

  
  const [showForm, setShowForm] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setCourseId('');
    setName('');
    setDescription('');
    setHours('');
    setMinutes('');
    setImageFile(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!courseId) {
      newErrors.courseId = 'Course ID is required.';
    }
    if (!name) {
      newErrors.name = 'Course Name is required.';
    }
    if (!description) {
      newErrors.description = 'Description is required.';
    }
    if (!hours && !minutes) {
      newErrors.duration = 'Duration is required.';
    }
    if (!imageFile) {
      newErrors.image = 'Image is required.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!/^\d+$/.test(courseId)) {
      setErrors({ courseId: 'Course ID should contain only numeric characters.' });
      return;
    }
    try {
      const durationInMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('duration', durationInMinutes);
      formData.append('image', imageFile);
      
      const response = await axios.post('http://localhost:3001/api/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setShowForm(false);
      resetForm();
      window.location.reload(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div className="container-fluid">
      <div className="course-page">
        <Navbar /> 
        <div className="course-welcome">Hi, Welcome</div>
        <VideoSection/>
        <div className="course-header">Courses</div>
        <div className="add-new-course-wrapper">
          <button
            className="add-new-course-button"
            onClick={() => setShowForm(true)}>
            Add New Course
          </button>
        </div>
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
      </div>
      <div>
        <Modal show={showForm} onHide={() => { setShowForm(false); resetForm(); }}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="courseId">
                <Form.Label>Course ID:</Form.Label>
                <Form.Control type="text" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
                {errors.courseId && <Alert variant="danger">{errors.courseId}</Alert>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Course Name:</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <Alert variant="danger">{errors.name}</Alert>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Course Description:</Form.Label>
                <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <Alert variant="danger">{errors.description}</Alert>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="duration">
                <Form.Label>Course Duration:</Form.Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Control type="number" placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
                  <span style={{ margin: '0 10px' }}></span>
                  <Form.Control type="number" placeholder="Minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
                  <span></span>
                </div>
                {errors.duration && <Alert variant="danger">{errors.duration}</Alert>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Course Image:</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
                {errors.image && <Alert variant="danger">{errors.image}</Alert>}
              </Form.Group>
              <Button className="mb-4" style={{ width: '100%' }} variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default CoursePage;
