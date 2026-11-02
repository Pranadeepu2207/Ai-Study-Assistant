import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OAuthSuccess from './pages/OAuthSuccess';
import Dashboard from './pages/Dashboard';
import AIChatPage from './pages/AIChatPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // console.log(import.meta.env.VITE_BACKEND_URL);
  // console.log(import.meta.env.VITE_API_URL)
  return (
    <Router>
      <Routes>
        {/* Screen 1: Public Landing & Auth Page */}
        <Route path="/" element={<LandingPage />} />

        {/* OAuth Redirect Handler */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Screen 2: Protected Student Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Screen 3: Protected AI Chat Workspace */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AIChatPage />
            </ProtectedRoute>
          }
        />

        {/* Screen 4: Protected Summary & Quiz Generator */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        {/* Screen 5: Protected User Profile & Settings */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
