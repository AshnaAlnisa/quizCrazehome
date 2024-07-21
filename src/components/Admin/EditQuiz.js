import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/editQuiz.css';

const EditQuiz = ({ quizzes, setQuizzes }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questionData, setQuestionData] = useState({
    text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: ''
  });

  useEffect(() => {
    // Find the quiz with the given ID
    const quizToEdit = quizzes.find(q => q.id === parseInt(id));
    if (quizToEdit) {
      setQuiz(quizToEdit);
    }
  }, [id, quizzes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleUpdateQuestion = (e) => {
    e.preventDefault();
    if (quiz) {
      const updatedQuestions = quiz.questions.map(q => 
        q.id === parseInt(id) ? {
          ...q,
          text: questionData.text,
          options: [
            questionData.option1,
            questionData.option2,
            questionData.option3,
            questionData.option4
          ],
          correctAnswer: questionData.correctAnswer
        } : q
      );
      const updatedQuiz = { ...quiz, questions: updatedQuestions };
      const updatedQuizzes = quizzes.map(q => q.id === quiz.id ? updatedQuiz : q);
      setQuizzes(updatedQuizzes);
      navigate('/admin/quiz-management'); // Redirect to quiz management
    }
  };

  const handleCancelEdit = () => {
    navigate('/admin/quiz-management'); // Redirect to quiz management
  };

  return (
    <div className="edit-quiz">
      <h3>Edit Question</h3>
      {quiz && (
        <form onSubmit={handleUpdateQuestion}>
          <div>
            <label>Question Text:</label>
            <input
              type="text"
              name="text"
              value={questionData.text}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Option 1:</label>
            <input
              type="text"
              name="option1"
              value={questionData.option1}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Option 2:</label>
            <input
              type="text"
              name="option2"
              value={questionData.option2}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Option 3:</label>
            <input
              type="text"
              name="option3"
              value={questionData.option3}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Option 4:</label>
            <input
              type="text"
              name="option4"
              value={questionData.option4}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Correct Answer:</label>
            <input
              type="text"
              name="correctAnswer"
              value={questionData.correctAnswer}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Update</button>
          <button type="button" onClick={handleCancelEdit}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditQuiz;
