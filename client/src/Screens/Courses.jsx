import '../assets/style.css';
import Navbar from './Navbar';
import Footer from './Footer';
import VideoSection from './VideoSection';
import React, { useState } from "react";

const CoursePage = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Math",
      image: "img/Maths.png", 
      description: "This course is designed to strengthen your skills, covering essential concepts such as counting, addition, subtraction, and division. Join us on a adventure to sharpen your problem-solving abilities and cultivate a love for numbers.",
    },
    {
      id: 2,
      title: "English",
      image: "img/English.png", 
      description: "In this course, you will delve into the art of word pronunciation, master spellings, and refine your sentence formation. Unlock the keys to effective communication and boost your confidence in English language proficiency.",
    },
  ]);

  const addNewCourse = (title, image, description) => {
    const newCourse = {
      id: courses.length + 1,
      title,
      image,
      description,
    };

    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  return (
    <div className="course-page">
        <Navbar /> 
        <div className="course-welcome">Hi, Welcome</div>
      <VideoSection/>
      <div className="course-header">Courses</div>
      <div className="add-new-course-wrapper">
        <button
          className="add-new-course-button"
          onClick={() =>
            addNewCourse(
              prompt("Enter course title"),
              prompt("Enter course image URL"),
              prompt("Enter course description")
            )
          }
        >
          Add New Course
        </button>
      </div>
      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button>View Course</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;