import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const QuizForm = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get('courseId');
  //console.log('courseId:', courseId);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', image: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleImageChange = (e, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].image = e.target.files[0];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (e, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOptionIndex = parseInt(e.target.value);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('courseId', courseId);
      questions.forEach((question, index) => {
        formData.append(`questions[${index}][text]`, question.text);
        formData.append(`questions[${index}][image]`, question.image);
        formData.append(`questions[${index}][options]`, JSON.stringify(question.options));
        formData.append(`questions[${index}][correctOptionIndex]`, question.correctOptionIndex);
      });
      await axios.post('http://localhost:3001/api/quizzes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/coursecontent?courseId=${courseId}`);

    } catch (error) {
      console.error('Error creating quiz:', error);
      navigate(`/coursecontent?courseId=${courseId}`);

    }
  };

  return (
    <div className="container">
      <h2>Create Quiz</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Enter quiz title" value={title} onChange={handleTitleChange} />
      </div>
      {questions.map((question, index) => (
        <div className="card mb-3" key={index}>
          <div className="card-body">
            <input type="text" className="form-control mb-3" placeholder="Enter question" value={question.text} onChange={(e) => handleQuestionChange(e, index)} />
            <input type="file" className="form-control mb-3" accept="image/*" onChange={(e) => handleImageChange(e, index)} />
            {question.options.map((option, optionIndex) => (
              <div className="mb-3" key={optionIndex}>
                <input type="text" className="form-control" placeholder={`Option ${optionIndex + 1}`} value={option} onChange={(e) => handleOptionChange(e, index, optionIndex)} />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label">Correct Answer:</label>
              <select className="form-select" value={question.correctOptionIndex} onChange={(e) => handleCorrectOptionChange(e, index)}>
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>Option {optionIndex + 1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-primary mb-3" onClick={handleAddQuestion}>Add Question</button>
      <button className="btn btn-success" onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};

export default QuizForm;
