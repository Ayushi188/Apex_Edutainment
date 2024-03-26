import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizAttempt = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/quizzes/${quizId}`);
        setQuiz(response.data);
        // Initialize answers array with default values
        const defaultAnswers = response.data.quiz.questions.map(question => '');
        setAnswers(defaultAnswers);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (e, index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      // Submit answers to the backend
      await axios.post(`http://localhost:3001/api/quizzes/${quizId}/attempt`, { answers });
      // Redirect or show a success message
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      // Handle error appropriately
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Attempt Quiz</h2>
      <p>{quiz.title}</p>
      {quiz.questions.map((question, index) => (
        <div className="card mb-3" key={index}>
          <div className="card-body">
            <p>{question.text}</p>
            {question.options.map((option, optionIndex) => (
              <div className="form-check" key={optionIndex}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={(e) => handleOptionChange(e, index)}
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};

export default QuizAttempt;
