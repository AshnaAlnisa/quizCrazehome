import React, {useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminPage from './pages/AdminPage';
import UserDashboardPage from './pages/UserDashboardPage';
import QuizPage from './pages/QuizPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/Common/PrivateRoute';
import EditQuiz from './components/Admin/EditQuiz';

const AppRoutes = () => {
  const [quizzes, setQuizzes] = useState([]);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/admin" element={<PrivateRoute component={AdminPage} />} />
      <Route path="/dashboard" element={<PrivateRoute component={UserDashboardPage} />} />
      <Route path="/quiz/:id" element={<PrivateRoute component={QuizPage} />} />
      <Route path="/edit-quiz/:id" element={<EditQuiz quizzes={quizzes} setQuizzes={setQuizzes} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
