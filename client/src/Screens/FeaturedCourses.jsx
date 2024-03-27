import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch courses from the backend when the component mounts
  useEffect(() => {
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
    } catch (error) {
      // Handle error, e.g., token expired or invalid
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };
  // Function to fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/all-courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddToCart = async (courseId) => {
    // Check if the user is logged in
    if (!user) {
        // If not logged in, show a popup message to prompt the user to log in
        Swal.fire({
            icon: 'info',
            title: 'Please Login',
            text: 'Please login to add courses to your cart.',
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect the user to the login page
                // Example: history.push('/login');
            }
        });
        return;
    }

    // If the user is logged in, proceed with adding the course to the cart
    try {
        const response = await axios.post(`http://localhost:3001/api/cart/add`, {
            userId: user.userId,
            courseId: courseId
        });
        if(response.status == 200){
          Swal.fire({
            icon: 'warning',
            title: 'Success!',
            text: 'Course Already in cart.',
        });
        }else{
          Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Course added to cart.',
          });
        }
    } catch (error) {
        console.error('Error adding course to cart:', error);
        // Show error message using SweetAlert
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
};

  return (
    <div className='container mt-5'>
      <div className='justify-content-center row mt-5 '>
        <span className="student-enrollment mb-5 mt-5" style={{ color: "#212529" }}>Featured Courses</span><br></br>

        {courses.slice(0, 3).map(course => (
          <div key={course._id} className="col-md-4">
            <div className="course-box trend-box">
              <div className="product trend-product">
                <div className="product-img">
                  <a href="course-details.html">
                    <img height="250px" src={'http://localhost:3001/' + course.imagePath} alt={course.name} />
                  </a>
                  <div className="price">
                    <h3>$200 <span>$99.00</span></h3>
                  </div>
                </div>
                <div className="product-content">
                  <div className="course-group d-flex">
                    <div className="course-group-img d-flex">
                      <a href="instructor-profile.html">
                        <img width="48" height="48" src="https://img.icons8.com/color/48/circled-user-male-skin-type-7--v1.png" alt="circled-user-male-skin-type-7--v1" />
                      </a>
                      <div className="course-name">
                        <h3><a href="instructor-profile.html">Neha Devi</a> <p>Instructor</p></h3>
                      </div>
                    </div>
                    <div className="course-share d-flex align-items-center justify-content-center">
                      <a href="#"><i className="far fa-heart"></i></a>
                    </div>
                  </div>
                  <h3 className="title"><a href="course-details.html">{course.name}</a></h3>
                  <div className="course-info d-flex align-items-center">
                    <div className="rating-img d-flex align-items-center">
                      <img src="/img/icon/icon-01.svg" alt="" className="img-fluid" />
                      <p>13+ Lesson</p>
                    </div>
                    <div className="course-view d-flex align-items-center">
                      <img src="/img/icon/icon-02.svg" alt="" className="img-fluid" />
                      <p>10hr 30min</p>
                    </div>
                  </div>
                  <div className="rating">
                    <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji" />
                    <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji" />
                    <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji" />
                    <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji" />
                    <span className="d-inline-block average-rating"><span>4.0</span> (15)</span>
                  </div>
                  <div className="all-btn all-category d-flex align-items-center">
                    {/* <Link to="/checkout" className="btn btn-primary ">Buy Now</Link> */}
                    <button className="btn btn-primary" onClick={() => handleAddToCart(course._id)}>Add To Cart</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCourses;
