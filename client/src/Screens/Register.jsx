import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap"; // Added imports for modal
import "../assets/style.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    reEmail: "",
    password: "",
    age: "",
    parentEmail: "",
    school: "",
    role:"teacher",
    approved: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [registrationRole, setRegistrationRole] = useState("teacher");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleToggleClick = (role) => {
    setRegistrationRole(role);
    formData.role = role;
    if (type === "teacher") {
      document.getElementById("teacherBtn").classList.remove("btn-success");
      document.getElementById("teacherBtn").classList.add("btn-dark");
      document.getElementById("studentBtn").classList.remove("btn-dark");
      document.getElementById("studentBtn").classList.add("btn-success");
    } else {
      document.getElementById("studentBtn").classList.remove("btn-success");
      document.getElementById("studentBtn").classList.add("btn-dark");
      document.getElementById("teacherBtn").classList.remove("btn-dark");
      document.getElementById("teacherBtn").classList.add("btn-success");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formValidation = async (event) => {
    event.preventDefault();

    // Validate the form
    const formErrors = validateForm();

    // Check if there are any errors
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Update the errors state with the validation errors
      setShowModal(true); // Show the modal with errors
      return; // Exit the function if there are errors
    }

    try {
      // Send the form data to the server
      const response = await axios.post(
        "http://localhost:3001/register",
        formData
      );

      if (response.status === 201) {
        console.log("User registered successfully");
        // setErrors('User registered successfully');
        if (response.data.userId) {
          sessionStorage.setItem("userId", response.data.userId);
        }
        setErrors({}); // Clear any previous errors
        setSuccessMessage("User registered successfully");
        // Clear form data
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          reEmail: "",
          password: "",
          age: "",
          parentEmail: "",
          school: "",
          role: "teacher",
          approved: false,
        });
      } else if (response.status === 409) {
        setErrors({ user: "User already exists" });
        setSuccessMessage("");
      } else {
        setErrors({ user: "User registration failed" });
        setSuccessMessage("");
      }
    } catch (error) {
      if (error.response.status === 409) {
        setErrors({ user: "User already exists" });
      } else {
        console.error("Error during registration:", error.message);
        setErrors({ user: error.message });
      }
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    let errors = {};

    // Validate First Name
    if (!formData.firstName.trim()) {
      errors.firstName = "Kindly Enter First Name";
    }

    // Validate Last Name
    if (!formData.lastName.trim()) {
      errors.lastName = "Kindly Enter Last Name";
    }

    // Validate Email
    if (!formData.email.trim()) {
      errors.email = "Kindly Enter Email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Kindly Enter a valid email address";
    }

    if (!formData.reEmail.trim()) {
      errors.reEmail = "Kindly Enter Re-Email";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.reEmail)) {
      errors.email = "Kindly Enter a valid re-email address";
    }

    // Validate Re-entered Email
    if (formData.email !== formData.reEmail) {
      errors.reEmail = "Emails do not match";
    }

    // Validate Password
    if (!formData.password.trim()) {
      errors.password = "Kindly Enter Password";
    }

    // Validate Age
    if (!formData.age.trim()) {
      errors.age = "Kindly Enter Age";
    }

    // Validate Phone Number
    if (!formData.parentEmail.trim()) {
      if (formData.role === "teacher") {
        errors.parentEmail = "Kindly Enter Phone No";
      } else {
        errors.parentEmail = "Kindly Enter Parent/Guardian Email";
      }
    } else if (
      !/^\d{10}$/.test(formData.parentEmail) &&
      formData.role === "teacher"
    ) {
      errors.parentEmail = "Kindly Enter a valid 10-digit phone number";
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.parentEmail) &&
      formData.role === "student"
    ) {
      errors.parentEmail = "Kindly Enter a valid email address";
    }

    // Validate Subject
    // if (!formData.school.trim()) {
    //   if (formData.role === "teacher")
    //     errors.school = "Kindly Enter Subject";
    //   else errors.school = "Kindly Enter Class";
    // }

    return errors;
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-10">
          <div
            className="card mt-5"
            style={{ backgroundColor: "rgb(176 197 245)" }}
          >
            <div className="card-body">
              <div className="row  align-items-center">
                <div className="col-md-4">
                  <h4 className="card-title mb-4 mt-4 txt-login-signup">
                    Sign Up
                  </h4>
                </div>
                <div className="col-md-5"></div>
                <div className="col-md-3">
                  <div className="btn-group btn-group-sm justify-content-end mb-3">
                    <button
                      id="teacherBtn"
                      type="button"
                      className={`btn ${
                        registrationRole === "teacher"
                          ? "btn-success active"
                          : "btn-dark active"
                      }`}
                      onClick={() => handleToggleClick("teacher")}
                    >
                      Teacher
                    </button>
                    <button
                      id="studentBtn"
                      type="button"
                      className={`btn ${
                        registrationRole === "student"
                          ? "btn-success active"
                          : "btn-dark active"
                      }`}
                      onClick={() => handleToggleClick("student")}
                    >
                      {" "}
                      Student{" "}
                    </button>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Section for the image */}
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <img
                    src="img/signup7.jpeg"
                    style={{ width: "800px", transform: "scale(1.1)" }}
                    alt="Registration"
                    className="img-fluid"
                  />
                </div>

                {/* Section for the input fields */}
                <div className="col-md-8">
                  <form onSubmit={formValidation}>
                    {/* First half of the input fields */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="">
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="Enter First Name"
                            onChange={handleInputChange}
                            value={formData.firstName}
                          />
                        </div>
                        <div className="">
                          <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Enter Last Name"
                            onChange={handleInputChange}
                            value={formData.lastName}
                          />
                        </div>
                        <div className="">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter Email"
                            onChange={handleInputChange}
                            value={formData.email}
                          />
                        </div>
                        <div className="">
                          <input
                            type="email"
                            className="form-control"
                            id="reEmail"
                            placeholder="Re-Enter Email"
                            onChange={handleInputChange}
                            value={formData.reEmail}
                          />
                        </div>
                      </div>

                      {/* Second half of the input fields */}
                      <div className="col-md-6">
                        <div className="">
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            onChange={handleInputChange}
                            value={formData.password}
                          />
                        </div>
                        <div className="">
                          <input
                            type="number"
                            className="form-control"
                            id="age"
                            placeholder="Enter Age"
                            onChange={handleInputChange}
                            value={formData.age}
                          />
                        </div>
                        {registrationRole !== "teacher" ? (
                          <div className="">
                            <input
                              type="email"
                              className="form-control"
                              id="parentEmail"
                              placeholder="Enter Parent/Guardian Email"
                              onChange={handleInputChange}
                              value={formData.parentEmail}
                            />
                          </div>
                        ) : (
                          <div className="">
                            <input
                              type="text"
                              className="form-control"
                              id="parentEmail"
                              placeholder="Enter Phone No"
                              onChange={handleInputChange}
                              value={formData.parentEmail}
                            />
                          </div>
                        )}

                        {registrationRole !== "teacher" ? (
                          <div className="">
                            <input
                              type="text"
                              className="form-control"
                              id="school"
                              placeholder="Enter Class"
                              onChange={handleInputChange}
                              value={formData.school}
                            />
                          </div>
                        ) : (
                          <div className="">
                            <input
                              type="text"
                              className="form-control"
                              id="school"
                              placeholder="Enter Subject"
                              onChange={handleInputChange}
                              value={formData.school}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {successMessage && <div className="text-success mt-2">{successMessage}</div>}
                    <div>
                      <button
                        type="submit"
                        className="btn-submit btn-primary"
                        style={{
                          backgroundColor: "rgb(8 54 117)",
                          fontFamily: "Luminari, fantasy",
                          borderColor: "rgb(8 54 117)",
                        }}
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>
                  <div className="mt-3 txt-register">
                    <span>Already have an account?</span>
                    <Link to="/login" className="ms-2 btn-register">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying errors */}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Errors</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          {Object.keys(errors).map((field) => (
            <p key={field}>{errors[field]}</p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUp;
