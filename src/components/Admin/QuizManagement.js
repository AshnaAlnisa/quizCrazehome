import React, { useState, useEffect } from 'react';
import '../../styles/quizManagement.css';
import axios from 'axios';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [quizData, setQuizData] = useState({ title: '', description: '', questions: [] });
  const [questionData, setQuestionData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  useEffect(() => {
    const fetchQuizzes1 = async () => {
      try {
        const response = await axios.post('http://localhost:5164/viewQuiz', { eventID: "1001" });

        if (response.status === 200) {
          const responseData = response.data;
          if (responseData.rData && responseData.rData.items) {
            setQuestionData({title: responseData.rData.items});
            console.log("Quizzes:", responseData.rData.items);
          } else {
            console.log("No quizzes data in response");
          }
        }
      } catch (error) {
        setError("Error fetching quizzes: " + error.message);
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes1();
  }, []);


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.post('http://localhost:5164/viewCardQuiz', { eventID: "1001" });

        if (response.status === 200) {
          const responseData = response.data;
          if (responseData.rData && responseData.rData.items) {
            setQuizzes(responseData.rData.items);
            console.log("Quizzes:", responseData.rData.items);
          } else {
            console.log("No quizzes data in response");
          }
        }
      } catch (error) {
        setError("Error fetching quizzes: " + error.message);
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizData({ title: quiz.title, description: quiz.no_of_questions, questions: quiz.questions });
    setIsEditing(true);
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      // Update Quiz Card
      const updateCardResponse = await axios.post('http://localhost:5164/updateCardQuiz', {
        addInfo: {
          quiz_card_id: selectedQuiz.id,
          title: quizData.title,
          no_of_questions: quizData.questions.length
        }
      });

      if (updateCardResponse.status !== 200) {
        throw new Error('Failed to update quiz card');
      }

      // Update each Quiz Question
      for (const question of quizData.questions) {
        const updateQuizResponse = await axios.post('http://localhost:5164/updateQuiz', {
          addInfo: {
            quiz_id: question.id, // Ensure each question has an id
            quiz_card_id: selectedQuiz.id,
            question: question.text,
            option1: question.options[0],
            option2: question.options[1],
            option3: question.options[2],
            option4: question.options[3],
            correct_answer: question.correctAnswer
          }
        });

        if (updateQuizResponse.status !== 200) {
          throw new Error('Failed to update quiz question');
        }
      }

      // Update local state
      const updatedQuizzes = quizzes.map(quiz =>
        quiz.id === selectedQuiz.id ? { ...quiz, ...quizData } : quiz
      );
      setQuizzes(updatedQuizzes);

      // Reset state and UI
      setIsEditing(false);
      setSelectedQuiz(null);
      setQuizData({ title: '', description: '', questions: [] });
      setError(null);

    } catch (error) {
      setError("Error saving changes: " + error.message);
      console.error("Error saving changes:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleEditQuestionChange = (index, field, value, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    if (field === 'options') {
      updatedQuestions[index].options[optionIndex] = value;
    } else {
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    }
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== questionIndex);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedQuiz(null);
    setQuizData({ title: '', description: '', questions: [] });
  };

  return (
    <div>
      <h2>Quiz Management</h2>
      {quizzes.map(quiz => (
        <div key={quiz.id}>
          <h3>{quiz.title}</h3>
          <p>Total Number of Questions : {quiz.no_of_questions}</p>
          <button onClick={() => handleEditQuiz(quiz)}>Edit</button>
          <button onClick={() => {
            if (window.confirm('Are you sure you want to delete this quiz?')) {
              handleDeleteQuiz(quiz.id);
            }
          }}>Delete</button>
        </div>
      ))}

      {isEditing && (
        <div>
          <h3>Edit Quiz</h3>
          <form onSubmit={handleSaveChanges}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={quizData.description} 
                onChange={handleChange}
                required
              />
            </div>

            {questionData.title && questionData.title.length > 0 ? (
              questionData.title.map((question, index) => (
              
                <div key={question.id}>
              
                  <h4>Question {index + 1}</h4>
                  <div>
                    <label>Question Text:</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleEditQuestionChange(index, 'text', e.target.value)}
                      required
                    />
                  </div>
                  {/* <div>
                    <label>Option 1:</label>
                    <input
                      type="text"
                      value={question.options[0]}
                      onChange={(e) => handleEditQuestionChange(index, 'options', e.target.value, 0)}
                      required
                    />
                  </div> */}
                  {/* <div>
                    <label>Option 2:</label>
                    <input
                      type="text"
                      value={question.options[1]}
                      onChange={(e) => handleEditQuestionChange(index, 'options', e.target.value, 1)}
                      required
                    />
                  </div>
                  <div>
                    <label>Option 3:</label>
                    <input
                      type="text"
                      value={question.options[2]}
                      onChange={(e) => handleEditQuestionChange(index, 'options', e.target.value, 2)}
                      required
                    />
                  </div>
                  <div>
                    <label>Option 4:</label>
                    <input
                      type="text"
                      value={question.options[3]}
                      onChange={(e) => handleEditQuestionChange(index, 'options', e.target.value, 3)}
                      required
                    />
                  </div>
                  <div>
                    <label>Correct Answer:</label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => handleEditQuestionChange(index, 'correctAnswer', e.target.value)}
                      required
                    />
                  </div> */}
                  <button type="button" onClick={() => handleDeleteQuestion(index)}>Delete Question</button>
                </div>
              ))
            ) : (
              <p>No questions available.</p>
            )}

            <button type="submit">Update Quiz</button>
            <button type="button" onClick={handleCancelEdit}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
