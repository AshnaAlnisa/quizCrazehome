import React from 'react';
import '../../styles/modal.css';

const Modal = ({ isOpen, onClose, correctAnswers, incorrectAnswers, score }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Quiz Results</h2>
        <p>Correct Answers: {correctAnswers}</p>
        <p>Incorrect Answers: {incorrectAnswers}</p>
        <p>Your Score: {score}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
