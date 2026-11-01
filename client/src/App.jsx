import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OAuthSuccess from './pages/OAuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { Construction } from 'lucide-react';

// Temporary Clean Placeholder Component for screens being built
const PlaceholderScreen = ({ name, description }) => (
  <div className="min-h-screen w-full bg-[#E3FDFD] text-slate-800 flex flex-col">
    {/* Keep the Navbar visible on protected screens */}
    <Navbar />

    <main className="flex-1 max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-white/90 backdrop-blur-md border border-[#A6E3E9] rounded-3xl p-10 max-w-md w-full shadow-lg shadow-[#71C9CE]/10 flex flex-col items-center">

        {/* Soft Aqua Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-[#CBF1F5] text-[#71C9CE] flex items-center justify-center mb-6 shadow-xs">
          <Construction className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 rounded-full bg-[#CBF1F5] text-[#71C9CE] text-xs font-bold uppercase tracking-wider mb-3">
          Coming Soon
        </span>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {name}
        </h2>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {description || "We are currently building this screen next."}
        </p>

        <Link
          to="/"
          className="text-sm font-semibold text-[#71C9CE] hover:text-[#5dbbc0] underline underline-offset-4 transition"
        >
          Return to Home
        </Link>
      </div>
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Screen 1: Public Landing & Auth Page */}
        <Route path="/" element={<LandingPage />} />

        {/* OAuth Redirect Handler */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Screen 2: Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PlaceholderScreen
                name="Student Dashboard"
                description="View your recent study sessions, generated quizzes, and performance analytics."
              />
            </ProtectedRoute>
          }
        />

        {/* Screen 3: Protected AI Chat Workspace */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <PlaceholderScreen
                name="AI Chat Workspace"
                description="Chat with Google Gemini 2.5 AI for personalized doubt-clearing and explanations."
              />
            </ProtectedRoute>
          }
        />

        {/* Screen 4: Protected Summary & Quiz Generator */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <PlaceholderScreen
                name="Quiz Generator"
                description="Paste study notes or text to generate instant practice multiple-choice quizzes."
              />
            </ProtectedRoute>
          }
        />

        {/* Screen 5: Protected User Profile & Settings */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PlaceholderScreen
                name="User Profile"
                description="Manage your account preferences and saved history."
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
