import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import StudyPlanner from './components/StudyPlanner';
import AiExplanations from './components/AiExplanations';
import QuizGenerator from './components/QuizGenerator';
import PastPapers from './components/PastPapers';
import FlashcardsMindmaps from './components/FlashcardsMindmaps';
import FocusTimer from './components/FocusTimer';
import YouTubeSummaries from './components/YouTubeSummaries';
import Subscriptions from './components/Subscriptions';
import AboutTeam from './components/AboutTeam';
import { User, BoardType } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addReward = (amount: number) => {
    if (user) {
        setUser({ ...user, coins: user.coins + amount });
    }
  };

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} />} />
          
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/study-planner" element={user ? <StudyPlanner board={user.board} /> : <Navigate to="/" />} />
          <Route path="/ai-explanations" element={user ? <AiExplanations board={user.board} /> : <Navigate to="/" />} />
          <Route path="/quiz-generator" element={user ? <QuizGenerator board={user.board} onReward={addReward} /> : <Navigate to="/" />} />
          <Route path="/past-papers" element={user ? <PastPapers board={user.board} /> : <Navigate to="/" />} />
          <Route path="/flashcards-mindmaps" element={user ? <FlashcardsMindmaps /> : <Navigate to="/" />} />
          <Route path="/focus-timer" element={user ? <FocusTimer /> : <Navigate to="/" />} />
          <Route path="/youtube-summaries" element={user ? <YouTubeSummaries /> : <Navigate to="/" />} />
          <Route path="/subscriptions" element={user ? <Subscriptions user={user} /> : <Navigate to="/" />} />
          <Route path="/about-team" element={user ? <AboutTeam /> : <Navigate to="/" />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
