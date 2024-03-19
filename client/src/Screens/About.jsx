import React, { useState, useEffect } from "react";
import Navbar from './Navbar';
import Footer from './Footer';
import '../assets/AboutStyle.css'; 

export default function Home() {
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
      file: null
    });
  
    const [errors, setErrors] = useState({
      name: '',
      email: '',
      message: ''
    });

    useEffect(() => {
      if (submissionStatus === 'success') {
        const timer = setTimeout(() => {
          setSubmissionStatus(null);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [submissionStatus]);

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData({
        ...formData,
        [name]: name === 'file' ? files[0] : value
      });
      setErrors({
        ...errors,
        [name]: ''
      });
    };
  
    const validateForm = () => {
      let valid = true;
      const newErrors = { ...errors };
  
      if (formData.name.trim() === '') {
        newErrors.name = 'Name is required';
        valid = false;
      }
  
      if (formData.email.trim() === '') {
        newErrors.email = 'Email is required';
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        valid = false;
      }
  
      if (formData.message.trim() === '') {
        newErrors.message = 'Message is required';
        valid = false;
      }
  
      setErrors(newErrors);
      return valid;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (validateForm()) {
          try {
            const formDataWithFile = new FormData();
            formDataWithFile.append('name', formData.name);
            formDataWithFile.append('email', formData.email);
            formDataWithFile.append('message', formData.message);
            if (formData.file) {
              formDataWithFile.append('file', formData.file);
            }

            const response = await fetch('http://localhost:3001/api/feedbackForm', {
              method: 'POST',
              body: formDataWithFile,
            });
      
            if (response.ok) {
              setSubmissionStatus('success');
              setFormData({ name: '', email: '', message: '', file: null });
              document.getElementById('fileInput').value = '';

            } else {
              console.error('Failed to submit form');
              setSubmissionStatus('error');
            }
          } catch (error) {
            console.error('Error during form submission', error);
            setSubmissionStatus('error');
          }
        } else {
          console.log('Form validation failed');
          setSubmissionStatus('error');
        }
    };
  return (   
    <div className="container-fluid">
      <Navbar /> 
      <section className="contact spad">
        <div className="container border rounded p-4 shadow-lg mb-5">
          <div className="row">
            <div className="col-md-6">
              <div style={{ padding: '80px' }}>
                <h2 className="mb-4" style={{ textAlign: 'left', color: 'rgb(56 92 194)', fontWeight: 600 }}>
                Ask Us Anything
                </h2>
                <p style={{ textAlign: 'left', fontSize: '20px', fontFamily: 'emoji', color: 'black' }}>
                  Let us know your thoughts, questions, or concerns by filling out the form below. We'll get back to you as soon as possible with helpful information or assistance.
                </p>
              
                <div className="custom-image-container">
                  <picture className="d-inline-block mt-4 mt-md-0">
                    <img
                      loading="lazy"
                      className="img-fluid"
                      src="/img/feebackf.png"
                      title="ApexDevelopment"
                      style={{height:'390px', width:'540px'}}
                      alt="feedback pic"
                    />
                  </picture>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="contact__content">
                <div className="contact__address" style={{padding:'50px'}}>
                  <div className="card mx-auto" style={{ maxWidth: '600px', border: '1px solid #e1e1e1', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <div className="card-body">
                      <div className="contact__form">
                        <h5 className="text-center">Have a Query? Submit it Here!</h5>
                        <p><strong>* Indicates a required field</strong></p>

                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <input type="text" name="name" className="form-control" id="name" value={formData.name} onChange={handleChange} placeholder="Name*" />
                            <span className="text-danger">{errors.name}</span>
                          </div>
                          <div className="form-group">
                            <input type="email" name="email" className="form-control" id="mail" value={formData.email} onChange={handleChange} placeholder="Email*" />
                            <span className="text-danger">{errors.email}</span>
                          </div>
                          <div className="form-group">
                            <textarea className="form-control" name="message" id="message" value={formData.message} onChange={handleChange} placeholder="Message*"></textarea>
                            <span className="text-danger">{errors.message}</span>
                          </div>
                          <div className="form-group">
                            <input type="file" className="form-control" name="file" id="fileInput" onChange={handleChange} />
                          </div>
                          {submissionStatus === 'success' && (
                            <div className="text-success mt-3">Form submitted successfully!</div>
                          )}
                          {submissionStatus === 'error' && (
                            <div className="text-danger mt-3">Failed to submit form. Please try again later.</div>
                          )}
                          <button type="submit" className="btn btn-primary custom-pink-btn" style={{background: 'rgb(56 92 194)',width:'100%'}}>Send Message</button>
                        </form>
                      </div>
                    </div>
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
}
