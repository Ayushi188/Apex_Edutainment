import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './Navbar';
import Footer from './Footer';

const StudentEnrollment = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [studentEnrollments, setStudentEnrollments] = useState([]);

  // Fetch courses from the backend when the component mounts
  useEffect(() => {
    fetchUser();
    fetchCourses();
  }, []);

  // Function to fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/all-courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(response.data.user);
      fetchStudentEnrollments(response.data.user.userId);

      console.log('user fetched:');
    } catch (error) {
      // Handle error, e.g., token expired or invalid
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const fetchStudentEnrollments = async (userId) => {
    try {
        console.log('fetchStudentEnrollments')

      const response = await axios.get(`http://localhost:3001/api/student-enrollments/${userId}`);
      setStudentEnrollments(response.data);

      
      response.data.forEach(enrollment => {
            const checkbox = document.getElementById(`course-${enrollment.courseId}`);
            if (checkbox) {
              checkbox.checked = true;
            }
          });
     
      
   
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
    }
  };



// Function to handle enrollment confirmation
const handleEnrollmentConfirmation = async (courseId) => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to enroll in this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, enroll me!'
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.post('http://localhost:3001/api/enroll', {
          courseId,
          userId: user.userId // Assuming user is already fetched and stored in the state
        });
        console.log('Enrollment successful:', response.data);
        await Swal.fire('Success', 'Enrollment successful!', 'success');
      } catch (error) {
        console.error('Error enrolling in courses:', error);
        await Swal.fire('Error', 'Failed to enroll in courses. Please try again later.', 'error');
      }
    }
  };
  
  // Function to handle unenrollment confirmation
  const handleUnenrollmentConfirmation = async (courseId) => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to remove this course from your enrollment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/course-enrollments/${user.userId}/${courseId}`);
        fetchStudentEnrollments(user.userId);
        Swal.fire('Success', 'Course removed from enrollment', 'success');
      } catch (error) {
        console.error('Error removing enrollment:', error);
        Swal.fire('Error', 'Failed to remove course from enrollment. Please try again later.', 'error');
      }
    }
  };
  
  // Main function to handle checkbox change
  const handleCheckboxChange = async (courseId, event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      await handleEnrollmentConfirmation(courseId);
    } else {
      await handleUnenrollmentConfirmation(courseId);
    }
  };
  

  return (
    <div>
      {courses && user &&
          <Navbar courses={courses} user={user}/> 
      }

        <div className='mt-5'>
            <span className="student-enrollment">List Of Available Course</span><br></br>
            <span >(*Click to Enroll / Uncheck to Remove)</span>

        </div>
        {courses.map(course => (
            <div key={course._id} className="mt-5 card shadow-sm" style={{ height: '200px' }}>
            <div className="row">
                <div className="col-3">
                    <img src={'http://localhost:3001/'+course.imagePath} width="150px" height="150px" alt={course.name} />
                </div>
                <div className="col-8">
                    <h5 className="courseEnrollTitle">{course.name}</h5>
                    <p className="courseEnrollDesc">{course.description}</p>
                </div>
                <div className="col-1">
                <div className="form-check">
                <input 
                    className="form-check-input me-1" type="checkbox" 
                    id={'course-'+course._id}
                    style={{ width: '40px', height: '40px', color: 'red', boxShadow: '#ee4141 0px 0px 5px' }} 
                    value={course._id} aria-label="..." onChange={() => handleCheckboxChange(course._id,event)} 
                />
                </div>
                </div>
            </div>
            </div>
        ))}

      <Footer/>

    </div>
  );
};

export default StudentEnrollment;
